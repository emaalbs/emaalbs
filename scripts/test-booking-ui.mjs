// Local-only UI verification. Leaves an explicitly labelled demo offer on the local first edition.
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { getPlatformProxy } from 'wrangler';
import puppeteer from 'puppeteer';

const base = 'http://localhost:3000';
const slug = '1st-edition-2025';
const proxy = await getPlatformProxy({remoteBindings:false});
const db = proxy.env.DB;
const to64 = value => Buffer.from(JSON.stringify(value)).toString('base64url');
const head = `${to64({alg:'HS256',typ:'JWT'})}.${to64({userId:0,username:'local-preview',isSuperAdmin:true,exp:Date.now()+600000})}`;
const token = `${head}.${createHmac('sha256',proxy.env.ADMIN_SECRET).update(head).digest('base64url')}`;
const demo = {enabled:true,title:{en:'Take your place at the summit.',ar:'احجز مكانك في القمة.'},description:{en:'Connect with decision-makers and be part of the conversation. This local demo includes one summit admission and access to the networking sessions.',ar:'التقِ بصنّاع القرار وكن جزءًا من الحوار. يشمل هذا المثال المحلي مقعدًا واحدًا في القمة وإمكانية حضور جلسات التواصل.'},buttonLabel:{en:'Reserve your seat',ar:'احجز مقعدك'},terms:{en:'LOCAL DEMO ONLY. This is an example offer, not an actual ticket sale. No money will be charged.',ar:'مثال تجريبي محلي فقط، وليس بيعًا فعليًا للتذاكر. لن يتم خصم أي مبلغ.'},amountMinor:150000000,currency:'IQD',capacity:100};
const existing = await db.prepare('SELECT config_json FROM ibs_booking_settings WHERE edition_slug=?').bind(slug).first();
let browser;
let bookingId;
try {
  if (!existing) await db.prepare('INSERT INTO ibs_booking_settings(edition_slug,config_json,updated_at) VALUES(?,?,?)').bind(slug,JSON.stringify(demo),Date.now()).run();
  await mkdir('.wrangler/booking-qa',{recursive:true});
  browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  const errors=[];
  page.on('pageerror', e=>errors.push(e.message));
  await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});
  await page.goto(`${base}/en/ibs/${slug}#booking`,{waitUntil:'networkidle2',timeout:90000});
  await page.waitForSelector('#booking');
  await page.$eval('#booking', e=>e.scrollIntoView({block:'center',behavior:'instant'}));
  await (await page.$('#booking')).screenshot({path:'.wrangler/booking-qa/desktop.png'});
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  await page.goto(`${base}/ar/ibs/${slug}#booking`,{waitUntil:'networkidle2',timeout:90000});
  await page.waitForSelector('#booking');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth+1),'mobile has no horizontal overflow');
  await (await page.$('#booking')).screenshot({path:'.wrangler/booking-qa/mobile-ar.png'});
  await page.click('#booking button');
  await page.type('#booking input[name=name]','Local UI Test');
  await page.type('#booking input[name=email]','ui-test@example.com');
  await page.type('#booking input[name=phone]','+9647700000000');
  await page.click('#booking input[name=terms]');
  await Promise.all([page.waitForNavigation({waitUntil:'networkidle2',timeout:60000}),page.click('#booking form button')]);
  bookingId=page.url().split('/').pop();
  assert.match(bookingId,/^[a-f0-9-]{36}$/);
  await page.waitForFunction(()=>document.body.innerText.includes('محاكاة النجاح'));
  await page.evaluate(()=>Array.from(document.querySelectorAll('button')).find(b=>b.innerText==='محاكاة النجاح').click());
  await page.waitForFunction(()=>document.body.innerText.includes('تم تأكيد حجزك'));
  await page.screenshot({path:'.wrangler/booking-qa/confirmed-ar.png',fullPage:true});
  await page.setCookie({name:'emmal-session',value:token,url:base,httpOnly:true,sameSite:'Strict'});
  await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});
  await page.goto(`${base}/admin/ibs/editions/${slug}#section-booking`,{waitUntil:'networkidle2',timeout:90000});
  await page.waitForSelector('#section-booking input[role=switch]:not(:disabled)');
  await (await page.$('#section-booking')).screenshot({path:'.wrangler/booking-qa/admin.png'});
  await page.click('#section-booking input[role=switch]');
  const saveSettings = async () => {
    const response = page.waitForResponse(r=>r.url().endsWith(`/api/ibs/editions/${slug}/booking`) && r.request().method()==='PUT');
    await page.evaluate(()=>Array.from(document.querySelectorAll('#section-booking button')).find(b=>b.innerText==='Save booking settings').click());
    assert.equal((await response).status(),200,'admin settings button saves');
    await page.waitForSelector('#section-booking input[role=switch]:not(:disabled)');
  };
  await saveSettings();
  const preview = await browser.newPage();
  await preview.goto(`${base}/en/ibs/${slug}`,{waitUntil:'domcontentloaded',timeout:90000});
  assert.equal(await preview.$('#booking'),null,'admin toggle hides public section');
  await preview.close();
  await page.click('#section-booking input[role=switch]');
  await saveSettings();
  await page.goto(`${base}/admin/bookings?edition=${slug}`,{waitUntil:'networkidle2',timeout:90000});
  await page.waitForFunction(()=>document.body.innerText.includes('Local UI Test'));
  await page.screenshot({path:'.wrangler/booking-qa/admin-bookings.png',fullPage:true});
  // Existing disabled edition stays unchanged.
  await page.goto(`${base}/en/ibs/iraq-business-summit-ports-2025`,{waitUntil:'networkidle2',timeout:90000});
  const ports = await db.prepare('SELECT config_json FROM ibs_booking_settings WHERE edition_slug=?').bind('iraq-business-summit-ports-2025').first();
  if (!ports || !JSON.parse(ports.config_json).enabled) assert.equal(await page.$('#booking'),null,'disabled offer is hidden');
  assert.deepEqual(errors,[],'no browser runtime errors');
  console.log('PASS: desktop English, mobile RTL/no overflow, guest form, simulated payment, confirmed result, admin settings/list, optional hidden edition. Local demo offer is ready at /en/ibs/1st-edition-2025#booking');
} finally {
  await db.prepare('UPDATE ibs_booking_settings SET config_json=? WHERE edition_slug=?').bind(existing?.config_json || JSON.stringify(demo),slug).run();
  if (bookingId && /^[a-f0-9-]{36}$/.test(bookingId)) await db.batch([
    db.prepare('DELETE FROM ibs_payment_events WHERE booking_id=?').bind(bookingId),
    db.prepare('DELETE FROM ibs_bookings WHERE id=? AND email=?').bind(bookingId,'ui-test@example.com')
  ]);
  await browser?.close();
  await proxy.dispose();
}
