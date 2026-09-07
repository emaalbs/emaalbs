import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";
import { deleteGalleryImages } from "@/lib/db/gallery";
import { GALLERY_MAX_IMAGES } from "@/data/gallery";

type Params = { params: Promise<{ id: string }> };

function mediaKeyFromUrl(url: string): string | null {
	const prefix = "/api/media/gallery/albums/";
	return url.startsWith(prefix) ? decodeURIComponent(url.slice("/api/media/".length)) : null;
}

export async function DELETE(request: Request, { params }: Params) {
	try {
		await requireAuth(request);
		const albumId = Number((await params).id);
		if (!Number.isInteger(albumId) || albumId < 1) return NextResponse.json({ error: "Invalid album id" }, { status: 400 });

		const body = (await request.json()) as { ids?: unknown };
		if (!Array.isArray(body.ids) || body.ids.length < 1 || body.ids.length > GALLERY_MAX_IMAGES) {
			return NextResponse.json({ error: `Choose between 1 and ${GALLERY_MAX_IMAGES} images` }, { status: 400 });
		}
		const ids = body.ids.map(Number);
		if (ids.some((id) => !Number.isInteger(id) || id < 1)) return NextResponse.json({ error: "Invalid image selection" }, { status: 400 });

		const deletedUrls = await deleteGalleryImages(albumId, ids);
		const { MEDIA: bucket } = await getEnv();
		const keys = deletedUrls.map(mediaKeyFromUrl).filter((key): key is string => Boolean(key));
		if (bucket && keys.length) await bucket.delete(keys);
		return NextResponse.json({ success: true, deleted: deletedUrls.length });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Failed to delete gallery images";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
