// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { ReactNode } from 'react';

const delivery = vi.hoisted(() => ({
  loadContentIndex: vi.fn(),
  reloadContentFromApi: vi.fn(),
}));
vi.mock('../../contentDelivery', () => ({
  loadContentIndex: delivery.loadContentIndex,
  reloadContentFromApi: delivery.reloadContentFromApi,
}));

const registry = vi.hoisted(() => ({
  setRegistryLessons: vi.fn(),
  setRegistryModules: vi.fn(),
}));
vi.mock('../../config/contentRegistry', () => ({
  setRegistryLessons: registry.setRegistryLessons,
  setRegistryModules: registry.setRegistryModules,
}));

import { ContentProvider, useContent } from '../ContentContext';

const wrapper = ({ children }: { children: ReactNode }) => <ContentProvider>{children}</ContentProvider>;

const sampleIndex = {
  modules: [{ id: 'm1', label: 'M1', tier: 'CORE', base: '/m1', orderIndex: 0 }],
  pages: [{ slug: 's1', path: '/p1', moduleId: 'm1', orderIndex: 0, simulatorKey: null, titleEn: 'T', titlePt: 'T' }],
};

beforeEach(() => {
  vi.clearAllMocks();
  delivery.loadContentIndex.mockResolvedValue(sampleIndex);
});

describe('ContentContext', () => {
  it('loads modules and pages from CDN delivery and marks itself ready', async () => {
    const { result } = renderHook(() => useContent(), { wrapper });
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.loading).toBe(false);
    expect(result.current.modules).toHaveLength(1);
    expect(result.current.pages).toHaveLength(1);
    expect(delivery.loadContentIndex).toHaveBeenCalledWith({ forceApi: false });
    expect(registry.setRegistryModules).toHaveBeenCalled();
    expect(registry.setRegistryLessons).toHaveBeenCalled();
  });

  it('resets to empty state when the index fails to load', async () => {
    delivery.loadContentIndex.mockRejectedValue(new Error('network'));
    const { result } = renderHook(() => useContent(), { wrapper });
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.modules).toEqual([]);
    expect(result.current.pages).toEqual([]);
    expect(registry.setRegistryModules).toHaveBeenCalledWith([]);
  });

  it('reload refreshes from the API for admin CMS edits', async () => {
    const { result } = renderHook(() => useContent(), { wrapper });
    await waitFor(() => expect(result.current.ready).toBe(true));

    act(() => {
      result.current.reload();
    });

    await waitFor(() => expect(delivery.loadContentIndex).toHaveBeenLastCalledWith({ forceApi: true }));
    expect(delivery.reloadContentFromApi).toHaveBeenCalled();
  });
});
