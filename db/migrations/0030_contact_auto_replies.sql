CREATE TABLE contact_auto_replies (
  contact_id INTEGER PRIMARY KEY REFERENCES contacts(id) ON DELETE CASCADE,
  recipient TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'failed', 'unconfirmed')),
  error_code TEXT,
  provider_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX contact_auto_replies_recipient_time ON contact_auto_replies(recipient, created_at);
