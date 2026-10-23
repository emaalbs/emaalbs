// Production-path regression in isolated in-memory SQLite. NO real credentials,
// Cloudflare bindings or network. Fake gateway only; never run real registrations.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {webcrypto,randomBytes} from 'node:crypto';
import vm from 'node:vm';
import ts from 'typescript';
const sql=new DatabaseSync(':memory:');
sql.exec('PRAGMA foreign_keys=ON; CREATE TABLE ibs_editions(slug TEXT PRIMARY KEY,published INTEGER);');
for(const f of ['0020_edition_bookings.sql','0022_tabadul_attempts.sql','0023_payment_history_indexes.sql','0024_tabadul_gateway_order.sql','0025_public_payment_reconciliation.sql'])sql.exec(readFileSync('db/migrations/'+f,'utf8'));
const DB={prepare(query){let values=[];const stmt=()=>sql.prepare(query);return {bind(...v){values=v;return this;},async first(){return stmt().get(...values)||null;},async all(){return {results:stmt().all(...values)};},async run(){const r=stmt().run(...values);return {meta:{changes:Number(r.changes)}};},async execute(){if(stmt().columns().length)return {results:stmt().all(...values)};return this.run();}};},async batch(stmts){sql.exec('BEGIN');try{const results=[];for(const s of stmts)results.push(await s.execute());sql.exec('COMMIT');return results;}catch(e){sql.exec('ROLLBACK');throw e;}}};
const env={DB,PAYMENT_PROVIDER:'tabadul',PAYMENT_PUBLIC_ORIGIN:'https://emaalbs.com',TABADUL_LIVE_ENABLED:'true',TABADUL_USERNAME:'fake-only',TABADUL_PASSWORD:'fake-only',TABADUL_IQD_UNITS_PER_DINAR:'1000',TABADUL_PAID_STATUS:'2',TABADUL_CHECKOUT_HOSTS:'epg.tabadul.iq',PAYMENT_RECONCILE_SECRET:'test-reconciliation-secret-not-real-123456'};
const sessions=new Map();let registrations=0;let gatewayDown=false;
async function fakeFetch(url,opts){
 assert.ok(String(url).startsWith('https://epg.tabadul.iq/epg/rest/'),'External network blocked');
 if(gatewayDown)throw new Error('simulated outage');
 const f=new URLSearchParams(opts.body);assert.equal(f.get('userName'),'fake-only');
 if(String(url).endsWith('/register.do')){registrations++;const id='fake-session-'+registrations;sessions.set(id,{ErrorCode:'0',OrderStatus:0,OrderNumber:String(800000+registrations),Amount:Number(f.get('amount')),currency:f.get('currency'),Description:f.get('description')});assert.match(f.get('returnUrl'),/^https:\/\/emaalbs\.com\/(ar|en)\/booking\/[a-f0-9-]{36}$/);return Response.json({orderId:id,formUrl:'https://epg.tabadul.iq/checkout/'+id});}
 assert.ok(String(url).endsWith('/getOrderStatus.do'));assert.ok(sessions.has(f.get('orderId')));return Response.json(sessions.get(f.get('orderId')));
}
const cache=new Map();
function load(file){file=resolve(file);if(cache.has(file))return cache.get(file).exports;const m={exports:{}};cache.set(file,m);
 const require=name=>{
  if(name==='@/lib/cloudflare')return {getEnv:async()=>env};
  if(name==='@/lib/auth')return {requireAuth:async r=>{if(r.headers.get('cookie')!=='admin=test')throw new Error('Unauthorized');}};
  if(name==='next/server')throw new Error('Use native response in test');
  return load((name.startsWith('@/')?resolve('src',name.slice(2)):resolve(dirname(file),name))+'.ts');
 };
 vm.runInNewContext(ts.transpile(readFileSync(file,'utf8'),{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}),{module:m,exports:m.exports,require,URL,URLSearchParams,Request,Response,Headers,Date,Intl,TextEncoder,TextDecoder,Uint8Array,AbortSignal,crypto:webcrypto,fetch:fakeFetch,process:{env:{NODE_ENV:'production'}},console});return m.exports;
}
const checkout=load('src/app/api/bookings/checkout/route.ts').POST;
const statusRoute=load('src/app/api/bookings/[id]/route.ts').GET;
const verify=load('src/app/api/bookings/[id]/verify-payment/route.ts').POST;
const reconcile=load('src/app/api/internal/payments/reconcile/route.ts').POST;
const save=load('src/app/api/ibs/editions/[slug]/booking/route.ts').PUT;
const {defaultBookingConfig}=load('src/lib/booking-config.ts');
const offer={...defaultBookingConfig(),enabled:true,title:{en:'Seat',ar:'مقعد'},description:{en:'Summit admission',ar:'دخول القمة'},terms:{en:'Contact organizer for cancellation',ar:'تواصل مع المنظم للإلغاء'},amountMinor:250000000,capacity:3};
sql.prepare('INSERT INTO ibs_editions VALUES(?,1)').run('qa-public');
const origin='https://emaalbs.com';
const request=(path,body,extra={})=>new Request(origin+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...extra},body:JSON.stringify(body)});
const cfgRequest=c=>new Request(origin+'/api/ibs/editions/qa-public/booking',{method:'PUT',headers:{Origin:origin,'Content-Type':'application/json',cookie:'admin=test'},body:JSON.stringify(c)});
const cfgCtx={params:Promise.resolve({slug:'qa-public'})};
assert.equal((await save(cfgRequest({...offer,currency:'USD'}),cfgCtx)).status,400);
assert.equal((await save(cfgRequest({...offer,terms:{ar:'',en:''}}),cfgCtx)).status,400);
assert.equal((await save(cfgRequest(offer),cfgCtx)).status,200);
const body={slug:'qa-public',name:'Test Guest',email:'guest@example.invalid',phone:'0000000000',locale:'ar',acceptedTerms:true,amountMinor:1};
const token=randomBytes(32).toString('hex');
async function start(extra={},key=randomBytes(32).toString('hex')){const r=await checkout(request('/api/bookings/checkout',{...body,...extra},{'Idempotency-Key':key}));return {r,data:await r.json(),key};}
const first=await start({},token);assert.equal(first.r.status,200);assert.equal(first.data.booking.amountMinor,250000000);assert.equal(first.data.booking.provider,'tabadul');
const id=first.data.booking.id;const cookie=first.r.headers.get('set-cookie');assert.match(cookie,/HttpOnly/);assert.match(cookie,/Secure/);assert.match(cookie,/SameSite=Lax/);assert.ok(!first.data.checkoutUrl.includes(token));
const cookieHeader=cookie.split(';')[0];const ctx={params:Promise.resolve({id})};
assert.equal((await start({},token)).r.status,200);assert.equal(registrations,1,'Retry does not create another gateway order');
assert.equal((await start({name:'Changed'},token)).r.status,409);
assert.equal((await statusRoute(new Request(origin+'/api/bookings/'+id),ctx)).status,404);
assert.equal((await statusRoute(new Request(origin+'/api/bookings/'+id,{headers:{Cookie:cookieHeader}}),ctx)).status,200,'Guest survives new tab without sessionStorage');
const row=sql.prepare('SELECT * FROM ibs_bookings WHERE id=?').get(id);
const gateway=sessions.get(row.provider_session);gateway.OrderStatus=2;gateway.depositAmount=row.amount_minor;
const verifyReq=()=>request('/api/bookings/'+id+'/verify-payment',{}, {Cookie:cookieHeader});
const paid=await verify(verifyReq(),ctx);assert.equal(paid.status,200);assert.equal((await paid.json()).status,'paid');
sql.prepare('UPDATE ibs_tabadul_attempts SET check_after=0 WHERE booking_id=?').run(id);
await verify(verifyReq(),ctx);assert.equal(sql.prepare('SELECT COUNT(*) n FROM ibs_payment_events WHERE booking_id=?').get(id).n,1);
gateway.OrderStatus=6;gateway.ErrorCode='2';sql.prepare('UPDATE ibs_tabadul_attempts SET check_after=0 WHERE booking_id=?').run(id);
await verify(verifyReq(),ctx);assert.equal(sql.prepare('SELECT status FROM ibs_bookings WHERE id=?').get(id).status,'paid','Delayed decline cannot downgrade paid');
gateway.OrderStatus=2;gateway.ErrorCode='0';
// Background verification when the customer never returns.
const second=await start();assert.equal(second.r.status,200);const secondRow=sql.prepare('SELECT * FROM ibs_bookings WHERE id=?').get(second.data.booking.id);sessions.get(secondRow.provider_session).OrderStatus=2;
const cron=()=>request('/api/internal/payments/reconcile',{}, {Authorization:'Bearer '+env.PAYMENT_RECONCILE_SECRET});
assert.equal((await reconcile(request('/api/internal/payments/reconcile',{}))).status,401);
assert.equal((await reconcile(cron())).status,200);assert.equal(sql.prepare('SELECT status FROM ibs_bookings WHERE id=?').get(secondRow.id).status,'paid');
const third=await start();assert.equal(third.r.status,200);assert.equal((await start()).r.status,409,'Last seat protected');
const thirdRow=sql.prepare('SELECT * FROM ibs_bookings WHERE id=?').get(third.data.booking.id);
sessions.get(thirdRow.provider_session).OrderStatus=6;sessions.get(thirdRow.provider_session).ErrorCode='2';
await reconcile(cron());assert.equal(sql.prepare('SELECT status FROM ibs_bookings WHERE id=?').get(thirdRow.id).status,'failed');
const fourth=await start();assert.equal(fourth.r.status,200);const fourthRow=sql.prepare('SELECT * FROM ibs_bookings WHERE id=?').get(fourth.data.booking.id);
sql.prepare('UPDATE ibs_bookings SET expires_at=1 WHERE id=?').run(fourthRow.id);sessions.get(fourthRow.provider_session).OrderStatus=2;
await reconcile(cron());assert.equal(sql.prepare('SELECT status FROM ibs_bookings WHERE id=?').get(fourthRow.id).status,'review','Late money requires organizer review');
// Hidden offers stop new bookings without blocking existing receipts/verification.
await save(cfgRequest({...offer,enabled:false}),cfgCtx);assert.equal((await start()).r.status,409);
assert.equal((await statusRoute(new Request(origin+'/api/bookings/'+id,{headers:{Cookie:cookieHeader}}),ctx)).status,200);
assert.equal((await checkout(request('/api/bookings/checkout',body,{'Idempotency-Key':randomBytes(32).toString('hex'),'X-IBS-Payment-Preview':'tabadul'}))).status,503);
const before=registrations;
env.PAYMENT_CHECKOUTS_DISABLED='true';assert.equal((await start()).r.status,409);assert.equal(registrations,before);delete env.PAYMENT_CHECKOUTS_DISABLED;
// Failed status checks leave verified accounting untouched, record a safe error.
sql.prepare('UPDATE ibs_tabadul_attempts SET reconcile_after=0,check_after=0').run();gatewayDown=true;
const outage=await reconcile(cron());assert.equal(outage.status,200);assert.ok((await outage.json()).failed>0);assert.equal(sql.prepare('SELECT status FROM ibs_bookings WHERE id=?').get(id).status,'paid');
assert.ok(sql.prepare('SELECT verification_error FROM ibs_tabadul_attempts WHERE booking_id=?').get(id).verification_error);gatewayDown=false;
assert.equal(sql.prepare('PRAGMA foreign_key_check').all().length,0);
sql.close();
console.log('PASS: production guest checkout, server price, admin validation/toggle, canonical returns, secure cookie recovery, idempotency, capacity, identity-bound decline, paid-state guards, late-money review, protected background reconciliation, outage safety and pause. Isolated DB; fake gateway only.');
