import React from 'react';
import { cn } from './cn';
import { StatusBadge } from './StatusBadge';

interface SimulatorConsoleProps {
  /** Simulator subject title. */
  title: React.ReactNode;
  /** Short subtitle / description shown under the title. */
  subtitle?: React.ReactNode;
  /** Right-aligned header content (e.g. run/reset controls). */
  toolbar?: React.ReactNode;
  /** Show the online status pill in the header. Defaults to true. */
  online?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Shared frame for interactive simulators, with a subject title, status,
 * and optional controls.
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-tactical-border px-5 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-tactical-text">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 max-w-prose font-sans text-sm text-slate-500 dark:text-tactical-dim">{subtitle}</p>
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
