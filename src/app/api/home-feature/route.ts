import { NextResponse } from "next/server";
import type { HomeFeatureInput } from "@/data/home-feature";
import { requireAuth } from "@/lib/auth";
import { getHomeFeature, updateHomeFeature } from "@/lib/db/home-feature";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	try {
		await requireAuth(request);
		return NextResponse.json(await getHomeFeature());
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unable to load homepage feature";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}

function isValidHref(value: string): boolean {
	const href = value.trim();
	if (href.startsWith("/") || href.startsWith("#")) return true;
	try {
		return ["http:", "https:"].includes(new URL(href).protocol);
	} catch {
		return false;
	}
}

export async function PUT(request: Request) {
	try {
		await requireAuth(request);
		const body = (await request.json()) as HomeFeatureInput;
		if (!body.kicker?.en?.trim() || !body.kicker?.ar?.trim() || !body.title?.en?.trim() || !body.title?.ar?.trim()) {
			return NextResponse.json({ error: "The kicker and title are required in both languages" }, { status: 400 });
		}
		if (!body.description?.en?.trim() || !body.description?.ar?.trim() || !body.buttonLabel?.en?.trim() || !body.buttonLabel?.ar?.trim()) {
			return NextResponse.json({ error: "The description and button label are required in both languages" }, { status: 400 });
		}
		if (!isValidHref(body.buttonHref?.en || "") || !isValidHref(body.buttonHref?.ar || "")) {
			return NextResponse.json({ error: "Enter a valid destination for both languages" }, { status: 400 });
		}
		if (!body.imageUrl?.trim()) {
			return NextResponse.json({ error: "A feature image is required" }, { status: 400 });
		}
		return NextResponse.json(await updateHomeFeature(body));
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unable to save homepage feature";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
