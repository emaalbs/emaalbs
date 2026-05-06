"use client";

import { createContext, useContext, ReactNode } from "react";
import { Locale, defaultLocale } from "./config";
import { en } from "./dictionaries/en";
import { ar } from "./dictionaries/ar";
import type { Dictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { en, ar };

const I18nContext = createContext<{
	locale: Locale;
	dir: "ltr" | "rtl";
	t: Dictionary;
}>({
	locale: defaultLocale,
	dir: "ltr",
	t: en,
});

export function I18nProvider({
	locale,
	children,
}: {
	locale: Locale;
	children: ReactNode;
}) {
	const dir: "ltr" | "rtl" = locale === "ar" ? "rtl" : "ltr";
	const t = dictionaries[locale];
	return (
		<I18nContext.Provider value={{ locale, dir, t }}>
			{children}
		</I18nContext.Provider>
	);
}

export function useI18n() {
	return useContext(I18nContext);
}
