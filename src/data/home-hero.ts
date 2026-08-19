import { en } from "@/i18n/dictionaries/en";
import { ar } from "@/i18n/dictionaries/ar";

export interface LocalizedText {
	en: string;
	ar: string;
}

export interface HomeHeroSlide {
	id: string;
	imageUrl: string;
	alt: LocalizedText;
	overline: LocalizedText;
	titleLine1: LocalizedText;
	titleLine2: LocalizedText;
	description: LocalizedText;
	primaryCtaLabel: LocalizedText;
	primaryCtaHref: string;
	secondaryCtaLabel: LocalizedText;
	secondaryCtaHref: string;
}

export interface HomeHeroSettings {
	slideIntervalMs: number;
	slides: HomeHeroSlide[];
}

const defaultContent = {
	overline: { en: en.hero.overline, ar: ar.hero.overline },
	titleLine1: { en: en.hero.title[0], ar: ar.hero.title[0] },
	titleLine2: { en: en.hero.title[1], ar: ar.hero.title[1] },
	description: { en: en.hero.description, ar: ar.hero.description },
	primaryCtaLabel: { en: en.hero.ctaPrimary, ar: ar.hero.ctaPrimary },
	primaryCtaHref: "/ibs",
	secondaryCtaLabel: { en: en.hero.ctaSecondary, ar: ar.hero.ctaSecondary },
	secondaryCtaHref: "/contact",
};

function defaultSlide(id: string, imageUrl: string, alt: LocalizedText): HomeHeroSlide {
	return { id, imageUrl, alt, ...structuredClone(defaultContent) };
}

export const DEFAULT_HOME_HERO: HomeHeroSettings = {
	slideIntervalMs: 5000,
	slides: [
		defaultSlide("default-about-team", "/images/hero/about-team.webp", { en: "EMAAL team", ar: "فريق أعمال" }),
		defaultSlide("default-ibs-summit", "/images/hero/hero-summit.webp", { en: "Iraq Business Summit", ar: "قمة العراق للأعمال" }),
		defaultSlide("default-iraq-24", "/images/hero/venture-iraq24.webp", { en: "EMAAL business platform", ar: "منصة أعمال للأعمال" }),
	],
};
