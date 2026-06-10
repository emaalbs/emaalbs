-- Admin roles: add super admin flag and display name

ALTER TABLE admin_users ADD COLUMN is_super_admin INTEGER NOT NULL DEFAULT 0;
ALTER TABLE admin_users ADD COLUMN display_name TEXT;

-- The default seeded admin becomes the super admin
UPDATE admin_users SET is_super_admin = 1 WHERE username = 'admin';
