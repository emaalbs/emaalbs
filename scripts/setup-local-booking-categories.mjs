// LOCAL ONLY. Creates a clearly labelled demonstration, never copies payment data.
import {getPlatformProxy} from 'wrangler';
const proxy=await getPlatformProxy({remoteBindings:false});
try {
 if(proxy.env.LOCAL_BOOKING_SIMULATION!=='true' || proxy.env.PAYMENT_CHECKOUTS_DISABLED!=='true')throw new Error('Expected explicit local simulation with real checkout paused.');
 const db=proxy.env.DB,slug='booking-categories-preview';
 const existing=await db.prepare('SELECT slug FROM ibs_editions WHERE slug=?').bind(slug).first();
 if(existing){console.log('Local demo already exists; preserving administrator changes.');}
 else {
  const hero=await db.prepare("SELECT hero_image FROM ibs_editions WHERE published=1 AND hero_image IS NOT NULL AND hero_image<>'' LIMIT 1").first();
  const config={enabled:true,title:{en:'Choose your place at IBS',ar:'اختر فئة حضورك في القمة'},description:{en:'A local preview of Guest and VIP bookings. All prices, dates and places on this page are examples for testing only.',ar:'معاينة محلية لفئات الضيوف وVIP. الأسعار والتواريخ والمكان في هذه الصفحة أمثلة للتجربة فقط.'},buttonLabel:{en:'Reserve your place',ar:'احجز مقعدك'},terms:{en:'Local simulation only. No money is charged and this receipt is not valid for entry.',ar:'محاكاة محلية فقط. لا يُخصم أي مبلغ، والوصل التجريبي غير صالح للدخول.'},currency:'IQD',amountMinor:25000000,capacity:null,tiers:[{id:'guest',name:{en:'Guest',ar:'الضيوف'},amountMinor:25000000,capacity:20,enabled:true},{id:'vip',name:{en:'VIP',ar:'كبار الضيوف — VIP'},amountMinor:75000000,capacity:10,enabled:true}]};
  await db.batch([
   db.prepare("INSERT INTO ibs_editions(slug,year,status,title_en,title_ar,edition_label_en,edition_label_ar,summary_en,summary_ar,dates_en,dates_ar,location_en,location_ar,hero_image,published,sort_order) VALUES(?,2027,'upcoming','Booking categories — LOCAL PREVIEW','فئات الحجز — تجربة محلية','Local preview','معاينة محلية',?,?,'15 January 2027 — example only','15 يناير 2027 — موعد افتراضي','Baghdad — example venue','بغداد — مكان افتراضي',?,1,9999)").bind(slug,config.description.en,config.description.ar,hero?.hero_image||'/Logo.webp'),
   db.prepare('INSERT INTO ibs_booking_settings(edition_slug,config_json,updated_at) VALUES(?,?,?)').bind(slug,JSON.stringify(config),Date.now()),
  ]);
  console.log('Created local demo with Guest / VIP. Real checkout stays paused; no live data changed.');
 }
} finally {await proxy.dispose();}
