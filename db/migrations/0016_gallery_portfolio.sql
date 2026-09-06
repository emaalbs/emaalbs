-- Gallery portfolio: categories, albums, and shareable images.

CREATE TABLE gallery_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL DEFAULT '',
  name_ar TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT NOT NULL DEFAULT '',
  published INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE gallery_albums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL DEFAULT '',
  title_ar TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT NOT NULL DEFAULT '',
  event_date TEXT NOT NULL DEFAULT '',
  location_en TEXT NOT NULL DEFAULT '',
  location_ar TEXT NOT NULL DEFAULT '',
  published INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES gallery_categories(id) ON DELETE CASCADE
);

CREATE TABLE gallery_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  title_en TEXT NOT NULL DEFAULT '',
  title_ar TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_ar TEXT NOT NULL DEFAULT '',
  alt_en TEXT NOT NULL DEFAULT '',
  alt_ar TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (album_id) REFERENCES gallery_albums(id) ON DELETE CASCADE
);

CREATE INDEX idx_gallery_categories_public ON gallery_categories(published, sort_order);
CREATE INDEX idx_gallery_albums_public ON gallery_albums(published, featured, sort_order, event_date);
CREATE INDEX idx_gallery_albums_category ON gallery_albums(category_id, published, sort_order);
CREATE INDEX idx_gallery_images_album ON gallery_images(album_id, sort_order, id);
