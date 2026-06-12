import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getPresignedUploadUrl } from "@/lib/r2-presign";

export async function POST(request: Request) {
	try {
		await requireAuth(request);
		const body = (await request.json()) as {
			fileName?: string;
			contentType?: string;
			prefix?: string;
		};

		const { fileName = "file", contentType = "application/octet-stream", prefix = "" } = body;

		const ext = fileName.split(".").pop() || "bin";
		const key = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

		const result = await getPresignedUploadUrl(key, contentType);
		if (!result) {
			return NextResponse.json(
				{ error: "Presigned upload not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY." },
				{ status: 503 },
			);
		}

		return NextResponse.json({ key, presignedUrl: result.url, publicUrl: result.publicUrl });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Presign failed";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
