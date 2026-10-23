// Pure tests: no credentials loaded, no network calls and no database mutations.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const modules = new Map();
let mockFetch=()=>{throw new Error('NO NETWORK ALLOWED');};
const load = path => {
  if (modules.has(path)) return modules.get(path);
  const m = {exports:{}};
  vm.runInNewContext(ts.transpile(readFileSync(path,'utf8'),{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}), {
    module:m,exports:m.exports,require:()=>load('src/lib/booking-config.ts'),URL,URLSearchParams,Date,TextDecoder,AbortSignal,
    fetch:(...args)=>mockFetch(...args),Intl
  }); modules.set(path,m.exports); return m.exports;
};
const {createTabadulClient,tabadulAmount,tabadulOrderNumber,validateTabadulCheckout,tabadulHttpTransport}=load('src/lib/payments/tabadul-core.ts');
const config={userName:'test-only',password:'NOT-A-SECRET & +',iqdUnitsPerDinar:1000,paidStatus:2,checkoutHosts:['epg.tabadul.iq']};
const order={bookingId:'12345678-1234-1234-1234-123456789abc',amountMinor:1000000,currency:'IQD',title:'مقعد تجربة',locale:'ar',expiresAt:Date.now()+1200000,returnUrl:'http://localhost:3000/ar/booking/test'};
const session='test-session';
assert.equal(tabadulOrderNumber(order.bookingId).length,32);
assert.equal(tabadulAmount(1000000,'IQD',1000),1000000);
assert.equal(tabadulAmount(1000000,'IQD',100),100000);
assert.equal(tabadulAmount(1000000,'IQD',1),1000);
assert.throws(()=>tabadulAmount(1,'IQD',1));
assert.throws(()=>tabadulAmount(100,'USD',100));
for(const url of ['http://epg.tabadul.iq/pay','https://epg.tabadul.iq.evil.test/pay','https://epg.tabadul.iq@evil.test','javascript:alert(1)','https://epg.tabadul.iq:444/pay','https://name:secret@epg.tabadul.iq/pay']) assert.throws(()=>validateTabadulCheckout(url,config.checkoutHosts));
const register=createTabadulClient(config,async(op,fields)=>{
  assert.equal(op,'register.do'); assert.equal(fields.get('currency'),'368'); assert.equal(fields.has('currancy'),false);
  assert.equal(fields.get('password'),config.password); assert.equal(new URLSearchParams(fields.toString()).get('password'),config.password);
  assert.equal(fields.get('language'),'ar'); assert.equal(fields.get('amount'),'1000000'); assert.equal(fields.get('orderNumber').length,32);
  assert.ok(Number(fields.get('sessionTimeoutSecs'))<=1200);
  assert.equal(fields.has('PAN'),false); assert.equal(fields.has('bindingId'),false);
  return {orderId:session,formUrl:'https://epg.tabadul.iq/pay'};
});
assert.equal((await register.register(order)).sessionId,session);
await assert.rejects(()=>register.register({...order,expiresAt:1}));
await assert.rejects(()=>createTabadulClient(config,async()=>({errorCode:'1',formUrl:'https://epg.tabadul.iq/pay',orderId:session})).register(order));
const baseline={ErrorCode:'0',OrderStatus:2,currency:'368',OrderNumber:tabadulOrderNumber(order.bookingId),Amount:1000000,depositAmount:1000000};
const check=(override={},cfg=config)=>createTabadulClient(cfg,async(op,fields)=>{assert.equal(op,'getOrderStatus.do');assert.equal(fields.get('orderId'),session);return {...baseline,...override};}).status(order,session);
assert.equal((await check()).status,'paid');
assert.equal((await check({OrderStatus:1})).status,'pending');
assert.equal((await check({OrderStatus:1},{...config,paidStatus:1})).status,'paid');
assert.equal((await check({OrderStatus:0})).status,'pending');
assert.equal((await check({OrderStatus:3})).status,'cancelled');
assert.equal((await check({OrderStatus:4})).status,'refunded');
assert.equal((await check({OrderStatus:6})).status,'failed');
for(const bad of [{Amount:100},{Amount:undefined},{currency:'840'},{OrderNumber:'another-order'},{OrderNumber:undefined},{ErrorCode:undefined},{ErrorCode:'5'},{depositAmount:1},{OrderStatus:99},{OrderStatus:null},{Amount:'1e6'}]) await assert.rejects(()=>check(bad));
await assert.rejects(()=>tabadulHttpTransport('register.do',new URLSearchParams()),e=>e.code==='gateway_unavailable' && !e.message.includes(config.password));
console.log('PASS: Tabadul form encoding, fixed endpoint, order length, exact currency conversion, response identity/amount checks, status mapping, redirect allowlist, expiry and sanitized failures. No network used.');

// Exercise the actual HTTP transport with Workers-compatible fetch semantics.
const transportFields=new URLSearchParams({userName:config.userName,password:config.password});
let fetchCount=0;
for(const operation of ['register.do','getOrderStatus.do']) {
  mockFetch=async(url,options)=>{
    fetchCount++;
    assert.equal(url,`https://epg.tabadul.iq/epg/rest/${operation}`);
    assert.equal(options.redirect,'manual','Workers rejects error mode; follow would leak credentials on redirects');
    assert.equal(options.method,'POST');assert.equal(options.cache,'no-store');
    assert.equal(new URLSearchParams(options.body).get('password'),config.password);
    return Response.json({ok:true});
  };
  assert.equal((await tabadulHttpTransport(operation,transportFields)).ok,true);
}
for(const status of [301,302,303,307,308]) {
  mockFetch=async(_url,options)=>{
    fetchCount++;assert.equal(options.redirect,'manual');
    return new Response('{"ok":true}',{status,headers:{Location:'https://untrusted.example/collect','Content-Type':'application/json'}});
  };
  const before=fetchCount;
  await assert.rejects(()=>tabadulHttpTransport('register.do',transportFields),e=>e.code==='gateway_unavailable');
  assert.equal(fetchCount,before+1,'No redirect follow or registration retry');
}
for(const response of [new Response('unavailable',{status:503}),new Response('<html>not JSON</html>'),new Response('invalid',{headers:{'Content-Type':'application/json'}}),Response.json([]),Response.json(null)]) {
  mockFetch=async()=>response;
  await assert.rejects(()=>tabadulHttpTransport('getOrderStatus.do',transportFields),e=>e.code==='gateway_unavailable');
}
mockFetch=()=>{throw new Error('NO NETWORK ALLOWED');};
console.log('PASS: real HTTP transport supports Workers, rejects every redirect without following or retrying, and rejects invalid/error responses. No network used.');

// Exercise the actual preview/real-money gate with injected env only; never load real secrets.
function providerModule(nodeEnv,env={},authorized=true) {
  const m={exports:{}};
  vm.runInNewContext(ts.transpile(readFileSync('src/lib/payments/tabadul.ts','utf8'),{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}),{
    module:m,exports:m.exports,URL,Date,process:{env:{NODE_ENV:nodeEnv}},
    require:name=>{
      if(name==='@/lib/cloudflare') return {getEnv:async()=>env};
      if(name==='@/lib/auth') return {requireAuth:async()=>{if(!authorized)throw new Error('Unauthorized');}};
      if(name==='../booking-config') return load('src/lib/booking-config.ts');
      if(name==='./tabadul-core') return load('src/lib/payments/tabadul-core.ts');
      if(name==='./public-policy') return load('src/lib/payments/public-policy.ts');
      if(name==='./core') return {isLocalPaymentTest:(url,mode)=>mode==='development'&&['localhost','127.0.0.1','[::1]'].includes(new URL(url).hostname)};
      if(name==='../bookings') return {};
      throw new Error('Unexpected dependency: '+name);
    },
  }); return m.exports;
}
for(const [env,url] of [['production','http://localhost:3000'],['development','https://emaalbs.com'],['development','http://192.168.1.10:3000']]) {
  for(const real of [false,true]) await assert.rejects(()=>providerModule(env).tabadulProvider({url},real),e=>e.code==='payments_unavailable');
}
const local={url:'http://localhost:3000/api/bookings/checkout'};
assert.equal((await providerModule('development').tabadulProvider(local)).name,'tabadul-preview');
await assert.rejects(()=>providerModule('development',{},false).tabadulProvider(local,true));
await assert.rejects(()=>providerModule('development').tabadulProvider(local,true),e=>e.code==='real_payment_locked');
const confirmed={TABADUL_LIVE_ENABLED:'true',TABADUL_PILOT_ACKNOWLEDGED:'true',TABADUL_USERNAME:'fake-test',TABADUL_PASSWORD:'fake-test',TABADUL_IQD_UNITS_PER_DINAR:'1000',TABADUL_PAID_STATUS:'2',TABADUL_CHECKOUT_HOSTS:'epg.tabadul.iq',TABADUL_TEST_EDITION:'dedicated-test'};
for(const key of Object.keys(confirmed)) await assert.rejects(()=>providerModule('development',{...confirmed,[key]:undefined}).tabadulProvider(local,true));
await assert.rejects(()=>providerModule('development',{...confirmed,TABADUL_CHECKOUT_HOSTS:'evil.test'}).tabadulProvider(local,true));
const pilot=await providerModule('development',confirmed).tabadulProvider(local,true);
const offer={slug:'dedicated-test',amountMinor:1000000,currency:'IQD',realPaymentConsent:true};
pilot.validateOffer(offer);
for(const bad of [{amountMinor:1000001},{currency:'USD'},{slug:'other'},{realPaymentConsent:false}]) assert.throws(()=>pilot.validateOffer({...offer,...bad}));
console.log('PASS: actual gate rejects production/LAN/public preview, missing confirmations/credentials, non-admin real tests, wrong edition/currency, missing consent and amounts above IQD 1,000.');

const assigned={ErrorCode:'0',OrderStatus:0,Amount:1000000,currency:'368',OrderNumber:'15640000',Description:order.title};
assert.equal(await createTabadulClient(config,async()=>assigned).inspectRegisteredOrder(order,session),'15640000');
for(const bad of [{OrderStatus:2},{OrderStatus:1},{Description:'another order'},{Amount:1000},{currency:'840'},{OrderNumber:''},{ErrorCode:'6'}])await assert.rejects(()=>createTabadulClient(config,async()=>({...assigned,...bad})).inspectRegisteredOrder(order,session));
assert.equal((await createTabadulClient(config,async()=>({...assigned,OrderStatus:2})).status({...order,gatewayOrderNumber:'15640000'},session)).status,'paid');
await assert.rejects(()=>createTabadulClient(config,async()=>({...assigned,OrderStatus:2})).status({...order,gatewayOrderNumber:'different'},session));
console.log('PASS: provider-generated order number pinned only from an authenticated unpaid response with matching description/amount/currency; subsequent mismatch rejected.');

assert.equal((await check({ErrorCode:'2',OrderStatus:6})).status,'failed');
for(const bad of [{ErrorCode:'2',OrderStatus:2},{ErrorCode:'2',OrderStatus:6,Amount:99},{ErrorCode:'2',OrderStatus:6,OrderNumber:'wrong'},{ErrorCode:'2',OrderStatus:6,currency:'840'}]) await assert.rejects(()=>check(bad));
const prod={...confirmed,PAYMENT_PROVIDER:'tabadul',PAYMENT_PUBLIC_ORIGIN:'https://emaalbs.com'};
const req={url:'https://emaalbs.com/api/bookings/checkout',headers:new Headers()};
const pub=await providerModule('production',prod,false).tabadulProvider(req,true,true);
pub.validateOffer({...offer,slug:'any-real-edition',amountMinor:250000000,realPaymentConsent:false});
assert.equal(pub.returnOrigin,'https://emaalbs.com');
for(const url of ['http://emaalbs.com','https://www.emaalbs.com','https://other.test']) await assert.rejects(()=>providerModule('production',prod,false).tabadulProvider({...req,url},true,true));
await assert.rejects(()=>providerModule('production',prod,false).tabadulProvider({...req,headers:new Headers({'X-IBS-Payment-Preview':'tabadul-real'})},true,true));
for(const key of ['PAYMENT_PROVIDER','PAYMENT_PUBLIC_ORIGIN','TABADUL_USERNAME','TABADUL_PASSWORD','TABADUL_LIVE_ENABLED','TABADUL_IQD_UNITS_PER_DINAR','TABADUL_PAID_STATUS','TABADUL_CHECKOUT_HOSTS']) await assert.rejects(()=>providerModule('production',{...prod,[key]:undefined},false).tabadulProvider(req,true,true));
console.log('PASS: production guest checkout permits administrator-defined IQD prices/editions, requires canonical origin and server config; preview bypass rejected; documented decline code remains identity-bound.');
