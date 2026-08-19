import { DEFAULT_HOME_HERO, type HomeHeroSettings } from "@/data/home-hero";
import { getEnv } from "@/lib/cloudflare";

async function getDB(): Promise<D1Database> {
	const { DB } = await getEnv();
	if (!DB) throw new Error("DB binding not available");
	return DB;
}

export async function getHomeHero(): Promise<HomeHeroSettings> {
	try {
		const db = await getDB();
		const row = await db
			.prepare("SELECT payload_json FROM home_hero_settings WHERE id = 1")
			.first<{ payload_json: string }>();
		if (!row) return DEFAULT_HOME_HERO;
		return normalizeHomeHero(JSON.parse(row.payload_json) as unknown);
	} catch {
		return DEFAULT_HOME_HERO;
	}
}

function normalizeHomeHero(value: unknown): HomeHeroSettings {
	if (!value || typeof value !== "object") return DEFAULT_HOME_HERO;
	const stored = value as Record<string, unknown>;
	if (!Array.isArray(stored.slides) || stored.slides.length === 0) return DEFAULT_HOME_HERO;

	// Upgrade the original global-content format by copying its content into every slide.
	const fallback = DEFAULT_HOME_HERO.slides[0];
	const globalContent = {
		overline: stored.overline ?? fallback.overline,
		titleLine1: stored.titleLine1 ?? fallback.titleLine1,
		titleLine2: stored.titleLine2 ?? fallback.titleLine2,
		description: stored.description ?? fallback.description,
		primaryCtaLabel: stored.primaryCtaLabel ?? fallback.primaryCtaLabel,
		primaryCtaHref: stored.primaryCtaHref ?? fallback.primaryCtaHref,
		secondaryCtaLabel: stored.secondaryCtaLabel ?? fallback.secondaryCtaLabel,
		secondaryCtaHref: stored.secondaryCtaHref ?? fallback.secondaryCtaHref,
	};

	return {
		slideIntervalMs: typeof stored.slideIntervalMs === "number" ? stored.slideIntervalMs : DEFAULT_HOME_HERO.slideIntervalMs,
		slides: stored.slides.map((item) => ({
			...globalContent,
			...(item as Record<string, unknown>),
		})) as HomeHeroSettings["slides"],
	};
}

export async function saveHomeHero(settings: HomeHeroSettings): Promise<void> {
	const db = await getDB();
	await db
		.prepare(
			`INSERT INTO home_hero_settings (id, payload_json, updated_at)
			 VALUES (1, ?, ?)
			 ON CONFLICT(id) DO UPDATE SET
			 payload_json = excluded.payload_json,
			 updated_at = excluded.updated_at`,
		)
		.bind(JSON.stringify(settings), Date.now())
		.run();
}
