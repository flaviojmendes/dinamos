import { isGameTelemetryEnabled } from './config.js';

export type GameTelemetryEvent =
  | {
      type: 'score_composition';
      sessionCode: string;
      userId: string;
      roundIndex: number;
      throughput: number;
      availability: number;
      latencyPenalty: number;
      costPenalty: number;
      streakBonus: number;
      nonCompliantSec: number;
      verifiedScore: number;
    }
  | {
      type: 'client_drift';
      sessionCode: string;
      userId: string;
      roundIndex: number;
      clientScore: number;
      verifiedScore: number;
      drift: number;
    }
  | {
      type: 'rejected_write';
      sessionCode: string;
      userId: string;
      reason: string;
      status: number;
      phase?: string;
    }
  | {
      type: 'recompute_duration';
      sessionCode: string;
      roundIndex: number;
      playerCount: number;
      durationMs: number;
      trigger: 'checkpoint' | 'finalize' | 'submit';
    }
  | {
      type: 'sync_failure';
      sessionCode: string;
      operation: string;
      message: string;
    }
  | {
      type: 'lifecycle_transition';
      sessionCode: string;
      fromPhase: string;
      toPhase: string;
      lifecycleVersion: number;
      trigger: 'auto' | 'host';
    }
  | {
      type: 'late_join';
      sessionCode: string;
      userId: string;
      roundIndex: number;
      eligibleFromSec: number;
    };

/** Structured JSON log line for Arena observability (Vercel logs / log drains). */
export function emitGameTelemetry(event: GameTelemetryEvent): void {
  if (!isGameTelemetryEnabled()) return;
  const payload = {
    domain: 'arena',
    ts: new Date().toISOString(),
    ...event,
  };
  console.info(JSON.stringify(payload));
}

export function extractScoreComposition(breakdown: unknown): {
  throughput: number;
  availability: number;
  latencyPenalty: number;
  costPenalty: number;
  streakBonus: number;
  nonCompliantSec: number;
} {
  const b = (breakdown ?? {}) as Record<string, number | undefined>;
  return {
    throughput: b.throughput ?? b.wThroughput ?? 0,
    availability: b.availability ?? b.wSuccess ?? 0,
    latencyPenalty: b.latencyPenalty ?? b.latency_penalty ?? 0,
    costPenalty: b.costPenalty ?? b.cost_penalty ?? 0,
    streakBonus: b.streakBonus ?? b.streak_bonus ?? 0,
    nonCompliantSec: b.nonCompliantSec ?? b.non_compliant_sec ?? 0,
  };
}
