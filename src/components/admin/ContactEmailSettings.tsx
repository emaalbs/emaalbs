"use client";

import { useEffect, useState } from "react";
import { Mail, Save, Send } from "lucide-react";
import { contactEmailError, type ContactEmailDelivery, type ContactEmailSettings as Settings } from "@/lib/contact-email-config";

export function ContactEmailSettings() {
	const [settings,setSettings]=useState<Settings>({enabled:false,emails:["",""]});
	const [saved,setSaved]=useState("");
	const [service,setService]=useState(false);
	const [loading,setLoading]=useState(true);
	const [busy,setBusy]=useState<"save"|"test"|null>(null);
	const [notice,setNotice]=useState("");
	const [error,setError]=useState("");
	const [deliveries,setDeliveries]=useState<ContactEmailDelivery[]>([]);
	useEffect(()=>{let active=true;(async()=>{
		try {const r=await fetch("/api/admin/contact-email");if(!r.ok)throw new Error("تعذّر تحميل الإعدادات / Could not load settings");const data=await r.json() as {settings:Settings;serviceAvailable:boolean};if(active){setSettings(data.settings);setSaved(JSON.stringify(data.settings));setService(data.serviceAvailable);}}
		catch(e){if(active)setError(e instanceof Error?e.message:"تعذّر تحميل الإعدادات");}
		finally{if(active)setLoading(false);}
	})();return()=>{active=false;};},[]);
	const dirty=JSON.stringify(settings)!==saved;
	async function perform(action:"save"|"test") {
		setBusy(action);setNotice("");setError("");setDeliveries([]);
		try {
			const r=await fetch("/api/admin/contact-email",{method:action==="save"?"PUT":"POST",headers:{"Content-Type":"application/json"},...(action==="save"?{body:JSON.stringify(settings)}:{})});
			const data=await r.json() as {settings:Settings;deliveries:ContactEmailDelivery[];error?:string};if(!r.ok)throw new Error(data.error||"تعذّر إكمال الطلب / Request failed");
			if(action==="save"){setSettings(data.settings);setSaved(JSON.stringify(data.settings));setNotice("تم حفظ إعدادات إشعارات البريد / Email notification settings saved");}
			else {setDeliveries(data.deliveries);setNotice("اكتمل اختبار الإرسال. تحقق من الوارد والبريد غير المرغوب / Check your inbox and spam folder.");}
		}catch(e){setError(e instanceof Error?e.message:"تعذّر الاتصال / Connection failed");}
		finally{setBusy(null);}
	}
	return <section dir="rtl" aria-label="إشعارات البريد الإلكتروني" style={{fontFamily:"var(--font-arabic), Arial, sans-serif"}} className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
		<div className="mb-5 flex flex-wrap items-start justify-between gap-4">
			<div><h2 className="flex flex-wrap items-center gap-2 text-lg font-bold text-[var(--color-navy)]"><Mail className="h-5 w-5 shrink-0 text-[var(--color-teal)]"/><span>إشعارات البريد الإلكتروني</span><span className="text-sm font-normal text-gray-500">Email notifications</span></h2><p className="mt-2 max-w-3xl text-sm leading-7 text-gray-600">استلم نسخة من رسائل نموذج التواصل على بريد واحد أو بريدين. يمكنك تعديل العناوين أو إيقاف الإشعارات في أي وقت. تبقى جميع الرسائل محفوظة في لوحة الإدارة.</p></div>
			<label className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium"><input type="checkbox" checked={settings.enabled} disabled={loading||!!busy||!saved} onChange={e=>setSettings({...settings,enabled:e.target.checked})} className="h-4 w-4 accent-[var(--color-teal)]"/>تفعيل الإشعارات / Enable</label>
		</div>
		<form onSubmit={e=>{e.preventDefault();void perform("save");}}>
			<fieldset disabled={loading||!!busy||!saved} className="grid gap-4 sm:grid-cols-2 disabled:opacity-60">
				{[0,1].map(i=><label key={i} className="space-y-2 text-sm font-semibold text-gray-700"><span>البريد الإلكتروني {i+1} / Email {i+1} <span className="font-normal text-gray-400">{i===1?"(اختياري / Optional)":""}</span></span><input type="email" name={`notification-email-${i+1}`} dir="ltr" autoComplete="off" maxLength={254} value={settings.emails[i]} placeholder={i===0?"name@company.com":"second@company.com"} onChange={e=>{const emails:[string,string]=[...settings.emails];emails[i]=e.target.value;setSettings({...settings,emails});}} className="h-12 w-full rounded-xl border border-gray-200 px-4 font-normal outline-none focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/15"/></label>)}
			</fieldset>
			<p className="mt-3 text-xs leading-6 text-gray-500">تطبق الإعدادات على الرسائل الجديدة بعد الحفظ. إضافة بريد أو تغييره لا ترسل الرسائل السابقة تلقائيًا.</p>
			<div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900">
				{loading?"جارٍ تحميل حالة الربط…":service?"الإرسال إلى الإيميلات المؤكّدة في Cloudflare مجاني. عند إضافة بريد أو تغييره، أكّد عنوانه في Cloudflare ثم احفظ الإعدادات واستخدم زر الاختبار.":"إرسال البريد غير متاح في هذه البيئة حاليًا. يمكنك حفظ الإيميلات الآن؛ يلزم إكمال ربط خدمة البريد قبل وصول الإشعارات."}
				<a href="https://dash.cloudflare.com/?to=/:account/email-service" target="_blank" rel="noreferrer" className="ms-2 underline">إعداد خدمة البريد في Cloudflare ↗</a>
			</div>
			<div className="mt-5 flex flex-wrap gap-3">
				<button type="submit" disabled={loading||!!busy||!saved||!dirty} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--color-navy)] px-5 text-sm font-semibold text-white disabled:opacity-50"><Save className="h-4 w-4"/>{busy==="save"?"جارٍ الحفظ…":"حفظ الإعدادات / Save"}</button>
				<button type="button" disabled={loading||!!busy||dirty||!settings.enabled||!service} onClick={()=>void perform("test")} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-300 px-5 text-sm font-semibold text-gray-700 disabled:opacity-50"><Send className="h-4 w-4"/>{busy==="test"?"جارٍ الاختبار…":"إرسال رسالة اختبار / Test email"}</button>
			</div>
		</form>
		{notice&&<p role="status" className="mt-4 text-sm text-[var(--color-teal)]">{notice}</p>}
		{error&&<p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
		{deliveries.map(d=><p key={d.recipient} className={`mt-3 text-sm ${d.status==="accepted"?"text-[var(--color-teal)]":"text-red-700"}`}><bdi>{d.recipient}</bdi> — {d.status==="accepted"?"قبلت خدمة البريد الرسالة؛ تحقق من استلامها / Accepted by email service":contactEmailError(d.error_code)}</p>)}
	</section>;
}
