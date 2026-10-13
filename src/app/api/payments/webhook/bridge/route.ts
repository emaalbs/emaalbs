import { applyPaymentEvent } from "@/lib/bookings";
import { bookingFailure, bookingJson, bookingRawBody } from "@/lib/booking-http";
import { BookingError } from "@/lib/booking-config";
import { parsePaymentEvent, verifyPaymentSignature } from "@/lib/payments/core";
import { paymentEnv } from "@/lib/payments/provider";
export async function POST(request: Request) {
	try {
		const env = await paymentEnv();
		if (env.PAYMENT_PROVIDER !== "bridge" || !env.PAYMENT_WEBHOOK_SECRET) throw new BookingError("payments_unavailable", 503);
		const raw = await bookingRawBody(request);
		if (!await verifyPaymentSignature(raw, request.headers.get("x-payment-timestamp") || "", request.headers.get("x-payment-signature") || "", env.PAYMENT_WEBHOOK_SECRET)) throw new BookingError("invalid_signature", 401);
		let event;
		try { event = parsePaymentEvent(JSON.parse(raw)); } catch { throw new BookingError("invalid_event"); }
		await applyPaymentEvent("bridge", event);
		return bookingJson({ received: true });
	} catch (error) { return bookingFailure(error); }
}
