import { getEnv } from "@/lib/cloudflare";

async function getDB(): Promise<D1Database> {
	const { DB } = await getEnv();
	if (!DB) throw new Error("DB binding not available");
	return DB;
}

export type Subscriber = {
	id: number;
	email: string;
	created_at: number;
};

export async function createSubscriber(data: { email: string }): Promise<Subscriber> {
	const db = await getDB();
	const now = Date.now();
	const { meta } = await db
		.prepare(
			`INSERT INTO subscribers (email, created_at)
			 VALUES (?, ?)`
		)
		.bind(data.email, now)
		.run();
	return { id: meta.last_row_id as number, email: data.email, created_at: now };
}

export async function listSubscribers(): Promise<Subscriber[]> {
	try {
		const db = await getDB();
		const { results } = await db
			.prepare("SELECT * FROM subscribers ORDER BY created_at DESC")
			.all();
		return (results || []).map((row) => ({
			id: row.id as number,
			email: row.email as string,
			created_at: row.created_at as number,
		}));
	} catch {
		return [];
	}
}
