import { NextResponse } from "next/server";
import { createContact, listContacts } from "@/lib/db/contacts";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as Record<string, unknown>;
		const { name, email, phone, company, message, subject } = body as {
			name: string;
			email: string;
			phone?: string;
			company?: string;
			message: string;
			subject?: string;
		};

		if (!name || !email || !message) {
			return NextResponse.json(
				{ error: "Name, email, and message are required" },
				{ status: 400 }
			);
		}

		const contact = await createContact({ name, email, phone, company, message, subject });
		return NextResponse.json(contact, { status: 201 });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to save contact";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function GET(request: Request) {
	try {
		await requireAuth(request);
		const contacts = await listContacts();
		return NextResponse.json(contacts);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to fetch contacts";
		const status = message === "Unauthorized" || message === "Invalid session" ? 401 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
