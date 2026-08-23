import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import type { HeroSlideInput } from "@/data/hero-slides";
import { createHeroSlide, listHeroSlides } from "@/lib/db/hero-slides";
import { isSafeHref } from "@/lib/safe-href";

function validationError(data: HeroSlideInput): string | null {
	if (!data?.overline?.en?.trim() || !data?.overline?.ar?.trim()) return "Overline is required in both languages";
	if (!data?.titleLine1?.en?.trim() || !data?.titleLine1?.ar?.trim()) return "First title line is required in both languages";
	if (!data?.titleLine2?.en?.trim() || !data?.titleLine2?.ar?.trim()) return "Second title line is required in both languages";
	if (!data?.description?.en?.trim() || !data?.description?.ar?.trim()) return "Description is required in both languages";
	if (!data?.primaryCta?.label?.en?.trim() || !data?.primaryCta?.label?.ar?.trim()) return "Primary button label is required in both languages";
	if (!isSafeHref(data?.primaryCta?.href?.en || "") || !isSafeHref(data?.primaryCta?.href?.ar || "")) return "Primary button link is invalid";
	if (!data?.secondaryCta?.label?.en?.trim() || !data?.secondaryCta?.label?.ar?.trim()) return "Secondary button label is required in both languages";
	if (!isSafeHref(data?.secondaryCta?.href?.en || "") || !isSafeHref(data?.secondaryCta?.href?.ar || "")) return "Secondary button link is invalid";
	if (!data?.imageUrl?.trim()) return "Slide image is required";
	return null;
}

export async function GET(request: Request) {
	try {
		const includeUnpublished = new URL(request.url).searchParams.get("admin") === "1";
		if (includeUnpublished) await requireAuth(request);
		return NextResponse.json(await listHeroSlides(includeUnpublished));
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to fetch hero slides";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}

export async function POST(request: Request) {
	try {
		await requireAuth(request);
		const body = (await request.json()) as HeroSlideInput;
		const error = validationError(body);
		if (error) return NextResponse.json({ error }, { status: 400 });
		return NextResponse.json(await createHeroSlide(body), { status: 201 });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to create hero slide";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
