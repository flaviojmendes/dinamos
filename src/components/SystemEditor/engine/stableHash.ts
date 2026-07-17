import SHA256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';
import Utf8 from 'crypto-js/enc-utf8';

/**
 * Collision-resistant stable digest for architecture snapshots.
 * Uses SHA-256 over a key-sorted JSON representation so browser and server agree.
 */
export function stableHash(value: unknown): string {
  const json = stableStringify(value);
  return SHA256(Utf8.parse(json)).toString(Hex);
}

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((v) => stableStringify(v)).join(',')}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`;
}
