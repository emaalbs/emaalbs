/**
 * Update all image/logo/video paths in source code based on manifest.
 *
 * Usage:
 *   node scripts/update-source-paths.mjs --dry-run
 *   node scripts/update-source-paths.mjs --execute
 */
import { promises as fs } from "fs";
import path from "path";

const __dirname = path.resolve();
const SRC_DIR = path.join(__dirname, "src");

const args = process.argv.slice(2).reduce((acc, arg) => {
	const [k, v] = arg.replace(/^--/, "").split("=");
	acc[k] = v ?? true;
	return acc;
}, {});

const IS_DRY_RUN = !args.execute;
const MODE = IS_DRY_RUN ? "DRY RUN" : "EXECUTE";

async function* walkDir(dir, extensions) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (!entry.name.startsWith(".")) yield* walkDir(fullPath, extensions);
		} else if (extensions.some((ext) => entry.name.toLowerCase().endsWith(ext))) {
			yield fullPath;
		}
	}
}

async function main() {
	console.log(`Mode: ${MODE}\n`);

	// Read manifest
	const manifestPath = path.join(__dirname, "scripts", "image-manifest.json");
	const manifest = JSON.parse(await fs.readFile(manifestPath, "utf-8"));

	// Build replacement list, sorted by length descending (longest first)
	// to avoid partial replacements
	const replacements = Object.entries(manifest.mappings)
		.map(([old, newPath]) => ({ old, newPath }))
		.sort((a, b) => b.old.length - a.old.length);

	let totalFilesChanged = 0;
	let totalReplacements = 0;

	for await (const filePath of walkDir(SRC_DIR, [".tsx", ".ts", ".css", ".md"])) {
		const content = await fs.readFile(filePath, "utf-8");
		let newContent = content;
		let fileChanged = false;
		let fileReplacements = 0;

		for (const { old, newPath } of replacements) {
			// Use a regex that matches the exact old path inside quotes or as-is
			// Need to escape special regex characters in the old path
			const escaped = old.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			// We need to match the exact path string, but it might be in single quotes, double quotes, or backticks
			const regex = new RegExp(escaped, "g");

			const matches = newContent.match(regex);
			if (matches) {
				newContent = newContent.replace(regex, newPath);
				fileChanged = true;
				fileReplacements += matches.length;
			}
		}

		if (fileChanged) {
			totalFilesChanged++;
			totalReplacements += fileReplacements;
			const relPath = path.relative(__dirname, filePath);
			if (IS_DRY_RUN) {
				console.log(`  WOULD UPDATE: ${relPath} (${fileReplacements} replacements)`);
			} else {
				await fs.writeFile(filePath, newContent, "utf-8");
				console.log(`  UPDATED: ${relPath} (${fileReplacements} replacements)`);
			}
		}
	}

	console.log(`\n${MODE} complete.`);
	console.log(`  Files: ${totalFilesChanged}`);
	console.log(`  Total replacements: ${totalReplacements}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
