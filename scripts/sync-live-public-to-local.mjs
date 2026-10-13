// One-way PUBLIC content sync. Production is GET-only; every write uses LOCAL Wrangler bindings.
// Does not import admin accounts, messages, subscribers, drafts or payments. Never deploys/pushes.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { getPlatformProxy } from 'wrangler';

const root=process.cwd();
assert.equal(path.basename(root),'emaal-website-test','Run in the local test checkout only');
const origin='https://www.emaalbs.com';
const apply=process.argv.includes('--apply');
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const backup=process.argv[process.argv.indexOf('--backup')+1];
if(apply) {
  assert.ok(process.argv.includes('--backup')&&backup,'Pass --backup with a fresh local D1 export');
  assert.ok(path.resolve(backup).startsWith(path.join(root,'.wrangler','backups')+path.sep)&&existsSync(backup),'Backup must exist inside .wrangler/backups');
}
await mkdir('.wrangler/backups',{recursive:true});
async function liveGet(url,json=true){
  const target=new URL(url,origin);
  assert.ok(['www.emaalbs.com','emaalbs.com'].includes(target.hostname));
  const r=await fetch(target,{method:'GET',signal:AbortSignal.timeout(60000),headers:{'Cache-Control':'no-cache'}});
  assert.equal(r.status,200,`Live read ${target.pathname}`);
  return json?r.json():r.text();
}
function albumFromHtml(html,slug){
  // Parse JSON-encoded public hydration data; never evaluate remote JavaScript.
  let flight='';
  for(const m of html.matchAll(/self\.__next_f\.push\((\[.*?\])\)<\/script>/gs)){
    const chunk=JSON.parse(m[1]);if(chunk[0]===1&&typeof chunk[1]==='string') flight+=chunk[1];
  }
  const marker='"album":';let at=flight.indexOf(marker);
  assert.ok(at>=0,'No public album data');at+=marker.length;
  assert.equal(flight[at],'{');let depth=0,quoted=false,escaped=false,end=at;
  for(;end<flight.length;end++){
    const c=flight[end];
    if(quoted){if(escaped) escaped=false;else if(c==='\\') escaped=true;else if(c==='"') quoted=false;continue;}
    if(c==='"') quoted=true;else if(c==='{') depth++;else if(c==='}'&&!--depth){end++;break;}
  }
  const album=JSON.parse(flight.slice(at,end));assert.equal(album.slug,slug);
  // Long React text records use byte lengths and references such as "$1a".
  const texts=new Map();const bytes=Buffer.from(flight);
  for(const m of flight.matchAll(/(?:^|\n)([0-9a-f]+):T([0-9a-f]+),/g)){
    const charStart=m.index+m[0].length;const byteStart=Buffer.byteLength(flight.slice(0,charStart));
    texts.set('$'+m[1],bytes.subarray(byteStart,byteStart+parseInt(m[2],16)).toString());
  }
  const resolve=v=>typeof v==='string'?(texts.get(v)??v):Array.isArray(v)?v.map(resolve):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,resolve(x)])):v;
  return resolve(album);
}
const [blogList,magazines,editionList,categories,albumList,social,home,overviewEn,overviewAr]=await Promise.all(
  ['blogs','magazines','ibs/editions','gallery/categories','gallery/albums','social-posts','home','ibs/overview?locale=en','ibs/overview?locale=ar'].map(p=>liveGet('/api/'+p)));
for(const list of [blogList,magazines,editionList,categories,albumList,social]) assert.ok(Array.isArray(list));
const blogs=[];for(const item of blogList) blogs.push(await liveGet('/api/blogs/'+encodeURIComponent(item.slug)));
const editions=[];for(const item of editionList) editions.push(await liveGet('/api/ibs/editions/'+encodeURIComponent(item.slug)));
const albums=[];for(const item of albumList){
  const album=albumFromHtml(await liveGet('/en/gallery/'+encodeURIComponent(item.slug),false),item.slug);
  assert.equal(album.images.length,item.imageCount,'Gallery must be complete before import');albums.push(album);
}
const snapshot={blogs,magazines,editions,categories,albums,social,home,overview:{en:overviewEn,ar:overviewAr}};
const snapshotFile=`.wrangler/backups/public-live-${stamp}.json`;
await writeFile(snapshotFile,JSON.stringify(snapshot,null,2));
console.log('Public snapshot:',{blogs:blogs.length,magazines:magazines.length,editions:editions.length,categories:categories.length,albums:albums.length,images:albums.reduce((n,a)=>n+a.images.length,0),social:social.length,slides:home.heroSlides.length},snapshotFile);
if(!apply) process.exit(0);

const proxy=await getPlatformProxy({remoteBindings:false});
const db=proxy.env.DB;
const report={snapshotFile,backup,sections:{},media:{existing:0,downloaded:0,bytes:0,failed:[]},localOnlyPreserved:true,draftsSynced:false};
// Reuse tested application database mappers, injecting LOCAL bindings only.
const modules=new Map();
function moduleAt(file){
  file=path.resolve(root,file);assert.ok(file.startsWith(path.join(root,'src')+path.sep));
  if(modules.has(file)) return modules.get(file).exports;
  const mod={exports:{}};modules.set(file,mod);
  const code=ts.transpile(readFileSync(file,'utf8'),{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022});
  const require=id=>id==='@/lib/cloudflare'?{getEnv:async()=>proxy.env}:moduleAt(id.startsWith('@/')?'src/'+id.slice(2)+'.ts':path.resolve(path.dirname(file),id+'.ts'));
  vm.runInNewContext(code,{module:mod,exports:mod.exports,require,console,Date,URL,Intl,crypto:globalThis.crypto,Buffer},{filename:file});
  return mod.exports;
}
const models=Object.fromEntries(['blogs','magazines','ibs','hero-slides','home-feature','social-posts','gallery'].map(n=>[n,moduleAt(`src/lib/db/${n}.ts`)]));
const count=(section,exists)=>{const c=report.sections[section]??={added:0,updated:0};c[exists?'updated':'added']++;};
try {
  for(const b of [...blogs].reverse()){
    const old=await db.prepare('SELECT id FROM blogs WHERE slug=?').bind(b.slug).first();
    if(old) await models.blogs.updateBlog(b.slug,b);else await models.blogs.createBlog(b);
    count('blogs',old);
  }
  for(const m of [...magazines].reverse()){
    const old=await db.prepare('SELECT id FROM magazines WHERE slug=?').bind(m.slug).first();
    if(old) await models.magazines.updateMagazine(m.slug,m);else await models.magazines.createMagazine(m);
    count('magazines',old); // Omitted localized PDF columns are intentionally preserved.
  }
  for(const [index,e] of editions.entries()){
    const old=await db.prepare('SELECT slug FROM ibs_editions WHERE slug=?').bind(e.slug).first();
    if(old){await models.ibs.updateEdition(e.slug,e);await models.ibs.replaceEditionNested(e.slug,e);}else await models.ibs.createEdition(e);
    await db.prepare('UPDATE ibs_editions SET sort_order=? WHERE slug=?').bind(index,e.slug).run();count('editions',old);
  }
  for(const [locale,blocks] of Object.entries(snapshot.overview)) for(const [key,value] of Object.entries(blocks)) await models.ibs.setOverviewBlock(key,locale,value);
  const categoryIds=new Map();
  for(const c of categories){
    const old=await db.prepare('SELECT id FROM gallery_categories WHERE slug=?').bind(c.slug).first();
    if(old) await models.gallery.updateGalleryCategory(old.id,c);
    const result=old||await models.gallery.createGalleryCategory(c);categoryIds.set(c.id,result.id);count('categories',old);
  }
  for(const a of albums){
    const old=await db.prepare('SELECT id FROM gallery_albums WHERE slug=?').bind(a.slug).first();
    const input={...a,categoryId:categoryIds.get(a.categoryId)};assert.ok(input.categoryId);
    if(old){
      const local=await models.gallery.getGalleryAlbumById(old.id);
      const byUrl=new Map(local.images.map(i=>[i.imageUrl,i]));
      input.images=a.images.map(i=>({...i,id:byUrl.get(i.imageUrl)?.id}));
      const remoteUrls=new Set(a.images.map(i=>i.imageUrl));
      // User asked to bring new live content down, not delete local-only photos.
      input.images.push(...local.images.filter(i=>!remoteUrls.has(i.imageUrl)));
      await models.gallery.updateGalleryAlbum(old.id,input);
    }else await models.gallery.createGalleryAlbum({...input,images:input.images.map(({id,...i})=>i)});
    count('albums',old);
  }
  for(const slide of home.heroSlides){
    const old=await db.prepare('SELECT id FROM hero_slides WHERE id=?').bind(slide.id).first();
    if(old) await models['hero-slides'].updateHeroSlide(old.id,slide);else {
      const created=await models['hero-slides'].createHeroSlide(slide);
      if(created.id!==slide.id) await db.prepare('UPDATE hero_slides SET id=? WHERE id=?').bind(slide.id,created.id).run();
    }
    count('slides',old);
  }
  await models['hero-slides'].updateHeroCarouselSettings(home.autoplayDelayMs);
  if(home.feature) await models['home-feature'].updateHomeFeature(home.feature);
  const socialMapFile='.wrangler/backups/live-social-id-map.json';
  const socialMap=existsSync(socialMapFile)?JSON.parse(readFileSync(socialMapFile,'utf8')):{};
  const localSocial=await models['social-posts'].listSocialPosts(true);
  for(const s of [...social].reverse()){
    // A shared URL can intentionally have multiple posts/captions. Never collapse them.
    const mapped=localSocial.find(p=>p.id===socialMap[s.id]);
    const exact=localSocial.find(p=>p.postUrl===s.postUrl&&p.title.en===s.title.en&&p.title.ar===s.title.ar);
    const uniqueUrl=social.filter(p=>p.postUrl===s.postUrl).length===1?localSocial.find(p=>p.postUrl===s.postUrl):undefined;
    const old=mapped||exact||uniqueUrl;
    if(old) await models['social-posts'].updateSocialPost(old.id,s);
    const result=old||await models['social-posts'].createSocialPost(s);socialMap[s.id]=result.id;
    count('social',old);
  }
  await writeFile(socialMapFile,JSON.stringify(socialMap,null,2));
  console.log('Local content imported:',report.sections);
  const keys=new Set();
  function mediaKeys(value){
    if(typeof value==='string'){
      for(const match of value.matchAll(/(?:https:\/\/(?:www\.)?emaalbs\.com)?\/api\/media\/([^\s"<>]+?)(?=[?#]|$)/g)) keys.add(decodeURIComponent(match[1]));
    }else if(Array.isArray(value)) value.forEach(mediaKeys);else if(value&&typeof value==='object') Object.values(value).forEach(mediaKeys);
  }
  mediaKeys(snapshot);
  // Include locally retained files referenced by content tables, not only this live snapshot.
  for(const table of ['blogs','magazines','ibs_editions','ibs_gallery','ibs_initiatives','ibs_speakers','ibs_sponsors','ibs_agenda_speakers','ibs_overview_blocks','gallery_images','gallery_albums','gallery_categories','hero_slides','social_posts','homepage_feature']){
    const rows=await db.prepare(`SELECT * FROM ${table}`).all();
    for(const row of rows.results) for(const value of Object.values(row)) {
      if(typeof value==='string'&&/^[\[{]/.test(value)){try{mediaKeys(JSON.parse(value));}catch{mediaKeys(value);}}else mediaKeys(value);
    }
  }
  console.log('Referenced media:',keys.size);
  let completed=0;const pending=[...keys];
  async function worker(){
    while(pending.length){
      const key=pending.shift();
      try{
        if(await proxy.env.MEDIA.head(key)){report.media.existing++;continue;}
        const url=origin+'/api/media/'+key.split('/').map(encodeURIComponent).join('/');
        const r=await fetch(url,{method:'GET',signal:AbortSignal.timeout(120000)});
        if(!r.ok) throw new Error(`HTTP ${r.status}`);
        if((r.headers.get('content-type')||'').includes('text/html')) throw new Error('Received HTML instead of a media file');
        const chunks=[];let size=0;
        for await(const chunk of r.body){size+=chunk.length;if(size>256*1024*1024) throw new Error('File exceeds 256 MiB safety limit');chunks.push(chunk);}
        const bytes=Uint8Array.from(Buffer.concat(chunks)).buffer;
        await proxy.env.MEDIA.put(key,bytes,{httpMetadata:{contentType:r.headers.get('content-type')||'application/octet-stream'}});
        report.media.downloaded++;report.media.bytes+=size;
      }catch(e){report.media.failed.push({key,error:e.message});}
      finally{completed++;if(completed%25===0) console.log(`Media ${completed}/${keys.size}; downloaded ${report.media.downloaded}; missing ${report.media.failed.length}`);}
    }
  }
  await Promise.all([worker(),worker(),worker()]);
  console.log('SYNC RESULT',JSON.stringify(report));
} finally {
  await writeFile(`.wrangler/backups/sync-report-${stamp}.json`,JSON.stringify(report,null,2));
  await proxy.dispose();
}
