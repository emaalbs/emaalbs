import { authorizedBooking } from "@/lib/bookings";
import { BookingError } from "@/lib/booking-config";
import { bookingBody, bookingFailure, bookingJson, requireSameOrigin } from "@/lib/booking-http";
import { isLocalPaymentTest } from "@/lib/payments/core";
import { simulateTabadul } from "@/lib/payments/tabadul";
import { paymentCheckoutsDisabled } from "@/lib/payments/availability";

export async function POST(request: Request) {
	try {
		if (!isLocalPaymentTest(request.url, process.env.NODE_ENV)) throw new BookingError("not_found", 404);
		if (await paymentCheckoutsDisabled()) throw new BookingError("not_found", 404);
		requireSameOrigin(request);
		const { id, state } = await bookingBody(request);
		if (typeof id !== "string" || !Number.isInteger(state)) throw new BookingError("invalid_details");
		await simulateTabadul(await authorizedBooking(id, request), request, state);
		return bookingJson({ simulated: true });
	} catch (error) { return bookingFailure(error); }
}
