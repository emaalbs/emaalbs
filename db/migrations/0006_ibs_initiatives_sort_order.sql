-- Add sort_order to ibs_initiatives (was missing from original schema)
ALTER TABLE ibs_initiatives ADD COLUMN sort_order INTEGER DEFAULT 0;
