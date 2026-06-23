/**
 * Execute image optimization, rename, and cleanup based on manifest.
 *
 * Usage:
 *   node scripts/execute-rename.mjs --dry-run
 *   node scripts/execute-rename.mjs --execute
 */
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const __dirname = path.resolve();
const PUBLIC_DIR = path.join(__dirname, "public");

const args = process.argv.slice(2).reduce((acc, arg) => {
	const [k, v] = arg.replace(/^--/, "").split("=");
	acc[k] = v ?? true;
	return acc;
}, {});

const IS_DRY_RUN = !args.execute;
const MODE = IS_DRY_RUN ? "DRY RUN" : "EXECUTE";

// Files that are "used" even if the regex missed them (template literals, etc.)
const FORCE_USED = new Set([
	"/videos/ibs-ar.mp4",
	"/videos/ibs-en.mp4",
]);

async function ensureDir(dirPath) {
	try {
		await fs.mkdir(dirPath, { recursive: true });
	} catch (e) {
		// ignore
	}
}

async function convertToWebp(srcPath, destPath, isLogo = false) {
	const ext = path.extname(srcPath).toLowerCase();
	// If already webp, just copy/optimize
	if (ext === ".webp") {
		// Re-optimize webp
		const buffer = await fs.readFile(srcPath);
		const optimized = await sharp(buffer).webp({ quality: isLogo ? 90 : 85 }).toBuffer();
		await fs.writeFile(destPath, optimized);
		return { size: optimized.length };
	}

	// For PNG/JPG/JPEG, convert to WebP
	const buffer = await fs.readFile(srcPath);
	const image = sharp(buffer, { animated: ext === ".webp" });
	const metadata = await image.metadata();

	let pipeline = image;

	// Resize photos wider than 1920px
	if (metadata.width && metadata.width > 1920 && !isLogo) {
		pipeline = pipeline.resize({
			width: 1920,
			withoutEnlargement: true,
			fit: "inside",
		});
	}

	const quality = isLogo ? 90 : 85;
	pipeline = pipeline.webp({ quality });

	const optimized = await pipeline.toBuffer();
	await fs.writeFile(destPath, optimized);

	return { size: optimized.length, originalSize: buffer.length };
}

async function main() {
	console.log(`Mode: ${MODE}\n`);

	// Read manifest
	const manifestPath = path.join(__dirname, "scripts", "image-manifest.json");
	const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));

	const mappings = new Map(Object.entries(manifest.mappings));
	const unused = manifest.unused;

	// ── Step 1: Process mappings (convert + rename) ──
	console.log(`Processing ${mappings.size} rename mappings...\n`);

	// Track which destinations we've already written (dedup)
	const writtenDests = new Set();

	for (const [oldPublicPath, newPublicPath] of mappings) {
		const oldFsPath = path.join(PUBLIC_DIR, oldPublicPath.replace(/^\//, "").replace(/\//g, path.sep));
		const newFsPath = path.join(PUBLIC_DIR, newPublicPath.replace(/^\//, "").replace(/\//g, path.sep));

		// Check if old file exists
		try {
			await fs.access(oldFsPath);
		} catch {
			// On Windows, case-insensitive file system might have different casing
			// Try to find the actual file
			const dir = path.dirname(oldFsPath);
			const files = await fs.readdir(dir);
			const baseName = path.basename(oldFsPath);
			const actualName = files.find((f) => f.toLowerCase() === baseName.toLowerCase());
			if (!actualName) {
				console.log(`  SKIP (not found): ${oldPublicPath}`);
				continue;
			}
			oldFsPath = path.join(dir, actualName);
		}

		// Determine if logo (for quality settings)
		const isLogo = newPublicPath.startsWith("/logos/");
		const isVideo = oldPublicPath.endsWith(".mp4");

		// Skip if destination already written (dedup)
		if (writtenDests.has(newFsPath.toLowerCase())) {
			console.log(`  DEDUP: ${oldPublicPath} → ${newPublicPath}`);
			if (!IS_DRY_RUN) {
				await fs.unlink(oldFsPath).catch(() => {});
			}
			continue;
		}

		if (IS_DRY_RUN) {
			if (isVideo) {
				console.log(`  MV: ${oldPublicPath} → ${newPublicPath}`);
			} else {
				console.log(`  ${isLogo ? "LOGO" : "IMG"}: ${oldPublicPath} → ${newPublicPath}`);
			}
			writtenDests.add(newFsPath.toLowerCase());
			continue;
		}

		// Ensure dest dir exists
		await ensureDir(path.dirname(newFsPath));

		if (isVideo) {
			// Just move/copy video files
			await fs.copyFile(oldFsPath, newFsPath);
			await fs.unlink(oldFsPath);
			console.log(`  MV: ${oldPublicPath} → ${newPublicPath}`);
		} else {
			// Convert to WebP
			const stat = await fs.stat(oldFsPath);
			const result = await convertToWebp(oldFsPath, newFsPath, isLogo);
			const saved = ((stat.size - result.size) / stat.size * 100).toFixed(1);
			console.log(
				`  ${isLogo ? "LOGO" : "IMG"}: ${oldPublicPath} → ${newPublicPath} ` +
				`(${(stat.size / 1024).toFixed(1)}KB → ${(result.size / 1024).toFixed(1)}KB, -${saved}%)`
			);
		}

		writtenDests.add(newFsPath.toLowerCase());

		// Delete old file (not the same as new)
		if (oldFsPath.toLowerCase() !== newFsPath.toLowerCase()) {
			await fs.unlink(oldFsPath).catch(() => {});
		}
	}

	// ── Step 2: Delete unused files ──
	console.log(`\nDeleting unused files...`);
	for (const item of unused) {
		if (FORCE_USED.has(item.path)) {
			console.log(`  SKIP (force-used): ${item.path}`);
			continue;
		}
		const fsPath = path.join(PUBLIC_DIR, item.path.replace(/^\//, "").replace(/\//g, path.sep));
		if (IS_DRY_RUN) {
			console.log(`  DEL: ${item.path} (${item.sizeKB}KB)`);
		} else {
			try {
				await fs.unlink(fsPath);
				console.log(`  DEL: ${item.path}`);
			} catch (e) {
				console.log(`  FAIL: ${item.path} — ${e.message}`);
			}
		}
	}

	// ── Step 3: Clean up empty dirs ──
	if (!IS_DRY_RUN) {
		console.log("\nCleaning empty directories...");
		const dirsToCheck = [
			path.join(PUBLIC_DIR, "logos", "ibs-general"),
			path.join(PUBLIC_DIR, "images", "People"),
		];
		for (const dir of dirsToCheck) {
			try {
				const files = await fs.readdir(dir);
				if (files.length === 0) {
					await fs.rmdir(dir);
					console.log(`  RMDIR: ${dir}`);
				}
			} catch (e) {
				// ignore
			}
		}
	}

	console.log(`\n${MODE} complete.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
