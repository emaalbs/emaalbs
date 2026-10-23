import { getEnv } from "@/lib/cloudflare";
import { BookingError } from "@/lib/booking-config";
import { isLocalPaymentTest } from "./core";
import { paymentCheckoutsDisabled } from "./availability";

// A provider-specific adapter (or server-side bridge) implements this contract.
export type CheckoutInput = { bookingId: string; amountMinor: number; currency: string; title: string; expiresAt: number; returnUrl: string; webhookUrl: string };
export interface PaymentProvider {
	name: "mock" | "bridge" | "tabadul" | "tabadul-preview";
	returnOrigin?: string;
	validateOffer?(input: { slug: string; amountMinor: number; currency: string; realPaymentConsent: boolean }): void;
	createCheckout(input: CheckoutInput): Promise<{ sessionId: string; checkoutUrl: string }>;
}
type PaymentEnv = { PAYMENT_PROVIDER?: string; PAYMENT_BRIDGE_URL?: string; PAYMENT_BRIDGE_TOKEN?: string; PAYMENT_CHECKOUT_HOSTS?: string; PAYMENT_WEBHOOK_SECRET?: string; PAYMENT_PUBLIC_ORIGIN?: string };
export async function paymentEnv(): Promise<PaymentEnv> { return await getEnv() as PaymentEnv; }

export async function getPaymentProvider(request: Request): Promise<PaymentProvider> {
	if (await paymentCheckoutsDisabled()) throw new BookingError("booking_closed", 409);
	const preview = request.headers.get("X-IBS-Payment-Preview");
	if (preview === "tabadul" || preview === "tabadul-real") {
		const { tabadulProvider } = await import("./tabadul");
		return tabadulProvider(request, preview === "tabadul-real");
	}
	if (isLocalPaymentTest(request.url, process.env.NODE_ENV)) return {
		name: "mock",
		async createCheckout(input) { return { sessionId: `mock-${input.bookingId}`, checkoutUrl: input.returnUrl }; },
	};
	const env = await paymentEnv();
	if (env.PAYMENT_PROVIDER === "tabadul") {
		const { tabadulProvider } = await import("./tabadul");
		return tabadulProvider(request, true, true);
	}
	if (env.PAYMENT_PROVIDER !== "bridge" || !env.PAYMENT_BRIDGE_URL || !env.PAYMENT_BRIDGE_TOKEN || !env.PAYMENT_CHECKOUT_HOSTS || !env.PAYMENT_PUBLIC_ORIGIN || (env.PAYMENT_WEBHOOK_SECRET?.length ?? 0) < 32) throw new BookingError("payments_unavailable", 503);
	const endpoint = new URL(env.PAYMENT_BRIDGE_URL);
	if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password) throw new BookingError("payments_unavailable", 503);
	return {
		name: "bridge",
		async createCheckout(input) {
			const response = await fetch(endpoint, { method: "POST", redirect: "error", signal: AbortSignal.timeout(12000), headers: { Authorization: `Bearer ${env.PAYMENT_BRIDGE_TOKEN}`, "Content-Type": "application/json", "Idempotency-Key": input.bookingId }, body: JSON.stringify(input) });
			if (!response.ok) throw new BookingError("gateway_unavailable", 502);
			const data = await response.json() as { sessionId: string; checkoutUrl: string };
			if (typeof data.sessionId !== "string" || !data.sessionId || data.sessionId.length > 200 || typeof data.checkoutUrl !== "string" || data.checkoutUrl.length > 4096) throw new BookingError("gateway_unavailable", 502);
			const url = new URL(data.checkoutUrl);
			if (url.protocol !== "https:" || url.username || url.password || !env.PAYMENT_CHECKOUT_HOSTS!.split(",").map(h => h.trim()).includes(url.hostname)) throw new BookingError("gateway_unavailable", 502);
			return data;
		},
	};
}
