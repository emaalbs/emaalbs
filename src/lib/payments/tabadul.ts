import { getEnv } from "@/lib/cloudflare";
import { requireAuth } from "@/lib/auth";
import { BookingError } from "../booking-config";
import { applyPaymentEvent, findBooking, publicBooking, type BookingRow } from "../bookings";
import { isLocalPaymentTest } from "./core";
import { createTabadulClient, tabadulAmount, tabadulOrderNumber, type TabadulConfig, type TabadulOrder, type TabadulTransport } from "./tabadul-core";
import type { CheckoutInput, PaymentProvider } from "./provider";
import { publicPaymentOrigin, requirePublicPaymentRequest } from "./public-policy";

type Env = { PAYMENT_PROVIDER?: string; PAYMENT_PUBLIC_ORIGIN?: string; TABADUL_LIVE_ENABLED?: string; TABADUL_PILOT_ACKNOWLEDGED?: string; TABADUL_USERNAME?: string; TABADUL_PASSWORD?: string; TABADUL_IQD_UNITS_PER_DINAR?: string; TABADUL_PAID_STATUS?: string; TABADUL_CHECKOUT_HOSTS?: string; TABADUL_TEST_EDITION?: string };
type Attempt = { registration_state: string; session_id: string | null; checkout_url: string | null; simulation_state: number; gateway_state: number | null; gateway_order_number: string | null };
const SIMULATED_HOST = "tabadul-preview.invalid";

async function context(request: Request, real: boolean, publicMode = false, enforceOrigin = true) {
	if (publicMode) {
		const env = await getEnv() as Env;
		if (process.env.NODE_ENV !== "production" || !real || env.PAYMENT_PROVIDER !== "tabadul" || env.TABADUL_LIVE_ENABLED !== "true" || !env.TABADUL_USERNAME || !env.TABADUL_PASSWORD || env.TABADUL_IQD_UNITS_PER_DINAR !== "1000" || env.TABADUL_PAID_STATUS !== "2" || env.TABADUL_CHECKOUT_HOSTS !== "epg.tabadul.iq") throw new BookingError("payments_unavailable", 503);
		const origin = publicPaymentOrigin(env.PAYMENT_PUBLIC_ORIGIN);
		if (enforceOrigin) requirePublicPaymentRequest(request, origin);
		return {config: {userName: env.TABADUL_USERNAME, password: env.TABADUL_PASSWORD, iqdUnitsPerDinar: 1000, paidStatus: 2, checkoutHosts: ["epg.tabadul.iq"]} as TabadulConfig, edition: "", origin};
	}
	// This implementation is intentionally NOT enabled on public Workers or LAN previews.
	if (!isLocalPaymentTest(request.url, process.env.NODE_ENV)) throw new BookingError("payments_unavailable", 503);
	if (!real) return { config: { userName: "SIMULATION", password: "NOT-A-CREDENTIAL", iqdUnitsPerDinar: 1000, paidStatus: 2, checkoutHosts: [SIMULATED_HOST] } as TabadulConfig, edition: "", origin: new URL(request.url).origin };
	await requireAuth(request); // Actual-money pilot requires a local admin, not just a hidden link.
	const env = await getEnv() as Env;
	const units = Number(env.TABADUL_IQD_UNITS_PER_DINAR);
	if (env.TABADUL_LIVE_ENABLED !== "true" || env.TABADUL_PILOT_ACKNOWLEDGED !== "true" || !env.TABADUL_USERNAME || !env.TABADUL_PASSWORD || ![1, 100, 1000].includes(units) || !["1", "2"].includes(env.TABADUL_PAID_STATUS || "") || !env.TABADUL_CHECKOUT_HOSTS || !env.TABADUL_TEST_EDITION) throw new BookingError("real_payment_locked", 503);
	const hosts = env.TABADUL_CHECKOUT_HOSTS.split(",").map(x => x.trim()).filter(Boolean);
	if (!hosts.length || hosts.some(h => !/^[a-z0-9.-]+$/.test(h) || !(h === "tabadul.iq" || h.endsWith(".tabadul.iq")))) throw new BookingError("real_payment_locked", 503);
	return { config: { userName: env.TABADUL_USERNAME, password: env.TABADUL_PASSWORD, iqdUnitsPerDinar: units, paidStatus: Number(env.TABADUL_PAID_STATUS) as 1 | 2, checkoutHosts: hosts }, edition: env.TABADUL_TEST_EDITION, origin: new URL(request.url).origin };
}
function orderFromRow(row: BookingRow, request: Request): TabadulOrder {
	return { bookingId: row.id, amountMinor: row.amount_minor, currency: row.currency, title: JSON.parse(row.offer_title)[row.locale], locale: row.locale, expiresAt: row.expires_at, returnUrl: `${new URL(request.url).origin}/${row.locale}/booking/${row.id}` };
}
// Exercises the same form encoding/response validation as the real adapter. No outbound calls.
function simulationTransport(row: BookingRow): TabadulTransport {
	return async (operation, fields) => {
		const { DB } = await getEnv();
		const attempt = await DB.prepare("SELECT * FROM ibs_tabadul_attempts WHERE booking_id=?").bind(row.id).first<Attempt>();
		if (!attempt) throw new BookingError("not_found", 404);
		if (operation === "register.do") return { orderId: `preview-${row.id}`, formUrl: `https://${SIMULATED_HOST}/checkout/${row.id}` };
		if (fields.get("orderId") !== attempt.session_id) throw new BookingError("payment_mismatch", 409);
		return { ErrorCode: "0", OrderStatus: attempt.simulation_state, OrderNumber: tabadulOrderNumber(row.id), currency: "368", Amount: row.amount_minor, ...(attempt.simulation_state === 2 ? { depositAmount: row.amount_minor } : {}) };
	};
}
export async function tabadulProvider(request: Request, real = false, publicMode = false): Promise<PaymentProvider> {
	const ctx = await context(request, real, publicMode);
	return {
		name: real ? "tabadul" : "tabadul-preview",
		returnOrigin: ctx.origin || new URL(request.url).origin,
		validateOffer(input) {
			tabadulAmount(input.amountMinor, input.currency, ctx.config.iqdUnitsPerDinar);
			// Hard ceiling 1,000 IQD for the private real-money pilot; price always comes from DB.
			if (real && !publicMode && (input.slug !== ctx.edition || input.amountMinor > 1000000 || !input.realPaymentConsent)) throw new BookingError("real_payment_not_allowed", 403);
		},
		async createCheckout(input: CheckoutInput) {
			const { DB } = await getEnv();
			const row = await findBooking(input.bookingId);
			if (!row || row.provider !== (real ? "tabadul" : "tabadul-preview")) throw new BookingError("not_found", 404);
			const insert = await DB.prepare("INSERT OR IGNORE INTO ibs_tabadul_attempts(booking_id,created_at,checkout_mode) VALUES(?,?,?)").bind(row.id, Date.now(), publicMode ? "public" : real ? "pilot" : "simulation").run();
			if (!insert.meta.changes) {
				const attempt = await DB.prepare("SELECT * FROM ibs_tabadul_attempts WHERE booking_id=?").bind(row.id).first<Attempt>();
				if (attempt?.registration_state === "ready" && attempt.session_id && attempt.checkout_url && (!real || attempt.gateway_order_number)) return { sessionId: attempt.session_id, checkoutUrl: attempt.checkout_url };
				// Never re-register after a timeout: the original provider order may already exist.
				throw new BookingError("gateway_registration_pending", 409);
			}
			try {
				const client = createTabadulClient(ctx.config, real ? undefined : simulationTransport(row));
				const result = await client.register(orderFromRow(row, request));
				// Keep a returned session even if the pre-check fails: an admin can investigate
				// the existing order rather than registering/charging again.
				await DB.prepare("UPDATE ibs_bookings SET provider_session=? WHERE id=? AND provider_session IS NULL").bind(result.sessionId,row.id).run();
				await DB.prepare("UPDATE ibs_tabadul_attempts SET session_id=? WHERE booking_id=?").bind(result.sessionId,row.id).run();
				const gatewayNumber = real ? await client.inspectRegisteredOrder(orderFromRow(row,request),result.sessionId) : tabadulOrderNumber(row.id);
				if (!real) result.checkoutUrl = orderFromRow(row, request).returnUrl;
				await DB.prepare("UPDATE ibs_tabadul_attempts SET registration_state='ready',session_id=?,checkout_url=?,gateway_order_number=? WHERE booking_id=?").bind(result.sessionId, result.checkoutUrl,gatewayNumber, row.id).run();
				return result;
			} catch (error) {
				await DB.prepare("UPDATE ibs_tabadul_attempts SET registration_state='uncertain' WHERE booking_id=?").bind(row.id).run();
				throw error;
			}
		},
	};
}
export async function verifyTabadulBooking(row: BookingRow, request: Request) {
	if (!["tabadul", "tabadul-preview"].includes(row.provider) || !row.provider_session) throw new BookingError("not_found", 404);
	const ctx = await context(request, row.provider === "tabadul", row.provider === "tabadul" && process.env.NODE_ENV === "production", false);
	const { DB } = await getEnv();
	const attempt = await DB.prepare("SELECT * FROM ibs_tabadul_attempts WHERE booking_id=?").bind(row.id).first<Attempt>();
	if (row.provider === "tabadul" && !attempt?.gateway_order_number) throw new BookingError("payment_mismatch",409);
	// Atomically limit checks per booking (including concurrent tabs). Failures also back off.
	const claim = await DB.prepare("UPDATE ibs_tabadul_attempts SET check_after=? WHERE booking_id=? AND check_after<=?").bind(Date.now() + 15000, row.id, Date.now()).run();
	if (!claim.meta.changes) return { ...publicBooking((await findBooking(row.id))!), verification: "cooldown" };
	let result;
	try {
		result = await createTabadulClient(ctx.config, row.provider === "tabadul-preview" ? simulationTransport(row) : undefined).status({...orderFromRow(row, request),gatewayOrderNumber:attempt?.gateway_order_number || undefined}, row.provider_session);
	} catch (error) {
		await DB.prepare("UPDATE ibs_tabadul_attempts SET verification_error=? WHERE booking_id=?").bind(error instanceof BookingError ? error.code : "gateway_unavailable", row.id).run();
		throw error;
	}
	await DB.prepare("UPDATE ibs_tabadul_attempts SET gateway_state=?,last_verified_at=?,verification_error=NULL WHERE booking_id=?").bind(result.state, Date.now(), row.id).run();
	if (result.status === "refunded") {
		// Do not claim an automatic refund or silently release a possibly partly refunded seat.
		await DB.batch([
			DB.prepare("INSERT OR IGNORE INTO ibs_payment_events(provider,event_id,booking_id,status,received_at) VALUES(?,?,?,'refunded',?)").bind(row.provider, `${row.provider_session}:4`, row.id, Date.now()),
			DB.prepare("UPDATE ibs_bookings SET status='review',updated_at=? WHERE id=? AND (SELECT changes())=1").bind(Date.now(), row.id),
		]);
	} else if (result.status !== "pending") {
		await applyPaymentEvent(row.provider, { eventId: `${row.provider_session}:${result.state}`, bookingId: row.id, sessionId: row.provider_session, transactionId: row.provider_session, amountMinor: row.amount_minor, currency: row.currency, status: result.status });
	}
	return { ...publicBooking((await findBooking(row.id))!), verification: "checked", gatewayState: result.state };
}
export async function simulateTabadul(row: BookingRow, request: Request, state: number) {
	if (!isLocalPaymentTest(request.url, process.env.NODE_ENV) || row.provider !== "tabadul-preview" || !row.provider_session) throw new BookingError("not_found", 404);
	if (![0, 1, 2, 3, 4, 6].includes(state)) throw new BookingError("invalid_details");
	const { DB } = await getEnv();
	// Changes fake gateway state, NOT booking state. Verification must still validate the response.
	await DB.prepare("UPDATE ibs_tabadul_attempts SET simulation_state=?,check_after=0 WHERE booking_id=?").bind(state, row.id).run();
}
