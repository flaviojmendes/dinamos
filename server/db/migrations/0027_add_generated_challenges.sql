-- User-generated ("tailored") Design Lab problems. A challenge with a non-null
-- generated_by_user_id is private to that user: it is created from a short
-- questionnaire (role, seniority, target company, difficulty) and produced by
-- the AI. generation_context stores those answers so the UI can show what the
-- problem was tailored for. Global/admin challenges keep generated_by_user_id
-- null and remain visible to everyone.
-- Idempotent so it is safe to (re)apply on every deploy.

ALTER TABLE "challenges" ADD COLUMN IF NOT EXISTS "generated_by_user_id" varchar(255);
ALTER TABLE "challenges" ADD COLUMN IF NOT EXISTS "generation_context" jsonb;

CREATE INDEX IF NOT EXISTS "challenges_generated_by_idx"
  ON "challenges" USING btree ("generated_by_user_id");
