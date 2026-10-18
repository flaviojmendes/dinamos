import { lazy, Suspense, type ComponentProps } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContent } from '../../contexts/ContentContext';
import { useOptionalContentProgress } from '../../hooks/useContentProgress';
import { usePublicSettings } from '../../hooks/usePublicSettings';

const RestaurantLesson = lazy(() => import('./RestaurantLesson'));

function EnabledRestaurant(props: ComponentProps<typeof RestaurantLesson>) {
  const settings = usePublicSettings();
  const { t } = useTranslation();
  if (!settings?.dioramas_enabled) return null;
  return <Suspense fallback={<div role="status" style={{ minHeight: 330, display: 'grid', placeItems: 'center', fontSize: 14 }}>{t('common.loading_page')}</div>}>
    <RestaurantLesson {...props} />
  </Suspense>;
}

export default function RestaurantForLesson() {
  const { pathname } = useLocation();
  const { pages } = useContent();
  const saved = useOptionalContentProgress();
  const page = pages.find((entry) => entry.path === pathname);
  if (!page || !saved) return null;
  return <EnabledRestaurant key={page.slug} slug={page.slug} path={page.path} pages={pages} progress={saved.progress} onComplete={saved.markAsCompleted} />;
}
