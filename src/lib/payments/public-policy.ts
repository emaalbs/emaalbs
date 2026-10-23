import { BookingError } from "../booking-config";

export function publicPaymentOrigin(value: string | undefined) {
	if (!value) throw new BookingError("payments_unavailable", 503);
	const url = new URL(value);
	if (url.protocol !== "https:" || url.username || url.password || url.port || url.pathname !== "/" || url.search || url.hash || url.hostname !== "emaalbs.com") throw new BookingError("payments_unavailable", 503);
	return url.origin;
}

export function requirePublicPaymentRequest(request: Request, origin: string) {
	if (new URL(request.url).origin !== origin) throw new BookingError("payment_origin_required", 409);
	if (request.headers.get("X-IBS-Payment-Preview")) throw new BookingError("payments_unavailable", 503);
}
