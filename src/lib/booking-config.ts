export type BookingTier = { id: string; name: { en: string; ar: string }; amountMinor: number; capacity: number | null; enabled: boolean };
export type BookingConfig = {
	tiers?: BookingTier[];
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
// Keep old offers readable without rewriting their stored configuration.
export function bookingTiers(config: BookingConfig): BookingTier[] {
	return config.tiers ?? [{ id: "standard", name: { en: "General admission", ar: "دخول عام" }, amountMinor: config.amountMinor, capacity: config.capacity, enabled: true }];
}
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
	let tiers: BookingTier[] | undefined;
	if (c.tiers !== undefined) {
		if (!Array.isArray(c.tiers) || c.tiers.length > 30 || c.tiers.length < 1) throw new BookingError("invalid_tiers");
		const ids = new Set<string>();
		tiers = c.tiers.map(t => {
			if (!t || typeof t.id !== "string" || !/^[a-z0-9-]{1,64}$/.test(t.id) || ids.has(t.id) || typeof t.enabled !== "boolean") throw new BookingError("invalid_tiers");
			ids.add(t.id);
			if (!Number.isSafeInteger(t.amountMinor) || t.amountMinor < 0 || t.amountMinor > 1e12 || (t.enabled && t.amountMinor <= 0)) throw new BookingError("price_required");
			if (t.capacity !== null && (!Number.isSafeInteger(t.capacity) || t.capacity < 1 || t.capacity > 1e6)) throw new BookingError("invalid_capacity");
			if (["en", "ar"].some(lang => typeof t.name?.[lang as "en" | "ar"] !== "string" || !t.name[lang as "en" | "ar"].trim() || t.name[lang as "en" | "ar"].length > 120)) throw new BookingError("tier_name_required");
			return { id: t.id, name: {en:t.name.en.trim(),ar:t.name.ar.trim()}, amountMinor: t.amountMinor, capacity: t.capacity, enabled: t.enabled };
		});
		if (c.enabled && !tiers.some(t => t.enabled)) throw new BookingError("active_tier_required");
	} else if (c.enabled && c.amountMinor <= 0) throw new BookingError("price_required");
	return { enabled: c.enabled, title: c.title, description: c.description, buttonLabel: c.buttonLabel, terms: c.terms, amountMinor: c.amountMinor, currency: c.currency, capacity: c.capacity, ...(tiers ? {tiers} : {}) };
}
