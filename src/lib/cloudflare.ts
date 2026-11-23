import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getEnv() {
	const { env } = await getCloudflareContext({ async: true });
	const bindings = env as unknown as {
		DB: D1Database;
		MEDIA: R2Bucket;
		AI: Ai;
		ADMIN_SECRET: string;
		ADMIN_SESSION_SECRET?: string;
		CONTACT_EMAIL?: import("@/lib/contact-email").ContactEmailBinding;
		RESEND_API_KEY?: string;
		CONTACT_AUTO_REPLY_ENABLED?: string;
		CONTACT_AUTO_REPLY_FROM?: string;
		CONTACT_AUTO_REPLY_REPLY_TO?: string;
	};
	// Keep existing server callers compatible while moving the signing key out
	// of tracked plain-text config. The local fallback is intentionally retained.
	return { ...bindings, ADMIN_SECRET: bindings.ADMIN_SESSION_SECRET || bindings.ADMIN_SECRET };
}
