import { type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * Teaching kit — shared pedagogical primitives for the interactive simulators.
 *
 * The goal is comprehension, not decoration: a running narration of "what is
 * happening right now", a colour legend so every glyph on the stage is named,
 * and a small convergence chart so students see the shape of a process (an
 * S-curve, a plateau) and not just a final number. All pieces speak the
 * tactical palette and honour `prefers-reduced-motion`.
 */

type NarrationTone = 'idle' | 'active' | 'success';

const toneRing: Record<NarrationTone, string> = {
  idle: 'border-slate-200 dark:border-tactical-border',
  active: 'border-signal-cyan/40 dark:border-signal-cyan/40',
  success: 'border-signal-green/40 dark:border-signal-green/40',
};

const toneDot: Record<NarrationTone, string> = {
  idle: 'bg-slate-300 dark:bg-tactical-line',
  active: 'bg-signal-cyan',
  success: 'bg-signal-green',
};

/**
 * A single-line status that explains the current step. Pass a changing
 * `stepKey` (round number, phase name) to crossfade between messages.
 */
export function NarrationBar({
  children,
  tone = 'idle',
  stepKey,
}: {
  children: ReactNode;
  tone?: NarrationTone;
  stepKey?: string | number;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={`flex items-start gap-2.5 rounded-lg border bg-slate-50/60 px-3.5 py-2.5 dark:bg-tactical-raised/40 ${toneRing[tone]}`}
    >
      <span className="relative mt-[3px] flex h-2.5 w-2.5 shrink-0">
        {tone === 'active' && !reduce && (
          <motion.span
            className={`absolute inline-flex h-full w-full rounded-full ${toneDot[tone]}`}
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${toneDot[tone]}`} />
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={stepKey ?? 'static'}
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="min-w-0 font-sans text-sm leading-relaxed text-slate-700 dark:text-tactical-text"
        >
          {children}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export interface LegendItem {
  /** Tailwind background class for the swatch, e.g. `bg-signal-green`. */
  swatch: string;
  label: string;
  /** Render swatch as a hollow ring (for "empty"/"unaware" states). */
  hollow?: boolean;
}

/** Names every glyph on the stage. A legend is the cheapest way to kill ambiguity. */
export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {items.map((it) => (
        <span
          key={it.label}
          className="inline-flex items-center gap-1.5 font-sans text-[11px] text-slate-500 dark:text-tactical-dim"
        >
          <span
            className={`h-2.5 w-2.5 rounded-[3px] ${
              it.hollow
                ? 'border border-slate-400 dark:border-tactical-line'
                : it.swatch
            }`}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}

/**
 * Small area chart of a cumulative series (e.g. nodes informed per round).
 * Designed so the *shape* of convergence is the lesson: the S-curve of an
 * epidemic, the plateau of a saturated queue. `data[i]` is the value at step i.
 */
export function ConvergenceChart({
  data,
  total,
  accent = 'green',
  className = '',
  height = 96,
}: {
  data: number[];
  total: number;
  accent?: 'green' | 'cyan' | 'amber';
  className?: string;
  height?: number;
}) {
  const reduce = useReducedMotion();
  const W = 200;
  const H = 100;
  const pad = 4;
  const maxX = Math.max(data.length - 1, 1);
  const stroke = accent === 'cyan' ? '#56b6c8' : accent === 'amber' ? '#d9a441' : '#34d399';

  const x = (i: number) => pad + (i / maxX) * (W - pad * 2);
  const y = (v: number) => H - pad - (Math.min(v, total) / Math.max(total, 1)) * (H - pad * 2);

  const pts = data.map((v, i) => `${x(i)},${y(v)}`);
  const linePath = pts.length ? `M ${pts.join(' L ')}` : '';
  const areaPath = pts.length
    ? `M ${x(0)},${H - pad} L ${pts.join(' L ')} L ${x(data.length - 1)},${H - pad} Z`
    : '';
  const lastIdx = data.length - 1;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={`w-full ${className}`}
      style={{ height }}
      role="img"
      aria-hidden
    >
      {/* full-coverage reference line */}
      <line
        x1={pad}
        x2={W - pad}
        y1={y(total)}
        y2={y(total)}
        stroke={stroke}
        strokeOpacity={0.25}
        strokeDasharray="3 3"
        strokeWidth={0.8}
      />
      {areaPath && <path d={areaPath} fill={stroke} fillOpacity={0.12} />}
      {linePath && (
        <motion.path
          d={linePath}
          fill="none"
          stroke={stroke}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={reduce ? undefined : { pathLength: 1 }}
        />
      )}
      {lastIdx >= 0 && (
        <circle cx={x(lastIdx)} cy={y(data[lastIdx])} r={2.4} fill={stroke}>
          {!reduce && (
            <animate attributeName="r" values="2.4;3.6;2.4" dur="1.4s" repeatCount="indefinite" />
          )}
        </circle>
      )}
    </svg>
  );
}
