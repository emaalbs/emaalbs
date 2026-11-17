export type AdminRole = "super_admin" | "admin" | "payments";

export function isAdminRole(value: unknown): value is AdminRole {
	return value === "super_admin" || value === "admin" || value === "payments";
}

export function accountRole(row: { is_super_admin: unknown; role: unknown }): AdminRole {
	if (row.is_super_admin === 1) return "super_admin";
	if (row.role === "admin" || row.role === "payments") return row.role;
	// A malformed/missing role must never turn a limited account into a full admin.
	throw new Error("Forbidden");
}

export function adminHome(role: AdminRole) {
	return role === "payments" ? "/admin/payments" : "/admin";
}

export function canAccessAdmin(role: AdminRole, path: string, method = "GET"): boolean {
	if (role === "super_admin") return true;
	if (path === "/admin/users" || path.startsWith("/admin/users/") ||
		path === "/api/admin/users" || path.startsWith("/api/admin/users/")) return false;
	if (role === "admin") return true;
	if (role !== "payments") return false;
	if (method === "GET" || method === "HEAD") {
		return ["/admin/payments", "/admin/bookings", "/api/admin/me", "/api/admin/payments", "/api/admin/bookings"].includes(path) ||
			/^\/api\/admin\/payments\/[a-f0-9-]{36}$/.test(path);
	}
	// Verification only reads an existing gateway order; it never charges or refunds.
	return method === "POST" && (path === "/api/admin/logout" ||
		/^\/api\/admin\/bookings\/[a-f0-9-]{36}\/verify-payment$/.test(path));
}
