import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationMotion } from '../simulation';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Panel, TacticalButton, StatusBadge } from '../tactical';
import { AnimatedMetric } from '../AISystems/motion';
import { NarrationBar } from '../simulators/teaching';
import TransitPacket from './TransitPacket';
import { Database, Search, Warehouse, Workflow } from 'lucide-react';

const TICK_MS = 800;
const OPS = ['INSERT', 'UPDATE', 'DELETE'] as const;
type Op = (typeof OPS)[number];

interface LogEvent {
  id: number;
  op: Op;
  consumed: boolean;
}

const SINKS = ['cache', 'search', 'warehouse'] as const;
const OP_COLOR: Record<Op, string> = {
  INSERT: 'text-signal-green',
  UPDATE: 'text-signal-cyan',
  DELETE: 'text-signal-red',
};

type Narr = { tone: 'idle' | 'active' | 'success'; key: string; text: string };

export default function CdcSimulator() {
  const { t } = useTranslation();
  const { reducedMotion, transition } = useSimulationMotion();
  const base = 'simulators.cdc';

  const [running, setRunning] = useState(false);
  const [writeRate, setWriteRate] = useState(3);
  const [connectorRate, setConnectorRate] = useState(2);

  const [log, setLog] = useState<LogEvent[]>([]);
  const [produced, setProduced] = useState(0);
  const [consumed, setConsumed] = useState(0);
  const [sinkCounts, setSinkCounts] = useState<Record<string, number>>({ cache: 0, search: 0, warehouse: 0 });
  const [sinkPulse, setSinkPulse] = useState(0);
  const [narr, setNarr] = useState<Narr>({ tone: 'idle', key: 'idle', text: t(`${base}.narration.idle`) });

  const nextId = useRef(1);
  const writeRef = useRef(writeRate);
  writeRef.current = writeRate;
  const connRef = useRef(connectorRate);
  connRef.current = connectorRate;

  const reset = useCallback(() => {
    setRunning(false);
    setLog([]);
    setProduced(0);
    setConsumed(0);
    setSinkCounts({ cache: 0, search: 0, warehouse: 0 });
    setNarr({ tone: 'idle', key: `reset-${Date.now()}`, text: t(`${base}.narration.idle`) });
  }, [t]);

  const step = useCallback(() => {
    const wr = writeRef.current;
    const cr = connRef.current;
    setLog((prev) => {
      let next = prev.slice();
      for (let i = 0; i < wr; i++) {
        next.push({ id: nextId.current++, op: OPS[Math.floor(Math.random() * OPS.length)], consumed: false });
      }
      setProduced((p) => p + wr);
      let shipped = 0;
      next = next.map((e) => {
        if (!e.consumed && shipped < cr) {
          shipped++;
          return { ...e, consumed: true };
        }
        return e;
      });
      const pendingAfter = next.filter((e) => !e.consumed).length;
      if (shipped > 0) {
        setConsumed((c) => c + shipped);
        setSinkCounts((s) => ({ cache: s.cache + shipped, search: s.search + shipped, warehouse: s.warehouse + shipped }));
        setSinkPulse((p) => p + 1);
      }
      if (wr > cr && pendingAfter > 0) {
        setNarr({ tone: 'active', key: `lag-${Date.now()}`, text: t(`${base}.narration.lagging`, { rate: wr, crate: cr, lag: pendingAfter }) });
      } else if (pendingAfter <= cr) {
        setNarr({ tone: 'success', key: `ok-${Date.now()}`, text: t(`${base}.narration.caught_up`, { lag: pendingAfter }) });
      } else {
        setNarr({ tone: 'active', key: `ship-${Date.now()}`, text: t(`${base}.narration.shipping`, { k: shipped, lag: pendingAfter }) });
      }
      return next.slice(-48);
    });
  }, [t]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(step, TICK_MS);
    return () => clearInterval(id);
  }, [running, step]);

  const lag = produced - consumed;
  const pending = log.filter((e) => !e.consumed);
  const visible = log.slice(-22);
  const firstPendingIdx = visible.findIndex((e) => !e.consumed);

  return (
    <div className="simulation-workspace space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="sim-controls flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant="secondary" onClick={step} disabled={running}>
              <SkipForward size={14} aria-hidden="true" />{t(`${base}.buttons.step`)}
            </TacticalButton>
            <TacticalButton size="sm" aria-pressed={running} variant={running ? 'secondary' : 'primary'} onClick={() => setRunning((r) => !r)}>
              {running ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
              {running ? t(`${base}.buttons.stop`) : t(`${base}.buttons.start`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>
              <RotateCcw size={14} aria-hidden="true" />{t(`${base}.buttons.reset`)}
            </TacticalButton>
          </div>
        }
      >
        <p className="mb-5 font-sans text-xs text-slate-500 dark:text-tactical-dim">{t(`${base}.subtitle`)}</p>

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Slider label={t(`${base}.controls.write_rate`)} value={writeRate} min={1} max={6} onChange={setWriteRate} />
          <Slider label={t(`${base}.controls.connector_rate`)} value={connectorRate} min={1} max={6} onChange={setConnectorRate} />
        </div>

        <div className="mb-5">
          <NarrationBar tone={narr.tone} stepKey={narr.key}>{narr.text}</NarrationBar>
        </div>

        {/* Transaction log with a read offset */}
        <div className="sim-stage mb-4 rounded-lg border border-slate-200 p-4 dark:border-tactical-border">
          <div className="mb-2 flex items-center justify-between">
            <span className="label-mono">{t(`${base}.source`)}</span>
            <StatusBadge variant={running ? 'online' : 'offline'} />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <AnimatePresence>
              {visible.map((e, i) => (
                <motion.span key={e.id} layout={!reducedMotion} className="flex items-center gap-1.5" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={transition}>
                  {i === firstPendingIdx && (
                    <span className="mx-0.5 flex flex-col items-center" title={t(`${base}.offset`)}>
                      <span className="h-5 w-px bg-signal-cyan" />
                      <span className="font-mono text-[8px] uppercase text-signal-cyan">{t(`${base}.offset`)}</span>
                    </span>
                  )}
                  <motion.span
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={transition}
                    title={`#${e.id} ${e.op}`}
                    className={`flex h-9 w-9 items-center justify-center rounded-md border font-mono text-[11px] font-semibold ${
                      e.consumed
                        ? 'border-signal-green/40 bg-signal-green/15 text-signal-green'
                        : `border-signal-amber/50 bg-signal-amber/10 ${OP_COLOR[e.op]}`
                    }`}
                  >
                    {e.op[0]}
                  </motion.span>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <p className="mt-2 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.wal_note`)}</p>
        </div>

        {/* Connector -> sinks */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="sim-node flex min-w-28 flex-col items-center gap-2 px-4 py-5 text-center">
            <Workflow size={22} className="text-signal-cyan" aria-hidden="true" />
            <span className="font-sans text-sm font-medium">{t(`${base}.connector`)}</span>
          </div>
          <div className="sim-flow relative h-8 min-w-12 overflow-hidden lg:w-16" aria-hidden="true">
            <div className="absolute inset-x-0 top-1/2 h-px bg-slate-300 dark:bg-tactical-line" />
            {sinkPulse > 0 && <TransitPacket key={sinkPulse} tone="cyan" />}
          </div>
          <div className="grid flex-1 gap-2 sm:grid-cols-3">
            {SINKS.map((s, i) => {
              const Icon = [Database, Search, Warehouse][i];
              return (
              <motion.div
                key={s}
                className="sim-node flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-4 dark:border-tactical-border"
              >
                <Icon size={18} className="shrink-0 text-slate-500 dark:text-tactical-dim" aria-hidden="true" />
                <span className="flex-1 font-sans text-sm text-slate-700 dark:text-tactical-text">{t(`${base}.sinks.${s}`)}</span>
                <motion.span key={sinkCounts[s]} initial={{ opacity: 0.4, y: reducedMotion ? 0 : 4 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="font-mono text-sm tabular-nums text-signal-cyan">{sinkCounts[s]}</motion.span>
              </motion.div>
            );})}
          </div>
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="sim-metrics grid grid-cols-2 gap-3 lg:grid-cols-4">
          <AnimatedMetric value={produced} label={t(`${base}.metrics.produced`)} color="cyan" pulse={running} />
          <AnimatedMetric value={consumed} label={t(`${base}.metrics.consumed`)} color="green" />
          <AnimatedMetric value={lag} label={t(`${base}.metrics.lag`)} color={lag > 10 ? 'red' : lag > 0 ? 'amber' : 'green'} />
          <AnimatedMetric value={pending.length} label={t(`${base}.metrics.pending`)} color="default" />
        </div>
        <p className="mt-4 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.hint`)}</p>
      </Panel>
    </div>
  );
}

function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{label}</label>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-2 flex-1 cursor-pointer appearance-none bg-slate-200 accent-signal-cyan dark:bg-tactical-border" />
        <span className="w-8 text-right font-mono text-sm tabular-nums text-signal-cyan">{value}</span>
      </div>
    </div>
  );
}
