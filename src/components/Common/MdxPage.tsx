import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import api from '../../app/utils/api';
import { loadPageBody, shouldUseContentApi } from '../../contentDelivery';
import LessonOutline from './LessonOutline';
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
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const lang: Lang = (i18n.resolvedLanguage || i18n.language)?.startsWith('pt') ? 'pt' : 'en';
  const requestKey = `${slug}:${lang}:${location.pathname}`;

  const [result, setResult] = useState<{
    key: string; body: string | null; status: 'loading' | 'loaded' | 'notfound' | 'unavailable';
  }>({ key: '', body: null, status: 'loading' });
  const { body, status } = result.key === requestKey ? result : { body: null, status: 'loading' };
  const articleRef = useRef<HTMLElement>(null);
  const contentKey = useMemo(() => mdxCacheKey(slug, lang, body ?? ''), [slug, lang, body]);

  useEffect(() => {
    let cancelled = false;
    setResult({ key: requestKey, body: null, status: 'loading' });
    const contentPath = location.pathname;
    loadPageBody({ path: contentPath, lang, forceApi: shouldUseContentApi() })
      .then((text) => {
        if (cancelled) return;
        setResult({ key: requestKey, body: text, status: 'loaded' });
      })
      .catch((err) => {
        if (cancelled) return;
        const unavailable = err instanceof Error && err.name === 'ContentTranslationUnavailableError';
        if (!unavailable) console.error(`[content] Failed to load "${slug}" (${contentPath}):`, err);
        setResult({ key: requestKey, body: null, status: unavailable ? 'unavailable' : 'notfound' });
      });
    return () => {
      cancelled = true;
    };
  }, [slug, lang, location.pathname, requestKey]);

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
    <div className="lesson-layout">
      <article ref={articleRef} className="lesson-article" lang={lang === 'pt' ? 'pt-BR' : 'en'}>
        {status === 'loading' && <ContentSkeleton />}
        {status === 'notfound' && (
          <p className="text-slate-500 dark:text-tactical-dim">{t('content.not_found', { slug })}</p>
        )}
        {status === 'unavailable' && <p role="status" className="text-slate-500 dark:text-tactical-dim">{t('content.translation_unavailable')}</p>}
        {status === 'loaded' && body !== null && (
          <MdxRenderer
            key={contentKey}
            source={body}
            cacheKey={contentKey}
            fallback={<ContentSkeleton />}
          />
        )}
        {status === 'loaded' && (
          <ContentAnnotations slug={slug} path={location.pathname} containerRef={articleRef} />
        )}
      </article>
      {status === 'loaded' && <LessonOutline containerRef={articleRef} contentKey={contentKey} />}
    </div>
  );
}
