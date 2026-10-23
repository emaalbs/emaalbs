import { authorizedBooking, applyPaymentEvent } from "@/lib/bookings";
import { bookingBody, bookingFailure, bookingJson, requireSameOrigin } from "@/lib/booking-http";
import { BookingError } from "@/lib/booking-config";
import { isLocalPaymentTest } from "@/lib/payments/core";
import { paymentCheckoutsDisabled, localBookingSimulationEnabled } from "@/lib/payments/availability";
export async function POST(request: Request) {
	try {
		if (!isLocalPaymentTest(request.url, process.env.NODE_ENV)) throw new BookingError("not_found", 404);
		if (await paymentCheckoutsDisabled() && !await localBookingSimulationEnabled()) throw new BookingError("not_found", 404);
		requireSameOrigin(request);
		const { id, status } = await bookingBody(request);
		if (typeof id !== "string" || !["paid", "failed", "cancelled"].includes(status)) throw new BookingError("invalid_details");
		const row = await authorizedBooking(id, request);
		if (row.provider !== "mock" || !row.provider_session) throw new BookingError("not_found", 404);
		return bookingJson(await applyPaymentEvent("mock", { eventId: `${id}-${status}`, bookingId: id, sessionId: row.provider_session, transactionId: `test-${id}`, amountMinor: row.amount_minor, currency: row.currency, status }));
	} catch (error) { return bookingFailure(error); }
}
