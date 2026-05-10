"use client";

import {
	createContext,
	useContext,
	ReactNode,
	useEffect,
	useState,
} from "react";

import { Locale, defaultLocale } from "./config";

import { en } from "./dictionaries/en";
import { ar } from "./dictionaries/ar";

import type { Dictionary } from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = {
	en,
	ar,
};

type I18nContextType = {
	locale: Locale;

	dir: "ltr" | "rtl";

	t: Dictionary;

	toggleLanguage: () => void;
};

const I18nContext =
	createContext<I18nContextType>({
		locale: defaultLocale,

		dir: "ltr",

		t: en,

		toggleLanguage: () => {},
	});

export function I18nProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [mounted, setMounted] =
		useState(false);

	const [locale, setLocale] =
		useState<Locale>(() => {
			if (
				typeof window !== "undefined"
			) {
				return (
					(localStorage.getItem(
						"locale",
					) as Locale) ||
					defaultLocale
				);
			}

			return defaultLocale;
		});

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleLanguage = () => {
		const newLocale =
			locale === "en" ? "ar" : "en";

		setLocale(newLocale);

		localStorage.setItem(
			"locale",
			newLocale,
		);
	};

	const dir: "ltr" | "rtl" =
		locale === "ar" ? "rtl" : "ltr";

	useEffect(() => {
		document.documentElement.lang =
			locale;

		document.documentElement.dir =
			dir;
	}, [locale, dir]);

	const t = dictionaries[locale];

	if (!mounted) return null;

	return (
		<I18nContext.Provider
			value={{
				locale,
				dir,
				t,
				toggleLanguage,
			}}
		>
			{children}
		</I18nContext.Provider>
	);
}

export function useI18n() {
	return useContext(I18nContext);
}