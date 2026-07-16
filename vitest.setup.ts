import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * Node 22+ may expose an experimental `localStorage` without a working `clear()`.
 * Remove it so jsdom (or our fallback below) provides a full Storage implementation.
 */
if (
  typeof globalThis.localStorage !== 'undefined' &&
  typeof globalThis.localStorage.clear !== 'function'
) {
  // @ts-expect-error drop incomplete Node Web Storage shim
  delete globalThis.localStorage;
}

function installLocalStorageFallback(): void {
  if (
    typeof globalThis.localStorage !== 'undefined' &&
    typeof globalThis.localStorage.clear === 'function'
  ) {
    return;
  }

  const store = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return [...store.keys()][index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
  };

  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    writable: true,
    configurable: true,
  });
}

installLocalStorageFallback();

// Ensure React Testing Library unmounts components between tests so the jsdom
// document does not leak state across cases.
afterEach(() => {
  cleanup();
});
