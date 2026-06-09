// Opaque, anonymous visitor id used only so the backend can compute distinct
// visitor counts for content analytics. It is NOT tied to any account and never
// leaves the device except as a value the server immediately one-way hashes.
const VISITOR_ID_KEY = 'analytics-visitor-id';

function randomId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through to manual id */
  }
  return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Lazily create + persist an anonymous visitor id in localStorage. */
export function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;
    const fresh = randomId();
    localStorage.setItem(VISITOR_ID_KEY, fresh);
    return fresh;
  } catch {
    // Private mode / storage unavailable: a per-session id is good enough.
    return randomId();
  }
}
