import type {
	IbsEdition,
	Stat,
	Theme,
	Speaker,
	Sponsor,
	SectorShare,
	Initiative,
	GalleryItem,
	AgendaDay,
	AgendaItem,
	AgendaSpeaker,
	VideoItem,
} from "@/data/ibs/types";
import { getEnv } from "@/lib/cloudflare";

async function getDB(): Promise<D1Database> {
	const { DB } = await getEnv();
	if (!DB) throw new Error("DB binding not available");
	return DB;
}

// --- helpers ---

function localize(en: string | null, ar: string | null) {
	return { en: en || "", ar: ar || "" };
}

export async function listEditions(): Promise<IbsEdition[]> {
	const db = await getDB();
	const { results } = await db.prepare(
		"SELECT slug, year, status, edition_label_en, edition_label_ar, title_en, title_ar, tagline_en, tagline_ar, dates_en, dates_ar, location_en, location_ar, hero_image, sort_order FROM ibs_editions WHERE published = 1 ORDER BY sort_order ASC"
	).all();
	return (results || []).map((r) => ({
		slug: r.slug as string,
		year: r.year as number,
		status: r.status as IbsEdition["status"],
		editionLabel: localize(r.edition_label_en as string | null, r.edition_label_ar as string | null),
		title: localize(r.title_en as string | null, r.title_ar as string | null),
		tagline: localize(r.tagline_en as string | null, r.tagline_ar as string | null),
		summary: { en: "", ar: "" },
		dates: localize(r.dates_en as string | null, r.dates_ar as string | null),
		location: localize(r.location_en as string | null, r.location_ar as string | null),
		heroImage: (r.hero_image as string) || "",
		stats: [],
		themes: [],
		keynoteSpeakers: [],
		sectorShares: [],
		initiatives: [],
		sponsors: [],
		gallery: [],
		videos: [],
	}));
}

export async function getEditionBySlug(slug: string): Promise<IbsEdition | null> {
	const db = await getDB();
	const edition = await db.prepare("SELECT * FROM ibs_editions WHERE slug = ? AND published = 1").bind(slug).first();
	if (!edition) return null;

	const [stats, themes, speakers, sponsors, sectorShares, initiatives, gallery, agendaDays, videos] = await Promise.all([
		db.prepare("SELECT * FROM ibs_stats WHERE edition_slug = ? ORDER BY sort_order ASC").bind(slug).all(),
		db.prepare("SELECT * FROM ibs_themes WHERE edition_slug = ? ORDER BY sort_order ASC").bind(slug).all(),
		db.prepare("SELECT * FROM ibs_speakers WHERE edition_slug = ? ORDER BY sort_order ASC").bind(slug).all(),
		db.prepare("SELECT * FROM ibs_sponsors WHERE edition_slug = ? ORDER BY sort_order ASC").bind(slug).all(),
		db.prepare("SELECT * FROM ibs_sector_shares WHERE edition_slug = ? ORDER BY sort_order ASC").bind(slug).all(),
		db.prepare("SELECT * FROM ibs_initiatives WHERE edition_slug = ?").bind(slug).all(),
		db.prepare("SELECT * FROM ibs_gallery WHERE edition_slug = ? ORDER BY sort_order ASC").bind(slug).all(),
		db.prepare("SELECT * FROM ibs_agenda_days WHERE edition_slug = ? ORDER BY sort_order ASC").bind(slug).all(),
		db.prepare("SELECT * FROM ibs_videos WHERE edition_slug = ? ORDER BY sort_order ASC").bind(slug).all(),
	]);

	const agenda: AgendaDay[] = [];
	for (const day of agendaDays.results || []) {
		const items = await db.prepare("SELECT * FROM ibs_agenda_items WHERE day_id = ? ORDER BY sort_order ASC").bind(day.id).all();
		const dayItems: AgendaItem[] = [];
		for (const item of items.results || []) {
			const spk = await db.prepare("SELECT * FROM ibs_agenda_speakers WHERE item_id = ? ORDER BY sort_order ASC").bind(item.id).all();
			dayItems.push({
				time: item.time as string,
				title: localize(item.title_en as string | null, item.title_ar as string | null),
				description: localize(item.description_en as string | null, item.description_ar as string | null),
				note: localize(item.note_en as string | null, item.note_ar as string | null),
				speakers: (spk.results || []).map((s) => ({
					id: s.id as string,
					name: localize(s.name_en as string | null, s.name_ar as string | null),
					org: localize(s.org_en as string | null, s.org_ar as string | null),
					photo: (s.photo as string) || undefined,
				})) as AgendaSpeaker[],
			});
		}
		agenda.push({
			dateLabel: localize(day.date_label_en as string | null, day.date_label_ar as string | null),
			items: dayItems,
		});
	}

	return {
		slug: edition.slug as string,
		year: edition.year as number,
		editionLabel: localize(edition.edition_label_en as string | null, edition.edition_label_ar as string | null),
		title: localize(edition.title_en as string | null, edition.title_ar as string | null),
		tagline: localize(edition.tagline_en as string | null, edition.tagline_ar as string | null),
		summary: localize(edition.summary_en as string | null, edition.summary_ar as string | null),
		status: edition.status as IbsEdition["status"],
		dates: localize(edition.dates_en as string | null, edition.dates_ar as string | null),
		location: localize(edition.location_en as string | null, edition.location_ar as string | null),
		heroImage: (edition.hero_image as string) || "",
		recapVideo: (edition.recap_video as string) || undefined,
		registrationUrl: (edition.registration_url as string) || undefined,
		nextEditionSlug: (edition.next_edition_slug as string) || undefined,
		stats: (stats.results || []).map((r) => ({ value: r.value as string, label: localize(r.label_en as string | null, r.label_ar as string | null) })) as Stat[],
		themes: (themes.results || []).map((r) => ({ title: localize(r.title_en as string | null, r.title_ar as string | null), description: localize(r.description_en as string | null, r.description_ar as string | null) })) as Theme[],
		keynoteSpeakers: (speakers.results || []).map((r) => ({
			id: r.id as string,
			name: localize(r.name_en as string | null, r.name_ar as string | null),
			title: localize(r.title_en as string | null, r.title_ar as string | null),
			org: localize(r.org_en as string | null, r.org_ar as string | null) || undefined,
			photo: (r.photo as string) || undefined,
		})) as Speaker[],
		sponsors: (sponsors.results || []).map((r) => ({
			id: r.id as string,
			name: r.name as string,
			tier: r.tier as Sponsor["tier"],
			logo: (r.logo as string) || undefined,
			href: (r.href as string) || undefined,
		})) as Sponsor[],
		sectorShares: (sectorShares.results || []).map((r) => ({ sector: localize(r.sector_en as string | null, r.sector_ar as string | null), percent: r.percent as number })) as SectorShare[],
		initiatives: (initiatives.results || []).map((r) => ({
			title: localize(r.title_en as string | null, r.title_ar as string | null),
			description: localize(r.description_en as string | null, r.description_ar as string | null),
			image: (r.image as string) || undefined,
			highlight: localize(r.highlight_en as string | null, r.highlight_ar as string | null) || undefined,
			partners: r.partners_json ? JSON.parse(r.partners_json as string) as string[] : undefined,
		})) as Initiative[],
		gallery: (gallery.results || []).map((r) => ({
			id: r.id as string,
			src: r.src as string,
			alt: localize(r.alt_en as string | null, r.alt_ar as string | null),
			width: (r.width as number) || undefined,
			height: (r.height as number) || undefined,
		})) as GalleryItem[],
		agenda: agenda.length > 0 ? agenda : undefined,
		videos: (videos.results || []).map((r) => ({
			id: r.id as string,
			youtubeUrl: r.youtube_url as string,
			title: localize(r.title_en as string | null, r.title_ar as string | null),
			description: localize(r.description_en as string | null, r.description_ar as string | null),
		})) as VideoItem[],
	};
}

// --- write helpers ---

export async function createEdition(data: IbsEdition): Promise<void> {
	const db = await getDB();
	const now = Date.now();
	await db.prepare(
		`INSERT INTO ibs_editions (slug, year, status, edition_label_en, edition_label_ar, title_en, title_ar, tagline_en, tagline_ar, summary_en, summary_ar, dates_en, dates_ar, location_en, location_ar, hero_image, recap_video, registration_url, next_edition_slug, sort_order, published, created_at, updated_at)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	)
		.bind(
			data.slug, data.year, data.status,
			data.editionLabel.en, data.editionLabel.ar,
			data.title.en, data.title.ar,
			data.tagline.en, data.tagline.ar,
			data.summary.en, data.summary.ar,
			data.dates.en, data.dates.ar,
			data.location.en, data.location.ar,
			data.heroImage, data.recapVideo || null,
			data.registrationUrl || null, data.nextEditionSlug || null,
			0, 1, now, now,
		)
		.run();

	// stats
	for (const s of data.stats) {
		await db.prepare("INSERT INTO ibs_stats (edition_slug, value, label_en, label_ar, sort_order) VALUES (?, ?, ?, ?, ?)")
			.bind(data.slug, s.value, s.label.en, s.label.ar, 0).run();
	}
	// themes
	for (const t of data.themes) {
		await db.prepare("INSERT INTO ibs_themes (edition_slug, title_en, title_ar, description_en, description_ar, sort_order) VALUES (?, ?, ?, ?, ?, ?)")
			.bind(data.slug, t.title.en, t.title.ar, t.description.en, t.description.ar, 0).run();
	}
	// speakers
	for (const s of data.keynoteSpeakers) {
		await db.prepare("INSERT INTO ibs_speakers (id, edition_slug, name_en, name_ar, title_en, title_ar, org_en, org_ar, photo, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
			.bind(s.id, data.slug, s.name.en, s.name.ar, s.title.en, s.title.ar, s.org?.en || null, s.org?.ar || null, s.photo || null, 0).run();
	}
	// sponsors
	for (const s of data.sponsors) {
		await db.prepare("INSERT INTO ibs_sponsors (id, edition_slug, name, tier, logo, href, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)")
			.bind(s.id, data.slug, s.name, s.tier, s.logo || null, s.href || null, 0).run();
	}
	// sector shares
	for (const s of data.sectorShares) {
		await db.prepare("INSERT INTO ibs_sector_shares (edition_slug, sector_en, sector_ar, percent, sort_order) VALUES (?, ?, ?, ?, ?)")
			.bind(data.slug, s.sector.en, s.sector.ar, s.percent, 0).run();
	}
	// initiatives
	for (const i of data.initiatives) {
		await db.prepare("INSERT INTO ibs_initiatives (edition_slug, title_en, title_ar, description_en, description_ar, image, highlight_en, highlight_ar, partners_json, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
			.bind(data.slug, i.title.en, i.title.ar, i.description.en, i.description.ar, i.image || null, i.highlight?.en || null, i.highlight?.ar || null, i.partners ? JSON.stringify(i.partners) : null, 0).run();
	}
	// gallery
	for (const g of data.gallery) {
		await db.prepare("INSERT INTO ibs_gallery (id, edition_slug, src, alt_en, alt_ar, width, height, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
			.bind(g.id, data.slug, g.src, g.alt.en, g.alt.ar, g.width || null, g.height || null, 0).run();
	}
	// agenda
	if (data.agenda) {
		for (const day of data.agenda) {
			const dayResult = await db.prepare("INSERT INTO ibs_agenda_days (edition_slug, date_label_en, date_label_ar, sort_order) VALUES (?, ?, ?, ?)")
				.bind(data.slug, day.dateLabel.en, day.dateLabel.ar, 0).run();
			const dayId = dayResult.meta.last_row_id as number;
			for (const item of day.items) {
				const itemResult = await db.prepare("INSERT INTO ibs_agenda_items (day_id, time, title_en, title_ar, description_en, description_ar, note_en, note_ar, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
					.bind(dayId, item.time, item.title.en, item.title.ar, item.description?.en || null, item.description?.ar || null, item.note?.en || null, item.note?.ar || null, 0).run();
				const itemId = itemResult.meta.last_row_id as number;
				for (const sp of item.speakers || []) {
					await db.prepare("INSERT INTO ibs_agenda_speakers (id, item_id, name_en, name_ar, org_en, org_ar, photo, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
						.bind(sp.id, itemId, sp.name.en, sp.name.ar, sp.org?.en || null, sp.org?.ar || null, sp.photo || null, 0).run();
				}
			}
		}
	}
	// videos
	for (const v of data.videos || []) {
		await db.prepare("INSERT INTO ibs_videos (id, edition_slug, youtube_url, title_en, title_ar, description_en, description_ar, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
			.bind(v.id, data.slug, v.youtubeUrl, v.title.en, v.title.ar, v.description.en, v.description.ar, 0).run();
	}
}

export async function updateEdition(slug: string, data: Partial<IbsEdition>): Promise<void> {
	const db = await getDB();
	const sets: string[] = [];
	const values: unknown[] = [];
	if (data.year !== undefined) { sets.push("year = ?"); values.push(data.year); }
	if (data.status !== undefined) { sets.push("status = ?"); values.push(data.status); }
	if (data.editionLabel) { sets.push("edition_label_en = ?", "edition_label_ar = ?"); values.push(data.editionLabel.en, data.editionLabel.ar); }
	if (data.title) { sets.push("title_en = ?", "title_ar = ?"); values.push(data.title.en, data.title.ar); }
	if (data.tagline) { sets.push("tagline_en = ?", "tagline_ar = ?"); values.push(data.tagline.en, data.tagline.ar); }
	if (data.summary) { sets.push("summary_en = ?", "summary_ar = ?"); values.push(data.summary.en, data.summary.ar); }
	if (data.dates) { sets.push("dates_en = ?", "dates_ar = ?"); values.push(data.dates.en, data.dates.ar); }
	if (data.location) { sets.push("location_en = ?", "location_ar = ?"); values.push(data.location.en, data.location.ar); }
	if (data.heroImage !== undefined) { sets.push("hero_image = ?"); values.push(data.heroImage); }
	if (data.recapVideo !== undefined) { sets.push("recap_video = ?"); values.push(data.recapVideo); }
	if (data.registrationUrl !== undefined) { sets.push("registration_url = ?"); values.push(data.registrationUrl); }
	if (data.nextEditionSlug !== undefined) { sets.push("next_edition_slug = ?"); values.push(data.nextEditionSlug); }
	sets.push("updated_at = ?"); values.push(Date.now());
	values.push(slug);
	await db.prepare(`UPDATE ibs_editions SET ${sets.join(", ")} WHERE slug = ?`).bind(...values).run();

	// Note: nested updates (stats, themes, etc.) would require full delete+reinsert or granular updates.
	// For simplicity in the dashboard, we'll do full replacement on save.
}

export async function deleteEdition(slug: string): Promise<void> {
	const db = await getDB();
	await db.prepare("DELETE FROM ibs_editions WHERE slug = ?").bind(slug).run();
}

export async function replaceEditionNested(slug: string, data: IbsEdition): Promise<void> {
	const db = await getDB();
	// Delete all nested rows for this edition
	await Promise.all([
		db.prepare("DELETE FROM ibs_stats WHERE edition_slug = ?").bind(slug).run(),
		db.prepare("DELETE FROM ibs_themes WHERE edition_slug = ?").bind(slug).run(),
		db.prepare("DELETE FROM ibs_speakers WHERE edition_slug = ?").bind(slug).run(),
		db.prepare("DELETE FROM ibs_sponsors WHERE edition_slug = ?").bind(slug).run(),
		db.prepare("DELETE FROM ibs_sector_shares WHERE edition_slug = ?").bind(slug).run(),
		db.prepare("DELETE FROM ibs_initiatives WHERE edition_slug = ?").bind(slug).run(),
		db.prepare("DELETE FROM ibs_gallery WHERE edition_slug = ?").bind(slug).run(),
		db.prepare("DELETE FROM ibs_videos WHERE edition_slug = ?").bind(slug).run(),
		db.prepare("DELETE FROM ibs_agenda_speakers WHERE item_id IN (SELECT id FROM ibs_agenda_items WHERE day_id IN (SELECT id FROM ibs_agenda_days WHERE edition_slug = ?))").bind(slug).run(),
		db.prepare("DELETE FROM ibs_agenda_items WHERE day_id IN (SELECT id FROM ibs_agenda_days WHERE edition_slug = ?)").bind(slug).run(),
		db.prepare("DELETE FROM ibs_agenda_days WHERE edition_slug = ?").bind(slug).run(),
	]);
	// Re-insert using createEdition logic but skip the edition row
	for (const s of data.stats) {
		await db.prepare("INSERT INTO ibs_stats (edition_slug, value, label_en, label_ar, sort_order) VALUES (?, ?, ?, ?, ?)")
			.bind(slug, s.value, s.label.en, s.label.ar, 0).run();
	}
	for (const t of data.themes) {
		await db.prepare("INSERT INTO ibs_themes (edition_slug, title_en, title_ar, description_en, description_ar, sort_order) VALUES (?, ?, ?, ?, ?, ?)")
			.bind(slug, t.title.en, t.title.ar, t.description.en, t.description.ar, 0).run();
	}
	for (const s of data.keynoteSpeakers) {
		await db.prepare("INSERT INTO ibs_speakers (id, edition_slug, name_en, name_ar, title_en, title_ar, org_en, org_ar, photo, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
			.bind(s.id, slug, s.name.en, s.name.ar, s.title.en, s.title.ar, s.org?.en || null, s.org?.ar || null, s.photo || null, 0).run();
	}
	for (const s of data.sponsors) {
		await db.prepare("INSERT INTO ibs_sponsors (id, edition_slug, name, tier, logo, href, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)")
			.bind(s.id, slug, s.name, s.tier, s.logo || null, s.href || null, 0).run();
	}
	for (const s of data.sectorShares) {
		await db.prepare("INSERT INTO ibs_sector_shares (edition_slug, sector_en, sector_ar, percent, sort_order) VALUES (?, ?, ?, ?, ?)")
			.bind(slug, s.sector.en, s.sector.ar, s.percent, 0).run();
	}
	for (const i of data.initiatives) {
		await db.prepare("INSERT INTO ibs_initiatives (edition_slug, title_en, title_ar, description_en, description_ar, image, highlight_en, highlight_ar, partners_json, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
			.bind(slug, i.title.en, i.title.ar, i.description.en, i.description.ar, i.image || null, i.highlight?.en || null, i.highlight?.ar || null, i.partners ? JSON.stringify(i.partners) : null, 0).run();
	}
	for (const g of data.gallery) {
		await db.prepare("INSERT INTO ibs_gallery (id, edition_slug, src, alt_en, alt_ar, width, height, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
			.bind(g.id, slug, g.src, g.alt.en, g.alt.ar, g.width || null, g.height || null, 0).run();
	}
	if (data.agenda) {
		for (const day of data.agenda) {
			const dayResult = await db.prepare("INSERT INTO ibs_agenda_days (edition_slug, date_label_en, date_label_ar, sort_order) VALUES (?, ?, ?, ?)")
				.bind(slug, day.dateLabel.en, day.dateLabel.ar, 0).run();
			const dayId = dayResult.meta.last_row_id as number;
			for (const item of day.items) {
				const itemResult = await db.prepare("INSERT INTO ibs_agenda_items (day_id, time, title_en, title_ar, description_en, description_ar, note_en, note_ar, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
					.bind(dayId, item.time, item.title.en, item.title.ar, item.description?.en || null, item.description?.ar || null, item.note?.en || null, item.note?.ar || null, 0).run();
				const itemId = itemResult.meta.last_row_id as number;
				for (const sp of item.speakers || []) {
					await db.prepare("INSERT INTO ibs_agenda_speakers (id, item_id, name_en, name_ar, org_en, org_ar, photo, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
						.bind(sp.id, itemId, sp.name.en, sp.name.ar, sp.org?.en || null, sp.org?.ar || null, sp.photo || null, 0).run();
				}
			}
		}
	}
	for (const v of data.videos || []) {
		await db.prepare("INSERT INTO ibs_videos (id, edition_slug, youtube_url, title_en, title_ar, description_en, description_ar, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
			.bind(v.id, slug, v.youtubeUrl, v.title.en, v.title.ar, v.description.en, v.description.ar, 0).run();
	}
}

// --- overview blocks ---

export async function getOverviewBlocks(locale: string): Promise<Record<string, unknown>> {
	const db = await getDB();
	const { results } = await db.prepare("SELECT block, payload_json FROM ibs_overview_blocks WHERE locale = ?").bind(locale).all();
	const blocks: Record<string, unknown> = {};
	for (const r of results || []) {
		blocks[r.block as string] = JSON.parse(r.payload_json as string);
	}
	return blocks;
}

export async function setOverviewBlock(block: string, locale: string, payload: unknown): Promise<void> {
	const db = await getDB();
	await db.prepare(
		"INSERT INTO ibs_overview_blocks (block, locale, payload_json) VALUES (?, ?, ?) ON CONFLICT(block, locale) DO UPDATE SET payload_json = excluded.payload_json"
	)
		.bind(block, locale, JSON.stringify(payload))
		.run();
}
