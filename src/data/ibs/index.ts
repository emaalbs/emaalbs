// Single seam between the IBS UI and its data source.
// Async functions query D1. Sync version kept for client components.

import { editions } from "./editions";
import type { IbsEdition } from "./types";
import { listEditions, getEditionBySlug as getEditionFromDB } from "@/lib/db/ibs";

export { ibsOverview } from "./overview";
export type { IbsEdition } from "./types";

export async function getEditions(): Promise<IbsEdition[]> {
	try {
		return await listEditions();
	} catch {
		return editions;
	}
}

export async function getEditionBySlug(
	slug: string,
): Promise<IbsEdition | undefined> {
	try {
		return (await getEditionFromDB(slug)) ?? undefined;
	} catch {
		return editions.find((e) => e.slug === slug);
	}
}

// Sync version for client components / static metadata builds where awaiting
// is awkward. Falls back to static mock data.
export function getEditionsSync(): IbsEdition[] {
	return editions;
}
