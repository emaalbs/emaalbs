import type { SocialPlatform } from "@/data/social-posts";

export type SocialEmbedDescriptor = {
	platform: SocialPlatform;
	embedUrl?: string;
	contentId?: string;
	supported: boolean;
	reason?: string;
};

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
	linkedin: "LinkedIn",
	x: "X",
	instagram: "Instagram",
	youtube: "YouTube",
	facebook: "Facebook",
};

export function getSocialPlatformLabel(platform: SocialPlatform): string {
	return PLATFORM_LABELS[platform];
}

function normalizedHost(url: URL): string {
	return url.hostname.toLowerCase().replace(/^www\./, "");
}

function hostMatches(host: string, domain: string): boolean {
	return host === domain || host.endsWith(`.${domain}`);
}

export function detectSocialPlatform(value: string): SocialPlatform | null {
	try {
		const url = new URL(value.trim());
		if (url.protocol !== "https:" && url.protocol !== "http:") return null;
		const host = normalizedHost(url);
		if (hostMatches(host, "linkedin.com")) return "linkedin";
		if (hostMatches(host, "x.com") || hostMatches(host, "twitter.com")) return "x";
		if (hostMatches(host, "instagram.com")) return "instagram";
		if (hostMatches(host, "youtube.com") || host === "youtu.be") return "youtube";
		if (hostMatches(host, "facebook.com") || host === "fb.watch") return "facebook";
		return null;
	} catch {
		return null;
	}
}

export function isSafeSocialPostUrl(value: string): boolean {
	return value.length <= 2048 && detectSocialPlatform(value) !== null;
}

export function isSafeSocialImageUrl(value: string): boolean {
	if (!value) return true;
	if (value.startsWith("/api/media/") || value.startsWith("/images/") || value.startsWith("/logos/")) return true;
	try {
		const url = new URL(value);
		return url.protocol === "https:";
	} catch {
		return false;
	}
}

export function getYouTubeVideoId(value: string): string | null {
	try {
		const url = new URL(value);
		const host = normalizedHost(url);
		if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || null;
		if (!hostMatches(host, "youtube.com")) return null;
		if (url.pathname === "/watch") return url.searchParams.get("v");
		const match = url.pathname.match(/^\/(?:shorts|embed|live)\/([A-Za-z0-9_-]{6,})/);
		return match?.[1] || null;
	} catch {
		return null;
	}
}

export function getLinkedInActivityId(value: string): string | null {
	const decoded = decodeURIComponent(value);
	return decoded.match(/activity[-:](\d{8,})/i)?.[1] || null;
}

export function getXStatusId(value: string): string | null {
	try {
		const url = new URL(value);
		return url.pathname.match(/\/status\/(\d+)/)?.[1] || null;
	} catch {
		return null;
	}
}

export function getSocialEmbedDescriptor(value: string): SocialEmbedDescriptor | null {
	const platform = detectSocialPlatform(value);
	if (!platform) return null;

	if (platform === "youtube") {
		const contentId = getYouTubeVideoId(value);
		return contentId
			? { platform, contentId, embedUrl: `https://www.youtube-nocookie.com/embed/${contentId}`, supported: true }
			: { platform, supported: false, reason: "This YouTube link does not contain a supported video ID." };
	}

	if (platform === "linkedin") {
		const contentId = getLinkedInActivityId(value);
		return contentId
			? { platform, contentId, embedUrl: `https://www.linkedin.com/embed/feed/update/urn:li:activity:${contentId}`, supported: true }
			: { platform, supported: false, reason: "LinkedIn embed requires a public post link containing its activity ID." };
	}

	if (platform === "x") {
		const contentId = getXStatusId(value);
		return contentId
			? { platform, contentId, supported: true }
			: { platform, supported: false, reason: "X embed requires a public status link." };
	}

	if (platform === "instagram") {
		try {
			const url = new URL(value);
			const supported = /^\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\/?/.test(url.pathname);
			return supported
				? { platform, supported: true }
				: { platform, supported: false, reason: "Instagram embeds support public posts and Reels, but not Stories." };
		} catch {
			return { platform, supported: false };
		}
	}

	return {
		platform,
		supported: true,
		embedUrl: `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(value)}&show_text=true&width=500`,
	};
}
