export type LocalizedText = {
	en: string;
	ar: string;
};

export type HeroSlide = {
	id: number;
	overline: LocalizedText;
	titleLine1: LocalizedText;
	titleLine2: LocalizedText;
	description: LocalizedText;
	primaryCta: {
		label: LocalizedText;
		href: LocalizedText;
	};
	secondaryCta: {
		label: LocalizedText;
		href: LocalizedText;
	};
	imageUrl: string;
	imagePosition: string;
	sortOrder: number;
	published: boolean;
};

export type HeroSlideInput = Omit<HeroSlide, "id">;

export type HeroCarouselSettings = {
	autoplayDelayMs: number;
};
