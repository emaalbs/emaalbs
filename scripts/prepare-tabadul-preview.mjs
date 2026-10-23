// A dedicated LOCAL demo; never run this against production or copy it into live content.
import { getPlatformProxy } from 'wrangler';
if (process.argv.length > 2) throw new Error('No remote options accepted. Local only.');
const proxy=await getPlatformProxy({remoteBindings:false});
const db=proxy.env.DB;
const slug='tabadul-payment-preview';
try {
  if (await db.prepare('SELECT slug FROM ibs_editions WHERE slug=?').bind(slug).first()) {
    console.log('Existing local demo preserved.');
  } else {
    const hero=await db.prepare("SELECT hero_image FROM ibs_editions WHERE slug='1st-edition-2025'").first();
    const config={enabled:true,title:{en:'Try the booking experience',ar:'جرّب حجز مقعدك'},description:{en:'A private local demonstration of the Tabadul payment integration. Choose a simulated response after submitting your details.',ar:'تجربة محلية لربط بوابة تبادل. بعد إدخال البيانات، يمكنك اختيار استجابة دفع وهمية لاختبار الحجز.'},buttonLabel:{en:'Start simulation',ar:'ابدأ المحاكاة'},terms:{en:'SIMULATION ONLY. No ticket is sold and no money is charged. Do not enter card details.',ar:'محاكاة فقط. لا تُباع تذكرة ولا يُخصم أي مبلغ. لا تدخل بيانات بطاقة مصرفية.'},amountMinor:1000000,currency:'IQD',capacity:100};
    await db.batch([
      db.prepare(`INSERT INTO ibs_editions(slug,year,status,edition_label_en,edition_label_ar,title_en,title_ar,summary_en,summary_ar,location_en,location_ar,hero_image,published,sort_order,created_at,updated_at)
        VALUES(?,2026,'upcoming','LOCAL DEMO','تجربة محلية','Tabadul payment preview','تجربة الدفع عبر تبادل','Local simulation only — not a real event.','محاكاة محلية فقط — ليست فعالية حقيقية.','Local preview','النسخة المحلية',?,1,999,?,?)`).bind(slug,hero?.hero_image || '/Logo.webp',Date.now(),Date.now()),
      db.prepare('INSERT INTO ibs_booking_settings(edition_slug,config_json,updated_at) VALUES(?,?,?)').bind(slug,JSON.stringify(config),Date.now()),
    ]);
    console.log('Created one local-only IQD 1,000 simulation edition. Existing editions unchanged.');
  }
  console.log(`http://localhost:3000/ar/ibs/${slug}?paymentPreview=tabadul#booking`);
} finally { await proxy.dispose(); }
