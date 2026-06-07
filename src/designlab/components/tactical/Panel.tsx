import React from 'react';
import { cn } from './cn';

// Accent is accepted for API compatibility but no longer renders a loud bar.
type AccentKey = 'amber' | 'green' | 'red' | 'cyan' | 'none';

interface PanelHeaderProps {
  title: React.ReactNode;
  accent?: AccentKey;
  action?: React.ReactNode;
  className?: string;
}

/** Clean section header with a sans title. `action` renders on the right. */
export function PanelHeader({ title, action, className }: PanelHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 border-b border-slate-200 dark:border-tactical-border px-4 py-3',
        className,
      )}
    >
      <h2 className="min-w-0 truncate font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text">
        {title}
      </h2>
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
