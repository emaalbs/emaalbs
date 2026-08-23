import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getEnv() {
	const { env } = await getCloudflareContext({ async: true });
	return env as unknown as {
		DB: D1Database;
		MEDIA: R2Bucket;
		AI: Ai;
		ADMIN_SECRET: string;
	};
}
