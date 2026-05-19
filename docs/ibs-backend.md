# IBS Backend Plan (D1 + R2)

This document outlines how the IBS section will move from mock data to a
Cloudflare D1 + R2 backend, and what the dashboard will manage.

## Swap point

The single seam between the public site and the data source is:

- `src/data/ibs/index.ts` — exposes `getEditions()`, `getEditionBySlug(slug)`,
  and `getEditionsSync()`.
- `src/data/ibs/overview.ts` — overview page content blocks.
- `src/data/ibs/types.ts` — the public-facing types (`IbsEdition`,
  `Speaker`, `Sponsor`, `SectorShare`, `Theme`, `Initiative`, `GalleryItem`).

When D1 is wired, replace the bodies of `getEditions` / `getEditionBySlug`
with D1 queries and remove `getEditionsSync` (or keep it for the navbar
fed by an in-memory cache populated at request start).

## D1 schema (sketch)

```sql
CREATE TABLE ibs_editions (
  slug          TEXT PRIMARY KEY,
  year          INTEGER NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('past','upcoming','live')),
  edition_label_en TEXT, edition_label_ar TEXT,
  title_en      TEXT, title_ar TEXT,
  tagline_en    TEXT, tagline_ar TEXT,
  summary_en    TEXT, summary_ar TEXT,
  dates_en      TEXT, dates_ar TEXT,
  location_en   TEXT, location_ar TEXT,
  hero_image    TEXT,         -- R2 key
  recap_video   TEXT,         -- R2 key or external url
  registration_url TEXT,
  next_edition_slug TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  published     INTEGER NOT NULL DEFAULT 1,
  created_at    INTEGER, updated_at INTEGER
);

CREATE TABLE ibs_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  edition_slug TEXT REFERENCES ibs_editions(slug) ON DELETE CASCADE,
  value TEXT NOT NULL,
  label_en TEXT, label_ar TEXT,
  sort_order INTEGER
);

CREATE TABLE ibs_themes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  edition_slug TEXT REFERENCES ibs_editions(slug) ON DELETE CASCADE,
  title_en TEXT, title_ar TEXT,
  description_en TEXT, description_ar TEXT,
  sort_order INTEGER
);

CREATE TABLE ibs_speakers (
  id TEXT PRIMARY KEY,
  edition_slug TEXT REFERENCES ibs_editions(slug) ON DELETE CASCADE,
  name_en TEXT, name_ar TEXT,
  title_en TEXT, title_ar TEXT,
  org_en TEXT, org_ar TEXT,
  photo TEXT,                 -- R2 key
  sort_order INTEGER
);

CREATE TABLE ibs_sponsors (
  id TEXT PRIMARY KEY,
  edition_slug TEXT REFERENCES ibs_editions(slug) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('strategic','platinum','gold','silver','supporting')),
  logo TEXT,                  -- R2 key
  href TEXT,
  sort_order INTEGER
);

CREATE TABLE ibs_sector_shares (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  edition_slug TEXT REFERENCES ibs_editions(slug) ON DELETE CASCADE,
  sector_en TEXT, sector_ar TEXT,
  percent INTEGER NOT NULL,
  sort_order INTEGER
);

CREATE TABLE ibs_initiatives (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  edition_slug TEXT REFERENCES ibs_editions(slug) ON DELETE CASCADE,
  title_en TEXT, title_ar TEXT,
  description_en TEXT, description_ar TEXT,
  highlight_en TEXT, highlight_ar TEXT,
  partners_json TEXT          -- JSON array of partner names
);

CREATE TABLE ibs_gallery (
  id TEXT PRIMARY KEY,
  edition_slug TEXT REFERENCES ibs_editions(slug) ON DELETE CASCADE,
  src TEXT NOT NULL,          -- R2 key
  alt_en TEXT, alt_ar TEXT,
  width INTEGER, height INTEGER,
  sort_order INTEGER
);

CREATE TABLE ibs_agenda_days (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  edition_slug TEXT REFERENCES ibs_editions(slug) ON DELETE CASCADE,
  date_label_en TEXT,
  date_label_ar TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE ibs_agenda_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_id INTEGER REFERENCES ibs_agenda_days(id) ON DELETE CASCADE,
  time TEXT NOT NULL,         -- "09:30"
  title_en TEXT, title_ar TEXT,
  description_en TEXT, description_ar TEXT,
  note_en TEXT, note_ar TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE ibs_agenda_speakers (
  id TEXT PRIMARY KEY,
  item_id INTEGER REFERENCES ibs_agenda_items(id) ON DELETE CASCADE,
  name_en TEXT, name_ar TEXT,
  org_en TEXT, org_ar TEXT,
  photo TEXT,                 -- R2 key
  sort_order INTEGER
);

-- Overview blocks (for /[locale]/ibs page) — keyed by block name + locale
CREATE TABLE ibs_overview_blocks (
  block TEXT NOT NULL,        -- 'hero','why','who','sectors',...
  locale TEXT NOT NULL,
  payload_json TEXT NOT NULL, -- JSON matching the block shape in overview.ts
  PRIMARY KEY (block, locale)
);
```

## R2

Bucket `ibs-media` for hero images, gallery, sponsor logos, recap videos.
Object keys: `editions/<slug>/hero.jpg`, `editions/<slug>/gallery/<id>.jpg`,
`sponsors/<id>.svg`, etc. Public read via custom domain or signed URLs returned
by the data layer. Components consume plain string URLs — no changes there.

## Wrangler bindings to add later

```jsonc
// wrangler.jsonc
"d1_databases": [{ "binding": "DB", "database_name": "emmal", "database_id": "..." }],
"r2_buckets":   [{ "binding": "MEDIA", "bucket_name": "ibs-media" }]
```

## Admin dashboard scope

- CRUD for editions (all fields above) with bilingual editors.
- Image upload to R2, automatic key generation.
- Reorder via drag-and-drop (`sort_order`).
- Publish/unpublish toggle + scheduled publish.
- Edit overview blocks with the same JSON shape that today's
  `src/data/ibs/overview.ts` uses — so the public components don't change.
