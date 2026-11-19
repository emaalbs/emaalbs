CREATE TABLE contact_email_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  enabled INTEGER NOT NULL DEFAULT 0,
  email_1 TEXT NOT NULL DEFAULT '',
  email_2 TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL DEFAULT 0,
  last_test_at INTEGER NOT NULL DEFAULT 0
);
INSERT INTO contact_email_settings (id) VALUES (1);

CREATE TABLE contact_email_deliveries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
  recipient TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'failed', 'unconfirmed')),
  error_code TEXT,
  provider_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX contact_email_deliveries_contact ON contact_email_deliveries(contact_id, id);
