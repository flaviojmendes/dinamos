import React from 'react';
import { cn } from './cn';

type TagColor = 'default' | 'green' | 'amber' | 'red' | 'cyan';

const colors: Record<TagColor, string> = {
  default: 'text-slate-600 bg-slate-100 dark:text-tactical-dim dark:bg-tactical-raised',
  green: 'text-emerald-700 bg-emerald-50 dark:text-signal-green dark:bg-signal-green/10',
  amber: 'text-amber-700 bg-amber-50 dark:text-signal-amber dark:bg-signal-amber/10',
  red: 'text-red-700 bg-red-50 dark:text-signal-red dark:bg-signal-red/10',
  cyan: 'text-cyan-700 bg-cyan-50 dark:text-signal-cyan dark:bg-signal-cyan/10',
};

interface TagProps {
  children: React.ReactNode;
  color?: TagColor;
  className?: string;
}

/** Quiet, rounded label pill. */
export function Tag({ children, color = 'default', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 font-sans text-[11px] font-medium whitespace-nowrap dark:rounded-sm',
        colors[color],
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Tag;
