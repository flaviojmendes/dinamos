import { useSyncExternalStore } from 'react';

export interface PublicSettings { dioramas_enabled: boolean }

const REFRESH_MS = 30_000;
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
const listeners = new Set<() => void>();
let settings: PublicSettings | null = null;
let updatedAt = 0;
let revision = 0;
let pending: Promise<void> | null = null;
let interval: ReturnType<typeof setInterval> | undefined;

function notify() { listeners.forEach(listener => listener()); }
function valid(value: unknown): value is PublicSettings {
  return typeof value === 'object' && value !== null &&
    typeof (value as PublicSettings).dioramas_enabled === 'boolean';
}

/** Publish only a server-confirmed save. Older requests cannot undo an admin change. */
export function publishPublicSettings(value: PublicSettings) {
  if (!valid(value)) throw new Error('Invalid public settings');
  revision++;
  settings = { dioramas_enabled: value.dioramas_enabled };
  updatedAt = Date.now();
  notify();
}

function refresh() {
  if (pending) return pending;
  const startedAtRevision = revision;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  const request = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/settings/public`, {
        cache: 'no-store', credentials: 'same-origin', signal: controller.signal,
      });
      if (!response.ok) throw new Error('Settings unavailable');
      const value: unknown = await response.json();
      if (!valid(value)) throw new Error('Invalid public settings');
      if (revision !== startedAtRevision) return;
      settings = { dioramas_enabled: value.dioramas_enabled };
      updatedAt = Date.now();
      notify();
    } catch {
      if (revision !== startedAtRevision) return;
      // Optional scenes stay off when the global setting cannot be verified.
      settings = null;
      updatedAt = 0;
      notify();
    } finally {
      clearTimeout(timeout);
    }
  })();
  pending = request;
  void request.then(() => { if (pending === request) pending = null; });
  return request;
}

function revalidate() {
  if (document.hidden) return;
  if (Date.now() - updatedAt >= REFRESH_MS) {
    // A tab returning after a long absence must not show an old enabled state.
    settings = null;
    notify();
    void refresh();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    if (!settings || Date.now() - updatedAt >= REFRESH_MS) {
      settings = null;
      notify();
      void refresh();
    }
    interval = setInterval(() => { if (!document.hidden) void refresh(); }, REFRESH_MS);
    window.addEventListener('focus', revalidate);
    window.addEventListener('online', revalidate);
    document.addEventListener('visibilitychange', revalidate);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size) return;
    clearInterval(interval);
    window.removeEventListener('focus', revalidate);
    window.removeEventListener('online', revalidate);
    document.removeEventListener('visibilitychange', revalidate);
  };
}

/** Only mounted by eligible lesson embeds. No Firebase or API client side effects. */
export function usePublicSettings(): PublicSettings | null {
  return useSyncExternalStore(subscribe, () => settings, () => null);
}
