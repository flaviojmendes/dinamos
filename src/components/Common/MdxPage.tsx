import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import api from '../../designlab/utils/api';
import MdxRenderer from './MdxRenderer';
import ContentAnnotations from './ContentAnnotations';

type Lang = 'en' | 'pt';

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
 * Renders a DB-backed MDX content page for the current language.
 *
 * The MDX source now lives in Postgres (content_pages) and is fetched from the
 * content API, then compiled in the browser by MdxRenderer. Breadcrumb and
 * prev/next/related navigation are provided by ContentLayout (registry-driven),
 * so this component only owns the document body. Used by the manifest-driven
 * content route in App.tsx.
 */
export default function MdxPage({ slug }: Props) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lang: Lang = i18n.language?.startsWith('pt') ? 'pt' : 'en';

  const [body, setBody] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'notfound'>('loading');
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setBody(null);
    api
      .get<{ body: string }>(`/api/content/${slug}`, { params: { lang } })
      .then((res) => {
        if (cancelled) return;
        setBody(res.data?.body ?? '');
        setStatus('loaded');
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(`[content] Failed to load "${slug}":`, err);
        setStatus('notfound');
      });
    return () => {
      cancelled = true;
    };
  }, [slug, lang]);

  return (
    <article ref={articleRef} className="mx-auto max-w-4xl px-4 py-6 md:px-8 lg:py-10">
      {status === 'loading' && <ContentSkeleton />}
      {status === 'notfound' && (
        <p className="text-slate-500 dark:text-tactical-dim">Content not found: {slug}</p>
      )}
      {status === 'loaded' && body !== null && (
        <MdxRenderer source={body} fallback={<ContentSkeleton />} />
      )}
      {status === 'loaded' && (
        <ContentAnnotations slug={slug} path={location.pathname} containerRef={articleRef} />
      )}
    </article>
  );
}
