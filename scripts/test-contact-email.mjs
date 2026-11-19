// Isolated SQLite + fake email transport. Never sends email or touches live data.
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
const req=createRequire(import.meta.url),sql=new DatabaseSync(':memory:');
for(const name of ['0008_contacts.sql','0028_contact_email_notifications.sql'])sql.exec(readFileSync('db/migrations/'+name,'utf8'));
const DB={prepare(query){let args=[];return {
 bind(...v){args=v;return this},
 async first(){return sql.prepare(query).get(...args)||null},
 async all(){return {results:sql.prepare(query).all(...args)}},
 async run(){const r=sql.prepare(query).run(...args);return {meta:{changes:Number(r.changes),last_row_id:Number(r.lastInsertRowid)}}},
}}};
let failRecipient='', calls=[], transportError=false;
const sender={async send(message){calls.push(message);if(message.to===failRecipient||transportError)throw Object.assign(new Error('private provider detail'),{code:'E_RECIPIENT_NOT_ALLOWED'});return {messageId:'test-'+calls.length}}};
const env={DB,CONTACT_EMAIL:sender},cache=new Map();
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
const settings=load('src/app/api/admin/contact-email/route.ts');
const contacts=load('src/app/api/contact/route.ts');
const contactEmail=load('src/lib/contact-email.ts');
const config=load('src/lib/contact-email-config.ts');
const request=(path,method='GET',body,cookie='role=admin',origin='https://site.test')=>new Request('https://site.test'+path,{method,headers:{cookie,origin,'Content-Type':'application/json'},...(body!==undefined?{body:JSON.stringify(body)}:{})});
const path='/api/admin/contact-email';
// GET requests must not have bodies; check permissions independently for all methods.
for(const cookie of ['', 'role=payments'])for(const method of ['GET','PUT','POST'])assert.equal((await settings[method](request(path,method,method==='GET'?undefined:{enabled:false,emails:['','']},cookie))).status,cookie?403:401);
assert.equal((await settings.PUT(request(path,'PUT',{enabled:false,emails:['','']},'role=admin','https://attacker.invalid'))).status,403);
assert.equal((await (await settings.GET(request(path))).json()).settings.enabled,false);
for(const invalid of [{enabled:true,emails:['','']},{enabled:true,emails:['bad','']},{enabled:true,emails:['a@example.com','A@example.com']},{enabled:true,emails:['a@example.com','b@example.com','c@example.com']},{enabled:true,emails:['a@example.com\r\nBcc:attacker@example.com','']},{enabled:'yes',emails:['','']}])assert.equal((await settings.PUT(request(path,'PUT',invalid))).status,400);
const guest={name:'Guest <script>alert(1)</script>',email:'visitor@example.com',message:'مرحبا <b>message</b>',phone:'',company:'',subject:'partner'};
async function submit(){const r=await contacts.POST(request('/api/contact','POST',guest,''));assert.equal(r.status,201);return r.json()}
await submit();assert.equal(calls.length,0,'Disabled sends no messages');
assert.equal((await settings.PUT(request(path,'PUT',{enabled:true,emails:[' FIRST@example.com ','second@example.com']}))).status,200);
failRecipient='second@example.com';const contact=await submit();assert.equal(calls.length,2);assert.equal(calls[0].to,'first@example.com');assert.equal(calls[0].replyTo,guest.email);assert.equal(calls[0].from.email,'notifications@notify.emaalbs.com');assert.ok(calls[0].html.includes('&lt;script&gt;'));assert.ok(!calls[0].html.includes('<script>'));assert.ok(calls[0].text.includes(guest.message));assert.ok(!JSON.stringify(contact).includes('first@example.com'),'Public response must not expose notification recipients');
let rows=sql.prepare('SELECT status,error_code FROM contact_email_deliveries WHERE contact_id=? ORDER BY id').all(contact.id);assert.deepEqual(rows.map(r=>r.status),['accepted','failed']);assert.equal(rows[1].error_code,'E_RECIPIENT_NOT_ALLOWED');
assert.equal(sql.prepare('SELECT count(*) n FROM contacts').get().n,2,'Provider rejection never loses the contact');
assert.equal((await contacts.GET(request('/api/contact','GET',undefined,''))).status,401);
// Fast CI machines can create both contacts in the same millisecond; match identity, not row order.
sql.prepare('UPDATE contacts SET created_at=?').run(contact.created_at);
const inbox=await(await contacts.GET(request('/api/contact'))).json();assert.equal(inbox.find(row=>row.id===contact.id).email_notifications.length,2);
env.CONTACT_EMAIL=undefined;await submit();rows=sql.prepare('SELECT * FROM contact_email_deliveries ORDER BY id DESC LIMIT 2').all();assert.ok(rows.every(r=>r.error_code==='NOT_CONFIGURED'));env.CONTACT_EMAIL=sender;
failRecipient='';await settings.PUT(request(path,'PUT',{enabled:true,emails:['','new@example.com']}));const before=calls.length;await submit();assert.equal(calls.length,before+1);assert.equal(calls.at(-1).to,'new@example.com');
const firstTest=await settings.POST(request(path,'POST'));assert.equal(firstTest.status,200);assert.equal((await firstTest.json()).deliveries[0].status,'accepted');assert.equal(calls.at(-1).replyTo,undefined);assert.equal((await settings.POST(request(path,'POST'))).status,429);
for(const bad of [{...guest,email:'visitor@example.com\r\nBcc:bad@example.com'},{...guest,message:' '},{...guest,name:{}},{...guest,message:'x'.repeat(10001)}])assert.equal((await contacts.POST(request('/api/contact','POST',bad,''))).status,400);
await settings.PUT(request(path,'PUT',{enabled:false,emails:['','']}));const sent=calls.length;await submit();assert.equal(calls.length,sent);
assert.ok(config.contactEmailError('E_RECIPIENT_NOT_ALLOWED').includes('Cloudflare'));
sql.close();console.log('PASS contact email: settings permissions, validation, two recipients, partial failure, persistence, missing service, HTML escaping, private recipients, tests/rate limit, changed/disabled recipients. No real emails sent.');
