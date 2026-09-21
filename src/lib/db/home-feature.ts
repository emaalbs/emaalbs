import type { HomeFeature, HomeFeatureInput } from "@/data/home-feature";
import { EMPTY_HOME_FEATURE } from "@/data/home-feature";
import { getEnv } from "@/lib/cloudflare";

async function getDB(): Promise<D1Database> {
	const { DB } = await getEnv();
	if (!DB) throw new Error("DB binding not available");
	return DB;
}

function rowToHomeFeature(row: Record<string, unknown>): HomeFeature {
	return {
		id: 1,
		enabled: Boolean(row.enabled),
		kicker: {
			en: (row.kicker_en as string) || "",
			ar: (row.kicker_ar as string) || "",
		},
		title: {
			en: (row.title_en as string) || "",
			ar: (row.title_ar as string) || "",
		},
		description: {
			en: (row.description_en as string) || "",
			ar: (row.description_ar as string) || "",
		},
		buttonLabel: {
			en: (row.button_label_en as string) || "",
			ar: (row.button_label_ar as string) || "",
		},
		buttonHref: {
			en: (row.button_href_en as string) || "",
			ar: (row.button_href_ar as string) || "",
		},
		imageUrl: (row.image_url as string) || "",
		imagePosition: (row.image_position as string) || "center",
	};
}

export async function getHomeFeature(): Promise<HomeFeature> {
	try {
		const db = await getDB();
		const row = await db.prepare("SELECT * FROM homepage_feature WHERE id = 1").first();
		return row ? rowToHomeFeature(row) : EMPTY_HOME_FEATURE;
	} catch {
		return EMPTY_HOME_FEATURE;
	}
}

export async function updateHomeFeature(data: HomeFeatureInput): Promise<HomeFeature> {
	const db = await getDB();
	await db.prepare(
		`INSERT INTO homepage_feature (
			id, enabled, kicker_en, kicker_ar, title_en, title_ar,
			description_en, description_ar, button_label_en, button_label_ar,
			button_href_en, button_href_ar, image_url, image_position, updated_at
		) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			enabled = excluded.enabled,
			kicker_en = excluded.kicker_en,
			kicker_ar = excluded.kicker_ar,
			title_en = excluded.title_en,
			title_ar = excluded.title_ar,
			description_en = excluded.description_en,
			description_ar = excluded.description_ar,
			button_label_en = excluded.button_label_en,
			button_label_ar = excluded.button_label_ar,
			button_href_en = excluded.button_href_en,
			button_href_ar = excluded.button_href_ar,
			image_url = excluded.image_url,
			image_position = excluded.image_position,
			updated_at = excluded.updated_at`
	).bind(
		data.enabled ? 1 : 0,
		data.kicker.en.trim(), data.kicker.ar.trim(),
		data.title.en.trim(), data.title.ar.trim(),
		data.description.en.trim(), data.description.ar.trim(),
		data.buttonLabel.en.trim(), data.buttonLabel.ar.trim(),
		data.buttonHref.en.trim(), data.buttonHref.ar.trim(),
		data.imageUrl.trim(), data.imagePosition || "center", Date.now()
	).run();
	return { id: 1, ...data };
}
