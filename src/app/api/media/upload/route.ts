import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { requireAuth } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";

export async function POST(request: Request) {
	try {
		await requireAuth(request);
		const { MEDIA: bucket } = await getEnv();
		if (!bucket) {
			return NextResponse.json({ error: "R2 bucket unavailable" }, { status: 500 });
		}

		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		const prefix = (formData.get("prefix") as string) || "";

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		const ext = file.name.split(".").pop() || "bin";
		const key = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
		const result = await uploadToR2(bucket, key, file, file.type);
		return NextResponse.json(result);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Upload failed";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
