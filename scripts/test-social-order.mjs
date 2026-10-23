// In-memory fixtures only. No credentials, external services or persistent data changes.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import vm from 'node:vm';
import ts from 'typescript';
function load(file,deps={}) {
 const m={exports:{}};
 vm.runInNewContext(ts.transpile(readFileSync(file,'utf8'),{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}),{
  module:m,exports:m.exports,Set,Map,Date,console,require:name=>{if(name in deps)return deps[name];throw new Error('Unexpected dependency '+name);},
 });return m.exports;
}
const helpers=load('src/lib/social-post-order.ts');
const sql=new DatabaseSync(':memory:');sql.exec(readFileSync('db/migrations/0015_social_posts.sql','utf8'));sql.exec('DELETE FROM social_posts');
const fixture=[
 {id:1,platform:'linkedin',time:100,pinned:1,date:'2030-01-01'},
 {id:2,platform:'facebook',time:200,sort:-999},
 {id:3,platform:'x',time:300},
 {id:4,platform:'instagram',time:400},
 {id:5,platform:'youtube',time:500},
 {id:6,platform:'facebook',time:600,date:'2000-01-01'},
 {id:7,platform:'facebook',time:600},
 {id:8,platform:'youtube',time:900,published:0},
];
for(const x of fixture)sql.prepare(`INSERT INTO social_posts (id,platform,post_url,created_at,updated_at,published,pinned,sort_order,post_date) VALUES (?,?,?,?,?,?,?,?,?)`).run(x.id,x.platform,'https://example.invalid/'+x.id,x.time,x.id===1?9999:x.time,x.published??1,x.pinned??0,x.sort??0,x.date??'');
const DB={prepare:q=>({all:async()=>({results:sql.prepare(q).all()})})};
const db=load('src/lib/db/social-posts.ts',{'@/lib/cloudflare':{getEnv:async()=>({DB})},'@/lib/social-platforms':{}});
const posts=await db.listSocialPosts();assert.deepEqual(Array.from(posts,p=>p.id),[7,6,5,4,3,2,1]);
assert.equal((await db.listSocialPosts(true))[0].id,1,'Admin pin/manual ordering retained');
const input=Object.freeze([...posts].reverse().map(p=>Object.freeze(p)));
assert.deepEqual(Array.from(helpers.newestSocialPosts(input),p=>p.id),[7,6,5,4,3,2,1]);
assert.deepEqual(Array.from(input,p=>p.id),[1,2,3,4,5,6,7],'No input mutation');
assert.deepEqual(Array.from(helpers.latestSocialPostsByPlatform(input),p=>p.id),[7,5,4,3,1]);
assert.equal(helpers.latestSocialPostsByPlatform([]).length,0);
assert.equal(helpers.latestSocialPostsByPlatform([{...posts[0],published:false}]).length,0);
assert.equal(helpers.latestSocialPostsByPlatform([posts[0],posts[1]]).length,1);
const home=load('src/app/api/home/route.ts',{
 'next/server':{NextResponse:Response},'@/lib/db/blogs':{listBlogs:async()=>[]},'@/lib/db/gallery':{listGalleryAlbums:async()=>[]},
 '@/lib/db/hero-slides':{listHeroSlides:async()=>[],getHeroCarouselSettings:async()=>({autoplayDelayMs:6500})},
 '@/lib/db/social-posts':{listSocialPosts:async()=>input},'@/lib/db/home-feature':{getHomeFeature:async()=>({})},'@/lib/social-post-order':helpers,
});
assert.deepEqual((await (await home.GET()).json()).socialPosts.map(p=>p.id),[7,5,4,3,1],'Home API emits all five platforms, not only first three');
sql.close();console.log('PASS: public SQL newest-added order, deterministic ties, drafts excluded, pinned/edited/backdated posts cannot override recency, immutable input, latest per platform and all platforms in homepage API.');
