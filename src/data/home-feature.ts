import type { LocalizedText } from "@/data/hero-slides";

export type HomeFeature = {
	id: 1;
	enabled: boolean;
	kicker: LocalizedText;
	title: LocalizedText;
	description: LocalizedText;
	buttonLabel: LocalizedText;
	buttonHref: LocalizedText;
	imageUrl: string;
	imagePosition: string;
};

export type HomeFeatureInput = Omit<HomeFeature, "id">;

export const EMPTY_HOME_FEATURE: HomeFeature = {
	id: 1,
	enabled: false,
	kicker: { en: "", ar: "" },
	title: { en: "", ar: "" },
	description: { en: "", ar: "" },
	buttonLabel: { en: "", ar: "" },
	buttonHref: { en: "", ar: "" },
	imageUrl: "",
	imagePosition: "center",
};
