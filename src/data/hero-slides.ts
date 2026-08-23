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
	imageUrl: string;
	imagePosition: string;
	sortOrder: number;
	published: boolean;
};

export type HeroSlideInput = Omit<HeroSlide, "id">;
