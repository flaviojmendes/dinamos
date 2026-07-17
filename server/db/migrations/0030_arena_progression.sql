-- Arena progression stats (migration 0030).
-- Additive, idempotent. Separate from quiz/coins ranking formula.

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "arena_matches_played" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "arena_wins" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "arena_podiums" integer DEFAULT 0 NOT NULL;

ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "progression_recorded" boolean DEFAULT false NOT NULL;
