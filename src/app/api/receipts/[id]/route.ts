import { findBooking } from "@/lib/bookings";
import { receiptForBooking } from "@/lib/booking-receipt";
import { BookingError } from "@/lib/booking-config";
import { bookingFailure, bookingJson } from "@/lib/booking-http";
export async function GET(request: Request, {params}: {params:Promise<{id:string}>}) {
	try {
		const token = request.headers.get("Authorization")?.replace(/^Bearer /, "") || "";
		if (!/^[a-f0-9]{64}$/.test(token)) throw new BookingError("not_found",404);
		const row = await findBooking((await params).id);
		if (!row || !row.receipt_token || row.receipt_token !== token) throw new BookingError("not_found",404);
		return bookingJson(await receiptForBooking(row,request));
	} catch(error) { return bookingFailure(error); }
}
