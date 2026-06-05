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
    box: 'border-signal-green/40 text-signal-green',
    label: 'ONLINE',
  },
  active: {
    dot: 'bg-signal-green',
    box: 'border-signal-green/40 text-signal-green',
    label: 'ACTIVE',
  },
  completed: {
    dot: 'bg-signal-green',
    box: 'border-signal-green/40 text-signal-green',
    label: 'COMPLETED',
  },
  'in-progress': {
    dot: 'bg-signal-amber',
    box: 'border-signal-amber/40 text-signal-amber',
    label: 'IN-PROGRESS',
  },
  pending: {
    dot: 'bg-signal-amber',
    box: 'border-signal-amber/40 text-signal-amber',
    label: 'PENDING',
  },
  locked: {
    dot: 'bg-tactical-label',
    box: 'border-slate-300 dark:border-tactical-line text-slate-500 dark:text-tactical-label',
    label: 'LOCKED',
  },
  offline: {
    dot: 'bg-tactical-label',
    box: 'border-slate-300 dark:border-tactical-line text-slate-500 dark:text-tactical-label',
    label: 'OFFLINE',
  },
  classified: {
    dot: 'bg-signal-red',
    box: 'border-signal-red/50 text-signal-red',
    label: 'CLASSIFIED',
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
        'inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider',
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
