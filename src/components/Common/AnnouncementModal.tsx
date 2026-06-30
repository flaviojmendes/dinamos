import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../app/utils/api';
import MdxRenderer from './MdxRenderer';

interface ActiveAnnouncement {
  id: number;
  title: string | null;
  body: string;
}

type ElProps = HTMLAttributes<HTMLElement> & { href?: string };

/**
 * Modal-scale MDX overrides. The default lesson components (see ../mdx) use a
 * page-sized rhythm — 64px heading margins, 2xl mono headings, accent bars —
 * which dwarfs a compact dialog. These keep the same tactical palette at a
 * tighter scale so an announcement reads as one calm block, not a lesson.
 */
const compactMdx = {
  h1: (p: ElProps) => (
    <h3 className="mb-2 mt-5 text-base font-semibold tracking-tight text-slate-900 first:mt-0 dark:text-tactical-text" {...p} />
  ),
  h2: (p: ElProps) => (
    <p className="mb-2 mt-5 text-[11px] font-medium uppercase tracking-wide text-slate-400 first:mt-0 dark:text-tactical-label" {...p} />
  ),
  h3: (p: ElProps) => (
    <h4 className="mb-1.5 mt-4 text-sm font-semibold text-slate-900 first:mt-0 dark:text-tactical-text" {...p} />
  ),
  p: (p: ElProps) => (
    <p className="my-3 text-sm leading-relaxed text-slate-600 first:mt-0 dark:text-tactical-dim" {...p} />
  ),
  ul: (p: ElProps) => <ul className="my-3 space-y-2" {...p} />,
  ol: (p: ElProps) => <ol className="my-3 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-tactical-dim" {...p} />,
  li: (p: ElProps) => (
    <li
      className="pl-5 -indent-5 text-sm leading-relaxed text-slate-600 before:mr-2 before:font-semibold before:text-brand-500 before:content-['▸'] dark:text-tactical-dim dark:before:text-signal-green"
      {...p}
    />
  ),
  a: ({ href = '#', ...p }: ElProps) => (
    <a
      href={href}
      className="font-medium text-brand-600 underline-offset-2 hover:underline dark:text-signal-green"
      {...p}
    />
  ),
  strong: (p: ElProps) => <strong className="font-semibold text-slate-900 dark:text-tactical-text" {...p} />,
  hr: (p: ElProps) => <hr className="my-4 border-slate-100 dark:border-tactical-border" {...p} />,
};

/**
 * App-wide announcement modal. Fetches the single active announcement for the
 * current user (the latest published one they have not acknowledged) and shows
 * it as a dismissible modal. Acknowledging is persisted server-side, so the
 * modal never reappears for that announcement. Mounted once, only for signed-in
 * users (see App.tsx), next to the command palette.
 */
export default function AnnouncementModal() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const lang = i18n.language?.startsWith('pt') ? 'pt' : 'en';
  const [announcement, setAnnouncement] = useState<ActiveAnnouncement | null>(null);
  const [acking, setAcking] = useState(false);
  // Don't clobber an announcement currently on screen with a background refetch.
  const showingRef = useRef(false);
  showingRef.current = announcement !== null;

  const ackButtonRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Track which announcement ids we've already reported as "seen" this session
  // so a single display logs exactly one impression (the server is idempotent
  // too, but this avoids redundant requests on re-renders / refetches).
  const seenRef = useRef<Set<number>>(new Set());
  // Throttle gate so the focus + visibilitychange pair browsers fire together on
  // a tab switch collapses into a single request.
  const lastFetchRef = useRef(0);
  // `overflowing` => content exceeds the viewport; `atBottom` => user has read
  // to the end. Together they drive the bottom scroll-fade affordance.
  const [overflowing, setOverflowing] = useState(false);
  const [atBottom, setAtBottom] = useState(true);

  const fetchActive = useCallback(async () => {
    if (showingRef.current) return;
    const now = Date.now();
    if (now - lastFetchRef.current < 10_000) return;
    lastFetchRef.current = now;
    try {
      const res = await api.get<{ announcement: ActiveAnnouncement | null }>(
        '/api/announcements/active',
        { params: { lang } }
      );
      setAnnouncement(res.data?.announcement ?? null);
    } catch {
      /* announcements are non-critical; ignore fetch errors */
    }
  }, [lang]);

  // Re-check on language change and whenever the route changes, so a freshly
  // published announcement appears as soon as the user navigates (no hard
  // refresh needed). Also re-check when the tab regains focus.
  useEffect(() => {
    fetchActive();
  }, [fetchActive, location.pathname]);

  useEffect(() => {
    // Only re-check when the tab actually becomes visible/focused — never on
    // hide. The throttle in fetchActive coalesces the focus + visibilitychange
    // pair into one request.
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchActive();
    };
    window.addEventListener('focus', onVisible);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', onVisible);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [fetchActive]);

  // Record receipt the first time an announcement is actually shown, before any
  // dismissal. Powers the received-vs-acknowledged analytics. Non-critical.
  useEffect(() => {
    const id = announcement?.id;
    if (id == null || seenRef.current.has(id)) return;
    seenRef.current.add(id);
    api.post(`/api/announcements/${id}/seen`).catch(() => {
      /* impressions are best-effort; ignore failures */
    });
  }, [announcement?.id]);

  const acknowledge = useCallback(async () => {
    if (!showingRef.current) return;
    const current = announcement;
    if (!current) return;
    setAcking(true);
    try {
      await api.post(`/api/announcements/${current.id}/ack`);
    } catch {
      /* even if the ack request fails, dismiss locally so we don't trap the user */
    } finally {
      setAcking(false);
      setAnnouncement(null);
    }
  }, [announcement]);

  // Lock background scroll, focus the primary action, and wire Escape-to-dismiss
  // while the modal is open. Standard modal hygiene.
  useEffect(() => {
    if (!announcement) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    const focusId = window.setTimeout(() => ackButtonRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        void acknowledge();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      body.style.overflow = prevOverflow;
      window.clearTimeout(focusId);
      window.removeEventListener('keydown', onKey);
    };
  }, [announcement, acknowledge]);

  const handleScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const canScroll = el.scrollHeight - el.clientHeight > 4;
    setOverflowing(canScroll);
    setAtBottom(!canScroll || el.scrollHeight - el.scrollTop - el.clientHeight < 8);
  }, []);

  // Measure once content is mounted, and on resize.
  useEffect(() => {
    if (!announcement) return;
    const id = window.setTimeout(handleScrollState, 80);
    window.addEventListener('resize', handleScrollState);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', handleScrollState);
    };
  }, [announcement, handleScrollState]);

  const panelMotion = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { scale: 0.96, y: 16, opacity: 0 },
        animate: { scale: 1, y: 0, opacity: 1 },
        exit: { scale: 0.98, y: 8, opacity: 0 },
        transition: { type: 'spring' as const, stiffness: 360, damping: 30, mass: 0.9 },
      };

  return (
    <AnimatePresence>
      {announcement && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="announcement-title"
        >
          <div
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[3px]"
            onClick={() => void acknowledge()}
          />
          <motion.div
            className="relative flex max-h-[88vh] w-full flex-col overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_-12px_rgba(2,6,23,0.55)] dark:border-tactical-line dark:bg-tactical-surface sm:max-h-[85vh] sm:max-w-lg rounded-t-2xl sm:rounded-2xl"
            {...panelMotion}
          >
            {/* Accent rule: a calm top hairline of brand colour for identity. */}
            <div
              aria-hidden
              className="h-0.5 w-full shrink-0 bg-gradient-to-r from-brand-500/0 via-brand-500 to-brand-500/0 dark:from-signal-green/0 dark:via-signal-green dark:to-signal-green/0"
            />

            <header className="flex shrink-0 items-start gap-3.5 px-5 py-4 sm:px-6">
              <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 dark:bg-signal-green/10 dark:text-signal-green dark:ring-signal-green/20">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="label-mono">
                  {t('announcement.badge', { defaultValue: 'Announcement' })}
                </p>
                <h2
                  id="announcement-title"
                  className="mt-1 text-pretty font-sans text-lg font-semibold leading-snug tracking-tight text-slate-900 dark:text-tactical-text"
                >
                  {announcement.title ?? t('announcement.default_title', { defaultValue: 'Heads up' })}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => void acknowledge()}
                aria-label={t('announcement.acknowledge', { defaultValue: 'Got it' })}
                className="-mr-1.5 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-tactical-label dark:hover:bg-tactical-raised dark:hover:text-tactical-text dark:focus-visible:ring-signal-green"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            <div className="relative min-h-0 flex-1">
              <div
                ref={scrollRef}
                onScroll={handleScrollState}
                className="h-full overflow-y-auto px-5 pb-5 sm:px-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-tactical-line scrollbar-track-transparent"
              >
                <div className="pt-0.5 text-slate-600 dark:text-tactical-dim">
                  <Suspense
                    fallback={
                      <div className="space-y-2 py-1">
                        <div className="h-3.5 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-tactical-raised" />
                        <div className="h-3.5 w-full animate-pulse rounded bg-slate-100 dark:bg-tactical-raised" />
                        <div className="h-3.5 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-tactical-raised" />
                      </div>
                    }
                  >
                    <MdxRenderer
                      source={announcement.body}
                      components={compactMdx}
                      fallback={
                        <div className="space-y-2 py-1">
                          <div className="h-3.5 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-tactical-raised" />
                          <div className="h-3.5 w-full animate-pulse rounded bg-slate-100 dark:bg-tactical-raised" />
                          <div className="h-3.5 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-tactical-raised" />
                        </div>
                      }
                    />
                  </Suspense>
                </div>
              </div>
              {/* Scroll affordance: fade the lower edge while more content remains. */}
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent transition-opacity duration-200 dark:from-tactical-surface ${
                  overflowing && !atBottom ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>

            <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 px-5 py-3.5 dark:border-tactical-border sm:px-6">
              <button
                ref={ackButtonRef}
                type="button"
                onClick={() => void acknowledge()}
                disabled={acking}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-signal-green dark:text-canvas-dark dark:hover:bg-signal-green/90 dark:focus-visible:ring-signal-green dark:focus-visible:ring-offset-tactical-surface"
              >
                {acking ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                    </svg>
                    {t('announcement.dismissing', { defaultValue: 'Dismissing…' })}
                  </>
                ) : (
                  <>
                    {t('announcement.acknowledge', { defaultValue: 'Got it' })}
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
