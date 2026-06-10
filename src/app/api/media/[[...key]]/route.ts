import { NextResponse } from "next/server";
import { getEnv } from "@/lib/cloudflare";

export async function GET(request: Request, { params }: { params: Promise<{ key?: string[] }> }) {
	try {
		const { key } = await params;
		const objectKey = key?.join("/") || "";
		const { MEDIA: bucket } = await getEnv();
		if (!bucket) {
			return NextResponse.json({ error: "R2 bucket unavailable" }, { status: 500 });
		}

		const obj = await bucket.get(objectKey);
		if (!obj) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		const headers = new Headers();
		headers.set("Content-Type", obj.httpMetadata?.contentType || "application/octet-stream");
		headers.set("Cache-Control", "public, max-age=31536000");
		return new NextResponse(obj.body as unknown as ReadableStream, { headers });
	} catch (err) {
		return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
	}
}
