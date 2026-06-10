import { NextResponse } from "next/server";
import { getBlogBySlug, updateBlog, deleteBlog } from "@/lib/db/blogs";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	try {
		const { slug } = await params;
		const blog = await getBlogBySlug(slug);
		if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
		return NextResponse.json(blog);
	} catch (err) {
		return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
	}
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	try {
		await requireAuth(request);
		const { slug } = await params;
		const body = (await request.json()) as Parameters<typeof updateBlog>[1];
		await updateBlog(slug, body);
		return NextResponse.json({ success: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to update blog";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	try {
		await requireAuth(request);
		const { slug } = await params;
		await deleteBlog(slug);
		return NextResponse.json({ success: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to delete blog";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
