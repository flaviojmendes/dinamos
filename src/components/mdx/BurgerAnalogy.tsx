import type { ReactNode } from 'react';
import { Sandwich } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/** A recurring, concept-specific example shared by every lesson in the course. */
export default function BurgerAnalogy({ text, children }: { text?: string; children?: ReactNode }) {
  const { t } = useTranslation();
  return <aside className="lesson-burger" aria-label={t('content.burger_analogy_title')}>
    <div className="lesson-burger-title"><Sandwich size={20} aria-hidden="true" />{t('content.burger_analogy_title')}</div>
    {text ? <p>{text}</p> : <div>{children}</div>}
  </aside>;
}
