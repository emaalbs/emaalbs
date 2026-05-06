export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isValidLocale(l: string): l is Locale {
	return locales.includes(l as Locale);
}
