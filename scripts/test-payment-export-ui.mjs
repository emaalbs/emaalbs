// Local browser + synthetic payments; no live data or gateway calls.
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHmac} from 'node:crypto';
import {getPlatformProxy} from 'wrangler';
import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';
const base='http://localhost:3000';
const report=JSON.parse(readFileSync('.wrangler/export-qa/report-fixture.json','utf8'));
const proxy=await getPlatformProxy({remoteBindings:false});
const owner=await proxy.env.DB.prepare('SELECT id,username FROM admin_users WHERE is_super_admin=1 LIMIT 1').first();assert.ok(owner);
const vars={};for(const line of readFileSync('.dev.vars','utf8').split(/\r?\n/)){const m=line.match(/^([A-Z_]+)=(.*)$/);if(m)vars[m[1]]=m[2].trim().replace(/^["']|["']$/g,'');}
const b64=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
const head=b64({alg:'HS256',typ:'JWT'})+'.'+b64({userId:owner.id,username:owner.username,isSuperAdmin:true,exp:Date.now()+600000});
const cookie=head+'.'+createHmac('sha256',vars.ADMIN_SESSION_SECRET||vars.ADMIN_SECRET).update(head).digest('base64url');
let browser;let exportQuery=null,fail=false;const errors=[];
const folder=resolve('.wrangler/export-qa/downloads');mkdirSync(folder,{recursive:true});
try{
 browser=await puppeteer.launch({headless:true});const page=await browser.newPage();page.setDefaultTimeout(90000);
 await page.setCookie({name:'emmal-session',value:cookie,url:base,httpOnly:true,sameSite:'Strict'});
 await page.setRequestInterception(true);
 page.on('request',r=>{
  const u=new URL(r.url());
  if(r.method()!=='GET'||u.hostname.endsWith('tabadul.iq')){errors.push('Unexpected write/gateway');return void r.abort();}
  if(u.origin===base&&u.pathname==='/api/admin/me')return void r.respond({status:200,contentType:'application/json',body:JSON.stringify({id:owner.id,username:'fixture-cashier',displayName:'محاسب تجريبي',isSuperAdmin:false,role:'payments'})});
  if(u.origin===base&&u.pathname==='/api/admin/payments/export'){
   exportQuery=u.searchParams;
   return void r.respond({status:fail?413:200,contentType:'application/json',body:JSON.stringify(fail?{error:'export_too_large'}:report)});
  }
  if(u.origin===base&&u.pathname==='/api/admin/payments')return void r.respond({status:200,contentType:'application/json',body:JSON.stringify({...report,payments:report.payments.slice(0,25),pageSize:25})});
  void r.continue();
 });
 page.on('pageerror',e=>errors.push(e.message));
 const client=await page.createCDPSession();await client.send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:folder});
 await page.setViewport({width:1440,height:1000});
 await page.goto(base+'/admin/payments',{waitUntil:'domcontentloaded',timeout:120000});
 const clickExport=()=>page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent==='تصدير Excel').click());
 await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent==='تصدير Excel'&&!b.disabled));
 await page.type('input[placeholder="اسم الشخص أو رقم الحجز"]','تجريبي');await page.$eval('form',form=>form.requestSubmit());
 await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent==='تصدير Excel'&&!b.disabled));
 await clickExport();await page.waitForFunction(()=>document.body.innerText.includes('بدأ تنزيل تقرير Excel'));
 assert.equal(exportQuery.get('q'),'تجريبي');assert.equal(exportQuery.has('page'),false,'All pages exported');
 const filename='EMAAL-payments-real-'+new Date(report.asOf+10800000).toISOString().slice(0,10)+'.xlsx';
 for(let i=0;i<60&&!existsSync(resolve(folder,filename));i++)await new Promise(r=>setTimeout(r,250));
 assert.ok(existsSync(resolve(folder,filename)),'Browser downloaded a real xlsx');
 const book=new ExcelJS.Workbook();await book.xlsx.readFile(resolve(folder,filename));assert.equal(book.getWorksheet('العمليات').rowCount,37);
 await page.screenshot({path:'.wrangler/export-qa/payments-export-desktop.png',fullPage:true});
 await page.setViewport({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.screenshot({path:'.wrangler/export-qa/payments-export-mobile.png',fullPage:true});
 fail=true;await clickExport();await page.waitForFunction(()=>document.body.innerText.includes('لم يتم تنزيل تقرير ناقص'));
 assert.deepEqual(errors,[]);console.log('PASS: local payments-role UI, applied filters, all-page XLSX download, readable workbook, responsive button and oversized-report error. Synthetic data only.');
}finally{await browser?.close();await proxy.dispose();}
