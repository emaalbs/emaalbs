import { authorizedBooking } from "@/lib/bookings";
import { receiptForBooking } from "@/lib/booking-receipt";
import { bookingFailure, bookingJson } from "@/lib/booking-http";
export async function GET(request: Request, {params}: {params:Promise<{id:string}>}) {
	try { return bookingJson(await receiptForBooking(await authorizedBooking((await params).id,request),request)); }
	catch(error) { return bookingFailure(error); }
}
