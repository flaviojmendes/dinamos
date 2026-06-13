-- User-owned System Editor designs saved for recovery, sharing and embedding.
-- `design` holds the full DesignV2 blob (seed, load profile, chaos, nodes, edges).
-- `visibility` is one of private | unlisted | public; only unlisted/public rows
-- are readable by non-owners (required for share links and embeds).
-- Idempotent so it is safe to (re)apply on every deploy.

CREATE TABLE IF NOT EXISTS "saved_architectures" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar(255) NOT NULL,
  "title" varchar(160),
  "visibility" varchar(20) DEFAULT 'private' NOT NULL,
  "design" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "saved_architectures_user_idx"
  ON "saved_architectures" USING btree ("user_id");
