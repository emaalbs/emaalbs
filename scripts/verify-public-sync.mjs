import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getPlatformProxy} from 'wrangler';
const source=JSON.parse(readFileSync(process.argv[2],'utf8'));
const proxy=await getPlatformProxy({remoteBindings:false});
const db=proxy.env.DB;
const get=async path=>{const r=await fetch('http://localhost:3000/api/'+path);assert.equal(r.status,200);return r.json();};
const clean=v=>Array.isArray(v)?v.map(clean):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).filter(([k,x])=>!['id','createdAt','updatedAt','albumId','categoryId','categoryName','imageCount'].includes(k)&&x!==undefined).map(([k,x])=>[k,clean(x)])):typeof v==='string'?v.trim():v;
try {
  for(const b of source.blogs) assert.deepEqual(clean(await get('blogs/'+b.slug)),clean(b),'blog '+b.slug);
  for(const e of source.editions) assert.deepEqual(clean(await get('ibs/editions/'+e.slug)),clean(e),'edition '+e.slug);
  const mags=await get('magazines');
  for(const m of source.magazines){const local=mags.find(x=>x.slug===m.slug);assert.ok(local);for(const k of Object.keys(m).filter(k=>k!=='id')) assert.deepEqual(clean(local[k]),clean(m[k]),'magazine '+k);}
  const social=await get('social-posts');
  for(const s of source.social) assert.deepEqual(clean(social.find(p=>p.postUrl===s.postUrl&&p.title.en===s.title.en&&p.title.ar===s.title.ar)),clean(s),'social '+s.postUrl);
  const home=await get('home');
  assert.deepEqual(clean(home.heroSlides),clean(source.home.heroSlides));
  assert.equal(home.autoplayDelayMs,source.home.autoplayDelayMs);assert.deepEqual(clean(home.feature),clean(source.home.feature));
  for(const a of source.albums){
    const album=await db.prepare('SELECT id FROM gallery_albums WHERE slug=?').bind(a.slug).first();assert.ok(album);
    const {results:images}=await db.prepare('SELECT * FROM gallery_images WHERE album_id=?').bind(album.id).all();
    for(const image of a.images){const local=images.find(i=>i.image_url===image.imageUrl);assert.ok(local,'gallery image');assert.equal(local.title_en,image.title.en.trim());assert.equal(local.title_ar,image.title.ar.trim());assert.equal(local.content_hash,image.contentHash);}
  }
  const fk=await db.prepare('PRAGMA foreign_key_check').all();assert.equal(fk.results.length,0,'foreign keys');
  const columns=await db.prepare('PRAGMA table_info(magazines)').all();assert.ok(columns.results.some(c=>c.name==='pdf_url_en'));assert.ok(columns.results.some(c=>c.name==='pdf_url_ar'));
  assert.ok(await db.prepare("SELECT name FROM sqlite_master WHERE name='ibs_booking_settings'").first());
  console.log('PASS: articles, editions, magazines, social posts, homepage, every gallery photo, database integrity and preview-only schema preserved.');
} finally {await proxy.dispose();}
