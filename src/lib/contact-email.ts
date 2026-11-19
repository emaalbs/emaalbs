import { getEnv } from "@/lib/cloudflare";
import type { Contact } from "@/lib/db/contacts";
import { parseContactEmailSettings, type ContactEmailSettings } from "@/lib/contact-email-config";

export const CONTACT_EMAIL_SENDER = "notifications@notify.emaalbs.com";
export type ContactEmailMessage = { from: { email: string; name: string }; to: string; replyTo?: string; subject: string; text: string; html: string };
export type ContactEmailBinding = { send(message: ContactEmailMessage): Promise<{ messageId: string }> };

export async function readContactEmailSettings(): Promise<ContactEmailSettings> {
	const { DB } = await getEnv();
	const row = await DB.prepare("SELECT enabled,email_1,email_2 FROM contact_email_settings WHERE id=1").first<{ enabled: number; email_1: string; email_2: string }>();
	return row ? parseContactEmailSettings({ enabled: row.enabled === 1, emails: [row.email_1,row.email_2] }) : { enabled:false, emails:["",""] };
}

export async function contactEmailServiceAvailable() {
	const env = await getEnv();
	// Local bindings simulate email; never present that as a real delivery.
	return process.env.NODE_ENV === "production" && typeof env.CONTACT_EMAIL?.send === "function";
}

export async function saveContactEmailSettings(settings: ContactEmailSettings) {
	const { DB } = await getEnv();
	await DB.prepare("UPDATE contact_email_settings SET enabled=?,email_1=?,email_2=?,updated_at=? WHERE id=1")
		.bind(settings.enabled ? 1 : 0, settings.emails[0], settings.emails[1], Date.now()).run();
}

function escapeHtml(value: string) {
	return value.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
}

export function buildContactEmail(contact: Contact, recipient: string, test = false): ContactEmailMessage {
	const fields = [
		["Name / الاسم",contact.name], ["Email / البريد",contact.email], ["Phone / الهاتف",contact.phone || "—"],
		["Company / الشركة",contact.company || "—"], ["Subject / الموضوع",contact.subject],
		["Date / التاريخ",new Date(contact.created_at).toISOString()],
	];
	return {
		from:{email:CONTACT_EMAIL_SENDER,name:"EMAAL Business Space"}, to:recipient,
		...(test ? {} : {replyTo:contact.email}),
		subject:test ? "EMAAL — اختبار إشعارات التواصل / Contact email test" : `EMAAL — New contact / رسالة تواصل #${contact.id}`,
		text: fields.map(([k,v])=>`${k}: ${v}`).join("\n")+"\n\n"+contact.message+"\n\nhttps://emaalbs.com/admin/contacts",
		html:`<div style="background:#f4f6f7;padding:24px;font-family:Arial,sans-serif"><div style="max-width:640px;margin:auto;background:#fff;border-radius:16px;overflow:hidden"><div style="background:#00384b;padding:24px;color:#fff"><strong style="font-size:24px;color:#eec13b">EMAAL</strong><p>${test ? "اختبار إشعارات التواصل / Email test" : "رسالة تواصل جديدة / New contact message"}</p></div><div style="padding:24px">${fields.map(([k,v])=>`<p><strong>${k}</strong><br><span dir="auto">${escapeHtml(v)}</span></p>`).join("")}<div dir="auto" style="white-space:pre-wrap;background:#f4f6f7;padding:16px;border-radius:8px">${escapeHtml(contact.message)}</div><p><a href="https://emaalbs.com/admin/contacts" style="color:#007f84">عرض الرسائل في لوحة الإدارة / Open inbox</a></p></div></div></div>`,
	};
}

export async function sendContactEmails(contact: Contact, test = false) {
	const settings = await readContactEmailSettings();
	if (!settings.enabled) return [];
	const env = await getEnv();
	const available = await contactEmailServiceAvailable();
	// Separate sends keep recipient addresses private and isolate individual failures.
	return Promise.all(settings.emails.filter(Boolean).map(async recipient => {
		const now = Date.now();
		const { meta } = await env.DB.prepare("INSERT INTO contact_email_deliveries (contact_id,recipient,status,created_at,updated_at) VALUES (?,?,'pending',?,?)")
			.bind(test ? null : contact.id,recipient,now,now).run();
		let status = "accepted", errorCode: string | null = null, providerId: string | null = null;
		let timer: ReturnType<typeof setTimeout> | undefined;
		try {
			if (!available) throw Object.assign(new Error("Unavailable"),{code:"NOT_CONFIGURED"});
			const result = await Promise.race([
				env.CONTACT_EMAIL!.send(buildContactEmail(contact,recipient,test)),
				new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(Object.assign(new Error("Timed out"),{code:"TIMEOUT"})),10000);}),
			]);
			if (!result?.messageId) throw new Error("Missing provider confirmation");
			providerId = result.messageId;
		} catch (err) {
			const code = (err as {code?: unknown})?.code;
			errorCode = typeof code === "string" && /^(E_[A-Z_]+|NOT_CONFIGURED|TIMEOUT)$/.test(code) ? code : "SEND_FAILED";
			status = errorCode === "TIMEOUT" ? "unconfirmed" : "failed";
		} finally { if (timer) clearTimeout(timer); }
		await env.DB.prepare("UPDATE contact_email_deliveries SET status=?,error_code=?,provider_id=?,updated_at=? WHERE id=?")
			.bind(status,errorCode,providerId,Date.now(),meta.last_row_id).run();
		return {recipient,status,error_code:errorCode};
	}));
}

export async function notifyContactSafely(contact: Contact) {
	try { await sendContactEmails(contact); }
	catch { console.error("Contact notification unavailable", {contactId:contact.id}); }
}
