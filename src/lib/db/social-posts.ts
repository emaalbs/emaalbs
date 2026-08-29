import type { SocialPost, SocialPostInput } from "@/data/social-posts";
import { getEnv } from "@/lib/cloudflare";
import { detectSocialPlatform } from "@/lib/social-platforms";

async function getDB(): Promise<D1Database> {
	const { DB } = await getEnv();
	if (!DB) throw new Error("DB binding not available");
	return DB;
}

function rowToSocialPost(row: Record<string, unknown>): SocialPost {
	return {
		id: Number(row.id),
		platform: row.platform as SocialPost["platform"],
		postUrl: (row.post_url as string) || "",
		displayMode: row.display_mode === "custom" ? "custom" : "embed",
		title: { en: (row.title_en as string) || "", ar: (row.title_ar as string) || "" },
		caption: { en: (row.caption_en as string) || "", ar: (row.caption_ar as string) || "" },
		imageUrl: (row.image_url as string) || "",
		postDate: (row.post_date as string) || "",
		published: Boolean(row.published),
		pinned: Boolean(row.pinned),
		sortOrder: Number(row.sort_order) || 0,
		createdAt: Number(row.created_at) || 0,
		updatedAt: Number(row.updated_at) || 0,
	};
}

export async function listSocialPosts(includeUnpublished = false): Promise<SocialPost[]> {
	try {
		const db = await getDB();
		const where = includeUnpublished ? "" : "WHERE published = 1";
		const { results } = await db
			.prepare(`SELECT * FROM social_posts ${where} ORDER BY pinned DESC, sort_order ASC, post_date DESC, id DESC`)
			.all();
		return (results || []).map(rowToSocialPost);
	} catch (error) {
		console.error("Failed to list social posts", error);
		return [];
	}
}

export async function getSocialPostById(id: number): Promise<SocialPost | null> {
	const db = await getDB();
	const row = await db.prepare("SELECT * FROM social_posts WHERE id = ?").bind(id).first();
	return row ? rowToSocialPost(row) : null;
}

export async function createSocialPost(data: SocialPostInput): Promise<SocialPost> {
	const platform = detectSocialPlatform(data.postUrl);
	if (!platform) throw new Error("Unsupported social post URL");
	const db = await getDB();
	const now = Date.now();
	const { meta } = await db
		.prepare(
			`INSERT INTO social_posts (
				platform, post_url, display_mode,
				title_en, title_ar, caption_en, caption_ar,
				image_url, post_date, published, pinned, sort_order, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
		.bind(
			platform,
			data.postUrl.trim(),
			data.displayMode,
			data.title.en.trim(),
			data.title.ar.trim(),
			data.caption.en.trim(),
			data.caption.ar.trim(),
			data.imageUrl.trim(),
			data.postDate,
			data.published ? 1 : 0,
			data.pinned ? 1 : 0,
			data.sortOrder,
			now,
			now
		)
		.run();
	const created = await getSocialPostById(Number(meta.last_row_id));
	if (!created) throw new Error("Failed to create social post");
	return created;
}

export async function updateSocialPost(id: number, data: SocialPostInput): Promise<void> {
	const platform = detectSocialPlatform(data.postUrl);
	if (!platform) throw new Error("Unsupported social post URL");
	const db = await getDB();
	await db
		.prepare(
			`UPDATE social_posts SET
				platform = ?, post_url = ?, display_mode = ?,
				title_en = ?, title_ar = ?, caption_en = ?, caption_ar = ?,
				image_url = ?, post_date = ?, published = ?, pinned = ?, sort_order = ?, updated_at = ?
			 WHERE id = ?`
		)
		.bind(
			platform,
			data.postUrl.trim(),
			data.displayMode,
			data.title.en.trim(),
			data.title.ar.trim(),
			data.caption.en.trim(),
			data.caption.ar.trim(),
			data.imageUrl.trim(),
			data.postDate,
			data.published ? 1 : 0,
			data.pinned ? 1 : 0,
			data.sortOrder,
			Date.now(),
			id
		)
		.run();
}

export async function deleteSocialPost(id: number): Promise<void> {
	const db = await getDB();
	await db.prepare("DELETE FROM social_posts WHERE id = ?").bind(id).run();
}
