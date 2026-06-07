import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  contentRegistry,
  getModule,
  menuKey,
  fallbackLabel,
  MODULES,
  TIER_ORDER,
  type ContentType,
  type Tier,
} from '../../config/contentRegistry';
import { useContentProgress } from '../../hooks/useContentProgress';

type ProgressFilter = 'done' | 'todo';
type AccessFilter = 'free' | 'paid';

const TYPE_META: Record<ContentType, { symbol: string; color: string; key: string; fallback: string }> = {
  lesson: { symbol: '▪', color: 'text-signal-green', key: 'explore.type_lesson', fallback: 'Lesson' },
  simulator: { symbol: '◆', color: 'text-signal-amber', key: 'explore.type_simulator', fallback: 'Simulator' },
  case: { symbol: '★', color: 'text-signal-red', key: 'explore.type_case', fallback: 'Case' },
  tool: { symbol: '⚙', color: 'text-slate-400 dark:text-tactical-label', key: 'explore.type_tool', fallback: 'Tool' },
};

const TYPE_ORDER: ContentType[] = ['lesson', 'simulator', 'case', 'tool'];

export default function ExplorePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isCompleted, updateTrigger } = useContentProgress();

  const [query, setQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<Tier | null>(null);
  const [typeFilter, setTypeFilter] = useState<ContentType | null>(null);
  const [accessFilter, setAccessFilter] = useState<AccessFilter | null>(null);
  const [progressFilter, setProgressFilter] = useState<ProgressFilter | null>(null);

  // Enrich registry items with translated labels for searching/rendering.
  const enriched = useMemo(() => {
    return contentRegistry.map((i) => {
      const label = t(menuKey(i.path, 'name'), { defaultValue: fallbackLabel(i.path) });
      const description = t(menuKey(i.path, 'description'), { defaultValue: '' });
      const mod = getModule(i.moduleId);
      const moduleLabel = mod ? t(`command_center.modules.${mod.id}`, { defaultValue: mod.label }) : '';
      return {
        ...i,
        label,
        description,
        moduleLabel,
        haystack: `${label} ${description} ${moduleLabel} ${i.path}`.toLowerCase(),
      };
    });
  }, [t]);

  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const filtered = useMemo(() => {
    return enriched.filter((i) => {
      if (moduleFilter && i.moduleId !== moduleFilter) return false;
      if (tierFilter && i.tier !== tierFilter) return false;
      if (typeFilter && i.type !== typeFilter) return false;
      if (accessFilter === 'free' && !i.free) return false;
      if (accessFilter === 'paid' && i.free) return false;
      if (progressFilter === 'done' && !isCompleted(i.path)) return false;
      if (progressFilter === 'todo' && isCompleted(i.path)) return false;
      if (tokens.length && !tokens.every((tok) => i.haystack.includes(tok))) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enriched, moduleFilter, tierFilter, typeFilter, accessFilter, progressFilter, query, updateTrigger]);

  const typeCounts = useMemo(() => {
    const counts: Record<ContentType, number> = { lesson: 0, simulator: 0, case: 0, tool: 0 };
    for (const i of contentRegistry) counts[i.type] += 1;
    return counts;
  }, []);

  const hasActiveFilters =
    moduleFilter || tierFilter || typeFilter || accessFilter || progressFilter || query.trim();

  const clearAll = () => {
    setQuery('');
    setModuleFilter(null);
    setTierFilter(null);
    setTypeFilter(null);
    setAccessFilter(null);
    setProgressFilter(null);
  };

  const chip = (active: boolean) =>
    `cursor-pointer rounded-full border px-2.5 py-1 font-sans text-[11px] transition-colors ${
      active
        ? 'border-brand-600 bg-brand-50 text-brand-700 dark:border-signal-green dark:bg-tactical-raised dark:text-signal-green'
        : 'border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-900 dark:border-tactical-border dark:text-tactical-dim dark:hover:border-tactical-line dark:hover:text-tactical-text'
    }`;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-tactical-text">
          {t('explore.title', { defaultValue: 'Explore' })}
        </h1>
        <p className="mt-1 font-sans text-sm text-slate-500 dark:text-tactical-dim">
          {t('explore.subtitle', {
            defaultValue: 'Search and filter every lesson, simulator and case in one place.',
          })}
        </p>
      </div>

      {/* Prominent search */}
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-tactical-border dark:bg-tactical-surface">
        <svg className="h-5 w-5 shrink-0 text-slate-400 dark:text-tactical-label" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('command_center.search_placeholder')}
          aria-label={t('command_center.search_aria')}
          className="flex-1 bg-transparent font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-tactical-text dark:placeholder:text-tactical-label"
        />
        {hasActiveFilters && (
          <button onClick={clearAll} className={chip(false)}>
            {t('explore.clear', { defaultValue: 'Clear' })}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        {/* Type */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-mono w-16 shrink-0">{t('explore.filter_type', { defaultValue: 'Type' })}</span>
          {TYPE_ORDER.map((ty) => (
            <button key={ty} onClick={() => setTypeFilter((c) => (c === ty ? null : ty))} className={chip(typeFilter === ty)}>
              <span className={TYPE_META[ty].color} aria-hidden>{TYPE_META[ty].symbol}</span>{' '}
              {t(TYPE_META[ty].key, { defaultValue: TYPE_META[ty].fallback })} ({typeCounts[ty]})
            </button>
          ))}
        </div>

        {/* Tier */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-mono w-16 shrink-0">{t('explore.filter_tier', { defaultValue: 'Tier' })}</span>
          {TIER_ORDER.map((tr) => (
            <button key={tr} onClick={() => setTierFilter((c) => (c === tr ? null : tr))} className={chip(tierFilter === tr)}>
              {t(`command_center.tier.${tr.toLowerCase()}`, { defaultValue: tr })}
            </button>
          ))}
        </div>

        {/* Module */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-mono w-16 shrink-0">{t('explore.filter_module', { defaultValue: 'Module' })}</span>
          {MODULES.map((m) => (
            <button key={m.id} onClick={() => setModuleFilter((c) => (c === m.id ? null : m.id))} className={chip(moduleFilter === m.id)}>
              {t(`command_center.modules.${m.id}`, { defaultValue: m.label })}
            </button>
          ))}
        </div>

        {/* Access + Progress */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-mono w-16 shrink-0">{t('explore.filter_other', { defaultValue: 'More' })}</span>
          <button onClick={() => setAccessFilter((c) => (c === 'free' ? null : 'free'))} className={chip(accessFilter === 'free')}>
            {t('explore.access_free', { defaultValue: 'Free' })}
          </button>
          <button onClick={() => setAccessFilter((c) => (c === 'paid' ? null : 'paid'))} className={chip(accessFilter === 'paid')}>
            {t('explore.access_paid', { defaultValue: 'Premium' })}
          </button>
          <button onClick={() => setProgressFilter((c) => (c === 'todo' ? null : 'todo'))} className={chip(progressFilter === 'todo')}>
            {t('explore.progress_todo', { defaultValue: 'Not started' })}
          </button>
          <button onClick={() => setProgressFilter((c) => (c === 'done' ? null : 'done'))} className={chip(progressFilter === 'done')}>
            {t('explore.progress_done', { defaultValue: 'Completed' })}
          </button>
        </div>
      </div>

      {/* Result count */}
      <div className="mb-3 label-mono">
        {t('explore.results', { defaultValue: '{{count}} results', count: filtered.length })}
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-16 text-center font-sans text-sm text-slate-500 dark:border-tactical-border dark:text-tactical-dim">
          {t('command_center.no_matches')}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((i) => {
            const meta = TYPE_META[i.type];
            const done = isCompleted(i.path);
            return (
              <button
                key={i.path}
                onClick={() => navigate(i.path)}
                className="group flex cursor-pointer flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:border-brand-500 dark:border-tactical-border dark:bg-tactical-surface dark:hover:border-signal-green"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-sans text-[10px] text-slate-400 dark:text-tactical-label">
                    <span className={meta.color} aria-hidden>{meta.symbol}</span>
                    {t(meta.key, { defaultValue: meta.fallback })}
                  </span>
                  {done ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-sans text-[10px] text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                      {t('explore.badge_done', { defaultValue: 'Done' })}
                    </span>
                  ) : i.free ? (
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 font-sans text-[10px] text-brand-700 dark:bg-tactical-raised dark:text-signal-cyan">
                      {t('explore.access_free', { defaultValue: 'Free' })}
                    </span>
                  ) : null}
                </div>
                <span className="font-sans text-sm font-medium text-slate-900 dark:text-tactical-text">
                  {i.label}
                </span>
                {i.description && (
                  <span className="line-clamp-2 font-sans text-xs text-slate-500 dark:text-tactical-dim">
                    {i.description}
                  </span>
                )}
                <span className="mt-auto pt-1 font-sans text-[10px] text-slate-400 dark:text-tactical-label">
                  {i.moduleLabel}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
