-- Admin schema: users for dashboard authentication

CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL, -- base64 encoded PBKDF2 hash
  salt TEXT NOT NULL,          -- base64 encoded salt
  is_super_admin INTEGER NOT NULL DEFAULT 0,
  display_name TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

-- Default super admin user (password: "admin123")
-- Generated with: node scripts/seed-admin.mjs "admin123"
INSERT INTO admin_users (username, password_hash, salt, is_super_admin, created_at, updated_at) VALUES
  ('admin', 'V9L8amNa20yA3ISnyLs_md2pBi6oQbxVwzObcaA0INk', 'MKS5vcMPt2BdkE14VCQdcA', 1, 0, 0);
