import React, { Suspense, useMemo } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { useTranslation } from 'react-i18next';
import { mdxComponents } from '../mdx';

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

/**
 * Renders an MDX content page for the current language, falling back to English.
 * Breadcrumb and prev/next/related navigation are provided by ContentLayout
 * (registry-driven) so this component only owns the document body.
 * Used by the manifest-driven content route in App.tsx.
 */
export default function MdxPage({ slug }: Props) {
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language?.startsWith('pt') ? 'pt' : 'en';

  const Content = useMemo(() => {
    const entry = registry[slug];
    const loader = entry?.[lang] ?? entry?.en ?? entry?.pt;
    if (!loader) return null;
    return React.lazy(loader);
  }, [slug, lang]);

  return (
    <article className="mx-auto max-w-4xl px-4 py-6 md:px-8 lg:py-10">
      {Content ? (
        <MDXProvider components={mdxComponents}>
          <Suspense fallback={<ContentSkeleton />} key={`${slug}-${lang}`}>
            <Content />
          </Suspense>
        </MDXProvider>
      ) : (
        <p className="text-slate-500 dark:text-tactical-dim">Content not found: {slug}</p>
      )}
    </article>
  );
}
