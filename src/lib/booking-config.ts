export type BookingConfig = {
	enabled: boolean;
	title: { en: string; ar: string };
	description: { en: string; ar: string };
	buttonLabel: { en: string; ar: string };
	terms: { en: string; ar: string };
	amountMinor: number;
	currency: "IQD" | "USD";
	capacity: number | null;
};

export function defaultBookingConfig(): BookingConfig {
	return { enabled: false, title: { en: "Reserve your place", ar: "احجز مقعدك" }, description: { en: "", ar: "" }, buttonLabel: { en: "Book your seat", ar: "احجز الآن" }, terms: { en: "", ar: "" }, amountMinor: 0, currency: "IQD", capacity: null };
}

export const currencyScale = (currency: string) => currency === "IQD" ? 1000 : 100;
export const formatBookingPrice = (amount: number, currency: string, locale = "en") =>
	new Intl.NumberFormat(locale === "ar" ? "ar-IQ" : "en-US", { style: "currency", currency, maximumFractionDigits: currency === "IQD" ? 3 : 2 }).format(amount / currencyScale(currency));

export class BookingError extends Error {
	constructor(public code: string, public status = 400) { super(code); }
}

export function validateBookingConfig(value: unknown): BookingConfig {
	if (!value || typeof value !== "object") throw new BookingError("invalid_configuration");
	const c = value as BookingConfig;
	if (typeof c.enabled !== "boolean" || !["IQD", "USD"].includes(c.currency) || !Number.isSafeInteger(c.amountMinor) || c.amountMinor < 0 || c.amountMinor > 1e12) throw new BookingError("invalid_price");
	if (c.capacity !== null && (!Number.isSafeInteger(c.capacity) || c.capacity < 1 || c.capacity > 1e6)) throw new BookingError("invalid_capacity");
	for (const field of ["title", "description", "buttonLabel", "terms"] as const) {
		for (const lang of ["en", "ar"] as const) {
			if (typeof c[field]?.[lang] !== "string" || c[field][lang].length > (field === "title" || field === "buttonLabel" ? 160 : 4000)) throw new BookingError("invalid_text");
			if (c.enabled && field !== "terms" && !c[field][lang].trim()) throw new BookingError("booking_text_required");
		}
	}
	if (c.enabled && c.amountMinor <= 0) throw new BookingError("price_required");
	return { enabled: c.enabled, title: c.title, description: c.description, buttonLabel: c.buttonLabel, terms: c.terms, amountMinor: c.amountMinor, currency: c.currency, capacity: c.capacity };
}
