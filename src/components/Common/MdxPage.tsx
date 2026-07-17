import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import api from '../../app/utils/api';
import { loadPageBody, shouldUseContentApi } from '../../contentDelivery';
import MdxRenderer, { mdxCacheKey } from './MdxRenderer';
import ContentAnnotations from './ContentAnnotations';
import { getVisitorId } from '../../utils/visitorId';

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
 * Lesson bodies load CDN-first from manifest body URLs; view tracking and user
 * progress remain on authenticated APIs. Breadcrumb and prev/next navigation
 * come from ContentLayout (registry-driven).
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
    const contentPath = location.pathname;
    loadPageBody({ path: contentPath, lang, forceApi: shouldUseContentApi() })
      .then((text) => {
        if (cancelled) return;
        setBody(text);
        setStatus('loaded');
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(`[content] Failed to load "${slug}" (${contentPath}):`, err);
        setStatus('notfound');
      });
    return () => {
      cancelled = true;
    };
  }, [slug, lang, location.pathname]);

  // Record an anonymized page view once per session+path. Failures are silent —
  // analytics must never interfere with rendering the lesson.
  useEffect(() => {
    const path = location.pathname;
    if (!path) return;
    const sessionKey = `viewed:${path}`;
    try {
      if (sessionStorage.getItem(sessionKey)) return;
      sessionStorage.setItem(sessionKey, '1');
    } catch {
      /* sessionStorage unavailable: fall through and still track this load. */
    }
    api.post('/api/views', { path, visitorId: getVisitorId() }).catch(() => {
      /* ignore tracking errors */
    });
  }, [location.pathname]);

  return (
    <article ref={articleRef} className="mx-auto max-w-4xl px-4 py-6 md:px-8 lg:py-10">
      {status === 'loading' && <ContentSkeleton />}
      {status === 'notfound' && (
        <p className="text-slate-500 dark:text-tactical-dim">Content not found: {slug}</p>
      )}
      {status === 'loaded' && body !== null && (
        <MdxRenderer
          source={body}
          cacheKey={mdxCacheKey(slug, lang, body)}
          fallback={<ContentSkeleton />}
        />
      )}
      {status === 'loaded' && (
        <ContentAnnotations slug={slug} path={location.pathname} containerRef={articleRef} />
      )}
    </article>
  );
}
