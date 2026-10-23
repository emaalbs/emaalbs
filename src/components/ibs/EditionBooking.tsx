"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Ticket, ShieldCheck, Clock3 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { type BookingConfig, formatBookingPrice } from "@/lib/booking-config";

const messages: Record<string, [string, string]> = {
	payment_origin_required: ["Please open this edition on https://emaalbs.com to continue payment.", "يرجى فتح صفحة القمة على https://emaalbs.com لمتابعة الدفع."],
	unauthorized: ["This private real-payment test requires local admin sign-in. Sign in using the link below in the same browser, then return here. Your form remains filled in.", "تجربة الدفع الفعلي الخاصة تتطلب تسجيل الدخول إلى الأدمن المحلي. افتح رابط الدخول أدناه في المتصفح نفسه، ثم عد إلى هذه الصفحة؛ ستبقى بياناتك في النموذج."],
	payments_unavailable: ["Online payment is not available yet. Please contact the organizer.", "الدفع الإلكتروني غير متاح حاليًا. يرجى التواصل مع المنظم."],
	gateway_unavailable: ["Payment service did not respond. Please retry; your reservation will not be duplicated.", "لم تستجب خدمة الدفع. أعد المحاولة؛ لن يتكرر حجزك."],
	sold_out_or_changed: ["Seats are unavailable or the offer has changed. Refresh this page.", "نفدت المقاعد أو تغير العرض. يرجى تحديث الصفحة."],
	booking_closed: ["Bookings are currently closed.", "الحجز مغلق حاليًا."],
	too_many_requests: ["Too many attempts. Please try again in 10 minutes.", "محاولات كثيرة. يرجى المحاولة بعد 10 دقائق."],
	invalid_details: ["Please check your name, email and phone number.", "يرجى التأكد من الاسم والبريد ورقم الهاتف."],
	request_conflict: ["Your details changed. Please reload before starting a new booking.", "تغيرت بيانات الحجز. حدّث الصفحة قبل إنشاء حجز جديد."],
	real_payment_locked: ["The private payment pilot is not enabled on this local server.", "تجربة الدفع الفعلي غير مفعّلة على هذا الخادم المحلي."],
	real_payment_not_allowed: ["This private pilot is limited to the approved edition and at most IQD 1,000, with explicit consent.", "الاختبار المالي مخصص للنسخة المعتمدة وبحد أقصى 1,000 دينار، ويتطلب موافقتك الصريحة."],
	gateway_currency_unavailable: ["This integration currently supports IQD only.", "الربط الحالي يدعم الدينار العراقي فقط."],
	gateway_registration_pending: ["Your payment request is being checked. Do not start another booking; contact the organizer if this persists.", "طلب الدفع قيد التحقق. لا تبدأ حجزًا آخر؛ تواصل مع المنظم إذا استمرت الحالة."],
	gateway_registration_rejected: ["The gateway could not register this request. Please contact the organizer.", "تعذر تسجيل الطلب لدى بوابة الدفع. يرجى التواصل مع المنظم."],
};
export function bookingMessage(code: string, ar: boolean) {
	return messages[code]?.[ar ? 1 : 0] || (ar ? "تعذر إكمال الطلب. أعد المحاولة لاحقًا." : "Unable to complete the request. Please try again shortly.");
}
export function EditionBooking({ slug, config, date, location }: { slug: string; config: BookingConfig; date: { en: string; ar: string }; location: { en: string; ar: string } }) {
	const { locale } = useI18n();
	const ar = locale === "ar";
	const [open, setOpen] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [needsLogin, setNeedsLogin] = useState(false);
	const [preview, setPreview] = useState("");
	const [bookingReference, setBookingReference] = useState("");
	useEffect(() => {
		if (process.env.NODE_ENV !== "development" || !["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname)) return;
		const mode = new URLSearchParams(window.location.search).get("paymentPreview");
		if (mode === "tabadul" || mode === "tabadul-real") setPreview(mode);
	}, []);
	if (!config.enabled) return null;
	const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-[var(--color-line)] bg-white px-4 text-[var(--color-ink)] outline-none focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-teal)]/20";
	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (busy) return;
		setBusy(true); setError(""); setNeedsLogin(false);
		try {
			const form = new FormData(event.currentTarget);
			// Check this private pilot's local admin session before creating any booking.
			// Opening login in another tab preserves this form and its idempotency token.
			if (preview === "tabadul-real") {
				const session = await fetch("/api/admin/me", { cache: "no-store", credentials: "same-origin" });
				if (session.status === 401) { setNeedsLogin(true); throw new Error("unauthorized"); }
				if (!session.ok) throw new Error("payments_unavailable");
			}
			const payload = JSON.stringify({ slug, name: form.get("name"), email: form.get("email"), phone: form.get("phone"), acceptedTerms: form.get("terms") === "on", locale, paymentPreview: preview, realPaymentConsent: form.get("realPaymentConsent") === "on" });
			const fingerprint = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload))), b => b.toString(16).padStart(2, "0")).join("");
			const attemptKey = `ibs-booking-pending:${slug}`;
			const previous = JSON.parse(sessionStorage.getItem(attemptKey) || "null") as { token: string; fingerprint: string; createdAt: number } | null;
			// Keep the same attempt after a reload/network loss, without storing guest details.
			const key = previous?.fingerprint === fingerprint && Date.now() - previous.createdAt < 20 * 60000 && /^[a-f0-9]{64}$/.test(previous.token)
				? previous.token : Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, "0")).join("");
			// Verify storage before reserving; this capability stays in this browser tab, never in URLs.
			sessionStorage.setItem(attemptKey, JSON.stringify({ token: key, fingerprint, createdAt: previous?.token === key ? previous.createdAt : Date.now() }));
			const response = await fetch("/api/bookings/checkout", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key, ...(preview ? { "X-IBS-Payment-Preview": preview } : {}) }, body: payload });
			const result = await response.json() as { error?: string; booking: { id: string }; checkoutUrl: string | null };
			if (result.booking?.id) { sessionStorage.setItem(`ibs-booking:${result.booking.id}`, key); setBookingReference(result.booking.id); }
			if (response.status === 401) { setNeedsLogin(true); throw new Error("unauthorized"); }
			if (!response.ok) throw new Error(result.error);
			sessionStorage.setItem(`ibs-booking:${result.booking.id}`, key);
			window.location.assign(result.checkoutUrl || `/${locale}/booking/${result.booking.id}`);
		} catch (e) { setError(bookingMessage(e instanceof Error ? e.message : "", ar)); }
		finally { setBusy(false); }
	}
	return <section id="booking" className="bg-[var(--color-warm)] py-20 lg:py-24 scroll-mt-24">
		<Container>
			<div className="overflow-hidden rounded-3xl bg-[var(--color-navy)] text-white shadow-xl">
				<div className="grid lg:grid-cols-[1.15fr_1fr]">
					<div className="relative p-7 sm:p-12 lg:p-16">
						<span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 px-4 py-2 text-xs font-bold text-[var(--color-gold)]"><Ticket size={16} />{ar ? "مقعدك في القمة" : "YOUR PLACE AT THE SUMMIT"}</span>
						<h2 className="mt-8 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">{config.title[locale]}</h2>
						<p className="mt-6 whitespace-pre-line text-base leading-8 text-white/80">{config.description[locale]}</p>
						<div className="mt-10 grid gap-4 border-t border-white/15 pt-7 text-sm text-white/85">
							{[date[locale], location[locale]].filter(Boolean).map((text, i) => <div key={i} className="flex items-start gap-3"><Check size={18} className="shrink-0 text-[var(--color-gold)]" /><span>{text}</span></div>)}
						</div>
					</div>
					<div className="m-4 rounded-2xl bg-white p-6 text-[var(--color-ink)] sm:m-6 sm:p-9 lg:m-8">
						{preview && <p role="status" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950">{preview === "tabadul" ? (ar ? "محاكاة ربط تبادل — لا يتم الاتصال بالشركة أو خصم أموال. لا تدخل بيانات بطاقة." : "Tabadul integration simulation — no gateway connection or money charged. Do not enter card details.") : (ar ? "اختبار دفع فعلي — قد يُخصم مبلغ حقيقي من بطاقتك. يتطلب حساب أدمن محليًا وتفعيلًا منفصلًا من الخادم." : "Real-money pilot — an actual charge may occur. Requires local admin sign-in and separate server activation.")}</p>}
						<p className="text-sm font-semibold text-[var(--color-slate)]">{ar ? "سعر المقعد / الخدمة" : "PER SEAT / SERVICE"}</p>
						{preview === "tabadul-real" && <a href="/admin/login" target="_blank" rel="noopener" className="my-4 block rounded-lg border border-[var(--color-line)] p-3 text-sm font-bold leading-7 text-[var(--color-teal)] hover:bg-[var(--color-warm)] focus-visible:outline-2 focus-visible:outline-[var(--color-teal)]">{ar ? "قبل التجربة: سجّل الدخول إلى الأدمن المحلي (تبويب جديد)، ثم عد إلى هنا" : "Before testing: sign in to local admin (new tab), then return here"}</a>}
						<p className="mt-3 break-words text-4xl font-bold text-[var(--color-navy)]">{formatBookingPrice(config.amountMinor, config.currency, locale)}</p>
						<p className="mt-3 text-sm leading-6 text-[var(--color-slate)]">{ar ? "حجز واحد لكل عملية، دون إنشاء حساب. يتأكد الحجز بعد التحقق من نجاح الدفع." : "One reservation per checkout. No account required. Confirmed after payment is verified."}</p>
						{!open ? <button onClick={() => setOpen(true)} className="mt-8 flex min-h-14 w-full items-center justify-between gap-4 rounded-xl bg-[var(--color-gold)] px-6 font-bold text-[var(--color-navy)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-teal)] motion-reduce:transform-none">{config.buttonLabel[locale]}<ArrowUpRight className={ar ? "-scale-x-100" : ""} /></button> :
						<form onSubmit={submit} className="mt-7 space-y-4" aria-label={ar ? "بيانات الحجز" : "Booking details"}>
							<label className="block text-sm font-semibold">{ar ? "الاسم الكامل" : "Full name"}<input autoFocus required minLength={2} maxLength={120} name="name" autoComplete="name" className={inputClass} disabled={busy} /></label>
							<label className="block text-sm font-semibold">{ar ? "البريد الإلكتروني" : "Email address"}<input required type="email" maxLength={254} name="email" autoComplete="email" dir="ltr" className={inputClass} disabled={busy} /></label>
							<label className="block text-sm font-semibold">{ar ? "رقم الهاتف" : "Phone number"}<input required type="tel" minLength={6} maxLength={40} name="phone" autoComplete="tel" dir="ltr" className={inputClass} disabled={busy} /></label>
							{config.terms[locale] && <p className="max-h-40 overflow-auto whitespace-pre-line rounded-lg bg-[var(--color-warm)] p-4 text-xs leading-6">{config.terms[locale]}</p>}
							<label className="flex items-start gap-3 py-2 text-sm leading-6"><input type="checkbox" name="terms" required className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-teal)]" />{ar ? "أؤكد بياناتي وأوافق على تفاصيل الحجز وشروطه الموضحة أعلاه." : "I confirm my details and accept the booking details and terms shown above."}</label>
							{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
							{needsLogin && <a href="/admin/login" target="_blank" rel="noopener" className="block min-h-11 rounded-lg border border-[var(--color-line)] p-3 text-sm font-bold text-[var(--color-teal)] hover:bg-[var(--color-warm)] focus-visible:outline-2 focus-visible:outline-[var(--color-teal)]">{ar ? "تسجيل دخول الأدمن المحلي — ثم عد لإكمال الطلب" : "Sign in to local admin — then return to continue"}</a>}
							{error && bookingReference && <a href={`/${locale}/booking/${bookingReference}`} className="block break-all py-3 text-sm font-bold text-[var(--color-teal)]">{ar ? "متابعة الحجز: " : "Track booking: "}{bookingReference}</a>}
							{preview === "tabadul-real" && <label className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7"><input name="realPaymentConsent" type="checkbox" required className="mt-1 h-5 w-5 shrink-0" />{ar ? "أفهم أن هذه عملية مالية حقيقية وأوافق على دفع المبلغ المعروض، وليس محاكاة." : "I understand this is a real payment and consent to paying the displayed amount, not a simulation."}</label>}
							<button disabled={busy} className="min-h-14 w-full rounded-xl bg-[var(--color-gold)] px-5 font-bold text-[var(--color-navy)] hover:brightness-105 focus-visible:outline-2 focus-visible:outline-[var(--color-teal)] disabled:opacity-50">{busy ? (ar ? "جارٍ تجهيز الحجز…" : "Preparing checkout…") : (ar ? "المتابعة إلى الدفع" : "Continue to payment")}</button>
						</form>}
						<div className="mt-6 space-y-3 border-t border-[var(--color-line)] pt-5 text-xs leading-5 text-[var(--color-slate)]">
							<p className="flex items-center gap-2"><ShieldCheck size={16} />{ar ? "لن نطلب بيانات بطاقتك على هذه الصفحة." : "Card details are entered only on the payment provider’s page."}</p>
							<p className="flex items-center gap-2"><Clock3 size={16} />{ar ? "يبقى المقعد محجوزًا مؤقتًا لمدة 20 دقيقة." : "Your place is held for 20 minutes during checkout."}</p>
						</div>
					</div>
				</div>
			</div>
		</Container>
	</section>;
}
