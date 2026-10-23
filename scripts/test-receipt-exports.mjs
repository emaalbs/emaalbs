// Re-render the existing synthetic local receipt; no payment is created.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import puppeteer from 'puppeteer';
const data=JSON.parse(readFileSync('.wrangler/booking-tier-qa/demo-result.json','utf8'));
assert.ok(data.viewer.startsWith('http://localhost:3000/'));
const out=resolve('.wrangler/booking-tier-qa/exports-final');mkdirSync(out,{recursive:true});
const browser=await puppeteer.launch({headless:true});
try {
 const page=await browser.newPage();await page.setViewport({width:1440,height:1100});
 await page.setRequestInterception(true);page.on('request',r=>r.url().startsWith('http')&&!r.url().startsWith('http://localhost:3000/')?void r.abort():void r.continue());
 const client=await page.createCDPSession();await client.send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:out});
 for(const locale of ['ar','en']){
  await page.goto(data.viewer.replace('/ar/receipt/','/'+locale+'/receipt/'),{waitUntil:'networkidle2',timeout:120000});
  await page.waitForSelector('[data-receipt-download="pdf"]:not(:disabled)');
  for(const format of ['pdf','png']){
   await page.waitForSelector(`[data-receipt-download="${format}"]:not(:disabled)`);await page.click(`[data-receipt-download="${format}"]`);
   let file;
   for(let i=0;i<120;i++){file=readdirSync(out).find(f=>f.endsWith(`-${locale}.${format}`));if(file)break;await new Promise(r=>setTimeout(r,500));}
   assert.ok(file,'Download completes');data[locale+'_'+format]=out+'/'+file;
  }
 }
 writeFileSync('.wrangler/booking-tier-qa/final-exports.json',JSON.stringify(data,null,2));
 console.log('PASS: refreshed Arabic/English PDF and image exports, no new booking.');
}finally{await browser.close();}
