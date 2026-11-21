CREATE TABLE IF NOT EXISTS welcome_page (
 id INTEGER PRIMARY KEY CHECK (id = 1),
 config_json TEXT NOT NULL,
 updated_at INTEGER NOT NULL
);
