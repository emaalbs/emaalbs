import { requireAuth } from "@/lib/auth";
import { getEnv } from "@/lib/cloudflare";
import { getBookingConfig } from "@/lib/bookings";
import { validateBookingConfig, BookingError } from "@/lib/booking-config";
import { bookingBody, bookingFailure, bookingJson, requireSameOrigin } from "@/lib/booking-http";
type Context = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Context) {
	try {
		await requireAuth(request);
		return bookingJson(await getBookingConfig((await params).slug));
	} catch (error) { return bookingFailure(error); }
}
export async function PUT(request: Request, { params }: Context) {
	try {
		await requireAuth(request);
		requireSameOrigin(request);
		const { slug } = await params;
		const config = validateBookingConfig(await bookingBody(request));
		const { DB } = await getEnv();
		const env = await getEnv() as {PAYMENT_PROVIDER?: string};
		if (config.enabled && env.PAYMENT_PROVIDER === "tabadul") {
			if (config.currency !== "IQD") throw new BookingError("gateway_currency_unavailable");
		}
		if (!await DB.prepare("SELECT slug FROM ibs_editions WHERE slug = ?").bind(slug).first()) throw new BookingError("edition_not_found", 404);
		await DB.prepare("INSERT INTO ibs_booking_settings(edition_slug,config_json,updated_at) VALUES(?,?,?) ON CONFLICT(edition_slug) DO UPDATE SET config_json=excluded.config_json, updated_at=excluded.updated_at").bind(slug, JSON.stringify(config), Date.now()).run();
		return bookingJson(config);
	} catch (error) { return bookingFailure(error); }
}
