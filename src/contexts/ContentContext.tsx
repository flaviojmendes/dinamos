import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../app/utils/api';
import {
  setRegistryLessons,
  setRegistryModules,
  type LessonEntry,
  type ModuleDef,
} from '../config/contentRegistry';

/**
 * ContentContext — loads the lesson index from the content API once at startup
 * and feeds it to the navigation registry. Lesson pages are now DB-backed, so
 * routing (App.tsx) and the sidebar/search/nav (contentRegistry) derive from
 * this fetched list instead of a static manifest.
 */

interface ContentContextValue {
  pages: LessonEntry[];
  modules: ModuleDef[];
  loading: boolean;
  /** True once the index has loaded (success or failure), so routes can mount. */
  ready: boolean;
  reload: () => void;
}

const ContentContext = createContext<ContentContextValue>({
  pages: [],
  modules: [],
  loading: true,
  ready: false,
  reload: () => {},
});

interface ApiIndexEntry {
  slug: string;
  path: string;
  moduleId: string | null;
  orderIndex: number;
  simulatorKey: string | null;
  titleEn: string | null;
  titlePt: string | null;
}

interface ApiModuleEntry {
  id: string;
  label: string;
  tier: ModuleDef['tier'];
  base: string;
  paths?: string[];
  orderIndex: number;
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<LessonEntry[]>([]);
  const [modules, setModules] = useState<ModuleDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // Modules must be applied before lessons, since the lesson registry derives
    // tiers/module-by-path from the module list.
    Promise.all([
      api.get<{ modules: ApiModuleEntry[] }>('/api/modules'),
      api.get<{ pages: ApiIndexEntry[] }>('/api/content'),
    ])
      .then(([modRes, pageRes]) => {
        if (cancelled) return;
        const mods: ModuleDef[] = (modRes.data?.modules ?? []).map((m) => ({
          id: m.id,
          label: m.label,
          tier: m.tier,
          base: m.base,
          paths: m.paths,
          orderIndex: m.orderIndex,
        }));
        setRegistryModules(mods);
        setModules(mods);

        const list: LessonEntry[] = (pageRes.data?.pages ?? []).map((p) => ({
          path: p.path,
          slug: p.slug,
          moduleId: p.moduleId,
          simulatorKey: p.simulatorKey,
          orderIndex: p.orderIndex,
          titleEn: p.titleEn,
          titlePt: p.titlePt,
        }));
        setRegistryLessons(list);
        setPages(list);
      })
      .catch((err) => {
        console.error('[content] Failed to load content/modules index:', err);
        if (cancelled) return;
        setRegistryModules([]);
        setRegistryLessons([]);
        setModules([]);
        setPages([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const value = useMemo<ContentContextValue>(
    () => ({ pages, modules, loading, ready, reload: () => setNonce((n) => n + 1) }),
    [pages, modules, loading, ready]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  return useContext(ContentContext);
}
