// Isolated SQLite + fake email transport. Never sends email or touches live data.
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
const req=createRequire(import.meta.url),sql=new DatabaseSync(':memory:');
for(const name of ['0029_welcome_page.sql'])sql.exec(readFileSync('db/migrations/'+name,'utf8'));
const DB={prepare(query){let args=[];return {
 bind(...v){args=v;return this},
 async first(){return sql.prepare(query).get(...args)||null},
 async all(){return {results:sql.prepare(query).all(...args)}},
 async run(){const r=sql.prepare(query).run(...args);return {meta:{changes:Number(r.changes),last_row_id:Number(r.lastInsertRowid)}}},
}}};
const env={DB},cache=new Map();
function load(file){file=resolve(file);if(cache.has(file))return cache.get(file).exports;const m={exports:{}};cache.set(file,m);
 const require=name=>{
  if(name==='@/lib/cloudflare')return {getEnv:async()=>env};
  if(name==='@opennextjs/cloudflare')return {getCloudflareContext:async()=>({env})};
  if(name==='@/lib/auth')return {requireAuth:async r=>{const c=r.headers.get('cookie');if(c==='role=payments')throw new Error('Forbidden');if(c!=='role=admin')throw new Error('Unauthorized');return {role:'admin'}}};
  if(name==='next/server')return req('next/server');
  return load((name.startsWith('@/')?resolve('src',name.slice(2)):resolve(dirname(file),name))+'.ts');
 };
 vm.runInNewContext(ts.transpile(readFileSync(file,'utf8'),{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}),{module:m,exports:m.exports,require,Error,URL,Request,Response,Headers,Date,Map,Set,console,setTimeout,clearTimeout,process:{env:{NODE_ENV:'production'}}});return m.exports;
}

const route=load('src/app/api/welcome-page/route.ts');
const config=load('src/data/welcome-page.ts');
const original=JSON.parse(JSON.stringify(config.DEFAULT_WELCOME_PAGE));
const request=(body,cookie='role=admin',origin='https://site.test')=>new Request('https://site.test/api/welcome-page',{method:'PUT',headers:{cookie,origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
assert.equal((await (await route.GET()).json()).enabled,false,'New installations start disabled');
for(const [cookie,status] of [['',401],['role=payments',403]])assert.equal((await route.PUT(request({...original,enabled:true},cookie))).status,status);
assert.equal((await route.PUT(request(original,'role=admin','https://attacker.invalid'))).status,403);
assert.equal(sql.prepare('SELECT count(*) AS n FROM welcome_page').get().n,0,'Rejected writes cannot create settings');
for(const url of ['javascript:alert(1)','data:text/html,test','//evil.invalid','/\\evil.invalid','https://user:pass@evil.invalid','https://example.org/\nattack']){
 const invalid={...original,registrationUrl:{ar:'',en:url}};
 assert.equal((await route.PUT(request(invalid))).status,400,'Reject unsafe URL '+url);
}
for(const body of [null,[],{...original,enabled:'yes'},{...original,title:{en:'',ar:'عنوان'}},{...original,description:{en:'a'.repeat(2001),ar:''}}])assert.equal((await route.PUT(request(body))).status,400);
const saved={...original,enabled:true,registrationUrl:{en:'https://forms.gle/example?x=1&y=2',ar:''},agendaUrl:{en:'',ar:'/api/media/welcome/agenda/test.pdf'}};
assert.equal((await route.PUT(request(saved))).status,200);
const response=await route.GET();assert.match(response.headers.get('cache-control'),/no-store/);
assert.deepEqual(await response.json(),saved);
assert.equal(config.welcomeUrl(saved.agendaUrl,'en'),saved.agendaUrl.ar);
assert.equal(config.welcomeUrl(saved.registrationUrl,'ar'),saved.registrationUrl.en);
const legacy={...saved};
for(const field of ['agendaDescription','agenda2Url','agenda2Label','agenda2Description'])delete legacy[field];
assert.deepEqual(JSON.parse(JSON.stringify(config.parseWelcomePage(legacy))),saved,'Existing single-agenda settings remain readable');
const twoDays={...saved,agenda2Url:{ar:'/api/media/welcome/agenda/day-2.pdf',en:''},agenda2Label:{ar:'أجندة اليوم الثاني',en:'Day two agenda'}};
assert.equal((await route.PUT(request(twoDays))).status,200);
assert.deepEqual(await(await route.GET()).json(),twoDays,'Both agenda downloads persist independently');
assert.equal(config.welcomeUrl(twoDays.agenda2Url,'en'),twoDays.agenda2Url.ar);
assert.equal((await route.PUT(request({...twoDays,agenda2Url:{en:'javascript:alert(1)',ar:''}}))).status,400);
assert.equal((await route.PUT(request({...twoDays,agenda2Label:{en:'',ar:''}}))).status,400);
assert.equal((await route.PUT(request({...twoDays,agenda2Url:{en:'',ar:''}}))).status,200,'Second agenda can be removed');
assert.equal((await route.PUT(request({...saved,enabled:false}))).status,200);
assert.deepEqual(await(await route.GET()).json(),{...saved,enabled:false},'Disabling keeps content');
console.log('PASS: default-off installation, authorized persistence, permission/origin guards, URL validation, bilingual fallback and hide/show without content loss.');
sql.close();
