/**
 * Video optimization script.
 * Re-encodes MP4s with H.264 + AAC for web delivery.
 *
 * Usage:
 *   node scripts/optimize-videos.mjs
 */
import { promises as fs } from "fs";
import path from "path";
import { spawn } from "child_process";

const INPUT_DIR = path.resolve("public/images");
const OUTPUT_DIR = path.resolve("public/videos");

// Map source filename → optimized output filename
const FILES = [
	{ src: "عربي.mp4", out: "ibs-ar.mp4" },
	{ src: "انكليزي.mp4", out: "ibs-en.mp4" },
];

function ffmpeg(input, output) {
	return new Promise((resolve, reject) => {
		const args = [
			"-y",
			"-i", input,
			"-c:v", "libx264",
			"-crf", "28",
			"-preset", "fast",
			"-vf", "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease,format=yuv420p",
			"-c:a", "aac",
			"-b:a", "128k",
			"-movflags", "+faststart",
			output,
		];
		const proc = spawn("ffmpeg", args, { stdio: "pipe" });
		let stderr = "";
		proc.stderr.on("data", (d) => { stderr += d; });
		proc.on("close", (code) => {
			if (code === 0) resolve();
			else reject(new Error(`ffmpeg exited ${code}\n${stderr.slice(-500)}`));
		});
	});
}

async function main() {
	await fs.mkdir(OUTPUT_DIR, { recursive: true });

	for (const { src, out } of FILES) {
		const inputPath = path.join(INPUT_DIR, src);
		const outputPath = path.join(OUTPUT_DIR, out);

		try {
			await fs.access(inputPath);
		} catch {
			console.error(`✗ ${src} not found, skipping`);
			continue;
		}

		const before = (await fs.stat(inputPath)).size;
		console.log(`→ Optimizing ${src} …`);
		await ffmpeg(inputPath, outputPath);
		const after = (await fs.stat(outputPath)).size;
		const saved = ((before - after) / before * 100).toFixed(1);
		console.log(
			`✓ ${out.padEnd(12)} ${(before / 1024 / 1024).toFixed(2)}MB → ${(after / 1024 / 1024).toFixed(2)}MB (-${saved}%)`
		);
	}

	console.log("\nDone.");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
