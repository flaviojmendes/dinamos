/**
 * Arena rollout flags. Authoritative server scoring is on by default.
 * The legacy client-trust path is opt-in only for emergency rollback.
 */

/** Server recomputation drives leaderboard totals (default: true). */
export function isAuthoritativeScoringEnabled(): boolean {
  return process.env.ARENA_AUTHORITATIVE_SCORING !== 'false';
}

/**
 * Insecure compatibility path: accept client round_score without verification.
 * Disabled by default — enable only for controlled rollback (`ARENA_TRUST_CLIENT_SCORES=true`).
 */
export function isClientScoreTrustEnabled(): boolean {
  return process.env.ARENA_TRUST_CLIENT_SCORES === 'true';
}

/** When true, structured game telemetry is emitted (default: true in production). */
export function isGameTelemetryEnabled(): boolean {
  if (process.env.ARENA_TELEMETRY === 'false') return false;
  if (process.env.ARENA_TELEMETRY === 'true') return true;
  return process.env.NODE_ENV !== 'test';
}

/** Internal hosts canary: comma-separated Firebase uids allowed before full rollout. */
export function arenaCanaryHostIds(): Set<string> {
  const raw = process.env.ARENA_CANARY_HOST_IDS ?? '';
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

/** When set, only canary hosts may create new authoritative matches. Empty = full rollout. */
export function isCanaryRestricted(): boolean {
  return arenaCanaryHostIds().size > 0;
}

export function isHostInCanary(hostId: string | null | undefined): boolean {
  const ids = arenaCanaryHostIds();
  if (ids.size === 0) return true;
  return hostId != null && ids.has(hostId);
}
