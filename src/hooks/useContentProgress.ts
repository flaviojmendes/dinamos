import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import api from '../app/utils/api';
import { useAuth } from '../contexts/AuthContext';

interface ContentProgressEntry {
  completed: boolean;
  completedAt: string;
}

interface ContentProgress {
  [path: string]: ContentProgressEntry;
}

const STORAGE_KEY = 'content-progress';

// Custom event kept for backwards compatibility with callers that fire it after
// a mutation. State now lives in a shared context, so updates already propagate
// to every consumer automatically — this is effectively a no-op safety net.
export const PROGRESS_UPDATED_EVENT = 'content-progress-updated';

export function emitProgressUpdate() {
  window.dispatchEvent(new CustomEvent(PROGRESS_UPDATED_EVENT));
}

function readLocalProgress(): ContentProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as ContentProgress) : {};
  } catch {
    return {};
  }
}

function migratedFlagKey(uid: string) {
  return `content-progress-migrated:${uid}`;
}

interface ContentProgressContextValue {
  progress: ContentProgress;
  markAsCompleted: (path: string, childPaths?: string[]) => void;
  markAsIncomplete: (path: string, childPaths?: string[]) => void;
  isCompleted: (path: string) => boolean;
  refreshUI: () => void;
  updateTrigger: number;
}

const ContentProgressContext = createContext<ContentProgressContextValue | null>(null);

export function ContentProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  // Seed from localStorage so progress renders instantly and still works while
  // signed out / offline. The DB becomes the source of truth once authenticated.
  const [progress, setProgress] = useState<ContentProgress>(() => readLocalProgress());
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const applyProgress = useCallback((next: ContentProgress) => {
    progressRef.current = next;
    setProgress(next);
    setUpdateTrigger((n) => n + 1);
  }, []);

  // Persist a local cache on every change (cross-tab sync + offline fallback).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* storage may be unavailable (private mode); ignore. */
    }
  }, [progress]);

  // Keep tabs in sync via the storage event.
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        applyProgress(e.newValue ? (JSON.parse(e.newValue) as ContentProgress) : {});
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [applyProgress]);

  // On sign-in: seamlessly migrate any local progress to the DB (once), then
  // adopt the server state as the source of truth.
  useEffect(() => {
    if (!uid) return;
    let cancelled = false;

    (async () => {
      try {
        const local = readLocalProgress();
        const alreadyMigrated = localStorage.getItem(migratedFlagKey(uid)) === 'true';

        if (!alreadyMigrated && Object.keys(local).length > 0) {
          const res = await api.post('/api/progress/migrate', { progress: local });
          if (!cancelled && res.data?.progress) {
            applyProgress(res.data.progress as ContentProgress);
          }
        } else {
          const res = await api.get('/api/progress');
          if (!cancelled && res.data?.progress) {
            applyProgress(res.data.progress as ContentProgress);
          }
        }
        localStorage.setItem(migratedFlagKey(uid), 'true');
      } catch (error) {
        console.error('Failed to sync content progress:', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uid, applyProgress]);

  const setPaths = useCallback(
    (paths: string[], completed: boolean) => {
      const completedAt = new Date().toISOString();
      const next: ContentProgress = { ...progressRef.current };
      for (const p of paths) {
        next[p] = { completed, completedAt };
      }
      applyProgress(next);

      // Persist to the DB when signed in; reconcile with the authoritative map.
      if (uid && paths.length > 0) {
        const [path, ...childPaths] = paths;
        api
          .put('/api/progress', { path, completed, paths: childPaths })
          .then((res) => {
            if (res.data?.progress) applyProgress(res.data.progress as ContentProgress);
          })
          .catch((error) => console.error('Failed to save content progress:', error));
      }
    },
    [uid, applyProgress],
  );

  const markAsCompleted = useCallback(
    (path: string, childPaths: string[] = []) => setPaths([path, ...childPaths], true),
    [setPaths],
  );

  const markAsIncomplete = useCallback(
    (path: string, childPaths: string[] = []) => setPaths([path, ...childPaths], false),
    [setPaths],
  );

  const isCompleted = useCallback(
    (path: string) => progress[path]?.completed || false,
    [progress],
  );

  const refreshUI = useCallback(() => setUpdateTrigger((n) => n + 1), []);

  const value = useMemo<ContentProgressContextValue>(
    () => ({ progress, markAsCompleted, markAsIncomplete, isCompleted, refreshUI, updateTrigger }),
    [progress, markAsCompleted, markAsIncomplete, isCompleted, refreshUI, updateTrigger],
  );

  return createElement(ContentProgressContext.Provider, { value }, children);
}

export function useContentProgress(): ContentProgressContextValue {
  const ctx = useContext(ContentProgressContext);
  if (!ctx) {
    throw new Error('useContentProgress must be used within a ContentProgressProvider');
  }
  return ctx;
}
