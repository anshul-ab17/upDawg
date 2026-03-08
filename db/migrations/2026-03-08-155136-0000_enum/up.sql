-- Your SQL goes here

-- convert enum column to TEXT
ALTER TABLE website_tick
ALTER COLUMN status TYPE TEXT
USING status::text;

-- drop enum type
DROP TYPE IF EXISTS website_status;