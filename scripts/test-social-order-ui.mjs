// Read-only local browser QA. No external embeds, publishing or content edits.
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import puppeteer from 'puppeteer';
const base='http://localhost:3000',out='.wrangler/social-order-qa';mkdirSync(out,{recursive:true});
const posts=await (await fetch(base+'/api/social-posts',{cache:'no-store'})).json();
assert.ok(Array.isArray(posts)&&posts.length>1,'Local social fixtures are required');
const sorted=[...posts].sort((a,b)=>b.createdAt-a.createdAt||b.id-a.id),seen=new Set();
const latest=sorted.filter(p=>{if(seen.has(p.platform))return false;seen.add(p.platform);return true;});
const browser=await puppeteer.launch({headless:true});
try {
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setRequestInterception(true);page.on('request',r=>{
  if((r.url().startsWith('http')&&!r.url().startsWith(base+'/'))||!['GET','HEAD'].includes(r.method()))void r.abort();else void r.continue();
 });
 for(const locale of ['ar','en']) {
  await page.setViewport({width:1440,height:1000});
  await page.goto(`${base}/${locale}/social#social-feed`,{waitUntil:'networkidle2',timeout:120000});
  await page.waitForSelector('[data-social-feed]');
  const ids=()=>page.$$eval('[data-social-feed] [data-social-post]',els=>els.map(e=>Number(e.dataset.socialPost)));
  assert.deepEqual(await ids(),sorted.map(p=>p.id));
  const boxes=await page.$$eval('[data-social-feed] [data-social-post]',els=>els.slice(0,3).map(e=>{const r=e.getBoundingClientRect();return {top:r.top,left:r.left};}));
  assert.ok(Math.abs(boxes[0].top-boxes[1].top)<2,'Newest two are on first row, not separate newspaper columns');
  assert.ok(locale==='ar'?boxes[0].left>boxes[1].left:boxes[0].left<boxes[1].left,'Reading direction matches language');
  const tab=await page.$$('button[role="tab"]');await tab[1].click();
  assert.deepEqual(await ids(),sorted.filter(p=>p.platform==='linkedin').map(p=>p.id));await tab[0].click();assert.deepEqual(await ids(),sorted.map(p=>p.id));
  await page.$eval('[data-social-feed]',e=>e.scrollIntoView({behavior:'instant',block:'start'}));await page.screenshot({path:`${out}/feed-${locale}.png`});
  await page.setViewport({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Mobile feed fits');
  await page.goto(`${base}/${locale}#home-social-pulse`,{waitUntil:'networkidle2',timeout:120000});await page.waitForSelector('#home-social-pulse [data-social-post]',{timeout:60000});
  assert.deepEqual(await page.$$eval('#home-social-pulse [data-social-post]',els=>els.map(e=>Number(e.dataset.socialPost))),latest.map(p=>p.id));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Mobile home fits');
  await page.setViewport({width:1440,height:1000});await page.$eval('#home-social-pulse',e=>e.scrollIntoView({behavior:'instant',block:'start'}));
  await (await page.$('#home-social-pulse')).screenshot({path:`${out}/home-${locale}.png`});
 }
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS: real local feed newest-first, chronological grid rows in Arabic/English, platform filtering, homepage one latest per platform, responsive width. No data modified.');
} finally{await browser.close();}
