-- ROLLBACK: 0002_blogs.sql
-- D1 migrations are forward-only via wrangler, but this documents the rollback.

DROP TABLE IF EXISTS blogs;
