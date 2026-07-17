import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createDbMock } from '../../__tests__/_helpers/dbMock';

const mockDb = createDbMock();
vi.mock('../client', () => ({ db: mockDb.db }));

describe('adjacent hardening schema (0029)', () => {
  it('migration 0029 adds vote uniqueness and rate-limit storage', () => {
    const sql = readFileSync(
      resolve(import.meta.dirname, '../migrations/0029_adjacent_hardening.sql'),
      'utf8',
    );
    expect(sql).toMatch(/votes_user_topic_unique/);
    expect(sql).toMatch(/votes_user_message_unique/);
    expect(sql).toMatch(/poll_votes_poll_user_option_unique/);
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS rate_limit_buckets/);
    expect(sql).not.toMatch(/DROP TABLE/i);
  });
});

describe('incrementRateLimitBucket', () => {
  beforeEach(() => {
    mockDb.reset();
    vi.resetModules();
  });

  it('falls back to in-memory counters when Postgres is unavailable', async () => {
    const { incrementRateLimitBucket, resetMemoryRateLimitBuckets } = await import(
      '../../lib/rateLimitStore.js'
    );
    resetMemoryRateLimitBuckets();
    mockDb.db.execute = vi.fn(async () => {
      throw new Error('db down');
    });

    const first = await incrementRateLimitBucket('test:key', 60_000, 2);
    const second = await incrementRateLimitBucket('test:key', 60_000, 2);
    const third = await incrementRateLimitBucket('test:key', 60_000, 2);

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
  });
});
