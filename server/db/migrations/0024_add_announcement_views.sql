-- Announcement "received" impressions: one row written the first time the modal
-- is shown to a user, so analytics can compare reach (received) against
-- acknowledgements. Idempotent so it is safe to (re)apply on every deploy.

CREATE TABLE IF NOT EXISTS "announcement_views" (
  "id" serial PRIMARY KEY NOT NULL,
  "announcement_id" integer NOT NULL REFERENCES "announcements"("id") ON DELETE CASCADE,
  "user_id" varchar(255) NOT NULL,
  "seen_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "announcement_views_announcement_user_unique" UNIQUE("announcement_id","user_id")
);

CREATE INDEX IF NOT EXISTS "announcement_views_user_idx"
  ON "announcement_views" USING btree ("user_id");
