/**
 * Normalize logos by trimming excess padding and resizing to a consistent max dimension.
 * Output goes to public/logos-normalized/ (PNG, transparent where trimmed).
 *
 * Usage:
 *   node scripts/normalize-logos.mjs
 */
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const SOURCE_DIR = path.resolve("public/logos");
const TARGET_DIR = path.resolve("public/logos-normalized");
const MAX_DIM = 150; // max width or height in px

const SUPPORTED = new Set([".png", ".jpg", ".jpeg", ".webp"]);

async function normalize(file) {
	const ext = path.extname(file).toLowerCase();
	if (!SUPPORTED.has(ext)) return;

	const inputPath = path.join(SOURCE_DIR, file);
	const outputPath = path.join(TARGET_DIR, path.basename(file, ext) + ".png");

	let image = sharp(inputPath);
	const metadata = await image.metadata();

	// Try to trim excess background padding (transparent, white, or top-left color)
	try {
		image = image.trim({ threshold: 10 });
	} catch {
		// No padding to trim — fine to continue
	}

	// Resize so the longest side fits within MAX_DIM (never upscale tiny logos)
	image = image.resize({
		width: MAX_DIM,
		height: MAX_DIM,
		fit: "inside",
		withoutEnlargement: true,
	});

	// Write as compressed PNG (preserves any transparency revealed by trim)
	const buffer = await image.png({ compressionLevel: 9 }).toBuffer();
	await fs.writeFile(outputPath, buffer);

	const before = (await fs.stat(inputPath)).size;
	const after = buffer.length;
	console.log(
		`✓ ${file.padEnd(45)} ${(before / 1024).toFixed(1)}KB → ${(after / 1024).toFixed(1)}KB`
	);
}

async function main() {
	await fs.mkdir(TARGET_DIR, { recursive: true });
	const files = await fs.readdir(SOURCE_DIR);

	console.log(`Normalizing logos → ${TARGET_DIR}\n`);

	for (const file of files) {
		try {
			await normalize(file);
		} catch (err) {
			console.error(`✗ ${file}: ${err.message}`);
		}
	}

	console.log("\nDone.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
