-- Detect duplicate gallery images by their optimized binary content.

ALTER TABLE gallery_images ADD COLUMN content_hash TEXT NOT NULL DEFAULT '';

CREATE UNIQUE INDEX idx_gallery_images_content_hash
	ON gallery_images(content_hash)
	WHERE content_hash <> '';
