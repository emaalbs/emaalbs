import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseSessionCookie, verifySession } from "@/lib/auth";

export const config = {
	matcher: ["/admin/:path*", "/api/:path*"],
};

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const method = request.method;

	// Allow public reads on IBS/blog APIs and media serving
	if (pathname.startsWith("/api/blogs") || pathname.startsWith("/api/ibs") || pathname.startsWith("/api/media")) {
		if (method === "GET") {
			return NextResponse.next();
		}
	}

	// Allow login page and endpoint
	if (pathname === "/admin/login" || pathname === "/api/admin/login") {
		return NextResponse.next();
	}

	// Check admin session
	const cookie = request.headers.get("cookie");
	const token = parseSessionCookie(cookie);
	const secret = process.env.ADMIN_SECRET;

	if (!token || !secret) {
		if (pathname.startsWith("/api/")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		return NextResponse.redirect(new URL("/admin/login", request.url));
	}

	const session = await verifySession(token, secret);
	if (!session) {
		if (pathname.startsWith("/api/")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		return NextResponse.redirect(new URL("/admin/login", request.url));
	}

	return NextResponse.next();
}
