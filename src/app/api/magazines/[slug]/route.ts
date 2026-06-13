import { NextResponse } from "next/server";
import { getMagazineBySlug, updateMagazine, deleteMagazine } from "@/lib/db/magazines";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	try {
		const { slug } = await params;
		const magazine = await getMagazineBySlug(slug);
		if (!magazine) return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json(magazine);
	} catch {
		return NextResponse.json({ error: "Failed to fetch magazine" }, { status: 500 });
	}
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	try {
		await requireAuth(request);
		const { slug } = await params;
		const body = (await request.json()) as Parameters<typeof updateMagazine>[1];
		await updateMagazine(slug, body);
		return NextResponse.json({ success: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to update magazine";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	try {
		await requireAuth(request);
		const { slug } = await params;
		await deleteMagazine(slug);
		return NextResponse.json({ success: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to delete magazine";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
