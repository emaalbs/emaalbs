// Types for IBS overview + per-edition pages.
// Designed to map 1:1 to future D1 tables; swap the mock layer in `index.ts`
// for D1 queries without touching components.

export type Localized = { en: string; ar: string };

export type EditionStatus = "past" | "upcoming" | "live";

export type Stat = {
	value: string; // keep as string so "800" / "75" / "6" work
	label: Localized;
};

export type Speaker = {
	id: string;
	name: Localized;
	title: Localized; // role / position
	org?: Localized;
	photo?: string; // R2 path later
};

export type SponsorTier =
	| "strategic"
	| "platinum"
	| "gold"
	| "silver"
	| "supporting";

export type Sponsor = {
	id: string;
	name: string;
	tier: SponsorTier;
	logo?: string; // /logos/... or R2 url
	href?: string;
};

export type SectorShare = {
	sector: Localized;
	percent: number; // 0-100
};

export type Theme = {
	title: Localized;
	description: Localized;
};

export type Initiative = {
	title: Localized;
	description: Localized;
	highlight?: Localized; // e.g. "100 companies registered in a single day"
	partners?: string[];
};

export type GalleryItem = {
	id: string;
	src: string;
	alt: Localized;
	width?: number;
	height?: number;
};

export type IbsEdition = {
	slug: string; // "2025", "ports-2025", "2026"
	year: number;
	editionLabel: Localized; // "1st Edition", "Ports Summit", etc.
	title: Localized;
	tagline: Localized;
	summary: Localized; // 1-2 paragraphs for hero
	status: EditionStatus;
	dates: Localized; // "April 2025"
	location: Localized; // "Baghdad, Iraq"
	heroImage: string;
	recapVideo?: string;
	stats: Stat[];
	themes: Theme[];
	keynoteSpeakers: Speaker[];
	sectorShares: SectorShare[];
	initiatives: Initiative[];
	sponsors: Sponsor[];
	gallery: GalleryItem[];
	registrationUrl?: string;
	nextEditionSlug?: string;
};
