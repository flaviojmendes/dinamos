import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL ?? '';
const POLL_INTERVAL_MS = 30_000;

/**
 * Polls the merged designLab backend for the unread-notification count and
 * renders a bell with a badge that links to /notifications. No websockets are
 * available on Vercel Hobby, so a lightweight 30s poll is used instead.
 */
export default function NotificationBell() {
  const { user, getIdToken } = useAuth();
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }
    let cancelled = false;

    const fetchCount = async () => {
      try {
        const token = await getIdToken();
        if (!token) return;
        const res = await fetch(`${API_URL}/api/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setCount(Number(data.unread_count ?? data.count ?? 0));
      } catch {
        /* transient network errors are ignored; next poll retries */
      }
    };

    fetchCount();
    timerRef.current = setInterval(fetchCount, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [user, getIdToken]);

  if (!user) return null;

  const label = t('notifications.title', { defaultValue: 'Notificações' });

  return (
    <NavLink
      to="/notifications"
      title={label}
      aria-label={count > 0 ? `${label} (${count})` : label}
      className={({ isActive }: { isActive: boolean }) =>
        `relative flex h-8 w-8 items-center justify-center border transition-colors ${
          isActive
            ? 'border-brand-600 dark:border-signal-green text-brand-700 dark:text-signal-green bg-brand-50 dark:bg-tactical-raised'
            : 'border-transparent text-slate-500 dark:text-tactical-dim hover:text-slate-900 dark:hover:text-tactical-text hover:bg-slate-100 dark:hover:bg-tactical-raised'
        }`
      }
    >
      <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 font-mono text-[10px] font-bold leading-none text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </NavLink>
  );
}
