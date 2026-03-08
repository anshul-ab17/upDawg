-- Your SQL goes here
-- enum for monitoring status
CREATE TYPE website_status AS ENUM ('Up', 'Down', 'Unknown');


CREATE TABLE "user" (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Websites owned by users
CREATE TABLE website (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    time_added TIMESTAMP NOT NULL,
    user_id TEXT NOT NULL,

    CONSTRAINT website_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES "user"(id)
        ON DELETE CASCADE
);

-- Regions
CREATE TABLE region (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

-- Monitoring ticks
CREATE TABLE website_tick (
    id TEXT PRIMARY KEY,
    response_time INTEGER NOT NULL,
    status website_status NOT NULL,
    region_id TEXT NOT NULL,
    website_id TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT website_tick_region_id_fkey
        FOREIGN KEY (region_id)
        REFERENCES region(id)
        ON DELETE CASCADE,

    CONSTRAINT website_tick_website_id_fkey
        FOREIGN KEY (website_id)
        REFERENCES website(id)
        ON DELETE CASCADE
);