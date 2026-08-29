import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import type { SocialPostInput } from "@/data/social-posts";
import { createSocialPost, listSocialPosts } from "@/lib/db/social-posts";
import { validateSocialPostInput } from "@/lib/social-post-validation";

export async function GET(request: Request) {
	try {
		const includeUnpublished = new URL(request.url).searchParams.get("admin") === "1";
		if (includeUnpublished) await requireAuth(request);
		return NextResponse.json(await listSocialPosts(includeUnpublished));
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to fetch social posts";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}

export async function POST(request: Request) {
	try {
		await requireAuth(request);
		const body = (await request.json()) as SocialPostInput;
		const error = validateSocialPostInput(body);
		if (error) return NextResponse.json({ error }, { status: 400 });
		return NextResponse.json(await createSocialPost(body), { status: 201 });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to create social post";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
