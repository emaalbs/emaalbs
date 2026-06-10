-- Admin roles: the default seeded admin becomes the super admin
UPDATE admin_users SET is_super_admin = 1 WHERE username = 'admin';
