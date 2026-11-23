import { getEnv } from "@/lib/cloudflare";
import { isContactEmail } from "@/lib/contact-email-config";
import type { Contact } from "@/lib/db/contacts";

export const CONTACT_AUTO_REPLY_TEXT = "Thank you for reaching out to EMAAL Group!\n\nWe appreciate your interest. Please let us know how we can assist you, or feel free to call us directly for further inquiries.\n\nOur team will get back to you as soon as possible.";

export function buildContactAutoReply(recipient: string, sender: string, replyTo?: string) {
 if (!isContactEmail(recipient) || !isContactEmail(sender) || (replyTo && !isContactEmail(replyTo))) throw new Error("Invalid email address");
 return {
  from: `EMAAL Group <${sender}>`, to: [recipient],
  ...(replyTo ? { reply_to: replyTo } : {}),
  subject: "Thank you for reaching out to EMAAL Group!",
  text: CONTACT_AUTO_REPLY_TEXT,
  // Fixed content only: never echo visitor-supplied links or HTML to another inbox.
  html: `<div lang="en" dir="ltr" style="background:#f4f6f7;padding:24px;font-family:Arial,sans-serif;color:#00384b"><div style="max-width:600px;margin:auto;background:#fff;border-radius:16px;overflow:hidden"><div style="background:#00384b;padding:24px;color:#eec13b;font-size:24px;font-weight:bold">EMAAL Group</div><div style="padding:28px;font-size:16px;line-height:1.8">${CONTACT_AUTO_REPLY_TEXT.split("\n\n").map(p=>`<p style="margin:0 0 20px">${p}</p>`).join("")}</div></div></div>`,
  headers: { "Auto-Submitted": "auto-replied", "X-Auto-Response-Suppress": "All" },
 };
}

export async function sendContactAutoReply(contact: Contact) {
 const env = await getEnv();
 // Explicit opt-in; local previews must never send real visitor email.
 if (process.env.NODE_ENV !== "production" || env.CONTACT_AUTO_REPLY_ENABLED !== "true") return;
 const sender = env.CONTACT_AUTO_REPLY_FROM || "";
 if (!env.RESEND_API_KEY || !isContactEmail(sender)) throw new Error("Contact auto-reply service is not configured");
 const recipient = contact.email.trim().toLowerCase();
 const message = buildContactAutoReply(recipient, sender, env.CONTACT_AUTO_REPLY_REPLY_TO);
 const now = Date.now();
 // Claim atomically: once per saved contact, with a short recipient cooldown
 // for repeat form submissions. No automatic resend after an uncertain result.
 const claim = await env.DB.prepare(`INSERT OR IGNORE INTO contact_auto_replies
  (contact_id,recipient,status,created_at,updated_at)
  SELECT ?,?,'pending',?,? WHERE NOT EXISTS
  (SELECT 1 FROM contact_auto_replies WHERE recipient=? AND created_at>?)`)
  .bind(contact.id,recipient,now,now,recipient,now-15*60*1000).run();
 if (!claim.meta.changes) return;
 let status = "unconfirmed", errorCode: string | null = "PROVIDER_UNCONFIRMED", providerId: string | null = null;
 try {
  const response = await fetch("https://api.resend.com/emails", {
   method: "POST", signal: AbortSignal.timeout(10000),
   headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `emaal-contact-reply-v1/${contact.id}` },
   body: JSON.stringify(message),
  });
  if (response.ok) {
   const body = await response.json() as {id?: string};
   if (typeof body.id === "string" && body.id) { status = "accepted"; errorCode = null; providerId = body.id; }
  } else if (response.status >= 400 && response.status < 500) {
   status = "failed"; errorCode = response.status === 429 ? "RATE_LIMITED" : "PROVIDER_REJECTED";
  }
 } catch { /* Network errors and timeouts do not prove non-delivery. */ }
 await env.DB.prepare("UPDATE contact_auto_replies SET status=?,error_code=?,provider_id=?,updated_at=? WHERE contact_id=?")
  .bind(status,errorCode,providerId,Date.now(),contact.id).run();
}

export async function replyToContactSafely(contact: Contact) {
 try { await sendContactAutoReply(contact); }
 catch { console.error("Contact auto-reply unavailable", {contactId:contact.id}); }
}
