-- Local preview first. No credentials or card details. One registration per booking.
CREATE TABLE IF NOT EXISTS ibs_tabadul_attempts (
  booking_id TEXT PRIMARY KEY REFERENCES ibs_bookings(id) ON DELETE CASCADE,
  registration_state TEXT NOT NULL DEFAULT 'started',
  session_id TEXT,
  checkout_url TEXT,
  gateway_state INTEGER,
  simulation_state INTEGER NOT NULL DEFAULT 0,
  check_after INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
