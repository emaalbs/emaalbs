export const siteConfig = {
	name: {
		en: "EMAAL Business Space",
		ar: "إعمال بيزنس سبيس",
	},
	tagline: {
		en: "Building Businesses. Scaling Growth.",
		ar: "بناء الأعمال. توسيع النمو.",
	},
	description: {
		en:
			"EMAAL Business Space is a business platform builder and investment-driven group operating across Iraq and the region. Home of the Iraq Business Summit (IBS).",
		ar:
			"إعمال بيزنس سبيس هي منصة بناء الأعمال ومجموعة استثمارية تعمل عبر العراق والمنطقة. مقر قمة الأعمال العراقية (IBS).",
	},
	url: process.env.NEXT_PUBLIC_SITE_URL || "https://emaalbs.com",
	logo: "/Logo.png",
	favicon: "/favicon.svg",
	social: {
		youtube: "https://www.youtube.com/@IraqBusinessSummit",
		x: "http://x.com/IB_Summit",
		linkedin: "https://www.linkedin.com/company/iraq-business-summit/",
		instagram: "https://www.instagram.com/iraq_business_summit/",
		facebook:
			"https://www.facebook.com/profile.php?id=61573903317269",
	},
} as const;

export function getBaseUrl(): string {
	return siteConfig.url.replace(/\/$/, "");
}
