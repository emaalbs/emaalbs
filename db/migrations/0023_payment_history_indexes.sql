-- Additive indexes only; retain all existing booking/event data.
CREATE INDEX IF NOT EXISTS ibs_payment_events_history ON ibs_payment_events(booking_id,provider,status,received_at);
CREATE INDEX IF NOT EXISTS ibs_bookings_history ON ibs_bookings(provider,created_at DESC);
