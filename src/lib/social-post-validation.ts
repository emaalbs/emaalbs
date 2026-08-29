import type { SocialPostInput } from "@/data/social-posts";
import {
	getSocialEmbedDescriptor,
	isSafeSocialImageUrl,
	isSafeSocialPostUrl,
} from "@/lib/social-platforms";

function textLength(value: unknown): number {
	return typeof value === "string" ? value.trim().length : -1;
}

export function validateSocialPostInput(data: SocialPostInput): string | null {
	if (!data || !isSafeSocialPostUrl(data.postUrl || "")) {
		return "Enter a valid public LinkedIn, X, Instagram, YouTube, or Facebook post URL";
	}
	if (data.displayMode !== "embed" && data.displayMode !== "custom") {
		return "Choose a valid display mode";
	}
	if (!data.title || !data.caption) return "Post text fields are missing";

	const titleEn = textLength(data.title.en);
	const titleAr = textLength(data.title.ar);
	const captionEn = textLength(data.caption.en);
	const captionAr = textLength(data.caption.ar);
	if ([titleEn, titleAr].some((length) => length < 0 || length > 180)) return "Post titles must be 180 characters or fewer";
	if ([captionEn, captionAr].some((length) => length < 0 || length > 4000)) return "Post captions must be 4,000 characters or fewer";
	if (!isSafeSocialImageUrl(data.imageUrl || "")) return "Post image URL is invalid";
	if (data.postDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.postDate)) return "Post date is invalid";
	if (!Number.isInteger(data.sortOrder) || data.sortOrder < -9999 || data.sortOrder > 9999) return "Sort order is invalid";

	if (data.displayMode === "embed") {
		const descriptor = getSocialEmbedDescriptor(data.postUrl);
		if (!descriptor?.supported) return descriptor?.reason || "This post link cannot be embedded";
	}

	if (
		data.displayMode === "custom" &&
		!data.imageUrl.trim() &&
		titleEn === 0 && titleAr === 0 &&
		captionEn === 0 && captionAr === 0
	) {
		return "A custom card needs an image, title, or caption";
	}

	return null;
}
