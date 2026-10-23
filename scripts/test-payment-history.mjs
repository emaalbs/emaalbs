// LOCAL history tests. Synthetic records are isolated and removed; NO gateway calls.
import assert from 'node:assert/strict';
import {randomUUID,createHmac} from 'node:crypto';
import {getPlatformProxy} from 'wrangler';
import puppeteer from 'puppeteer';
const base='http://localhost:3000', slug=`history-qa-${Date.now()}`;
const proxy=await getPlatformProxy({remoteBindings:false}),db=proxy.env.DB;
const b64=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
const h=`${b64({alg:'HS256',typ:'JWT'})}.${b64({userId:0,username:'local-history-qa',isSuperAdmin:true,exp:Date.now()+600000})}`;
const value=`${h}.${createHmac('sha256',proxy.env.ADMIN_SECRET).update(h).digest('base64url')}`,cookie=`emmal-session=${value}`;
let browser;
async function get(params='',auth=true){const r=await fetch(`${base}/api/admin/payments${params}`,{headers:auth?{Cookie:cookie}:{}});return {status:r.status,data:await r.json(),cache:r.headers.get('cache-control')};}
const created=Date.parse('2026-10-22T22:30:00Z'); // 23 October in Baghdad
async function booking({currency='IQD',amount=1000000,status='paid',provider='tabadul',event='paid',expired=false}={}){
 const id=randomUUID();
 await db.prepare(`INSERT INTO ibs_bookings(id,edition_slug,offer_title,customer_name,email,phone,locale,amount_minor,currency,status,provider,access_hash,request_hash,terms_snapshot,expires_at,created_at,updated_at) VALUES(?,?,?,'اختبار سجل مؤقت',?,'000000','ar',?,?,?,?,?,?,?, ?,?,?)`).bind(id,slug,'{}',`${slug}@example.invalid`,amount,currency,status,provider,id,id,'{}',expired?1:Date.now()+600000,created,created).run();
 if(event)await db.prepare('INSERT INTO ibs_payment_events(provider,event_id,booking_id,status,received_at) VALUES(?,?,?,?,?)').bind(provider,randomUUID(),id,event,created+60000).run();
 return id;
}
try{
 await db.prepare("INSERT INTO ibs_editions(slug,year,status,title_en,title_ar,published) VALUES(?,2026,'upcoming','Temporary history test','اختبار مؤقت',1)").bind(slug).run();
 const first=await booking();for(let i=0;i<25;i++)await booking();
 await booking({currency:'USD',amount:2500});
 await booking({provider:'tabadul-preview',amount:9000000});
 await booking({status:'pending',event:null});await booking({status:'pending',event:null,expired:true});
 await booking({status:'review'});await booking({status:'review',event:'refunded'});
 await booking({event:null}); // legacy/unverified 'paid' must NOT inflate totals
 assert.equal((await get('',false)).status,401);
 for(const query of ['?mode=bad','?page=-1','?from=2026-02-30','?from=2026-11-01&to=2026-10-01'])assert.equal((await get(query)).status,400);
 const filter=`?edition=${slug}`;
 const all=await get(filter);assert.equal(all.status,200);assert.ok(all.cache.includes('no-store'));assert.equal(all.data.total,32);assert.equal(all.data.payments.length,25);
 const iqd=all.data.summary.find(s=>s.currency==='IQD'),usd=all.data.summary.find(s=>s.currency==='USD');
 assert.equal(iqd.confirmed_minor,26000000);assert.equal(iqd.confirmed_count,26);assert.equal(iqd.pending_count,1);assert.equal(iqd.review_count,3);assert.equal(usd.confirmed_minor,2500);
 assert.equal((await get(filter+'&page=2')).data.payments.length,7);
 assert.equal((await get(filter+'&page=2')).data.summary[0].confirmed_minor,26000000);
 assert.equal((await get(filter+'&mode=simulation')).data.total,1);
 assert.equal((await get(filter+'&status=expired')).data.total,1);
 assert.equal((await get(filter+'&status=refund_reported')).data.total,1);
 assert.equal((await get(filter+'&from=2026-10-23&to=2026-10-23')).data.total,32);
 assert.equal((await get(filter+'&from=2026-10-22&to=2026-10-22')).data.total,0);
 assert.equal((await get(filter+'&q='+first)).data.total,1);
 assert.equal((await get(filter+'&q=%25')).data.total,0,'literal search, no wildcard matching');
 for(const row of all.data.payments)for(const key of ['access_hash','request_hash','checkout_url'])assert.equal(key in row,false);
 const detail=await get('/'+first);assert.equal(detail.data.events.length,1);assert.equal((await get('/'+first,false)).status,401);
 browser=await puppeteer.launch({headless:true});const page=await browser.newPage();
 await page.setCookie({name:'emmal-session',value,url:base,httpOnly:true});await page.setViewport({width:1440,height:1000});
 await page.goto(base+'/admin/payments',{waitUntil:'networkidle2',timeout:90000});
 await page.waitForFunction(()=>document.body.innerText.includes('سجل المدفوعات'));
 await page.type('input[placeholder="اسم الشخص أو رقم الحجز"]',slug);
 await page.$eval('form',f=>f.requestSubmit());
 await page.waitForFunction(()=>document.body.innerText.includes('32 نتيجة'));
 await page.screenshot({path:'.wrangler/tabadul-qa/payment-history-desktop.png',fullPage:true});
 const button=await page.$('tbody button');await button.click();await page.waitForFunction(()=>document.body.innerText.includes('تفاصيل')&&document.querySelector('ol'));
 await page.setViewport({width:390,height:844});await page.screenshot({path:'.wrangler/tabadul-qa/payment-history-mobile.png',fullPage:true});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'mobile page overflow');
 console.log('PASS: history auth, safe fields, real/simulation separation, totals across pagination, currency separation, verified-only totals, refunds/reviews, Baghdad dates, search, detail timeline and desktop/mobile UI. No gateway calls.');
}finally{
 if(browser)await browser.close();
 await db.batch([db.prepare('DELETE FROM ibs_payment_events WHERE booking_id IN (SELECT id FROM ibs_bookings WHERE edition_slug=?)').bind(slug),db.prepare('DELETE FROM ibs_bookings WHERE edition_slug=?').bind(slug),db.prepare('DELETE FROM ibs_editions WHERE slug=?').bind(slug)]);await proxy.dispose();
}
