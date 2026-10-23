-- Additive only: preserve all booking and payment history.
ALTER TABLE ibs_tabadul_attempts ADD COLUMN checkout_mode TEXT NOT NULL DEFAULT 'pilot';
ALTER TABLE ibs_tabadul_attempts ADD COLUMN reconcile_after INTEGER NOT NULL DEFAULT 0;
ALTER TABLE ibs_tabadul_attempts ADD COLUMN last_verified_at INTEGER;
ALTER TABLE ibs_tabadul_attempts ADD COLUMN verification_error TEXT;
CREATE INDEX IF NOT EXISTS ibs_tabadul_reconcile_due ON ibs_tabadul_attempts(checkout_mode,reconcile_after);
