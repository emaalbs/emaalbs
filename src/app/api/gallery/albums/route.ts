import { NextResponse } from "next/server";
import type { GalleryAlbumInput } from "@/data/gallery";
import { requireAuth } from "@/lib/auth";
import { createGalleryAlbum, listGalleryAlbums } from "@/lib/db/gallery";
import { validateGalleryAlbumInput } from "@/lib/gallery-validation";

function errorResponse(error: unknown, fallback: string) {
	const message = error instanceof Error ? error.message : fallback;
	const status = message.includes("UNIQUE") ? 409 : message.includes("FOREIGN KEY") ? 400 : message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
	const safeMessage = message.includes("gallery_images.content_hash") ? "هذه الصورة موجودة مسبقًا في المعرض" : message.includes("UNIQUE") ? "This album slug is already in use" : message.includes("FOREIGN KEY") ? "Choose an existing category" : message;
	return NextResponse.json({ error: safeMessage }, { status });
}

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const includeUnpublished = url.searchParams.get("admin") === "1";
		if (includeUnpublished) await requireAuth(request);
		return NextResponse.json(await listGalleryAlbums(includeUnpublished, url.searchParams.get("category") || ""));
	} catch (error) {
		return errorResponse(error, "Failed to fetch gallery albums");
	}
}

export async function POST(request: Request) {
	try {
		await requireAuth(request);
		const body = (await request.json()) as GalleryAlbumInput;
		const validationError = validateGalleryAlbumInput(body);
		if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
		return NextResponse.json(await createGalleryAlbum(body), { status: 201 });
	} catch (error) {
		return errorResponse(error, "Failed to create gallery album");
	}
}
