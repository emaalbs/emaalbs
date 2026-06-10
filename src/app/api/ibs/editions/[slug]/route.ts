import { NextResponse } from "next/server";
import { getEditionBySlug, deleteEdition, replaceEditionNested } from "@/lib/db/ibs";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	try {
		const { slug } = await params;
		const edition = await getEditionBySlug(slug);
		if (!edition) return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json(edition);
	} catch (err) {
		return NextResponse.json({ error: "Failed to fetch edition" }, { status: 500 });
	}
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	try {
		await requireAuth(request);
		const { slug } = await params;
		const body = (await request.json()) as import("@/data/ibs/types").IbsEdition;
		await replaceEditionNested(slug, body);
		return NextResponse.json({ success: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to update edition";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	try {
		await requireAuth(request);
		const { slug } = await params;
		await deleteEdition(slug);
		return NextResponse.json({ success: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to delete edition";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
