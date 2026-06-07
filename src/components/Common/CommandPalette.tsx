import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  contentRegistry,
  getModule,
  menuKey,
  fallbackLabel,
  type ContentType,
} from '../../config/contentRegistry';
import { quickAccessLinks } from '../../config/quickAccess';

const OPEN_EVENT = 'command-palette:open';

/** Imperatively open the global command palette from anywhere. */
export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

type PaletteGroup = 'nav' | ContentType;

interface PaletteItem {
  path: string;
  label: string;
  description: string;
  moduleLabel: string;
  group: PaletteGroup;
  /** Concatenated lowercase haystack for matching. */
  haystack: string;
}

// Render order + headers for result groups.
const GROUP_ORDER: PaletteGroup[] = ['nav', 'lesson', 'simulator', 'case', 'tool'];

const GROUP_MARKERS: Record<PaletteGroup, { symbol: string; color: string }> = {
  nav: { symbol: '▸', color: 'text-signal-cyan' },
  lesson: { symbol: '▪', color: 'text-signal-green' },
  simulator: { symbol: '◆', color: 'text-signal-amber' },
  case: { symbol: '★', color: 'text-signal-red' },
  tool: { symbol: '⚙', color: 'text-slate-400 dark:text-tactical-label' },
};

const MAX_RESULTS = 24;

/**
 * App-wide quick-jump command palette. Toggled with Cmd/Ctrl+K (or the
 * openCommandPalette() helper) and reachable from every page. Searches the
 * full content registry — lessons, simulators, cases, tools — by title,
 * description, module, path, and keywords, with keyboard navigation.
 */
export default function CommandPalette() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  // Reset query/selection and focus the input whenever the palette opens.
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const items: PaletteItem[] = useMemo(() => {
    const groupLabel = (g: PaletteGroup) =>
      t(`command_palette.group_${g}`, {
        defaultValue: { nav: 'Navigate', lesson: 'Lessons', simulator: 'Simulators', case: 'Cases', tool: 'Tools' }[g],
      });

    const nav: PaletteItem[] = quickAccessLinks.map(({ to, labelKey, label }) => {
      const lbl = t(`quick_access.${labelKey}`, { defaultValue: label });
      return {
        path: to,
        label: lbl,
        description: t('command_center.quick_jump', { defaultValue: 'Quick Jump' }),
        moduleLabel: groupLabel('nav'),
        group: 'nav',
        haystack: `${lbl} ${to}`.toLowerCase(),
      };
    });

    const navPaths = new Set(nav.map((n) => n.path));

    const content: PaletteItem[] = contentRegistry
      .filter((i) => !navPaths.has(i.path))
      .map((i) => {
        const label = t(menuKey(i.path, 'name'), { defaultValue: fallbackLabel(i.path) });
        const description = t(menuKey(i.path, 'description'), { defaultValue: '' });
        const mod = getModule(i.moduleId);
        const moduleLabel = mod
          ? t(`command_center.modules.${mod.id}`, { defaultValue: mod.label })
          : '';
        const keywords = (i.keywords ?? []).join(' ');
        return {
          path: i.path,
          label,
          description,
          moduleLabel,
          group: i.type,
          haystack: `${label} ${description} ${moduleLabel} ${i.path} ${keywords}`.toLowerCase(),
        };
      });

    return [...nav, ...content];
  }, [t]);

  // Filter then sort into stable group order, capped for performance.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    const base = tokens.length
      ? items.filter((l) => tokens.every((tok) => l.haystack.includes(tok)))
      : items;
    const ordered = [...base].sort(
      (a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group),
    );
    return ordered.slice(0, MAX_RESULTS);
  }, [query, items]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keep the active row scrolled into view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery('');
  };

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filtered[activeIndex];
      if (target) go(target.path);
    }
  };

  if (!open) return null;

  // Track which group headers have already been printed while iterating.
  let lastGroup: PaletteGroup | null = null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div className="w-full max-w-xl tactical-panel shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-tactical-border">
          <svg className="h-4 w-4 shrink-0 text-slate-400 dark:text-tactical-label" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder={t('command_center.search_placeholder')}
            aria-label={t('command_center.search_aria')}
            className="flex-1 bg-transparent font-sans text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-tactical-text dark:placeholder:text-tactical-label"
          />
          <span className="font-sans text-[10px] text-slate-400 dark:text-tactical-label">Esc</span>
        </div>
        <ul ref={listRef} className="max-h-[60vh] overflow-y-auto py-1">
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center font-sans text-xs text-slate-500 dark:text-tactical-dim">
              {t('command_center.no_matches')}
            </li>
          )}
          {filtered.map((l, idx) => {
            const marker = GROUP_MARKERS[l.group];
            const showHeader = l.group !== lastGroup;
            lastGroup = l.group;
            const isActive = idx === activeIndex;
            return (
              <li key={`${l.group}:${l.path}`}>
                {showHeader && (
                  <div className="px-4 pb-1 pt-2 font-sans text-[10px] font-medium text-slate-400 dark:text-tactical-label">
                    {t(`command_palette.group_${l.group}`, {
                      defaultValue: { nav: 'Navigate', lesson: 'Lessons', simulator: 'Simulators', case: 'Cases', tool: 'Tools' }[l.group],
                    })}
                  </div>
                )}
                <button
                  data-idx={idx}
                  onMouseMove={() => setActiveIndex(idx)}
                  onClick={() => go(l.path)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2 text-left font-sans text-sm transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 dark:bg-tactical-raised dark:text-tactical-text'
                      : 'text-slate-700 dark:text-tactical-dim'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className={marker.color} aria-hidden>{marker.symbol}</span>
                    <span className="truncate text-slate-900 dark:text-tactical-text">{l.label}</span>
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-400 dark:text-tactical-label">
                    {l.moduleLabel}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-4 border-t border-slate-200 px-4 py-2 font-sans text-[10px] text-slate-400 dark:border-tactical-border dark:text-tactical-label">
          <span>↑↓ {t('command_palette.hint_move', { defaultValue: 'Move' })}</span>
          <span>↵ {t('command_palette.hint_open', { defaultValue: 'Open' })}</span>
          <span>{t('command_palette.result_count', { defaultValue: '{{count}} results', count: filtered.length })}</span>
        </div>
      </div>
    </div>
  );
}
