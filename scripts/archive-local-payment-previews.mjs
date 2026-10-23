// Reversible LOCAL cleanup. Never delete financial history or touch remote D1.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {getPlatformProxy} from 'wrangler';
if(process.argv.slice(2).join(' ')!=='--local-only')throw new Error('Requires --local-only; no remote mode exists.');
const slugs=['tabadul-payment-preview','tabadul-live-pilot'];
const p=await getPlatformProxy({remoteBindings:false});
const db=p.env.DB;
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
async function financialSnapshot(){
 const result={};for(const [table,order] of [['ibs_bookings','id'],['ibs_payment_events','provider,event_id'],['ibs_tabadul_attempts','booking_id']])result[table]=(await db.prepare(`SELECT * FROM ${table} ORDER BY ${order}`).all()).results;
 return hash(result);
}
try{
 const before=await financialSnapshot();
 const otherBefore=hash((await db.prepare('SELECT * FROM ibs_editions WHERE slug NOT IN (?,?) ORDER BY slug').bind(...slugs).all()).results);
 const editions=(await db.prepare('SELECT * FROM ibs_editions WHERE slug IN (?,?) ORDER BY slug').bind(...slugs).all()).results;
 const settings=(await db.prepare('SELECT * FROM ibs_booking_settings WHERE edition_slug IN (?,?) ORDER BY edition_slug').bind(...slugs).all()).results;
 const env=readFileSync('.dev.vars','utf8');
 mkdirSync('.wrangler/backups',{recursive:true});
 const file=`.wrangler/backups/payment-previews-before-archive-${Date.now()}.json`;
 writeFileSync(file,JSON.stringify({editions,settings,financialHash:before},null,2),{flag:'wx'});
 const next=env.replace(/^PAYMENT_CHECKOUTS_DISABLED=.*(?:\r?\n|$)/gm,'').trimEnd()+'\nPAYMENT_CHECKOUTS_DISABLED="true"\n';
 // Retain all existing credentials verbatim; only add the new-checkout pause.
 writeFileSync('.dev.vars',next);
 const now=Date.now();
 await db.batch([
  db.prepare('UPDATE ibs_editions SET published=0,updated_at=? WHERE slug IN (?,?)').bind(now,...slugs),
  ...settings.map(row=>db.prepare('UPDATE ibs_booking_settings SET config_json=?,updated_at=? WHERE edition_slug=?').bind(JSON.stringify({...JSON.parse(row.config_json),enabled:false}),now,row.edition_slug)),
 ]);
 assert.equal(await financialSnapshot(),before,'Financial records must stay byte-for-byte unchanged');
 assert.equal(hash((await db.prepare('SELECT * FROM ibs_editions WHERE slug NOT IN (?,?) ORDER BY slug').bind(...slugs).all()).results),otherBefore,'Real edition content must not change');
 console.log(JSON.stringify({archived:editions.map(x=>x.slug),financialRecordsUnchanged:true,realEditionsUnchanged:true,backup:file,newCheckoutsPaused:true}));
}finally{await p.dispose();}
