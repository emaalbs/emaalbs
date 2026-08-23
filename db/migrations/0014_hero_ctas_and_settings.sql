-- Editable homepage hero CTAs and carousel timing.

ALTER TABLE hero_slides ADD COLUMN primary_cta_label_en TEXT NOT NULL DEFAULT 'Explore Iraq Business Summit';
ALTER TABLE hero_slides ADD COLUMN primary_cta_label_ar TEXT NOT NULL DEFAULT 'استكشف قمة العراق للأعمال';
ALTER TABLE hero_slides ADD COLUMN primary_cta_href_en TEXT NOT NULL DEFAULT '/en/ibs';
ALTER TABLE hero_slides ADD COLUMN primary_cta_href_ar TEXT NOT NULL DEFAULT '/ar/ibs';

ALTER TABLE hero_slides ADD COLUMN secondary_cta_label_en TEXT NOT NULL DEFAULT 'Contact Us';
ALTER TABLE hero_slides ADD COLUMN secondary_cta_label_ar TEXT NOT NULL DEFAULT 'تواصل معنا';
ALTER TABLE hero_slides ADD COLUMN secondary_cta_href_en TEXT NOT NULL DEFAULT '/en/contact';
ALTER TABLE hero_slides ADD COLUMN secondary_cta_href_ar TEXT NOT NULL DEFAULT '/ar/contact';

CREATE TABLE hero_carousel_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  autoplay_delay_ms INTEGER NOT NULL DEFAULT 6500 CHECK (autoplay_delay_ms BETWEEN 2000 AND 60000),
  updated_at INTEGER NOT NULL
);

INSERT INTO hero_carousel_settings (id, autoplay_delay_ms, updated_at)
VALUES (1, 6500, unixepoch() * 1000);
