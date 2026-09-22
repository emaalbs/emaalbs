import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { resolveSocialPostUrl, SocialUrlResolutionError } from "@/lib/social-url-resolver";

export async function POST(request: Request) {
	try {
		await requireAuth(request);
		const body = (await request.json()) as { url?: string };
		const originalUrl = body.url?.trim() || "";
		const resolvedUrl = await resolveSocialPostUrl(originalUrl);
		return NextResponse.json({ originalUrl, resolvedUrl, changed: originalUrl !== resolvedUrl });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unable to resolve social media link";
		const unauthorized = message === "Unauthorized" || message === "Invalid session";
		return NextResponse.json({ error: message }, { status: unauthorized ? 401 : error instanceof SocialUrlResolutionError ? 400 : 500 });
	}
}
