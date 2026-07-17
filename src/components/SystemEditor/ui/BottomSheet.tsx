// Generic slide-up bottom sheet built on AccessibleOverlay (focus trap, Escape,
// scroll lock, labelled title).

import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import AccessibleOverlay from '../../a11y/AccessibleOverlay';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** Fraction of the viewport height the sheet may grow to (defaults to 0.8). */
  maxHeightVh?: number;
  children: ReactNode;
}

export default function BottomSheet({ open, onClose, title, maxHeightVh = 80, children }: Props) {
  const { t } = useTranslation();
  const titleText =
    typeof title === 'string'
      ? title
      : t('editor.mobile.sheet', { defaultValue: 'Panel' });

  return (
    <AccessibleOverlay
      open={open}
      onClose={onClose}
      title={titleText}
      variant="bottom-sheet"
      maxHeightVh={maxHeightVh}
      closeLabel={t('editor.mobile.close', { defaultValue: 'Close' })}
      panelClassName="transition-transform duration-200 ease-out motion-reduce:transition-none"
    >
      <div className="flex items-center justify-between gap-2 px-4 pt-2 pb-2 border-b border-slate-200 dark:border-tactical-border shrink-0">
        <div className="flex-1 flex flex-col items-stretch">
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-slate-300 dark:bg-tactical-line" aria-hidden />
          {title && (
            <div className="font-sans text-sm font-medium text-slate-900 dark:text-tactical-text truncate">
              {title}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('editor.mobile.close', { defaultValue: 'Close' })}
          className="p-2 -mr-2 text-tactical-label hover:text-signal-cyan transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </AccessibleOverlay>
  );
}
