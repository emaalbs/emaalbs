import type { SocialPlatform } from "@/data/social-posts";
import {
	detectSocialPlatform,
	getLinkedInActivityId,
	getSocialEmbedDescriptor,
	getXStatusId,
	getYouTubeVideoId,
} from "@/lib/social-platforms";

const RESOLVER_HOSTS = [
	"facebook.com",
	"fb.watch",
	"instagram.com",
	"x.com",
	"twitter.com",
	"t.co",
	"linkedin.com",
	"lnkd.in",
	"youtube.com",
	"youtu.be",
] as const;

export class SocialUrlResolutionError extends Error {}

function normalizedHost(url: URL): string {
	return url.hostname.toLowerCase().replace(/^(?:www\.|m\.|web\.)/, "");
}

function hostMatches(host: string, domain: string): boolean {
	return host === domain || host.endsWith(`.${domain}`);
}

function isResolverHost(url: URL): boolean {
	const host = normalizedHost(url);
	return RESOLVER_HOSTS.some((domain) => hostMatches(host, domain));
}

function parseSafeSocialUrl(value: string): URL {
	let url: URL;
	try {
		url = new URL(value.trim());
	} catch {
		throw new SocialUrlResolutionError("Enter a valid social media post URL");
	}
	if (!['http:', 'https:'].includes(url.protocol) || !isResolverHost(url)) {
		throw new SocialUrlResolutionError("This social media link is not supported");
	}
	return url;
}

function resolverPlatform(url: URL): SocialPlatform | null {
	const detected = detectSocialPlatform(url.toString());
	if (detected) return detected;
	const host = normalizedHost(url);
	if (hostMatches(host, "t.co")) return "x";
	if (hostMatches(host, "lnkd.in")) return "linkedin";
	return null;
}

function canonicalFacebookUrl(url: URL): string | null {
	const path = decodeURIComponent(url.pathname).replace(/\/+/g, "/");
	if (/^\/(?:share|sharer|dialog)\//i.test(path) || normalizedHost(url) === "fb.watch") return null;

	const post = path.match(/^\/([^/]+)\/(posts|videos)\/(pfbid[A-Za-z0-9]+|\d+)/i);
	if (post) return `https://www.facebook.com/${post[1]}/${post[2].toLowerCase()}/${post[3]}`;
	const reel = path.match(/^\/(?:reel|watch)\/(\d+)/i);
	if (reel) return `https://www.facebook.com/reel/${reel[1]}`;
	const photoId = url.searchParams.get("fbid");
	if (path === "/photo" && photoId && /^\d+$/.test(photoId)) return `https://www.facebook.com/photo/?fbid=${photoId}`;
	return null;
}

export function canonicalizeSocialPostUrl(value: string): string | null {
	const url = parseSafeSocialUrl(value);
	const platform = resolverPlatform(url);
	if (!platform) return null;

	if (platform === "youtube") {
		const id = getYouTubeVideoId(url.toString());
		return id ? `https://www.youtube.com/watch?v=${id}` : null;
	}
	if (platform === "linkedin") {
		const id = getLinkedInActivityId(url.toString());
		return id ? `https://www.linkedin.com/feed/update/urn:li:activity:${id}` : null;
	}
	if (platform === "x") {
		const id = getXStatusId(url.toString());
		return id ? `https://x.com/i/status/${id}` : null;
	}
	if (platform === "instagram") {
		const match = url.pathname.match(/^\/(?:[^/]+\/)?(p|reel|tv)\/([A-Za-z0-9_-]+)/i);
		return match ? `https://www.instagram.com/${match[1].toLowerCase()}/${match[2]}/` : null;
	}
	return canonicalFacebookUrl(url);
}

function extractHtmlCandidate(html: string): string[] {
	const candidates: string[] = [];
	for (const pattern of [
		/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i,
		/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:url["']/i,
		/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
	]) {
		const match = html.match(pattern);
		if (match?.[1]) candidates.push(match[1].replace(/&amp;/g, "&"));
	}
	return candidates;
}

export async function resolveSocialPostUrl(value: string): Promise<string> {
	const input = value.trim();
	const inputUrl = parseSafeSocialUrl(input);
	const direct = canonicalizeSocialPostUrl(input);
	if (direct && getSocialEmbedDescriptor(direct)?.supported) return direct;

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10_000);
	try {
		const response = await fetch(inputUrl.toString(), {
			method: "GET",
			redirect: "follow",
			signal: controller.signal,
			headers: {
				Accept: "text/html,application/xhtml+xml",
				"Accept-Language": "en-US,en;q=0.8",
				"User-Agent": "Mozilla/5.0 (compatible; EMAALSocialLinkResolver/1.0)",
			},
		});

		const candidates = [response.url];
		const contentType = response.headers.get("content-type") || "";
		if (contentType.includes("text/html")) {
			const html = (await response.text()).slice(0, 600_000);
			candidates.unshift(...extractHtmlCandidate(html));
		}

		for (const candidate of candidates) {
			try {
				const candidateUrl = parseSafeSocialUrl(candidate);
				if (resolverPlatform(candidateUrl) !== resolverPlatform(inputUrl)) continue;
				const canonical = canonicalizeSocialPostUrl(candidateUrl.toString());
				if (canonical && getSocialEmbedDescriptor(canonical)?.supported) return canonical;
			} catch {
				// Ignore unrelated redirects and keep checking trusted candidates.
			}
		}
	} catch (error) {
		if (error instanceof SocialUrlResolutionError) throw error;
	} finally {
		clearTimeout(timeout);
	}

	throw new SocialUrlResolutionError("We could not convert this shared link. Open the original post and copy its permanent URL, then try again.");
}
