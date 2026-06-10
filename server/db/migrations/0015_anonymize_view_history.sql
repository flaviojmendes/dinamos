-- Anonymize historical content_views rows so they can no longer be reversed to
-- a specific person. Authenticated views used to be hashed from the stable
-- Firebase uid (sha256(salt:uid)); since the salt is fixed and uids are readable
-- from the users table, anyone holding the salt could recompute that hash and
-- reconstruct one person's full page-view history. Going forward the recorder
-- hashes only the identity-less, client-generated visitor id (see
-- server/routes/views.ts), but the rows already written for authed visitors are
-- replaced here with per-row random hashes that are not derivable from any uid.
--
-- Trade-off: total view counts are unaffected, but historical distinct-visitor
-- counts for authenticated traffic become approximate (each scrubbed row now
-- looks like its own visitor), since the original uid is unrecoverable by design.
--
-- RUN-ONCE: guarded by a singleton state row so it is safe to re-run on every
-- deploy (the production provisioner in server/scripts/applyContentSeed.ts
-- re-applies fixups each build). Re-running unguarded would clobber the new,
-- legitimate anon-based hashes of authed visitors and break distinct counting.
CREATE TABLE IF NOT EXISTS "analytics_anonymization_state" (
  "id" integer PRIMARY KEY DEFAULT 1,
  "applied_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "analytics_anonymization_singleton" CHECK ("id" = 1)
);

DO $do$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "analytics_anonymization_state" WHERE "id" = 1) THEN
    UPDATE "content_views"
      SET "visitor_hash" = encode(sha256((random()::text || ':' || "id"::text)::bytea), 'hex')
      WHERE "is_authed" = true;
    INSERT INTO "analytics_anonymization_state" ("id") VALUES (1)
      ON CONFLICT ("id") DO NOTHING;
  END IF;
END $do$;
