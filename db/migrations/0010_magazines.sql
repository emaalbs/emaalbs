-- Magazines: cover image + bilingual title + PDF file

CREATE TABLE magazines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL DEFAULT '',
  title_ar TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  pdf_url TEXT NOT NULL DEFAULT '',
  date TEXT,
  published INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER,
  updated_at INTEGER
);
