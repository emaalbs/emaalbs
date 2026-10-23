import { requireAuth } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";
import { BookingError } from "@/lib/booking-config";
import { bookingFailure, bookingJson } from "@/lib/booking-http";
export async function GET(request: Request, {params}:{params:Promise<{id:string}>}) {
	try {
		await requireAuth(request);
		const {id}=await params;
		if (!/^[a-f0-9-]{36}$/.test(id)) throw new BookingError("not_found",404);
		const {DB}=await getEnv();
		const row=await DB.prepare("SELECT id FROM ibs_bookings WHERE id=?").bind(id).first();
		if(!row) throw new BookingError("not_found",404);
		const events=await DB.prepare("SELECT status,received_at FROM ibs_payment_events WHERE booking_id=? ORDER BY received_at,event_id").bind(id).all();
		const verification=await DB.prepare("SELECT registration_state,gateway_order_number,gateway_state,last_verified_at,verification_error FROM ibs_tabadul_attempts WHERE booking_id=?").bind(id).first();
		return bookingJson({events:events.results,verification});
	} catch(error){return bookingFailure(error);}
}
