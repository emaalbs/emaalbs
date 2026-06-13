-- Add bilingual description to magazines

ALTER TABLE magazines ADD COLUMN description_en TEXT NOT NULL DEFAULT '';
ALTER TABLE magazines ADD COLUMN description_ar TEXT NOT NULL DEFAULT '';
