import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Arena rollout config', () => {
  const env = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  it('enables authoritative scoring by default', async () => {
    delete process.env.ARENA_AUTHORITATIVE_SCORING;
    delete process.env.ARENA_TRUST_CLIENT_SCORES;
    const { isAuthoritativeScoringEnabled, isClientScoreTrustEnabled } = await import('../config.js');
    const { requiresServerVerification } = await import('../scoring/recompute.js');
    expect(isAuthoritativeScoringEnabled()).toBe(true);
    expect(isClientScoreTrustEnabled()).toBe(false);
    expect(requiresServerVerification()).toBe(true);
  });

  it('allows legacy client trust only when explicitly enabled with authoritative off', async () => {
    process.env.ARENA_AUTHORITATIVE_SCORING = 'false';
    process.env.ARENA_TRUST_CLIENT_SCORES = 'true';
    const { isAuthoritativeScoringEnabled, isClientScoreTrustEnabled } = await import('../config.js');
    const { requiresServerVerification } = await import('../scoring/recompute.js');
    expect(isAuthoritativeScoringEnabled()).toBe(false);
    expect(isClientScoreTrustEnabled()).toBe(true);
    expect(requiresServerVerification()).toBe(false);
  });

  it('parses canary host ids without secrets', async () => {
    process.env.ARENA_CANARY_HOST_IDS = 'host-a, host-b';
    const { arenaCanaryHostIds, isHostInCanary, isCanaryRestricted } = await import('../config.js');
    expect(isCanaryRestricted()).toBe(true);
    expect(isHostInCanary('host-a')).toBe(true);
    expect(isHostInCanary('other')).toBe(false);
    expect(arenaCanaryHostIds().size).toBe(2);
  });
});
