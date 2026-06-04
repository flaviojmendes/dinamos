import React, { Suspense, useMemo } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { mdxComponents } from '../mdx';
import { contentManifest } from '../../config/contentManifest';
import { Tag } from '../tactical';

type Lang = 'en' | 'pt';
type Loader = () => Promise<{ default: React.ComponentType }>;

// Lazily-loaded MDX content (code-split per page). Keys look like
// "../../content/theoretical-foundations/cap-theorem.en.mdx".
const modules = import.meta.glob('../../content/**/*.mdx') as Record<string, Loader>;

// registry[slug] = { en?: loader, pt?: loader }
const registry: Record<string, Partial<Record<Lang, Loader>>> = {};
for (const [filePath, loader] of Object.entries(modules)) {
  const match = filePath.match(/\/content\/(.+)\.(en|pt)\.mdx$/);
  if (!match) continue;
  const [, slug, lang] = match;
  (registry[slug] ||= {})[lang as Lang] = loader;
}

/** Slugs that have at least one MDX file present (used for incremental migration). */
export const availableSlugs = new Set(Object.keys(registry));

function ContentSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-4/6 rounded bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

interface Props {
  /** Content slug, e.g. "theoretical-foundations/cap-theorem". */
  slug: string;
}

const prettySegment = (seg: string) => seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/** Ordered, de-duplicated list of content paths for sequential prev/next nav. */
const orderedPaths = (() => {
  const seen = new Set<string>();
  return contentManifest
    .filter((e) => availableSlugs.has(e.slug))
    .map((e) => e.path)
    .filter((p) => (seen.has(p) ? false : (seen.add(p), true)));
})();

/**
 * Renders an MDX content page for the current language, falling back to English.
 * Wrapped in a "briefing document" frame (breadcrumb + module tag + prev/next).
 * Used by the manifest-driven content route in App.tsx.
 */
export default function MdxPage({ slug }: Props) {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const lang: Lang = i18n.language?.startsWith('pt') ? 'pt' : 'en';

  const Content = useMemo(() => {
    const entry = registry[slug];
    const loader = entry?.[lang] ?? entry?.en ?? entry?.pt;
    if (!loader) return null;
    return React.lazy(loader);
  }, [slug, lang]);

  const segments = pathname.split('/').filter(Boolean);
  const idx = orderedPaths.indexOf(pathname);
  const prev = idx > 0 ? orderedPaths[idx - 1] : null;
  const next = idx >= 0 && idx < orderedPaths.length - 1 ? orderedPaths[idx + 1] : null;

  return (
    <article className="px-4 py-6 md:px-8 lg:py-10 max-w-4xl mx-auto">
      {/* Briefing header strip */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-tactical-border pb-3">
        <nav className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-tactical-label">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-tactical-text">HOME</Link>
          {segments.map((seg, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="opacity-50">/</span>
              <span className={i === segments.length - 1 ? 'text-slate-900 dark:text-tactical-text' : ''}>
                {prettySegment(seg)}
              </span>
            </span>
          ))}
        </nav>
        <Tag color="cyan">BRIEFING</Tag>
      </div>

      {Content ? (
        <MDXProvider components={mdxComponents}>
          <Suspense fallback={<ContentSkeleton />} key={`${slug}-${lang}`}>
            <Content />
          </Suspense>
        </MDXProvider>
      ) : (
        <p className="text-slate-500 dark:text-tactical-dim">Content not found: {slug}</p>
      )}

      {/* Sequential briefing nav */}
      {(prev || next) && (
        <div className="mt-16 grid grid-cols-2 gap-3 border-t border-slate-200 dark:border-tactical-border pt-6">
          {prev ? (
            <Link
              to={prev}
              className="tactical-panel group flex flex-col px-4 py-3 hover:border-slate-400 dark:hover:border-signal-green"
            >
              <span className="label-mono">‹ Previous Briefing</span>
              <span className="mt-1 font-mono text-sm text-slate-900 dark:text-tactical-text truncate">
                {prettySegment(prev.split('/').filter(Boolean).pop() ?? prev)}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={next}
              className="tactical-panel group flex flex-col items-end px-4 py-3 text-right hover:border-slate-400 dark:hover:border-signal-green"
            >
              <span className="label-mono">Next Briefing ›</span>
              <span className="mt-1 font-mono text-sm text-slate-900 dark:text-tactical-text truncate">
                {prettySegment(next.split('/').filter(Boolean).pop() ?? next)}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </article>
  );
}
