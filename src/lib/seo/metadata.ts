import type { Metadata } from "next";
import { getBaseUrl, siteConfig } from "./site-config";

export type SeoPage =
	| { type: "home"; locale: "en" | "ar" }
	| { type: "about"; locale: "en" | "ar" }
	| { type: "contact"; locale: "en" | "ar" }
	| { type: "whatWeDo"; locale: "en" | "ar" }
	| { type: "blog"; locale: "en" | "ar" }
	| { type: "blogDetail"; locale: "en" | "ar"; slug: string; title: string; description: string; image?: string; date?: string }
	| { type: "ibs"; locale: "en" | "ar" }
	| { type: "ibsEdition"; locale: "en" | "ar"; slug: string; title: string; description: string; image?: string }
	| { type: "privacy"; locale: "en" | "ar" };

const pageTitles: Record<string, Record<"en" | "ar", string>> = {
	home: {
		en: `${siteConfig.name.en} — ${siteConfig.tagline.en}`,
		ar: `${siteConfig.name.ar} — ${siteConfig.tagline.ar}`,
	},
	about: {
		en: `About — ${siteConfig.name.en}`,
		ar: `من نحن — ${siteConfig.name.ar}`,
	},
	contact: {
		en: `Contact — ${siteConfig.name.en}`,
		ar: `تواصل معنا — ${siteConfig.name.ar}`,
	},
	whatWeDo: {
		en: `What We Do — ${siteConfig.name.en}`,
		ar: `ماذا نفعل — ${siteConfig.name.ar}`,
	},
	blog: {
		en: `Insights & Blog — ${siteConfig.name.en}`,
		ar: `المدونة والرؤى — ${siteConfig.name.ar}`,
	},
	ibs: {
		en: `Iraq Business Summit (IBS) — ${siteConfig.name.en}`,
		ar: `قمة الأعمال العراقية (IBS) — ${siteConfig.name.ar}`,
	},
	privacy: {
		en: `Privacy Policy — ${siteConfig.name.en}`,
		ar: `سياسة الخصوصية — ${siteConfig.name.ar}`,
	},
};

const pageDescriptions: Record<string, Record<"en" | "ar", string>> = {
	home: siteConfig.description,
	about: {
		en: "Learn about EMAAL Business Space — our vision, mission, and integrated approach to building business platforms across Iraq and the region.",
		ar: "تعرّف على إعمال بيزنس سبيس — رؤيتنا، مهمتنا، ونهجنا المتكامل في بناء منصات الأعمال عبر العراق والمنطقة.",
	},
	contact: {
		en: "Get in touch with EMAAL Business Space. Let us discuss partnerships, investments, and strategic opportunities across Iraq.",
		ar: "تواصل مع إعمال بيزنس سبيس. لنناقش الشراكات والاستثمارات والفرص الاستراتيجية في العراق.",
	},
	whatWeDo: {
		en: "Explore EMAAL's capabilities: venture building, investment acceleration, government access, international engagement, and strategic business services.",
		ar: "استكشف قدرات أعمال: بناء المشاريع، تسريع الاستثمار، الوصول الحكومي، المشاركة الدولية، والخدمات الاستراتيجية.",
	},
	blog: {
		en: "Deep insights and analysis from EMAAL Business Space — stories, market intelligence, and updates from Iraq's business ecosystem.",
		ar: "رؤى وتحليلات متعمقة من إعمال بيزنس سبيس — قصص، ذكاء السوق، وتحديثات من النظام الاقتصادي العراقي.",
	},
	ibs: {
		en: "A high-level platform bringing together government decision-makers, investors, and private sector leaders to enable partnerships, investment, and real business outcomes in Iraq.",
		ar: "منصة رفيعة المستوى تجمع صناع القرار الحكومي والمستثمرين وقادة القطاع الخاص لتمكين الشراكات والاستثمار وتحقيق نتائج أعمال حقيقية في العراق.",
	},
	privacy: {
		en: "EMAAL Business Space Privacy Policy — how we collect, use, store, and protect your personal information.",
		ar: "سياسة الخصوصية لأعمال بيزنس سبيس — كيف نجمع ونستخدم ونخزن ونحمي معلوماتك الشخصية.",
	},
};

function getCanonicalPath(page: SeoPage): string {
	switch (page.type) {
		case "home":
			return `/${page.locale}`;
		case "blogDetail":
			return `/${page.locale}/news/${page.slug}`;
		case "ibsEdition":
			return `/${page.locale}/ibs/${page.slug}`;
		default:
			return `/${page.locale}/${page.type}`;
	}
}

export function buildMetadata(page: SeoPage): Metadata {
	const locale = page.locale;
	const isAr = locale === "ar";
	const base = getBaseUrl();

	let title: string;
	let description: string;
	let path: string;
	let ogImage: string;

	switch (page.type) {
		case "blogDetail":
			title = `${page.title} — ${siteConfig.name[locale]}`;
			description = page.description;
			path = getCanonicalPath(page);
			ogImage = page.image || `${base}/opengraph-image`;
			break;
		case "ibsEdition":
			title = `${page.title} — IBS by ${siteConfig.name[locale]}`;
			description = page.description;
			path = getCanonicalPath(page);
			ogImage = page.image || `${base}/opengraph-image`;
			break;
		default:
			title = pageTitles[page.type][locale];
			description = pageDescriptions[page.type][locale];
			path = getCanonicalPath(page);
			ogImage = `${base}/opengraph-image`;
	}

	const canonical = `${base}${path}`;
	const alternates: Metadata["alternates"] = {
		canonical,
		languages: {
			en: `${base}${path.replace(`/${locale}`, "/en")}`,
			ar: `${base}${path.replace(`/${locale}`, "/ar")}`,
		},
	};

	return {
		metadataBase: new URL(base),
		title,
		description,
		alternates,
		openGraph: {
			title,
			description,
			url: canonical,
			siteName: siteConfig.name[locale],
			locale: isAr ? "ar_AR" : "en_US",
			type: page.type === "blogDetail" || page.type === "ibsEdition" ? "article" : "website",
			images: ogImage.startsWith("http")
				? [{ url: ogImage, width: 1200, height: 630, alt: title }]
				: [{ url: ogImage, width: 1200, height: 630, alt: title }],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: ogImage.startsWith("http")
				? [ogImage]
				: [ogImage],
		},
		robots: {
			index: true,
			follow: true,
		},
	};
}
