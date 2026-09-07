export type GalleryLocale = "en" | "ar";

export const GALLERY_MAX_IMAGES = 600;

export type GalleryLocalizedText = {
	en: string;
	ar: string;
};

export type GalleryCategory = {
	id: number;
	slug: string;
	name: GalleryLocalizedText;
	description: GalleryLocalizedText;
	coverImageUrl: string;
	published: boolean;
	sortOrder: number;
	albumCount: number;
	createdAt: number;
	updatedAt: number;
};

export type GalleryCategoryInput = Omit<GalleryCategory, "id" | "albumCount" | "createdAt" | "updatedAt">;

export type GalleryImage = {
	id: number;
	albumId: number;
	imageUrl: string;
	contentHash: string;
	title: GalleryLocalizedText;
	description: GalleryLocalizedText;
	alt: GalleryLocalizedText;
	sortOrder: number;
	createdAt: number;
	updatedAt: number;
};

export type GalleryImageInput = Omit<GalleryImage, "id" | "albumId" | "createdAt" | "updatedAt"> & {
	id?: number;
};

export type GalleryAlbum = {
	id: number;
	categoryId: number;
	categorySlug: string;
	categoryName: GalleryLocalizedText;
	slug: string;
	title: GalleryLocalizedText;
	description: GalleryLocalizedText;
	coverImageUrl: string;
	eventDate: string;
	location: GalleryLocalizedText;
	published: boolean;
	featured: boolean;
	sortOrder: number;
	imageCount: number;
	images: GalleryImage[];
	createdAt: number;
	updatedAt: number;
};

export type GalleryAlbumInput = {
	categoryId: number;
	slug: string;
	title: GalleryLocalizedText;
	description: GalleryLocalizedText;
	coverImageUrl: string;
	eventDate: string;
	location: GalleryLocalizedText;
	published: boolean;
	featured: boolean;
	sortOrder: number;
	images: GalleryImageInput[];
};
