import { requireAuth } from "@/lib/auth";
import { findBooking } from "@/lib/bookings";
import { BookingError } from "@/lib/booking-config";
import { bookingFailure, bookingJson, requireSameOrigin } from "@/lib/booking-http";
import { verifyTabadulBooking } from "@/lib/payments/tabadul";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		await requireAuth(request); requireSameOrigin(request);
		const row = await findBooking((await params).id);
		if (!row) throw new BookingError("not_found", 404);
		return bookingJson(await verifyTabadulBooking(row, request));
	} catch (error) { return bookingFailure(error); }
}
