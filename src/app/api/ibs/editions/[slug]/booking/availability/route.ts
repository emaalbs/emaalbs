import { getEnv } from "@/lib/cloudflare";
import { bookingTiers, type BookingConfig, type BookingAvailability, BookingError } from "@/lib/booking-config";
import { bookingJson, bookingFailure } from "@/lib/booking-http";
import { paymentCheckoutsDisabled, localBookingSimulationEnabled } from "@/lib/payments/availability";

export const dynamic = "force-dynamic";

// Public aggregate only: never return guest details, booking IDs or payment data.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
	try {
		const { slug } = await params;
		if (!/^[a-z0-9-]{1,160}$/.test(slug)) throw new BookingError("not_found", 404);
		const { DB } = await getEnv();
		const row = await DB.prepare(`SELECT s.config_json FROM ibs_booking_settings s
			JOIN ibs_editions e ON e.slug=s.edition_slug WHERE s.edition_slug=? AND e.published=1`).bind(slug).first<{ config_json: string }>();
		if (!row) throw new BookingError("not_found", 404);
		const config = JSON.parse(row.config_json) as BookingConfig;
		if (!config.enabled || (await paymentCheckoutsDisabled() && !await localBookingSimulationEnabled())) return bookingJson({ enabled: false, tiers: [] });
		// Must match the atomic inventory predicate in checkout/route.ts exactly.
		const counts = await DB.prepare(`SELECT tier_id,COUNT(*) AS occupied FROM ibs_bookings WHERE edition_slug=?
			AND (status IN ('paid','review') OR (status='pending' AND expires_at>?)) GROUP BY tier_id`).bind(slug, Date.now()).all<{ tier_id: string; occupied: number }>();
		const occupied = new Map(counts.results.map(r => [r.tier_id, r.occupied]));
		const result: BookingAvailability = { enabled: true, tiers: bookingTiers(config).filter(t => t.enabled).map(t => ({
			id: t.id, remaining: t.capacity === null ? null : Math.max(0, t.capacity - (occupied.get(t.id) || 0)),
		})) };
		return bookingJson(result);
	} catch (error) { return bookingFailure(error); }
}
