/**
 * Auth utilities: PBKDF2 password hashing, JWT session management.
 * Uses Web Crypto API only (no external deps).
 */

const ITERATIONS = 100_000;
const SALT_LEN = 16;

const enc = new TextEncoder();

function b64Url(data: Uint8Array): string {
	return btoa(String.fromCharCode(...data))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");
}

function fromB64Url(str: string): Uint8Array<ArrayBuffer> {
	const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
	return Uint8Array.from(atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad), (c) => c.charCodeAt(0)) as Uint8Array<ArrayBuffer>;
}

export async function hashPassword(password: string, salt?: Uint8Array): Promise<{ hash: string; salt: string }> {
	const s = (salt || (crypto.getRandomValues(new Uint8Array(SALT_LEN)) as Uint8Array)) as Uint8Array<ArrayBuffer>;
	const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]);
	const derived = await crypto.subtle.deriveBits(
		{ name: "PBKDF2", salt: s, iterations: ITERATIONS, hash: "SHA-256" },
		keyMaterial,
		256,
	);
	return { hash: b64Url(new Uint8Array(derived)), salt: b64Url(s) };
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
	const result = await hashPassword(password, fromB64Url(salt));
	return result.hash === hash;
}

// ---- JWT ----

export interface SessionPayload {
	userId: number;
	username: string;
	isSuperAdmin: boolean;
	exp: number;
}

export async function signSession(payload: Omit<SessionPayload, "exp">, secret: string): Promise<string> {
	const header = b64Url(enc.encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
	const body = b64Url(enc.encode(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })));
	const message = `${header}.${body}`;
	const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
	const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
	return `${message}.${b64Url(sig)}`;
}

export async function verifySession(token: string, secret: string): Promise<SessionPayload | null> {
	const parts = token.split(".");
	if (parts.length !== 3) return null;
	const [header, body, signature] = parts;
	const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
	const valid = await crypto.subtle.verify("HMAC", key, fromB64Url(signature) as Uint8Array<ArrayBuffer>, enc.encode(`${header}.${body}`));
	if (!valid) return null;
	try {
		const payload = JSON.parse(new TextDecoder().decode(fromB64Url(body))) as SessionPayload;
		if (payload.exp < Date.now()) return null;
		return payload;
	} catch {
		return null;
	}
}

// ---- Cookie ----

const COOKIE_NAME = "emmal-session";

export function sessionCookie(value: string, maxAge?: number): string {
	const attrs = [
		"HttpOnly",
		"SameSite=Strict",
		"Path=/",
	];
	if (maxAge) attrs.push(`Max-Age=${maxAge}`);
	return `${COOKIE_NAME}=${value}; ${attrs.join("; ")}`;
}

export function clearSessionCookie(): string {
	return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}

export function parseSessionCookie(header?: string | null): string | null {
	if (!header) return null;
	const match = header.split(";").find((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
	return match ? match.split("=")[1].trim() : null;
}

// ---- Middleware / Route helpers ----

export async function requireAuth(request: Request): Promise<SessionPayload> {
	const cookie = request.headers.get("cookie");
	const token = parseSessionCookie(cookie);
	if (!token) throw new Error("Unauthorized");
	const secret = process.env.ADMIN_SECRET;
	if (!secret) throw new Error("Missing ADMIN_SECRET");
	const session = await verifySession(token, secret);
	if (!session) throw new Error("Invalid session");
	return session;
}

export async function requireSuperAdmin(request: Request): Promise<SessionPayload> {
	const session = await requireAuth(request);
	if (!session.isSuperAdmin) throw new Error("Forbidden");
	return session;
}
