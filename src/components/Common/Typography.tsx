import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'small';

interface TypographyProps {
  variant: TypographyVariant;
  children: ReactNode;
  className?: string;
  color?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  className = '',
  color = '',
}) => {
  const baseClasses = clsx({
    'text-4xl font-bold font-mono tracking-tight': variant === 'h1',
    'text-3xl font-semibold font-mono tracking-tight': variant === 'h2',
    'text-2xl font-semibold font-mono tracking-tight': variant === 'h3',
    'text-xl font-medium font-mono tracking-tight': variant === 'h4',
    'text-lg font-medium font-mono tracking-tight': variant === 'h5',
    'text-base font-medium font-mono tracking-tight': variant === 'h6',
    'text-base font-sans leading-relaxed': variant === 'p',
    'text-sm font-sans': variant === 'small',
  });

  // Only apply default colors if no color prop is provided and no text color class is in className
  const hasColorClass = className.includes('text-');
  const defaultColorClass = (!color && !hasColorClass) 
    ? (variant === 'p' || variant === 'small' ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-slate-100')
    : '';

  const colorClass = color ? `text-${color}` : '';
  
  const combinedClasses = clsx(baseClasses, defaultColorClass, colorClass, className);

  switch (variant) {
    case 'h1':
      return <h1 className={combinedClasses}>{children}</h1>;
    case 'h2':
      return <h2 className={combinedClasses}>{children}</h2>;
    case 'h3':
      return <h3 className={combinedClasses}>{children}</h3>;
    case 'h4':
      return <h4 className={combinedClasses}>{children}</h4>;
    case 'h5':
      return <h5 className={combinedClasses}>{children}</h5>;
    case 'h6':
      return <h6 className={combinedClasses}>{children}</h6>;
    case 'p':
      return <p className={combinedClasses}>{children}</p>;
    case 'small':
      return <small className={combinedClasses}>{children}</small>;
    default:
      return <p className={combinedClasses}>{children}</p>;
  }
};

export default Typography;
