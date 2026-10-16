import Brand from '../../components/Common/Brand';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showSubtitle?: boolean;
  className?: string;
  forceWhite?: boolean;
}

export default function Logo({ size = 'medium', className = '', forceWhite = false }: LogoProps) {
  const sizeClasses = {
    small: '[&_svg]:h-7 [&_svg]:w-7',
    medium: '[&_svg]:h-9 [&_svg]:w-9',
    large: '[&_svg]:h-12 [&_svg]:w-12 [&_.brand-wordmark]:text-4xl'
  };

  return (
    <Brand
      linked={false}
      className={`${sizeClasses[size]} ${forceWhite ? '[&_.brand-wordmark]:text-white' : ''} ${className}`}
    />
  );
}
