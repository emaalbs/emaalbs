// In-memory SQLite and synthetic customer data only. No gateway, live DB or real exports.
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import ExcelJS from 'exceljs';
const sql=new DatabaseSync(':memory:');
sql.exec("CREATE TABLE admin_users(id INTEGER PRIMARY KEY,username TEXT,is_super_admin INTEGER,role TEXT); INSERT INTO admin_users VALUES(1,'owner',1,'super_admin'),(2,'cashier',0,'payments'); CREATE TABLE ibs_editions(slug TEXT PRIMARY KEY,title_ar TEXT,title_en TEXT); INSERT INTO ibs_editions VALUES('summit','قمة تجريبية','Test summit');");
for(const file of ['0020_edition_bookings.sql','0026_booking_tiers_receipts.sql'])sql.exec(readFileSync('db/migrations/'+file,'utf8'));
globalThis.__exportDB={prepare(query){let args=[];return {bind(...values){args=values;return this;},async first(){return sql.prepare(query).get(...args)||null;},async all(){return {results:sql.prepare(query).all(...args)};}};},async batch(statements){return Promise.all(statements.map(s=>s.all()));}};
process.env.ADMIN_SESSION_SECRET='local-test-export-secret-not-a-real-credential';
mkdirSync('.wrangler/export-qa',{recursive:true});
const outfile=resolve('.wrangler/export-qa/test-routes.cjs');
await build({stdin:{contents:`export * as auth from './src/lib/auth'; export * as list from './src/app/api/admin/payments/route'; export * as report from './src/app/api/admin/payments/export/route'; export { createPaymentWorkbook } from './src/lib/payment-excel';`,resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'cjs',packages:'external',outfile,
 plugins:[{name:'local-db',setup(b){b.onResolve({filter:/cloudflare$/},a=>a.path==='@/lib/cloudflare'?{path:a.path,namespace:'fixture'}:null);b.onLoad({filter:/.*/,namespace:'fixture'},()=>({contents:'export async function getEnv(){return {DB:globalThis.__exportDB,ADMIN_SECRET:process.env.ADMIN_SESSION_SECRET}}',loader:'js'}));}}]});
const req=createRequire(resolve('package.json'));const {auth,list,report,createPaymentWorkbook}=req(outfile);
const token=await auth.signSession({userId:2,username:'cashier',isSuperAdmin:false,role:'payments'},process.env.ADMIN_SESSION_SECRET);
const call=(route,query='',session=token)=>route.GET(new Request('https://local.test/api/admin/payments'+(route===report?'/export':'')+query,{headers:session?{Cookie:'emmal-session='+session}:{}}));
const start=Date.parse('2026-11-18T00:00:00+03:00');let serial=0;
const malicious='=HYPERLINK("https://example.invalid","not a formula")';
function seed({status='paid',currency='IQD',provider='tabadul',paid=true,refunded=false,time=start,name='عميل تجريبي',amount=1000000,edition='summit'}={}){
 const id='report-'+(++serial);
 sql.prepare(`INSERT INTO ibs_bookings(id,edition_slug,offer_title,customer_name,email,phone,locale,amount_minor,currency,status,provider,access_hash,request_hash,terms_snapshot,provider_session,transaction_id,expires_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
 .run(id,edition,'{}',name,'test@example.invalid','+96407700000000','ar',amount,currency,status,provider,'private-'+id,'private-hash','{}','session-'+id,'txn-'+id,Date.now()+600000,time,time);
 if(paid)sql.prepare('INSERT INTO ibs_payment_events VALUES(?,?,?,?,?)').run(provider,'paid-'+id,id,'paid',time+1000);
 if(refunded)sql.prepare('INSERT INTO ibs_payment_events VALUES(?,?,?,?,?)').run(provider,'refund-'+id,id,'refunded',time+2000);
 return id;
}
const formulaId=seed({name:malicious});for(let i=0;i<29;i++)seed();
seed({currency:'USD',amount:12345});seed({status:'failed',paid:false});seed({status:'pending',paid:false});seed({status:'review'});seed({refunded:true});seed({paid:false});
seed({provider:'mock'});seed({time:start-1});seed({time:start+86400000});
const filter='?from=2026-11-18&to=2026-11-18';
assert.equal((await call(report,filter,'')).status,401);
const screen=await(await call(list,filter)).json();const response=await call(report,filter+'&page=2');
assert.match(response.headers.get('cache-control'),/no-store/);assert.match(response.headers.get('cache-control'),/private/);
const data=await response.json();assert.equal(data.total,36);assert.equal(data.payments.length,36);assert.equal(screen.payments.length,25);assert.deepEqual(data.summary,screen.summary);
assert.equal(data.summary.find(s=>s.currency==='IQD').confirmed_minor,30000000);assert.equal(data.summary.find(s=>s.currency==='USD').confirmed_minor,12345);
assert.equal(data.summary.find(s=>s.currency==='IQD').review_count,3);
assert.equal((await(await call(report,filter+'&mode=simulation')).json()).total,1);
assert.equal((await(await call(report,filter+'&status=paid&currency=IQD')).json()).total,30);
assert.equal((await(await call(report,filter+'&q=%25')).json()).total,0);
assert.equal((await(await call(report,filter+'&q='+encodeURIComponent(malicious))).json()).total,1);
for(const query of ['?from=2026-02-30','?from=2026-11-19&to=2026-11-18','?status=oops',"?edition=' OR 1=1 --"]){const r=await call(report,query);assert.ok(r.status===400||(await r.json()).total===0);}
for(const row of data.payments)for(const field of ['access_hash','request_hash','checkout_url','receipt_token','terms_snapshot'])assert.ok(!(field in row),field+' never exported');
const exported=await createPaymentWorkbook(data);assert.match(exported.filename,/\.xlsx$/);
writeFileSync('.wrangler/export-qa/report-fixture.xlsx',exported.bytes);writeFileSync('.wrangler/export-qa/report-fixture.json',JSON.stringify(data));
const workbook=new ExcelJS.Workbook();await workbook.xlsx.load(exported.bytes);
assert.equal(workbook.worksheets.length,2);const sheet=workbook.getWorksheet('العمليات'),summary=workbook.getWorksheet('الملخص');
assert.equal(sheet.rowCount,37);assert.equal(sheet.views[0].rightToLeft,true);assert.equal(sheet.views[0].ySplit,1);assert.ok(sheet.autoFilter);
let formulaRow;sheet.eachRow(row=>{if(row.getCell(1).value===formulaId)formulaRow=row;});
assert.equal(formulaRow.getCell(2).type,ExcelJS.ValueType.String);assert.equal(formulaRow.getCell(2).value,malicious);assert.equal(formulaRow.getCell(4).value,'+96407700000000');
assert.equal(formulaRow.getCell(8).value,1000);assert.equal(formulaRow.getCell(9).value,1000);assert.equal(formulaRow.getCell(13).value.toISOString(),'2026-11-18T00:00:00.000Z');
sheet.eachRow((row,n)=>{if(n===1)return;for(const col of [1,2,3,4,5,6,7,10,11,12,15,16])assert.notEqual(row.getCell(col).type,ExcelJS.ValueType.Formula);if(row.getCell(11).value!=='دفع مؤكد')assert.equal(row.getCell(9).value,0);});
for(let r=12;r<=13;r++){const currency=summary.getCell(r,1).value;const records=data.payments.filter(p=>p.currency===currency);assert.equal(summary.getCell(r,2).result,records.length);assert.equal(summary.getCell(r,4).result,records.filter(p=>p.payment_state==='paid').reduce((n,p)=>n+p.amount_minor,0)/(currency==='IQD'?1000:100));assert.match(summary.getCell(r,4).formula,/^SUMIF/);}
// Deleted editions keep their booking history and fall back to the edition identifier.
seed({edition:'deleted-edition'});assert.equal((await(await call(report,'?edition=deleted-edition')).json()).payments[0].edition_title,'deleted-edition');
sql.prepare('UPDATE admin_users SET role=? WHERE id=2').run('invalid');assert.equal((await call(report)).status,403);
sql.prepare('DELETE FROM admin_users WHERE id=2').run();assert.equal((await call(report)).status,401);
sql.prepare("INSERT INTO admin_users VALUES(2,'cashier',0,'payments')").run();
sql.exec('BEGIN');for(let i=0;i<10001;i++)seed({edition:'many',status:'failed',paid:false});sql.exec('COMMIT');
const capped=await call(report,'?edition=many');assert.equal(capped.status,413);assert.equal((await capped.json()).error,'export_too_large');
sql.close();delete globalThis.__exportDB;
console.log('PASS: authenticated payments-role export; all pages, shared filters/summary, Baghdad boundaries, real/simulation and currencies, refunds/reviews excluded, secret exclusion, revoked access, 10,000 cap, valid styled XLSX, safe string cells, phone numbers, numeric amounts and cached summary formulas.');
