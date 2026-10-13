import { getEnv } from "@/lib/cloudflare";
import { BookingError, defaultBookingConfig, type BookingConfig } from "./booking-config";
import { digest, type BookingStatus, type PaymentEvent } from "./payments/core";

export type BookingRow = { id: string; edition_slug: string; offer_title: string; customer_name: string; email: string; phone: string; locale: string; amount_minor: number; currency: string; status: BookingStatus; provider: string; access_hash: string; request_hash: string; provider_session: string | null; checkout_url: string | null; transaction_id: string | null; expires_at: number; created_at: number };
export async function getBookingConfig(slug: string): Promise<BookingConfig> {
	const { DB } = await getEnv();
	const row = await DB.prepare("SELECT config_json FROM ibs_booking_settings WHERE edition_slug = ?").bind(slug).first<{ config_json: string }>();
	return row ? JSON.parse(row.config_json) : defaultBookingConfig();
}
export async function findBooking(id: string) {
	const { DB } = await getEnv();
	return DB.prepare("SELECT * FROM ibs_bookings WHERE id = ?").bind(id).first<BookingRow>();
}
export async function authorizedBooking(id: string, request: Request) {
	const token = request.headers.get("Authorization")?.replace(/^Bearer /, "") ?? "";
	if (!/^[a-f0-9]{64}$/.test(token)) throw new BookingError("not_found", 404);
	const row = await findBooking(id);
	if (!row || row.access_hash !== await digest(token)) throw new BookingError("not_found", 404);
	return row;
}
export function publicBooking(row: BookingRow) {
	return { id: row.id, editionSlug: row.edition_slug, title: row.offer_title, amountMinor: row.amount_minor, currency: row.currency, status: row.status === "pending" && row.expires_at <= Date.now() ? "expired" : row.status, provider: row.provider, expiresAt: row.expires_at };
}

export async function applyPaymentEvent(provider: string, event: PaymentEvent) {
	const { DB } = await getEnv();
	const row = await findBooking(event.bookingId);
	if (!row || row.provider !== provider || row.provider_session !== event.sessionId || row.amount_minor !== event.amountMinor || row.currency !== event.currency) throw new BookingError("payment_mismatch", 409);
	if (row.transaction_id && event.status === "paid" && row.transaction_id !== event.transactionId) throw new BookingError("transaction_mismatch", 409);
	const now = Date.now();
	// Status guards are evaluated by SQLite, not by a stale read; a delayed failure cannot undo payment.
	await DB.batch([
		DB.prepare("INSERT OR IGNORE INTO ibs_payment_events(provider,event_id,booking_id,status,received_at) VALUES(?,?,?,?,?)").bind(provider, event.eventId, row.id, event.status, now),
		DB.prepare(`UPDATE ibs_bookings SET status = CASE
			WHEN status IN ('paid','review') THEN status
			WHEN ? = 'paid' THEN CASE WHEN status = 'pending' AND expires_at > ? THEN 'paid' ELSE 'review' END
			WHEN status = 'pending' THEN ? ELSE status END,
			transaction_id = CASE WHEN ? = 'paid' THEN COALESCE(transaction_id, ?) ELSE transaction_id END, updated_at = ?
			WHERE id = ? AND (SELECT changes()) = 1`).bind(event.status, now, event.status, event.status, event.transactionId, now, row.id),
	]);
	return publicBooking((await findBooking(row.id))!);
}

export async function limitBookingRequests(request: Request) {
	const { DB } = await getEnv();
	const now = Date.now();
	const key = await digest(`booking:${request.headers.get("cf-connecting-ip") || "local"}:${Math.floor(now / 600000)}`);
	const results = await DB.batch([
		DB.prepare("DELETE FROM ibs_booking_limits WHERE expires_at < ?").bind(now),
		DB.prepare("INSERT INTO ibs_booking_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count").bind(key, now + 600000),
	]);
	if (Number((results[1].results[0] as { count: number })?.count) > 15) throw new BookingError("too_many_requests", 429);
}

