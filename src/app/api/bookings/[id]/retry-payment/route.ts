import { authorizedBooking } from "@/lib/bookings";
import { BookingError } from "@/lib/booking-config";
import { bookingFailure, requireSameOrigin } from "@/lib/booking-http";
import { digest } from "@/lib/payments/core";
import { guestBookingCookie } from "@/lib/payments/guest-access";
import { verifyTabadulBooking } from "@/lib/payments/tabadul";
import { POST as checkout } from "@/app/api/bookings/checkout/route";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		requireSameOrigin(request);
		const row = await authorizedBooking((await params).id, request);
		if (row.status !== "failed" || !["tabadul", "tabadul-preview"].includes(row.provider)) throw new BookingError("retry_not_safe", 409);
		const verified = await verifyTabadulBooking(row, request);
		if (!verified.retryAllowed) throw new BookingError("retry_not_safe", 409);
		const token = request.headers.get("Authorization")?.replace(/^Bearer /, "") || guestBookingCookie(row.id, request);
		// One child per failed attempt, even across tabs or a lost HTTP response.
		// The child has its own order/session; the original history stays intact.
		const key = await digest(`ibs-retry:v1:${row.id}:${token}`);
		const headers = new Headers(request.headers);
		headers.set("Idempotency-Key", key);
		headers.set("Content-Type", "application/json");
		headers.delete("Content-Length");
		if (row.provider === "tabadul-preview") headers.set("X-IBS-Payment-Preview", "tabadul");
		return checkout(new Request(new URL("/api/bookings/checkout", request.url), {
			method: "POST", headers, body: JSON.stringify({
				slug: row.edition_slug, tierId: row.tier_id, name: row.customer_name, email: row.email, phone: row.phone,
				locale: row.locale, acceptedTerms: true, retryOf: row.id,
				expectedOffer: { amountMinor: row.amount_minor, currency: row.currency, title: row.offer_title, terms: row.terms_snapshot, tierName: row.tier_name },
			}),
		}));
	} catch (error) { return bookingFailure(error); }
}
