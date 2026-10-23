"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket } from "lucide-react";
import { AutoTranslateSync } from "@/components/admin/AutoTranslateSync";
import { bookingTiers, currencyScale, defaultBookingConfig, type BookingConfig, type BookingTier } from "@/lib/booking-config";

export function BookingSection({ slug }: { slug: string | null }) {
	const [config, setConfig] = useState<BookingConfig>(defaultBookingConfig);
	const [loaded, setLoaded] = useState(false);
	const [busy, setBusy] = useState(false);
	const [message, setMessage] = useState("");
	const [failure, setFailure] = useState(false);
	const [prices, setPrices] = useState<Record<string,string>>({});
	function updateTier(id: string, changes: Partial<BookingTier>) { setConfig(c => ({...c, tiers:bookingTiers(c).map(t => t.id === id ? {...t,...changes} : t)})); }
	useEffect(() => {
		if (!slug || slug === "new") return;
		let cancelled = false;
		setLoaded(false);
		fetch(`/api/ibs/editions/${slug}/booking`).then(async r => {
			if (!r.ok) throw new Error("Could not load booking settings. Refresh the page.");
			return r.json() as Promise<BookingConfig>;
		}).then((data: BookingConfig) => { if (!cancelled) { setConfig({...data,tiers:bookingTiers(data)}); setPrices(Object.fromEntries(bookingTiers(data).map(t => [t.id,String(t.amountMinor / currencyScale(data.currency))]))); setLoaded(true); } })
			.catch(e => { if (!cancelled) { setFailure(true); setMessage(e.message); } });
		return () => { cancelled = true; };
	}, [slug]);
	async function save() {
		setBusy(true); setMessage(""); setFailure(false);
		try {
			const tiers = bookingTiers(config).map(t => {
				const price = prices[t.id] ?? "";
				if (!price.trim() || !Number.isFinite(Number(price)) || Number(price) < 0) throw new Error("أدخل سعرًا صحيحًا لكل فئة / Enter a valid price for each category.");
				const scaled = Number(price) * currencyScale(config.currency);
				if (Math.abs(scaled - Math.round(scaled)) > 0.00001) throw new Error("Too many decimal places for this currency.");
				return {...t,amountMinor:Math.round(scaled)};
			});
			if (tiers.some(t => !t.name.en.trim() || !t.name.ar.trim())) throw new Error("أدخل اسم كل فئة بالعربية والإنجليزية / Add each category name in both languages.");
			if (config.enabled && !tiers.some(t => t.enabled)) throw new Error("فعّل فئة واحدة على الأقل / Enable at least one category.");
			const data = { ...config, tiers, amountMinor: tiers[0]?.amountMinor ?? 0, capacity:null };
			const r = await fetch(`/api/ibs/editions/${slug}/booking`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
			const result = await r.json() as BookingConfig & { error: string };
			if (!r.ok) throw new Error(({ gateway_currency_unavailable: "تبادل يدعم الدينار العراقي حاليًا. Select IQD for Tabadul.", booking_text_required: "أدخل العنوان ونص الزر باللغتين / Fill in both languages for the title and button.", price_required: "Set a price greater than zero before enabling bookings.", invalid_capacity: "Capacity must be a whole number above zero, or choose unlimited.", invalid_price: "Enter a valid price." } as Record<string, string>)[result.error] || "Could not save booking settings. Please retry.");
			setConfig(result); setMessage("Booking settings saved. Refresh the edition page to view changes.");
		} catch (e) { setFailure(true); setMessage(e instanceof Error ? e.message : "Save failed."); }
		finally { setBusy(false); }
	}
	const fieldClass = "mt-2 min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/15";
	return <section id="section-booking" className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
		<div className="flex flex-wrap items-center justify-between gap-4"><h2 className="flex items-center gap-2 font-bold text-[var(--color-navy)]"><Ticket size={20} /> Seat booking & payment <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">Optional</span></h2>
			{slug && slug !== "new" && <Link className="text-sm font-semibold text-[var(--color-teal)] underline" href={`/admin/bookings?edition=${encodeURIComponent(slug)}`}>View bookings</Link>}</div>
		{!slug || slug === "new" ? <p className="mt-4 text-sm leading-6 text-gray-500">Save this new edition first, then reopen it to configure optional bookings. Bookings are hidden by default.</p> : <>
			<p className="mt-3 text-sm leading-6 text-gray-500">Control this edition independently. These settings have their own Save button. Hidden sections do not accept new bookings; existing payments can still be confirmed.</p>
			{message && <p role={failure ? "alert" : "status"} className={`mt-4 rounded-lg p-3 text-sm ${failure ? "bg-red-50 text-red-700" : "bg-teal-50 text-teal-800"}`}>{message}</p>}
			<fieldset disabled={!loaded || busy} className="mt-5 space-y-5 disabled:opacity-50">
				<label className="flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-xl bg-gray-50 p-4 font-semibold"><span>Show booking section / إظهار قسم الحجز</span><input type="checkbox" role="switch" checked={config.enabled} onChange={e => setConfig(c => ({ ...c, enabled: e.target.checked }))} className="h-6 w-6 accent-[var(--color-teal)]" /></label>
				{([ ["title", "Service / seat title"], ["description", "Description & inclusions"], ["buttonLabel", "Button label"], ["terms", "Booking & cancellation terms / شروط الحجز والإلغاء"] ] as const).map(([key, label]) => <div key={key}>
					<div className="grid gap-4 sm:grid-cols-2">{(["en", "ar"] as const).map(lang => <label key={lang} className="block text-xs font-semibold text-gray-600">{label} ({lang.toUpperCase()}){(key === "description" || key === "terms") && <span className="ms-2 font-normal">Optional / اختياري</span>}
						<textarea data-booking-field={`${key}-${lang}`} rows={key === "description" || key === "terms" ? 3 : 1} maxLength={key === "title" || key === "buttonLabel" ? 160 : 4000} dir={lang === "ar" ? "rtl" : "ltr"} value={config[key][lang]} onChange={e => setConfig(c => ({ ...c, [key]: { ...c[key], [lang]: e.target.value } }))} className={fieldClass} />
					</label>)}</div>
					<AutoTranslateSync enValue={config[key].en} arValue={config[key].ar} onEnChange={value => setConfig(c => ({ ...c, [key]: { ...c[key], en: value } }))} onArChange={value => setConfig(c => ({ ...c, [key]: { ...c[key], ar: value } }))} />
				</div>)}
				<div className="max-w-sm">
					<label className="text-xs font-semibold text-gray-600">Currency<select value={config.currency} onChange={e => setConfig(c => ({ ...c, currency: e.target.value as BookingConfig["currency"] }))} className={fieldClass}><option value="IQD">IQD — Iraqi dinar / دينار عراقي</option><option value="USD" disabled>USD — not supported by Tabadul</option></select></label>
				</div>
				<div className="space-y-4 rounded-xl border border-gray-200 p-4">
					<h3 className="font-bold text-[var(--color-navy)]">Booking categories / فئات الحجز</h3>
					<p className="text-sm leading-7 text-gray-500">سعر وسعة مستقلان لكل فئة. الحجوزات السابقة تحتفظ بتفاصيلها. إخفاء الفئة يوقف الحجوزات الجديدة فقط. لا يوجد توزيع مرقّم لكراسي القاعة.</p>
					{bookingTiers(config).map((tier,index) => <div key={tier.id} data-tier-editor={tier.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
						<div className="flex flex-wrap items-center justify-between gap-3"><strong>الفئة {index+1} / Category {index+1}</strong><label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={tier.enabled} onChange={e => updateTier(tier.id,{enabled:e.target.checked})} className="h-5 w-5 accent-[var(--color-teal)]" />Visible / ظاهرة</label></div>
						<div className="grid gap-4 sm:grid-cols-2">{(["en","ar"] as const).map(lang => <label key={lang} className="text-xs font-semibold text-gray-600">Category name ({lang.toUpperCase()})<input maxLength={120} dir={lang === "ar" ? "rtl" : "ltr"} value={tier.name[lang]} onChange={e => updateTier(tier.id,{name:{...tier.name,[lang]:e.target.value}})} className={fieldClass} /></label>)}</div>
						<AutoTranslateSync enValue={tier.name.en} arValue={tier.name.ar} onEnChange={value => updateTier(tier.id,{name:{...tier.name,en:value}})} onArChange={value => updateTier(tier.id,{name:{...tier.name,ar:value}})} />
						<div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold text-gray-600">Price / السعر ({config.currency})<input type="number" min="0" step={config.currency === "IQD" ? "0.001" : "0.01"} value={prices[tier.id] ?? "0"} onChange={e => setPrices(p => ({...p,[tier.id]:e.target.value}))} className={fieldClass} /></label><div><label className="text-xs font-semibold text-gray-600">Seat limit / حد المقاعد<select data-seat-limit value={tier.capacity === null ? "unlimited" : "limited"} onChange={e => updateTier(tier.id,{capacity:e.target.value === "unlimited" ? null : 1})} className={fieldClass}><option value="unlimited">Unlimited / غير محدود</option><option value="limited">Limited / عدد محدد</option></select></label><label className="mt-3 block text-xs font-semibold text-gray-600">Total seats / إجمالي المقاعد<input data-seat-capacity type="number" min="1" max="1000000" step="1" disabled={tier.capacity === null} placeholder="∞" value={tier.capacity ?? ""} onChange={e => updateTier(tier.id,{capacity:e.target.value === "" ? 0 : Number(e.target.value)})} className={`${fieldClass} disabled:bg-gray-100 disabled:text-gray-400`} /></label><p className="mt-2 text-xs leading-6 text-gray-500">{tier.capacity === null ? "لا يوجد حد لعدد الحجوزات / No booking limit" : "العدد الكلي لهذه الفئة، وليس المتبقي / Total capacity, not remaining seats"}</p></div></div>
						<button type="button" disabled={bookingTiers(config).length === 1} onClick={() => { if (window.confirm("إزالة هذه الفئة من العرض؟ ستبقى حجوزاتها السابقة محفوظة. Remove this category? Existing bookings remain.")) setConfig(c => ({...c,tiers:bookingTiers(c).filter(t => t.id !== tier.id)})); }} className="mt-3 min-h-11 text-sm font-semibold text-red-700 underline disabled:opacity-40">Remove category / إزالة الفئة</button>
					</div>)}
					<button type="button" disabled={bookingTiers(config).length >= 30} onClick={() => { const id=crypto.randomUUID(); setConfig(c => ({...c,tiers:[...bookingTiers(c),{id,name:{en:"",ar:""},amountMinor:0,capacity:null,enabled:false}]})); setPrices(p => ({...p,[id]:"0"})); }} className="min-h-11 rounded-lg border border-[var(--color-teal)] px-4 font-bold text-[var(--color-teal)] disabled:opacity-40">+ Add category / إضافة فئة</button>
				</div>
				<div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-warm)] p-4 text-sm leading-7 text-[var(--color-navy)]"><p dir="rtl">أنت تتحكم بظهور الحجز وسعر المقعد والسعة لكل فئة. الوصف وشروط الحجز والإلغاء اختياريان، ويمكن إضافتهما بلغة واحدة أو باللغتين. المقاعد المتبقية تستثني الحجوزات المؤكدة والمقاعد المحجوزة مؤقتًا أثناء الدفع. التفعيل والحفظ على الموقع الحي يتيحان دفعًا حقيقيًا عبر تبادل. تعديل السعر لا يغيّر الحجوزات السابقة.</p><p className="mt-3 text-xs">Tabadul accepts IQD. One seat per checkout; choose Limited or Unlimited for each category. Description and terms are optional. Hiding closes new bookings, not pending payments. Local development remains a simulation. API credentials never belong in these fields.</p><Link href="/admin/payments" className="mt-3 inline-block min-h-11 py-2 font-bold text-[var(--color-teal)]">سجل المدفوعات / Payment history ↗</Link></div>
				<button type="button" onClick={save} className="min-h-11 rounded-lg bg-[var(--color-navy)] px-5 text-sm font-bold text-white hover:bg-[var(--color-teal)]">{busy ? "Saving…" : "Save booking settings"}</button>
				<Link target="_blank" href={`/en/ibs/${slug}#booking`} className="ms-4 inline-block py-3 text-sm font-semibold text-[var(--color-teal)]">Preview edition ↗</Link>
			</fieldset>
		</>}
	</section>;
}
