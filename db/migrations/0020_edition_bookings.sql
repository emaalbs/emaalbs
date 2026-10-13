-- Opt-in configuration; existing editions stay hidden. Booking history survives edition deletion.
CREATE TABLE IF NOT EXISTS ibs_booking_settings (
  edition_slug TEXT PRIMARY KEY REFERENCES ibs_editions(slug) ON DELETE CASCADE,
  config_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS ibs_bookings (
  id TEXT PRIMARY KEY,
  edition_slug TEXT NOT NULL,
  offer_title TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  locale TEXT NOT NULL,
  amount_minor INTEGER NOT NULL CHECK(amount_minor > 0),
  currency TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending','paid','failed','cancelled','expired','review')),
  provider TEXT NOT NULL,
  access_hash TEXT NOT NULL UNIQUE,
  request_hash TEXT NOT NULL,
  terms_snapshot TEXT NOT NULL,
  provider_session TEXT,
  checkout_url TEXT,
  transaction_id TEXT,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS ibs_bookings_inventory ON ibs_bookings(edition_slug, status, expires_at);
CREATE UNIQUE INDEX IF NOT EXISTS ibs_bookings_transaction ON ibs_bookings(provider, transaction_id) WHERE transaction_id IS NOT NULL;
CREATE TABLE IF NOT EXISTS ibs_payment_events (
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  booking_id TEXT NOT NULL REFERENCES ibs_bookings(id),
  status TEXT NOT NULL,
  received_at INTEGER NOT NULL,
  PRIMARY KEY(provider, event_id)
);
CREATE TABLE IF NOT EXISTS ibs_booking_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
