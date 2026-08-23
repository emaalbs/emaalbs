/**
 * Client-side image optimizer using the Canvas API.
 * Runs entirely in the browser — fully compatible with Cloudflare Workers (no Sharp, no Node.js).
 *
 * Tries WebP first for best compression; falls back to JPEG if the browser doesn't support WebP output.
 */

export type ImagePreset = "blog-cover" | "ibs-hero" | "portrait" | "gallery" | "logo";

interface PresetConfig {
	maxWidth: number;
	maxHeight: number | null;
	quality: number;
}

const PRESETS: Record<ImagePreset, PresetConfig> = {
	"blog-cover": { maxWidth: 1200, maxHeight: 630,  quality: 0.82 },
	"ibs-hero":   { maxWidth: 1920, maxHeight: 1080, quality: 0.85 },
	portrait:     { maxWidth: 600,  maxHeight: 600,  quality: 0.82 },
	gallery:      { maxWidth: 1200, maxHeight: null,  quality: 0.80 },
	logo:         { maxWidth: 400,  maxHeight: null,  quality: 0.90 },
};

export interface OptimizedImage {
	blob: Blob;
	mimeType: string;
	extension: string;
}

function loadImage(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const objectUrl = URL.createObjectURL(file);
		img.onload = () => {
			URL.revokeObjectURL(objectUrl);
			resolve(img);
		};
		img.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			reject(new Error("Failed to load image"));
		};
		img.src = objectUrl;
	});
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> {
	return new Promise((resolve) => {
		canvas.toBlob((blob) => resolve(blob), mimeType, quality);
	});
}

function computeDimensions(
	srcWidth: number,
	srcHeight: number,
	maxWidth: number,
	maxHeight: number | null,
): { width: number; height: number } {
	let width = srcWidth;
	let height = srcHeight;

	if (width > maxWidth) {
		height = Math.round((height * maxWidth) / width);
		width = maxWidth;
	}

	if (maxHeight !== null && height > maxHeight) {
		width = Math.round((width * maxHeight) / height);
		height = maxHeight;
	}

	return { width, height };
}

/**
 * Optimizes an image file client-side using Canvas.
 * Output format: WebP (preferred) with JPEG fallback.
 *
 * @param file    - The raw File from an <input type="file">
 * @param preset  - One of the named presets defining max dimensions and quality
 * @returns       - { blob, mimeType, extension }
 */
export async function optimizeImage(
	file: File,
	preset: ImagePreset = "blog-cover",
): Promise<OptimizedImage> {
	const config = PRESETS[preset];
	const img = await loadImage(file);

	const { width, height } = computeDimensions(
		img.naturalWidth,
		img.naturalHeight,
		config.maxWidth,
		config.maxHeight,
	);

	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;

	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas 2D context unavailable");
	ctx.drawImage(img, 0, 0, width, height);

	const webpBlob = await canvasToBlob(canvas, "image/webp", config.quality);
	if (webpBlob && webpBlob.size > 0 && webpBlob.type === "image/webp") {
		return { blob: webpBlob, mimeType: "image/webp", extension: "webp" };
	}

	const jpegBlob = await canvasToBlob(canvas, "image/jpeg", config.quality);
	if (!jpegBlob) throw new Error("Image compression failed");
	return { blob: jpegBlob, mimeType: "image/jpeg", extension: "jpg" };
}
