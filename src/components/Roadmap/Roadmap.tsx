import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContent } from '../../contexts/ContentContext';
import { useContentProgress } from '../../hooks/useContentProgress';
import ContentLayout from '../Common/ContentLayout';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Panel, Stat, StatusBadge, SegmentBar, Tag, TacticalButton, type StatusVariant } from '../tactical';

// Add a declaration for the window object with our custom property
declare global {
  interface Window {
    __APP_DATA__?: {
      menuItems: MenuItem[];
    }
  }
}

// Use the same MenuItem interface that App.tsx uses
interface MenuItem {
  name: string;
  description: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  status?: "recommended" | "new" | "coming-soon" | "required";
  prerequisites?: string[];
  category?: "Básico" | "Intermediário" | "Avançado" | "Foundational" | "Building Blocks" | "Application" | "Advanced Concepts" | "Security & Safety";
  skills?: string[];
  badges?: { text: string; color: string }[];
  component?: React.ComponentType;
  disabled?: boolean;
  customStyle?: string;
  customHoverStyle?: string;
}

const getDescendantPaths = (item: MenuItem): string[] => {
  const paths: string[] = [];
  if (item.children) {
    for (const child of item.children) {
      paths.push(child.path);
      if (child.children) {
        for (const grandchild of child.children) {
          paths.push(grandchild.path);
        }
      }
    }
  }
  return paths;
};

export default function Roadmap() {
  const { isCompleted } = useContentProgress();
  const { pages: contentPages } = useContent();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { t } = useTranslation();

  // menuItems is published to window.__APP_DATA__ by App.tsx once DB content
  // loads. Re-read it on navigation AND whenever the content index changes, so
  // a direct load/refresh of /roadmap picks up the menu once it's ready instead
  // of spinning forever on the initial empty array. App writes the window value
  // in an effect; since child effects run before parent effects, we retry on
  // the next tick when content is ready but the menu hasn't been published yet.
  useEffect(() => {
    const read = () => {
      const items = window.__APP_DATA__?.menuItems ?? [];
      if (items.length > 0) {
        setMenuItems(items);
        return true;
      }
      return false;
    };
    if (read()) return;
    const timer = window.setTimeout(read, 0);
    return () => window.clearTimeout(timer);
  }, [location, contentPages]);

  const makeMenuKey = (path: string, field: 'name' | 'description') =>
    `menu.${path.replace(/^\//, '').replace(/\//g, '.')}.${field}`;

  // Top-level modules only (exclude the roadmap itself, editors and external tools).
  const roadmapItems = menuItems.filter(item =>
    item.path !== '/roadmap' &&
    !item.path.includes('editor') &&
    !item.path.startsWith('http'),
  );

  const moduleStats = (item: MenuItem) => {
    const descendants = item.children && item.children.length > 0 ? getDescendantPaths(item) : [item.path];
    const total = descendants.length;
    const done = descendants.filter(isCompleted).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const status: StatusVariant = done === 0 ? 'pending' : done >= total ? 'completed' : 'in-progress';
    return { total, done, pct, status };
  };

  const statusLabel = (status: StatusVariant) =>
    status === 'completed' ? t('roadmap.completed') : status === 'in-progress' ? t('roadmap.in_progress') : t('roadmap.not_started');

  // Aggregate metrics.
  const totals = roadmapItems.reduce(
    (acc, item) => {
      const { total, done, status } = moduleStats(item);
      acc.lessons += total;
      acc.lessonsDone += done;
      if (status === 'completed') acc.modulesCleared += 1;
      return acc;
    },
    { lessons: 0, lessonsDone: 0, modulesCleared: 0 },
  );
  const readiness = totals.lessons > 0 ? Math.round((totals.lessonsDone / totals.lessons) * 100) : 0;

  if (menuItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ContentLayout hideCompletion>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-signal-cyan mx-auto mb-4"></div>
              <p className="label-mono">{t('common.loading')}</p>
            </div>
          </div>
        </ContentLayout>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      <ContentLayout hideCompletion>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-tactical-text">
              {t('roadmap.title')}
            </h1>
            <Tag color="amber">{t('roadmap.ops_map')}</Tag>
          </div>
          <p className="mt-1 max-w-3xl font-sans text-sm text-slate-500 dark:text-tactical-dim">
            {t('roadmap.description_1')} {t('roadmap.description_2')}
          </p>
        </div>

        {/* Metrics */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat
            value={totals.modulesCleared}
            label={t('roadmap.modules_cleared')}
            color="green"
            sub={t('roadmap.of_count', { count: roadmapItems.length })}
          />
          <Stat
            value={totals.lessonsDone}
            label={t('roadmap.lessons_done')}
            color="cyan"
            sub={t('roadmap.of_count', { count: totals.lessons })}
          />
          <Stat value={`${readiness}%`} label={t('roadmap.readiness')} color="amber" />
          <Stat value={roadmapItems.length} label={t('roadmap.total_phases')} />
        </div>

        {/* Overall progress */}
        <Panel title={t('roadmap.readiness')} accent="green" className="mb-6">
          <SegmentBar value={readiness} max={100} color={readiness === 100 ? 'green' : 'cyan'} caption={`${readiness}%`} />
          <p className="label-mono mt-2">{t('roadmap.completed_percent', { percent: readiness })}</p>
        </Panel>

        {/* Phase timeline */}
        <div className="space-y-4">
          {roadmapItems.map((item, index) => {
            const { total, done, pct, status } = moduleStats(item);
            const displayName = t(makeMenuKey(item.path, 'name'), { defaultValue: item.name });
            const displayDescription = t(makeMenuKey(item.path, 'description'), { defaultValue: item.description });
            const isOpen = expanded === item.path;
            const accent = status === 'completed' ? 'green' : status === 'in-progress' ? 'amber' : 'cyan';

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.4) }}
              >
                <Panel accent={accent} padded={false}>
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                    {/* Phase index */}
                    <div className="flex shrink-0 items-center gap-3">
                      <div className={`flex h-12 w-12 flex-col items-center justify-center border ${
                        status === 'completed'
                          ? 'border-signal-green/50 text-signal-green'
                          : status === 'in-progress'
                            ? 'border-signal-amber/50 text-signal-amber'
                            : 'border-slate-200 text-slate-500 dark:border-tactical-border dark:text-tactical-dim'
                      }`}>
                        <span className="font-sans text-[9px] leading-none opacity-70">{t('roadmap.phase')}</span>
                        <span className="font-mono text-lg font-bold leading-none tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                      </div>
                    </div>

                    {/* Main */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-3">
                        <h3 className="font-sans text-lg font-semibold text-slate-900 dark:text-tactical-text">{displayName}</h3>
                        <StatusBadge variant={status} label={statusLabel(status)} />
                      </div>
                      <p className="mb-3 font-sans text-xs text-slate-500 dark:text-tactical-dim">{displayDescription}</p>
                      <div className="max-w-md">
                        <SegmentBar value={done} max={total || 1} color={status === 'completed' ? 'green' : status === 'in-progress' ? 'amber' : 'cyan'} caption={`${done}/${total}`} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      {item.children && item.children.length > 0 && (
                        <TacticalButton
                          size="sm"
                          variant="ghost"
                          onClick={() => setExpanded(isOpen ? null : item.path)}
                        >
                          {isOpen ? '▾' : '▸'} {item.children.length} {t('roadmap.lessons')}
                        </TacticalButton>
                      )}
                      <TacticalButton
                        size="sm"
                        variant={status === 'completed' ? 'ghost' : 'secondary'}
                        onClick={() => navigate(item.path)}
                      >
                        {status === 'completed'
                          ? t('roadmap.review_module')
                          : done > 0
                            ? t('roadmap.resume_module')
                            : t('roadmap.start_module')}
                      </TacticalButton>
                    </div>
                  </div>

                  {/* Prerequisites / skills */}
                  {((item.prerequisites && item.prerequisites.length > 0) || (item.skills && item.skills.length > 0)) && (
                    <div className="flex flex-wrap gap-6 border-t border-slate-200 px-5 py-3 dark:border-tactical-border">
                      {item.prerequisites && item.prerequisites.length > 0 && (
                        <div>
                          <div className="label-mono mb-1.5">{t('roadmap.prerequisites')}</div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.prerequisites.map(p => (
                              <span key={p} className="rounded-full border border-slate-200 px-2 py-0.5 font-sans text-[11px] text-slate-600 dark:border-tactical-border dark:text-tactical-dim">{p}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.skills && item.skills.length > 0 && (
                        <div>
                          <div className="label-mono mb-1.5">{t('roadmap.skills')}</div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.skills.map(s => (
                              <span key={s} className="rounded-full border border-slate-200 px-2 py-0.5 font-sans text-[11px] text-slate-600 dark:border-tactical-border dark:text-tactical-dim">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Lessons list */}
                  {isOpen && item.children && item.children.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-slate-200 px-5 py-3 dark:border-tactical-border"
                    >
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                        {item.children.map(child => {
                          const childName = t(makeMenuKey(child.path, 'name'), { defaultValue: child.name });
                          const childDone = isCompleted(child.path);
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              className="flex items-center gap-2 rounded-md px-2 py-1.5 font-sans text-xs text-slate-600 transition-colors hover:bg-slate-100 dark:text-tactical-dim dark:hover:bg-tactical-surface"
                            >
                              <span className={childDone ? 'text-emerald-600 dark:text-signal-green' : 'text-slate-400 dark:text-tactical-label'} aria-hidden>
                                {childDone ? '✓' : '○'}
                              </span>
                              {childName}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </Panel>
              </motion.div>
            );
          })}
        </div>
      </ContentLayout>
    </div>
  );
}
