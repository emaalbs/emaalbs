import { getEnv } from "@/lib/cloudflare";
import { BookingError } from "@/lib/booking-config";
import { getBookingConfig, limitBookingRequests, publicBooking, type BookingRow } from "@/lib/bookings";
import { bookingBody, bookingFailure, bookingJson, requireSameOrigin } from "@/lib/booking-http";
import { digest } from "@/lib/payments/core";
import { getPaymentProvider, paymentEnv } from "@/lib/payments/provider";
import { withGuestBookingAccess } from "@/lib/payments/guest-access";

export async function POST(request: Request) {
	try {
		requireSameOrigin(request);
		const body = await bookingBody(request);
		const { slug, name, email, phone, locale, acceptedTerms } = body;
		const token = request.headers.get("Idempotency-Key") || "";
		if (!/^[a-f0-9]{64}$/.test(token) || typeof slug !== "string" || !/^[a-z0-9-]{1,160}$/.test(slug) || typeof name !== "string" || name.trim().length < 2 || name.length > 120 || typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof phone !== "string" || phone.length > 40 || !/^[+\d ()-]{6,40}$/.test(phone) || !["en", "ar"].includes(locale) || acceptedTerms !== true) throw new BookingError("invalid_details");
		const provider = await getPaymentProvider(request);
		const { DB } = await getEnv();
		const accessHash = await digest(token);
		const requestHash = await digest(JSON.stringify({ slug, name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), locale }));
		let row = await DB.prepare("SELECT * FROM ibs_bookings WHERE access_hash=?").bind(accessHash).first<BookingRow>();
		if (row && row.request_hash !== requestHash) throw new BookingError("request_conflict", 409);
		if (!row) {
			await limitBookingRequests(request);
			const config = await getBookingConfig(slug);
			if (!config.enabled || config.amountMinor <= 0) throw new BookingError("booking_closed", 409);
			provider.validateOffer?.({ slug, amountMinor: config.amountMinor, currency: config.currency, realPaymentConsent: body.realPaymentConsent === true });
			const now = Date.now();
			const id = crypto.randomUUID();
			// The capacity predicate and insert execute as ONE statement, including concurrent requests.
			await DB.prepare(`INSERT OR IGNORE INTO ibs_bookings
				(id,edition_slug,offer_title,customer_name,email,phone,locale,amount_minor,currency,status,provider,access_hash,request_hash,terms_snapshot,expires_at,created_at,updated_at)
				SELECT ?,?,?,?,?,?,?,?,?,'pending',?,?,?,?,?,?,?
				WHERE EXISTS(SELECT 1 FROM ibs_editions WHERE slug=? AND published=1)
				AND EXISTS(SELECT 1 FROM ibs_booking_settings WHERE edition_slug=? AND config_json=?)
				AND (? IS NULL OR (SELECT COUNT(*) FROM ibs_bookings WHERE edition_slug=? AND
				(status IN ('paid','review') OR (status='pending' AND expires_at>?))) < ?)`)
				.bind(id, slug, JSON.stringify(config.title), name.trim(), email.trim().toLowerCase(), phone.trim(), locale, config.amountMinor, config.currency, provider.name, accessHash, requestHash, JSON.stringify(config.terms), now + 20 * 60000, now, now, slug, slug, JSON.stringify(config), config.capacity, slug, now, config.capacity).run();
			row = await DB.prepare("SELECT * FROM ibs_bookings WHERE access_hash=?").bind(accessHash).first<BookingRow>();
			if (!row) throw new BookingError("sold_out_or_changed", 409);
			if (row.request_hash !== requestHash) throw new BookingError("request_conflict", 409);
		}
		if (row.provider !== provider.name) throw new BookingError("payments_unavailable", 503);
		provider.validateOffer?.({ slug: row.edition_slug, amountMinor: row.amount_minor, currency: row.currency, realPaymentConsent: body.realPaymentConsent === true });
		const reply = (value: unknown, status = 200) => withGuestBookingAccess(bookingJson(value, status), row!.id, token, request);
		if (row.status !== "pending" || row.expires_at <= Date.now()) return reply({ booking: publicBooking(row), checkoutUrl: null });
		if (!row.checkout_url) {
			const origin = provider.returnOrigin || (provider.name === "mock" ? new URL(request.url).origin : (await paymentEnv()).PAYMENT_PUBLIC_ORIGIN!);
			if (provider.name === "bridge" && new URL(origin).protocol !== "https:") throw new BookingError("payments_unavailable", 503);
			let checkout;
			try {
				checkout = await provider.createCheckout({ bookingId: row.id, amountMinor: row.amount_minor, currency: row.currency, title: JSON.parse(row.offer_title)[locale], expiresAt: row.expires_at,
					returnUrl: `${origin}/${locale}/booking/${row.id}`, webhookUrl: `${origin}/api/payments/webhook/bridge` });
			} catch (error) {
				if (error instanceof BookingError) return reply({ error: error.code, booking: publicBooking(row) }, error.status);
				throw error;
			}
			await DB.prepare("UPDATE ibs_bookings SET provider_session=?,checkout_url=?,updated_at=? WHERE id=? AND (provider_session IS NULL OR provider_session=?)").bind(checkout.sessionId, checkout.checkoutUrl, Date.now(), row.id, checkout.sessionId).run();
			row = (await DB.prepare("SELECT * FROM ibs_bookings WHERE id=?").bind(row.id).first<BookingRow>())!;
		}
		return reply({ booking: publicBooking(row), checkoutUrl: row.checkout_url });
	} catch (error) { return bookingFailure(error); }
}
