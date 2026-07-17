import type { GameArchitecture } from '../../../src/components/SystemEditor/game/types';
import type { RoundConfig } from '../../../src/components/SystemEditor/game/types';
import type { RoundSnapshot, PlayerRoundArchSnapshot, VerifiedRoundScore } from './types.js';

export function captureRoundSnapshot(
  round: RoundConfig,
  roundIndex: number,
  capturedAt = new Date(),
): RoundSnapshot {
  return {
    roundIndex,
    capturedAt: capturedAt.toISOString(),
    loadProfile: round.loadProfile,
    chaosEvents: [...round.chaosEvents],
    scoringConfig: { ...round.scoringConfig },
    weight: round.weight,
    durationSec: round.durationSec,
    intervalSec: round.intervalSec,
  };
}

export function capturePlayerArchSnapshot(
  architecture: GameArchitecture,
  roundIndex: number,
  origin: PlayerRoundArchSnapshot['origin'],
  capturedAt = new Date(),
): PlayerRoundArchSnapshot {
  return {
    roundIndex,
    capturedAt: capturedAt.toISOString(),
    architecture: JSON.parse(JSON.stringify(architecture)) as GameArchitecture,
    origin,
  };
}

export function readRoundSnapshots(
  raw: unknown,
): Record<string, RoundSnapshot> {
  if (!raw || typeof raw !== 'object') return {};
  return raw as Record<string, RoundSnapshot>;
}

export function readPlayerArchSnapshots(
  raw: unknown,
): Record<string, PlayerRoundArchSnapshot> {
  if (!raw || typeof raw !== 'object') return {};
  return raw as Record<string, PlayerRoundArchSnapshot>;
}

export function readVerifiedRoundScores(raw: unknown): Record<string, VerifiedRoundScore> {
  if (!raw || typeof raw !== 'object') return {};
  return raw as Record<string, VerifiedRoundScore>;
}

export function getRoundSnapshot(
  snapshots: Record<string, RoundSnapshot>,
  roundIndex: number,
): RoundSnapshot | null {
  return snapshots[String(roundIndex)] ?? null;
}

export function getPlayerArchSnapshot(
  snapshots: Record<string, PlayerRoundArchSnapshot>,
  roundIndex: number,
): PlayerRoundArchSnapshot | null {
  return snapshots[String(roundIndex)] ?? null;
}

export function mergeRoundSnapshot(
  existing: Record<string, RoundSnapshot>,
  snapshot: RoundSnapshot,
): Record<string, RoundSnapshot> {
  const key = String(snapshot.roundIndex);
  if (existing[key]) return existing;
  return { ...existing, [key]: snapshot };
}

export function mergePlayerArchSnapshot(
  existing: Record<string, PlayerRoundArchSnapshot>,
  snapshot: PlayerRoundArchSnapshot,
): Record<string, PlayerRoundArchSnapshot> {
  const key = String(snapshot.roundIndex);
  if (existing[key]) return existing;
  return { ...existing, [key]: snapshot };
}

/** Append a host-injected chaos event to the frozen round snapshot. */
export function appendChaosToRoundSnapshot(
  snapshot: RoundSnapshot,
  event: RoundConfig['chaosEvents'][number],
): RoundSnapshot {
  const id = (event as { id?: string }).id;
  if (id && snapshot.chaosEvents.some((e: { id?: string }) => (e as { id?: string }).id === id)) {
    return snapshot;
  }
  return {
    ...snapshot,
    chaosEvents: [...snapshot.chaosEvents, event],
  };
}

export function mergeVerifiedRoundScore(
  existing: Record<string, VerifiedRoundScore>,
  entry: VerifiedRoundScore,
): Record<string, VerifiedRoundScore> {
  const key = String(entry.roundIndex);
  const prev = existing[key];
  if (prev && prev.lifecycleVersion >= entry.lifecycleVersion) return existing;
  return { ...existing, [key]: entry };
}
