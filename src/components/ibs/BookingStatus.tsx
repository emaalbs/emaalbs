"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, CircleAlert, Ticket } from "lucide-react";
import { formatBookingPrice } from "@/lib/booking-config";

type Status = { id: string; editionSlug: string; title: string; amountMinor: number; currency: string; status: string; provider: string };
const text: Record<string, [string, string]> = {
	pending: ["Awaiting payment", "بانتظار الدفع"], paid: ["Your booking is confirmed", "تم تأكيد حجزك"], failed: ["Payment was unsuccessful", "لم تنجح عملية الدفع"], cancelled: ["Payment was cancelled", "أُلغيت عملية الدفع"], expired: ["Your reservation has expired", "انتهت مهلة الحجز"], review: ["Payment needs organizer review", "عملية الدفع تحتاج مراجعة المنظم"],
};
export function BookingStatus({ id, locale }: { id: string; locale: "en" | "ar" }) {
	const ar = locale === "ar";
	const [booking, setBooking] = useState<Status | null>(null);
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);
	const [checks, setChecks] = useState(0);
	const [verification, setVerification] = useState("");
	async function refresh() {
		try {
			let token: string | null = null;
			try { token = sessionStorage.getItem(`ibs-booking:${id}`); } catch { /* HttpOnly cookie remains available. */ }
			const headers: Record<string,string> = token ? { Authorization: `Bearer ${token}` } : {};
			const r = await fetch(`/api/bookings/${id}`, { headers, credentials: "same-origin", cache: "no-store" });
			if (!r.ok) throw new Error("unavailable");
			const current = await r.json() as Status;
			setBooking(current); setError("");
			if (["tabadul", "tabadul-preview"].includes(current.provider)) {
				try {
					const checked = await fetch(`/api/bookings/${id}/verify-payment`, { method: "POST", headers, credentials: "same-origin" });
					if (!checked.ok) throw new Error();
					const result = await checked.json() as Status & { verification?: string; gatewayState?: number };
					setBooking(result);
					setVerification(result.verification === "cooldown" ? (ar ? "يرجى الانتظار قليلًا بين محاولات التحقق." : "Please allow a few seconds between verification attempts.") : result.gatewayState === 1 && result.status === "pending" ? (ar ? "وصلت حالة تفويض من البوابة؛ لا نؤكد الحجز قبل التحقق من التحصيل النهائي." : "The gateway reports an authorization. The booking remains pending until final payment is verified.") : "");
				} catch { setVerification(ar ? "تعذر التحقق من شركة الدفع الآن. لا تكرر الدفع؛ حدّث الحالة لاحقًا أو تواصل مع المنظم." : "Unable to verify the gateway now. Do not pay again; refresh later or contact the organizer."); }
			}
		} catch { setError(ar ? "تعذر عرض الحجز. افتح الصفحة في المتصفح الذي أتممت الحجز منه، أو تواصل مع المنظم برقم الحجز أدناه. لا ترسل بيانات بطاقتك." : "Unable to retrieve your booking. Use the browser you booked with, or contact the organizer with the reference below. Never send card details."); }
	}
	useEffect(() => { void refresh(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (!["pending", "expired"].includes(booking?.status || "") || checks >= 24) return;
		const timer = setTimeout(() => { setChecks(n => n + 1); void refresh(); }, 15000);
		return () => clearTimeout(timer);
	}, [booking, checks]); // eslint-disable-line react-hooks/exhaustive-deps
	async function simulate(status: string) {
		setBusy(true);
		try {
			const r = await fetch("/api/payments/mock", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionStorage.getItem(`ibs-booking:${id}`)}` }, body: JSON.stringify({ id, status }) });
			if (!r.ok) throw new Error();
			await refresh();
		} catch { setError(ar ? "تعذرت المحاكاة." : "Simulation failed."); }
		finally { setBusy(false); }
	}
	async function simulateGateway(state: number) {
		setBusy(true);
		try {
			const r = await fetch("/api/payments/tabadul-preview", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionStorage.getItem(`ibs-booking:${id}`)}` }, body: JSON.stringify({ id, state }) });
			if (!r.ok) throw new Error();
			await refresh();
		} catch { setError(ar ? "تعذرت محاكاة استجابة البوابة." : "Gateway simulation failed."); }
		finally { setBusy(false); }
	}
	const successful = booking?.status === "paid";
	const Icon = successful ? CheckCircle2 : booking?.status === "pending" ? Clock3 : CircleAlert;
	return <main dir={ar ? "rtl" : "ltr"} className="min-h-screen bg-[var(--color-warm)] px-5 py-20 text-[var(--color-ink)]">
		<div className="mx-auto max-w-xl rounded-3xl border border-[var(--color-line)] bg-white p-7 shadow-xl sm:p-12">
			<Link href={`/${locale}`} className="text-sm font-bold text-[var(--color-teal)]">EMAAL / IBS</Link>
			<Icon size={48} className={`mt-10 ${successful ? "text-[var(--color-teal)]" : "text-[var(--color-navy)]"}`} />
			<h1 className="mt-6 text-3xl font-bold leading-tight">{booking ? text[booking.status]?.[ar ? 1 : 0] : ar ? "متابعة الحجز" : "Booking status"}</h1>
			{booking && <><p className="mt-4 leading-7 text-[var(--color-slate)]">{JSON.parse(booking.title)[locale]}</p><p className="mt-4 text-2xl font-bold">{formatBookingPrice(booking.amountMinor, booking.currency, locale)}</p></>}
			<p className="mt-8 text-xs text-[var(--color-slate)]">{ar ? "رقم الحجز" : "Booking reference"}</p><p dir="ltr" className="mt-2 break-all font-mono text-sm">{id}</p>
			{booking?.status === "pending" && <p className="mt-6 text-sm leading-7">{ar ? "ننتظر تأكيد شركة الدفع. العودة لهذه الصفحة وحدها لا تؤكد الحجز." : "Waiting for payment provider confirmation. Returning to this page alone does not confirm payment."}</p>}
			{booking?.status === "review" && <p className="mt-6 text-sm leading-7">{ar ? "تحتاج العملية مراجعة بسبب توقيت الدفع أو تغيّر حالته، وقد يشمل ذلك الاسترجاع. تواصل مع المنظم لتأكيد المقعد وحالة المبلغ." : "The payment timing or status needs review, which may include a refund. Contact the organizer to confirm your seat and payment status."}</p>}
			{verification && <p role="status" className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-7 text-amber-950">{verification}</p>}
			{error && <p role="alert" className="mt-5 text-sm leading-7 text-red-700">{error}</p>}
			{booking?.provider === "mock" && <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-950"><p className="flex items-center gap-2 font-bold"><Ticket size={18} />{ar ? "دفع تجريبي — لا يتم خصم أي مبلغ" : "Test payment — no money is charged"}</p>{booking.status === "pending" && <div className="mt-4 flex flex-wrap gap-2">{(["paid", "failed", "cancelled"] as const).map((s, i) => <button key={s} disabled={busy} onClick={() => simulate(s)} className="min-h-11 rounded-lg border border-amber-300 bg-white px-4 text-sm font-semibold hover:bg-amber-100 disabled:opacity-50">{(ar ? ["محاكاة النجاح", "محاكاة الفشل", "محاكاة الإلغاء"] : ["Simulate success", "Simulate failure", "Simulate cancel"])[i]}</button>)}</div>}</div>}
			{booking?.provider === "tabadul-preview" && <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
				<p className="font-bold">{ar ? "محاكاة تبادل — لا يوجد خصم مالي" : "Tabadul simulation — no money charged"}</p>
				<p className="mt-2 text-sm leading-7">{ar ? "اختر استجابة البوابة لاختبار التحقق من الحجز. هذه ليست عملية لدى شركة تبادل." : "Choose a gateway response to test booking verification. This is not a transaction with Tabadul."}</p>
				<div className="mt-4 flex flex-wrap gap-2">{[2, 6, 3, 1, 4].map((state, i) => <button key={state} disabled={busy} onClick={() => simulateGateway(state)} className="min-h-11 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50">{(ar ? ["محاكاة النجاح", "محاكاة الرفض", "محاكاة الإلغاء", "تفويض دون تأكيد التحصيل", "محاكاة الاسترجاع"] : ["Simulate success", "Simulate decline", "Simulate cancel", "Authorization only", "Simulate refund"])[i]}</button>)}</div>
			</div>}
			{booking?.provider === "tabadul" && <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950">{ar ? "الدفع عبر تبادل. نتحقق من النتيجة مع شركة الدفع؛ لا تكرر الدفع إذا تأخر التأكيد. احتفظ برقم الحجز للمتابعة." : "Payment via Tabadul. We verify the result with the provider; do not pay again if confirmation is delayed. Keep your booking reference."}</p>}
			<button onClick={() => { setChecks(0); void refresh(); }} className="mt-8 min-h-11 rounded-xl border border-[var(--color-line)] px-5 font-semibold hover:bg-[var(--color-warm)]">{ar ? "تحديث الحالة" : "Refresh status"}</button>
			<Link href={`/${locale}/ibs/${booking?.editionSlug || ""}#booking`} className="mt-4 block py-3 text-sm font-bold text-[var(--color-teal)]">{ar ? "العودة إلى القمة" : "Back to the summit"}</Link>
			<Link href={`/${locale}/contact`} className="block py-3 text-sm font-bold text-[var(--color-teal)]">{ar ? "التواصل بشأن الحجز أو الاسترجاع" : "Contact us about your booking or refund"}</Link>
		</div>
	</main>;
}
