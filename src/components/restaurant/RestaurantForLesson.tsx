import { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContent } from '../../contexts/ContentContext';
import { useOptionalContentProgress } from '../../hooks/useContentProgress';

const RestaurantLesson = lazy(() => import('./RestaurantLesson'));

export default function RestaurantForLesson() {
  const { pathname } = useLocation();
  const { pages } = useContent();
  const saved = useOptionalContentProgress();
  const { t } = useTranslation();
  const page = pages.find((entry) => entry.path === pathname);
  if (!page || !saved) return null;
  return <Suspense fallback={null}>
    <Suspense fallback={<div role="status" style={{ minHeight: 330, display: 'grid', placeItems: 'center', fontSize: 14 }}>{t('common.loading_page')}</div>}>
      <RestaurantLesson key={page.slug} slug={page.slug} path={page.path} pages={pages} progress={saved.progress} onComplete={saved.markAsCompleted} />
    </Suspense>
  </Suspense>;
}
