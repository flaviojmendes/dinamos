import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL ?? '';
// Base cadence while the tab is in the foreground. Background tabs stop polling
// entirely and resync on the next focus, so this only ever runs for the tab the
// user is actually looking at.
const POLL_INTERVAL_MS = 60_000;
// Minimum gap between event-driven fetches (visibility/focus) to coalesce the
// focus + visibilitychange pair browsers fire together on tab switch.
const MIN_FETCH_GAP_MS = 15_000;

/**
 * Renders a bell with an unread-notification badge that links to /notifications.
 * No websockets are available on Vercel Hobby, so a lightweight poll is used —
 * but only while the tab is visible. Hidden/background tabs pause polling and
 * resync the moment they regain focus, which keeps total request volume low
 * even with many tabs open.
 */
export default function NotificationBell() {
  const { user, getIdToken } = useAuth();
  const { t } = useTranslation();
  const [count, setCount] = useState(0);

  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);
  const lastFetchRef = useRef(0);

  const fetchCount = useCallback(
    async (force = false) => {
      if (!user || inFlightRef.current) return;
      const now = Date.now();
      if (!force && now - lastFetchRef.current < MIN_FETCH_GAP_MS) return;
      inFlightRef.current = true;
      lastFetchRef.current = now;
      try {
        const token = await getIdToken();
        if (!token) return;
        const res = await fetch(`${API_URL}/api/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (mountedRef.current) setCount(Number(data.unread_count ?? data.count ?? 0));
      } catch {
        /* transient network errors are ignored; next poll retries */
      } finally {
        inFlightRef.current = false;
      }
    },
    [user, getIdToken],
  );

  useEffect(() => {
    mountedRef.current = true;
    if (!user) {
      setCount(0);
      return;
    }

    let timer: ReturnType<typeof setInterval> | null = null;
    const startTimer = () => {
      if (timer) return;
      timer = setInterval(() => fetchCount(), POLL_INTERVAL_MS);
    };
    const stopTimer = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchCount(true);
        startTimer();
      } else {
        stopTimer();
      }
    };

    // Initial sync + start polling only if the tab is currently visible.
    if (document.visibilityState === 'visible') {
      fetchCount(true);
      startTimer();
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      mountedRef.current = false;
      stopTimer();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [user, fetchCount]);

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
