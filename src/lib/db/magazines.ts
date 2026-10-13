import { magazinePdfUrl, type Magazine } from "@/data/magazines";
import { getEnv } from "@/lib/cloudflare";

async function getDB(): Promise<D1Database> {
	const { DB } = await getEnv();
	if (!DB) throw new Error("DB binding not available");
	return DB;
}

function rowToMagazine(row: Record<string, unknown>): Magazine {
	return {
		id: row.id as number,
		slug: row.slug as string,
		title: {
			en: (row.title_en as string) || "",
			ar: (row.title_ar as string) || "",
		},
		description: {
			en: (row.description_en as string) || "",
			ar: (row.description_ar as string) || "",
		},
		cover_image: (row.cover_image as string) || "",
		pdf_url: (row.pdf_url as string) || "",
		pdf_url_en: (row.pdf_url_en as string) || "",
		pdf_url_ar: (row.pdf_url_ar as string) || "",
		date: (row.date as string) || "",
	};
}

export async function listMagazines(): Promise<Magazine[]> {
	try {
		const db = await getDB();
		const { results } = await db
			.prepare(
				"SELECT * FROM magazines WHERE published = 1 ORDER BY created_at DESC"
			)
			.all();
		return (results || []).map(rowToMagazine);
	} catch {
		return [];
	}
}

export async function getMagazineBySlug(slug: string): Promise<Magazine | null> {
	const db = await getDB();
	const row = await db
		.prepare("SELECT * FROM magazines WHERE slug = ? AND published = 1")
		.bind(slug)
		.first();
	if (!row) return null;
	return rowToMagazine(row);
}

export async function createMagazine(
	data: Omit<Magazine, "id"> & { published?: number }
): Promise<Magazine> {
	const db = await getDB();
	data = { ...data, ...validatedPdfFields(data) };
	if (!magazinePdfUrl(data, "en")) throw new MagazineInputError("Upload at least one PDF: English or Arabic.");
	const now = Date.now();
	const { meta } = await db
		.prepare(
			`INSERT INTO magazines (slug, title_en, title_ar, description_en, description_ar, cover_image, pdf_url, pdf_url_en, pdf_url_ar, date, published, created_at, updated_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
		.bind(
			data.slug,
			data.title.en,
			data.title.ar,
			data.description.en,
			data.description.ar,
			data.cover_image,
			data.pdf_url,
			data.pdf_url_en,
			data.pdf_url_ar,
			data.date,
			data.published ?? 1,
			now,
			now
		)
		.run();
	return { ...data, id: meta.last_row_id as number };
}

export async function updateMagazine(
	slug: string,
	data: Partial<Omit<Magazine, "id">>
): Promise<void> {
	const db = await getDB();
	const current = await db.prepare("SELECT * FROM magazines WHERE slug = ?").bind(slug).first();
	if (!current) throw new MagazineInputError("Magazine not found.");
	const pdfs = validatedPdfFields(data, rowToMagazine(current));
	if (!magazinePdfUrl(pdfs, "en")) throw new MagazineInputError("Upload at least one PDF: English or Arabic.");
	const sets: string[] = [];
	const values: unknown[] = [];
	if (data.title) {
		sets.push("title_en = ?", "title_ar = ?");
		values.push(data.title.en, data.title.ar);
	}
	if (data.description) {
		sets.push("description_en = ?", "description_ar = ?");
		values.push(data.description.en, data.description.ar);
	}
	if (data.cover_image !== undefined) {
		sets.push("cover_image = ?");
		values.push(data.cover_image);
	}
	for (const field of ["pdf_url", "pdf_url_en", "pdf_url_ar"] as const) {
		if (data[field] !== undefined) {
			sets.push(`${field} = ?`);
			values.push(pdfs[field]);
		}
	}
	if (data.date !== undefined) {
		sets.push("date = ?");
		values.push(data.date);
	}
	sets.push("updated_at = ?");
	values.push(Date.now());
	values.push(slug);
	await db
		.prepare(`UPDATE magazines SET ${sets.join(", ")} WHERE slug = ?`)
		.bind(...values)
		.run();
}

export class MagazineInputError extends Error {}

function validatedPdfFields(data: Partial<Magazine>, current?: Magazine) {
	const fields = { pdf_url: "", pdf_url_en: "", pdf_url_ar: "" };
	for (const field of ["pdf_url", "pdf_url_en", "pdf_url_ar"] as const) {
		const value = data[field] === undefined ? current?.[field] || "" : data[field];
		if (typeof value !== "string" || value.length > 4096) throw new MagazineInputError("Invalid PDF URL.");
		const url = value.trim();
		if (url) {
			// Accept site-relative media and HTTP(S) links, never executable/protocol-relative URLs.
			if (/[\\\s\u0000-\u001f]/.test(url) || url.startsWith("//")) throw new MagazineInputError("Invalid PDF URL.");
			if (!url.startsWith("/")) {
				try { if (!["https:", "http:"].includes(new URL(url).protocol)) throw new Error(); }
				catch { throw new MagazineInputError("Invalid PDF URL."); }
			}
		}
		fields[field] = url;
	}
	return fields;
}

export async function deleteMagazine(slug: string): Promise<void> {
	const db = await getDB();
	await db.prepare("DELETE FROM magazines WHERE slug = ?").bind(slug).run();
}
