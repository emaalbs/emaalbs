import { NextResponse } from "next/server";
import type { GalleryCategoryInput } from "@/data/gallery";
import { requireAuth } from "@/lib/auth";
import { deleteGalleryCategory, getGalleryCategoryById, updateGalleryCategory } from "@/lib/db/gallery";
import { validateGalleryCategoryInput } from "@/lib/gallery-validation";

type Params = { params: Promise<{ id: string }> };

function parseId(value: string): number | null {
	const id = Number(value);
	return Number.isInteger(id) && id > 0 ? id : null;
}

function errorResponse(error: unknown, fallback: string) {
	const message = error instanceof Error ? error.message : fallback;
	const status = message.includes("UNIQUE") ? 409 : message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
	return NextResponse.json({ error: message.includes("UNIQUE") ? "This category slug is already in use" : message }, { status });
}

export async function GET(request: Request, { params }: Params) {
	try {
		await requireAuth(request);
		const id = parseId((await params).id);
		if (!id) return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
		const category = await getGalleryCategoryById(id);
		return category ? NextResponse.json(category) : NextResponse.json({ error: "Category not found" }, { status: 404 });
	} catch (error) {
		return errorResponse(error, "Failed to fetch gallery category");
	}
}

export async function PUT(request: Request, { params }: Params) {
	try {
		await requireAuth(request);
		const id = parseId((await params).id);
		if (!id) return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
		const body = (await request.json()) as GalleryCategoryInput;
		const validationError = validateGalleryCategoryInput(body);
		if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
		await updateGalleryCategory(id, body);
		return NextResponse.json({ success: true });
	} catch (error) {
		return errorResponse(error, "Failed to update gallery category");
	}
}

export async function DELETE(request: Request, { params }: Params) {
	try {
		await requireAuth(request);
		const id = parseId((await params).id);
		if (!id) return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
		await deleteGalleryCategory(id);
		return NextResponse.json({ success: true });
	} catch (error) {
		return errorResponse(error, "Failed to delete gallery category");
	}
}
