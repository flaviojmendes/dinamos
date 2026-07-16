import React, { useEffect, useState } from 'react';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import { mdxComponents } from '../mdx';

type MdxContent = React.ComponentType<{ components?: Record<string, unknown> }>;

/** In-memory compile cache keyed by slug/lang/content fingerprint. */
const compileCache = new Map<string, MdxContent>();

function hashString(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

export function mdxCacheKey(slug: string, lang: string, source: string): string {
  return `${slug}:${lang}:${hashString(source)}:${source.length}`;
}

interface Props {
  /** Raw MDX source to compile and render. */
  source: string;
  /** Optional cache partition (slug + lang + body hash). */
  cacheKey?: string;
  /** Notified with a compile error (or null when compilation succeeds). */
  onError?: (error: Error | null) => void;
  /** Rendered while the source is compiling. */
  fallback?: React.ReactNode;
  /**
   * Per-element overrides merged over the default lesson `mdxComponents`. Used
   * by surfaces (like the announcement modal) that need a more compact
   * typographic scale than full lesson pages.
   */
  components?: Record<string, unknown>;
}

function DefaultSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-4/6 rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

export default function MdxRenderer({ source, cacheKey, onError, fallback, components }: Props) {
  const [Content, setContent] = useState<MdxContent | null>(() =>
    cacheKey ? compileCache.get(cacheKey) ?? null : null,
  );
  const [error, setError] = useState<Error | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const key = cacheKey ?? hashString(source ?? '');

    const cached = compileCache.get(key);
    if (cached) {
      setContent(() => cached);
      setError(null);
      setLoadFailed(false);
      onError?.(null);
      return;
    }

    setContent(null);
    setError(null);
    setLoadFailed(false);

    (async () => {
      let evaluate: typeof import('@mdx-js/mdx')['evaluate'];
      try {
        ({ evaluate } = await import('@mdx-js/mdx'));
      } catch (e) {
        if (cancelled) return;
        const err = e instanceof Error ? e : new Error(String(e));
        setLoadFailed(true);
        setError(err);
        onError?.(err);
        return;
      }
      try {
        const mod = await evaluate(source ?? '', {
          ...(runtime as Record<string, unknown>),
          baseUrl: import.meta.url,
          remarkPlugins: [remarkGfm],
        } as any);
        if (cancelled) return;
        const compiled = mod.default as MdxContent;
        compileCache.set(key, compiled);
        setContent(() => compiled);
        setError(null);
        onError?.(null);
      } catch (e) {
        if (cancelled) return;
        const err = e instanceof Error ? e : new Error(String(e));
        setContent(null);
        setError(err);
        onError?.(err);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, cacheKey]);

  if (error) {
    return (
      <div className="my-6 border border-red-300 dark:border-signal-red/40 bg-red-50 dark:bg-signal-red/5 p-4">
        <div className="font-mono uppercase tracking-wider text-xs font-semibold text-red-600 dark:text-signal-red mb-2">
          {loadFailed ? 'Falha ao carregar o conteúdo' : 'MDX compile error'}
        </div>
        {loadFailed ? (
          <div className="text-sm text-red-700 dark:text-signal-red">
            <p className="mb-3">
              Não foi possível carregar o conteúdo. Isso costuma acontecer após
              uma atualização do site.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md border border-red-400 dark:border-signal-red/50 px-3 py-1.5 text-xs font-medium hover:bg-red-100 dark:hover:bg-signal-red/10"
            >
              Recarregar página
            </button>
          </div>
        ) : (
          <pre className="text-xs font-mono text-red-700 dark:text-signal-red whitespace-pre-wrap break-words">
            {error.message}
          </pre>
        )}
      </div>
    );
  }

  if (!Content) {
    return <>{fallback ?? <DefaultSkeleton />}</>;
  }

  return <Content components={components ? { ...mdxComponents, ...components } : mdxComponents} />;
}
