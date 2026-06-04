import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, TacticalButton } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';

type Mode = 'and' | 'or';

const VOCAB = ['cache', 'network', 'data', 'replica', 'consensus', 'partition', 'shard', 'queue'];

interface Doc {
  id: number;
  terms: string[];
}

const DOCS: Doc[] = [
  { id: 1, terms: ['cache', 'network', 'data'] },
  { id: 2, terms: ['data', 'replica', 'consensus'] },
  { id: 3, terms: ['network', 'partition', 'shard'] },
  { id: 4, terms: ['cache', 'queue', 'data'] },
  { id: 5, terms: ['replica', 'consensus', 'partition'] },
  { id: 6, terms: ['shard', 'data', 'queue'] },
];

export default function InvertedIndexSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.inverted_index';

  const [query, setQuery] = useState<Set<string>>(new Set(['data']));
  const [mode, setMode] = useState<Mode>('or');

  const index = useMemo(() => {
    const m: Record<string, number[]> = {};
    VOCAB.forEach(term => {
      m[term] = DOCS.filter(d => d.terms.includes(term)).map(d => d.id);
    });
    return m;
  }, []);

  const results = useMemo(() => {
    const q = Array.from(query);
    if (q.length === 0) return [] as Array<{ id: number; score: number }>;
    return DOCS.map(d => {
      const hits = q.filter(term => d.terms.includes(term));
      return { id: d.id, score: hits.length, matchedAll: hits.length === q.length };
    })
      .filter(r => (mode === 'and' ? r.matchedAll : r.score > 0))
      .sort((a, b) => b.score - a.score);
  }, [query, mode]);

  const resultIds = new Set(results.map(r => r.id));
  const postingsScanned = Array.from(query).reduce((s, term) => s + (index[term]?.length ?? 0), 0);

  const toggleTerm = (term: string) => {
    setQuery(prev => {
      const next = new Set(prev);
      if (next.has(term)) next.delete(term);
      else next.add(term);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            {(['or', 'and'] as Mode[]).map(md => (
              <TacticalButton key={md} size="sm" variant={mode === md ? 'secondary' : 'ghost'} onClick={() => setMode(md)}>
                {t(`${base}.modes.${md}`)}
              </TacticalButton>
            ))}
            <TacticalButton size="sm" variant="ghost" onClick={() => setQuery(new Set())}>{t(`${base}.buttons.clear`)}</TacticalButton>
          </div>
        }
      >
        <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim mb-6">{t(`${base}.subtitle`)}</p>

        {/* Query terms */}
        <div className="mb-2 label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.labels.query`)}</div>
        <div className="mb-6 flex flex-wrap gap-2">
          {VOCAB.map(term => {
            const active = query.has(term);
            return (
              <button
                key={term}
                onClick={() => toggleTerm(term)}
                className={`border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                  active
                    ? 'border-signal-cyan bg-signal-cyan/10 text-signal-cyan'
                    : 'border-slate-200 text-slate-500 hover:border-slate-400 dark:border-tactical-border dark:text-tactical-dim'
                }`}
              >
                {term}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents */}
          <div>
            <div className="mb-2 label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.labels.documents`)}</div>
            <div className="space-y-2">
              {DOCS.map(d => {
                const matched = resultIds.has(d.id);
                return (
                  <motion.div
                    key={d.id}
                    animate={{
                      borderColor: matched ? 'rgb(34 211 238)' : 'rgba(148,163,184,0.3)',
                      opacity: query.size === 0 ? 1 : matched ? 1 : 0.45,
                    }}
                    className="border bg-slate-50 dark:bg-tactical-raised px-3 py-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-700 dark:text-tactical-text">{t(`${base}.labels.doc`)} #{d.id}</span>
                      {matched && <span className="h-1.5 w-1.5 rounded-full bg-signal-cyan" />}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {d.terms.map(term => (
                        <span key={term} className={`font-mono text-[10px] uppercase ${query.has(term) ? 'text-signal-cyan' : 'text-slate-400 dark:text-tactical-label'}`}>
                          {term}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Inverted index */}
          <div>
            <div className="mb-2 label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.labels.index`)}</div>
            <div className="space-y-1">
              {VOCAB.map(term => {
                const active = query.has(term);
                return (
                  <div key={term} className={`flex items-center gap-2 border px-2 py-1 ${active ? 'border-signal-cyan/60 bg-signal-cyan/5' : 'border-slate-200 dark:border-tactical-border'}`}>
                    <span className={`w-20 shrink-0 font-mono text-[11px] uppercase ${active ? 'text-signal-cyan' : 'text-slate-500 dark:text-tactical-dim'}`}>{term}</span>
                    <span className="font-mono text-[11px] text-slate-400 dark:text-tactical-label">→</span>
                    <div className="flex flex-wrap gap-1">
                      {index[term].map(id => (
                        <span key={id} className={`px-1.5 font-mono text-[11px] tabular-nums ${active && resultIds.has(id) ? 'text-signal-cyan' : 'text-slate-500 dark:text-tactical-dim'}`}>
                          {id}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ranked results */}
          <div>
            <div className="mb-2 label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.labels.results`)}</div>
            {results.length === 0 ? (
              <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-8 text-center font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-tactical-label">
                {t(`${base}.labels.no_matches`)}
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {results.map((r, i) => (
                    <motion.div
                      key={r.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      className="flex items-center gap-3 border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2"
                    >
                      <span className="font-mono text-[11px] text-slate-400 dark:text-tactical-label w-5 tabular-nums">#{i + 1}</span>
                      <span className="font-mono text-xs text-slate-700 dark:text-tactical-text flex-1">{t(`${base}.labels.doc`)} #{r.id}</span>
                      <span className="font-mono text-[11px] text-signal-cyan tabular-nums">{t(`${base}.labels.score`)} {r.score}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <AnimatedMetric value={query.size} label={t(`${base}.metrics.terms`)} color="cyan" />
          <AnimatedMetric value={results.length} label={t(`${base}.metrics.matched`)} color="green" />
          <AnimatedMetric value={postingsScanned} label={t(`${base}.metrics.postings`)} color="default" />
          <AnimatedMetric value={DOCS.length} label={t(`${base}.metrics.corpus`)} color="default" />
        </div>
        <p className="mt-3 font-mono text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.labels.hint`)}</p>
      </Panel>
    </div>
  );
}
