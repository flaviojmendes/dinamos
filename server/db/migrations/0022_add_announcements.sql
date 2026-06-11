-- Announcements: admin-authored broadcast shown to users as a modal, with
-- per-user acknowledgements so it is shown only until dismissed. Idempotent so
-- it is safe to (re)apply on every deploy.

CREATE TABLE IF NOT EXISTS "announcements" (
  "id" serial PRIMARY KEY NOT NULL,
  "title_en" varchar(300),
  "title_pt" varchar(300),
  "body_en" text,
  "body_pt" text,
  "published" boolean DEFAULT false NOT NULL,
  "published_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "announcement_acks" (
  "id" serial PRIMARY KEY NOT NULL,
  "announcement_id" integer NOT NULL REFERENCES "announcements"("id") ON DELETE CASCADE,
  "user_id" varchar(255) NOT NULL,
  "acknowledged_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "announcement_acks_announcement_user_unique" UNIQUE("announcement_id","user_id")
);

CREATE INDEX IF NOT EXISTS "announcement_acks_user_idx"
  ON "announcement_acks" USING btree ("user_id");
