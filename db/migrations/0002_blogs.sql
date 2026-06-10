-- Blog schema: block-based content stored as JSON

CREATE TABLE blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT, title_ar TEXT,
  description_en TEXT, description_ar TEXT,
  content_en TEXT NOT NULL DEFAULT '[]', -- JSON array of blocks
  content_ar TEXT NOT NULL DEFAULT '[]',
  image TEXT,
  date TEXT,
  published INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER,
  updated_at INTEGER
);

-- Demo blog post
INSERT INTO blogs (slug, title_en, title_ar, description_en, description_ar, content_en, content_ar, image, date, published, sort_order, created_at, updated_at)
VALUES (
  'welcome-to-emmal',
  'Welcome to EMAAL',
  'مرحباً بك في إيمال',
  'A brief introduction to EMAAL Business Space and what we do.',
  'مقدمة موجزة عن إيمال وما نقوم به.',
  '[{"type":"heading","level":2,"text":{"en":"Welcome","ar":"مرحباً"}},{"type":"paragraph","text":{"en":"This is a demo blog post. Replace it with real content from the admin dashboard.","ar":"هذه مقالة تجريبية. استبدلها بمحتوى حقيقي من لوحة الإدارة."}}]',
  '[{"type":"heading","level":2,"text":{"en":"Welcome","ar":"مرحباً"}},{"type":"paragraph","text":{"en":"This is a demo blog post. Replace it with real content from the admin dashboard.","ar":"هذه مقالة تجريبية. استبدلها بمحتوى حقيقي من لوحة الإدارة."}}]',
  '/images/hero-summit.jpg',
  '6 Jun 2026',
  1,
  0,
  0,
  0
);
