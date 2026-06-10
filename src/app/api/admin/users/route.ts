import { NextResponse } from "next/server";
import { requireSuperAdmin, hashPassword } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";

export async function GET(request: Request) {
	try {
		await requireSuperAdmin(request);
		const { DB } = await getEnv();
		if (!DB) {
			return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
		}
		const users = await DB.prepare(
			"SELECT id, username, display_name, is_super_admin, created_at, updated_at FROM admin_users ORDER BY id ASC"
		).all();
		return NextResponse.json(users.results || []);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to fetch users";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : message === "Forbidden" ? 403 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}

export async function POST(request: Request) {
	try {
		await requireSuperAdmin(request);
		const body = (await request.json()) as {
			username?: string;
			password?: string;
			displayName?: string;
			isSuperAdmin?: boolean;
		};

		if (!body.username || !body.password) {
			return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
		}

		const { DB } = await getEnv();
		if (!DB) {
			return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
		}

		// Check for duplicate username
		const existing = await DB.prepare("SELECT id FROM admin_users WHERE username = ?").bind(body.username).first();
		if (existing) {
			return NextResponse.json({ error: "Username already taken" }, { status: 409 });
		}

		const { hash, salt } = await hashPassword(body.password);
		const now = Date.now();

		await DB.prepare(
			"INSERT INTO admin_users (username, password_hash, salt, display_name, is_super_admin, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
		).bind(
			body.username,
			hash,
			salt,
			body.displayName || null,
			body.isSuperAdmin ? 1 : 0,
			now,
			now
		).run();

		return NextResponse.json({ success: true }, { status: 201 });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to create user";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : message === "Forbidden" ? 403 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
