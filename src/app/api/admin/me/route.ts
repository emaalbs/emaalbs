import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";

export async function GET(request: Request) {
	try {
		const session = await requireAuth(request);
		const { DB } = await getEnv();
		let isSuperAdmin = session.isSuperAdmin;
		if (DB) {
			const row = await DB.prepare("SELECT is_super_admin FROM admin_users WHERE id = ?").bind(session.userId).first();
			if (row) {
				isSuperAdmin = (row.is_super_admin as number) === 1;
			}
		}
		return NextResponse.json({
			id: session.userId,
			username: session.username,
			isSuperAdmin,
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unauthorized";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 403;
		return NextResponse.json({ error: message }, { status });
	}
}
