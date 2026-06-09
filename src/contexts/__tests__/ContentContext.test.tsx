// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

const api = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock('../../app/utils/api', () => ({ default: api }));

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

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ContentContext', () => {
  it('loads modules and pages and marks itself ready', async () => {
    api.get.mockImplementation((url: string) => {
      if (url === '/api/modules') {
        return Promise.resolve({ data: { modules: [{ id: 'm1', label: 'M1', tier: 'core', base: '/m1', orderIndex: 0 }] } });
      }
      return Promise.resolve({ data: { pages: [{ slug: 's1', path: '/p1', moduleId: 'm1', orderIndex: 0, simulatorKey: null, titleEn: 'T', titlePt: 'T' }] } });
    });

    const { result } = renderHook(() => useContent(), { wrapper });
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.loading).toBe(false);
    expect(result.current.modules).toHaveLength(1);
    expect(result.current.pages).toHaveLength(1);
    expect(registry.setRegistryModules).toHaveBeenCalled();
    expect(registry.setRegistryLessons).toHaveBeenCalled();
  });

  it('resets to empty state when the index fails to load', async () => {
    api.get.mockRejectedValue(new Error('network'));
    const { result } = renderHook(() => useContent(), { wrapper });
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.modules).toEqual([]);
    expect(result.current.pages).toEqual([]);
    expect(registry.setRegistryModules).toHaveBeenCalledWith([]);
  });
});
