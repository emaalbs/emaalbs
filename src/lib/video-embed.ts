export type VideoSource = {
	kind: "youtube" | "vimeo" | "file" | "embed";
	src: string;
	originalUrl: string;
	thumbnail?: string;
};

const VIDEO_FILE_PATTERN = /\.(mp4|webm|ogg|ogv|mov|m4v)(?:$|\?)/i;
const SAFE_VIDEO_ID = /^[a-zA-Z0-9_-]{6,}$/;

function youtubeId(url: URL): string | null {
	const host = url.hostname.toLowerCase().replace(/^www\./, "").replace(/^m\./, "");
	if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || null;
	if (host !== "youtube.com" && host !== "youtube-nocookie.com") return null;

	const path = url.pathname.split("/").filter(Boolean);
	if (["embed", "shorts", "live"].includes(path[0])) return path[1] || null;
	return url.searchParams.get("v");
}

export function getVideoSource(value: string): VideoSource | null {
	const input = value.trim();
	if (!input) return null;

	let url: URL;
	try {
		url = new URL(input);
	} catch {
		return null;
	}

	if (url.protocol !== "https:" && url.protocol !== "http:") return null;

	const id = youtubeId(url);
	if (id && SAFE_VIDEO_ID.test(id)) {
		return {
			kind: "youtube",
			src: `https://www.youtube-nocookie.com/embed/${id}`,
			originalUrl: input,
			thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
		};
	}

	const host = url.hostname.toLowerCase().replace(/^www\./, "");
	if (host === "vimeo.com" || host === "player.vimeo.com") {
		const vimeoId = url.pathname.split("/").filter(Boolean).reverse().find((part) => /^\d+$/.test(part));
		if (vimeoId) {
			return {
				kind: "vimeo",
				src: `https://player.vimeo.com/video/${vimeoId}`,
				originalUrl: input,
			};
		}
	}

	if (VIDEO_FILE_PATTERN.test(`${url.pathname}${url.search}`)) {
		return { kind: "file", src: url.toString(), originalUrl: input };
	}

	return { kind: "embed", src: url.toString(), originalUrl: input };
}

export function isValidVideoUrl(value: string): boolean {
	return getVideoSource(value) !== null;
}
