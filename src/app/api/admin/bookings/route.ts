import { requireAuth } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";
import { bookingFailure, bookingJson } from "@/lib/booking-http";
export async function GET(request: Request) {
	try {
		await requireAuth(request);
		const search = new URL(request.url).searchParams;
		const page = Math.max(1, Math.min(10000, Number(search.get("page")) || 1));
		const slug = search.get("edition") || "";
		const { DB } = await getEnv();
		const filter = slug ? " WHERE edition_slug = ?" : "";
		const args = slug ? [slug] : [];
		const results = await DB.prepare(`SELECT id,edition_slug,customer_name,email,phone,amount_minor,currency,
			CASE WHEN status='pending' AND expires_at<=? THEN 'expired' ELSE status END AS status,
			provider,transaction_id,created_at FROM ibs_bookings${filter} ORDER BY created_at DESC LIMIT 50 OFFSET ?`).bind(Date.now(), ...args, (Math.floor(page) - 1) * 50).all();
		const count = await DB.prepare(`SELECT COUNT(*) AS total FROM ibs_bookings${filter}`).bind(...args).first<{ total: number }>();
		return bookingJson({ bookings: results.results, total: count?.total ?? 0, page: Math.floor(page) });
	} catch (error) { return bookingFailure(error); }
}
