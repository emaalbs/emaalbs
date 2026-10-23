-- Additive only: existing payment records and their prices remain untouched.
ALTER TABLE ibs_bookings ADD COLUMN tier_id TEXT NOT NULL DEFAULT 'standard';
ALTER TABLE ibs_bookings ADD COLUMN tier_name TEXT NOT NULL DEFAULT '{"en":"General admission","ar":"دخول عام"}';
ALTER TABLE ibs_bookings ADD COLUMN edition_snapshot TEXT;
ALTER TABLE ibs_bookings ADD COLUMN receipt_token TEXT;
CREATE INDEX IF NOT EXISTS idx_booking_tier_inventory ON ibs_bookings(edition_slug,tier_id,status,expires_at);
