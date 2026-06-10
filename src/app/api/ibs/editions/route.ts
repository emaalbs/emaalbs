import { NextResponse } from "next/server";
import { listEditions, createEdition } from "@/lib/db/ibs";
import { requireAuth } from "@/lib/auth";

export async function GET() {
	try {
		const editions = await listEditions();
		return NextResponse.json(editions);
	} catch (err) {
		return NextResponse.json({ error: "Failed to fetch editions" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		await requireAuth(request);
		const body = (await request.json()) as import("@/data/ibs/types").IbsEdition;
		await createEdition(body);
		return NextResponse.json({ success: true }, { status: 201 });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to create edition";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
