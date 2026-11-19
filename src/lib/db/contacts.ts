import { getEnv } from "@/lib/cloudflare";
import type { ContactEmailDelivery } from "@/lib/contact-email-config";

async function getDB(): Promise<D1Database> {
	const { DB } = await getEnv();
	if (!DB) throw new Error("DB binding not available");
	return DB;
}

export type Contact = {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	company: string | null;
	message: string;
	subject: string;
	created_at: number;
	email_notifications?: ContactEmailDelivery[];
};

export async function createContact(data: {
	name: string;
	email: string;
	phone?: string;
	company?: string;
	message: string;
	subject?: string;
}): Promise<Contact> {
	const db = await getDB();
	const now = Date.now();
	const { meta } = await db
		.prepare(
			`INSERT INTO contacts (name, email, phone, company, message, subject, created_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`
		)
		.bind(
			data.name,
			data.email,
			data.phone ?? null,
			data.company ?? null,
			data.message,
			data.subject ?? "other",
			now
		)
		.run();
	return { id: meta.last_row_id as number, ...data, phone: data.phone ?? null, company: data.company ?? null, subject: data.subject ?? "other", created_at: now } as Contact;
}

export async function listContacts(): Promise<Contact[]> {
	try {
		const db = await getDB();
		const { results } = await db
			.prepare("SELECT * FROM contacts ORDER BY created_at DESC")
			.all();
		const deliveries = await db.prepare("SELECT contact_id,recipient,status,error_code FROM contact_email_deliveries WHERE contact_id IS NOT NULL ORDER BY id").all<ContactEmailDelivery & {contact_id:number}>();
		const notifications = new Map<number,ContactEmailDelivery[]>();
		for (const d of deliveries.results || []) notifications.set(d.contact_id,[...(notifications.get(d.contact_id)||[]),{recipient:d.recipient,status:d.status,error_code:d.error_code}]);
		return (results || []).map((row) => ({
			id: row.id as number,
			name: row.name as string,
			email: row.email as string,
			phone: (row.phone as string) || null,
			company: (row.company as string) || null,
			message: row.message as string,
			subject: row.subject as string,
			created_at: row.created_at as number,
			email_notifications: notifications.get(row.id as number) || [],
		}));
	} catch {
		return [];
	}
}
