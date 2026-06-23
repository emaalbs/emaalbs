/**
 * Master image optimization, audit, rename, and cleanup script.
 * This script scans source code, identifies used/unused assets,
 * creates rename mappings, and prepares everything for execution.
 *
 * Usage:
 *   node scripts/optimize-and-rename.mjs --audit    (shows usage map)
 *   node scripts/optimize-and-rename.mjs --dry-run  (shows what would change)
 *   node scripts/optimize-and-rename.mjs --execute  (performs changes)
 */
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const __dirname = path.resolve();
const PUBLIC_DIR = path.join(__dirname, "public");
const SRC_DIR = path.join(__dirname, "src");

const args = process.argv.slice(2).reduce((acc, arg) => {
	const [k, v] = arg.replace(/^--/, "").split("=");
	acc[k] = v ?? true;
	return acc;
}, {});

const MODE = args.execute ? "execute" : args["dry-run"] ? "dry-run" : "audit";

// ─── Helpers ──────────────────────────────────────────────────────────────
async function* walkDir(dir, extensions = null) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (!entry.name.startsWith(".")) yield* walkDir(fullPath, extensions);
		} else if (!extensions || extensions.some((ext) => entry.name.toLowerCase().endsWith(ext))) {
			yield fullPath;
		}
	}
}

async function getFileHash(filePath) {
	const buffer = await fs.readFile(filePath);
	return crypto.createHash("sha256").update(buffer).digest("hex");
}

function slugify(name) {
	return name
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

// ─── Step 1: Scan source files for image references ─────────────────────
async function scanSources() {
	const refs = new Map(); // normalized public path -> [{ file, line, text }]
	const sourceFiles = [];

	for await (const filePath of walkDir(SRC_DIR, [".tsx", ".ts", ".css", ".md"])) {
		sourceFiles.push(filePath);
	}

	for (const filePath of sourceFiles) {
		const content = await fs.readFile(filePath, "utf-8");
		const lines = content.split("\n");
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			// Match paths inside quotes, handling spaces, Arabic, parentheses, etc.
			const matches = line.matchAll(/['"`](\/((?:images|logos|videos)\/[^'"`]+))['"`]/g);
			for (const match of matches) {
				const publicPath = match[1];
				if (!refs.has(publicPath)) refs.set(publicPath, []);
				refs.get(publicPath).push({
					file: path.relative(__dirname, filePath),
					line: i + 1,
					text: line.trim(),
				});
			}
		}
	}

	return refs;
}

// ─── Step 2: List all assets in public/ ─────────────────────────────────
async function listAssets() {
	const assets = [];
	const dirs = ["images", "logos", "videos"];
	for (const dir of dirs) {
		const fullDir = path.join(PUBLIC_DIR, dir);
		try {
			for await (const filePath of walkDir(fullDir, [".jpg", ".jpeg", ".png", ".webp", ".svg", ".mp4", ".gif", ".avif"])) {
				const relPath = "/" + path.relative(PUBLIC_DIR, filePath).replace(/\\/g, "/");
				const stat = await fs.stat(filePath);
				assets.push({
					publicPath: relPath,
					fsPath: filePath,
					size: stat.size,
					hash: await getFileHash(filePath),
				});
			}
		} catch (e) {
			// directory might not exist
		}
	}
	return assets;
}

// ─── Step 3: Identify unused files ──────────────────────────────────────
function findUnused(assets, refs) {
	return assets.filter((a) => !refs.has(a.publicPath));
}

// ─── Step 4: Build rename mappings for images ───────────────────────────
function buildImageMappings(refs, assets) {
	const mappings = new Map(); // old public path -> new public path

	// ── General images ──
	const imageMappings = {
		"/images/hero-summit.jpg": "/images/hero-summit.webp",
		"/images/highlight-1.jpg": "/images/summit-stage.webp",
		"/images/highlight-2.jpg": "/images/panel-discussion.webp",
		"/images/highlight-3.jpg": "/images/networking-session.webp",
		"/images/ibs-feature.jpg": "/images/keynote-speech.webp",
		"/images/about-meeting.JPG": "/images/about-meeting.webp",
		"/images/leaders.JPG": "/images/leadership-delegation.webp",
		"/images/group-tech.jpg": "/images/venture-tech.webp",
		"/images/group-ibs.jpg": "/images/venture-ibs.webp",
		"/images/group-iraq24.jpg": "/images/venture-iraq24.webp",
		"/images/group-gaming.jpg": "/images/venture-gaming.webp",
		"/images/about-2.jpg": "/images/about-collaboration.webp",
		"/images/about-3.jpg": "/images/about-team.webp",
		"/images/about-secondary.jpg": "/images/about-secondary.webp",
		"/images/cta.JPG": "/images/cta-bg.webp",
		"/images/ibs.png": "/images/ibs-platform.webp",
		"/images/WwdHero.png": "/images/wwd-hero.webp",
		"/images/intro1.png": "/images/wwd-intro-1.webp",
		"/images/intro2.JPG": "/images/wwd-intro-2.webp",
		"/images/intro2.jpg": "/images/wwd-intro-2.webp",
		"/images/House.JPG": "/images/house-platform.webp",
		"/images/Screenshot 2026-05-06 223809.png": "/images/about-hero.webp",
		"/images/People/Hayam Al-Yasri.jpg": "/images/people/hayam-al-yasri.webp",
		"/images/People/Khalid Batal.jpg": "/images/people/khalid-batal.webp",
		"/images/People/Dr. Farhan Al-Fartusi.jpg": "/images/people/dr-farhan-al-fartusi.webp",
		"/images/People/Fadi Al-Faqiyah.jpg": "/images/people/fadi-al-faqiyah.webp",
		"/images/People/images.jpg": "/images/people/saman-bojan.webp",
	};

	for (const [old, newPath] of Object.entries(imageMappings)) {
		mappings.set(old, newPath);
	}

	// ── Videos ──
	mappings.set("/images/انكليزي.mp4", "/videos/ibs-2025-recap-en.mp4");

	// ── Logos (from overview.ts tieredSponsors) ──
	// These are derived from alt text in src/data/ibs/overview.ts
	const logoMappings = {
		"/logos/2.png": "/logos/asiacell.webp",
		"/logos/4.png": "/logos/first-iraqi-bank.webp",
		"/logos/Al Basrah Mas.png": "/logos/al-basrah-mas.webp",
		"/logos/Daewoo Engineering & Construction.png": "/logos/daewoo-engineering.webp",
		"/logos/IDB-Logo-Primary-Dual-RGB-e1675853108729.png": "/logos/international-development-bank.webp",
		"/logos/Jwar Al Khaleej.png": "/logos/jwar-al-khaleej.webp",
		"/logos/Logo Technital - CMYK (10-11-21-19).png": "/logos/technital-cmyk.webp",
		"/logos/Picture182.png": "/logos/first-iraqi-islamic-bank.webp",
		"/logos/Ports logo.png": "/logos/general-company-ports-iraq.webp",
		"/logos/SuperCell.png": "/logos/supercell.webp",
		"/logos/Tiryaki Agro.png": "/logos/tiryaki-agro.webp",
		"/logos/Basrah-Gas.webp": "/logos/basrah-gas.webp",
		"/logos/Earthlink_Telecommunications_Logo.png": "/logos/earthlink.webp",
		"/logos/Euler.png": "/logos/euler-hermes.webp",
		"/logos/genesys.png": "/logos/genesys.webp",
		"/logos/imathia.png": "/logos/imathia-construction.webp",
		"/logos/jib.png": "/logos/jib.webp",
		"/logos/nbtel-logo.png": "/logos/nbtel.webp",
		"/logos/Nokia.png": "/logos/nokia.webp",
		"/logos/Picture7.png": "/logos/toyota.webp",
		"/logos/Picture17.png": "/logos/fastlink.webp",
		"/logos/Picture18 (1).png": "/logos/trade-bank-iraq.webp",
		"/logos/Picture20.png": "/logos/agile.webp",
		"/logos/Picture23.png": "/logos/zhenhua-oil.webp",
		"/logos/Picture24.png": "/logos/first-finance.webp",
		"/logos/Picture25.png": "/logos/fortinet.webp",
		"/logos/Picture26.png": "/logos/dari.webp",
		"/logos/Picture27.png": "/logos/ankido-it.webp",
		"/logos/Picture30.png": "/logos/btp-infrastrutture.webp",
		"/logos/Picture31.png": "/logos/arab-payment-service.webp",
		"/logos/Picture32.png": "/logos/baghdad-chamber-commerce.webp",
		"/logos/Picture33.png": "/logos/basrah-gas-company-2.webp",
		"/logos/Picture36.png": "/logos/shell.webp",
		"/logos/Picture38.png": "/logos/national-investment-commission.webp",
		"/logos/Picture41.png": "/logos/health-insurance-commission.webp",
		"/logos/Picture43.png": "/logos/mitsubishi.webp",
		"/logos/Picture44.png": "/logos/aramex.webp",
		"/logos/Picture46.png": "/logos/iraq-private-banks-league.webp",
		"/logos/Picture47.png": "/logos/baker-hughes.webp",
		"/logos/Visa_Inc._logo.png": "/logos/visa.webp",
		"/logos/BoB Logo-2.png": "/logos/bank-of-baghdad.webp",
		"/logos/IFPMC.png": "/logos/iraq-policy-making-forum.webp",
		"/logos/Ts.png": "/logos/tsingshan.webp",
		"/logos/مفرغ x4.png": "/logos/iraq-24.webp",
		"/logos/BGT.png": "/logos/basra-gate-terminal.webp",
		"/logos/4k logo.png": "/logos/techo-center-engineering.webp",
		"/logos/BOCLOGO1.png": "/logos/basra-oil-company.webp",
		"/logos/Dev Road Logo.png": "/logos/development-road.webp",
		"/logos/GFP.png": "/logos/great-fao-port.webp",
		"/logos/ICC.png": "/logos/industrial-cities-corporation.webp",
		"/logos/Picture37.png": "/logos/iraqi-securities-commission.webp",
		"/logos/Picture39.png": "/logos/midland-oil-company.webp",
		"/logos/Picture40.png": "/logos/picture40.webp",
		"/logos/شعار_وزارة_النقل_(1).png": "/logos/ministry-of-transport.webp",
		"/logos/صندوق العراق للتنمية.png": "/logos/iraq-development-fund.webp",
		// BrandLogos named entries
		"/logos/Al-aliaa LOGO_Main.png": "/logos/al-aliaa.webp",
		"/logos/Alshaba.png": "/logos/alshaba.webp",
		"/logos/Basrah-Gas.webp": "/logos/basrah-gas.webp",
		"/logos/Technital.png": "/logos/technital.webp",
		"/logos/Rida-Logo-1-600x847-1.png": "/logos/rida.webp",
		"/logos/6.png": "/logos/6.webp",
		"/logos/9438الامانة العامة.png": "/logos/9438-general-secretariat.webp",
		"/logos/logo-2.png": "/logos/logo-2.webp",
		"/logos/Picture9.png": "/logos/picture9.webp",
		"/logos/Picture12.png": "/logos/picture12.webp",
		"/logos/Picture19.png": "/logos/picture19.webp",
		"/logos/Picture21.png": "/logos/picture21.webp",
		"/logos/Picture22.png": "/logos/picture22.webp",
		"/logos/Picture29.png": "/logos/picture29.webp",
		"/logos/Picture34.png": "/logos/picture34.webp",
		"/logos/Picture35.png": "/logos/picture35.webp",
		"/logos/Picture42.png": "/logos/picture42.webp",
		"/logos/Picture45.png": "/logos/picture45.webp",
		"/logos/Logo_of_State_Organization_for_Marketing_of_Oil.png": "/logos/somo.webp",
		"/logos/OliverWyman_rgb_c.png": "/logos/oliver-wyman.webp",
		"/logos/كل المنافذ.png": "/logos/kul-al-manafeth.webp",
		"/logos/وزارة_النفط_العراقية.svg.png": "/logos/ministry-of-oil.webp",
	};

	for (const [old, newPath] of Object.entries(logoMappings)) {
		mappings.set(old, newPath);
	}

	// ibs-general logos merge
	mappings.set("/logos/ibs-general/idb.png", "/logos/international-development-bank.webp");
	mappings.set("/logos/ibs-general/bgt.png", "/logos/basra-gate-terminal.webp");
	mappings.set("/logos/ibs-general/icc.png", "/logos/industrial-cities-corporation.webp");
	mappings.set("/logos/ibs-general/nokia.png", "/logos/nokia.webp");
	mappings.set("/logos/ibs-general/visa.png", "/logos/visa.webp");
	mappings.set("/logos/ibs-general/basrah-gas.webp", "/logos/basrah-gas.webp");
	mappings.set("/logos/ibs-general/earthlink.png", "/logos/earthlink.webp");
	mappings.set("/logos/ibs-general/euler.png", "/logos/euler-hermes.webp");
	mappings.set("/logos/ibs-general/genesys.png", "/logos/genesys.webp");
	mappings.set("/logos/ibs-general/gfp.png", "/logos/great-fao-port.webp");
	mappings.set("/logos/ibs-general/ifpmc.png", "/logos/iraq-policy-making-forum.webp");
	mappings.set("/logos/ibs-general/oliver-wyman.png", "/logos/oliver-wyman.webp");
	mappings.set("/logos/ibs-general/supercell.png", "/logos/supercell.webp");
	mappings.set("/logos/ibs-general/technital.png", "/logos/technital.webp");

	return mappings;
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
	console.log(`Mode: ${MODE.toUpperCase()}\n`);

	// Step 1
	console.log("Step 1: Scanning source files for references...");
	const refs = await scanSources();
	console.log(`  Found ${refs.size} unique referenced paths\n`);

	// Step 2
	console.log("Step 2: Listing all assets...");
	const assets = await listAssets();
	console.log(`  Found ${assets.length} asset files\n`);

	// Step 3
	console.log("Step 3: Identifying unused assets...");
	const unused = findUnused(assets, refs);
	if (unused.length) {
		console.log(`  ${unused.length} unused files:`);
		for (const u of unused) console.log(`    - ${u.publicPath} (${(u.size / 1024).toFixed(1)}KB)`);
	} else {
		console.log("  All assets are referenced");
	}

	// Step 4
	console.log("\nStep 4: Building rename mappings...");
	const mappings = buildImageMappings(refs, assets);
	console.log(`  ${mappings.size} rename mappings defined\n`);

	// Show mappings for referenced files only
	for (const [old, newPath] of mappings) {
		if (refs.has(old) || old.startsWith("/logos/ibs-general/")) {
			console.log(`  ${old}  →  ${newPath}`);
		}
	}

	// Find referenced assets without a mapping
	console.log("\n  Referenced assets with NO mapping (need attention):");
	for (const [refPath] of refs) {
		if (!mappings.has(refPath)) {
			console.log(`    ⚠ ${refPath}`);
		}
	}

	// Write manifest
	const manifest = {
		mode: MODE,
		unused: unused.map((u) => ({ path: u.publicPath, sizeKB: (u.size / 1024).toFixed(1) })),
		mappings: Object.fromEntries(mappings),
		unmapped: [...refs.keys()].filter((r) => !mappings.has(r)),
	};
	await fs.writeFile(
		path.join(__dirname, "scripts", "image-manifest.json"),
		JSON.stringify(manifest, null, 2)
	);
	console.log("\nManifest written to scripts/image-manifest.json");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
