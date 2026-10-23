import { requireAuth } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";
import { BookingError } from "@/lib/booking-config";
import { bookingFailure, bookingJson } from "@/lib/booking-http";

export async function GET(request: Request) {
	try {
		await requireAuth(request);
		const p = new URL(request.url).searchParams;
		const mode = p.get("mode") || "real", state = p.get("status") || "all", currency = p.get("currency") || "all";
		const q = (p.get("q") || "").trim(), edition = p.get("edition") || "";
		const page = Number(p.get("page") || "1");
		if (!["real", "simulation"].includes(mode) || !["all", "paid", "pending", "expired", "failed", "cancelled", "review", "refund_reported"].includes(state) || !["all", "IQD", "USD"].includes(currency) || q.length > 120 || edition.length > 160 || !Number.isSafeInteger(page) || page < 1 || page > 10000) throw new BookingError("invalid_filters");
		const conditions = [mode === "simulation" ? "provider IN ('mock','tabadul-preview')" : "provider IN ('bridge','tabadul')"];
		const args: (string | number)[] = [];
		if (state !== "all") { conditions.push("payment_state=?"); args.push(state); }
		if (currency !== "all") { conditions.push("currency=?"); args.push(currency); }
		if (edition) { conditions.push("edition_slug=?"); args.push(edition); }
		if (q) { conditions.push("(instr(lower(customer_name),lower(?))>0 OR instr(lower(email),lower(?))>0 OR instr(phone,?)>0 OR instr(id,?)>0 OR instr(COALESCE(transaction_id,''),?)>0)"); args.push(q,q,q,q,q); }
		const dates: number[] = [];
		for (const key of ["from", "to"] as const) {
			const value = p.get(key); if (!value) { dates.push(0); continue; }
			const parsed = Date.parse(`${value}T00:00:00+03:00`);
			if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(parsed) || new Date(parsed + 10800000).toISOString().slice(0,10) !== value) throw new BookingError("invalid_dates");
			dates.push(parsed); conditions.push(key === "from" ? "created_at>=?" : "created_at<?"); args.push(parsed + (key === "to" ? 86400000 : 0));
		}
		if (dates[0] && dates[1] && dates[0]>dates[1]) throw new BookingError("invalid_dates");
		const now = Date.now();
		const cte = `WITH ledger AS (SELECT b.id,b.edition_slug,b.customer_name,b.email,b.phone,b.amount_minor,b.currency,b.provider,b.transaction_id,b.provider_session,b.created_at,
			(SELECT MIN(e.received_at) FROM ibs_payment_events e WHERE e.booking_id=b.id AND e.provider=b.provider AND e.status='paid') AS confirmed_at,
			CASE WHEN EXISTS(SELECT 1 FROM ibs_payment_events e WHERE e.booking_id=b.id AND e.provider=b.provider AND e.status='refunded') THEN 'refund_reported'
			WHEN b.status='paid' AND NOT EXISTS(SELECT 1 FROM ibs_payment_events e WHERE e.booking_id=b.id AND e.provider=b.provider AND e.status='paid') THEN 'review'
			WHEN b.status='pending' AND b.expires_at<=${now} THEN 'expired' ELSE b.status END AS payment_state
			FROM ibs_bookings b), filtered AS (SELECT * FROM ledger WHERE ${conditions.join(" AND ")})`;
		const { DB } = await getEnv();
		// Summary uses ALL matching records, never just the visible page. Never sum different currencies.
		const result = await DB.batch([
			DB.prepare(`${cte} SELECT * FROM filtered ORDER BY created_at DESC,id DESC LIMIT 25 OFFSET ?`).bind(...args,(page-1)*25),
			DB.prepare(`${cte} SELECT COUNT(*) AS total FROM filtered`).bind(...args),
			DB.prepare(`${cte} SELECT currency,COUNT(*) AS attempts,
				SUM(CASE WHEN payment_state='paid' AND confirmed_at IS NOT NULL THEN amount_minor ELSE 0 END) AS confirmed_minor,
				SUM(CASE WHEN payment_state='paid' AND confirmed_at IS NOT NULL THEN 1 ELSE 0 END) AS confirmed_count,
				SUM(CASE WHEN payment_state='pending' THEN 1 ELSE 0 END) AS pending_count,
				SUM(CASE WHEN payment_state IN ('review','refund_reported') THEN 1 ELSE 0 END) AS review_count
				FROM filtered GROUP BY currency ORDER BY currency`).bind(...args),
		]);
		return bookingJson({ payments: result[0].results, total: (result[1].results[0] as {total:number}).total, summary: result[2].results, mode, page, pageSize:25, asOf:now });
	} catch(error) { return bookingFailure(error); }
}
