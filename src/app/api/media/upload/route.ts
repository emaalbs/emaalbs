import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { requireAuth } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";
import { sha256Hex } from "@/lib/content-hash";
import { createGalleryImage } from "@/lib/db/gallery";

const HASH_PATTERN = /^[a-f0-9]{64}$/;

function mediaKeyFromUrl(url: string): string | null {
	const prefix = "/api/media/";
	return url.startsWith(prefix) ? decodeURIComponent(url.slice(prefix.length)) : null;
}

async function galleryContainsHash(db: D1Database, bucket: R2Bucket, targetHash: string): Promise<boolean> {
	const direct = await db.prepare("SELECT id FROM gallery_images WHERE content_hash = ? LIMIT 1").bind(targetHash).first();
	if (direct) return true;

	const { results } = await db.prepare("SELECT id, image_url FROM gallery_images WHERE content_hash = '' ORDER BY id ASC").all();
	for (const row of results || []) {
		const key = mediaKeyFromUrl(String(row.image_url || ""));
		if (!key) continue;
		const object = await bucket.get(key);
		if (!object) continue;
		const existingHash = await sha256Hex(await object.arrayBuffer());
		if (existingHash === targetHash) {
			await db.prepare("UPDATE gallery_images SET content_hash = ? WHERE id = ? AND content_hash = ''")
				.bind(existingHash, Number(row.id)).run().catch(() => undefined);
			return true;
		}
		const alreadyStored = await db.prepare("SELECT id FROM gallery_images WHERE content_hash = ? LIMIT 1").bind(existingHash).first();
		if (!alreadyStored) {
			await db.prepare("UPDATE gallery_images SET content_hash = ? WHERE id = ? AND content_hash = ''")
				.bind(existingHash, Number(row.id)).run().catch(() => undefined);
		}
	}
	return false;
}

export async function POST(request: Request) {
	try {
		await requireAuth(request);
		const { MEDIA: bucket, DB: db } = await getEnv();
		if (!bucket) {
			return NextResponse.json({ error: "R2 bucket unavailable" }, { status: 500 });
		}

		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		const prefix = (formData.get("prefix") as string) || "";
		const suppliedHash = String(formData.get("contentHash") || "").toLowerCase();
		const preventGalleryDuplicate = formData.get("preventGalleryDuplicate") === "1";
		const galleryAlbumIdValue = String(formData.get("galleryAlbumId") || "");
		const galleryAlbumId = galleryAlbumIdValue ? Number(galleryAlbumIdValue) : null;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}
		if (galleryAlbumId !== null && (!Number.isInteger(galleryAlbumId) || galleryAlbumId < 1 || !preventGalleryDuplicate)) {
			return NextResponse.json({ error: "Invalid gallery album" }, { status: 400 });
		}

		if (preventGalleryDuplicate) {
			if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
			const actualHash = await sha256Hex(await file.arrayBuffer());
			if (!HASH_PATTERN.test(suppliedHash) || suppliedHash !== actualHash) {
				return NextResponse.json({ error: "Image fingerprint verification failed" }, { status: 400 });
			}
			if (await galleryContainsHash(db, bucket, actualHash)) {
				return NextResponse.json({ duplicate: true, error: "هذه الصورة موجودة مسبقًا في المعرض" }, { status: 409 });
			}
		}

		const ext = file.name.split(".").pop() || "bin";
		const key = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
		const result = await uploadToR2(bucket, key, file, file.type);
		if (galleryAlbumId !== null) {
			try {
				const galleryImage = await createGalleryImage(galleryAlbumId, {
					imageUrl: result.url,
					contentHash: suppliedHash,
					title: { en: "", ar: "" },
					description: { en: "", ar: "" },
					alt: { en: "", ar: "" },
					sortOrder: Number(formData.get("sortOrder")) || 0,
				});
				return NextResponse.json({ ...result, galleryImage });
			} catch (galleryError) {
				await bucket.delete(key).catch(() => undefined);
				throw galleryError;
			}
		}
		return NextResponse.json(result);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Upload failed";
		const duplicate = message.includes("gallery_images.content_hash") || message.includes("UNIQUE constraint failed: gallery_images.content_hash");
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : duplicate ? 409 : message.includes("up to") || message === "Album not found" ? 400 : 500;
		return NextResponse.json({ error: duplicate ? "هذه الصورة موجودة مسبقًا في المعرض" : message, duplicate }, { status });
	}
}
