import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { gameSessions, gamePlayers } from '../schema';

describe('Arena schema foundation (0028)', () => {
  it('declares session lifecycle and moderation columns', () => {
    const names = Object.keys(gameSessions);
    expect(names).toContain('intervalStartedAt');
    expect(names).toContain('intervalEndsAt');
    expect(names).toContain('pausedAt');
    expect(names).toContain('totalPausedMs');
    expect(names).toContain('autoTransitions');
    expect(names).toContain('lifecycleVersion');
    expect(names).toContain('roundSnapshots');
    expect(names).toContain('kickedUserIds');
    expect(names).toContain('maxPlayers');
    expect(names).toContain('stageTokenHash');
    expect(names).toContain('stageTokenExpiresAt');
  });

  it('declares player eligibility and verified score columns', () => {
    const names = Object.keys(gamePlayers);
    expect(names).toContain('eligibleFromSec');
    expect(names).toContain('roundArchSnapshots');
    expect(names).toContain('verifiedRoundScores');
  });

  it('migration 0028 is idempotent additive DDL', () => {
    const sql = readFileSync(
      resolve(import.meta.dirname, '../migrations/0028_arena_integrity.sql'),
      'utf8',
    );
    expect(sql).toMatch(/ADD COLUMN IF NOT EXISTS/);
    expect(sql).not.toMatch(/DROP TABLE/i);
    expect(sql).toMatch(/interval_started_at/);
    expect(sql).toMatch(/verified_round_scores/);
  });
});
