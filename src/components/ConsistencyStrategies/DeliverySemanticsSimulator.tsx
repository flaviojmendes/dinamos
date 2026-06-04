import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, TacticalButton } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';

type Mode = 'at_most_once' | 'at_least_once' | 'exactly_once';
type Tag = 'delivered' | 'duplicate' | 'lost' | 'dlq' | 'filtered';

const TICK_MS = 650;
const LOSS = 0.25;
const DUP = 0.4;
const MAX_ATTEMPTS = 4;

const TAG_COLOR: Record<Tag, string> = {
  delivered: 'text-signal-green border-signal-green/50',
  duplicate: 'text-signal-amber border-signal-amber/50',
  lost: 'text-signal-red border-signal-red/50',
  dlq: 'text-purple-500 dark:text-purple-400 border-purple-400/50',
  filtered: 'text-signal-cyan border-signal-cyan/50',
};

interface LogItem {
  id: number;
  tag: Tag;
}

export default function DeliverySemanticsSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.delivery_semantics';

  const [mode, setMode] = useState<Mode>('at_least_once');
  const [dedup, setDedup] = useState(false);
  const [dlq, setDlq] = useState(true);
  const [running, setRunning] = useState(false);

  const [counts, setCounts] = useState({ produced: 0, delivered: 0, duplicates: 0, filtered: 0, lost: 0, dlq: 0 });
  const [log, setLog] = useState<LogItem[]>([]);
  const nextId = useRef(1);

  const effectiveDedup = mode === 'exactly_once' ? true : dedup;

  const reset = useCallback(() => {
    setRunning(false);
    setCounts({ produced: 0, delivered: 0, duplicates: 0, filtered: 0, lost: 0, dlq: 0 });
    setLog([]);
  }, []);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const tags: Tag[] = [];

      if (mode === 'at_most_once') {
        tags.push(Math.random() < LOSS ? 'lost' : 'delivered');
      } else {
        // at-least-once / exactly-once: retry until success or attempts exhausted.
        let attempt = 0;
        let succeeded = false;
        while (attempt < MAX_ATTEMPTS) {
          attempt += 1;
          if (Math.random() >= LOSS) {
            succeeded = true;
            break;
          }
        }
        if (!succeeded) {
          tags.push(dlq ? 'dlq' : 'lost');
        } else {
          tags.push('delivered');
          // Ack loss can cause a re-send → duplicate.
          if (Math.random() < DUP) {
            tags.push(effectiveDedup ? 'filtered' : 'duplicate');
          }
        }
      }

      setCounts(prev => {
        const c = { ...prev, produced: prev.produced + 1 };
        for (const tag of tags) {
          if (tag === 'delivered') c.delivered += 1;
          else if (tag === 'duplicate') c.duplicates += 1;
          else if (tag === 'filtered') c.filtered += 1;
          else if (tag === 'lost') c.lost += 1;
          else if (tag === 'dlq') c.dlq += 1;
        }
        return c;
      });
      setLog(prev => [...tags.map(tag => ({ id: nextId.current++, tag })), ...prev].slice(0, 8));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [running, mode, dlq, effectiveDedup]);

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant={running ? 'danger' : 'secondary'} onClick={() => setRunning(r => !r)}>
              {running ? t(`${base}.buttons.stop`) : t(`${base}.buttons.start`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>{t(`${base}.buttons.reset`)}</TacticalButton>
          </div>
        }
      >
        <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim mb-6">{t(`${base}.subtitle`)}</p>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.controls.mode`)}</label>
            <div className="flex flex-wrap gap-2">
              {(['at_most_once', 'at_least_once', 'exactly_once'] as Mode[]).map(m => (
                <TacticalButton key={m} size="sm" variant={mode === m ? 'secondary' : 'ghost'} onClick={() => setMode(m)}>
                  {t(`${base}.modes.${m}`)}
                </TacticalButton>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.controls.dedup`)}</label>
            <TacticalButton size="sm" variant={effectiveDedup ? 'secondary' : 'ghost'} onClick={() => setDedup(d => !d)} disabled={mode === 'exactly_once'}>
              {effectiveDedup ? t(`${base}.buttons.on`) : t(`${base}.buttons.off`)}
            </TacticalButton>
          </div>
          <div className="space-y-2">
            <label className="block label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.controls.dlq`)}</label>
            <TacticalButton size="sm" variant={dlq ? 'secondary' : 'ghost'} onClick={() => setDlq(d => !d)} disabled={mode === 'at_most_once'}>
              {dlq ? t(`${base}.buttons.on`) : t(`${base}.buttons.off`)}
            </TacticalButton>
          </div>
        </div>

        {/* Recent log */}
        <div className="label-mono text-slate-500 dark:text-tactical-label mb-2">{t(`${base}.labels.recent`)}</div>
        <div className="min-h-[120px] space-y-2">
          <AnimatePresence mode="popLayout">
            {log.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex items-center gap-3 border bg-slate-50 dark:bg-tactical-raised px-3 py-1.5 ${TAG_COLOR[item.tag]}`}
              >
                <span className="font-mono text-[10px] uppercase tracking-wider w-20">{t(`${base}.tags.${item.tag}`)}</span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-tactical-dim">msg #{item.id}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {log.length === 0 && (
            <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-8 text-center font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-tactical-label">
              {t(`${base}.labels.empty`)}
            </div>
          )}
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <AnimatedMetric value={counts.produced} label={t(`${base}.metrics.produced`)} color="cyan" pulse={running} />
          <AnimatedMetric value={counts.delivered} label={t(`${base}.metrics.delivered`)} color="green" />
          <AnimatedMetric value={counts.duplicates} label={t(`${base}.metrics.duplicates`)} color="amber" />
          <AnimatedMetric value={counts.filtered} label={t(`${base}.metrics.filtered`)} color="cyan" />
          <AnimatedMetric value={counts.lost} label={t(`${base}.metrics.lost`)} color="red" />
          <AnimatedMetric value={counts.dlq} label={t(`${base}.metrics.dlq`)} color="default" />
        </div>
        <p className="mt-3 font-mono text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.labels.hint`)}</p>
      </Panel>
    </div>
  );
}
