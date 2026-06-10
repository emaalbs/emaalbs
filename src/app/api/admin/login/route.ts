import { NextResponse } from "next/server";
import { hashPassword, verifyPassword, signSession, sessionCookie } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";

export async function POST(request: Request) {
	try {
		const { username, password } = (await request.json()) as { username?: string; password?: string };
		if (!username || !password) {
			return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
		}

		const { DB, ADMIN_SECRET } = await getEnv();
		if (!DB) {
			return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
		}

		const user = await DB.prepare("SELECT id, username, password_hash, salt, is_super_admin FROM admin_users WHERE username = ?").bind(username).first();
		if (!user) {
			return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
		}

		const valid = await verifyPassword(password, user.password_hash as string, user.salt as string);
		if (!valid) {
			return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
		}

		if (!ADMIN_SECRET) {
			return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
		}

		const token = await signSession({ userId: user.id as number, username, isSuperAdmin: (user.is_super_admin as number) === 1 }, ADMIN_SECRET);
		const response = NextResponse.json({ success: true });
		response.headers.set("Set-Cookie", sessionCookie(token, 24 * 60 * 60));
		return response;
	} catch (err) {
		return NextResponse.json({ error: "Login failed" }, { status: 500 });
	}
}
