// UI fixtures only. All payment API requests are intercepted; no gateway or DB writes.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import puppeteer from 'puppeteer';
const base=process.argv.includes('--live')?'https://emaalbs.com':'http://localhost:3000';
const id='11111111-1111-4111-8111-111111111111',child='22222222-2222-4222-8222-222222222222';
const fixture={id,editionSlug:'qa-ui',title:JSON.stringify({en:'Summit seat',ar:'مقعد في القمة'}),tierName:JSON.stringify({en:'Guest',ar:'ضيف'}),amountMinor:1000000,currency:'IQD',status:'failed',provider:'tabadul'};
let status='failed',unavailable=false,retries=0;const errors=[];
const browser=await puppeteer.launch({headless:true});
try{
 const page=await browser.newPage();page.setDefaultTimeout(60000);
 await page.setRequestInterception(true);
 page.on('request',r=>{
  const url=new URL(r.url());
  if(url.hostname.endsWith('tabadul.iq')){errors.push('Unexpected gateway request');return void r.abort();}
  if(url.origin===base && url.pathname.startsWith('/api/bookings/')){
   const current=url.pathname.includes(child)?{...fixture,id:child,status:'pending'}:{...fixture,status};
   let data=current,code=200;
   if(url.pathname.endsWith('/receipt')){code=503;data={error:'fixture_no_receipt'};}
   if(url.pathname.endsWith('/verify-payment')){
    if(unavailable){code=502;data={error:'gateway_unavailable'};}
    else data={...current,verification:'checked',gatewayState:current.status==='failed'?6:0,retryAllowed:current.status==='failed'};
   }
   if(url.pathname.endsWith('/retry-payment')){retries++;data={booking:{...fixture,id:child,status:'pending'},checkoutUrl:base+'/ar/booking/'+child};}
   return void r.respond({status:code,contentType:'application/json',body:JSON.stringify(data)});
  }
  // Cloudflare telemetry/bot checks are expected only on live. Block them too,
  // but distinguish these background requests from an unexpected application write.
  if(r.method()!=='GET' && url.pathname.startsWith('/cdn-cgi/'))return void r.abort();
  if(r.method()!=='GET'){errors.push('Unexpected mutation');return void r.abort();}
  void r.continue();
 });
 page.on('pageerror',e=>errors.push(e.message));
 await mkdir('.wrangler/retry-qa',{recursive:true});
 for(const [locale,width] of [['ar',390],['en',1440]]){
  await page.setViewport({width,height:1050,deviceScaleFactor:1});
  await page.goto(`${base}/${locale}/booking/${id}`,{waitUntil:'domcontentloaded',timeout:120000});
  const label=locale==='ar'?'إعادة محاولة الدفع':'Retry payment';
  await page.waitForFunction(t=>[...document.querySelectorAll('button')].some(b=>b.innerText===t),{},label);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Responsive width');
  assert.ok(await page.evaluate(()=>document.body.innerText.includes('Payment is declined')),'Decline reason visible');
  await page.screenshot({path:`.wrangler/retry-qa/declined-${locale}.png`,fullPage:true});
 }
 await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.innerText==='Retry payment').click());
 await page.waitForFunction(child=>location.pathname.endsWith(child),{},child);assert.equal(retries,1);
 for(const s of ['pending','review','paid','expired']){
  status=s;await page.goto(`${base}/ar/booking/${id}`,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.body.innerText.includes('مقعد في القمة'));
  assert.equal(await page.evaluate(()=>[...document.querySelectorAll('button')].some(b=>b.innerText==='إعادة محاولة الدفع')),false,s+' has no retry');
 }
 status='failed';unavailable=true;await page.goto(`${base}/ar/booking/${id}`,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.body.innerText.includes('تعذر التحقق من شركة الدفع الآن'));
 assert.equal(await page.evaluate(()=>[...document.querySelectorAll('button')].some(b=>b.innerText==='إعادة محاولة الدفع')),false,'Gateway outage has no retry');
 assert.ok(await page.evaluate(()=>document.body.innerText.includes('لا تكرر الدفع')));
 assert.deepEqual(errors,[]);
 console.log('PASS: Arabic mobile and English desktop reason/retry UI, responsive layout, new attempt navigation, no retry on uncertain/paid/review/expired states or gateway outage. Intercepted fixtures only.');
}finally{await browser.close();}
