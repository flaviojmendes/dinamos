import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge, Tag } from '../tactical';
import { quickAccessLinks } from '../../config/quickAccess';
import { openCommandPalette } from './CommandPalette';

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

interface TopStatusBarProps {
  /** Current sidebar open state — controls the toggle icon/label. */
  isSidebarOpen?: boolean;
  /** Handler to open/close the left navigation menu. */
  onToggleSidebar?: () => void;
}

/**
 * Persistent command-interface status bar shown at the top of the main content
 * area on desktop. Mirrors the reference "CIA CONTROL INTERFACE" header.
 */
export default function TopStatusBar({ isSidebarOpen, onToggleSidebar }: TopStatusBarProps = {}) {
  const { t } = useTranslation();
  const { user, isSubscribed } = useAuth();
  const now = useClock();

  if (!user) return null;

  const operator = (user.displayName || user.email || t('command_center.operator_label')).split('@')[0];
  const access = isSubscribed ? 'FREE-TIER-1' : t('command_center.guest');
  const sync = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  return (
    <div className="hidden md:flex items-center justify-between gap-4 border-b border-slate-200 dark:border-tactical-border bg-white/80 dark:bg-tactical-surface/90 backdrop-blur px-5 py-2.5">
      <div className="flex items-center gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            aria-expanded={isSidebarOpen}
            title={isSidebarOpen
              ? t('nav.collapse_sidebar', { defaultValue: 'Collapse menu' })
              : t('nav.expand_sidebar', { defaultValue: 'Expand menu' })}
            aria-label={isSidebarOpen
              ? t('nav.collapse_sidebar', { defaultValue: 'Collapse menu' })
              : t('nav.expand_sidebar', { defaultValue: 'Expand menu' })}
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-transparent text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-tactical-dim dark:hover:bg-tactical-raised dark:hover:text-tactical-text cursor-pointer"
          >
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="1" strokeWidth={1.8} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 4v16" />
            </svg>
          </button>
        )}
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-900 dark:text-tactical-text">
          {t('command_center.gui_name')}
        </span>
        <Tag color="green">{t('command_center.open_access')}</Tag>
      </div>

      <nav className="flex items-center gap-1" aria-label={t('quick_access.title')}>
        <button
          onClick={() => openCommandPalette()}
          title={t('command_center.search_aria')}
          aria-label={t('command_center.search_aria')}
          className="flex h-8 w-8 items-center justify-center border border-transparent text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-tactical-dim dark:hover:bg-tactical-raised dark:hover:text-tactical-text cursor-pointer"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        </button>
        {quickAccessLinks.map(({ to, labelKey, label, d }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={t(`quick_access.${labelKey}`, { defaultValue: label })}
            aria-label={t(`quick_access.${labelKey}`, { defaultValue: label })}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center justify-center h-8 w-8 border transition-colors ${
                isActive
                  ? 'border-brand-600 dark:border-signal-green text-brand-700 dark:text-signal-green bg-brand-50 dark:bg-tactical-raised'
                  : 'border-transparent text-slate-500 dark:text-tactical-dim hover:text-slate-900 dark:hover:text-tactical-text hover:bg-slate-100 dark:hover:bg-tactical-raised'
              }`
            }
          >
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
            </svg>
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-5">
        <span className="label-mono">
          {t('command_center.operator_label')}: <span className="text-slate-900 dark:text-tactical-text normal-case">{operator}</span>
        </span>
        <span className="label-mono">
          {t('command_center.access_label')}: <span className="text-slate-900 dark:text-tactical-text">{access}</span>
        </span>
        <span className="hidden lg:flex items-center gap-2">
          <span className="label-mono">{t('command_center.system_label')}</span>
          <StatusBadge variant="online" dot />
        </span>
        <span className="label-mono tabular-nums">
          {t('command_center.sync_label')}: <span className="text-slate-900 dark:text-tactical-text">{sync}</span>
        </span>
      </div>
    </div>
  );
}
