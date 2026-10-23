import { authorizedBooking } from "@/lib/bookings";
import { bookingFailure, bookingJson, requireSameOrigin } from "@/lib/booking-http";
import { verifyTabadulBooking } from "@/lib/payments/tabadul";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		requireSameOrigin(request);
		return bookingJson(await verifyTabadulBooking(await authorizedBooking((await params).id, request), request));
	} catch (error) { return bookingFailure(error); }
}
