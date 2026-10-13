import { BookingError } from "../booking-config";

export type PaymentEvent = { eventId: string; bookingId: string; sessionId: string; transactionId: string; status: "paid" | "failed" | "cancelled"; amountMinor: number; currency: string };
export type BookingStatus = "pending" | "paid" | "failed" | "cancelled" | "expired" | "review";
export async function digest(value: string) {
	return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))), b => b.toString(16).padStart(2, "0")).join("");
}
export function nextPaymentStatus(current: BookingStatus, event: PaymentEvent["status"], expired: boolean): BookingStatus {
	if (current === "paid" || current === "review") return current;
	if (event === "paid") return current === "pending" && !expired ? "paid" : "review";
	return current === "pending" ? event : current;
}
export function isLocalPaymentTest(url: string, nodeEnv: string | undefined) {
	return nodeEnv === "development" && ["localhost", "127.0.0.1", "[::1]"].includes(new URL(url).hostname);
}
export async function verifyPaymentSignature(raw: string, timestamp: string, signature: string, secret: string, now = Date.now()) {
	if (!/^\d{10}$/.test(timestamp) || Math.abs(now / 1000 - Number(timestamp)) > 300 || !/^[a-f0-9]{64}$/i.test(signature) || secret.length < 32) return false;
	const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
	return crypto.subtle.verify("HMAC", key, Uint8Array.from(signature.match(/../g)!, b => parseInt(b, 16)), new TextEncoder().encode(`${timestamp}.${raw}`));
}
export function parsePaymentEvent(value: unknown): PaymentEvent {
	const e = value as PaymentEvent;
	if (!e || !["paid", "failed", "cancelled"].includes(e.status) || !Number.isSafeInteger(e.amountMinor) || e.amountMinor <= 0 || !["IQD", "USD"].includes(e.currency)) throw new BookingError("invalid_event");
	for (const k of ["eventId", "bookingId", "sessionId", "transactionId"] as const) if (typeof e[k] !== "string" || !e[k] || e[k].length > 200) throw new BookingError("invalid_event");
	return e;
}
