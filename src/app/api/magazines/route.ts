import { NextResponse } from "next/server";
import { listMagazines, createMagazine } from "@/lib/db/magazines";
import { requireAuth } from "@/lib/auth";

export async function GET() {
	try {
		const magazines = await listMagazines();
		return NextResponse.json(magazines);
	} catch {
		return NextResponse.json({ error: "Failed to fetch magazines" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		await requireAuth(request);
		const body = (await request.json()) as Parameters<typeof createMagazine>[0];
		const magazine = await createMagazine(body);
		return NextResponse.json(magazine, { status: 201 });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to create magazine";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
