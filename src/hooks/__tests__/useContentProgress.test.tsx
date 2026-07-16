// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

const api = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn(), post: vi.fn() }));
vi.mock('../../app/utils/api', () => ({ default: api }));

const authState = vi.hoisted(() => ({ user: null as { uid: string } | null }));
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => authState,
}));

import {
  ContentProgressProvider,
  useContentProgress,
  emitProgressUpdate,
  PROGRESS_UPDATED_EVENT,
} from '../useContentProgress';

function wrapper({ children }: { children: ReactNode }) {
  return <ContentProgressProvider>{children}</ContentProgressProvider>;
}

beforeEach(() => {
  localStorage.clear();
  authState.user = null;
  api.get.mockReset().mockResolvedValue({ data: { progress: {} } });
  api.put.mockReset().mockResolvedValue({ data: { updated: { '/a': { completed: true, completedAt: 'x' } } } });
  api.post.mockReset().mockResolvedValue({ data: { progress: {} } });
});

describe('useContentProgress', () => {
  it('throws when used outside the provider', () => {
    expect(() => renderHook(() => useContentProgress())).toThrow(/within a ContentProgressProvider/);
  });

  it('marks paths complete and incomplete (signed out)', () => {
    const { result } = renderHook(() => useContentProgress(), { wrapper });
    act(() => result.current.markAsCompleted('/a', ['/a/b']));
    expect(result.current.isCompleted('/a')).toBe(true);
    expect(result.current.isCompleted('/a/b')).toBe(true);

    act(() => result.current.markAsIncomplete('/a'));
    expect(result.current.isCompleted('/a')).toBe(false);

    act(() => result.current.refreshUI());
    expect(result.current.updateTrigger).toBeGreaterThan(0);
  });

  it('persists progress to localStorage', () => {
    const { result } = renderHook(() => useContentProgress(), { wrapper });
    act(() => result.current.markAsCompleted('/x'));
    const stored = JSON.parse(localStorage.getItem('content-progress') || '{}');
    expect(stored['/x'].completed).toBe(true);
  });

  it('persists to the DB when signed in', async () => {
    authState.user = { uid: 'u1' };
    const { result } = renderHook(() => useContentProgress(), { wrapper });
    await act(async () => {
      result.current.markAsCompleted('/a');
      await Promise.resolve();
    });
    expect(api.put).toHaveBeenCalledWith('/api/progress', expect.objectContaining({ path: '/a' }));
  });

  it('migrates local progress on first sign-in', async () => {
    localStorage.setItem('content-progress', JSON.stringify({ '/old': { completed: true, completedAt: 'x' } }));
    api.post.mockResolvedValue({ data: { progress: { '/old': { completed: true, completedAt: 'x' } } } });
    authState.user = { uid: 'u1' };
    await act(async () => {
      render(<ContentProgressProvider><div>child</div></ContentProgressProvider>);
      await Promise.resolve();
    });
    expect(api.post).toHaveBeenCalledWith('/api/progress/migrate', expect.anything());
  });

  it('loads server progress when already migrated', async () => {
    authState.user = { uid: 'u1' };
    localStorage.setItem('content-progress-migrated:u1', 'true');
    await act(async () => {
      render(<ContentProgressProvider><div>child</div></ContentProgressProvider>);
      await Promise.resolve();
    });
    expect(api.get).toHaveBeenCalledWith('/api/progress');
  });

  it('emitProgressUpdate dispatches the legacy event', () => {
    const handler = vi.fn();
    window.addEventListener(PROGRESS_UPDATED_EVENT, handler);
    emitProgressUpdate();
    expect(handler).toHaveBeenCalled();
    window.removeEventListener(PROGRESS_UPDATED_EVENT, handler);
  });

  it('renders children', () => {
    render(<ContentProgressProvider><span>hello-child</span></ContentProgressProvider>);
    expect(screen.getByText('hello-child')).toBeInTheDocument();
  });
});
