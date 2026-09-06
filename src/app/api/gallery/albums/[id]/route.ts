import { NextResponse } from "next/server";
import type { GalleryAlbumInput } from "@/data/gallery";
import { requireAuth } from "@/lib/auth";
import { deleteGalleryAlbum, getGalleryAlbumById, updateGalleryAlbum } from "@/lib/db/gallery";
import { validateGalleryAlbumInput } from "@/lib/gallery-validation";

type Params = { params: Promise<{ id: string }> };

function parseId(value: string): number | null {
	const id = Number(value);
	return Number.isInteger(id) && id > 0 ? id : null;
}

function errorResponse(error: unknown, fallback: string) {
	const message = error instanceof Error ? error.message : fallback;
	const status = message.includes("UNIQUE") ? 409 : message.includes("FOREIGN KEY") ? 400 : message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
	const safeMessage = message.includes("UNIQUE") ? "This album slug is already in use" : message.includes("FOREIGN KEY") ? "Choose an existing category" : message;
	return NextResponse.json({ error: safeMessage }, { status });
}

export async function GET(request: Request, { params }: Params) {
	try {
		await requireAuth(request);
		const id = parseId((await params).id);
		if (!id) return NextResponse.json({ error: "Invalid album id" }, { status: 400 });
		const album = await getGalleryAlbumById(id);
		return album ? NextResponse.json(album) : NextResponse.json({ error: "Album not found" }, { status: 404 });
	} catch (error) {
		return errorResponse(error, "Failed to fetch gallery album");
	}
}

export async function PUT(request: Request, { params }: Params) {
	try {
		await requireAuth(request);
		const id = parseId((await params).id);
		if (!id) return NextResponse.json({ error: "Invalid album id" }, { status: 400 });
		const body = (await request.json()) as GalleryAlbumInput;
		const validationError = validateGalleryAlbumInput(body);
		if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
		await updateGalleryAlbum(id, body);
		return NextResponse.json({ success: true });
	} catch (error) {
		return errorResponse(error, "Failed to update gallery album");
	}
}

export async function DELETE(request: Request, { params }: Params) {
	try {
		await requireAuth(request);
		const id = parseId((await params).id);
		if (!id) return NextResponse.json({ error: "Invalid album id" }, { status: 400 });
		await deleteGalleryAlbum(id);
		return NextResponse.json({ success: true });
	} catch (error) {
		return errorResponse(error, "Failed to delete gallery album");
	}
}
