-- Preview-only content for visual review. Do not apply to the production database.

INSERT OR IGNORE INTO gallery_categories
  (slug, name_en, name_ar, description_en, description_ar, cover_image_url, published, sort_order, created_at, updated_at)
VALUES
  ('health-insurance-summit', 'Health Insurance Summit', 'قمة الضمان الصحي والتأمين', 'A visual archive for the Health Insurance and Insurance Summit.', 'أرشيف بصري خاص بقمة الضمان الصحي والتأمين.', '/images/keynote-speech.webp', 1, 1, 1788670000000, 1788670000000),
  ('ports-summit', 'Iraq Ports Summit', 'قمة العراق للموانئ', 'Photography from conversations shaping the future of Iraq''s ports and logistics sector.', 'صور توثق الحوارات التي ترسم مستقبل قطاع الموانئ والخدمات اللوجستية في العراق.', '/images/summit-stage.webp', 1, 2, 1788670000000, 1788670000000);

INSERT OR IGNORE INTO gallery_albums
  (category_id, slug, title_en, title_ar, description_en, description_ar, cover_image_url, event_date, location_en, location_ar, published, featured, sort_order, created_at, updated_at)
SELECT id, 'health-insurance-summit-preview', 'Health Insurance Summit — Preview Collection', 'قمة الضمان الصحي والتأمين — مجموعة تجريبية', 'A preview visual story demonstrating how keynote moments, panel discussions, and conversations can be presented in one shareable album.', 'قصة بصرية تجريبية توضح طريقة عرض الكلمات الرئيسية والجلسات النقاشية والحوارات ضمن ألبوم واحد قابل للمشاركة.', '/images/keynote-speech.webp', '', 'Iraq', 'العراق', 1, 1, 1, 1788670000000, 1788670000000
FROM gallery_categories WHERE slug = 'health-insurance-summit';

INSERT OR IGNORE INTO gallery_albums
  (category_id, slug, title_en, title_ar, description_en, description_ar, cover_image_url, event_date, location_en, location_ar, published, featured, sort_order, created_at, updated_at)
SELECT id, 'ports-summit-preview', 'Iraq Ports Summit — Preview Collection', 'قمة العراق للموانئ — مجموعة تجريبية', 'A preview collection showing the gallery experience for leaders, delegations, strategic sessions, and networking moments.', 'مجموعة تجريبية تعرض تجربة المعرض الخاصة بالقادة والوفود والجلسات الاستراتيجية ولحظات التواصل.', '/images/summit-stage.webp', '', 'Iraq', 'العراق', 1, 0, 2, 1788670000000, 1788670000000
FROM gallery_categories WHERE slug = 'ports-summit';

DELETE FROM gallery_images WHERE album_id IN (
  SELECT id FROM gallery_albums WHERE slug IN ('health-insurance-summit-preview', 'ports-summit-preview')
);

INSERT INTO gallery_images (album_id, image_url, title_en, title_ar, description_en, description_ar, alt_en, alt_ar, sort_order, created_at, updated_at)
SELECT id, '/images/keynote-speech.webp', 'Opening keynote', 'الكلمة الافتتاحية', 'A defining moment from the main stage.', 'لحظة بارزة من المنصة الرئيسية.', 'Keynote speaker on the main summit stage', 'المتحدث الرئيسي على منصة القمة', 0, 1788670000000, 1788670000000 FROM gallery_albums WHERE slug = 'health-insurance-summit-preview';
INSERT INTO gallery_images (album_id, image_url, title_en, title_ar, description_en, description_ar, alt_en, alt_ar, sort_order, created_at, updated_at)
SELECT id, '/images/panel-discussion.webp', 'Leadership dialogue', 'حوار القيادات', 'Decision-makers exchange perspectives during a focused panel.', 'تبادل للرؤى بين صنّاع القرار خلال جلسة متخصصة.', 'Leaders taking part in a summit panel discussion', 'قادة يشاركون في جلسة نقاشية ضمن القمة', 1, 1788670000000, 1788670000000 FROM gallery_albums WHERE slug = 'health-insurance-summit-preview';
INSERT INTO gallery_images (album_id, image_url, title_en, title_ar, description_en, description_ar, alt_en, alt_ar, sort_order, created_at, updated_at)
SELECT id, '/images/networking-session.webp', 'Connections in motion', 'تواصل يصنع الفرص', 'Conversations that continue beyond the formal sessions.', 'حوارات تمتد إلى ما بعد الجلسات الرسمية.', 'Participants networking during the summit', 'مشاركون يتواصلون خلال القمة', 2, 1788670000000, 1788670000000 FROM gallery_albums WHERE slug = 'health-insurance-summit-preview';
INSERT INTO gallery_images (album_id, image_url, title_en, title_ar, description_en, description_ar, alt_en, alt_ar, sort_order, created_at, updated_at)
SELECT id, '/images/leadership-delegation.webp', 'Leadership delegation', 'وفد القيادات', 'A gathering of leaders and strategic partners.', 'لقاء يجمع القيادات والشركاء الاستراتيجيين.', 'Leadership delegation at an EMAAL event', 'وفد من القيادات في فعالية لأعمال', 3, 1788670000000, 1788670000000 FROM gallery_albums WHERE slug = 'health-insurance-summit-preview';

INSERT INTO gallery_images (album_id, image_url, title_en, title_ar, description_en, description_ar, alt_en, alt_ar, sort_order, created_at, updated_at)
SELECT id, '/images/summit-stage.webp', 'The summit stage', 'منصة القمة', 'The visual centre of the summit experience.', 'المركز البصري لتجربة القمة.', 'Main stage at the Iraq Ports Summit preview', 'المنصة الرئيسية في العرض التجريبي لقمة الموانئ', 0, 1788670000000, 1788670000000 FROM gallery_albums WHERE slug = 'ports-summit-preview';
INSERT INTO gallery_images (album_id, image_url, title_en, title_ar, description_en, description_ar, alt_en, alt_ar, sort_order, created_at, updated_at)
SELECT id, '/images/about-meeting.webp', 'Strategic meeting', 'اجتماع استراتيجي', 'Focused dialogue around partnerships and delivery.', 'حوار مركز حول الشراكات والتنفيذ.', 'Business leaders in a strategic meeting', 'قادة أعمال خلال اجتماع استراتيجي', 1, 1788670000000, 1788670000000 FROM gallery_albums WHERE slug = 'ports-summit-preview';
INSERT INTO gallery_images (album_id, image_url, title_en, title_ar, description_en, description_ar, alt_en, alt_ar, sort_order, created_at, updated_at)
SELECT id, '/images/about-collaboration.webp', 'Building together', 'نبني معاً', 'Partnerships move from introductions to practical collaboration.', 'شراكات تنتقل من التعارف إلى التعاون العملي.', 'Partners collaborating during an EMAAL event', 'شركاء يتعاونون خلال فعالية لأعمال', 2, 1788670000000, 1788670000000 FROM gallery_albums WHERE slug = 'ports-summit-preview';
