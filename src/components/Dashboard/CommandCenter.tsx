import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Coins, ChevronRight, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useContentProgress } from '../../hooks/useContentProgress';
import { useContent } from '../../contexts/ContentContext';
import { type ModuleDef, type Tier } from '../../config/contentRegistry';
import { getTopics, ForumTopic } from '../../services/forumService';
import { openCommandPalette } from '../Common/CommandPalette';
import ProgressRing from './ProgressRing';
import {
  Panel,
  StatusBadge,
  SegmentBar,
  DataTable,
  Tag,
  TacticalButton,
  type Column,
  type StatusVariant,
} from '../tactical';

// Learning modules come from the shared content registry (single source of
// truth, now DB-backed). Tool/community destinations are excluded from the
// mission table; the list is derived per-render from the content context.

const tierColor: Record<Tier, string> = {
  FOUNDATIONAL: 'text-signal-cyan',
  CORE: 'text-signal-green',
  ADVANCED: 'text-signal-amber',
  APPLIED: 'text-signal-red',
  TOOLS: 'text-slate-400 dark:text-tactical-label',
};

// Merged designLab destinations, surfaced as quick-launch cards on the dashboard.
interface PracticeLink {
  path: string;
  nameKey: string;
  name: string;
  descKey: string;
  desc: string;
  color: string;
  icon: JSX.Element;
}

const PRACTICE_LINKS: PracticeLink[] = [
  {
    path: '/design-lab',
    nameKey: 'menu.home.name',
    name: 'Design Lab',
    descKey: 'menu.home.description',
    desc: 'Solve architecture challenges with AI feedback',
    color: 'text-signal-green',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 3v6l-5.5 9.5A1.5 1.5 0 005 21h14a1.5 1.5 0 001.3-2.5L15 9V3M8 3h8M9 14h6" />
      </svg>
    ),
  },
  {
    path: '/quizzes',
    nameKey: 'menu.quizzes.name',
    name: 'Quizzes',
    descKey: 'menu.quizzes.description',
    desc: 'Test your knowledge and earn DinaCoins',
    color: 'text-signal-amber',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    path: '/ranking',
    nameKey: 'menu.ranking.name',
    name: 'Ranking',
    descKey: 'menu.ranking.description',
    desc: 'Global community leaderboard',
    color: 'text-signal-cyan',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    path: '/forum',
    nameKey: 'menu.forum.name',
    name: 'Forum',
    descKey: 'menu.forum.description',
    desc: 'Discuss and learn with the community',
    color: 'text-signal-green',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586M7 4h8a2 2 0 012 2v6a2 2 0 01-2 2H9l-4 4V6a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    path: '/notifications',
    nameKey: 'menu.notifications.name',
    name: 'Notifications',
    descKey: 'menu.notifications.description',
    desc: 'Replies, mentions and announcements',
    color: 'text-signal-red',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    path: '/profile',
    nameKey: 'menu.profile.name',
    name: 'Profile',
    descKey: 'menu.profile.description',
    desc: 'Your progress, solutions and DinaCoins',
    color: 'text-slate-400 dark:text-tactical-label',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

function lessonLabel(path: string): string {
  const seg = path.split('/').filter(Boolean).pop() ?? path;
  return seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatRelativeTime(dateString: string, nowLabel: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (mins < 1) return nowLabel;
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return new Date(dateString).toLocaleDateString();
}

interface ModuleRow extends ModuleDef {
  total: number;
  done: number;
  pct: number;
  status: StatusVariant;
  nextPath: string | null;
}

// Lightweight pulsing placeholder line.
function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 dark:bg-tactical-raised ${className}`} />;
}

export default function CommandCenter() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, appUser } = useAuth();
  const { isCompleted, updateTrigger } = useContentProgress();
  const { pages: contentPages, modules, loading: contentLoading } = useContent();
  const moduleRows: ModuleDef[] = useMemo(
    () => modules.filter((m) => m.tier !== 'TOOLS'),
    [modules]
  );

  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoadingTopics(true);
    getTopics({ sort: 'recent', limit: 5 })
      .then((data) => active && setTopics(data.topics))
      .catch(() => undefined)
      .finally(() => active && setLoadingTopics(false));
    return () => {
      active = false;
    };
  }, []);

  const rows: ModuleRow[] = useMemo(() => {
    return moduleRows.map((m) => {
      const lessons = (m.paths ?? contentPages.filter((e) => e.path.startsWith(m.base)).map((e) => e.path));
      const uniqueLessons = Array.from(new Set(lessons));
      const total = uniqueLessons.length;
      const done = uniqueLessons.filter((p) => isCompleted(p)).length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      const nextPath = uniqueLessons.find((p) => !isCompleted(p)) ?? null;
      const status: StatusVariant = done === 0 ? 'pending' : done === total ? 'completed' : 'in-progress';
      return { ...m, total, done, pct, status, nextPath };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTrigger, isCompleted, contentPages, moduleRows]);

  const totals = useMemo(() => {
    const total = rows.reduce((a, r) => a + r.total, 0);
    const done = rows.reduce((a, r) => a + r.done, 0);
    const modulesDone = rows.filter((r) => r.status === 'completed').length;
    const inProgress = rows.filter((r) => r.status === 'in-progress').length;
    const moduleCount = rows.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, modulesDone, inProgress, moduleCount, pct };
  }, [rows]);

  // First incomplete lesson across modules = recommended next operation.
  const recommended = useMemo(() => {
    for (const r of rows) {
      if (r.nextPath) return { path: r.nextPath, module: r.label, id: r.id };
    }
    return null;
  }, [rows]);

  const columns: Column<ModuleRow>[] = [
    {
      key: 'module',
      header: t('command_center.col_operation'),
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="text-slate-400 dark:text-tactical-label">{expanded === r.id ? '▾' : '▸'}</span>
          <span className="font-medium text-slate-900 dark:text-tactical-text">
            {t(`command_center.modules.${r.id}`, { defaultValue: r.label })}
          </span>
        </div>
      ),
    },
    {
      key: 'tier',
      header: t('command_center.col_priority'),
      render: (r) => (
        <span className={tierColor[r.tier]}>{t(`command_center.tier.${r.tier.toLowerCase()}`)}</span>
      ),
    },
    {
      key: 'progress',
      header: t('command_center.col_progress'),
      className: 'w-48',
      render: (r) => (
        <SegmentBar
          value={r.done}
          max={r.total || 1}
          color={r.status === 'completed' ? 'green' : r.status === 'in-progress' ? 'amber' : 'white'}
          caption={`${r.done}/${r.total}`}
        />
      ),
    },
    {
      key: 'status',
      header: t('command_center.col_status'),
      render: (r) => <StatusBadge variant={r.status} />,
    },
    {
      key: 'action',
      header: '',
      align: 'right',
      render: (r) => (
        <TacticalButton
          size="sm"
          variant={r.status === 'completed' ? 'ghost' : 'secondary'}
          onClick={(e) => {
            e.stopPropagation();
            navigate(r.nextPath ?? r.base);
          }}
        >
          {r.status === 'completed'
            ? t('command_center.action_review')
            : r.done > 0
              ? t('command_center.action_resume')
              : t('command_center.action_start')}
        </TacticalButton>
      ),
    },
  ];

  const greeting = (appUser?.nickname || user?.displayName || user?.email || t('command_center.operator')).split('@')[0];
  const avatarUrl = appUser?.avatar_image ?? null;
  const roleColor = appUser?.role_color || '#34d399';
  const coins = appUser?.tokens;
  const resumeLabel = totals.done > 0 ? t('command_center.action_resume') : t('command_center.deploy');

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Briefing header */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={greeting}
              className="h-12 w-12 shrink-0 rounded-full border-2 object-cover"
              style={{ borderColor: roleColor }}
            />
          ) : (
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-sans text-lg font-bold text-white"
              style={{ backgroundColor: roleColor }}
              aria-hidden
            >
              {greeting.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-tactical-text">
                {t('command_center.title')}
              </h1>
              <Tag color="green">{t('command_center.session_active')}</Tag>
            </div>
            <p className="mt-0.5 truncate font-sans text-sm text-slate-500 dark:text-tactical-dim">
              {t('command_center.operator')}{' '}
              <span className="font-medium text-slate-900 dark:text-tactical-text">{greeting}</span>
              <span className="hidden sm:inline"> — {t('command_center.greeting_subtitle')}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {typeof coins === 'number' && (
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-tactical-border dark:bg-tactical-surface">
              <Coins className="h-4 w-4 text-signal-amber" />
              <span className="font-mono text-sm font-semibold tabular-nums text-slate-900 dark:text-tactical-text">
                {coins.toLocaleString()}
              </span>
              <span className="label-mono hidden sm:inline">{t('command_center.coins_label')}</span>
            </div>
          )}
          <TacticalButton variant="secondary" onClick={() => openCommandPalette()}>
            {t('command_center.quick_jump')}
            <span className="ml-1 border border-current px-1 text-[10px] opacity-70">⌘K</span>
          </TacticalButton>
        </div>
      </header>

      {/* Briefing hero: up-next + progress overview */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title={t('command_center.operation_activity')} accent="cyan" className="lg:col-span-2">
          {contentLoading ? (
            <div className="space-y-4 py-2">
              <SkeletonLine className="h-3 w-28" />
              <SkeletonLine className="h-6 w-2/3" />
              <SkeletonLine className="h-2.5 w-full max-w-md" />
            </div>
          ) : recommended ? (
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0 flex-1">
                <span className="label-mono">{t('command_center.recommended_next')}</span>
                <p className="mt-1.5 font-sans text-xl font-semibold leading-snug text-slate-900 dark:text-tactical-text">
                  {lessonLabel(recommended.path)}
                </p>
                <p className="mt-0.5 font-sans text-sm text-slate-500 dark:text-tactical-dim">
                  {t(`command_center.modules.${recommended.id}`, { defaultValue: recommended.module })}
                </p>
                <SegmentBar
                  value={totals.done}
                  max={totals.total || 1}
                  color="cyan"
                  caption={`${totals.pct}%`}
                  className="mt-4 max-w-md"
                />
              </div>
              <TacticalButton
                variant="primary"
                size="lg"
                className="shrink-0"
                onClick={() => navigate(recommended.path)}
              >
                {resumeLabel}
                <ArrowRight className="h-4 w-4" />
              </TacticalButton>
            </div>
          ) : (
            <div className="py-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-signal-green/40 bg-signal-green/5">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-signal-green" />
              </div>
              <p className="font-sans text-sm font-semibold text-emerald-600 dark:text-signal-green">
                {t('command_center.all_cleared')}
              </p>
              <p className="mx-auto mt-1 max-w-xs font-sans text-xs text-slate-500 dark:text-tactical-dim">
                {t('command_center.all_cleared_sub')}
              </p>
            </div>
          )}
        </Panel>

        <Panel title={t('command_center.progress_overview')} accent="green">
          {contentLoading ? (
            <div className="flex flex-col items-center gap-5 py-2">
              <div className="h-[132px] w-[132px] animate-pulse rounded-full bg-slate-200 dark:bg-tactical-raised" />
              <SkeletonLine className="h-10 w-full" />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ProgressRing value={totals.pct} label={t('command_center.ring_complete')} />
              <div className="mt-5 grid w-full grid-cols-3 gap-2 border-t border-slate-200 pt-4 text-center dark:border-tactical-border">
                {[
                  { value: `${totals.modulesDone}/${totals.moduleCount}`, label: t('command_center.modules_cleared') },
                  { value: `${totals.done}/${totals.total}`, label: t('command_center.stat_lessons') },
                  { value: `${totals.inProgress}`, label: t('command_center.stat_in_progress') },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="font-sans text-lg font-bold tabular-nums leading-none text-slate-900 dark:text-tactical-text">
                      {s.value}
                    </div>
                    <div className="label-mono mt-1.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* Practice Arena: merged designLab destinations */}
      <div className="mt-4">
        <Panel
          title={t('command_center.modules.practice', { defaultValue: 'Practice Arena' })}
          accent="amber"
          bodyClassName="p-4"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRACTICE_LINKS.map((p) => (
              <button
                key={p.path}
                onClick={() => navigate(p.path)}
                className="group flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition-all hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-sm dark:border-tactical-border dark:bg-tactical-surface dark:hover:border-signal-green dark:hover:shadow-none"
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-tactical-border ${p.color}`}>
                  {p.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text">
                    {t(p.nameKey, { defaultValue: p.name })}
                  </span>
                  <span className="mt-0.5 block truncate font-sans text-xs text-slate-500 dark:text-tactical-dim">
                    {t(p.descKey, { defaultValue: p.desc })}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-500 dark:text-tactical-label dark:group-hover:text-signal-green" />
              </button>
            ))}
          </div>
        </Panel>
      </div>

      {/* Mission table + feed */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title={t('command_center.mission_table')} className="lg:col-span-2" padded={false}>
          {contentLoading ? (
            <div className="space-y-3 p-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <SkeletonLine className="h-4 flex-1" />
                  <SkeletonLine className="h-2 w-40" />
                  <SkeletonLine className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <DataTable
              columns={columns}
              rows={rows}
              rowKey={(r) => r.id}
              empty={t('command_center.modules_empty')}
              onRowClick={(r) => setExpanded((cur) => (cur === r.id ? null : r.id))}
              expandedKey={expanded}
              renderExpanded={(r) => {
                const lessons = Array.from(
                  new Set(r.paths ?? contentPages.filter((e) => e.path.startsWith(r.base)).map((e) => e.path)),
                );
                return (
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {lessons.map((p) => (
                      <button
                        key={p}
                        onClick={() => navigate(p)}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left font-sans text-xs text-slate-600 hover:bg-slate-100 dark:text-tactical-dim dark:hover:bg-tactical-surface"
                      >
                        <span className={isCompleted(p) ? 'text-emerald-600 dark:text-signal-green' : 'text-slate-300 dark:text-tactical-label'}>
                          {isCompleted(p) ? '✓' : '○'}
                        </span>
                        {lessonLabel(p)}
                      </button>
                    ))}
                  </div>
                );
              }}
            />
          )}
        </Panel>

        <Panel
          title={t('command_center.activity_feed')}
          accent="green"
          action={
            <button
              onClick={() => navigate('/forum')}
              className="font-sans text-slate-500 hover:text-slate-900 dark:text-tactical-dim dark:hover:text-tactical-text"
            >
              {t('command_center.view_all')} ›
            </button>
          }
        >
          {loadingTopics ? (
            <ul className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <li key={i} className="space-y-2 px-2 py-2">
                  <SkeletonLine className="h-4 w-5/6" />
                  <SkeletonLine className="h-3 w-1/3" />
                </li>
              ))}
            </ul>
          ) : topics.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 dark:border-tactical-border dark:bg-tactical-raised">
                <MessageSquare className="h-5 w-5 text-slate-400 dark:text-tactical-label" />
              </div>
              <p className="font-sans text-sm text-slate-600 dark:text-tactical-text">
                {t('command_center.no_transmissions')}
              </p>
              <p className="mx-auto mt-1 max-w-[16rem] font-sans text-xs text-slate-500 dark:text-tactical-dim">
                {t('command_center.activity_empty_sub')}
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {topics.map((tp) => (
                <li key={tp.id}>
                  <button
                    onClick={() => navigate(`/forum/topic/${tp.id}`)}
                    className="w-full rounded-lg border border-transparent px-2 py-2 text-left transition-colors hover:bg-slate-50 dark:hover:border-tactical-border dark:hover:bg-tactical-raised"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-sans text-sm text-slate-900 dark:text-tactical-text">{tp.title}</span>
                      <span className="shrink-0 font-sans text-[10px] text-slate-400 dark:text-tactical-label">{formatRelativeTime(tp.created_at, t('command_center.time_now'))}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Tag color="cyan">{tp.category}</Tag>
                      <span className="font-sans text-[10px] text-slate-400 dark:text-tactical-label">{t('command_center.replies', { count: tp.comment_count ?? 0 })}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
