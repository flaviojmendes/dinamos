import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { loadContentIndex, reloadContentFromApi } from '../contentDelivery';
import {
  setRegistryLessons,
  setRegistryModules,
  type LessonEntry,
  type ModuleDef,
} from '../config/contentRegistry';

/**
 * ContentContext — loads the lesson index CDN-first from `/content/manifest.json`
 * and feeds it to the navigation registry. Falls back to the content API when the
 * manifest is missing or invalid. Admin `reload()` always refreshes from the API.
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

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<LessonEntry[]>([]);
  const [modules, setModules] = useState<ModuleDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [nonce, setNonce] = useState(0);
  const forceApiRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const forceApi = forceApiRef.current;
    forceApiRef.current = false;
    setLoading(true);
    // Modules must be applied before lessons, since the lesson registry derives
    // tiers/module-by-path from the module list.
    loadContentIndex({ forceApi })
      .then((index) => {
        if (cancelled) return;
        const mods: ModuleDef[] = (index.modules ?? []).map((m) => ({
          id: m.id,
          label: m.label,
          tier: m.tier as ModuleDef['tier'],
          base: m.base,
          paths: m.paths,
          orderIndex: m.orderIndex,
        }));
        setRegistryModules(mods);
        setModules(mods);

        const list: LessonEntry[] = (index.pages ?? []).map((p) => ({
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
    () => ({
      pages,
      modules,
      loading,
      ready,
      reload: () => {
        reloadContentFromApi();
        forceApiRef.current = true;
        setNonce((n) => n + 1);
      },
    }),
    [pages, modules, loading, ready]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  return useContext(ContentContext);
}
