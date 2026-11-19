export type ContactEmailSettings = { enabled: boolean; emails: [string, string] };
export type ContactEmailDelivery = { recipient: string; status: string; error_code: string | null };

export function isContactEmail(value: string): boolean {
	return value.length <= 254 && /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(value);
}

export function parseContactEmailSettings(body: unknown): ContactEmailSettings {
	if (!body || typeof body !== "object") throw new Error("Invalid settings");
	const { enabled, emails } = body as Record<string, unknown>;
	if (typeof enabled !== "boolean" || !Array.isArray(emails) || emails.length !== 2 || emails.some(e => typeof e !== "string")) throw new Error("Invalid settings");
	const normalized = emails.map(e => e.trim().toLowerCase()) as [string, string];
	if (normalized.some(e => e && !isContactEmail(e))) throw new Error("Enter a valid email address / أدخل بريدًا إلكترونيًا صحيحًا");
	if (normalized[0] && normalized[0] === normalized[1]) throw new Error("Use two different addresses / أدخل عنوانين مختلفين");
	if (enabled && !normalized.some(Boolean)) throw new Error("Add at least one email before enabling / أضف بريدًا واحدًا على الأقل قبل التفعيل");
	return { enabled, emails: normalized };
}

export function contactEmailError(code: string | null): string {
	if (code === "NOT_CONFIGURED") return "خدمة الإرسال غير مربوطة بعد / Email service is not connected";
	if (code === "E_RECIPIENT_NOT_ALLOWED" || code === "E_RECIPIENT_PLAN_RESTRICTED") return "يحتاج عنوان المستلم إلى التحقق في Cloudflare / Verify this recipient in Cloudflare";
	if (code?.startsWith("E_SENDER_") || code === "E_EMAIL_SENDING_NOT_READY") return "يجب إكمال تفعيل نطاق الإرسال في Cloudflare / Complete sender domain setup in Cloudflare";
	if (code === "TIMEOUT") return "لم يصل تأكيد من خدمة البريد؛ راجع سجل Cloudflare قبل تكرار الإرسال / Provider confirmation timed out";
	if (code === "E_RATE_LIMIT_EXCEEDED" || code === "E_DAILY_LIMIT_EXCEEDED") return "تم بلوغ حد الإرسال لدى خدمة البريد / Email service limit reached";
	return "تعذّر إرسال نسخة البريد؛ الرسالة محفوظة هنا / Email copy failed; contact remains saved";
}
