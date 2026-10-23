import { getEnv } from "@/lib/cloudflare";

// Operational pause for new checkouts/simulation only. Never blocks access to
// existing receipts, payment history or authenticated gateway reconciliation.
export async function paymentCheckoutsDisabled() {
	return (await getEnv() as { PAYMENT_CHECKOUTS_DISABLED?: string }).PAYMENT_CHECKOUTS_DISABLED === "true";
}
