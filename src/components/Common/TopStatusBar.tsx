import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { StatusBadge, Tag } from '../tactical';

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/**
 * Persistent command-interface status bar shown at the top of the main content
 * area on desktop. Mirrors the reference "CIA CONTROL INTERFACE" header.
 */
export default function TopStatusBar() {
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
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-slate-900 dark:text-tactical-text">
          {t('command_center.gui_name')}
        </span>
        <Tag color="green">{t('command_center.open_access')}</Tag>
      </div>
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
