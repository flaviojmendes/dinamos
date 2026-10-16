import { useEffect, useRef, type ReactNode } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

export type MetricColor = 'default' | 'green' | 'amber' | 'red' | 'cyan';

export const metricColorClass: Record<MetricColor, string> = {
  default: 'text-slate-900 dark:text-tactical-text',
  green: 'text-signal-green',
  amber: 'text-signal-amber',
  red: 'text-signal-red',
  cyan: 'text-signal-cyan',
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
  const display = useRef(value);
  const element = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const formatter = useRef(format);
  formatter.current = format;
  const render = (n: number) => formatter.current ? formatter.current(n) : n.toFixed(decimals);

  useEffect(() => {
    if (reducedMotion || !Number.isFinite(value) || value === 0) {
      display.current = value;
      if (element.current) element.current.textContent = render(value);
      return;
    }
    const controls = animate(display.current, value, {
      duration: 0.24,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        display.current = v;
        if (element.current) element.current.textContent = render(v);
      },
    });
    return () => controls.stop();
  }, [value, decimals, reducedMotion, format]);

  return <span ref={element}>{render(display.current)}</span>;
}

/** Stable telemetry, interpolated from the currently displayed number. */
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
    <div className="sim-metric" data-tone={color} data-active={pulse}>
      <div className={`sim-metric-value ${metricColorClass[color]}`}>
        {prefix && <small>{prefix}</small>}
        <AnimatedNumber value={value} decimals={decimals} format={format} />
        {suffix && <small>{suffix}</small>}
      </div>
      <div className="sim-metric-label">{label}</div>
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

/** A stable canvas; its children animate the actual simulation events. */
export function Stage({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
