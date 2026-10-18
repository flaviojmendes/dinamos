// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let store: typeof import('../usePublicSettings');
const fetchSettings = vi.fn();
const response = (enabled: boolean) => ({ ok: true, json: async () => ({ dioramas_enabled: enabled }) });

beforeEach(async () => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-18T12:00:00Z'));
  vi.stubGlobal('fetch', fetchSettings);
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
  fetchSettings.mockReset().mockResolvedValue(response(true));
  store = await import('../usePublicSettings');
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('global public settings', () => {
  it('starts unverified and shares one uncached request across lesson consumers', async () => {
    const first = renderHook(() => store.usePublicSettings());
    const second = renderHook(() => store.usePublicSettings());
    expect(first.result.current).toBeNull();
    await act(async () => {});
    expect(first.result.current).toEqual({ dioramas_enabled: true });
    expect(second.result.current).toEqual({ dioramas_enabled: true });
    expect(fetchSettings).toHaveBeenCalledTimes(1);
    expect(fetchSettings).toHaveBeenCalledWith('/api/settings/public', expect.objectContaining({ cache: 'no-store', credentials: 'same-origin' }));
  });

  it('receives another admin’s change on the next refresh and stops polling after unmount', async () => {
    const view = renderHook(() => store.usePublicSettings());
    await act(async () => {});
    fetchSettings.mockResolvedValue(response(false));
    await act(async () => { await vi.advanceTimersByTimeAsync(30_000); });
    expect(view.result.current).toEqual({ dioramas_enabled: false });
    expect(fetchSettings).toHaveBeenCalledTimes(2);
    view.unmount();
    await act(async () => { await vi.advanceTimersByTimeAsync(60_000); window.dispatchEvent(new Event('focus')); });
    expect(fetchSettings).toHaveBeenCalledTimes(2);
  });

  it('does not let an older in-flight GET undo a confirmed admin save', async () => {
    let resolve!: (value: ReturnType<typeof response>) => void;
    fetchSettings.mockReturnValue(new Promise(done => { resolve = done; }));
    const view = renderHook(() => store.usePublicSettings());
    act(() => { store.publishPublicSettings({ dioramas_enabled: false }); });
    expect(view.result.current).toEqual({ dioramas_enabled: false });
    await act(async () => { resolve(response(true)); });
    expect(view.result.current).toEqual({ dioramas_enabled: false });
    act(() => { store.publishPublicSettings({ dioramas_enabled: true }); });
    expect(view.result.current).toEqual({ dioramas_enabled: true });
  });

  it('hides optional dioramas after a failed refresh and recovers on the next successful read', async () => {
    const view = renderHook(() => store.usePublicSettings());
    await act(async () => {});
    expect(view.result.current?.dioramas_enabled).toBe(true);
    fetchSettings.mockRejectedValue(new Error('offline'));
    await act(async () => { await vi.advanceTimersByTimeAsync(30_000); });
    expect(view.result.current).toBeNull();
    fetchSettings.mockResolvedValue(response(false));
    await act(async () => { await vi.advanceTimersByTimeAsync(30_000); });
    expect(view.result.current).toEqual({ dioramas_enabled: false });
  });

  it('refreshes a stale background tab on return without crediting an old enabled state', async () => {
    const view = renderHook(() => store.usePublicSettings());
    await act(async () => {});
    vi.setSystemTime(new Date('2026-10-18T12:02:00Z'));
    let resolve!: (value: ReturnType<typeof response>) => void;
    fetchSettings.mockReturnValue(new Promise(done => { resolve = done; }));
    act(() => { window.dispatchEvent(new Event('focus')); });
    expect(view.result.current).toBeNull();
    await act(async () => { resolve(response(false)); });
    expect(view.result.current).toEqual({ dioramas_enabled: false });
  });

  it('rejects malformed responses rather than treating string false as enabled', async () => {
    fetchSettings.mockResolvedValue({ ok: true, json: async () => ({ dioramas_enabled: 'false' }) });
    const view = renderHook(() => store.usePublicSettings());
    await act(async () => {});
    expect(view.result.current).toBeNull();
  });
});
