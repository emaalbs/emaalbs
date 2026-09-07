import { GALLERY_MAX_IMAGES, type GalleryAlbumInput, type GalleryCategoryInput, type GalleryLocalizedText } from "@/data/gallery";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function hasLocalizedText(value: GalleryLocalizedText | undefined): boolean {
	return Boolean(value && (value.en.trim() || value.ar.trim()));
}

export function isSafeGalleryImageUrl(value: string): boolean {
	if (!value) return true;
	if (value.startsWith("/api/media/") || value.startsWith("/images/")) return true;
	try {
		return new URL(value).protocol === "https:";
	} catch {
		return false;
	}
}

export function normalizeGallerySlug(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 120);
}

export function validateGalleryCategoryInput(data: GalleryCategoryInput): string | null {
	if (!data || !SLUG_PATTERN.test(data.slug || "")) return "Use a lowercase English slug, for example: health-insurance-summit";
	if (!hasLocalizedText(data.name)) return "Enter the category name in at least one language";
	if (data.name.en.length > 120 || data.name.ar.length > 120) return "Category names must be 120 characters or fewer";
	if (data.description.en.length > 1200 || data.description.ar.length > 1200) return "Category descriptions must be 1,200 characters or fewer";
	if (!isSafeGalleryImageUrl(data.coverImageUrl)) return "Category cover image URL is invalid";
	if (!Number.isInteger(data.sortOrder) || Math.abs(data.sortOrder) > 9999) return "Category sort order is invalid";
	return null;
}

export function validateGalleryAlbumInput(data: GalleryAlbumInput): string | null {
	if (!data || !Number.isInteger(data.categoryId) || data.categoryId < 1) return "Choose a gallery category";
	if (!SLUG_PATTERN.test(data.slug || "")) return "Use a lowercase English slug, for example: insurance-summit-2026";
	if (!hasLocalizedText(data.title)) return "Enter the album title in at least one language";
	if (data.title.en.length > 180 || data.title.ar.length > 180) return "Album titles must be 180 characters or fewer";
	if (data.description.en.length > 4000 || data.description.ar.length > 4000) return "Album descriptions must be 4,000 characters or fewer";
	if (data.location.en.length > 180 || data.location.ar.length > 180) return "Locations must be 180 characters or fewer";
	if (data.eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.eventDate)) return "Event date is invalid";
	if (!Number.isInteger(data.sortOrder) || Math.abs(data.sortOrder) > 9999) return "Album sort order is invalid";
	if (!Array.isArray(data.images) || data.images.length < 1) return "Add at least one image to the album";
	if (!isSafeGalleryImageUrl(data.coverImageUrl)) return "Album cover image URL is invalid";
	if (data.images.length > GALLERY_MAX_IMAGES) return `An album can contain up to ${GALLERY_MAX_IMAGES} images`;
	for (const image of data.images) {
		if (!image.imageUrl || !isSafeGalleryImageUrl(image.imageUrl)) return "Every gallery item needs a valid image";
		if (image.contentHash && !/^[a-f0-9]{64}$/.test(image.contentHash)) return "Gallery image fingerprint is invalid";
		if (image.title.en.length > 180 || image.title.ar.length > 180) return "Image titles must be 180 characters or fewer";
		if (image.description.en.length > 2000 || image.description.ar.length > 2000) return "Image descriptions must be 2,000 characters or fewer";
		if (image.alt.en.length > 240 || image.alt.ar.length > 240) return "Alternative text must be 240 characters or fewer";
		if (!Number.isInteger(image.sortOrder) || Math.abs(image.sortOrder) > 9999) return "Image sort order is invalid";
	}
	return null;
}
