import { getEnv } from "@/lib/cloudflare";
import { BookingError } from "@/lib/booking-config";
import { findBooking, type BookingRow } from "@/lib/bookings";
import { isLocalPaymentTest } from "@/lib/payments/core";
import type { BookingReceipt } from "./receipt-types";

// Read-only receipt capability, deliberately separate from the owner's checkout token.
export async function receiptForBooking(row: BookingRow, request: Request): Promise<BookingReceipt> {
	const { DB } = await getEnv();
	const preview = ["mock", "tabadul-preview"].includes(row.provider);
	if (preview && !isLocalPaymentTest(request.url, process.env.NODE_ENV)) throw new BookingError("not_found", 404);
	// Re-read state together with its evidence. Redirects and client claims never issue receipts.
	const verified = await DB.prepare(`SELECT MIN(e.received_at) AS paid_at FROM ibs_bookings b
		JOIN ibs_payment_events e ON e.booking_id=b.id AND e.provider=b.provider AND e.status='paid'
		WHERE b.id=? AND b.status='paid' AND b.transaction_id IS NOT NULL
		AND NOT EXISTS(SELECT 1 FROM ibs_payment_events r WHERE r.booking_id=b.id AND r.provider=b.provider AND r.status='refunded')`).bind(row.id).first<{paid_at:number|null}>();
	if (!verified?.paid_at) throw new BookingError("receipt_unavailable", 409);
	if (!row.receipt_token) {
		const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, "0")).join("");
		await DB.prepare("UPDATE ibs_bookings SET receipt_token=? WHERE id=? AND receipt_token IS NULL").bind(token, row.id).run();
		row = (await findBooking(row.id))!;
	}
	return { id:row.id, guest:row.customer_name, title:JSON.parse(row.offer_title), tier:JSON.parse(row.tier_name), edition:row.edition_snapshot ? JSON.parse(row.edition_snapshot) : null,
		amountMinor:row.amount_minor, currency:row.currency, paidAt:verified.paid_at, bookedAt:row.created_at, transaction:row.transaction_id!, provider:row.provider, preview, receiptToken:row.receipt_token! };
}
