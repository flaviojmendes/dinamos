import React from 'react';
import { cn } from './cn';

type BarColor = 'green' | 'amber' | 'red' | 'cyan' | 'white';

const colorClass: Record<BarColor, string> = {
  green: 'text-signal-green',
  amber: 'text-signal-amber',
  red: 'text-signal-red',
  cyan: 'text-signal-cyan',
  white: 'text-slate-900 dark:text-tactical-text',
};

interface SegmentBarProps {
  value: number;
  max?: number;
  color?: BarColor;
  /** Show "value/max" or a custom caption to the right. */
  caption?: React.ReactNode;
  className?: string;
}

/**
 * Segmented / dithered progress bar (the 84/112 metrics + RISK LEVEL bars).
 * The fill uses `.seg-bar` driven by `currentColor`.
 */
export function SegmentBar({ value, max = 100, color = 'green', caption, className }: SegmentBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative h-2 flex-1 bg-slate-200 dark:bg-tactical-raised overflow-hidden rounded-full">
        <div
          className={cn('seg-bar absolute inset-y-0 left-0 rounded-full', colorClass[color])}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {caption !== undefined && (
        <span className="font-sans text-xs text-slate-500 dark:text-tactical-dim shrink-0 tabular-nums">
          {caption}
        </span>
      )}
    </div>
  );
}

export default SegmentBar;
