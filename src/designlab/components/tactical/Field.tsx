import React from 'react';
import { cn } from './cn';

interface FieldProps {
  label: React.ReactNode;
  value?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/** Uppercase muted label stacked over a mono value. */
export function Field({ label, value, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="label-mono">{label}</span>
      <div className="font-mono text-sm text-slate-900 dark:text-tactical-text">
        {children ?? value ?? '-'}
      </div>
    </div>
  );
}

interface FieldGridProps {
  cols?: 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
}

/** Responsive grid of <Field> items. */
export function FieldGrid({ cols = 3, className, children }: FieldGridProps) {
  const colClass =
    cols === 2 ? 'sm:grid-cols-2' : cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3';
  return <div className={cn('grid grid-cols-1 gap-x-6 gap-y-5', colClass, className)}>{children}</div>;
}

export default Field;
