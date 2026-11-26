"use client";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Check, ExternalLink, Plus, Save, Trash2 } from "lucide-react";
import { BilingualField } from "@/components/admin/BilingualField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { PdfUpload } from "@/components/admin/PdfUpload";
import { DEFAULT_WELCOME_PAGE, MAX_WELCOME_DOWNLOADS, parseWelcomePage, type WelcomeDownload, type WelcomePageSettings, type WelcomeText } from "@/data/welcome-page";
const texts = [
 ["kicker", "Small heading / العنوان التعريفي", false],
 ["title", "Main title / العنوان الرئيسي", true],
 ["description", "Description / الوصف", true],
 ["dateLine", "Dates / المواعيد", true],
 ["locationLine", "Image caption / النص على الصورة", true],
 ["registrationLabel", "Registration button / زر التسجيل", false],
 ["enterLabel", "Enter website button / زر الدخول للموقع", false],
] as const;
export default function WelcomePageAdmin() {
 const [data,setData]=useState<WelcomePageSettings>(DEFAULT_WELCOME_PAGE);
 const [loading,setLoading]=useState(true),[loadFailed,setLoadFailed]=useState(false),[saving,setSaving]=useState(false),[saved,setSaved]=useState(false),[error,setError]=useState("");
 const [uploading,setUploading]=useState<Record<string,boolean>>({});
 useEffect(()=>{fetch("/api/welcome-page",{cache:"no-store"}).then(async r=>{if(!r.ok)throw new Error("Unable to load settings / تعذر تحميل الإعدادات");setData(parseWelcomePage(await r.json()));}).catch(e=>{setError(e.message);setLoadFailed(true);}).finally(()=>setLoading(false));},[]);
 function change<K extends keyof WelcomePageSettings>(key:K,value:WelcomePageSettings[K]){setData(d=>({...d,[key]:value}));setSaved(false);}
 function localized(key:Exclude<keyof WelcomePageSettings,"enabled"|"imageUrl"|"downloads">,locale:"en"|"ar",value:string){setData(d=>({...d,[key]:{...d[key],[locale]:value}}));setSaved(false);}
 function updateFile(id:string,patch:Partial<WelcomeDownload>){setData(d=>({...d,downloads:d.downloads.map(file=>file.id===id?{...file,...patch}:file)}));setSaved(false);}
 function fileText(id:string,key:"title"|"description"|"url",locale:"en"|"ar",value:string){setData(d=>({...d,downloads:d.downloads.map(file=>file.id===id?{...file,[key]:{...file[key],[locale]:value}}:file)}));setSaved(false);}
 function addFile(){setData(d=>d.downloads.length>=MAX_WELCOME_DOWNLOADS?d:{...d,downloads:[...d.downloads,{id:crypto.randomUUID(),visible:false,title:{en:"",ar:""},description:{en:"",ar:""},url:{en:"",ar:""}}]});setSaved(false);}
 function moveFile(id:string,direction:number){setData(d=>{const files=[...d.downloads],index=files.findIndex(file=>file.id===id),next=index+direction;if(index<0||next<0||next>=files.length)return d;[files[index],files[next]]=[files[next],files[index]];return {...d,downloads:files};});setSaved(false);}
 function removeFile(id:string){if(!window.confirm("Remove this file from the welcome page? Save to apply.\nحذف هذا الملف من الصفحة الترحيبية؟ يُطبّق الحذف بعد الحفظ."))return;setData(d=>({...d,downloads:d.downloads.filter(file=>file.id!==id)}));setSaved(false);}
 async function save(){setSaving(true);setSaved(false);setError("");try{const settings=parseWelcomePage(data);const r=await fetch("/api/welcome-page",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(settings)});const body=await r.json();if(!r.ok)throw new Error((body as {error?:string}).error||"Save failed");setData(parseWelcomePage(body));setSaved(true);}catch(e){setError(e instanceof Error?e.message:"Save failed");}finally{setSaving(false);}}
 if(loading)return <p role="status">Loading welcome page… / جارٍ التحميل</p>;
 const box="space-y-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-7";
 const busy=saving||loadFailed||Object.values(uploading).some(Boolean);
 const control="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-50 focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-40";
 return <div className="mx-auto max-w-5xl space-y-6 pb-12">
  <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-gray-900">Welcome Page / الصفحة الترحيبية</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">A welcome page before the homepage. Visitors can continue to EMAAL at any time.<br/>تظهر قبل الصفحة الرئيسية مرة في جلسة التصفح، ويمكن للزائر الدخول إلى الموقع مباشرة.</p></div>
   <button type="button" onClick={save} disabled={saving||loadFailed||Object.values(uploading).some(Boolean)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#01334D] px-5 py-3 font-semibold text-white disabled:opacity-50 hover:bg-[#006666] focus-visible:outline-2">{saved?<Check size={18}/>:<Save size={18}/>} {saving?"Saving…":saved?"Saved / تم الحفظ":"Save / حفظ"}</button>
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
  <div id="download-files" className="space-y-2">
   <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold text-gray-900">Download files / ملفات التحميل ({data.downloads.length})</h2><button type="button" data-add-file onClick={addFile} disabled={busy||data.downloads.length>=MAX_WELCOME_DOWNLOADS} className={control}><Plus size={18}/>Add file / إضافة ملف</button></div>
   <p className="text-sm leading-6 text-gray-500">Add a title, optional description and PDF for each file. Use the arrows to reorder, or hide a file without deleting it. Save to apply.<br/>أضف عنوانًا ووصفًا اختياريًا وملف PDF لكل عنصر. استخدم الأسهم للترتيب أو أخفِ الملف دون حذفه، ثم احفظ التعديلات. الملفات الجديدة مخفية حتى تُفعّل إظهارها.</p>
  </div>
  {data.downloads.length===0&&<p className={box}>No files yet. Choose “Add file” to start. / لا توجد ملفات. اضغط «إضافة ملف» للبدء.</p>}
  {data.downloads.map((file,index)=><section key={file.id} className={box} data-agenda-upload={index+1} data-file-id={file.id}>
   <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-bold">File {index+1} / الملف {index+1}</h3><div className="flex flex-wrap gap-2">
    <button type="button" data-move-up aria-label={`Move file ${index+1} up / نقل الملف للأعلى`} className={control} disabled={busy||index===0} onClick={()=>moveFile(file.id,-1)}><ArrowUp size={18}/></button>
    <button type="button" data-move-down aria-label={`Move file ${index+1} down / نقل الملف للأسفل`} className={control} disabled={busy||index===data.downloads.length-1} onClick={()=>moveFile(file.id,1)}><ArrowDown size={18}/></button>
    <button type="button" data-remove-file className={`${control} text-red-700`} disabled={busy} onClick={()=>removeFile(file.id)}><Trash2 size={17}/>Delete / حذف</button>
   </div></div>
   <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold"><input type="checkbox" data-file-visible checked={file.visible} disabled={busy} onChange={e=>updateFile(file.id,{visible:e.target.checked})} className="h-5 w-5 accent-[#006666]"/>{file.visible?"Visible on the welcome page / ظاهر في الصفحة الترحيبية":"Hidden from visitors / مخفي عن الزوار"}</label>
   <div data-file-title={index+1}><BilingualField label="File title shown to visitors / عنوان الملف الظاهر للزائر" required={file.visible} enValue={file.title.en} arValue={file.title.ar} onEnChange={v=>fileText(file.id,"title","en",v)} onArChange={v=>fileText(file.id,"title","ar",v)} placeholderEn="e.g. Download the summit agenda" placeholderAr="مثال: تحميل أجندة القمة"/></div>
   <div data-file-description><BilingualField label="Description below the title (optional) / وصف أسفل العنوان (اختياري)" multiline rows={2} enValue={file.description.en} arValue={file.description.ar} onEnChange={v=>fileText(file.id,"description","en",v)} onArChange={v=>fileText(file.id,"description","ar",v)}/></div>
   <p className="text-sm leading-6 text-gray-500">Upload one or both language versions. If only one is available, it is used for both languages.<br/>ارفع نسخة واحدة أو نسختين من الملف. إذا توفرت نسخة واحدة تُستخدم للغتين.</p>
   <div className="grid gap-6 md:grid-cols-2">{(["ar","en"] as const).map(locale=><PdfUpload key={locale} label={locale==="ar"?"الملف بالعربية (اختياري)":"English file (optional)"} value={file.url[locale]} onChange={url=>fileText(file.id,"url",locale,url)} prefix={`welcome/files/${file.id}/`} disabled={saving} onUploadingChange={busy=>setUploading(s=>({...s,[`${file.id}-${locale}`]:busy}))}/>)}</div>
   <div data-file-url><UrlPair label="Or paste an existing PDF link / أو ضع رابط ملف PDF" value={file.url} change={(l,v)=>fileText(file.id,"url",l,v)}/></div>
   <button type="button" onClick={save} disabled={saving||loadFailed||Object.values(uploading).some(Boolean)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#01334D] px-5 py-3 font-semibold text-white disabled:opacity-50 hover:bg-[#006666] focus-visible:outline-2"><Save size={18}/>{saving?"Saving… / جارٍ الحفظ":"Save changes / حفظ التعديلات"}</button>
  </section>)}
  <button type="button" data-save-downloads onClick={save} disabled={busy} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#01334D] px-5 py-3 font-semibold text-white disabled:opacity-50 hover:bg-[#006666] focus-visible:outline-2"><Save size={18}/>{saving?"Saving… / جارٍ الحفظ":"Save files and order / حفظ الملفات وترتيبها"}</button>
  <section className={box}><h2 className="text-lg font-bold">Registration link / رابط التسجيل</h2><p className="text-sm leading-6 text-gray-500">Google Forms or any https:// link. One link can serve both languages. Until a link is added, the button is marked as coming soon. / رابط كوكل فورم أو أي رابط آخر. يكفي رابط واحد للغتين، ويظهر الزر غير مفعّل إلى حين إضافة الرابط.</p><UrlPair label="Registration URL / رابط التسجيل" value={data.registrationUrl} change={(l,v)=>localized("registrationUrl",l,v)}/><UrlPair label="Summit details URL (optional) / رابط تفاصيل القمة (اختياري)" value={data.detailsUrl} change={(l,v)=>localized("detailsUrl",l,v)}/></section>
 </div>;
}
function UrlPair({label,value,change}:{label:string;value:WelcomeText;change:(locale:"ar"|"en",value:string)=>void}){return <fieldset className="space-y-3"><legend className="text-sm font-semibold">{label}</legend><div className="grid gap-4 md:grid-cols-2">{(["en","ar"] as const).map(l=><label key={l} className="space-y-2 text-xs text-gray-600"><span>{l.toUpperCase()}</span><input type="text" dir="ltr" value={value[l]} onChange={e=>change(l,e.target.value)} placeholder="https://…" className="min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-[#006666] focus:outline-none focus:ring-1 focus:ring-[#006666]"/></label>)}</div></fieldset>}
