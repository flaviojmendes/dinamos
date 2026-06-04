import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { contentManifest } from '../../config/contentManifest';
import { quickAccessLinks } from '../../config/quickAccess';

const OPEN_EVENT = 'command-palette:open';

/** Imperatively open the global command palette from anywhere. */
export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

interface PaletteItem {
  path: string;
  label: string;
  hint: string;
  group: 'nav' | 'lesson';
}

function lessonLabel(path: string): string {
  const seg = path.split('/').filter(Boolean).pop() ?? path;
  return seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * App-wide quick-jump command palette. Toggled with Cmd/Ctrl+K (or the
 * openCommandPalette() helper) and reachable from every page.
 */
export default function CommandPalette() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Reset query and focus the input whenever the palette opens.
  useEffect(() => {
    if (open) {
      setQuery('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const items: PaletteItem[] = useMemo(() => {
    const nav: PaletteItem[] = quickAccessLinks.map(({ to, labelKey, label }) => ({
      path: to,
      label: t(`quick_access.${labelKey}`, { defaultValue: label }),
      hint: t('command_center.quick_jump', { defaultValue: 'Quick Jump' }),
      group: 'nav',
    }));
    const lessons: PaletteItem[] = Array.from(new Set(contentManifest.map((e) => e.path))).map((path) => ({
      path,
      label: lessonLabel(path),
      hint: path,
      group: 'lesson',
    }));
    return [...nav, ...lessons];
  }, [t]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? items.filter((l) => l.label.toLowerCase().includes(q) || l.path.toLowerCase().includes(q))
      : items;
    return base.slice(0, 14);
  }, [query, items]);

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery('');
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div className="w-full max-w-xl tactical-panel shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-tactical-border">
          <span className="font-mono text-signal-green">›</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filtered[0]) {
                go(filtered[0].path);
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
            <li className="px-4 py-6 text-center font-mono text-xs text-slate-500 dark:text-tactical-dim">
              {t('command_center.no_matches')}
            </li>
          )}
          {filtered.map((l) => (
            <li key={`${l.group}:${l.path}`}>
              <button
                onClick={() => go(l.path)}
                className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left font-mono text-sm text-slate-700 hover:bg-slate-100 dark:text-tactical-dim dark:hover:bg-tactical-raised"
              >
                <span className="flex min-w-0 items-center gap-2">
                  {l.group === 'nav' && <span className="text-signal-cyan">▸</span>}
                  <span className="truncate text-slate-900 dark:text-tactical-text">{l.label}</span>
                </span>
                <span className="shrink-0 text-[10px] text-slate-400 dark:text-tactical-label">{l.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
