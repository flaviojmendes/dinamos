import { runRound } from '../../../../src/components/SystemEditor/engine/roundRunner.js';
import { SCORING_RECOMPUTE_CHECKPOINT_SEC } from '../../../../src/components/SystemEditor/engine/constants.js';
import { HTTPException } from 'hono/http-exception';
import type { GameArchitecture } from '../../../../src/components/SystemEditor/game/types';
import type { RoundConfig } from '../../../../src/components/SystemEditor/game/types';
import type { VerifiedRoundScore } from '../types';
import type { EligibilityWindow } from '../eligibility';
import { emitGameTelemetry, extractScoreComposition } from '../telemetry.js';
import { isClientScoreTrustEnabled, isAuthoritativeScoringEnabled } from '../config.js';

/** Allow small float drift between client preview and server recompute. */
export const SCORE_DRIFT_TOLERANCE = 2;

export function isForgedClientScore(clientScore: number, verifiedScore: number): boolean {
  return clientScore > verifiedScore + SCORE_DRIFT_TOLERANCE;
}

export interface RecomputeParams {
  architecture: GameArchitecture;
  seed: number;
  roundSnapshot: {
    loadProfile: RoundConfig['loadProfile'];
    chaosEvents: RoundConfig['chaosEvents'];
    scoringConfig: RoundConfig['scoringConfig'];
    durationSec: number;
  };
  eligibility: EligibilityWindow;
  roundIndex: number;
  lifecycleVersion: number;
}

export function recomputeVerifiedRoundScore(params: RecomputeParams): VerifiedRoundScore {
  const { roundSnapshot, eligibility, architecture, seed, roundIndex, lifecycleVersion } =
    params;

  const tickCount = roundSnapshot.durationSec;
  const result = runRound({
    architecture,
    seed,
    loadProfile: roundSnapshot.loadProfile,
    chaosEvents: roundSnapshot.chaosEvents,
    scoringConfig: roundSnapshot.scoringConfig,
    tickCount,
    eligibleFromTick: eligibility.eligibleFromTick,
    eligibleToTick: Math.max(eligibility.eligibleFromTick, eligibility.eligibleToTick),
  });

  return {
    roundIndex,
    score: Number.isFinite(result.roundedScore) ? result.roundedScore : 0,
    breakdown: result.score,
    verifiedAt: new Date().toISOString(),
    lifecycleVersion,
    simElapsedSec: eligibility.simElapsedSec,
    eligibleFromSec: eligibility.eligibleFromSec,
  };
}

export function computeVerifiedAggregate(
  rounds: RoundConfig[],
  verified: Record<string, VerifiedRoundScore>,
): number {
  let total = 0;
  for (const [key, entry] of Object.entries(verified)) {
    const idx = Number(key);
    const weight = rounds[idx]?.weight ?? 1;
    total += weight * (entry?.score ?? 0);
  }
  return total;
}

/** Whether a checkpoint recompute should run for this player this poll. */
export function shouldRunCheckpoint(
  simElapsedSec: number,
  lastVerified: VerifiedRoundScore | null | undefined,
): boolean {
  if (simElapsedSec <= 0) return false;
  if (!lastVerified) return simElapsedSec >= SCORING_RECOMPUTE_CHECKPOINT_SEC;
  const lastElapsed = lastVerified.simElapsedSec ?? 0;
  return simElapsedSec - lastElapsed >= SCORING_RECOMPUTE_CHECKPOINT_SEC;
}

/** Finalization always runs at round end even if checkpoints were skipped. */
export function shouldFinalizeRound(
  phase: string,
  roundIndex: number,
  verified: Record<string, VerifiedRoundScore>,
  lifecycleVersion: number,
): boolean {
  if (phase !== 'interval' && phase !== 'ended') return false;
  const entry = verified[String(roundIndex)];
  if (!entry) return true;
  return entry.lifecycleVersion < lifecycleVersion;
}

export function assertClientScoreNotForged(
  clientScore: number | undefined,
  verifiedScore: number,
  meta?: { sessionCode: string; userId: string; roundIndex: number },
): void {
  if (clientScore === undefined) return;
  const safeVerified = Number.isFinite(verifiedScore) ? verifiedScore : 0;
  if (isForgedClientScore(clientScore, safeVerified)) {
    if (meta) {
      emitGameTelemetry({
        type: 'client_drift',
        sessionCode: meta.sessionCode,
        userId: meta.userId,
        roundIndex: meta.roundIndex,
        clientScore,
        verifiedScore: safeVerified,
        drift: clientScore - safeVerified,
      });
    }
    throw new HTTPException(403, { message: 'Submitted score exceeds server verification' });
  }
}

/** Whether server must recompute instead of trusting client round_score. */
export function requiresServerVerification(): boolean {
  return isAuthoritativeScoringEnabled() && !isClientScoreTrustEnabled();
}

export function emitVerifiedScoreComposition(
  sessionCode: string,
  userId: string,
  roundIndex: number,
  verified: VerifiedRoundScore,
): void {
  const parts = extractScoreComposition(verified.breakdown);
  emitGameTelemetry({
    type: 'score_composition',
    sessionCode,
    userId,
    roundIndex,
    ...parts,
    verifiedScore: verified.score,
  });
}

export { SCORING_RECOMPUTE_CHECKPOINT_SEC };
