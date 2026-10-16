import { Link } from 'react-router-dom';

interface BrandProps {
  className?: string;
  compact?: boolean;
  linked?: boolean;
}

/** Dinamos keeps its bracket-and-bolt symbol in the Trilha type and color system. */
export default function Brand({ className = '', compact = false, linked = false }: BrandProps) {
  const content = (
    <>
      <svg viewBox="0 0 64 64" className="dinamos-brand-symbol" fill="none" aria-hidden="true">
        <path d="M22 14H14L4 32l10 18h8L12 32 22 14Z" fill="currentColor" />
        <path d="M42 14h8l10 18-10 18h-8l10-18-10-18Z" fill="currentColor" />
        <path d="m34 15-13 20h10l-3 14 15-23H32l2-11Z" className="fill-slate-900 dark:fill-tactical-text" />
      </svg>
      {!compact && <span className="dinamos-brand-name brand-wordmark">dinamos<span>.</span></span>}
    </>
  );

  return linked ? (
    <Link to="/" className={`dinamos-brand ${className}`} aria-label="Dinamos">{content}</Link>
  ) : (
    <span className={`dinamos-brand ${className}`} aria-label="Dinamos" role="img">{content}</span>
  );
}
