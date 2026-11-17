-- Existing accounts retain their access; super-admin ownership remains separate.
ALTER TABLE admin_users ADD COLUMN role TEXT NOT NULL DEFAULT 'admin'
    CHECK (role IN ('admin', 'payments'));
