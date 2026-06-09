import React, { useEffect, useState } from 'react';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import { mdxComponents } from '../mdx';

/**
 * Runtime MDX renderer.
 *
 * Content now lives in the database (see api/db/schema.ts `content_pages`) as
 * raw MDX source instead of build-time-compiled `.mdx` files. This component
 * compiles the source string in the browser via `@mdx-js/mdx`'s `evaluate`
 * (lazy-imported so the compiler stays out of the initial bundle) and renders
 * it with the same `mdxComponents` used by the former build-time pipeline.
 *
 * Used both by the public lesson page (MdxPage) and the admin CMS live preview.
 */

interface Props {
  /** Raw MDX source to compile and render. */
  source: string;
  /** Notified with a compile error (or null when compilation succeeds). */
  onError?: (error: Error | null) => void;
  /** Rendered while the source is compiling. */
  fallback?: React.ReactNode;
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

export default function MdxRenderer({ source, onError, fallback }: Props) {
  const [Content, setContent] = useState<React.ComponentType<{
    components?: Record<string, unknown>;
  }> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  // A failed dynamic import of the compiler (e.g. a stale chunk after a
  // redeploy) is a load failure, not an MDX syntax problem — track it so we can
  // show an accurate message instead of "MDX compile error".
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setContent(null);
    setError(null);
    setLoadFailed(false);

    (async () => {
      let evaluate: typeof import('@mdx-js/mdx')['evaluate'];
      try {
        ({ evaluate } = await import('@mdx-js/mdx'));
      } catch (e) {
        // Loading the compiler chunk failed (offline or stale deploy). The
        // global `vite:preloadError` handler reloads once to recover; surface a
        // load message rather than a misleading compile error.
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
        setContent(() => mod.default as React.ComponentType<{ components?: Record<string, unknown> }>);
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
    // onError is intentionally omitted: callers pass a stable callback or accept
    // recompilation only when the source changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

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

  return <Content components={mdxComponents} />;
}
