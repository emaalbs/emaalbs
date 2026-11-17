import { requireAuth } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";
import { BookingError } from "@/lib/booking-config";
import { bookingFailure, bookingJson } from "@/lib/booking-http";
import { paymentLedger, paymentSummaryQuery } from "@/lib/payment-history";

export async function GET(request: Request) {
	try {
		await requireAuth(request);
		const { cte, args, now, filters } = paymentLedger(new URL(request.url).searchParams);
		const { DB } = await getEnv();
		// Bound memory/CPU; never silently export an incomplete report.
		// XLSX generation happens in the browser, not on the Worker.
		const result = await DB.batch([
			DB.prepare(`${cte} SELECT f.*,COALESCE(NULLIF(d.title_ar,''),NULLIF(d.title_en,''),f.edition_slug) AS edition_title
				FROM filtered f LEFT JOIN ibs_editions d ON d.slug=f.edition_slug ORDER BY f.created_at DESC,f.id DESC LIMIT 10001`).bind(...args),
			DB.prepare(`${cte} ${paymentSummaryQuery}`).bind(...args),
		]);
		if (result[0].results.length > 10000) throw new BookingError("export_too_large", 413);
		return bookingJson({ payments: result[0].results, summary: result[1].results, total: result[0].results.length, filters, asOf: now });
	} catch (error) { return bookingFailure(error); }
}
