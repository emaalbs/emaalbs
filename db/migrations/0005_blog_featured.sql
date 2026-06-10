-- Add featured flag to blogs

ALTER TABLE blogs ADD COLUMN featured INTEGER NOT NULL DEFAULT 0;
