import { useEffect, useState } from 'react';

interface ProgressRingProps {
  /** 0-100 */
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
}

/**
 * Circular progress indicator. The arc draws to its value on mount via a CSS
 * stroke-dashoffset transition (state, not decoration). Respects
 * prefers-reduced-motion by snapping straight to the value.
 */
export default function ProgressRing({
  value,
  size = 132,
  stroke = 10,
  label,
  className,
}: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setProgress(clamped);
      return;
    }
    const id = requestAnimationFrame(() => setProgress(clamped));
    return () => cancelAnimationFrame(id);
  }, [clamped]);

  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: 'relative' }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-200 dark:stroke-tactical-raised"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-emerald-500 dark:stroke-signal-green motion-safe:transition-[stroke-dashoffset] motion-safe:duration-[900ms] motion-safe:ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-sans text-3xl font-bold tabular-nums leading-none text-slate-900 dark:text-tactical-text">
          {clamped}%
        </span>
        {label && (
          <span className="label-mono mt-1.5">{label}</span>
        )}
      </div>
    </div>
  );
}
