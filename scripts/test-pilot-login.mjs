// Local UI regression: no login bypass, no gateway requests and no bookings created.
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
const browser=await puppeteer.launch({headless:true});
try{
 const page=await browser.newPage();let checkoutRequests=0,simulateExpiredSession=false;
 await page.setRequestInterception(true);
 page.on('request',r=>{
  const u=new URL(r.url());
  if(u.hostname==='tabadul.iq'||u.hostname.endsWith('.tabadul.iq'))return void r.abort();
  if(u.pathname==='/api/bookings/checkout')checkoutRequests++;
  // Simulate expiry between successful preflight and POST. Server still sees NO cookie.
  if(simulateExpiredSession&&u.pathname==='/api/admin/me')return void r.respond({status:200,contentType:'application/json',body:'{}'});
  void r.continue();
 });
 await page.setViewport({width:1280,height:900});
 await page.goto('http://localhost:3000/ar/ibs/tabadul-live-pilot?paymentPreview=tabadul-real#booking',{waitUntil:'networkidle2',timeout:90000});
 await page.waitForFunction(()=>document.querySelector('#booking a[href="/admin/login"]'));
 await page.$eval('#booking button',e=>e.scrollIntoView({block:'center',behavior:'instant'}));await page.click('#booking button');
 await page.type('input[name=name]','Login regression test');await page.type('input[name=email]','login-qa@example.invalid');await page.type('input[name=phone]','07700000000');
 await page.click('input[name=terms]');await page.click('input[name=realPaymentConsent]');
 await page.$eval('#booking form',f=>f.requestSubmit());
 await page.waitForFunction(()=>document.querySelector('#booking [role=alert]')?.textContent?.includes('الأدمن المحلي'));
 assert.equal(checkoutRequests,0,'unauthenticated preflight must prevent checkout');
 assert.equal(await page.$eval('input[name=name]',e=>e.value),'Login regression test');
 assert.ok(await page.$('#booking form a[href="/admin/login"][target="_blank"]'));
 simulateExpiredSession=true;
 const response=page.waitForResponse(r=>r.url().endsWith('/api/bookings/checkout'));
 await page.$eval('#booking form',f=>f.requestSubmit());assert.equal((await response).status(),401);
 await page.waitForFunction(()=>document.querySelector('#booking [role=alert]')?.textContent?.includes('الأدمن المحلي'));
 assert.equal(checkoutRequests,1);assert.equal(await page.$eval('input[name=email]',e=>e.value),'login-qa@example.invalid');
 await page.$eval('#booking [role=alert]',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
 await page.screenshot({path:'.wrangler/tabadul-qa/pilot-login-required.png'});
 console.log('PASS: missing admin session is explained, login opens separately, form is preserved, preflight prevents checkout, and server rejects an expired-session race. No gateway calls or bookings created.');
}finally{await browser.close();}
