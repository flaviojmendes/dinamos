import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useContentProgress } from '../../hooks/useContentProgress';
import { contentManifest } from '../../config/contentManifest';
import { getTopics, ForumTopic } from '../../services/forumService';
import {
  Panel,
  Stat,
  StatusBadge,
  SegmentBar,
  DataTable,
  Tag,
  TacticalButton,
  type Column,
  type StatusVariant,
} from '../tactical';

type Tier = 'FOUNDATIONAL' | 'CORE' | 'ADVANCED' | 'APPLIED';

interface ModuleDef {
  id: string;
  label: string;
  tier: Tier;
  /** Index/landing path for the module. */
  base: string;
  /** Explicit lesson paths (for modules without a shared prefix). */
  paths?: string[];
}

// Modules are derived from contentManifest path prefixes (URLs stay unchanged).
const MODULES: ModuleDef[] = [
  { id: 'fundamentals', label: 'Fundamentals', tier: 'FOUNDATIONAL', base: '/intro', paths: ['/intro', '/sistemas-distribuidos-101', '/system-design-101'] },
  { id: 'theory', label: 'Theoretical Foundations', tier: 'FOUNDATIONAL', base: '/theoretical-foundations' },
  { id: 'components', label: 'System Components', tier: 'CORE', base: '/componentes' },
  { id: 'design', label: 'Design Principles', tier: 'CORE', base: '/principios-design' },
  { id: 'consistency', label: 'Consistency Strategies', tier: 'ADVANCED', base: '/estrategias-de-consistencia' },
  { id: 'security', label: 'Security', tier: 'ADVANCED', base: '/seguranca' },
  { id: 'monitoring', label: 'Monitoring & Maintenance', tier: 'ADVANCED', base: '/monitoramento-e-manutencao' },
  { id: 'cases', label: 'Real-World Cases', tier: 'APPLIED', base: '/casos-reais' },
];

const tierColor: Record<Tier, string> = {
  FOUNDATIONAL: 'text-signal-cyan',
  CORE: 'text-signal-green',
  ADVANCED: 'text-signal-amber',
  APPLIED: 'text-signal-red',
};

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

export default function CommandCenter() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isSubscribed } = useAuth();
  const { isCompleted, updateTrigger } = useContentProgress();

  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    getTopics({ sort: 'recent', limit: 5 })
      .then((data) => active && setTopics(data.topics))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  // Cmd/Ctrl+K opens the quick-jump palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const rows: ModuleRow[] = useMemo(() => {
    return MODULES.map((m) => {
      const lessons = (m.paths ?? contentManifest.filter((e) => e.path.startsWith(m.base)).map((e) => e.path));
      const uniqueLessons = Array.from(new Set(lessons));
      const total = uniqueLessons.length;
      const done = uniqueLessons.filter((p) => isCompleted(p)).length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      const nextPath = uniqueLessons.find((p) => !isCompleted(p)) ?? null;
      const status: StatusVariant = done === 0 ? 'pending' : done === total ? 'completed' : 'in-progress';
      return { ...m, total, done, pct, status, nextPath };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTrigger, isCompleted]);

  const totals = useMemo(() => {
    const total = rows.reduce((a, r) => a + r.total, 0);
    const done = rows.reduce((a, r) => a + r.done, 0);
    const modulesDone = rows.filter((r) => r.status === 'completed').length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, modulesDone, pct };
  }, [rows]);

  // First incomplete lesson across modules = recommended next operation.
  const recommended = useMemo(() => {
    for (const r of rows) {
      if (r.nextPath) return { path: r.nextPath, module: r.label, id: r.id };
    }
    return null;
  }, [rows]);

  const allLessons = useMemo(
    () =>
      Array.from(new Set(contentManifest.map((e) => e.path))).map((path) => ({
        path,
        label: lessonLabel(path),
      })),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? allLessons.filter((l) => l.label.toLowerCase().includes(q) || l.path.toLowerCase().includes(q))
      : allLessons;
    return base.slice(0, 12);
  }, [query, allLessons]);

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

  const greeting = (user?.displayName || user?.email || t('command_center.operator')).split('@')[0];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-bold uppercase tracking-wider text-slate-900 dark:text-tactical-text">
              {t('command_center.title')}
            </h1>
            <Tag color="green">{t('command_center.session_active')}</Tag>
          </div>
          <p className="mt-1 font-mono text-sm text-slate-500 dark:text-tactical-dim">
            {t('command_center.operator')} <span className="text-slate-900 dark:text-tactical-text">{greeting}</span> {t('command_center.readiness_suffix', { pct: totals.pct })}
          </p>
        </div>
        <TacticalButton variant="secondary" onClick={() => setPaletteOpen(true)}>
          {t('command_center.quick_jump')}
          <span className="ml-1 border border-current px-1 text-[10px] opacity-70">⌘K</span>
        </TacticalButton>
      </div>

      {/* Metrics + Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title={t('command_center.metrics_title')} className="lg:col-span-2" bodyClassName="p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat value={totals.modulesDone} label={t('command_center.modules_cleared')} color="green" sub={t('command_center.stat_of', { count: rows.length })} />
            <Stat value={totals.done} label={t('command_center.lessons_done')} color="cyan" sub={t('command_center.stat_of', { count: totals.total })} />
            <Stat value={`${totals.pct}%`} label={t('command_center.readiness')} color="amber" />
            <Stat value={isSubscribed ? 'FREE-TIER-1' : t('command_center.guest')} label={t('command_center.clearance')} />
          </div>
        </Panel>

        <Panel title={t('command_center.operation_activity')} accent="cyan">
          {recommended ? (
            <div className="space-y-4">
              <div>
                <span className="label-mono">{t('command_center.recommended_next')}</span>
                <p className="mt-1 font-mono text-sm text-slate-900 dark:text-tactical-text">
                  {lessonLabel(recommended.path)}
                </p>
                <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim">
                  {t(`command_center.modules.${recommended.id}`, { defaultValue: recommended.module })}
                </p>
              </div>
              <SegmentBar value={totals.done} max={totals.total || 1} color="cyan" caption={`${totals.pct}%`} />
              <TacticalButton variant="primary" className="w-full" onClick={() => navigate(recommended.path)}>
                {t('command_center.deploy')}
              </TacticalButton>
            </div>
          ) : (
            <div className="py-6 text-center font-mono text-sm text-signal-green">
              {t('command_center.all_cleared')}
            </div>
          )}
        </Panel>
      </div>

      {/* Mission table + feed */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title={t('command_center.mission_table')} className="lg:col-span-2" padded={false}>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(r) => r.id}
            onRowClick={(r) => setExpanded((cur) => (cur === r.id ? null : r.id))}
            expandedKey={expanded}
            renderExpanded={(r) => {
              const lessons = Array.from(
                new Set(r.paths ?? contentManifest.filter((e) => e.path.startsWith(r.base)).map((e) => e.path)),
              );
              return (
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {lessons.map((p) => (
                    <button
                      key={p}
                      onClick={() => navigate(p)}
                      className="flex items-center gap-2 px-2 py-1.5 text-left font-mono text-xs text-slate-600 hover:bg-slate-100 dark:text-tactical-dim dark:hover:bg-tactical-surface"
                    >
                      <span className={isCompleted(p) ? 'text-signal-green' : 'text-slate-400 dark:text-tactical-label'}>
                        {isCompleted(p) ? '[x]' : '[ ]'}
                      </span>
                      {lessonLabel(p)}
                    </button>
                  ))}
                </div>
              );
            }}
          />
        </Panel>

        <Panel title={t('command_center.activity_feed')} accent="green" action={<button onClick={() => navigate('/forum')} className="font-mono uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:text-tactical-dim dark:hover:text-tactical-text">{t('command_center.view_all')} ›</button>}>
          {topics.length === 0 ? (
            <p className="py-6 text-center font-mono text-xs text-slate-500 dark:text-tactical-dim">{t('command_center.no_transmissions')}</p>
          ) : (
            <ul className="space-y-2">
              {topics.map((tp) => (
                <li key={tp.id}>
                  <button
                    onClick={() => navigate(`/forum/${tp.id}`)}
                    className="w-full border border-transparent px-2 py-2 text-left hover:border-slate-200 hover:bg-slate-50 dark:hover:border-tactical-border dark:hover:bg-tactical-raised"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-xs text-slate-900 dark:text-tactical-text">{tp.title}</span>
                      <span className="shrink-0 font-mono text-[10px] text-slate-400 dark:text-tactical-label">{formatRelativeTime(tp.created_at, t('command_center.time_now'))}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Tag color="cyan">{tp.category}</Tag>
                      <span className="font-mono text-[10px] text-slate-400 dark:text-tactical-label">{t('command_center.replies', { count: tp.comment_count ?? 0 })}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {/* Quick-jump command palette */}
      {paletteOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="w-full max-w-xl tactical-panel shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-tactical-border">
              <span className="font-mono text-signal-green">›</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filtered[0]) {
                    navigate(filtered[0].path);
                    setPaletteOpen(false);
                    setQuery('');
                  }
                }}
                placeholder={t('command_center.search_placeholder')}
                aria-label={t('command_center.search_aria')}
                className="flex-1 bg-transparent font-mono text-sm uppercase tracking-wider text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-tactical-text dark:placeholder:text-tactical-label"
              />
              <span className="font-mono text-[10px] text-slate-400 dark:text-tactical-label">ESC</span>
            </div>
            <ul className="max-h-80 overflow-y-auto py-1">
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center font-mono text-xs text-slate-500 dark:text-tactical-dim">{t('command_center.no_matches')}</li>
              )}
              {filtered.map((l) => (
                <li key={l.path}>
                  <button
                    onClick={() => {
                      navigate(l.path);
                      setPaletteOpen(false);
                      setQuery('');
                    }}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left font-mono text-sm text-slate-700 hover:bg-slate-100 dark:text-tactical-dim dark:hover:bg-tactical-raised"
                  >
                    <span className="truncate text-slate-900 dark:text-tactical-text">{l.label}</span>
                    <span className="shrink-0 text-[10px] text-slate-400 dark:text-tactical-label">{l.path}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
