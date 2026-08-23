import type { HeroSlide, HeroSlideInput } from "@/data/hero-slides";
import { getEnv } from "@/lib/cloudflare";

async function getDB(): Promise<D1Database> {
	const { DB } = await getEnv();
	if (!DB) throw new Error("DB binding not available");
	return DB;
}

function rowToHeroSlide(row: Record<string, unknown>): HeroSlide {
	return {
		id: Number(row.id),
		overline: {
			en: (row.overline_en as string) || "",
			ar: (row.overline_ar as string) || "",
		},
		titleLine1: {
			en: (row.title_line_1_en as string) || "",
			ar: (row.title_line_1_ar as string) || "",
		},
		titleLine2: {
			en: (row.title_line_2_en as string) || "",
			ar: (row.title_line_2_ar as string) || "",
		},
		description: {
			en: (row.description_en as string) || "",
			ar: (row.description_ar as string) || "",
		},
		imageUrl: (row.image_url as string) || "",
		imagePosition: (row.image_position as string) || "center",
		sortOrder: Number(row.sort_order) || 0,
		published: Boolean(row.published),
	};
}

export async function listHeroSlides(includeUnpublished = false): Promise<HeroSlide[]> {
	try {
		const db = await getDB();
		const where = includeUnpublished ? "" : "WHERE published = 1";
		const { results } = await db
			.prepare(`SELECT * FROM hero_slides ${where} ORDER BY sort_order ASC, id ASC`)
			.all();
		return (results || []).map(rowToHeroSlide);
	} catch {
		return [];
	}
}

export async function getHeroSlideById(id: number): Promise<HeroSlide | null> {
	const db = await getDB();
	const row = await db.prepare("SELECT * FROM hero_slides WHERE id = ?").bind(id).first();
	return row ? rowToHeroSlide(row) : null;
}

export async function createHeroSlide(data: HeroSlideInput): Promise<HeroSlide> {
	const db = await getDB();
	const now = Date.now();
	const { meta } = await db
		.prepare(
			`INSERT INTO hero_slides (
				overline_en, overline_ar,
				title_line_1_en, title_line_1_ar,
				title_line_2_en, title_line_2_ar,
				description_en, description_ar,
				image_url, image_position, sort_order, published, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
		.bind(
			data.overline.en,
			data.overline.ar,
			data.titleLine1.en,
			data.titleLine1.ar,
			data.titleLine2.en,
			data.titleLine2.ar,
			data.description.en,
			data.description.ar,
			data.imageUrl,
			data.imagePosition || "center",
			data.sortOrder,
			data.published ? 1 : 0,
			now,
			now
		)
		.run();

	const slide = await getHeroSlideById(Number(meta.last_row_id));
	if (!slide) throw new Error("Failed to create hero slide");
	return slide;
}

export async function updateHeroSlide(id: number, data: HeroSlideInput): Promise<void> {
	const db = await getDB();
	await db
		.prepare(
			`UPDATE hero_slides SET
				overline_en = ?, overline_ar = ?,
				title_line_1_en = ?, title_line_1_ar = ?,
				title_line_2_en = ?, title_line_2_ar = ?,
				description_en = ?, description_ar = ?,
				image_url = ?, image_position = ?, sort_order = ?, published = ?, updated_at = ?
			 WHERE id = ?`
		)
		.bind(
			data.overline.en,
			data.overline.ar,
			data.titleLine1.en,
			data.titleLine1.ar,
			data.titleLine2.en,
			data.titleLine2.ar,
			data.description.en,
			data.description.ar,
			data.imageUrl,
			data.imagePosition || "center",
			data.sortOrder,
			data.published ? 1 : 0,
			Date.now(),
			id
		)
		.run();
}

export async function deleteHeroSlide(id: number): Promise<void> {
	const db = await getDB();
	await db.prepare("DELETE FROM hero_slides WHERE id = ?").bind(id).run();
}
