interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showSubtitle?: boolean;
  className?: string;
  forceWhite?: boolean;
}

export default function Logo({ size = 'medium', className = '', forceWhite = false }: LogoProps) {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-16 w-16',
    large: 'h-32 w-32'
  };


  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src="/logo.png" 
        alt="Dinamos Lab Logo" 
        className={`${sizeClasses[size]} object-contain ${!forceWhite ? 'brightness-0 dark:brightness-100' : ''}`}
      />
  
    </div>
  );
}
