-- This file should undo anything in `up.sql`

-- recreate enum
CREATE TYPE website_status AS ENUM ('Up', 'Down', 'Unknown');

-- convert TEXT back to enum
ALTER TABLE website_tick
ALTER COLUMN status TYPE website_status
USING status::website_status;