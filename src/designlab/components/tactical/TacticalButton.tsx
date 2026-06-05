import React from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:
    'bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-200 border border-transparent',
  secondary:
    'bg-transparent text-slate-900 dark:text-tactical-text border border-slate-300 dark:border-tactical-line hover:border-slate-900 dark:hover:border-signal-green hover:bg-slate-100 dark:hover:bg-tactical-raised',
  ghost:
    'bg-transparent text-slate-600 dark:text-tactical-dim border border-transparent hover:text-slate-900 dark:hover:text-tactical-text hover:bg-slate-100 dark:hover:bg-tactical-raised',
  danger:
    'bg-transparent text-signal-red border border-signal-red/50 hover:bg-signal-red/10 hover:border-signal-red',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-sm',
};

interface TacticalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

/** Sharp-cornered command button. Use verb-first labels. */
export const TacticalButton = React.forwardRef<HTMLButtonElement, TacticalButtonProps>(
  ({ variant = 'secondary', size = 'md', className, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-mono uppercase tracking-wider font-medium transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-tactical-bg focus-visible:ring-brand-500 dark:focus-visible:ring-signal-green',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

TacticalButton.displayName = 'TacticalButton';

export default TacticalButton;
