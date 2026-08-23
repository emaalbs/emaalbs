import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getHeroCarouselSettings, updateHeroCarouselSettings } from "@/lib/db/hero-slides";

export async function GET(request: Request) {
	try {
		await requireAuth(request);
		return NextResponse.json(await getHeroCarouselSettings());
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to fetch carousel settings";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}

export async function PUT(request: Request) {
	try {
		await requireAuth(request);
		const body = (await request.json()) as { autoplayDelayMs?: number };
		const autoplayDelayMs = Number(body.autoplayDelayMs);
		if (!Number.isInteger(autoplayDelayMs) || autoplayDelayMs < 2000 || autoplayDelayMs > 60000) {
			return NextResponse.json({ error: "Autoplay delay must be between 2 and 60 seconds" }, { status: 400 });
		}
		await updateHeroCarouselSettings(autoplayDelayMs);
		return NextResponse.json({ autoplayDelayMs });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to update carousel settings";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
