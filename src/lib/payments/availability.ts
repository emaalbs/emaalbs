import { getEnv } from "@/lib/cloudflare";

// Operational pause for new checkouts/simulation only. Never blocks access to
// existing receipts, payment history or authenticated gateway reconciliation.
export async function paymentCheckoutsDisabled() {
	return (await getEnv() as { PAYMENT_CHECKOUTS_DISABLED?: string }).PAYMENT_CHECKOUTS_DISABLED === "true";
}

// Explicit local-only sandbox. Never permits contacting a real payment provider.
export async function localBookingSimulationEnabled() {
	return process.env.NODE_ENV === "development" && (await getEnv() as {LOCAL_BOOKING_SIMULATION?:string}).LOCAL_BOOKING_SIMULATION === "true";
}
