// One host-only capability cookie per booking. Never put the capability in a URL.
export function bookingCookieName(id: string) { return `ibs-booking-${id}`; }
export function guestBookingCookie(id: string, request: Request) {
	if (!/^[a-f0-9-]{36}$/.test(id)) return "";
	return request.headers.get("cookie")?.split(";").map(v => v.trim()).find(v => v.startsWith(bookingCookieName(id) + "="))?.slice(bookingCookieName(id).length + 1) || "";
}
export function withGuestBookingAccess(response: Response, id: string, token: string, request: Request) {
	if (!/^[a-f0-9-]{36}$/.test(id) || !/^[a-f0-9]{64}$/.test(token)) throw new Error("Invalid booking capability");
	response.headers.append("Set-Cookie", `${bookingCookieName(id)}=${token}; Path=/api/bookings/${id}; HttpOnly; SameSite=Lax; Max-Age=2592000${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`);
	return response;
}
