import type {
	GalleryAlbum,
	GalleryAlbumInput,
	GalleryCategory,
	GalleryCategoryInput,
	GalleryImage,
} from "@/data/gallery";
import { getEnv } from "@/lib/cloudflare";

async function getDB(): Promise<D1Database> {
	const { DB } = await getEnv();
	if (!DB) throw new Error("DB binding not available");
	return DB;
}

function rowToCategory(row: Record<string, unknown>): GalleryCategory {
	return {
		id: Number(row.id),
		slug: String(row.slug || ""),
		name: { en: String(row.name_en || ""), ar: String(row.name_ar || "") },
		description: { en: String(row.description_en || ""), ar: String(row.description_ar || "") },
		coverImageUrl: String(row.cover_image_url || ""),
		published: Boolean(row.published),
		sortOrder: Number(row.sort_order) || 0,
		albumCount: Number(row.album_count) || 0,
		createdAt: Number(row.created_at) || 0,
		updatedAt: Number(row.updated_at) || 0,
	};
}

function rowToImage(row: Record<string, unknown>): GalleryImage {
	return {
		id: Number(row.id),
		albumId: Number(row.album_id),
		imageUrl: String(row.image_url || ""),
		contentHash: String(row.content_hash || ""),
		title: { en: String(row.title_en || ""), ar: String(row.title_ar || "") },
		description: { en: String(row.description_en || ""), ar: String(row.description_ar || "") },
		alt: { en: String(row.alt_en || ""), ar: String(row.alt_ar || "") },
		sortOrder: Number(row.sort_order) || 0,
		createdAt: Number(row.created_at) || 0,
		updatedAt: Number(row.updated_at) || 0,
	};
}

function rowToAlbum(row: Record<string, unknown>): GalleryAlbum {
	return {
		id: Number(row.id),
		categoryId: Number(row.category_id),
		categorySlug: String(row.category_slug || ""),
		categoryName: { en: String(row.category_name_en || ""), ar: String(row.category_name_ar || "") },
		slug: String(row.slug || ""),
		title: { en: String(row.title_en || ""), ar: String(row.title_ar || "") },
		description: { en: String(row.description_en || ""), ar: String(row.description_ar || "") },
		coverImageUrl: String(row.cover_image_url || ""),
		eventDate: String(row.event_date || ""),
		location: { en: String(row.location_en || ""), ar: String(row.location_ar || "") },
		published: Boolean(row.published),
		featured: Boolean(row.featured),
		sortOrder: Number(row.sort_order) || 0,
		imageCount: Number(row.image_count) || 0,
		images: [],
		createdAt: Number(row.created_at) || 0,
		updatedAt: Number(row.updated_at) || 0,
	};
}

const albumSelect = `SELECT a.*, c.slug AS category_slug, c.name_en AS category_name_en,
	c.name_ar AS category_name_ar, COUNT(i.id) AS image_count
	FROM gallery_albums a
	JOIN gallery_categories c ON c.id = a.category_id
	LEFT JOIN gallery_images i ON i.album_id = a.id`;

export async function listGalleryCategories(includeUnpublished = false): Promise<GalleryCategory[]> {
	try {
		const db = await getDB();
		const albumCondition = includeUnpublished ? "" : "AND a.published = 1";
		const where = includeUnpublished ? "" : "WHERE c.published = 1";
		const { results } = await db.prepare(`SELECT c.*, COUNT(a.id) AS album_count
			FROM gallery_categories c LEFT JOIN gallery_albums a ON a.category_id = c.id ${albumCondition}
			${where} GROUP BY c.id ORDER BY c.sort_order ASC, c.id ASC`).all();
		return (results || []).map(rowToCategory);
	} catch (error) {
		console.error("Failed to list gallery categories", error);
		return [];
	}
}

export async function getGalleryCategoryById(id: number): Promise<GalleryCategory | null> {
	const db = await getDB();
	const row = await db.prepare("SELECT c.*, (SELECT COUNT(*) FROM gallery_albums a WHERE a.category_id = c.id) AS album_count FROM gallery_categories c WHERE c.id = ?").bind(id).first();
	return row ? rowToCategory(row) : null;
}

export async function createGalleryCategory(data: GalleryCategoryInput): Promise<GalleryCategory> {
	const db = await getDB();
	const now = Date.now();
	const { meta } = await db.prepare(`INSERT INTO gallery_categories
		(slug, name_en, name_ar, description_en, description_ar, cover_image_url, published, sort_order, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
		data.slug, data.name.en.trim(), data.name.ar.trim(), data.description.en.trim(), data.description.ar.trim(),
		data.coverImageUrl.trim(), data.published ? 1 : 0, data.sortOrder, now, now,
	).run();
	const created = await getGalleryCategoryById(Number(meta.last_row_id));
	if (!created) throw new Error("Failed to create category");
	return created;
}

export async function updateGalleryCategory(id: number, data: GalleryCategoryInput): Promise<void> {
	const db = await getDB();
	await db.prepare(`UPDATE gallery_categories SET slug = ?, name_en = ?, name_ar = ?, description_en = ?,
		description_ar = ?, cover_image_url = ?, published = ?, sort_order = ?, updated_at = ? WHERE id = ?`).bind(
		data.slug, data.name.en.trim(), data.name.ar.trim(), data.description.en.trim(), data.description.ar.trim(),
		data.coverImageUrl.trim(), data.published ? 1 : 0, data.sortOrder, Date.now(), id,
	).run();
}

export async function deleteGalleryCategory(id: number): Promise<void> {
	const db = await getDB();
	await db.prepare("DELETE FROM gallery_categories WHERE id = ?").bind(id).run();
}

export async function listGalleryAlbums(includeUnpublished = false, categorySlug = ""): Promise<GalleryAlbum[]> {
	try {
		const db = await getDB();
		const conditions: string[] = [];
		const values: unknown[] = [];
		if (!includeUnpublished) conditions.push("a.published = 1", "c.published = 1");
		if (categorySlug) { conditions.push("c.slug = ?"); values.push(categorySlug); }
		const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
		const query = `${albumSelect} ${where} GROUP BY a.id
			ORDER BY a.featured DESC, a.sort_order ASC, a.event_date DESC, a.id DESC`;
		const { results } = await db.prepare(query).bind(...values).all();
		return (results || []).map(rowToAlbum);
	} catch (error) {
		console.error("Failed to list gallery albums", error);
		return [];
	}
}

async function loadAlbumImages(db: D1Database, albumId: number): Promise<GalleryImage[]> {
	const { results } = await db.prepare("SELECT * FROM gallery_images WHERE album_id = ? ORDER BY sort_order ASC, id ASC").bind(albumId).all();
	return (results || []).map(rowToImage);
}

export async function getGalleryAlbumById(id: number): Promise<GalleryAlbum | null> {
	const db = await getDB();
	const row = await db.prepare(`${albumSelect} WHERE a.id = ? GROUP BY a.id`).bind(id).first();
	if (!row) return null;
	const album = rowToAlbum(row);
	album.images = await loadAlbumImages(db, album.id);
	return album;
}

export async function getPublishedGalleryAlbumBySlug(slug: string): Promise<GalleryAlbum | null> {
	const db = await getDB();
	const row = await db.prepare(`${albumSelect} WHERE a.slug = ? AND a.published = 1 AND c.published = 1 GROUP BY a.id`).bind(slug).first();
	if (!row) return null;
	const album = rowToAlbum(row);
	album.images = await loadAlbumImages(db, album.id);
	return album;
}

function imageInsert(db: D1Database, albumId: number, image: GalleryAlbumInput["images"][number], now: number) {
	return db.prepare(`INSERT INTO gallery_images
		(album_id, image_url, content_hash, title_en, title_ar, description_en, description_ar, alt_en, alt_ar, sort_order, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
		albumId, image.imageUrl.trim(), image.contentHash.trim(), image.title.en.trim(), image.title.ar.trim(), image.description.en.trim(),
		image.description.ar.trim(), image.alt.en.trim(), image.alt.ar.trim(), image.sortOrder, now, now,
	);
}

export async function createGalleryAlbum(data: GalleryAlbumInput): Promise<GalleryAlbum> {
	const db = await getDB();
	const now = Date.now();
	const cover = data.coverImageUrl.trim() || data.images[0]?.imageUrl.trim() || "";
	const { meta } = await db.prepare(`INSERT INTO gallery_albums
		(category_id, slug, title_en, title_ar, description_en, description_ar, cover_image_url, event_date,
		 location_en, location_ar, published, featured, sort_order, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
		data.categoryId, data.slug, data.title.en.trim(), data.title.ar.trim(), data.description.en.trim(),
		data.description.ar.trim(), cover, data.eventDate, data.location.en.trim(), data.location.ar.trim(),
		data.published ? 1 : 0, data.featured ? 1 : 0, data.sortOrder, now, now,
	).run();
	const albumId = Number(meta.last_row_id);
	if (data.images.length) await db.batch(data.images.map((image) => imageInsert(db, albumId, image, now)));
	const created = await getGalleryAlbumById(albumId);
	if (!created) throw new Error("Failed to create album");
	return created;
}

export async function updateGalleryAlbum(id: number, data: GalleryAlbumInput): Promise<void> {
	const db = await getDB();
	const now = Date.now();
	const cover = data.coverImageUrl.trim() || data.images[0]?.imageUrl.trim() || "";
	const existing = await loadAlbumImages(db, id);
	const existingIds = new Set(existing.map((image) => image.id));
	const retainedIds = new Set(data.images.flatMap((image) => image.id && existingIds.has(image.id) ? [image.id] : []));
	const statements: D1PreparedStatement[] = [
		db.prepare(`UPDATE gallery_albums SET category_id = ?, slug = ?, title_en = ?, title_ar = ?, description_en = ?,
			description_ar = ?, cover_image_url = ?, event_date = ?, location_en = ?, location_ar = ?, published = ?,
			featured = ?, sort_order = ?, updated_at = ? WHERE id = ?`).bind(
			data.categoryId, data.slug, data.title.en.trim(), data.title.ar.trim(), data.description.en.trim(),
			data.description.ar.trim(), cover, data.eventDate, data.location.en.trim(), data.location.ar.trim(),
			data.published ? 1 : 0, data.featured ? 1 : 0, data.sortOrder, now, id,
		),
	];

	for (const image of data.images) {
		if (image.id && existingIds.has(image.id)) {
			statements.push(db.prepare(`UPDATE gallery_images SET image_url = ?, content_hash = COALESCE(NULLIF(?, ''), content_hash), title_en = ?, title_ar = ?,
				description_en = ?, description_ar = ?, alt_en = ?, alt_ar = ?, sort_order = ?, updated_at = ?
				WHERE id = ? AND album_id = ?`).bind(
				image.imageUrl.trim(), image.contentHash.trim(), image.title.en.trim(), image.title.ar.trim(), image.description.en.trim(),
				image.description.ar.trim(), image.alt.en.trim(), image.alt.ar.trim(), image.sortOrder, now, image.id, id,
			));
		} else {
			statements.push(imageInsert(db, id, image, now));
		}
	}
	for (const image of existing) {
		if (!retainedIds.has(image.id)) statements.push(db.prepare("DELETE FROM gallery_images WHERE id = ? AND album_id = ?").bind(image.id, id));
	}
	await db.batch(statements);
}

export async function deleteGalleryAlbum(id: number): Promise<void> {
	const db = await getDB();
	await db.prepare("DELETE FROM gallery_albums WHERE id = ?").bind(id).run();
}
