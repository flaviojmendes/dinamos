import { useTranslation } from 'react-i18next';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { quickAccessLinks } from '../../config/quickAccess';
import { openCommandPalette } from './CommandPalette';
import NotificationBell from './NotificationBell';

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
  const { user, appUser } = useAuth();

  if (!user) return null;

  const isAdmin = appUser?.role === 'Admin';

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
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-tactical-dim dark:hover:bg-tactical-raised dark:hover:text-tactical-text cursor-pointer"
          >
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="1" strokeWidth={1.8} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 4v16" />
            </svg>
          </button>
        )}
      </div>

      <nav className="flex items-center gap-1" aria-label={t('quick_access.title')}>
        <button
          onClick={() => openCommandPalette()}
          title={t('command_center.search_aria')}
          aria-label={t('command_center.search_aria')}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-tactical-dim dark:hover:bg-tactical-raised dark:hover:text-tactical-text cursor-pointer"
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
              `flex items-center justify-center h-8 w-8 rounded-lg border transition-colors ${
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
        <NotificationBell />

        {/* DinaCoins balance — links to the profile/gamification view. */}
        <Link
          to="/profile"
          title={t('gamification.coins', { defaultValue: 'DinaCoins' })}
          aria-label={`${appUser?.tokens ?? 0} DinaCoins`}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-signal-amber/30 bg-signal-amber/10 px-2 font-sans text-signal-amber transition-colors hover:bg-signal-amber/20"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="8" strokeWidth={1.8} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v8m-2-6h3a1.5 1.5 0 010 3h-3m0 0h3" />
          </svg>
          <span className="text-xs font-bold tabular-nums">{appUser?.tokens ?? 0}</span>
        </Link>

        {/* Admin entry — links to the Control Center, which lists every admin
            section. Only shown for the Admin role. */}
        {isAdmin && (
          <NavLink
            to="/admin"
            end
            title={t('admin.control_center', { defaultValue: 'Control Center' })}
            className={({ isActive }: { isActive: boolean }) =>
              `flex h-8 items-center gap-1 rounded-lg border px-2 font-sans text-[11px] font-medium transition-colors ${
                isActive
                  ? 'border-signal-amber/40 bg-signal-amber/20 text-signal-amber'
                  : 'border-signal-amber/30 bg-signal-amber/10 text-signal-amber hover:bg-signal-amber/20'
              }`
            }
          >
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <circle cx="12" cy="12" r="3" strokeWidth={1.8} />
            </svg>
            {t('admin.control_center', { defaultValue: 'Control Center' })}
          </NavLink>
        )}
      </nav>
    </div>
  );
}
