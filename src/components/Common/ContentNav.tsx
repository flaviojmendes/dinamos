import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getItem,
  getModule,
  menuKey,
  fallbackLabel,
  titleForPath,
  moduleSequence,
  relatedItems,
} from '../../config/contentRegistry';

/**
 * Registry-driven page navigation chrome shared by every content page
 * (lessons, cases, simulators). Renders a module-aware breadcrumb at the top
 * and prev/next + "more in module" at the bottom, all derived from a single
 * source of truth so the order matches the sidebar and dashboard.
 */

function useLabel() {
  const { t, i18n } = useTranslation();
  return (path: string) => {
    return titleForPath(path, i18n.resolvedLanguage || i18n.language) ?? t(menuKey(path, 'name'), { defaultValue: fallbackLabel(path) });
  };
}

export function ContentBreadcrumb({ path }: { path: string }) {
  const { t } = useTranslation();
  const label = useLabel();
  const item = getItem(path);
  if (!item) return null;
  const mod = getModule(item.moduleId);
  const moduleLabel = mod
    ? t(`command_center.modules.${mod.id}`, { defaultValue: mod.label })
    : '';

  return (
    <nav
      aria-label={t('content.nav.breadcrumb_label', { defaultValue: 'Lesson navigation' })}
      className="lesson-breadcrumb flex flex-wrap items-center gap-2 font-sans text-sm text-slate-600 dark:text-tactical-label"
    >
      <Link to="/" className="hover:text-slate-900 dark:hover:text-tactical-text">
        {t('content.nav.breadcrumb_home', { defaultValue: 'Home' })}
      </Link>
      <span aria-hidden="true" className="opacity-50">/</span>
      <Link to="/explore" className="hover:text-slate-900 dark:hover:text-tactical-text">
        {t('content.nav.explore', { defaultValue: 'Explore' })}
      </Link>
      {mod && (
        <>
          <span aria-hidden="true" className="opacity-50">/</span>
          {mod.base !== path ? (
            <Link to={mod.base} className="hover:text-slate-900 dark:hover:text-tactical-text">
              {moduleLabel}
            </Link>
          ) : (
            <span aria-current="page" className="text-slate-900 dark:text-tactical-text">{moduleLabel}</span>
          )}
        </>
      )}
      {mod?.base !== path && (
        <>
          <span aria-hidden="true" className="opacity-50">/</span>
          <span aria-current="page" className="text-slate-900 dark:text-tactical-text">{label(path)}</span>
        </>
      )}
    </nav>
  );
}

export function ContentFooterNav({ path }: { path: string }) {
  const { t } = useTranslation();
  const label = useLabel();
  const item = getItem(path);
  if (!item) return null;

  const sequence = moduleSequence(item.moduleId);
  const idx = sequence.findIndex((i) => i.path === path);
  const prev = idx > 0 ? sequence[idx - 1] : null;
  const next = idx >= 0 && idx < sequence.length - 1 ? sequence[idx + 1] : null;

  const related = relatedItems(path).filter((r) => r.path !== prev?.path && r.path !== next?.path);
  const mod = getModule(item.moduleId);
  const moduleLabel = mod
    ? t(`command_center.modules.${mod.id}`, { defaultValue: mod.label })
    : '';

  if (!prev && !next && related.length === 0) return null;

  return (
    <nav aria-label={t('content.nav.footer_label', { defaultValue: 'Continue learning' })} className="lesson-footer-nav mt-12 border-t border-slate-200 pt-6 font-sans dark:border-tactical-border">
      {(prev || next) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              to={prev.path}
              rel="prev"
              className="group flex min-w-0 flex-col gap-2 rounded-lg border border-slate-200 p-5 transition-colors hover:border-brand-500 dark:border-tactical-border dark:hover:border-brand-400"
            >
              <span className="text-sm text-slate-600 dark:text-tactical-dim"><span aria-hidden="true">← </span>{t('content.nav.prev', { defaultValue: 'Previous' })}</span>
              <span className="break-words text-base font-medium leading-snug text-slate-900 dark:text-tactical-text">
                {label(prev.path)}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next ? (
            <Link
              to={next.path}
              rel="next"
              className="group flex min-w-0 flex-col items-end gap-2 rounded-lg border border-slate-200 p-5 text-right transition-colors hover:border-brand-500 dark:border-tactical-border dark:hover:border-brand-400"
            >
              <span className="text-sm text-slate-600 dark:text-tactical-dim">{t('content.nav.next', { defaultValue: 'Next' })}<span aria-hidden="true"> →</span></span>
              <span className="break-words text-base font-medium leading-snug text-slate-900 dark:text-tactical-text">
                {label(next.path)}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-6">
          <span className="text-sm text-slate-600 dark:text-tactical-dim">
            {t('content.nav.more_in_module', { defaultValue: 'More in {{module}}', module: moduleLabel })}
          </span>
          <div className="mt-3 flex flex-wrap gap-4">
            {related.map((r) => (
              <Link
                key={r.path}
                to={r.path}
                className="text-sm text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-brand-700 dark:text-tactical-text dark:decoration-tactical-border dark:hover:text-brand-300"
              >
                {label(r.path)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
