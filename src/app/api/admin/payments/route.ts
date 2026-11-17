import { requireAuth } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";
import { bookingFailure, bookingJson } from "@/lib/booking-http";
import { paymentLedger, paymentSummaryQuery } from "@/lib/payment-history";

export async function GET(request: Request) {
	try {
		await requireAuth(request);
		const { cte, args, page, now, mode } = paymentLedger(new URL(request.url).searchParams);
		const { DB } = await getEnv();
		const result = await DB.batch([
			DB.prepare(`${cte} SELECT * FROM filtered ORDER BY created_at DESC,id DESC LIMIT 25 OFFSET ?`).bind(...args,(page-1)*25),
			DB.prepare(`${cte} SELECT COUNT(*) AS total FROM filtered`).bind(...args),
			DB.prepare(`${cte} ${paymentSummaryQuery}`).bind(...args),
		]);
		return bookingJson({ payments: result[0].results, total: (result[1].results[0] as {total:number}).total, summary: result[2].results, mode, page, pageSize:25, asOf:now });
	} catch(error) { return bookingFailure(error); }
}
