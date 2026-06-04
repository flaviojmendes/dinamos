import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, TacticalButton, SegmentBar } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';

type EventType = 'created' | 'item_added' | 'shipped' | 'cancelled';

interface Event {
  id: number;
  type: EventType;
}

export default function CqrsSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.cqrs';

  const [lag, setLag] = useState(800);
  const [log, setLog] = useState<Event[]>([]);
  const [applied, setApplied] = useState(0);
  const nextId = useRef(1);

  const emit = useCallback((type: EventType) => {
    setLog(prev => [...prev, { id: nextId.current++, type }]);
  }, []);

  const reset = useCallback(() => {
    setLog([]);
    setApplied(0);
  }, []);

  // Projection catches up to the log, delayed by `lag` (eventual consistency).
  useEffect(() => {
    if (applied >= log.length) return;
    const timer = window.setTimeout(() => setApplied(a => Math.min(log.length, a + 1)), lag);
    return () => window.clearTimeout(timer);
  }, [applied, log.length, lag]);

  // Read models are derived ONLY from applied events.
  const appliedEvents = log.slice(0, applied);
  let status: 'none' | 'created' | 'shipped' | 'cancelled' = 'none';
  let items = 0;
  for (const e of appliedEvents) {
    if (e.type === 'created') status = 'created';
    else if (e.type === 'item_added') items += 1;
    else if (e.type === 'shipped') status = 'shipped';
    else if (e.type === 'cancelled') status = 'cancelled';
  }

  const pending = log.length - applied;
  const catchupPct = log.length > 0 ? Math.round((applied / log.length) * 100) : 100;

  const rangeClass = 'flex-1 h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';
  const created = appliedEvents.length > 0 || log.length > 0;

  const eventColor: Record<EventType, string> = {
    created: 'text-signal-green border-signal-green/50',
    item_added: 'text-signal-cyan border-signal-cyan/50',
    shipped: 'text-signal-amber border-signal-amber/50',
    cancelled: 'text-signal-red border-signal-red/50',
  };

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={<TacticalButton size="sm" variant="ghost" onClick={reset}>{t(`${base}.buttons.reset`)}</TacticalButton>}
      >
        <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim mb-6">{t(`${base}.subtitle`)}</p>

        <div className="mb-6 space-y-2 max-w-md">
          <label className="block label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.controls.lag`)}</label>
          <div className="flex items-center gap-2">
            <input type="range" min="100" max="2000" step="100" value={lag} onChange={e => setLag(Number(e.target.value))} className={rangeClass} />
            <span className="font-mono text-sm w-16 text-right text-signal-cyan tabular-nums">{lag}ms</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Command side */}
          <div>
            <div className="label-mono text-slate-500 dark:text-tactical-label mb-2">{t(`${base}.panels.command`)}</div>
            <div className="flex flex-col gap-2">
              <TacticalButton size="sm" variant="secondary" onClick={() => emit('created')}>{t(`${base}.commands.create`)}</TacticalButton>
              <TacticalButton size="sm" variant="secondary" onClick={() => emit('item_added')} disabled={!created}>{t(`${base}.commands.add_item`)}</TacticalButton>
              <TacticalButton size="sm" variant="secondary" onClick={() => emit('shipped')} disabled={!created}>{t(`${base}.commands.ship`)}</TacticalButton>
              <TacticalButton size="sm" variant="ghost" onClick={() => emit('cancelled')} disabled={!created}>{t(`${base}.commands.cancel`)}</TacticalButton>
            </div>
          </div>

          {/* Event log */}
          <div>
            <div className="label-mono text-slate-500 dark:text-tactical-label mb-2">{t(`${base}.panels.log`)}</div>
            <div className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised p-2 min-h-[160px] max-h-[220px] overflow-y-auto space-y-1">
              <AnimatePresence initial={false}>
                {log.map((e, i) => {
                  const isApplied = i < applied;
                  return (
                    <motion.div
                      key={e.id}
                      layout
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: isApplied ? 1 : 0.5 }}
                      className={`flex items-center justify-between border px-2 py-1 ${eventColor[e.type]}`}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-wider">{t(`${base}.events.${e.type}`)}</span>
                      <span className="font-mono text-[10px] text-slate-400 dark:text-tactical-label">{isApplied ? '✓' : '…'}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {log.length === 0 && (
                <div className="px-3 py-8 text-center font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-tactical-label">{t(`${base}.labels.log_empty`)}</div>
              )}
            </div>
          </div>

          {/* Read models */}
          <div>
            <div className="label-mono text-slate-500 dark:text-tactical-label mb-2">{t(`${base}.panels.read`)}</div>
            <div className="space-y-3">
              <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
                <motion.div key={status} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="font-mono text-lg font-bold text-slate-900 dark:text-tactical-text">
                  {t(`${base}.status_values.${status}`)}
                </motion.div>
                <div className="label-mono mt-1">{t(`${base}.read.status`)}</div>
              </div>
              <AnimatedMetric value={items} label={t(`${base}.read.items`)} color="cyan" />
            </div>
          </div>
        </div>
      </Panel>

      <Panel title={t(`${base}.read.events_applied`)} accent="green">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <AnimatedMetric value={log.length} label={t(`${base}.panels.log`)} color="default" />
          <AnimatedMetric value={applied} label={t(`${base}.read.events_applied`)} color="green" />
          <AnimatedMetric value={pending} label={t(`${base}.read.pending`)} color={pending > 0 ? 'amber' : 'default'} pulse={pending > 0} />
        </div>
        <SegmentBar value={catchupPct} max={100} color={pending > 0 ? 'amber' : 'green'} caption={t(`${base}.labels.lag_caption`, { pct: catchupPct })} />
        <p className="mt-3 font-mono text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.labels.hint`)}</p>
      </Panel>
    </div>
  );
}
