-- Your SQL goes here
-- CreateIndex
ALTER TABLE "user"
ADD CONSTRAINT "user_username_unique" UNIQUE ("username");
