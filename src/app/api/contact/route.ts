import { NextResponse } from "next/server";
import { createContact, listContacts } from "@/lib/db/contacts";
import { requireAuth } from "@/lib/auth";
import { isContactEmail } from "@/lib/contact-email-config";
import { notifyContactSafely } from "@/lib/contact-email";
import { getCloudflareContext } from "@opennextjs/cloudflare";

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

		if (typeof name !== "string" || !name.trim() || name.length > 200 || typeof email !== "string" || !isContactEmail(email.trim()) || typeof message !== "string" || !message.trim() || message.length > 10000 ||
			[phone,company,subject].some(v=>v !== undefined && (typeof v !== "string" || v.length > 200))) {
			return NextResponse.json(
				{ error: "Name, email, and message are required" },
				{ status: 400 }
			);
		}

		const contact = await createContact({ name:name.trim(), email:email.trim(), phone, company, message:message.trim(), subject });
		// Saving the inquiry succeeds even if the email provider is unavailable.
		const notification = notifyContactSafely(contact);
		try {
			const { ctx } = await getCloudflareContext({async:true});
			if (ctx?.waitUntil) ctx.waitUntil(notification);
			else await notification;
		} catch { await notification; }
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
