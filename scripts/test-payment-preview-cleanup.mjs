// Read-only LOCAL checks after archiving. No registrations or gateway calls.
import assert from 'node:assert/strict';
import {createHmac,randomBytes,createHash} from 'node:crypto';
import {getPlatformProxy} from 'wrangler';
import puppeteer from 'puppeteer';
const base='http://localhost:3000',slugs=['tabadul-payment-preview','tabadul-live-pilot'];
const p=await getPlatformProxy({remoteBindings:false});let browser;
async function snapshot(){return createHash('sha256').update(JSON.stringify((await p.env.DB.prepare('SELECT * FROM ibs_bookings ORDER BY id').all()).results)).digest('hex');}
try{
 const before=await snapshot();
 const list=await (await fetch(base+'/api/ibs/editions')).json();
 for(const slug of slugs){
  assert.ok(!list.some(e=>e.slug===slug));
  assert.equal((await fetch(base+'/api/ibs/editions/'+slug)).status,404);
  const row=await p.env.DB.prepare('SELECT published FROM ibs_editions WHERE slug=?').bind(slug).first();assert.equal(row.published,0);
 }
 const sitemap=await (await fetch(base+'/sitemap.xml')).text();for(const slug of slugs)assert.ok(!sitemap.includes(slug));
 for(const mode of ['', 'tabadul','tabadul-real']){
  const r=await fetch(base+'/api/bookings/checkout',{method:'POST',headers:{Origin:base,'Content-Type':'application/json','Idempotency-Key':randomBytes(32).toString('hex'),...(mode?{'X-IBS-Payment-Preview':mode}:{})},body:JSON.stringify({slug:'1st-edition-2025',name:'Paused checkout QA',email:'paused@example.invalid',phone:'000000',locale:'ar',acceptedTerms:true,realPaymentConsent:true})});
  assert.equal(r.status,409);assert.equal((await r.json()).error,'booking_closed');
 }
 for(const endpoint of ['mock','tabadul-preview'])assert.equal((await fetch(base+'/api/payments/'+endpoint,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:'{}'})).status,404);
 const b64=x=>Buffer.from(JSON.stringify(x)).toString('base64url');const h=`${b64({alg:'HS256',typ:'JWT'})}.${b64({userId:0,username:'local-cleanup-qa',isSuperAdmin:true,exp:Date.now()+600000})}`;
 const cookie=`${h}.${createHmac('sha256',p.env.ADMIN_SECRET).update(h).digest('base64url')}`;
 const r=await fetch(base+'/api/admin/payments?mode=real&edition=tabadul-live-pilot',{headers:{Cookie:`emmal-session=${cookie}`}});assert.equal(r.status,200);
 const ledger=await r.json();assert.ok(ledger.payments.some(x=>x.payment_state==='paid'&&x.confirmed_at&&x.amount_minor===1000000),'successful IQD 1,000 payment is retained');
 browser=await puppeteer.launch({headless:true});const page=await browser.newPage();
 await page.setRequestInterception(true);page.on('request',r=>{const h=new URL(r.url()).hostname;if(h==='tabadul.iq'||h.endsWith('.tabadul.iq'))void r.abort();else void r.continue();});
 for(const locale of ['ar','en']){
  await page.goto(`${base}/${locale}/ibs`,{waitUntil:'networkidle2',timeout:90000});
  for(const slug of slugs)assert.equal(await page.$(`a[href*="${slug}"]`),null);
 }
 await page.goto(base+'/ar/ibs/1st-edition-2025',{waitUntil:'networkidle2',timeout:90000});assert.equal(await page.$('#booking'),null);
 for(const slug of slugs){
  await page.goto(`${base}/ar/ibs/${slug}`,{waitUntil:'networkidle2',timeout:90000});
  assert.equal(await page.$('#booking'),null);
  assert.ok(await page.evaluate(()=>document.body.innerText.includes('404')),'archived page shows not-found');
 }
 await page.goto(base+'/ar/ibs',{waitUntil:'networkidle2',timeout:90000});await page.screenshot({path:'.wrangler/tabadul-qa/ibs-after-cleanup.png',fullPage:true});
 assert.equal(await snapshot(),before,'no payment records changed during verification');
 console.log('PASS: archived demos absent from API, AR/EN navigation, sitemap and direct pages; all new checkout modes/simulators paused; real pages retained; confirmed payment history intact. No gateway calls.');
}finally{if(browser)await browser.close();await p.dispose();}
