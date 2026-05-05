/**
 * Image optimization script.
 * Resizes and compresses images in a target directory.
 *
 * Usage:
 *   node scripts/optimize-images.mjs
 *   node scripts/optimize-images.mjs --dir=public/logos
 *   node scripts/optimize-images.mjs --dir=public/images --maxWidth=1920 --quality=80
 */
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const args = process.argv.slice(2).reduce((acc, arg) => {
	const [k, v] = arg.replace(/^--/, "").split("=");
	acc[k] = v ?? true;
	return acc;
}, {});

const TARGET_DIR = path.resolve(args.dir || "public/images");
const MAX_WIDTH = parseInt(args.maxWidth || "1920", 10);
const QUALITY = parseInt(args.quality || "80", 10);
const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function optimize(filePath) {
	const ext = path.extname(filePath).toLowerCase();
	if (!SUPPORTED.has(ext)) return;

	const fileBuffer = await fs.readFile(filePath);
	const image = sharp(fileBuffer, { animated: ext === ".webp" });
	const metadata = await image.metadata();

	let pipeline = image;
	let resized = false;

	// Resize if wider than max width
	if (metadata.width && metadata.width > MAX_WIDTH) {
		pipeline = pipeline.resize({
			width: MAX_WIDTH,
			withoutEnlargement: true,
			fit: "inside",
		});
		resized = true;
	}

	// Compress based on format
	if (ext === ".jpg" || ext === ".jpeg") {
		pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true, progressive: true });
	} else if (ext === ".png") {
		pipeline = pipeline.png({ quality: Math.min(QUALITY, 100), compressionLevel: 9 });
	} else if (ext === ".webp") {
		pipeline = pipeline.webp({ quality: QUALITY });
	}

	const buffer = await pipeline.toBuffer();
	const originalSize = (await fs.stat(filePath)).size;

	if (buffer.length < originalSize) {
		await fs.writeFile(filePath, buffer);
		const saved = ((originalSize - buffer.length) / originalSize * 100).toFixed(1);
		console.log(
			`✓ ${path.basename(filePath)}  ${metadata.width}x${metadata.height}  ` +
			`${(originalSize / 1024).toFixed(1)}KB → ${(buffer.length / 1024).toFixed(1)}KB  (-${saved}%)` +
			(resized ? ` [resized to ${MAX_WIDTH}px]` : "")
		);
	} else {
		console.log(`  ${path.basename(filePath)}  skipped (already optimized)`);
	}
}

async function main() {
	const files = await fs.readdir(TARGET_DIR);
	console.log(`Optimizing images in: ${TARGET_DIR}\n`);

	for (const file of files) {
		const filePath = path.join(TARGET_DIR, file);
		const stat = await fs.stat(filePath);
		if (stat.isFile()) {
			try {
				await optimize(filePath);
			} catch (err) {
				console.error(`✗ ${file}: ${err.message}`);
			}
		}
	}

	console.log("\nDone.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
