// Single seam between the IBS UI and its data source.
// Today: returns mock data from `editions.ts`.
// Later: replace these implementations with D1 queries (see docs/ibs-backend.md).

import { editions } from "./editions";
import type { IbsEdition } from "./types";

export { ibsOverview } from "./overview";
export type { IbsEdition } from "./types";

export async function getEditions(): Promise<IbsEdition[]> {
	return editions;
}

export async function getEditionBySlug(
	slug: string,
): Promise<IbsEdition | undefined> {
	return editions.find((e) => e.slug === slug);
}

// Sync version for client components / static metadata builds where awaiting
// is awkward. Kept tiny on purpose — when D1 lands, callers must move to async.
export function getEditionsSync(): IbsEdition[] {
	return editions;
}
