import { authorizedBooking, publicBooking } from "@/lib/bookings";
import { bookingFailure, bookingJson } from "@/lib/booking-http";
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try { return bookingJson(publicBooking(await authorizedBooking((await params).id, request))); }
	catch (error) { return bookingFailure(error); }
}
