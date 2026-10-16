import React from 'react';
import { cn } from './cn';
import { StatusBadge } from './StatusBadge';
import { MotionConfig } from 'framer-motion';
import { FlaskConical } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  online = false,
  className,
  children,
}: SimulatorConsoleProps) {
  const { t, i18n } = useTranslation();
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
    <div className={cn('simulation-workspace sim-console', className)}>
      <div className="sim-console-heading">
        <h1>{title}</h1>
        <span className="sim-console-caption"><FlaskConical size={15} aria-hidden="true" />{t('content.simulator_interactive')}</span>
        <div className="flex items-center gap-3">
          {toolbar}
          {online && <StatusBadge variant="online" />}
        </div>
      </div>
      {subtitle && <p className="mb-5 max-w-prose text-sm text-slate-600 dark:text-tactical-dim">{subtitle}</p>}
      <div key={i18n.resolvedLanguage || i18n.language} className="sim-console-body">{children}</div>
    </div>
    </MotionConfig>
  );
}

export default SimulatorConsole;
