import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Panel, StatusBadge, TacticalButton, SegmentBar } from '../tactical';
import { AnimatedMetric, AnimatedNumber } from './motion';

interface Replica {
  id: number;
  state: 'warming' | 'ready';
  warmRemaining: number;
}

interface Metrics {
  completed: number;
  latencySum: number;
}

const TICK_MS = 500;
const SERVICE_RATE = 3; // req/s per ready replica
const MAX_REPLICAS = 6;
const COST_PER_MIN = 4; // $ per replica-minute
const SCALE_DOWN_IDLE_TICKS = 6;

export default function GpuAutoscalerSimulator() {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [arrivalRate, setArrivalRate] = useState(6);
  const [scaleThreshold, setScaleThreshold] = useState(5);
  const [coldStart, setColdStart] = useState(4);

  const [replicas, setReplicas] = useState<Replica[]>([]);
  const [queueLen, setQueueLen] = useState(0);
  const [metrics, setMetrics] = useState<Metrics>({ completed: 0, latencySum: 0 });
  const [utilization, setUtilization] = useState(0);

  const queue = useRef<number[]>([]);
  const nextId = useRef(1);
  const arrivalCarry = useRef(0);
  const idleTicks = useRef(0);

  const reset = useCallback(() => {
    setIsRunning(false);
    setReplicas([]);
    setQueueLen(0);
    setMetrics({ completed: 0, latencySum: 0 });
    setUtilization(0);
    queue.current = [];
    arrivalCarry.current = 0;
    idleTicks.current = 0;
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const tickSec = TICK_MS / 1000;

      // 1. Arrivals.
      arrivalCarry.current += arrivalRate * tickSec;
      while (arrivalCarry.current >= 1) {
        arrivalCarry.current -= 1;
        queue.current.push(now);
      }

      setReplicas(prev => {
        // 2. Warm up replicas.
        let next = prev.map(r =>
          r.state === 'warming'
            ? { ...r, warmRemaining: r.warmRemaining - tickSec }
            : r,
        );
        next = next.map(r => (r.state === 'warming' && r.warmRemaining <= 0 ? { ...r, state: 'ready' as const, warmRemaining: 0 } : r));

        const ready = next.filter(r => r.state === 'ready').length;

        // 3. Process queue with ready capacity.
        const capacity = Math.floor(ready * SERVICE_RATE * tickSec) || (ready > 0 ? 1 : 0);
        let processed = 0;
        while (processed < capacity && queue.current.length > 0) {
          const arrival = queue.current.shift()!;
          setMetrics(m => ({ completed: m.completed + 1, latencySum: m.latencySum + (now - arrival) }));
          processed++;
        }

        const used = capacity > 0 ? Math.min(1, processed / capacity) : 0;
        setUtilization(Math.round(used * 100));

        // 4. Autoscale up.
        const total = next.length;
        if (queue.current.length > scaleThreshold && total < MAX_REPLICAS) {
          next.push({ id: nextId.current++, state: 'warming', warmRemaining: coldStart });
          idleTicks.current = 0;
        } else if (queue.current.length === 0 && ready > 0) {
          // 5. Scale down (to zero) after sustained idleness.
          idleTicks.current += 1;
          if (idleTicks.current >= SCALE_DOWN_IDLE_TICKS) {
            const idx = next.findIndex(r => r.state === 'ready');
            if (idx >= 0) next.splice(idx, 1);
            idleTicks.current = 0;
          }
        } else {
          idleTicks.current = 0;
        }

        setQueueLen(queue.current.length);
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [isRunning, arrivalRate, scaleThreshold, coldStart]);

  const readyCount = replicas.filter(r => r.state === 'ready').length;
  const avgLatency = metrics.completed > 0 ? Math.round(metrics.latencySum / metrics.completed) : 0;
  const cost = ((replicas.length * COST_PER_MIN) / 60).toFixed(2);

  const rangeClass = 'flex-1 h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';
  const base = 'simulators.gpu_autoscaler';

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant={isRunning ? 'danger' : 'secondary'} onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? t(`${base}.buttons.stop`) : t(`${base}.buttons.start`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>{t(`${base}.buttons.reset`)}</TacticalButton>
          </div>
        }
      >
        <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim mb-6">{t(`${base}.subtitle`)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Slider label={t(`${base}.controls.arrival_rate`)} value={arrivalRate} min={1} max={24} onChange={setArrivalRate} cls={rangeClass} />
          <Slider label={t(`${base}.controls.scale_threshold`)} value={scaleThreshold} min={1} max={20} onChange={setScaleThreshold} cls={rangeClass} />
          <Slider label={t(`${base}.controls.cold_start`)} value={coldStart} min={1} max={12} onChange={setColdStart} cls={rangeClass} suffix="s" />
        </div>
      </Panel>

      <Panel title={t(`${base}.panels.replicas`)} accent="green">
        <AnimatePresence mode="popLayout" initial={false}>
          {replicas.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-tactical-label"
            >
              {t(`${base}.labels.scale_to_zero`)}
            </motion.div>
          ) : (
            <motion.div layout key="grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <AnimatePresence mode="popLayout" initial={false}>
                {replicas.map(r => {
                  const warmPct = r.state === 'warming' ? Math.max(0, Math.min(100, (1 - r.warmRemaining / coldStart) * 100)) : 100;
                  return (
                    <motion.div
                      key={r.id}
                      layout
                      initial={{ opacity: 0, scale: 0.4, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.4, y: -12 }}
                      transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                      className="relative border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-3 flex flex-col gap-2 overflow-hidden"
                    >
                      <div className="flex items-center gap-2">
                        {r.state === 'warming' ? (
                          <motion.span
                            className="inline-block h-3 w-3 rounded-full border-2 border-signal-amber border-t-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          />
                        ) : (
                          <motion.span
                            className="inline-block h-3 w-3 rounded-full bg-signal-green"
                            animate={{ opacity: [1, 0.4, 1], scale: [1, 1.15, 1] }}
                            transition={{ duration: 1.6, repeat: Infinity }}
                          />
                        )}
                        <span className="font-mono text-xs text-slate-700 dark:text-tactical-text">GPU #{r.id}</span>
                      </div>
                      <StatusBadge
                        variant={r.state === 'ready' ? 'active' : 'in-progress'}
                        label={r.state === 'ready' ? t(`${base}.labels.ready`) : t(`${base}.labels.warming`)}
                      />
                      {r.state === 'warming' && (
                        <>
                          <span className="font-mono text-[11px] text-signal-amber tabular-nums">{Math.max(0, r.warmRemaining).toFixed(1)}s</span>
                          <div className="absolute bottom-0 left-0 h-[3px] w-full bg-slate-200 dark:bg-tactical-border">
                            <motion.div
                              className="h-full bg-signal-amber"
                              animate={{ width: `${warmPct}%` }}
                              transition={{ duration: TICK_MS / 1000, ease: 'linear' }}
                            />
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </Panel>

      <Panel title={t(`${base}.metrics.queue`)} accent="cyan">
        <div className="flex flex-wrap items-center gap-1.5 min-h-[2.5rem]">
          {queueLen === 0 ? (
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-tactical-label">—</span>
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              {Array.from({ length: Math.min(queueLen, 40) }).map((_, i) => (
                <motion.span
                  key={`${queueLen}-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.3 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`h-4 w-2.5 ${i >= scaleThreshold ? 'bg-signal-red' : 'bg-signal-cyan'}`}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </Panel>

      <Panel title={t(`${base}.panels.metrics`)} accent="amber">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative overflow-hidden border border-slate-200 dark:border-tactical-border px-3 py-3">
            <div className="font-mono text-2xl font-bold tabular-nums leading-none text-signal-green">
              <AnimatedNumber value={readyCount} />/<AnimatedNumber value={replicas.length} />
            </div>
            <div className="label-mono mt-2">{t(`${base}.metrics.replicas`)}</div>
          </div>
          <AnimatedMetric value={queueLen} label={t(`${base}.metrics.queue`)} color={queueLen > scaleThreshold ? 'red' : 'default'} />
          <AnimatedMetric value={avgLatency} suffix="ms" label={t(`${base}.metrics.latency`)} color={avgLatency > 3000 ? 'red' : 'default'} />
          <AnimatedMetric value={Number(cost)} decimals={2} prefix="$" label={t(`${base}.metrics.cost`)} color="cyan" />
          <AnimatedMetric value={utilization} suffix="%" label={t(`${base}.metrics.utilization`)} color={utilization > 85 ? 'green' : 'amber'} pulse={isRunning} />
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.metrics.queue`)}</span>
          </div>
          <SegmentBar value={queueLen} max={Math.max(scaleThreshold * 2, 10)} color={queueLen > scaleThreshold ? 'red' : 'green'} caption={`${queueLen}`} />
        </div>
      </Panel>
    </div>
  );
}

function Slider({ label, value, min, max, onChange, cls, suffix }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; cls: string; suffix?: string }) {
  return (
    <div className="space-y-2">
      <label className="block label-mono text-slate-500 dark:text-tactical-label">{label}</label>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className={cls} />
        <span className="font-mono text-sm w-10 text-right text-signal-cyan tabular-nums">{value}{suffix ?? ''}</span>
      </div>
    </div>
  );
}

