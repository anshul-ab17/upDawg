-- This file should undo anything in `up.sql`

DROP TABLE IF EXISTS website_tick;
DROP TABLE IF EXISTS region;
DROP TABLE IF EXISTS website;
DROP TABLE IF EXISTS "user";

DROP TYPE IF EXISTS website_status;