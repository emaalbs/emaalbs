import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isValidLocale, type Locale } from "@/i18n/config";
import { I18nProvider } from "@/i18n/provider";
import { HtmlAttrs } from "@/components/site/HtmlAttrs";
import { getBaseUrl, siteConfig } from "@/lib/seo/site-config";

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
	const base = getBaseUrl();
	return {
		metadataBase: new URL(base),
		title: isAr
			? `${siteConfig.name.ar} — ${siteConfig.tagline.ar}`
			: `${siteConfig.name.en} — ${siteConfig.tagline.en}`,
		description: siteConfig.description[locale as "en" | "ar"],
		alternates: {
			canonical: `${base}/${locale}`,
			languages: {
				en: `${base}/en`,
				ar: `${base}/ar`,
			},
		},
		openGraph: {
			type: "website",
			locale: isAr ? "ar_AR" : "en_US",
			siteName: siteConfig.name[locale as "en" | "ar"],
			images: [{ url: `${base}/opengraph-image`, width: 1200, height: 630 }],
		},
		twitter: {
			card: "summary_large_image",
			images: [`${base}/opengraph-image`],
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
