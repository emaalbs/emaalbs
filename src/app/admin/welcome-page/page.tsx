"use client";
import { useEffect, useState } from "react";
import { Check, ExternalLink, Save } from "lucide-react";
import { BilingualField } from "@/components/admin/BilingualField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { PdfUpload } from "@/components/admin/PdfUpload";
import { DEFAULT_WELCOME_PAGE, parseWelcomePage, type WelcomePageSettings, type WelcomeText } from "@/data/welcome-page";
const texts = [
 ["kicker", "Small heading / العنوان التعريفي", false],
 ["title", "Main title / العنوان الرئيسي", true],
 ["description", "Description / الوصف", true],
 ["dateLine", "Dates / المواعيد", true],
 ["locationLine", "Image caption / النص على الصورة", true],
 ["agendaLabel", "Agenda button / زر الأجندة", false],
 ["registrationLabel", "Registration button / زر التسجيل", false],
 ["enterLabel", "Enter website button / زر الدخول للموقع", false],
] as const;
export default function WelcomePageAdmin() {
 const [data,setData]=useState<WelcomePageSettings>(DEFAULT_WELCOME_PAGE);
 const [loading,setLoading]=useState(true),[loadFailed,setLoadFailed]=useState(false),[saving,setSaving]=useState(false),[saved,setSaved]=useState(false),[error,setError]=useState("");
 const [uploading,setUploading]=useState({en:false,ar:false});
 useEffect(()=>{fetch("/api/welcome-page",{cache:"no-store"}).then(async r=>{if(!r.ok)throw new Error("Unable to load settings / تعذر تحميل الإعدادات");setData(parseWelcomePage(await r.json()));}).catch(e=>{setError(e.message);setLoadFailed(true);}).finally(()=>setLoading(false));},[]);
 function change<K extends keyof WelcomePageSettings>(key:K,value:WelcomePageSettings[K]){setData(d=>({...d,[key]:value}));setSaved(false);}
 function localized(key:Exclude<keyof WelcomePageSettings,"enabled"|"imageUrl">,locale:"en"|"ar",value:string){setData(d=>({...d,[key]:{...d[key],[locale]:value}}));setSaved(false);}
 async function save(){setSaving(true);setSaved(false);setError("");try{const settings=parseWelcomePage(data);const r=await fetch("/api/welcome-page",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(settings)});const body=await r.json();if(!r.ok)throw new Error((body as {error?:string}).error||"Save failed");setData(parseWelcomePage(body));setSaved(true);}catch(e){setError(e instanceof Error?e.message:"Save failed");}finally{setSaving(false);}}
 if(loading)return <p role="status">Loading welcome page… / جارٍ التحميل</p>;
 const box="space-y-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-7";
 return <div className="mx-auto max-w-5xl space-y-6 pb-12">
  <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-gray-900">Welcome Page / الصفحة الترحيبية</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">A welcome page before the homepage. Visitors can continue to EMAAL at any time.<br/>تظهر قبل الصفحة الرئيسية مرة في جلسة التصفح، ويمكن للزائر الدخول إلى الموقع مباشرة.</p></div>
   <button type="button" onClick={save} disabled={saving||loadFailed||uploading.en||uploading.ar} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#01334D] px-5 py-3 font-semibold text-white disabled:opacity-50 hover:bg-[#006666] focus-visible:outline-2">{saved?<Check size={18}/>:<Save size={18}/>} {saving?"Saving…":saved?"Saved / تم الحفظ":"Save / حفظ"}</button>
  </div>
  {error&&<p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}
  {saved&&<p role="status" className="rounded-lg bg-green-50 p-4 text-green-800">Saved. Open a preview below to review. / تم الحفظ، افتح المعاينة لمشاهدة التعديل.</p>}
  <section className={box}>
   <label className="flex cursor-pointer items-center justify-between gap-4"><span><strong className="block">Enable welcome page / إظهار الصفحة الترحيبية</strong><span className="mt-1 block text-sm text-gray-500">Hide it without deleting your content. / يمكنك إخفاؤها دون حذف المحتوى.</span></span><input aria-label="Enable welcome page" type="checkbox" className="h-6 w-6 accent-[#006666]" checked={data.enabled} onChange={e=>change("enabled",e.target.checked)}/></label>
   <div className="flex flex-wrap gap-3">{["ar","en"].map(locale=><a key={locale} href={`/${locale}/welcome`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"><ExternalLink size={16}/> {locale==="ar"?"معاينة العربية":"English preview"}</a>)}</div>
   <p className="text-xs leading-6 text-gray-500">Preview shows saved content even when the welcome page is disabled. Regular homepage visitors see it only when enabled. / المعاينة تعرض المحتوى المحفوظ حتى عند الإخفاء، أما زوار الرئيسية فيشاهدونه عند التفعيل فقط.</p>
  </section>
  <section className={box}><h2 className="text-lg font-bold">Content / المحتوى</h2>{texts.map(([key,label,multiline])=><BilingualField key={key} label={label} multiline={multiline} rows={key==="description"?4:2} required={["title","enterLabel","agendaLabel","registrationLabel"].includes(key)} enValue={data[key].en} arValue={data[key].ar} onEnChange={v=>localized(key,"en",v)} onArChange={v=>localized(key,"ar",v)}/>)}</section>
  <section className={box}><h2 className="text-lg font-bold">Summit image / صورة القمة</h2><ImageUpload value={data.imageUrl} onChange={url=>change("imageUrl",url)} prefix="welcome/" label="Welcome image / صورة الصفحة الترحيبية" preset="blog-cover" recommendedSize="1200 × 1500 px" hint="Keep the focal point in the center for mobile cropping. / ضع العنصر الرئيسي وسط الصورة ليظهر على الهاتف."/><p className="text-xs text-gray-500">The EMAAL logo is included automatically. / شعار أعمال يظهر تلقائيًا.</p></section>
  <section className={box}><h2 className="text-lg font-bold">Downloadable agenda / تحميل الأجندة</h2><p className="text-sm leading-6 text-gray-500">Upload one or both language versions. If only one file is available, it is used for both languages. / يمكنك رفع نسخة واحدة أو نسختين، ويُستخدم الملف المتوفر عند غياب النسخة الأخرى.</p><div className="grid gap-6 md:grid-cols-2">{(["ar","en"] as const).map(locale=><PdfUpload key={locale} label={locale==="ar"?"الأجندة العربية (اختياري)":"English agenda (optional)"} value={data.agendaUrl[locale]} onChange={url=>localized("agendaUrl",locale,url)} prefix="welcome/agenda/" disabled={saving} onUploadingChange={busy=>setUploading(s=>({...s,[locale]:busy}))}/>)}</div><UrlPair label="Or paste an existing PDF link / أو ضع رابط ملف الأجندة" value={data.agendaUrl} change={(l,v)=>localized("agendaUrl",l,v)}/></section>
  <section className={box}><h2 className="text-lg font-bold">Registration link / رابط التسجيل</h2><p className="text-sm leading-6 text-gray-500">Google Forms or any https:// link. One link can serve both languages. Until a link is added, the button is marked as coming soon. / رابط كوكل فورم أو أي رابط آخر. يكفي رابط واحد للغتين، ويظهر الزر غير مفعّل إلى حين إضافة الرابط.</p><UrlPair label="Registration URL / رابط التسجيل" value={data.registrationUrl} change={(l,v)=>localized("registrationUrl",l,v)}/><UrlPair label="Summit details URL (optional) / رابط تفاصيل القمة (اختياري)" value={data.detailsUrl} change={(l,v)=>localized("detailsUrl",l,v)}/></section>
 </div>;
}
function UrlPair({label,value,change}:{label:string;value:WelcomeText;change:(locale:"ar"|"en",value:string)=>void}){return <fieldset className="space-y-3"><legend className="text-sm font-semibold">{label}</legend><div className="grid gap-4 md:grid-cols-2">{(["en","ar"] as const).map(l=><label key={l} className="space-y-2 text-xs text-gray-600"><span>{l.toUpperCase()}</span><input type="text" dir="ltr" value={value[l]} onChange={e=>change(l,e.target.value)} placeholder="https://…" className="min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-[#006666] focus:outline-none focus:ring-1 focus:ring-[#006666]"/></label>)}</div></fieldset>}
