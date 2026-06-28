-- Migration to create the ibs_videos table
CREATE TABLE ibs_videos (
  id TEXT PRIMARY KEY,
  edition_slug TEXT REFERENCES ibs_editions(slug) ON DELETE CASCADE,
  youtube_url TEXT NOT NULL,
  title_en TEXT, title_ar TEXT,
  description_en TEXT, description_ar TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);
