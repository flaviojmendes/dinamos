// Shared Arena game types aligned with migration 0028 and server recomputation.

import type { GameArchitecture, GamePhase, RoundConfig } from '../../../src/components/SystemEditor/game/types';

/** Immutable round snapshot stored on game_sessions.round_snapshots. */
export interface RoundSnapshot {
  roundIndex: number;
  capturedAt: string;
  loadProfile: RoundConfig['loadProfile'];
  chaosEvents: RoundConfig['chaosEvents'];
  scoringConfig: RoundConfig['scoringConfig'];
  weight: number;
  durationSec: number;
  intervalSec: number;
}

/** Per-round architecture snapshot stored on game_players.round_arch_snapshots. */
export interface PlayerRoundArchSnapshot {
  roundIndex: number;
  capturedAt: string;
  architecture: GameArchitecture;
  origin: 'round_start' | 'late_join';
}

/** Verified server recomputation result stored on game_players.verified_round_scores. */
export interface VerifiedRoundScore {
  roundIndex: number;
  score: number;
  breakdown: unknown;
  verifiedAt: string;
  lifecycleVersion: number;
  simElapsedSec: number;
  eligibleFromSec: number;
}

export interface SessionLifecycleFields {
  intervalStartedAt: Date | null;
  intervalEndsAt: Date | null;
  pausedAt: Date | null;
  totalPausedMs: number;
  autoTransitions: boolean;
  lifecycleVersion: number;
  roundSnapshots: Record<string, RoundSnapshot> | null;
  kickedUserIds: string[];
  maxPlayers: number;
  stageTokenHash: string | null;
  stageTokenExpiresAt: Date | null;
}

export interface PlayerEligibilityFields {
  eligibleFromSec: number | null;
  roundArchSnapshots: Record<string, PlayerRoundArchSnapshot> | null;
  verifiedRoundScores: Record<string, VerifiedRoundScore> | null;
}

export type { GamePhase };
