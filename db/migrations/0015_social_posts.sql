-- Admin-managed social media hub. Public embeds require only a public post URL;
-- custom cards can additionally store editable bilingual copy and an uploaded image.

CREATE TABLE social_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'x', 'instagram', 'youtube', 'facebook')),
  post_url TEXT NOT NULL,
  display_mode TEXT NOT NULL DEFAULT 'embed' CHECK (display_mode IN ('embed', 'custom')),
  title_en TEXT NOT NULL DEFAULT '',
  title_ar TEXT NOT NULL DEFAULT '',
  caption_en TEXT NOT NULL DEFAULT '',
  caption_ar TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  post_date TEXT NOT NULL DEFAULT '',
  published INTEGER NOT NULL DEFAULT 0,
  pinned INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_social_posts_public_order
  ON social_posts (published, pinned DESC, sort_order, post_date DESC, id DESC);

INSERT INTO social_posts (
  platform, post_url, display_mode, post_date, published, pinned, sort_order, created_at, updated_at
) VALUES
  ('linkedin', 'https://ae.linkedin.com/posts/emaal_%D9%82%D9%85%D8%A9%D8%A7%D9%84%D8%B6%D9%85%D8%A7%D9%86%D8%A7%D9%84%D8%B5%D8%AD%D9%8A%D9%88%D8%A7%D9%84%D8%AA%D8%A3%D9%85%D9%8A%D9%862026-ibsinsurance-activity-7499408090702979072-FFLv', 'embed', '', 1, 1, 0, unixepoch() * 1000, unixepoch() * 1000),
  ('x', 'https://x.com/Emaal_BS/status/2090376302750576725', 'embed', '2026-08-20', 1, 0, 1, unixepoch() * 1000, unixepoch() * 1000),
  ('instagram', 'https://www.instagram.com/emaal_business_space/p/DcnsZXUFYel/', 'embed', '', 1, 0, 2, unixepoch() * 1000, unixepoch() * 1000),
  ('youtube', 'https://youtu.be/iqBQuCRwKRY?si=ND3RNCAdMIQLgB01', 'embed', '', 1, 0, 3, unixepoch() * 1000, unixepoch() * 1000),
  ('facebook', 'https://www.facebook.com/share/p/1Bh3UVmzxb/', 'embed', '', 1, 0, 4, unixepoch() * 1000, unixepoch() * 1000);
