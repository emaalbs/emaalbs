// Isolated SQLite + fake email transport. Never sends email or touches live data.
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
const req=createRequire(import.meta.url),sql=new DatabaseSync(':memory:');
for(const name of ['0008_contacts.sql','0028_contact_email_notifications.sql','0030_contact_auto_replies.sql'])sql.exec(readFileSync('db/migrations/'+name,'utf8'));
const DB={prepare(query){let args=[];return {
 bind(...v){args=v;return this},
 async first(){return sql.prepare(query).get(...args)||null},
 async all(){return {results:sql.prepare(query).all(...args)}},
 async run(){const r=sql.prepare(query).run(...args);return {meta:{changes:Number(r.changes),last_row_id:Number(r.lastInsertRowid)}}},
}}};
let failRecipient='', calls=[], transportError=false;
const sender={async send(message){calls.push(message);if(message.to===failRecipient||transportError)throw Object.assign(new Error('private provider detail'),{code:'E_RECIPIENT_NOT_ALLOWED'});return {messageId:'test-'+calls.length}}};
const env={DB,CONTACT_EMAIL:sender},cache=new Map();
const processState={env:{NODE_ENV:'production'}};let replyCalls=[],replyStatus=200,networkError=false;
const fakeFetch=async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');replyCalls.push({body:JSON.parse(options.body),headers:options.headers});if(networkError)throw new Error('private network failure');return new Response(JSON.stringify(replyStatus===200?{id:'reply-'+replyCalls.length}:{message:'private provider error'}),{status:replyStatus});};
function load(file){file=resolve(file);if(cache.has(file))return cache.get(file).exports;const m={exports:{}};cache.set(file,m);
 const require=name=>{
  if(name==='@/lib/cloudflare')return {getEnv:async()=>env};
  if(name==='@opennextjs/cloudflare')return {getCloudflareContext:async()=>({env})};
  if(name==='@/lib/auth')return {requireAuth:async r=>{const c=r.headers.get('cookie');if(c==='role=payments')throw new Error('Forbidden');if(c!=='role=admin')throw new Error('Unauthorized');return {role:'admin'}}};
  if(name==='next/server')return req('next/server');
  return load((name.startsWith('@/')?resolve('src',name.slice(2)):resolve(dirname(file),name))+'.ts');
 };
 vm.runInNewContext(ts.transpile(readFileSync(file,'utf8'),{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}),{module:m,exports:m.exports,require,Error,URL,Request,Response,Headers,Date,Map,Set,console,setTimeout,clearTimeout,process:processState,fetch:fakeFetch,AbortSignal});return m.exports;
}

const route=load('src/app/api/contact/route.ts'),reply=load('src/lib/contact-auto-reply.ts');
let serial=0;
async function submit(email='visitor'+(++serial)+'@example.com'){
 const r=await route.POST(new Request('https://site.test/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Guest',email,message:'Visitor content must not appear in auto-reply: https://example.invalid'})}));assert.equal(r.status,201);return r.json();
}
const status=id=>sql.prepare('SELECT * FROM contact_auto_replies WHERE contact_id=?').get(id);
await submit();assert.equal(replyCalls.length,0,'Disabled by default');
env.CONTACT_AUTO_REPLY_ENABLED='true';await submit();assert.equal(replyCalls.length,0,'Missing config does not fail saving contact');
env.RESEND_API_KEY='fake-key';env.CONTACT_AUTO_REPLY_FROM='hello@notify.example.com';env.CONTACT_AUTO_REPLY_REPLY_TO='team@example.com';
const first=await submit('Visitor@example.com');assert.equal(status(first.id).status,'accepted');assert.equal(replyCalls.length,1);
const body=replyCalls[0].body;assert.deepEqual(body.to,['visitor@example.com']);assert.equal(body.reply_to,'team@example.com');assert.equal(body.text,reply.CONTACT_AUTO_REPLY_TEXT);assert.ok(!body.html.includes('example.invalid'));assert.equal(body.headers['Auto-Submitted'],'auto-replied');assert.equal(replyCalls[0].headers['Idempotency-Key'],'emaal-contact-reply-v1/'+first.id);
await Promise.all([reply.sendContactAutoReply(first),reply.sendContactAutoReply(first)]);assert.equal(replyCalls.length,1,'Same contact cannot resend');
const repeated=await submit('visitor@example.com');assert.equal(status(repeated.id),undefined);assert.equal(replyCalls.length,1,'Repeat email has cooldown');
sql.prepare('UPDATE contact_auto_replies SET created_at=? WHERE contact_id=?').run(Date.now()-16*60*1000,first.id);await submit('visitor@example.com');assert.equal(replyCalls.length,2,'Later inquiry can receive acknowledgement');
replyStatus=422;const rejected=await submit();assert.equal(status(rejected.id).status,'failed');assert.equal(status(rejected.id).error_code,'PROVIDER_REJECTED');assert.ok(!JSON.stringify(status(rejected.id)).includes('private provider'));
replyStatus=500;const uncertain=await submit();assert.equal(status(uncertain.id).status,'unconfirmed');
networkError=true;const timeout=await submit();assert.equal(status(timeout.id).status,'unconfirmed');networkError=false;replyStatus=200;
processState.env.NODE_ENV='development';const count=replyCalls.length;await submit();assert.equal(replyCalls.length,count,'Local dev never sends');processState.env.NODE_ENV='production';
const bad=await route.POST(new Request('https://site.test/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Guest',email:'guest@example.com\r\nBcc: bad@example.com',message:'test'})}));assert.equal(bad.status,400);assert.equal(replyCalls.length,count);
sql.close();console.log('PASS visitor auto-reply: exact template, recipient, default-off/local isolation, saved-contact-first, independent failures, once-per-contact and recipient cooldown, provider uncertainty, sanitized errors, invalid input. Fake transport only.');
