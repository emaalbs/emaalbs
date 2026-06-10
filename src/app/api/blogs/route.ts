import { NextResponse } from "next/server";
import { listBlogs, createBlog } from "@/lib/db/blogs";
import { requireAuth } from "@/lib/auth";

export async function GET() {
	try {
		const blogs = await listBlogs();
		return NextResponse.json(blogs);
	} catch (err) {
		return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		await requireAuth(request);
		const body = (await request.json()) as Parameters<typeof createBlog>[0];
		const blog = await createBlog(body);
		return NextResponse.json(blog, { status: 201 });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to create blog";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
