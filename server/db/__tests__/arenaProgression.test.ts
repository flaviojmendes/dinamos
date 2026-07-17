import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Arena progression schema (0030)', () => {
  it('adds arena stats columns without altering quiz/coins ranking', () => {
    const sql = readFileSync(
      resolve(import.meta.dirname, '../migrations/0030_arena_progression.sql'),
      'utf8',
    );
    expect(sql).toMatch(/arena_matches_played/);
    expect(sql).toMatch(/arena_wins/);
    expect(sql).toMatch(/arena_podiums/);
    expect(sql).toMatch(/progression_recorded/);
    expect(sql).not.toMatch(/DROP TABLE/i);
    expect(sql).not.toMatch(/ranking_score/i);
  });
});
