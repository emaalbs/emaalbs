-- Dashboard-managed homepage hero content and ordered slideshow images.
-- The application uses the existing static hero as a fallback until the first save.
CREATE TABLE home_hero_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  payload_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
