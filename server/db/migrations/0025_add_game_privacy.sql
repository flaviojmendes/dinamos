-- Match privacy controls: open-vs-invite joining and public discovery listing.
-- `join_key` is the secret appended to invite links for private matches.
-- Idempotent so it is safe to (re)apply on every deploy.

ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "join_open" boolean DEFAULT true NOT NULL;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "listed" boolean DEFAULT true NOT NULL;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "join_key" varchar(32);
