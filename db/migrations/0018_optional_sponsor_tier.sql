-- Sponsors can be displayed without a tier heading when the admin leaves the field blank.
CREATE TABLE ibs_sponsors_new (
  id TEXT PRIMARY KEY,
  edition_slug TEXT REFERENCES ibs_editions(slug) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT '' CHECK (tier IN ('','strategic','platinum','gold','silver','supporting')),
  logo TEXT,
  href TEXT,
  sort_order INTEGER
);

INSERT INTO ibs_sponsors_new (id, edition_slug, name, tier, logo, href, sort_order)
SELECT id, edition_slug, name, COALESCE(tier, ''), logo, href, sort_order
FROM ibs_sponsors;

DROP TABLE ibs_sponsors;
ALTER TABLE ibs_sponsors_new RENAME TO ibs_sponsors;
