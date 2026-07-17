import { describe, expect, it } from 'vitest';
import { generateStageToken, hashStageToken } from '../crypto.js';
import { isStageTokenValid, stageTokenExpiresAt, STAGE_TOKEN_TTL_MS } from '../stageToken.js';

describe('stageToken', () => {
  it('accepts a matching unexpired token', () => {
    const raw = generateStageToken();
    const hash = hashStageToken(raw);
    const expiresAt = stageTokenExpiresAt();
    expect(isStageTokenValid(raw, hash, expiresAt)).toBe(true);
  });

  it('rejects expired tokens', () => {
    const raw = generateStageToken();
    const hash = hashStageToken(raw);
    const expired = new Date(Date.now() - 1000);
    expect(isStageTokenValid(raw, hash, expired)).toBe(false);
  });

  it('rejects mismatched tokens', () => {
    const hash = hashStageToken(generateStageToken());
    expect(isStageTokenValid(generateStageToken(), hash, stageTokenExpiresAt())).toBe(false);
  });

  it('defaults TTL to seven days', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    expect(stageTokenExpiresAt(now).getTime() - now.getTime()).toBe(STAGE_TOKEN_TTL_MS);
  });
});
