-- Editable homepage hero slides.

CREATE TABLE hero_slides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  overline_en TEXT NOT NULL DEFAULT '',
  overline_ar TEXT NOT NULL DEFAULT '',
  title_line_1_en TEXT NOT NULL DEFAULT '',
  title_line_1_ar TEXT NOT NULL DEFAULT '',
  title_line_2_en TEXT NOT NULL DEFAULT '',
  title_line_2_ar TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  image_position TEXT NOT NULL DEFAULT 'center',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_hero_slides_published_order
  ON hero_slides (published, sort_order, id);

INSERT INTO hero_slides (
  overline_en, overline_ar,
  title_line_1_en, title_line_1_ar,
  title_line_2_en, title_line_2_ar,
  description_en, description_ar,
  image_url, image_position, sort_order, published, created_at, updated_at
) VALUES
(
  'EMAAL Business Space', 'أعمال بيزنس سبيس',
  'Building Businesses. Scaling Growth.', 'حيث تنمو الأعمال',
  'Connecting Opportunity.', 'وتتشكل الفرص',
  'EMAAL Business Space is a business platform builder and investment driven group operating across Iraq and the region. We build and scale ventures, invest in growth, and help established companies expand through strategic positioning, market access, and high level business platforms.',
  'أعمال هي منصة لبناء الأعمال ومجموعة استثمارية تعمل في العراق والمنطقة. نقوم ببناء المشاريع وتوسيع نطاقها، والاستثمار في النمو، ومساعدة الشركات على التوسع من خلال التموضع الاستراتيجي، والوصول إلى الأسواق، ومنصات الأعمال رفيعة المستوى.',
  '/images/hero-summit.webp', 'center', 0, 1, unixepoch() * 1000, unixepoch() * 1000
),
(
  'Investment & Market Access', 'الاستثمار والوصول إلى الأسواق',
  'Turning Ambition Into', 'نحوّل الطموح إلى',
  'Sustainable Growth.', 'نمو مستدام',
  'We connect companies and investors with the institutions, partnerships, and market insight needed to enter, expand, and lead across Iraq and the region.',
  'نربط الشركات والمستثمرين بالمؤسسات والشراكات ورؤى السوق اللازمة لدخول الأسواق والتوسع وقيادة النمو في العراق والمنطقة.',
  '/images/keynote-speech.webp', 'center 42%', 1, 1, unixepoch() * 1000, unixepoch() * 1000
),
(
  'Iraq Business Summit', 'قمة الأعمال العراقية',
  'Where Decision Makers Meet', 'حيث يلتقي صنّاع القرار',
  'Real Opportunity.', 'بالفرص الحقيقية',
  'Through IBS, we bring government leaders, investors, and the private sector together to move conversations toward partnerships, projects, and measurable outcomes.',
  'من خلال القمة، نجمع القيادات الحكومية والمستثمرين والقطاع الخاص لتحويل الحوارات إلى شراكات ومشاريع ونتائج قابلة للقياس.',
  '/images/panel-discussion.webp', 'center 45%', 2, 1, unixepoch() * 1000, unixepoch() * 1000
);
