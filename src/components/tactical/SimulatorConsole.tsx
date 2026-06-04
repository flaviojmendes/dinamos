import React from 'react';
import { cn } from './cn';
import { StatusBadge } from './StatusBadge';

interface SimulatorConsoleProps {
  /** Console title, e.g. "CACHE SIMULATION CONSOLE". */
  title: React.ReactNode;
  /** Short subtitle / description shown under the title. */
  subtitle?: React.ReactNode;
  /** Right-aligned header content (e.g. run/reset controls). */
  toolbar?: React.ReactNode;
  /** Show the "ONLINE" status pill in the header. Defaults to true. */
  online?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Shared chrome for interactive simulators: a tactical title bar with a status
 * pill + toolbar, wrapping the simulator body in a bordered console frame.
 */
export function SimulatorConsole({
  title,
  subtitle,
  toolbar,
  online = true,
  className,
  children,
}: SimulatorConsoleProps) {
  return (
    <div className={cn('tactical-panel', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-tactical-border px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="h-3.5 w-1 bg-signal-green shrink-0" aria-hidden />
          <div className="min-w-0">
            <h2 className="font-mono uppercase tracking-wider text-sm font-semibold text-slate-900 dark:text-tactical-text truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim truncate">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {toolbar}
          {online && <StatusBadge variant="online" />}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default SimulatorConsole;
