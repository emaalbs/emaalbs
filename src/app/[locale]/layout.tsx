import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isValidLocale, type Locale } from "@/i18n/config";
import { I18nProvider } from "@/i18n/provider";
import { HtmlAttrs } from "@/components/site/HtmlAttrs";

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale: localeParam } = await params;
	const locale = isValidLocale(localeParam) ? localeParam : "en";
	const isAr = locale === "ar";
	return {
		title: isAr
			? "إعمال  بيزنس سبيس — بناء الأعمال. توسيع النمو."
			: "EMAAL Business Space — Building Businesses. Scaling Growth.",
		description: isAr
			? "إعمال بيزنس سبيس هي منصة بناء الأعمال ومجموعة استثمارية تعمل عبر العراق والمنطقة."
			: "EMAAL Business Space is a business platform builder and investment-driven group operating across Iraq and the region.",
		alternates: {
			languages: {
				en: "/en",
				ar: "/ar",
			},
		},
	};
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale: localeParam } = await params;
	if (!isValidLocale(localeParam)) {
		notFound();
	}
	const locale = localeParam as Locale;

	return (
		<I18nProvider locale={locale}>
			<HtmlAttrs />
			{children}
		</I18nProvider>
	);
}
