// Integration checks against LOCAL Next dev + LOCAL D1 only. Never targets production.
import assert from 'node:assert/strict';
import { createHmac, randomBytes } from 'node:crypto';
import { getPlatformProxy } from 'wrangler';

const base = 'http://localhost:3000';
const proxy = await getPlatformProxy({ remoteBindings: false });
const db = proxy.env.DB;
const slug = `booking-test-${Date.now()}`;
const to64 = value => Buffer.from(JSON.stringify(value)).toString('base64url');
const head = `${to64({alg:'HS256',typ:'JWT'})}.${to64({userId:0,username:'local-booking-test',isSuperAdmin:true,exp:Date.now()+600000})}`;
const cookie = `emmal-session=${head}.${createHmac('sha256', proxy.env.ADMIN_SECRET).update(head).digest('base64url')}`;
const key = () => randomBytes(32).toString('hex');
const settings = {enabled:true,title:{en:'Summit access',ar:'حضور القمة'},description:{en:'Local test offer',ar:'عرض تجريبي'},buttonLabel:{en:'Book your seat',ar:'احجز الآن'},terms:{en:'Test only',ar:'تجريبي فقط'},amountMinor:150000000,currency:'IQD',capacity:2};
const data = {slug,name:'Booking Test',email:'test@example.com',phone:'+9647700000000',locale:'en',acceptedTerms:true};
async function api(path, {method='GET',body,token,admin=false,origin=base}={}) {
	const r=await fetch(base+path,{method,headers:{Origin:origin,...(admin?{Cookie:cookie}:{}),...(token?{Authorization:`Bearer ${token}`,'Idempotency-Key':token}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
	assert.ok(r.headers.get('content-type')?.includes('application/json'), `${method} ${path}: unexpected response ${r.status}`);
	return {status:r.status, data:await r.json()};
}
const checkout = token => api('/api/bookings/checkout',{method:'POST',body:data,token});
const mock = (id,token,status) => api('/api/payments/mock',{method:'POST',body:{id,status},token});
const set = config => api(`/api/ibs/editions/${slug}/booking`,{method:'PUT',body:config,admin:true});
try {
	await db.prepare("INSERT INTO ibs_editions(slug,year,status,title_en,title_ar,published) VALUES(?,2026,'upcoming','Test','تجربة',1)").bind(slug).run();
	assert.equal((await set(settings)).status,200,'admin config saves');
	assert.equal((await api(`/api/ibs/editions/${slug}/booking`)).status,401,'settings require auth');
	assert.equal((await api('/api/admin/bookings')).status,401,'customer list requires auth');
	assert.equal((await api('/api/bookings/checkout',{method:'POST',body:data,token:key(),origin:'https://example.net'})).status,403,'cross-origin blocked');
	assert.equal((await api('/api/bookings/checkout',{method:'POST',body:{...data,email:'invalid'},token:key()})).status,400,'invalid customer rejected');
	const firstToken=key();
	const concurrent=await Promise.all([checkout(firstToken),checkout(firstToken)]);
	assert.ok(concurrent.every(r=>r.status===200),JSON.stringify(concurrent));
	assert.equal(concurrent[0].data.booking.id,concurrent[1].data.booking.id,'idempotent checkout');
	const first=concurrent[0].data.booking;
	assert.equal(first.amountMinor,settings.amountMinor,'price comes from database');
	const manipulated=await api('/api/bookings/checkout',{method:'POST',body:{...data,amountMinor:1},token:firstToken});
	assert.equal(manipulated.data.booking.amountMinor,settings.amountMinor,'client price ignored');
	assert.equal((await api(`/api/bookings/${first.id}`,{token:key()})).status,404,'capability isolation');
	assert.equal((await api(`/api/bookings/${first.id}`)).status,404,'no public booking data');
	const t2=key(), t3=key();
	const capacityResults=await Promise.all([checkout(t2),checkout(t3)]);
	assert.deepEqual(capacityResults.map(r=>r.status).sort(),[200,409],'last seat protected concurrently');
	const secondIndex=capacityResults.findIndex(r=>r.status===200);
	const second=capacityResults[secondIndex].data.booking;
	const secondToken=[t2,t3][secondIndex];
	assert.equal((await mock(first.id,firstToken,'paid')).data.status,'paid','successful payment');
	assert.equal((await mock(first.id,firstToken,'paid')).data.status,'paid','duplicate webhook idempotent');
	assert.equal((await mock(first.id,firstToken,'failed')).data.status,'paid','late failure cannot undo payment');
	assert.equal((await mock(second.id,secondToken,'failed')).data.status,'failed','failed payment');
	const thirdToken=key(), third=await checkout(thirdToken);
	assert.equal(third.status,200,'failed payment releases seat');
	assert.equal((await mock(third.data.booking.id,thirdToken,'cancelled')).data.status,'cancelled','cancelled payment');
	const fourthToken=key(), fourth=await checkout(fourthToken);
	await db.prepare('UPDATE ibs_bookings SET expires_at=? WHERE id=?').bind(Date.now()-1000,fourth.data.booking.id).run();
	assert.equal((await api(`/api/bookings/${fourth.data.booking.id}`,{token:fourthToken})).data.status,'expired','hold expiry');
	assert.equal((await mock(fourth.data.booking.id,fourthToken,'paid')).data.status,'review','late payment requires review, never auto oversells');
	assert.equal((await set({...settings,enabled:false})).status,200);
	assert.equal((await checkout(key())).data.error,'booking_closed','hidden section rejects checkout');
	const admin=await api(`/api/admin/bookings?edition=${slug}`,{admin:true});
	assert.equal(admin.data.total,4);
	assert.ok(admin.data.bookings.every(b=>!('access_hash' in b)&&!('checkout_url' in b)),'admin response excludes capabilities');
	assert.equal((await api('/api/payments/webhook/bridge',{method:'POST',body:{status:'paid'}})).status,503,'unconfigured provider fails closed');
	console.log('PASS: checkout, auth, origin, validation, price integrity, idempotency, concurrent capacity, success/failure/cancel, late events, expiry, admin visibility and hidden-section enforcement.');
} finally {
	await db.batch([
		db.prepare('DELETE FROM ibs_payment_events WHERE booking_id IN (SELECT id FROM ibs_bookings WHERE edition_slug=?)').bind(slug),
		db.prepare('DELETE FROM ibs_bookings WHERE edition_slug=?').bind(slug),
		db.prepare('DELETE FROM ibs_booking_settings WHERE edition_slug=?').bind(slug),
		db.prepare('DELETE FROM ibs_editions WHERE slug=?').bind(slug),
	]);
	await proxy.dispose();
}
