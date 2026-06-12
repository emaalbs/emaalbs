import type { Blog, BlogBlock } from "@/data/blogs";
import { getEnv } from "@/lib/cloudflare";

async function getDB(): Promise<D1Database> {
	const { DB } = await getEnv();
	if (!DB) throw new Error("DB binding not available");
	return DB;
}

function rowToBlog(row: Record<string, unknown>): Blog {
	return {
		id: row.id as number,
		slug: row.slug as string,
		title: { en: (row.title_en as string) || "", ar: (row.title_ar as string) || "" },
		description: { en: (row.description_en as string) || "", ar: (row.description_ar as string) || "" },
		content: {
			en: JSON.parse((row.content_en as string) || "[]") as BlogBlock[],
			ar: JSON.parse((row.content_ar as string) || "[]") as BlogBlock[],
		},
		image: (row.image as string) || "",
		date: (row.date as string) || "",
		featured: Boolean(row.featured),
	};
}

export async function listBlogs(): Promise<Blog[]> {
	try {
		const db = await getDB();
		const { results } = await db.prepare(
			"SELECT id, slug, title_en, title_ar, description_en, description_ar, image, date, featured FROM blogs WHERE published = 1 ORDER BY featured DESC, created_at DESC"
		).all();
		return (results || []).map(rowToBlog);
	} catch {
		return [];
	}
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
	const db = await getDB();
	const row = await db.prepare("SELECT * FROM blogs WHERE slug = ? AND published = 1").bind(slug).first();
	if (!row) return null;
	return rowToBlog(row);
}

export async function createBlog(data: Omit<Blog, "id"> & { published?: number; sort_order?: number }): Promise<Blog> {
	const db = await getDB();
	const now = Date.now();
	await db.prepare("UPDATE blogs SET featured = 0 WHERE featured = 1").run();
	const { meta } = await db.prepare(
		`INSERT INTO blogs (slug, title_en, title_ar, description_en, description_ar, content_en, content_ar, image, date, published, sort_order, featured, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	)
		.bind(
			data.slug,
			data.title.en,
			data.title.ar,
			data.description.en,
			data.description.ar,
			JSON.stringify(data.content.en),
			JSON.stringify(data.content.ar),
			data.image,
			data.date,
			data.published ?? 1,
			data.sort_order ?? 0,
			data.featured ? 1 : 0,
			now,
			now,
		)
		.run();
	return { ...data, id: meta.last_row_id as number };
}

export async function updateBlog(slug: string, data: Partial<Omit<Blog, "id">>): Promise<void> {
	const db = await getDB();
	const sets: string[] = [];
	const values: unknown[] = [];
	if (data.title) { sets.push("title_en = ?", "title_ar = ?"); values.push(data.title.en, data.title.ar); }
	if (data.description) { sets.push("description_en = ?", "description_ar = ?"); values.push(data.description.en, data.description.ar); }
	if (data.content) { sets.push("content_en = ?", "content_ar = ?"); values.push(JSON.stringify(data.content.en), JSON.stringify(data.content.ar)); }
	if (data.image !== undefined) { sets.push("image = ?"); values.push(data.image); }
	if (data.date !== undefined) { sets.push("date = ?"); values.push(data.date); }
	if (data.featured !== undefined) { sets.push("featured = ?"); values.push(data.featured ? 1 : 0); }
	sets.push("updated_at = ?"); values.push(Date.now());
	values.push(slug);
	await db.prepare(`UPDATE blogs SET ${sets.join(", ")} WHERE slug = ?`).bind(...values).run();
	if (data.featured) {
		await db.prepare("UPDATE blogs SET featured = 0 WHERE slug != ? AND featured = 1").bind(slug).run();
	}
}

export async function deleteBlog(slug: string): Promise<void> {
	const db = await getDB();
	await db.prepare("DELETE FROM blogs WHERE slug = ?").bind(slug).run();
}
