// LOCAL browser checks only. Refuse every gateway request; clean only our own dummy bookings.
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {mkdir} from 'node:fs/promises';
import {getPlatformProxy} from 'wrangler';
import puppeteer from 'puppeteer';
const base='http://localhost:3000',slug='tabadul-payment-preview';
const proxy=await getPlatformProxy({remoteBindings:false});const db=proxy.env.DB;
const email=`tabadul-ui-${Date.now()}@example.com`;
const b64=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
const head=`${b64({alg:'HS256',typ:'JWT'})}.${b64({userId:0,username:'local-tabadul-ui',isSuperAdmin:true,exp:Date.now()+600000})}`;
const adminToken=`${head}.${createHmac('sha256',proxy.env.ADMIN_SECRET).update(head).digest('base64url')}`;
let browser;const ids=[];const errors=[];const gatewayRequests=[];
try {
  await mkdir('.wrangler/tabadul-qa',{recursive:true});
  browser=await puppeteer.launch({headless:true});
  const page=await browser.newPage();page.setDefaultTimeout(60000);
  await page.setRequestInterception(true);
  page.on('request',r=>{if(new URL(r.url()).hostname.endsWith('tabadul.iq')) {gatewayRequests.push(r.url().split('?')[0]);void r.abort();} else void r.continue();});
  page.on('pageerror',e=>errors.push(e.message));
  for(const [locale,width] of [['en',1440],['ar',390]]) {
    await page.setViewport({width,height:960,deviceScaleFactor:1});
    await page.goto(`${base}/${locale}/ibs/${slug}?paymentPreview=tabadul#booking`,{waitUntil:'networkidle2',timeout:90000});
    await page.waitForFunction(()=>document.querySelector('#booking [role=status]')?.textContent?.includes('Tabadul') || document.querySelector('#booking [role=status]')?.textContent?.includes('تبادل'));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow');
    await (await page.$('#booking')).screenshot({path:`.wrangler/tabadul-qa/offer-${locale}.png`});
    await page.$eval('#booking button',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
    await page.click('#booking button');
    await page.waitForSelector('#booking input[name=name]',{visible:true});
    await page.type('#booking input[name=name]','Local Tabadul UI');await page.type('#booking input[name=email]',email);await page.type('#booking input[name=phone]','+9647700000000');await page.click('#booking input[name=terms]');
    await page.$eval('#booking form button',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
    await Promise.all([page.waitForNavigation({waitUntil:'networkidle2',timeout:90000}),page.click('#booking form button')]);
    const id=new URL(page.url()).pathname.split('/').pop();assert.match(id,/^[a-f0-9-]{36}$/);ids.push(id);
    const success=locale==='ar'?'محاكاة النجاح':'Simulate success';
    await page.waitForFunction(t=>document.body.innerText.includes(t),{},success);
    assert.equal(await page.$('input[type=password],input[autocomplete=cc-number]'),null);
    await page.screenshot({path:`.wrangler/tabadul-qa/status-${locale}.png`,fullPage:true});
    await page.evaluate(t=>Array.from(document.querySelectorAll('button')).find(x=>x.innerText===t).click(),success);
    await page.waitForFunction(t=>document.body.innerText.includes(t),{},locale==='ar'?'تم تأكيد حجزك':'Your booking is confirmed');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:`.wrangler/tabadul-qa/paid-${locale}.png`,fullPage:true});
  }
  await page.setCookie({name:'emmal-session',value:adminToken,url:base,httpOnly:true,sameSite:'Strict'});
  await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});
  await page.goto(`${base}/admin/bookings?edition=${slug}`,{waitUntil:'networkidle2',timeout:90000});
  await page.waitForFunction(()=>document.body.innerText.includes('tabadul-preview'));
  await page.click('details summary');
  await page.evaluate(id=>{const row=Array.from(document.querySelectorAll('details div')).find(e=>e.querySelector('p.font-mono')?.textContent===id && e.querySelectorAll('button').length===1);row.querySelector('button').click();},ids[0]);
  await page.waitForSelector('[role=status]');
  await page.screenshot({path:'.wrangler/tabadul-qa/admin.png',fullPage:true});
  // A live-money URL must display an explicit warning/consent, but DO NOT submit it.
  await page.goto(`${base}/ar/ibs/${slug}?paymentPreview=tabadul-real#booking`,{waitUntil:'networkidle2',timeout:90000});
  await page.waitForFunction(()=>document.querySelector('#booking [role=status]')?.textContent?.includes('دفع فعلي'));
  await page.$eval('#booking button',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
  await page.click('#booking button');
  await page.waitForSelector('input[name=realPaymentConsent]');
  assert.ok(await page.$('input[name=realPaymentConsent][required]'),'real-money warning and consent present');
  assert.equal(gatewayRequests.length,0,'never contacted Tabadul');assert.deepEqual(errors,[]);
  console.log('PASS: EN desktop, AR mobile/no overflow, simulator booking flow and confirmation, no card inputs, admin verification and real-money warning. No gateway calls.');
} finally {
  await browser?.close();
  await db.batch([
    db.prepare('DELETE FROM ibs_payment_events WHERE booking_id IN (SELECT id FROM ibs_bookings WHERE edition_slug=? AND email=?)').bind(slug,email),
    db.prepare('DELETE FROM ibs_tabadul_attempts WHERE booking_id IN (SELECT id FROM ibs_bookings WHERE edition_slug=? AND email=?)').bind(slug,email),
    db.prepare('DELETE FROM ibs_bookings WHERE edition_slug=? AND email=?').bind(slug,email),
  ]);await proxy.dispose();
}
