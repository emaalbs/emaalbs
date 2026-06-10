-- ROLLBACK: 0001_ibs.sql
-- D1 migrations are forward-only via wrangler, but this documents the rollback.

DROP TABLE IF EXISTS ibs_agenda_speakers;
DROP TABLE IF EXISTS ibs_agenda_items;
DROP TABLE IF EXISTS ibs_agenda_days;
DROP TABLE IF EXISTS ibs_gallery;
DROP TABLE IF EXISTS ibs_initiatives;
DROP TABLE IF EXISTS ibs_sector_shares;
DROP TABLE IF EXISTS ibs_sponsors;
DROP TABLE IF EXISTS ibs_speakers;
DROP TABLE IF EXISTS ibs_themes;
DROP TABLE IF EXISTS ibs_stats;
DROP TABLE IF EXISTS ibs_overview_blocks;
DROP TABLE IF EXISTS ibs_editions;
