-- Your SQL goes here

ALTER TABLE website_tick
RENAME COLUMN createdat TO created_at;

ALTER TABLE website_tick
ALTER COLUMN status TYPE BOOLEAN
USING status::boolean;