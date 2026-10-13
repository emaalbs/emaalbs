-- Preserve existing PDFs without guessing their language.
ALTER TABLE magazines ADD COLUMN pdf_url_en TEXT NOT NULL DEFAULT '';
ALTER TABLE magazines ADD COLUMN pdf_url_ar TEXT NOT NULL DEFAULT '';
