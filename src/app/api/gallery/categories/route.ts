import { NextResponse } from "next/server";
import type { GalleryCategoryInput } from "@/data/gallery";
import { requireAuth } from "@/lib/auth";
import { createGalleryCategory, listGalleryCategories } from "@/lib/db/gallery";
import { validateGalleryCategoryInput } from "@/lib/gallery-validation";

function errorResponse(error: unknown, fallback: string) {
	const message = error instanceof Error ? error.message : fallback;
	const status = message.includes("UNIQUE") ? 409 : message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
	return NextResponse.json({ error: message.includes("UNIQUE") ? "This category slug is already in use" : message }, { status });
}

export async function GET(request: Request) {
	try {
		const includeUnpublished = new URL(request.url).searchParams.get("admin") === "1";
		if (includeUnpublished) await requireAuth(request);
		return NextResponse.json(await listGalleryCategories(includeUnpublished));
	} catch (error) {
		return errorResponse(error, "Failed to fetch gallery categories");
	}
}

export async function POST(request: Request) {
	try {
		await requireAuth(request);
		const body = (await request.json()) as GalleryCategoryInput;
		const validationError = validateGalleryCategoryInput(body);
		if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
		return NextResponse.json(await createGalleryCategory(body), { status: 201 });
	} catch (error) {
		return errorResponse(error, "Failed to create gallery category");
	}
}
