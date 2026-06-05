import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getItem,
  getModule,
  menuKey,
  fallbackLabel,
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
  const { t } = useTranslation();
  return (path: string) => t(menuKey(path, 'name'), { defaultValue: fallbackLabel(path) });
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
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-tactical-label"
    >
      <Link to="/" className="hover:text-slate-900 dark:hover:text-tactical-text">
        {t('nav.breadcrumb_home', { defaultValue: 'Home' })}
      </Link>
      <span className="opacity-50">/</span>
      <Link to="/explore" className="hover:text-slate-900 dark:hover:text-tactical-text">
        {t('quick_access.explore', { defaultValue: 'Explore' })}
      </Link>
      {mod && (
        <>
          <span className="opacity-50">/</span>
          {mod.base !== path ? (
            <Link to={mod.base} className="hover:text-slate-900 dark:hover:text-tactical-text">
              {moduleLabel}
            </Link>
          ) : (
            <span className="text-slate-900 dark:text-tactical-text">{moduleLabel}</span>
          )}
        </>
      )}
      {mod?.base !== path && (
        <>
          <span className="opacity-50">/</span>
          <span className="text-slate-900 dark:text-tactical-text">{label(path)}</span>
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
    <div className="mt-12 border-t border-slate-200 pt-6 dark:border-tactical-border">
      {(prev || next) && (
        <div className="grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              to={prev.path}
              className="tactical-panel group flex flex-col px-4 py-3 hover:border-slate-400 dark:hover:border-signal-green"
            >
              <span className="label-mono">‹ {t('nav.prev', { defaultValue: 'Previous' })}</span>
              <span className="mt-1 truncate font-mono text-sm text-slate-900 dark:text-tactical-text">
                {label(prev.path)}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={next.path}
              className="tactical-panel group flex flex-col items-end px-4 py-3 text-right hover:border-slate-400 dark:hover:border-signal-green"
            >
              <span className="label-mono">{t('nav.next', { defaultValue: 'Next' })} ›</span>
              <span className="mt-1 truncate font-mono text-sm text-slate-900 dark:text-tactical-text">
                {label(next.path)}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-6">
          <span className="label-mono">
            {t('nav.more_in_module', { defaultValue: 'More in {{module}}', module: moduleLabel })}
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r.path}
                to={r.path}
                className="cursor-pointer border border-slate-200 px-2.5 py-1 font-mono text-xs text-slate-600 transition-colors hover:border-brand-500 hover:text-slate-900 dark:border-tactical-border dark:text-tactical-dim dark:hover:border-signal-green dark:hover:text-tactical-text"
              >
                {label(r.path)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
