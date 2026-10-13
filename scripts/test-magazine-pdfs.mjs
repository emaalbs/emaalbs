// LOCAL ONLY: temporary magazine + R2 objects are cleaned up in finally.
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { getPlatformProxy } from 'wrangler';
import puppeteer from 'puppeteer';

const base = 'http://localhost:3000';
const slug = `pdf-language-test-${Date.now()}`;
const proxy = await getPlatformProxy({remoteBindings:false});
const db = proxy.env.DB;
const to64 = value => Buffer.from(JSON.stringify(value)).toString('base64url');
const head = `${to64({alg:'HS256',typ:'JWT'})}.${to64({userId:0,username:'local-pdf-test',isSuperAdmin:true,exp:Date.now()+1800000})}`;
const token = `${head}.${createHmac('sha256',proxy.env.ADMIN_SECRET).update(head).digest('base64url')}`;
const keys = new Set();
let browser;
// Small PDF fixture, built in memory so tests do not use private user documents.
function pdf(text) {
  const content=`BT /F1 18 Tf 40 100 Td (${text}) Tj ET`;
  const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 400 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${content.length} >>\nstream\n${content}\nendstream`];
  let result='%PDF-1.4\n'; const offsets=[0];
  for (let i=0;i<objects.length;i++){offsets.push(result.length);result+=`${i+1} 0 obj\n${objects[i]}\nendobj\n`;}
  const xref=result.length;
  result+=`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n ').join('\n')}\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return result;
}
async function api(path, method='GET', body, authenticated=true) {
  const r=await fetch(base+path,{method,headers:{...(authenticated?{Cookie:`emmal-session=${token}`} : {}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  assert.ok(r.headers.get('content-type')?.includes('application/json'),`${path}: HTTP ${r.status}`);
  return {status:r.status,data:await r.json()};
}
const read=async()=> (await api(`/api/magazines/${slug}`)).data;
const update=body=>api(`/api/magazines/${slug}`,'PUT',body);
try {
  const existing=await db.prepare('SELECT slug FROM magazines WHERE slug=?').bind('investment-in-iraq-perspectives-2027').first();
  console.log('Requested example exists locally:',!!existing);
  const form=new FormData();form.append('file',new Blob([pdf('Legacy fixture')],{type:'application/pdf'}),'legacy.pdf');form.append('prefix',`magazines/${slug}/`);
  const upload=await fetch(base+'/api/media/upload',{method:'POST',headers:{Cookie:`emmal-session=${token}`},body:form});
  const legacy=await upload.json();assert.equal(upload.status,200);keys.add(legacy.key);
  const data={slug,title:{en:'PDF language test',ar:'تجربة نسخ الملف'},description:{en:'Temporary test',ar:'اختبار مؤقت'},cover_image:'/Logo.webp',pdf_url:legacy.url,date:'2026-10-13'};
  assert.equal((await api('/api/magazines','POST',data)).status,201);
  assert.equal((await read()).pdf_url,legacy.url,'legacy retained');
  assert.equal((await update({pdf_url:'',pdf_url_en:'',pdf_url_ar:''})).status,400,'one PDF required on server');
  assert.equal((await update({pdf_url_ar:'javascript:alert(1)'})).status,400,'unsafe URL rejected');
  assert.equal((await api(`/api/magazines/${slug}`,'PUT',{pdf_url_ar:'/fake.pdf'},false)).status,401);
  browser=await puppeteer.launch({headless:true});
  const page=await browser.newPage();page.setDefaultTimeout(60000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setCookie({name:'emmal-session',value:token,url:base,httpOnly:true,sameSite:'Strict'});
  await page.setViewport({width:1440,height:1100,deviceScaleFactor:1});
  await page.goto(`${base}/admin/magazines/${slug}`,{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForSelector('#magazine-pdfs input[type=file]');
  async function uploadLanguage(index,language){
    const response=page.waitForResponse(r=>r.url().endsWith('/api/media/upload')&&r.request().method()==='POST');
    await page.evaluate(({index,text,language})=>{
      const input=document.querySelectorAll('#magazine-pdfs input[type=file]')[index];
      const dt=new DataTransfer();dt.items.add(new File([text],language+'.pdf',{type:'application/pdf'}));input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));
    },{index,text:pdf(language+' fixture'),language});
    const r=await response;assert.equal(r.status(),200);const result=await r.json();keys.add(result.key);
    await page.waitForFunction(url=>!!document.querySelector(`#magazine-pdfs a[href="${url}"]`),{},result.url);
    return result.url;
  }
  const en=await uploadLanguage(0,'en');const ar=await uploadLanguage(1,'ar');
  async function save(){
    const response=page.waitForResponse(r=>r.url().endsWith(`/api/magazines/${slug}`)&&r.request().method()==='PUT');
    await page.evaluate(()=>Array.from(document.querySelectorAll('button')).find(b=>b.innerText==='Save').click());
    assert.equal((await response).status(),200);
    await page.waitForFunction(()=>location.pathname==='/admin/magazines');
  }
  await mkdir('.wrangler/magazine-pdf-qa',{recursive:true});
  await (await page.$('#magazine-pdfs')).screenshot({path:'.wrangler/magazine-pdf-qa/admin-desktop.png'});
  await page.setViewport({width:390,height:844,deviceScaleFactor:1});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'mobile editor has no horizontal overflow');
  await (await page.$('#magazine-pdfs')).screenshot({path:'.wrangler/magazine-pdf-qa/admin-mobile.png'});
  await save();
  const saved=await read();assert.equal(saved.pdf_url_en,en);assert.equal(saved.pdf_url_ar,ar);
  for(const [locale,expected,other] of [['en',en,ar],['ar',ar,en]]) {
    for(const path of ['news','blog']){
      await page.goto(`${base}/${locale}/${path}`,{waitUntil:'domcontentloaded',timeout:90000});
      await page.waitForSelector(`a[href="${expected}"]`);
      assert.equal(await page.$(`a[href="${other}"]`),null,`${locale}/${path} uses selected PDF`);
    }
  }
  for(const url of [en,ar]){const r=await fetch(base+url);assert.equal(r.status,200);assert.ok(r.headers.get('content-type').includes('application/pdf'));assert.ok((await r.text()).startsWith('%PDF-'));}
  assert.equal((await update({pdf_url_en:'',pdf_url:''})).status,200);
  await page.goto(`${base}/en/news`,{waitUntil:'domcontentloaded',timeout:90000});await page.waitForSelector(`a[href="${ar}"]`);
  assert.equal((await update({pdf_url_en:en,pdf_url_ar:''})).status,200);
  await page.goto(`${base}/ar/news`,{waitUntil:'domcontentloaded',timeout:90000});await page.waitForSelector(`a[href="${en}"]`);
  await update({pdf_url:legacy.url,pdf_url_en:'',pdf_url_ar:''});
  await page.goto(`${base}/admin/magazines/${slug}`,{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForSelector('#magazine-pdfs input[type=file]');
  await page.evaluate(()=>Array.from(document.querySelectorAll('button')).find(b=>b.innerText==='Use as Arabic').click());
  await save();const assigned=await read();assert.equal(assigned.pdf_url,'');assert.equal(assigned.pdf_url_ar,legacy.url);
  assert.equal((await update({description:{en:'Updated',ar:'تحديث'}})).status,200);assert.equal((await read()).pdf_url_ar,legacy.url,'partial edit retains file');
  assert.deepEqual(errors,[],'browser runtime errors');
  console.log('PASS: legacy compatibility, real local uploads and save/reload, correct EN/AR links in News and Blog, single-language fallback both ways, assigning legacy language, protected API, required-file validation, mobile layout.');
} finally {
  await browser?.close();
  await db.prepare('DELETE FROM magazines WHERE slug=?').bind(slug).run();
  for(const key of keys) if(key.startsWith('magazines/')) await proxy.env.MEDIA.delete(key);
  await proxy.dispose();
}
