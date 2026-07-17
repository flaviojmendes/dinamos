-- Arena integrity foundation (migration 0028).
-- Additive, idempotent DDL for lifecycle timing, immutable round snapshots,
-- moderation, capacity limits, stage access tokens, and player eligibility.
-- Safe to re-apply on every deploy via applyContentSeed.

ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "interval_started_at" timestamp with time zone;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "interval_ends_at" timestamp with time zone;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "paused_at" timestamp with time zone;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "total_paused_ms" bigint DEFAULT 0 NOT NULL;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "auto_transitions" boolean DEFAULT true NOT NULL;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "lifecycle_version" integer DEFAULT 0 NOT NULL;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "round_snapshots" jsonb;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "kicked_user_ids" jsonb DEFAULT '[]'::jsonb NOT NULL;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "max_players" integer DEFAULT 32 NOT NULL;
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "stage_token_hash" varchar(128);
ALTER TABLE "game_sessions" ADD COLUMN IF NOT EXISTS "stage_token_expires_at" timestamp with time zone;

ALTER TABLE "game_players" ADD COLUMN IF NOT EXISTS "eligible_from_sec" double precision;
ALTER TABLE "game_players" ADD COLUMN IF NOT EXISTS "round_arch_snapshots" jsonb;
ALTER TABLE "game_players" ADD COLUMN IF NOT EXISTS "verified_round_scores" jsonb;
