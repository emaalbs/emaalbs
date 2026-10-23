export type ReceiptText = { en: string; ar: string };
export type BookingReceipt = {
	id: string; guest: string; title: ReceiptText; tier: ReceiptText;
	edition: { title: ReceiptText; date: ReceiptText; location: ReceiptText } | null;
	amountMinor: number; currency: string; paidAt: number; bookedAt: number;
	transaction: string; provider: string; preview: boolean; receiptToken: string;
};
