// LOCAL only; no credentials are imported and every checkout requests the simulator.
import assert from 'node:assert/strict';
import { randomBytes,createHmac } from 'node:crypto';
import { getPlatformProxy } from 'wrangler';
const base='http://localhost:3000';
const proxy=await getPlatformProxy({remoteBindings:false});
const db=proxy.env.DB;
const slug=`tabadul-test-${Date.now()}`;
const token=()=>randomBytes(32).toString('hex');
const b64=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
const head=`${b64({alg:'HS256',typ:'JWT'})}.${b64({userId:0,username:'local-tabadul-qa',isSuperAdmin:true,exp:Date.now()+600000})}`;
const cookie=`emmal-session=${head}.${createHmac('sha256',proxy.env.ADMIN_SECRET).update(head).digest('base64url')}`;
const config={enabled:true,title:{en:'Tabadul simulation',ar:'محاكاة تبادل'},description:{en:'No charge',ar:'لا يوجد خصم'},buttonLabel:{en:'Try',ar:'جرّب'},terms:{en:'Simulation only',ar:'محاكاة فقط'},amountMinor:1000000,currency:'IQD',capacity:100};
const customer={slug,name:'Tabadul Preview Test',email:'tabadul-qa@example.com',phone:'+9647700000000',locale:'ar',acceptedTerms:true};
const testIP=`192.0.2.${1+Math.floor(Math.random()*253)}`;
async function api(path,{method='POST',body,key,mode='tabadul',origin=base,admin=false}={}) {
  const r=await fetch(base+path,{method,headers:{Origin:origin,'CF-Connecting-IP':testIP,'X-IBS-Payment-Preview':mode,...(admin?{Cookie:cookie}:{}),...(key?{Authorization:`Bearer ${key}`,'Idempotency-Key':key}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const data=await r.json(); return {status:r.status,data};
}
const checkout=(key,extra={})=>api('/api/bookings/checkout',{key,body:customer,...extra});
const verify=(id,key)=>api(`/api/bookings/${id}/verify-payment`,{key});
const simulate=(id,key,state)=>api('/api/payments/tabadul-preview',{key,body:{id,state}});
async function newBooking(){const key=token();const r=await checkout(key);assert.equal(r.status,200,JSON.stringify(r));return {id:r.data.booking.id,key};}
async function clearCooldown(id){await db.prepare('UPDATE ibs_tabadul_attempts SET check_after=0 WHERE booking_id=?').bind(id).run();}
try {
  await db.prepare("INSERT INTO ibs_editions(slug,year,status,title_en,title_ar,published) VALUES(?,2026,'upcoming','Temporary QA','اختبار مؤقت',1)").bind(slug).run();
  await db.prepare('INSERT INTO ibs_booking_settings(edition_slug,config_json,updated_at) VALUES(?,?,?)').bind(slug,JSON.stringify(config),Date.now()).run();
  assert.equal((await checkout(token(),{origin:'https://evil.example'})).status,403);
  assert.equal((await checkout(token(),{mode:'tabadul-real'})).status,401,'real requires local admin');
  assert.ok(['real_payment_locked','real_payment_not_allowed'].includes((await checkout(token(),{mode:'tabadul-real',admin:true})).data.error),'temporary fixture cannot access the real pilot, even when local credentials are installed');
  const first=await newBooking();
  const again=await checkout(first.key); assert.equal(again.data.booking.id,first.id); assert.equal(again.data.booking.provider,'tabadul-preview');
  assert.ok(again.data.checkoutUrl.startsWith(base+'/ar/booking/'),'fake checkout stays local');
  assert.equal((await api(`/api/bookings/${first.id}`,{method:'GET',key:token()})).status,404);
  assert.equal((await verify(first.id,token())).status,404);
  assert.equal((await simulate(first.id,token(),2)).status,404);
  assert.equal((await api(`/api/bookings/${first.id}/verify-payment`,{key:first.key,origin:'https://evil.example'})).status,403);
  assert.equal((await verify(first.id,first.key)).data.status,'pending');
  assert.equal((await verify(first.id,first.key)).data.verification,'cooldown');
  assert.equal((await simulate(first.id,first.key,1)).status,200);
  assert.equal((await verify(first.id,first.key)).data.status,'pending','authorization is not confirmed money');
  await simulate(first.id,first.key,2);
  const before=await api(`/api/bookings/${first.id}`,{method:'GET',key:first.key});
  assert.equal(before.data.status,'pending','fake gateway state alone does not update booking');
  assert.equal((await verify(first.id,first.key)).data.status,'paid');
  await clearCooldown(first.id); assert.equal((await verify(first.id,first.key)).data.status,'paid','replayed verification');
  assert.equal((await db.prepare('SELECT COUNT(*) n FROM ibs_payment_events WHERE booking_id=?').bind(first.id).first()).n,1);
  await simulate(first.id,first.key,6); assert.equal((await verify(first.id,first.key)).data.status,'paid','late decline cannot undo payment');
  await simulate(first.id,first.key,4); assert.equal((await verify(first.id,first.key)).data.status,'review','refund requires organizer reconciliation');
  for(const [state,expected] of [[6,'failed'],[3,'cancelled']]) {const b=await newBooking();await simulate(b.id,b.key,state);assert.equal((await verify(b.id,b.key)).data.status,expected);}
  const late=await newBooking();await db.prepare('UPDATE ibs_bookings SET expires_at=1 WHERE id=?').bind(late.id).run();await simulate(late.id,late.key,2);assert.equal((await verify(late.id,late.key)).data.status,'review');
  const concurrentKey=token();const concurrent=await Promise.all([checkout(concurrentKey),checkout(concurrentKey)]);
  assert.ok(concurrent.every(r=>r.status===200 || r.data.error==='gateway_registration_pending'),JSON.stringify(concurrent));
  const retried=await checkout(concurrentKey);assert.equal(retried.status,200);
  assert.equal((await db.prepare('SELECT COUNT(*) n FROM ibs_tabadul_attempts WHERE booking_id=?').bind(retried.data.booking.id).first()).n,1);
  const uncertain=await newBooking();
  await db.batch([db.prepare("UPDATE ibs_bookings SET provider_session=NULL,checkout_url=NULL WHERE id=?").bind(uncertain.id),db.prepare("UPDATE ibs_tabadul_attempts SET registration_state='uncertain',session_id=NULL,checkout_url=NULL WHERE booking_id=?").bind(uncertain.id)]);
  const blocked=await checkout(uncertain.key);assert.equal(blocked.data.error,'gateway_registration_pending');assert.equal(blocked.data.booking.id,uncertain.id,'tracking reference survives registration uncertainty');
  await clearCooldown(first.id);
  assert.equal((await api(`/api/admin/bookings/${first.id}/verify-payment`,{admin:true})).status,200,'admin can reconcile after customer closes tab');
  assert.equal((await api(`/api/admin/bookings/${first.id}/verify-payment`)).status,401);
  await db.prepare('UPDATE ibs_booking_settings SET config_json=? WHERE edition_slug=?').bind(JSON.stringify({...config,enabled:false}),slug).run();
  assert.equal((await checkout(token())).data.error,'booking_closed');
  console.log('PASS: local Tabadul preview, real-payment locks, origin/auth, registration idempotency/concurrency, cooldown, authorization/success/failure/cancel/refund/late-payment, admin reconciliation, hidden offer and uncertain-registration safety. No gateway network calls.');
} finally {
  await db.batch([
    db.prepare('DELETE FROM ibs_payment_events WHERE booking_id IN (SELECT id FROM ibs_bookings WHERE edition_slug=?)').bind(slug),
    db.prepare('DELETE FROM ibs_tabadul_attempts WHERE booking_id IN (SELECT id FROM ibs_bookings WHERE edition_slug=?)').bind(slug),
    db.prepare('DELETE FROM ibs_bookings WHERE edition_slug=?').bind(slug),
    db.prepare('DELETE FROM ibs_booking_settings WHERE edition_slug=?').bind(slug),
    db.prepare('DELETE FROM ibs_editions WHERE slug=?').bind(slug),
  ]);await proxy.dispose();
}
