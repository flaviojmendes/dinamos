import { verifyStageToken } from './crypto.js';

/** Default read-only stage link lifetime (7 days). */
export const STAGE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function stageTokenExpiresAt(from = new Date()): Date {
  return new Date(from.getTime() + STAGE_TOKEN_TTL_MS);
}

export function isStageTokenValid(
  token: string | null | undefined,
  hash: string | null | undefined,
  expiresAt: Date | string | null | undefined,
  now = new Date(),
): boolean {
  if (!token || !hash) return false;
  if (!verifyStageToken(token, hash)) return false;
  if (expiresAt && new Date(expiresAt) < now) return false;
  return true;
}
