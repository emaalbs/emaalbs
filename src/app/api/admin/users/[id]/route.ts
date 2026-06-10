import { NextResponse } from "next/server";
import { requireSuperAdmin, hashPassword } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await requireSuperAdmin(request);
		const { id } = await params;
		const userId = parseInt(id, 10);
		if (Number.isNaN(userId)) {
			return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
		}

		const body = (await request.json()) as {
			username?: string;
			password?: string;
			displayName?: string | null;
			isSuperAdmin?: boolean;
		};

		const { DB } = await getEnv();
		if (!DB) {
			return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
		}

		// Check user exists
		const user = await DB.prepare("SELECT id FROM admin_users WHERE id = ?").bind(userId).first();
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Check duplicate username
		if (body.username) {
			const dup = await DB.prepare("SELECT id FROM admin_users WHERE username = ? AND id != ?").bind(body.username, userId).first();
			if (dup) {
				return NextResponse.json({ error: "Username already taken" }, { status: 409 });
			}
		}

		// Prevent self-demotion of last super admin
		if (body.isSuperAdmin === false && userId === session.userId) {
			const count = await DB.prepare("SELECT COUNT(*) as count FROM admin_users WHERE is_super_admin = 1").first();
			if ((count?.count as number) <= 1) {
				return NextResponse.json({ error: "Cannot demote the last super admin" }, { status: 403 });
			}
		}

		const updates: string[] = [];
		const values: unknown[] = [];

		if (body.username !== undefined) {
			updates.push("username = ?");
			values.push(body.username);
		}
		if (body.displayName !== undefined) {
			updates.push("display_name = ?");
			values.push(body.displayName);
		}
		if (body.password) {
			const { hash, salt } = await hashPassword(body.password);
			updates.push("password_hash = ?");
			values.push(hash);
			updates.push("salt = ?");
			values.push(salt);
		}
		if (body.isSuperAdmin !== undefined) {
			updates.push("is_super_admin = ?");
			values.push(body.isSuperAdmin ? 1 : 0);
		}

		if (updates.length === 0) {
			return NextResponse.json({ error: "No fields to update" }, { status: 400 });
		}

		updates.push("updated_at = ?");
		values.push(Date.now());
		values.push(userId);

		await DB.prepare(`UPDATE admin_users SET ${updates.join(", ")} WHERE id = ?`).bind(...values).run();

		return NextResponse.json({ success: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to update user";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : message === "Forbidden" ? 403 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await requireSuperAdmin(request);
		const { id } = await params;
		const userId = parseInt(id, 10);
		if (Number.isNaN(userId)) {
			return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
		}

		if (userId === session.userId) {
			return NextResponse.json({ error: "Cannot delete yourself" }, { status: 403 });
		}

		const { DB } = await getEnv();
		if (!DB) {
			return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
		}

		// Prevent deleting the last super admin
		const target = await DB.prepare("SELECT is_super_admin FROM admin_users WHERE id = ?").bind(userId).first();
		if (!target) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}
		if ((target.is_super_admin as number) === 1) {
			const count = await DB.prepare("SELECT COUNT(*) as count FROM admin_users WHERE is_super_admin = 1").first();
			if ((count?.count as number) <= 1) {
				return NextResponse.json({ error: "Cannot delete the last super admin" }, { status: 403 });
			}
		}

		await DB.prepare("DELETE FROM admin_users WHERE id = ?").bind(userId).run();
		return NextResponse.json({ success: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to delete user";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : message === "Forbidden" ? 403 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
