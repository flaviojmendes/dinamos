import { createHash, randomBytes, randomInt } from 'node:crypto';

const MATCH_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const JOIN_KEY_ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';

/** Short, unambiguous, URL-friendly match code (no easily confused chars). */
export function generateMatchCode(length = 6): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += MATCH_CODE_ALPHABET[randomInt(MATCH_CODE_ALPHABET.length)];
  }
  return out;
}

/** Secret for private-match invite links. */
export function generateJoinKey(length = 16): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += JOIN_KEY_ALPHABET[randomInt(JOIN_KEY_ALPHABET.length)];
  }
  return out;
}

/** Read-only stage access token (raw value returned once to the host). */
export function generateStageToken(): string {
  return randomBytes(24).toString('base64url');
}

export function hashStageToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function verifyStageToken(token: string, hash: string | null | undefined): boolean {
  if (!hash || !token) return false;
  return hashStageToken(token) === hash;
}
