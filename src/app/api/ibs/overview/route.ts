import { NextResponse } from "next/server";
import { getOverviewBlocks, setOverviewBlock } from "@/lib/db/ibs";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const locale = searchParams.get("locale") || "en";
		const blocks = await getOverviewBlocks(locale);
		return NextResponse.json(blocks);
	} catch (err) {
		return NextResponse.json({ error: "Failed to fetch overview" }, { status: 500 });
	}
}

export async function PUT(request: Request) {
	try {
		await requireAuth(request);
		const body = (await request.json()) as { block: string; locale: string; payload: unknown };
		await setOverviewBlock(body.block, body.locale, body.payload);
		return NextResponse.json({ success: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to update overview";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
