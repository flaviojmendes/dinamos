import React from 'react';
import { cn } from './cn';

type TagColor = 'default' | 'green' | 'amber' | 'red' | 'cyan';

const colors: Record<TagColor, string> = {
  default: 'text-slate-500 dark:text-tactical-dim',
  green: 'text-signal-green',
  amber: 'text-signal-amber',
  red: 'text-signal-red',
  cyan: 'text-signal-cyan',
};

interface TagProps {
  children: React.ReactNode;
  color?: TagColor;
  className?: string;
}

/** Bracketed mono tag, e.g. [CLASSIFIED ACCESS]. */
export function Tag({ children, color = 'default', className }: TagProps) {
  return (
    <span
      className={cn(
        'font-mono text-[11px] uppercase tracking-wider whitespace-nowrap',
        colors[color],
        className,
      )}
    >
      [{children}]
    </span>
  );
}

export default Tag;
