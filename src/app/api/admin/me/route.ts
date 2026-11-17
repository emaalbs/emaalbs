import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
	try {
		const session = await requireAuth(request);
		return NextResponse.json({
			id: session.userId,
			username: session.username,
			isSuperAdmin: session.isSuperAdmin,
			role: session.role,
		}, { headers: { "Cache-Control": "no-store, private" } });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unauthorized";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 403;
		return NextResponse.json({ error: message }, { status });
	}
}
