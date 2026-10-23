import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminSecret, parseSessionCookie, verifySession } from "@/lib/auth";

export const config = {
	matcher: ["/admin/:path*", "/api/:path*", "/ar/ibs/:path*", "/en/ibs/:path*", "/ar/booking/:path*", "/en/booking/:path*", "/ar/receipt/:path*", "/en/receipt/:path*"],
};

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const method = request.method;
	// Keep hosted-payment returns and host-only booking cookies on one origin.
	if (!pathname.startsWith("/api/") && !pathname.startsWith("/admin")) {
		if (request.nextUrl.hostname === "www.emaalbs.com") {
			const url=request.nextUrl.clone(); url.hostname="emaalbs.com"; url.protocol="https:"; url.port="";
			return NextResponse.redirect(url,308);
		}
		return NextResponse.next();
	}
	// This endpoint independently authenticates a server-only cron secret.
	if (method === "POST" && pathname === "/api/internal/payments/reconcile") return NextResponse.next();
	// Public checkout and capability-protected status; webhook verifies its own signature.
	if ((method === "POST" && (["/api/bookings/checkout", "/api/payments/mock", "/api/payments/tabadul-preview", "/api/payments/webhook/bridge"].includes(pathname) || /^\/api\/bookings\/[a-f0-9-]{36}\/verify-payment$/.test(pathname))) ||
		(method === "GET" && (/^\/api\/bookings\/[a-f0-9-]{36}(\/receipt)?$/.test(pathname) || /^\/api\/receipts\/[a-f0-9-]{36}$/.test(pathname)))) {
		return NextResponse.next();
	}

	// Allow public reads on IBS/blog APIs and media serving
	if (pathname === "/api/home" || pathname.startsWith("/api/blogs") || pathname.startsWith("/api/ibs") || pathname.startsWith("/api/media") || pathname.startsWith("/api/magazines") || pathname.startsWith("/api/social-posts") || pathname.startsWith("/api/gallery")) {
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
	const secret = await getAdminSecret();

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
