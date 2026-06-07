// Generic slide-up bottom sheet used by the touch editor layout. Renders a
// dimmed backdrop and a panel anchored to the bottom of the viewport. Keeps the
// existing tactical styling so it matches the rest of the editor.

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** Fraction of the viewport height the sheet may grow to (defaults to 0.8). */
  maxHeightVh?: number;
  children: ReactNode;
}

export default function BottomSheet({ open, onClose, title, maxHeightVh = 80, children }: Props) {
  // Close on Escape (e.g. tablet with a keyboard).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute inset-x-0 bottom-0 flex flex-col bg-white dark:bg-tactical-surface border-t border-slate-200 dark:border-tactical-border shadow-2xl transition-transform duration-200 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: `${maxHeightVh}vh` }}
      >
        <div className="flex items-center justify-between gap-2 px-4 pt-2 pb-2 border-b border-slate-200 dark:border-tactical-border shrink-0">
          <div className="flex-1 flex flex-col items-stretch">
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-slate-300 dark:bg-tactical-line" aria-hidden />
            {title && (
              <div className="font-sans text-sm font-medium text-slate-900 dark:text-tactical-text truncate">{title}</div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 -mr-2 text-tactical-label hover:text-signal-cyan transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
