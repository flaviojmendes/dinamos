-- Adjacent reliability hardening (migration 0029).
-- Idempotent additive DDL: vote uniqueness, shared rate-limit buckets.

CREATE UNIQUE INDEX IF NOT EXISTS votes_user_topic_unique
  ON votes (user_id, topic_id)
  WHERE topic_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS votes_user_message_unique
  ON votes (user_id, message_id)
  WHERE message_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS poll_votes_poll_user_option_unique
  ON poll_votes (poll_id, user_id, option_id);

CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  bucket_key varchar(255) PRIMARY KEY,
  count integer NOT NULL DEFAULT 0,
  reset_at timestamp with time zone NOT NULL
);

CREATE INDEX IF NOT EXISTS rate_limit_buckets_reset_at_idx
  ON rate_limit_buckets (reset_at);
