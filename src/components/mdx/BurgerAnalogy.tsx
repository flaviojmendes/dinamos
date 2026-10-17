import { Component, lazy, Suspense, type ReactNode } from 'react';
import { Sandwich } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useInRouterContext } from 'react-router-dom';

const RestaurantForLesson = lazy(() => import('../restaurant/RestaurantForLesson'));

// An optional scene must never prevent the written lesson from being readable.
class RestaurantBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

/** A recurring, concept-specific example shared by every lesson in the course. */
export default function BurgerAnalogy({ text, children }: { text?: string; children?: ReactNode }) {
  const { t } = useTranslation();
  const inRouter = useInRouterContext();
  return <aside className="lesson-burger" aria-label={t('content.burger_analogy_title')}>
    <div className="lesson-burger-title"><Sandwich size={20} aria-hidden="true" />{t('content.burger_analogy_title')}</div>
    {text ? <p>{text}</p> : <div>{children}</div>}
    {inRouter && <RestaurantBoundary><Suspense fallback={null}><RestaurantForLesson /></Suspense></RestaurantBoundary>}
  </aside>;
}
