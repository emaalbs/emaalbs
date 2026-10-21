// Explicit editorial corrections, LOCAL D1 only. No production connection or deployment.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getPlatformProxy } from 'wrangler';

assert.equal(path.basename(process.cwd()), 'emaal-website-test');
assert.ok(process.argv.slice(2).every(a => a === '--apply'), 'Only --apply is supported; remote writes are forbidden.');
const apply = process.argv.includes('--apply');
const backup = '.wrangler/backups/local-before-ar-punctuation-20261020.sql';
if (apply) assert.ok(existsSync(backup), 'Back up local D1 before applying.');
// Keep complete sentences, quotations, decimal values, URLs and English fields intact.
const edits = [
 ['hero_slides','description_ar','صنّاع القرار الحكوميين، وشركات التأمين، ومقدمي خدمات الرعاية الصحية، وقادة القطاع الخاص، والجهات المعنية الدولية؛ لمناقشة','صنّاع القرار الحكوميين وشركات التأمين ومقدمي خدمات الرعاية الصحية وقادة القطاع الخاص والجهات المعنية الدولية لمناقشة'],
 ['hero_slides','description_ar','وتطوير خدمات الرعاية الصحية - بغداد، فندق موفنبيك.','وتطوير خدمات الرعاية الصحية. المكان: بغداد، فندق موفنبيك.'],
 ['hero_slides','description_ar','من خلال القمة  نجمع','من خلال القمة، نجمع'],
 ['hero_slides','description_ar','المحلية مع الأسواق العالمية، يبدأ في بغداد','المحلية مع الأسواق العالمية. يبدأ في بغداد'],
 ['hero_slides','description_ar','في يناير 2027، ويهدف هذا المؤتمر','في يناير 2027. ويهدف هذا المؤتمر'],
 ['blogs','content_ar','الحوار والشراكات، و فرص الأعمال','الحوار والشراكات وفرص الأعمال'],
 ['blogs','content_ar','جودة الخدمة و استدامة التمويل','جودة الخدمة واستدامة التمويل'],
 ['blogs','content_ar','رئيس مجلس الإدارة التنفيذي لشركة الأولى التمويلية.','رئيس مجلس الإدارة التنفيذي لشركة الأولى التمويلية'],
 ['blogs','content_ar','مؤسس ومدير شرطة شركة Al-Ittihad.','مؤسس ومدير شرطة شركة Al-Ittihad'],
 ['blogs','content_ar','كلمة المدير العام لصندوق الضمان الصحي علي أحمد عبيد.','كلمة المدير العام لصندوق الضمان الصحي علي أحمد عبيد'],
 ['blogs','content_ar','كلمة المدير التنفيذي لشركة أعمال الدكتور علي وجيه محجوب.','كلمة المدير التنفيذي لشركة أعمال الدكتور علي وجيه محجوب'],
 ['magazines','title_ar','من بغداد إلى دافوس ... إرسال الأعمال العراقية إلى المسرح العالمي','من بغداد إلى دافوس: إرسال الأعمال العراقية إلى المسرح العالمي'],
 ['magazines','description_ar','الشراكات الكبيرة.IBS','الشراكات الكبيرة. IBS'],
 ['magazines','description_ar','ليس معرضًا، أو منصة للظهور مؤقتًا، أو مساعدة تقليدية','ليس معرضًا أو منصة للظهور مؤقتًا أو مساعدة تقليدية'],
 ['social_posts','title_ar','الضمان الصحي : الإصلاح','الضمان الصحي: الإصلاح'],
 ['social_posts','title_ar','تختتم جلساتها… والعمل يبدأ فوراً.','تختتم جلساتها والعمل يبدأ فوراً'],
 ['social_posts','caption_ar','الرابط التالي :','الرابط التالي:'],
 ['ibs_editions','location_ar',' -  بغداد','، بغداد'],
 ['ibs_booking_settings','config_json','احجز مكانك في القمة.','احجز مكانك في القمة'],
];
const proxy = await getPlatformProxy({ remoteBindings: false });
try {
 const db = proxy.env.DB;
 const tables = [...new Set(edits.map(e=>e[0]))];
 const rows = new Map();
 const changes = [];
 for (const table of tables) rows.set(table,(await db.prepare(`SELECT rowid AS _rowid_, * FROM ${table}`).all()).results);
 for (const [table,list] of rows) for (const row of list) {
  const fields=[...new Set(edits.filter(e=>e[0]===table).map(e=>e[1]))];
  for(const column of fields){
   const before=row[column];
   if(typeof before!=='string') continue;
   let after=before;
   for(const [t,c,oldText,newText] of edits) if(t===table&&c===column) after=after.replaceAll(oldText,newText);
   if(after!==before){
    if(column==='content_ar'||column==='config_json') JSON.parse(after);
    changes.push({table,rowid:row._rowid_,column,before,after});
   }
  }
 }
 await mkdir('.wrangler/arabic-review',{recursive:true});
 await writeFile(`.wrangler/arabic-review/cms-${Date.now()}.json`,JSON.stringify({apply,backup,changes},null,2));
 if(apply&&changes.length) {
  const results=await db.batch(changes.map(c=>db.prepare(`UPDATE ${c.table} SET ${c.column}=? WHERE rowid=? AND ${c.column}=?`).bind(c.after,c.rowid,c.before)));
  assert.ok(results.every(r=>r.meta.changes===1),'Concurrent modification: inspect report.');
 }
 for(const c of changes) console.log(`${apply?'UPDATED':'PROPOSED'} ${c.table} row ${c.rowid}: ${c.column}`);
 // Check every field of each affected record, including the English and media columns.
 if(apply) for(const [table,list] of rows) for(const before of list){
  const expected={...before};
  for(const c of changes.filter(c=>c.table===table&&c.rowid===before._rowid_))expected[c.column]=c.after;
  const after=await db.prepare(`SELECT rowid AS _rowid_, * FROM ${table} WHERE rowid=?`).bind(before._rowid_).first();
  assert.deepEqual(after,expected);
 }
 console.log(`${changes.length} Arabic fields ${apply?'updated; all other fields unchanged':'proposed'}. Production untouched.`);
} finally { await proxy.dispose(); }
