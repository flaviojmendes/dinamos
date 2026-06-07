import React from 'react';
import { cn } from './cn';

export type StatusVariant =
  | 'online'
  | 'active'
  | 'completed'
  | 'in-progress'
  | 'pending'
  | 'locked'
  | 'classified'
  | 'offline';

const variants: Record<StatusVariant, { dot: string; box: string; label: string }> = {
  online: {
    dot: 'bg-signal-green',
    box: 'border-signal-green/40 text-emerald-700 dark:text-signal-green',
    label: 'Online',
  },
  active: {
    dot: 'bg-signal-green',
    box: 'border-signal-green/40 text-emerald-700 dark:text-signal-green',
    label: 'Active',
  },
  completed: {
    dot: 'bg-signal-green',
    box: 'border-signal-green/40 text-emerald-700 dark:text-signal-green',
    label: 'Completed',
  },
  'in-progress': {
    dot: 'bg-signal-amber',
    box: 'border-signal-amber/40 text-amber-700 dark:text-signal-amber',
    label: 'In progress',
  },
  pending: {
    dot: 'bg-signal-amber',
    box: 'border-signal-amber/40 text-amber-700 dark:text-signal-amber',
    label: 'Pending',
  },
  locked: {
    dot: 'bg-tactical-label',
    box: 'border-slate-300 dark:border-tactical-line text-slate-500 dark:text-tactical-label',
    label: 'Locked',
  },
  offline: {
    dot: 'bg-tactical-label',
    box: 'border-slate-300 dark:border-tactical-line text-slate-500 dark:text-tactical-label',
    label: 'Offline',
  },
  classified: {
    dot: 'bg-signal-red',
    box: 'border-signal-red/50 text-red-700 dark:text-signal-red',
    label: 'Classified',
  },
};

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
  /** Show the leading status dot. Defaults to true. */
  dot?: boolean;
  className?: string;
}

/** Uppercase mono status pill with a colored dot and hairline box. */
export function StatusBadge({ variant, label, dot = true, className }: StatusBadgeProps) {
  const v = variants[variant];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-sans text-[11px] font-medium dark:rounded-sm',
        v.box,
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', v.dot)} aria-hidden />}
      {label ?? v.label}
    </span>
  );
}

export default StatusBadge;
