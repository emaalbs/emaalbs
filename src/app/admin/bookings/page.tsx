"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatBookingPrice } from "@/lib/booking-config";
type Row = { id: string; tier_name: string; edition_slug: string; customer_name: string; email: string; phone: string; amount_minor: number; currency: string; status: string; provider: string; created_at: number };
export default function Page() {
	const [rows, setRows] = useState<Row[]>([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const [version, setVersion] = useState(0);
	const [verifying, setVerifying] = useState("");
	const [notice, setNotice] = useState("");
	async function verify(id: string) {
		setVerifying(id); setNotice("");
		try {
			const r = await fetch(`/api/admin/bookings/${id}/verify-payment`, { method: "POST" });
			if (!r.ok) throw new Error();
			const result = await r.json() as { status: string; verification: string };
			setNotice(result.verification === "cooldown" ? "Please wait 15 seconds before checking again." : `Gateway checked: ${result.status}. No payment or refund was initiated.`);
			setVersion(v => v + 1);
		} catch { setNotice("Could not verify payment. Do not request a second charge; check the gateway portal. Real verification requires the approved local pilot configuration."); }
		finally { setVerifying(""); }
	}
	useEffect(() => {
		const controller = new AbortController();
		setLoading(true); setError("");
		const filter = new URLSearchParams(window.location.search).get("edition") || "";
		fetch(`/api/admin/bookings?page=${page}&edition=${encodeURIComponent(filter)}`, { signal: controller.signal }).then(async r => { if (!r.ok) throw new Error("Could not load bookings. Please refresh or sign in again."); return r.json() as Promise<{ bookings: Row[]; total: number }>; }).then(data => { setRows(data.bookings); setTotal(data.total); }).catch(e => { if (!controller.signal.aborted) setError(e.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
		return () => controller.abort();
	}, [page, version]);
	return <div className="space-y-6"><div className="flex items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-[var(--color-navy)]">IBS Bookings</h1><p className="mt-2 text-sm text-gray-500">{total} reservations · Payment status is verified on the server.</p></div><button onClick={() => setVersion(v => v + 1)} className="min-h-11 rounded-lg border bg-white px-5 text-sm">Refresh</button></div>
		<p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Mock / tabadul-preview = simulation, no charge. Tabadul = real payment pilot. Review = payment arrived late, changed status, or was reported refunded; check the gateway before confirming the seat. Refunds are not issued automatically.</p>
		{error && <p role="alert" className="text-red-700">{error}</p>}
		{notice && <p role="status" className="rounded-lg border bg-white p-4 text-sm leading-6">{notice}</p>}
		{rows.some(r => ["tabadul", "tabadul-preview"].includes(r.provider)) && <details className="rounded-xl border bg-white p-4"><summary className="cursor-pointer font-semibold">Verify Tabadul payments / التحقق من مدفوعات تبادل</summary><p className="mt-2 text-sm text-gray-500">Check existing gateway orders, including when a guest closed their browser. This does not create a new payment.</p><div className="mt-4 space-y-3">{rows.filter(r => ["tabadul", "tabadul-preview"].includes(r.provider)).map(r => <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"><div className="min-w-0"><p className="font-semibold">{r.customer_name} · {r.provider}</p><p dir="ltr" className="break-all font-mono text-xs text-gray-500">{r.id}</p></div><button disabled={Boolean(verifying)} onClick={() => void verify(r.id)} className="min-h-11 rounded-lg border border-teal-200 px-4 text-sm font-bold text-teal-800 hover:bg-teal-50 focus-visible:outline-2 disabled:opacity-50">{verifying === r.id ? "Checking…" : "Verify payment"}</button></div>)}</div></details>}
		<div className="overflow-x-auto rounded-xl border border-gray-200 bg-white"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>{["Booking / edition", "Guest", "Total", "Status", "Provider", "Created"].map(h => <th key={h} className="p-4">{h}</th>)}</tr></thead><tbody>{rows.map(r => <tr key={r.id} className="border-t border-gray-100"><td className="p-4"><Link className="font-semibold text-[var(--color-teal)]" href={`/admin/ibs/editions/${r.edition_slug}`}>{r.edition_slug}</Link><p className="mt-2 text-sm font-bold text-[var(--color-navy)]">{JSON.parse(r.tier_name || '{}').en}</p><p className="mt-2 font-mono text-xs text-gray-500">{r.id}</p></td><td className="p-4"><p className="font-semibold">{r.customer_name}</p><p>{r.email}</p><p>{r.phone}</p></td><td className="p-4 whitespace-nowrap">{formatBookingPrice(r.amount_minor, r.currency)}</td><td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${r.status === "paid" ? "bg-teal-50 text-teal-800" : r.status === "review" ? "bg-amber-100 text-amber-900" : "bg-gray-100 text-gray-700"}`}>{r.status}</span></td><td className="p-4">{r.provider}</td><td className="p-4">{new Date(r.created_at).toLocaleString()}</td></tr>)}</tbody></table>{!rows.length && <p className="p-10 text-center text-gray-500">{loading ? "Loading…" : "No bookings yet."}</p>}</div>
		<div className="flex items-center gap-4"><button disabled={loading || page === 1} onClick={() => setPage(p => p - 1)} className="min-h-11 rounded-lg border px-4 disabled:opacity-40">Previous</button><span>Page {page}</span><button disabled={loading || page * 50 >= total} onClick={() => setPage(p => p + 1)} className="min-h-11 rounded-lg border px-4 disabled:opacity-40">Next</button></div>
	</div>;
}
