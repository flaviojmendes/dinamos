import React from 'react';
import { cn } from './cn';

interface StatProps {
  value: React.ReactNode;
  label: React.ReactNode;
  sub?: React.ReactNode;
  color?: 'default' | 'green' | 'amber' | 'red' | 'cyan';
  className?: string;
}

const valueColor: Record<NonNullable<StatProps['color']>, string> = {
  default: 'text-slate-900 dark:text-tactical-text',
  green: 'text-signal-green',
  amber: 'text-signal-amber',
  red: 'text-signal-red',
  cyan: 'text-signal-cyan',
};

/** Big-number metric tile. */
export function Stat({ value, label, sub, color = 'default', className }: StatProps) {
  return (
    <div
      className={cn(
        'tactical-panel flex flex-col items-start justify-center px-4 py-4',
        className,
      )}
    >
      <div className={cn('font-mono text-3xl font-bold tabular-nums leading-none', valueColor[color])}>
        {value}
      </div>
      <div className="label-mono mt-2">{label}</div>
      {sub && <div className="font-mono text-xs text-slate-500 dark:text-tactical-dim mt-1">{sub}</div>}
    </div>
  );
}

export default Stat;
