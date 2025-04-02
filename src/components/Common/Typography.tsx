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
    'text-h1 font-title': variant === 'h1',
    'text-h2 font-title': variant === 'h2',
    'text-h3 font-title': variant === 'h3',
    'text-h4 font-title': variant === 'h4',
    'text-h5 font-title': variant === 'h5',
    'text-h6 font-title': variant === 'h6',
    'text-p font-content': variant === 'p',
    'text-small font-content': variant === 'small',
  });

  const colorClass = color ? `text-${color}` : '';
  
  const combinedClasses = clsx(baseClasses, colorClass, className);

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