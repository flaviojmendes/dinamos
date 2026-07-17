import { describe, it, expect } from 'vitest';
import { rankPlayers } from '../leaderboard';
import type { VerifiedRoundScore } from '../types';

describe('deterministic leaderboard ranking', () => {
  it('orders by verified score, streak, verified time, join time, user id', () => {
    const verifiedA: VerifiedRoundScore = {
      roundIndex: 0,
      score: 100,
      breakdown: { bestStreak: 5 },
      verifiedAt: '2024-06-01T12:10:00.000Z',
      lifecycleVersion: 1,
      simElapsedSec: 30,
      eligibleFromSec: 0,
    };
    const verifiedB: VerifiedRoundScore = {
      roundIndex: 0,
      score: 100,
      breakdown: { bestStreak: 8 },
      verifiedAt: '2024-06-01T12:09:00.000Z',
      lifecycleVersion: 1,
      simElapsedSec: 30,
      eligibleFromSec: 0,
    };

    const ranked = rankPlayers(
      [
        {
          userId: 'a',
          joinedAt: new Date('2024-06-01T12:00:00Z'),
          lastSubmittedAt: null,
          roundScores: null,
          verifiedRoundScores: { '0': verifiedA },
        },
        {
          userId: 'b',
          joinedAt: new Date('2024-06-01T12:01:00Z'),
          lastSubmittedAt: null,
          roundScores: null,
          verifiedRoundScores: { '0': verifiedB },
        },
      ],
      [{ intervalSec: 60, durationSec: 120, loadProfile: { type: 'constant' }, chaosEvents: [], scoringConfig: {}, weight: 1 }],
    );

    expect(ranked[0].user_id).toBe('b');
    expect(ranked[1].user_id).toBe('a');
  });
});
