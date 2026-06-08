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

  useEffect(() => {
    let cancelled = false;
    setContent(null);
    setError(null);

    (async () => {
      try {
        const { evaluate } = await import('@mdx-js/mdx');
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
          MDX compile error
        </div>
        <pre className="text-xs font-mono text-red-700 dark:text-signal-red whitespace-pre-wrap break-words">
          {error.message}
        </pre>
      </div>
    );
  }

  if (!Content) {
    return <>{fallback ?? <DefaultSkeleton />}</>;
  }

  return <Content components={mdxComponents} />;
}
