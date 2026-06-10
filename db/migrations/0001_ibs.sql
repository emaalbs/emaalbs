-- IBS schema: editions, stats, themes, speakers, sponsors, sector_shares, initiatives, gallery, agenda

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
  hero_image    TEXT,
  recap_video   TEXT,
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
  photo TEXT,
  sort_order INTEGER
);

CREATE TABLE ibs_sponsors (
  id TEXT PRIMARY KEY,
  edition_slug TEXT REFERENCES ibs_editions(slug) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('strategic','platinum','gold','silver','supporting')),
  logo TEXT,
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
  partners_json TEXT
);

CREATE TABLE ibs_gallery (
  id TEXT PRIMARY KEY,
  edition_slug TEXT REFERENCES ibs_editions(slug) ON DELETE CASCADE,
  src TEXT NOT NULL,
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
  time TEXT NOT NULL,
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
  photo TEXT,
  sort_order INTEGER
);

CREATE TABLE ibs_overview_blocks (
  block TEXT NOT NULL,
  locale TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  PRIMARY KEY (block, locale)
);
