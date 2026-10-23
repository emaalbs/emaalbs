import { BookingError } from "../booking-config";

// No credentials, customer/card data or provider response bodies are logged here.
export type TabadulConfig = {
	userName: string; password: string; iqdUnitsPerDinar: number;
	paidStatus: 1 | 2; checkoutHosts: string[];
};
export type TabadulOrder = {
	bookingId: string; amountMinor: number; currency: string;
	title: string; locale: string; expiresAt: number; returnUrl: string; gatewayOrderNumber?: string;
};
export type TabadulTransport = (operation: "register.do" | "getOrderStatus.do", fields: URLSearchParams) => Promise<Record<string, unknown>>;
export const TABADUL_ENDPOINT = "https://epg.tabadul.iq/epg/rest/";

export function tabadulOrderNumber(id: string) {
	if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id)) throw new BookingError("invalid_booking");
	return id.replaceAll("-", ""); // Provider permits at most 32 characters, unlike UUIDs.
}
function integer(value: unknown): number {
	if (!(typeof value === "number" || (typeof value === "string" && /^\d+$/.test(value)))) throw new BookingError("gateway_invalid_response", 502);
	const result = Number(value);
	if (!Number.isSafeInteger(result) || result < 0) throw new BookingError("gateway_invalid_response", 502);
	return result;
}
export function tabadulAmount(amountMinor: number, currency: string, units: number) {
	if (currency !== "IQD" || ![1, 100, 1000].includes(units) || !Number.isSafeInteger(amountMinor) || amountMinor <= 0) throw new BookingError("gateway_currency_unavailable", 503);
	const scaled = BigInt(amountMinor) * BigInt(units);
	if (scaled % 1000n !== 0n || scaled / 1000n > BigInt(Number.MAX_SAFE_INTEGER)) throw new BookingError("invalid_price");
	return Number(scaled / 1000n);
}
export function validateTabadulCheckout(value: unknown, hosts: string[]) {
	if (typeof value !== "string" || value.length > 4096) throw new BookingError("gateway_invalid_response", 502);
	let url: URL;
	try { url = new URL(value); } catch { throw new BookingError("gateway_invalid_response", 502); }
	if (url.protocol !== "https:" || url.username || url.password || url.port || !hosts.includes(url.hostname)) throw new BookingError("gateway_invalid_response", 502);
	return url.href;
}
export const tabadulHttpTransport: TabadulTransport = async (operation, fields) => {
	try {
		const response = await fetch(TABADUL_ENDPOINT + operation, {
			// Workers does not support redirect: "error". Never follow redirects with
			// merchant credentials: manual returns 3xx, rejected by response.ok below.
			method: "POST", redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(12000),
			headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" }, body: fields.toString(),
		});
		if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) throw new Error();
		// Bounded streamed body, including when Content-Length is absent.
		const reader = response.body?.getReader();
		if (!reader) throw new Error();
		const decoder = new TextDecoder(); let raw = ""; let size = 0;
		while (true) {
			const { done, value } = await reader.read(); if (done) break;
			size += value.byteLength;
			if (size > 65536) { await reader.cancel(); throw new Error(); }
			raw += decoder.decode(value, { stream: true });
		}
		const result = JSON.parse(raw + decoder.decode());
		if (!result || typeof result !== "object" || Array.isArray(result)) throw new Error();
		return result;
	} catch { throw new BookingError("gateway_unavailable", 502); }
};
export function createTabadulClient(config: TabadulConfig, transport: TabadulTransport = tabadulHttpTransport) {
	const credentials = () => new URLSearchParams({ userName: config.userName, password: config.password });
	return {
		// This merchant account generates its own order number. Pin it BEFORE exposing
		// checkout, using the session returned by authenticated registration. Never
		// adopt an unfamiliar number from a paid response or a browser return URL.
		async inspectRegisteredOrder(order: TabadulOrder, sessionId: string) {
			const fields = credentials(); fields.set("orderId", sessionId); fields.set("language", "en");
			const data = await transport("getOrderStatus.do", fields);
			if (integer(data.ErrorCode) !== 0 || integer(data.OrderStatus) !== 0 || integer(data.Amount) !== tabadulAmount(order.amountMinor, order.currency, config.iqdUnitsPerDinar) || integer(data.currency) !== 368 || data.Description !== order.title.slice(0,160) || typeof data.OrderNumber !== "string" || !/^[a-zA-Z0-9_-]{1,32}$/.test(data.OrderNumber)) throw new BookingError("payment_mismatch",409);
			return data.OrderNumber;
		},
		async register(order: TabadulOrder) {
			const seconds = Math.floor((order.expiresAt - Date.now()) / 1000);
			if (seconds < 1) throw new BookingError("booking_expired", 409);
			const fields = credentials();
			Object.entries({ orderNumber: tabadulOrderNumber(order.bookingId), amount: String(tabadulAmount(order.amountMinor, order.currency, config.iqdUnitsPerDinar)), currency: "368",
				returnUrl: order.returnUrl, description: order.title.slice(0, 160), language: order.locale === "ar" ? "ar" : "en", sessionTimeoutSecs: String(Math.min(1200, seconds)) }).forEach(([key, value]) => fields.set(key, value));
			const data = await transport("register.do", fields);
			if (data.errorCode !== undefined && integer(data.errorCode) !== 0) throw new BookingError("gateway_registration_rejected", 502);
			if (typeof data.orderId !== "string" || !/^[a-zA-Z0-9-]{1,64}$/.test(data.orderId)) throw new BookingError("gateway_invalid_response", 502);
			return { sessionId: data.orderId, checkoutUrl: validateTabadulCheckout(data.formUrl, config.checkoutHosts) };
		},
		async status(order: TabadulOrder, sessionId: string) {
			const fields = credentials(); fields.set("orderId", sessionId); fields.set("language", "en");
			const data = await transport("getOrderStatus.do", fields);
			// This merchant returns ErrorCode 2 with declined OrderStatus 6. Accept
			// only that pair, and still require exact pinned identity/amount below.
			const code = integer(data.ErrorCode);
			if (code !== 0 && !(code === 2 && integer(data.OrderStatus) === 6)) throw new BookingError("gateway_status_unavailable", 502);
			const expected = tabadulAmount(order.amountMinor, order.currency, config.iqdUnitsPerDinar);
			// Missing optional identity/amount fields fail closed: never confirm unverifiable money.
			if (data.OrderNumber !== (order.gatewayOrderNumber || tabadulOrderNumber(order.bookingId)) || integer(data.currency) !== 368 || integer(data.Amount) !== expected) throw new BookingError("payment_mismatch", 409);
			const state = integer(data.OrderStatus);
			if (![0, 1, 2, 3, 4, 6].includes(state)) throw new BookingError("gateway_status_unknown", 502);
			if (state === 2 && data.depositAmount !== undefined && integer(data.depositAmount) !== expected) throw new BookingError("payment_mismatch", 409);
			const status = state === 2 || (state === 1 && config.paidStatus === 1) ? "paid" : state === 6 ? "failed" : state === 3 ? "cancelled" : state === 4 ? "refunded" : "pending";
			return { state, status } as const;
		},
	};
}
