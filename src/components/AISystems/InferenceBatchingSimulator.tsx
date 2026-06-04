import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, StatusBadge, TacticalButton, SegmentBar } from '../tactical';

interface InferReq {
  id: number;
  arrival: number;
  totalTokens: number;
  done: number;
}

interface Metrics {
  completed: number;
  dropped: number;
  latencySum: number;
  tokensGenerated: number;
}

const TICK_MS = 120;
const MAX_QUEUE = 24;

export default function InferenceBatchingSimulator() {
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [arrivalRate, setArrivalRate] = useState(8);
  const [batchCapacity, setBatchCapacity] = useState(6);
  const [avgTokens, setAvgTokens] = useState(20);

  const [queue, setQueue] = useState<InferReq[]>([]);
  const [batch, setBatch] = useState<InferReq[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ completed: 0, dropped: 0, latencySum: 0, tokensGenerated: 0 });
  const [throughput, setThroughput] = useState(0);

  const nextId = useRef(1);
  const arrivalCarry = useRef(0);

  const reset = useCallback(() => {
    setIsRunning(false);
    setQueue([]);
    setBatch([]);
    setMetrics({ completed: 0, dropped: 0, latencySum: 0, tokensGenerated: 0 });
    setThroughput(0);
    arrivalCarry.current = 0;
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const tickSec = TICK_MS / 1000;

      setQueue(prevQueue => {
        let workingQueue = [...prevQueue];

        // 1. Arrivals (Poisson-ish via fractional carry).
        arrivalCarry.current += arrivalRate * tickSec;
        while (arrivalCarry.current >= 1) {
          arrivalCarry.current -= 1;
          const variance = 0.5 + Math.random();
          const req: InferReq = {
            id: nextId.current++,
            arrival: now,
            totalTokens: Math.max(4, Math.round(avgTokens * variance)),
            done: 0,
          };
          if (workingQueue.length < MAX_QUEUE) {
            workingQueue.push(req);
          } else {
            setMetrics(m => ({ ...m, dropped: m.dropped + 1 }));
          }
        }

        // 2. Decode step on the running batch + admission (continuous batching).
        setBatch(prevBatch => {
          let running = prevBatch.map(r => ({ ...r, done: r.done + 1 }));
          let tokensThisTick = 0;
          const finished: InferReq[] = [];
          running = running.filter(r => {
            tokensThisTick += 1;
            if (r.done >= r.totalTokens) {
              finished.push(r);
              return false;
            }
            return true;
          });

          // Admit waiting requests into freed slots.
          while (running.length < batchCapacity && workingQueue.length > 0) {
            const admitted = workingQueue.shift()!;
            running.push(admitted);
          }

          if (finished.length > 0) {
            setMetrics(m => ({
              ...m,
              completed: m.completed + finished.length,
              latencySum: m.latencySum + finished.reduce((s, r) => s + (now - r.arrival), 0),
            }));
          }
          setMetrics(m => ({ ...m, tokensGenerated: m.tokensGenerated + tokensThisTick }));
          setThroughput(Math.round(tokensThisTick / tickSec));

          return running;
        });

        return workingQueue;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [isRunning, arrivalRate, batchCapacity, avgTokens]);

  const utilization = Math.round((batch.length / batchCapacity) * 100);
  const avgLatency = metrics.completed > 0 ? Math.round(metrics.latencySum / metrics.completed) : 0;

  const rangeClass = 'flex-1 h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';
  const base = 'simulators.inference_batching';

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
            <TacticalButton size="sm" variant="ghost" onClick={reset}>
              {t(`${base}.buttons.reset`)}
            </TacticalButton>
          </div>
        }
      >
        <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim mb-6">{t(`${base}.subtitle`)}</p>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.controls.arrival_rate`)}</label>
            <div className="flex items-center gap-2">
              <input type="range" min="1" max="20" value={arrivalRate} onChange={e => setArrivalRate(Number(e.target.value))} className={rangeClass} />
              <span className="font-mono text-sm w-8 text-right text-signal-cyan tabular-nums">{arrivalRate}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.controls.batch_capacity`)}</label>
            <div className="flex items-center gap-2">
              <input type="range" min="1" max="12" value={batchCapacity} onChange={e => setBatchCapacity(Number(e.target.value))} className={rangeClass} />
              <span className="font-mono text-sm w-8 text-right text-signal-cyan tabular-nums">{batchCapacity}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.controls.output_tokens`)}</label>
            <div className="flex items-center gap-2">
              <input type="range" min="8" max="60" value={avgTokens} onChange={e => setAvgTokens(Number(e.target.value))} className={rangeClass} />
              <span className="font-mono text-sm w-8 text-right text-signal-cyan tabular-nums">{avgTokens}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Running batch */}
          <div className="border border-slate-200 dark:border-tactical-border">
            <div className="border-b border-slate-200 dark:border-tactical-border px-3 py-2 flex items-center justify-between">
              <div className="label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.panels.batch`)}</div>
              <div className="font-mono text-xs text-signal-cyan tabular-nums">{batch.length}/{batchCapacity}</div>
            </div>
            <div className="p-3 space-y-2 min-h-[180px]">
              {Array.from({ length: batchCapacity }).map((_, i) => {
                const r = batch[i];
                if (!r) {
                  return (
                    <div key={`free-${i}`} className="border border-dashed border-slate-300 dark:border-tactical-border px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-tactical-label">
                      {t(`${base}.labels.slot_free`)}
                    </div>
                  );
                }
                return (
                  <div key={r.id} className="border border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-slate-700 dark:text-tactical-text">{t(`${base}.labels.request`)} #{r.id}</span>
                      <span className="font-mono text-[11px] text-slate-500 dark:text-tactical-dim tabular-nums">{r.done}/{r.totalTokens} {t(`${base}.labels.tokens`)}</span>
                    </div>
                    <SegmentBar value={r.done} max={r.totalTokens} color="cyan" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Queue */}
          <div className="border border-slate-200 dark:border-tactical-border">
            <div className="border-b border-slate-200 dark:border-tactical-border px-3 py-2 flex items-center justify-between">
              <div className="label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.panels.queue`)}</div>
              <div className="font-mono text-xs text-signal-amber tabular-nums">{queue.length} {t(`${base}.labels.waiting`)}</div>
            </div>
            <div className="p-3 min-h-[180px]">
              {queue.length === 0 ? (
                <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-10 text-center font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-tactical-label">
                  {t(`${base}.labels.queue_empty`)}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {queue.map(r => (
                    <span key={r.id} className="border border-signal-amber/40 text-signal-amber px-2 py-1 font-mono text-[11px] tabular-nums">
                      #{r.id}
                    </span>
                  ))}
                </div>
              )}
              {batch.length === 0 && queue.length === 0 && (
                <p className="mt-4 font-mono text-[11px] text-slate-400 dark:text-tactical-label">{t(`${base}.labels.batch_empty`)}</p>
              )}
            </div>
          </div>
        </div>
      </Panel>

      <Panel title={t(`${base}.panels.metrics`)} accent="green">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <Metric value={`${throughput}`} label={t(`${base}.metrics.throughput`)} color="cyan" />
          <Metric value={`${utilization}%`} label={t(`${base}.metrics.utilization`)} color={utilization > 90 ? 'green' : 'amber'} />
          <Metric value={`${queue.length}`} label={t(`${base}.metrics.queue_depth`)} color={queue.length > 10 ? 'red' : 'default'} />
          <Metric value={`${avgLatency}ms`} label={t(`${base}.metrics.avg_latency`)} color={avgLatency > 1500 ? 'red' : 'default'} />
          <Metric value={`${metrics.completed}`} label={t(`${base}.metrics.completed`)} color="green" />
          <Metric value={`${metrics.dropped}`} label={t(`${base}.metrics.dropped`)} color={metrics.dropped > 0 ? 'red' : 'default'} />
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.metrics.utilization`)}</span>
            <StatusBadge variant={isRunning ? 'active' : 'offline'} />
          </div>
          <SegmentBar value={utilization} max={100} color={utilization > 90 ? 'green' : 'amber'} caption={`${utilization}%`} />
        </div>
      </Panel>
    </div>
  );
}

function Metric({ value, label, color }: { value: string; label: string; color: 'default' | 'green' | 'amber' | 'red' | 'cyan' }) {
  const colorClass: Record<string, string> = {
    default: 'text-slate-900 dark:text-tactical-text',
    green: 'text-signal-green',
    amber: 'text-signal-amber',
    red: 'text-signal-red',
    cyan: 'text-signal-cyan',
  };
  return (
    <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
      <div className={`font-mono text-2xl font-bold tabular-nums leading-none ${colorClass[color]}`}>{value}</div>
      <div className="label-mono mt-2">{label}</div>
    </div>
  );
}
