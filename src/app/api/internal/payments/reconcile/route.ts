import { getEnv } from "@/lib/cloudflare";
import { bookingFailure, bookingJson } from "@/lib/booking-http";
import { digest } from "@/lib/payments/core";
import { verifyTabadulBooking } from "@/lib/payments/tabadul";
import { findBooking } from "@/lib/bookings";

// Only the scheduled Worker (or an explicitly authorized operator) may call this.
// No card charges, registrations or refunds: authenticated status queries only.
export async function POST(request: Request) {
	const env = await getEnv() as Awaited<ReturnType<typeof getEnv>> & {PAYMENT_RECONCILE_SECRET?: string; PAYMENT_PROVIDER?: string};
	const secret = env.PAYMENT_RECONCILE_SECRET;
	const token = request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
	if (!secret || secret.length < 32 || token.length > 256 || await digest(token) !== await digest(secret)) return bookingJson({error: "unauthorized"}, 401);
	if (process.env.NODE_ENV !== "production" || env.PAYMENT_PROVIDER !== "tabadul") return bookingJson({error: "not_available"}, 503);
	try {
		const now = Date.now();
		const rows = await env.DB.prepare(`SELECT a.booking_id FROM ibs_tabadul_attempts a JOIN ibs_bookings b ON b.id=a.booking_id
			WHERE a.checkout_mode='public' AND a.reconcile_after<=? AND a.gateway_order_number IS NOT NULL
			AND b.provider='tabadul' AND b.provider_session IS NOT NULL AND b.created_at>?
			ORDER BY a.reconcile_after ASC LIMIT 20`).bind(now, now-7*86400000).all<{booking_id:string}>();
		const queue = [...rows.results]; let checked=0, failed=0;
		async function work() {
			while(queue.length) {
				const item=queue.pop()!; const row=await findBooking(item.booking_id); if(!row) continue;
				const delay = row.status === "pending" && now-row.created_at < 86400000 ? 5*60000 : 6*3600000;
				const claim=await env.DB.prepare("UPDATE ibs_tabadul_attempts SET reconcile_after=? WHERE booking_id=? AND reconcile_after<=?").bind(now+delay,row.id,now).run();
				if(!claim.meta.changes) continue;
				try { await verifyTabadulBooking(row,request); checked++; } catch { failed++; }
			}
		}
		await Promise.all([work(),work(),work(),work()]);
		// Counts only, no identities, secrets or gateway responses in cron logs.
		return bookingJson({checked,failed});
	} catch(error) { return bookingFailure(error); }
}
