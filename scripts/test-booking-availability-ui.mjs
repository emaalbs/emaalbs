// Local browser QA. No checkout requests, no DB writes, no external network.
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {createHmac} from 'node:crypto';
import {getPlatformProxy} from 'wrangler';
import puppeteer from 'puppeteer';
const base='http://localhost:3000',slug='booking-categories-preview',out='.wrangler/booking-availability-qa';
mkdirSync(out,{recursive:true});
const proxy=await getPlatformProxy({remoteBindings:false});
assert.equal(proxy.env.LOCAL_BOOKING_SIMULATION,'true');assert.equal(proxy.env.PAYMENT_CHECKOUTS_DISABLED,'true');
const b=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
const msg=b({alg:'HS256',typ:'JWT'})+'.'+b({userId:0,username:'local-ui-qa',isSuperAdmin:true,exp:Date.now()+600000});
const cookie=msg+'.'+createHmac('sha256',proxy.env.ADMIN_SESSION_SECRET||proxy.env.ADMIN_SECRET).update(msg).digest('base64url');
const browser=await puppeteer.launch({headless:true});
let remaining=1,availabilityFailure=false,interceptAvailability=true,savedConfig;
try {
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setCookie({name:'emmal-session',value:cookie,url:base,httpOnly:true});
 await page.setRequestInterception(true);page.on('request',r=>{
  if(r.url().startsWith('http')&&!r.url().startsWith(base+'/'))return void r.abort();
  if(r.url().includes('/api/admin/translate')||r.url().includes('/api/bookings/checkout'))return void r.abort();
  if(r.url().endsWith('/booking/availability')&&interceptAvailability)return void r.respond({status:availabilityFailure?503:200,contentType:'application/json',body:JSON.stringify(availabilityFailure?{error:'service_unavailable'}:{enabled:true,tiers:[{id:'guest',remaining},{id:'vip',remaining:null}]})});
  if(r.url().endsWith(`/api/ibs/editions/${slug}/booking`)&&r.method()==='PUT'){
   savedConfig=JSON.parse(r.postData());return void r.respond({status:200,contentType:'application/json',body:JSON.stringify(savedConfig)});
  }
  void r.continue();
 });
 await page.setViewport({width:1440,height:1000});
 await page.goto(`${base}/ar/ibs/${slug}#booking`,{waitUntil:'networkidle2',timeout:120000});
 await page.waitForFunction(()=>document.querySelector('[data-seats-for="guest"]')?.textContent.includes('1'),{timeout:60000});
 assert.equal(await page.$eval('[data-seats-for="vip"]',e=>e.textContent),'مقاعد غير محدودة');
 await page.$eval('#booking',e=>e.scrollIntoView());await page.screenshot({path:out+'/arabic-desktop.png'});
 await page.setViewport({width:390,height:844});await page.$eval('[data-seats-for="guest"]',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.screenshot({path:out+'/arabic-mobile.png'});
 remaining=0;await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
 await page.waitForFunction(()=>document.querySelector('[data-seats-for="guest"]')?.textContent==='نفدت المقاعد');
 assert.equal(await page.$eval('input[name="booking-tier"][value="guest"]',e=>e.disabled),true);
 assert.equal(await page.$eval('#booking button',e=>e.disabled),true);
 await page.click('input[name="booking-tier"][value="vip"]');assert.equal(await page.$eval('#booking button',e=>e.disabled),false);
 remaining=1;await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
 await page.waitForFunction(()=>!document.querySelector('input[name="booking-tier"][value="guest"]').disabled);
 availabilityFailure=true;await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
 await page.waitForFunction(()=>document.querySelector('[data-seats-for="guest"]')?.textContent==='تعذر تحديث عدد المقاعد');
 availabilityFailure=false;
 await page.goto(`${base}/en/ibs/${slug}#booking`,{waitUntil:'networkidle2',timeout:120000});
 await page.waitForFunction(()=>document.querySelector('[data-seats-for="guest"]')?.textContent==='Seats remaining: 1');
 assert.equal(await page.$eval('[data-seats-for="vip"]',e=>e.textContent),'Unlimited seats');
 // Check the real local endpoint once too; mocked states above never touch data.
 interceptAvailability=false;
 const actual=await page.evaluate(async slug=>{const r=await fetch(`/api/ibs/editions/${slug}/booking/availability`);return {status:r.status,data:await r.json()};},slug);
 assert.equal(actual.status,200);assert.equal(actual.data.enabled,true);assert.ok(actual.data.tiers.length>0);
 await page.goto(`${base}/admin/ibs/editions/${slug}#section-booking`,{waitUntil:'networkidle2',timeout:120000});
 await page.waitForSelector('[data-tier-editor="guest"] select:not(:disabled)',{timeout:60000});
 await page.select('[data-tier-editor="guest"] [data-seat-limit]','unlimited');
 assert.equal(await page.$eval('[data-tier-editor="guest"] [data-seat-capacity]',e=>e.disabled),true);
 await page.select('[data-tier-editor="vip"] [data-seat-limit]','limited');
 const capacity=await page.$('[data-tier-editor="vip"] [data-seat-capacity]');await capacity.click({clickCount:3});await capacity.type('5');
 for(const key of ['description-en','description-ar','terms-en','terms-ar']){
  const el=await page.$(`[data-booking-field="${key}"]`);assert.equal(await el.evaluate(e=>e.required),false);
  await el.click();await page.keyboard.down('Control');await page.keyboard.press('a');await page.keyboard.up('Control');await page.keyboard.press('Backspace');
 }
 const response=page.waitForResponse(r=>r.url().endsWith(`/api/ibs/editions/${slug}/booking`)&&r.request().method()==='PUT');
 await page.evaluate(()=>[...document.querySelectorAll('#section-booking button')].find(b=>b.textContent==='Save booking settings').click());
 assert.equal((await response).status(),200);assert.equal(savedConfig.tiers[0].capacity,null);assert.equal(savedConfig.tiers[1].capacity,5);
 assert.deepEqual(savedConfig.description,{en:'',ar:''});assert.deepEqual(savedConfig.terms,{en:'',ar:''});
 await page.setViewport({width:1440,height:1000});await page.$eval('[data-tier-editor="guest"]',e=>e.scrollIntoView());await page.screenshot({path:out+'/admin-capacity.png'});
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS: Arabic/English remaining counts, mobile width, unlimited, sold out blocking, focus refresh/released seat, error fallback, real read-only endpoint, admin limit modes and optional fields. No checkout or DB write.');
} finally {await browser.close();await proxy.dispose();}
