-- ROLLBACK: 0003_admin.sql
-- D1 migrations are forward-only via wrangler, but this documents the rollback.

DROP TABLE IF EXISTS admin_users;
