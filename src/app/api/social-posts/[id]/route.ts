import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import type { SocialPostInput } from "@/data/social-posts";
import { deleteSocialPost, getSocialPostById, updateSocialPost } from "@/lib/db/social-posts";
import { validateSocialPostInput } from "@/lib/social-post-validation";

type Context = { params: Promise<{ id: string }> };

function parseId(value: string): number | null {
	const id = Number(value);
	return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(request: Request, { params }: Context) {
	try {
		await requireAuth(request);
		const id = parseId((await params).id);
		if (!id) return NextResponse.json({ error: "Invalid social post id" }, { status: 400 });
		const post = await getSocialPostById(id);
		if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json(post);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to fetch social post";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}

export async function PUT(request: Request, { params }: Context) {
	try {
		await requireAuth(request);
		const id = parseId((await params).id);
		if (!id) return NextResponse.json({ error: "Invalid social post id" }, { status: 400 });
		const body = (await request.json()) as SocialPostInput;
		const error = validateSocialPostInput(body);
		if (error) return NextResponse.json({ error }, { status: 400 });
		await updateSocialPost(id, body);
		return NextResponse.json({ success: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to update social post";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}

export async function DELETE(request: Request, { params }: Context) {
	try {
		await requireAuth(request);
		const id = parseId((await params).id);
		if (!id) return NextResponse.json({ error: "Invalid social post id" }, { status: 400 });
		await deleteSocialPost(id);
		return NextResponse.json({ success: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to delete social post";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
