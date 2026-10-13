import { BookingError } from "./booking-config";

export function bookingJson(value: unknown, status = 200) {
	return Response.json(value, { status, headers: { "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer" } });
}
export function bookingFailure(error: unknown) {
	if (error instanceof BookingError) return bookingJson({ error: error.code }, error.status);
	if (error instanceof Error && ["Unauthorized", "Invalid session"].includes(error.message)) return bookingJson({ error: "unauthorized" }, 401);
	console.error("Booking request failed", error instanceof Error ? error.name : "UnknownError");
	return bookingJson({ error: "service_unavailable" }, 503);
}
export function requireSameOrigin(request: Request) {
	if (request.headers.get("origin") !== new URL(request.url).origin) throw new BookingError("invalid_origin", 403);
}
export async function bookingRawBody(request: Request) {
	if (Number(request.headers.get("content-length")) > 24000) throw new BookingError("request_too_large", 413);
	const reader = request.body?.getReader();
	if (!reader) return "";
	const chunks: Uint8Array[] = [];
	let size = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		size += value.length;
		if (size > 24000) { await reader.cancel(); throw new BookingError("request_too_large", 413); }
		chunks.push(value);
	}
	const bytes = new Uint8Array(size);
	let offset = 0;
	for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
	return new TextDecoder().decode(bytes);
}
export async function bookingBody(request: Request) {
	const raw = await bookingRawBody(request);
	try {
		const value = JSON.parse(raw);
		if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
		return value;
	} catch { throw new BookingError("invalid_json"); }
}
