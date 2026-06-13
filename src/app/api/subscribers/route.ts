import { NextResponse } from "next/server";
import { createSubscriber, listSubscribers } from "@/lib/db/subscribers";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as Record<string, unknown>;
		const { email } = body as { email: string };

		if (!email || typeof email !== "string") {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400 }
			);
		}

		const subscriber = await createSubscriber({ email: email.trim().toLowerCase() });
		return NextResponse.json(subscriber, { status: 201 });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to save subscriber";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function GET(request: Request) {
	try {
		await requireAuth(request);
		const subscribers = await listSubscribers();
		return NextResponse.json(subscribers);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to fetch subscribers";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
