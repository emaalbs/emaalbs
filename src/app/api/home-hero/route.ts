import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { HomeHeroSettings, LocalizedText } from "@/data/home-hero";
import { requireAuth } from "@/lib/auth";
import { getHomeHero, saveHomeHero } from "@/lib/db/home-hero";

function isLocalizedText(value: unknown): value is LocalizedText {
	if (!value || typeof value !== "object") return false;
	const text = value as Record<string, unknown>;
	return typeof text.en === "string" && text.en.trim().length > 0
		&& typeof text.ar === "string" && text.ar.trim().length > 0;
}

function isValidHref(value: unknown): value is string {
	if (typeof value !== "string" || value.trim().length === 0) return false;
	return (value.startsWith("/") && !value.startsWith("//")) || value.startsWith("https://") || value.startsWith("http://");
}

function validateSettings(value: unknown): value is HomeHeroSettings {
	if (!value || typeof value !== "object") return false;
	const data = value as Partial<HomeHeroSettings>;
	if (!Number.isInteger(data.slideIntervalMs) || data.slideIntervalMs! < 2000 || data.slideIntervalMs! > 15000) return false;
	if (!Array.isArray(data.slides) || data.slides.length < 1 || data.slides.length > 20) return false;
	const validSlides = data.slides.every((slide) => (
		slide
		&& typeof slide.id === "string"
		&& slide.id.length > 0
		&& typeof slide.imageUrl === "string"
		&& isValidHref(slide.imageUrl)
		&& isLocalizedText(slide.alt)
		&& isLocalizedText(slide.overline)
		&& isLocalizedText(slide.titleLine1)
		&& isLocalizedText(slide.titleLine2)
		&& isLocalizedText(slide.description)
		&& isLocalizedText(slide.primaryCtaLabel)
		&& isValidHref(slide.primaryCtaHref)
		&& isLocalizedText(slide.secondaryCtaLabel)
		&& isValidHref(slide.secondaryCtaHref)
	));
	return validSlides && new Set(data.slides.map((slide) => slide.id)).size === data.slides.length;
}

export async function GET() {
	return NextResponse.json(await getHomeHero());
}

export async function PUT(request: Request) {
	try {
		await requireAuth(request);
		const body: unknown = await request.json();
		if (!validateSettings(body)) {
			return NextResponse.json(
				{ error: "Complete all English and Arabic fields, use valid links, and add between 1 and 20 images." },
				{ status: 400 },
			);
		}
		await saveHomeHero(body);
		revalidatePath("/en");
		revalidatePath("/ar");
		return NextResponse.json(body);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Failed to update homepage hero";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
