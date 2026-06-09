import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Metric {
  label: string;
  base: number;
  jitter: number;
  decimals: number;
  format: (n: number) => string;
  tone: string;
}

const METRICS: Metric[] = [
  {
    label: 'throughput',
    base: 12.4,
    jitter: 1.6,
    decimals: 1,
    format: (n) => `${n.toFixed(1)}k`,
    tone: 'text-signal-cyan',
  },
  {
    label: 'p99 latency',
    base: 42,
    jitter: 9,
    decimals: 0,
    format: (n) => `${Math.round(n)}ms`,
    tone: 'text-signal-amber',
  },
  {
    label: 'cache hit',
    base: 96.2,
    jitter: 1.2,
    decimals: 1,
    format: (n) => `${n.toFixed(1)}%`,
    tone: 'text-emerald-600 dark:text-signal-green',
  },
];

const BOOT_LINES = [
  { text: 'node-01 ▸ ONLINE   region=us-east', tone: 'text-emerald-600 dark:text-signal-green' },
  { text: 'node-02 ▸ ONLINE   region=eu-west', tone: 'text-emerald-600 dark:text-signal-green' },
  { text: 'circuit-breaker ▸ CLOSED  errors=0', tone: 'text-signal-amber' },
  { text: 'consensus reached ▸ quorum 3/3', tone: 'text-signal-cyan' },
];

const BAR_COUNT = 28;

function useLiveSeries(seed: number, count: number, reduce: boolean | null) {
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: count }, (_, i) => 0.4 + 0.45 * Math.abs(Math.sin(seed + i * 0.5))),
  );
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setBars((prev) => {
        const next = prev.slice(1);
        next.push(0.3 + Math.random() * 0.65);
        return next;
      });
    }, 420);
    return () => clearInterval(id);
  }, [reduce]);
  return bars;
}

/**
 * Hero "live ops console": a throughput histogram, ticking telemetry, and a
 * streaming boot log. Conveys a healthy distributed system at a glance.
 * Reduced-motion renders a static, representative snapshot.
 */
export default function LiveSystemPanel() {
  const reduce = useReducedMotion();
  const bars = useLiveSeries(2, BAR_COUNT, reduce);
  const [values, setValues] = useState<number[]>(METRICS.map((m) => m.base));
  const tick = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      tick.current += 1;
      setValues(
        METRICS.map((m) => m.base + Math.sin(tick.current * 0.6 + m.base) * m.jitter * 0.5 + (Math.random() - 0.5) * m.jitter),
      );
    }, 1600);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="tactical-panel scanline overflow-hidden shadow-xl shadow-slate-900/5 dark:shadow-black/40">
      {/* title bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-tactical-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-signal-red/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-signal-amber/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-signal-green/80" />
        </div>
        <span className="font-mono text-[11px] text-slate-400 dark:text-tactical-label">system.status</span>
      </div>

      <div className="bg-slate-50/60 dark:bg-tactical-bg/40 p-4">
        {/* live telemetry readouts */}
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-tactical-border dark:bg-tactical-border">
          {METRICS.map((m, i) => (
            <div key={m.label} className="bg-white dark:bg-tactical-surface px-3 py-2.5">
              <div className="label-mono mb-1">{m.label}</div>
              <div className={`font-mono text-lg font-bold tabular-nums ${m.tone}`}>
                {m.format(values[i])}
              </div>
            </div>
          ))}
        </div>

        {/* throughput histogram */}
        <div className="mt-3 flex h-16 items-end gap-[3px]" aria-hidden="true">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-signal-cyan/30 to-signal-cyan/80 dark:from-signal-cyan/20 dark:to-signal-cyan"
              animate={{ height: `${Math.round(h * 100)}%` }}
              transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>

        {/* streaming boot log */}
        <div className="mt-3 space-y-0.5 font-mono text-[11.5px] leading-relaxed">
          {BOOT_LINES.map((line, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-2"
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reduce ? 0 : 0.5 + i * 0.22, duration: 0.4 }}
            >
              <span className="select-none text-slate-300 dark:text-tactical-label">$</span>
              <span className={line.tone}>{line.text}</span>
            </motion.div>
          ))}
          <div className="flex items-center gap-2">
            <span className="select-none text-slate-300 dark:text-tactical-label">$</span>
            <span className="text-slate-700 dark:text-tactical-text caret" />
          </div>
        </div>
      </div>
    </div>
  );
}
