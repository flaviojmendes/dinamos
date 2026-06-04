import { useEffect, useRef, useState, type ReactNode } from 'react';
import { animate, motion } from 'framer-motion';

export type MetricColor = 'default' | 'green' | 'amber' | 'red' | 'cyan';

export const metricColorClass: Record<MetricColor, string> = {
  default: 'text-slate-900 dark:text-tactical-text',
  green: 'text-signal-green',
  amber: 'text-signal-amber',
  red: 'text-signal-red',
  cyan: 'text-signal-cyan',
};

const accentBar: Record<MetricColor, string> = {
  default: 'bg-slate-300 dark:bg-tactical-border',
  green: 'bg-signal-green',
  amber: 'bg-signal-amber',
  red: 'bg-signal-red',
  cyan: 'bg-signal-cyan',
};

/** Smoothly tweens to `value` whenever it changes (count-up effect). */
export function AnimatedNumber({
  value,
  decimals = 0,
  format,
}: {
  value: number;
  decimals?: number;
  format?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.45,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value]);

  if (format) return <>{format(display)}</>;
  return <>{display.toFixed(decimals)}</>;
}

/** Metric card with a count-up number, a colored pulse accent, and a pop on change. */
export function AnimatedMetric({
  value,
  label,
  color = 'default',
  decimals = 0,
  prefix = '',
  suffix = '',
  format,
  pulse = false,
}: {
  value: number;
  label: string;
  color?: MetricColor;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
  pulse?: boolean;
}) {
  return (
    <div className="relative overflow-hidden border border-slate-200 dark:border-tactical-border px-3 py-3">
      <motion.div
        className={`absolute left-0 top-0 h-full w-[3px] ${accentBar[color]}`}
        animate={pulse ? { opacity: [0.35, 1, 0.35] } : { opacity: 0.7 }}
        transition={pulse ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : undefined}
      />
      <motion.div
        key={Math.round(value * 10 ** decimals)}
        initial={{ scale: 1 }}
        animate={{ scale: [1.12, 1] }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`font-mono text-2xl font-bold tabular-nums leading-none ${metricColorClass[color]}`}
      >
        {prefix}
        <AnimatedNumber value={value} decimals={decimals} format={format} />
        {suffix}
      </motion.div>
      <div className="label-mono mt-2">{label}</div>
    </div>
  );
}

/** A soft animated grid backdrop used inside visualization panels. */
export function GridBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.18] dark:opacity-[0.12]"
      style={{
        backgroundImage:
          'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        color: 'rgb(148 163 184)',
      }}
    />
  );
}

/** Wraps content with a subtle entrance used by visualization panels. */
export function Stage({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}
