/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppBreakpoint, APP_BREAKPOINT_PX } from '../../hooks/useAppBreakpoint';

describe('useAppBreakpoint', () => {
  const listeners = new Map<string, Set<() => void>>();

  beforeEach(() => {
    listeners.clear();
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes(`${APP_BREAKPOINT_PX - 1}px`),
      media: query,
      addEventListener: (_: string, cb: () => void) => {
        if (!listeners.has(query)) listeners.set(query, new Set());
        listeners.get(query)!.add(cb);
      },
      removeEventListener: (_: string, cb: () => void) => {
        listeners.get(query)?.delete(cb);
      },
      addListener: (cb: () => void) => {
        if (!listeners.has(query)) listeners.set(query, new Set());
        listeners.get(query)!.add(cb);
      },
      removeListener: (cb: () => void) => {
        listeners.get(query)?.delete(cb);
      },
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports compact and touch layout below the shared breakpoint', () => {
    const { result } = renderHook(() => useAppBreakpoint());
    expect(result.current.isCompact).toBe(true);
    expect(result.current.isTouchLayout).toBe(true);
  });
});
