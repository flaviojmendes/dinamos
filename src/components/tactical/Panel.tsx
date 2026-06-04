import React from 'react';
import { cn } from './cn';

type AccentKey = 'amber' | 'green' | 'red' | 'cyan' | 'none';

const accentBar: Record<AccentKey, string> = {
  amber: 'bg-signal-amber',
  green: 'bg-signal-green',
  red: 'bg-signal-red',
  cyan: 'bg-signal-cyan',
  none: 'hidden',
};

interface PanelHeaderProps {
  title: React.ReactNode;
  accent?: AccentKey;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Section header with a left accent bar and an uppercase mono title, mirroring
 * the reference "OPERATION REQUIRES APPROVAL" header. `action` renders on the right.
 */
export function PanelHeader({ title, accent = 'amber', action, className }: PanelHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 border-b border-slate-200 dark:border-tactical-border px-4 py-3',
        className,
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={cn('h-3.5 w-1 shrink-0', accentBar[accent])} aria-hidden />
        <h2 className="font-mono uppercase tracking-wider text-sm font-semibold text-slate-900 dark:text-tactical-text truncate">
          {title}
        </h2>
      </div>
      {action && <div className="shrink-0 text-xs">{action}</div>}
    </div>
  );
}

interface PanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  accent?: AccentKey;
  action?: React.ReactNode;
  /** Adds padding to the body. Disable when embedding a table or custom layout. */
  padded?: boolean;
  bodyClassName?: string;
}

/** Bordered tactical panel with an optional header. */
export function Panel({
  title,
  accent = 'amber',
  action,
  padded = true,
  className,
  bodyClassName,
  children,
  ...rest
}: PanelProps) {
  return (
    <div className={cn('tactical-panel', className)} {...rest}>
      {title && <PanelHeader title={title} accent={accent} action={action} />}
      <div className={cn(padded && 'p-4', bodyClassName)}>{children}</div>
    </div>
  );
}

export default Panel;
