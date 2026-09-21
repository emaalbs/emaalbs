-- One editable homepage feature used to spotlight a blog, news story, or internal page.

CREATE TABLE homepage_feature (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  enabled INTEGER NOT NULL DEFAULT 1,
  kicker_en TEXT NOT NULL,
  kicker_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  button_label_en TEXT NOT NULL,
  button_label_ar TEXT NOT NULL,
  button_href_en TEXT NOT NULL,
  button_href_ar TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_position TEXT NOT NULL DEFAULT 'center',
  updated_at INTEGER NOT NULL
);

INSERT INTO homepage_feature (
  id, enabled, kicker_en, kicker_ar, title_en, title_ar,
  description_en, description_ar, button_label_en, button_label_ar,
  button_href_en, button_href_ar, image_url, image_position, updated_at
) VALUES (
  1,
  1,
  'Latest from EMAAL',
  'أحدث أخبار أعمال',
  'Iraq Health and Insurance Summit 2026: bringing the state and private sector together',
  'قمة العراق للضمان الصحي والتأمين 2026: منصة تجمع الدولة والقطاع الخاص',
  'EMAAL organised the summit in Baghdad, bringing officials, health-sector leaders and insurance companies together as Iraq''s health assurance programme enters a new phase of expansion.',
  'نظّمت شركة أعمال القمة في بغداد، وجمعت المسؤولين وقادة القطاع الصحي وشركات التأمين بالتزامن مع دخول مشروع الضمان الصحي مرحلة جديدة من التوسع.',
  'Read the full story',
  'اقرأ الخبر كاملاً',
  '/en/blog/iraq-health-and-insurance-summit-2026-a-platform-for-bringing-the-state-and-private-sector-together',
  '/ar/blog/iraq-health-and-insurance-summit-2026-a-platform-for-bringing-the-state-and-private-sector-together',
  '/api/media/blogs/1789918097702-npis9odnce.webp',
  'center',
  unixepoch() * 1000
);
