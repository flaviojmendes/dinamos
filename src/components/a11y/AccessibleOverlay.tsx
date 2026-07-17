import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type MouseEvent,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface AccessibleOverlayProps {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId?: string;
  /** Center modal (default) or bottom sheet panel. */
  variant?: 'modal' | 'bottom-sheet';
  closeLabel?: string;
  /** Max viewport height fraction for bottom sheets (0–100). */
  maxHeightVh?: number;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
}

function trapFocus(container: HTMLElement, event: KeyboardEvent) {
  if (event.key !== 'Tab') return;
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null,
  );
  if (nodes.length === 0) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/**
 * Accessible overlay primitive: labelled dialog, initial focus, focus trap,
 * Escape-to-close, scroll lock, and focus restoration.
 */
export default function AccessibleOverlay({
  open,
  onClose,
  title,
  titleId: titleIdProp,
  variant = 'modal',
  closeLabel = 'Close',
  maxHeightVh = 80,
  children,
  className = '',
  panelClassName = '',
}: AccessibleOverlayProps) {
  const autoId = useId();
  const titleId = titleIdProp ?? `overlay-title-${autoId}`;
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const handleBackdropClick = useCallback(
    (event: MouseEvent) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) {
        closeRef.current?.focus();
        return;
      }
      const auto = panel.querySelector<HTMLElement>(FOCUSABLE);
      (auto ?? closeRef.current)?.focus();
    }, 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      const panel = panelRef.current;
      if (panel) trapFocus(panel, event);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      body.style.overflow = prevOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
      restoreFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  const backdropMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.18 } };

  const modalPanelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 8 },
        transition: { duration: 0.22, ease: 'easeOut' as const },
      };

  const sheetPanelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12 } }
    : {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        transition: { duration: 0.22, ease: 'easeOut' as const },
      };

  const isSheet = variant === 'bottom-sheet';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 z-[60] flex ${isSheet ? 'items-end' : 'items-center justify-center p-4'} ${className}`}
          role="presentation"
          {...backdropMotion}
        >
          <div
            className={`absolute inset-0 bg-black/50 ${reduceMotion ? '' : 'backdrop-blur-[1px]'}`}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={
              isSheet
                ? `relative flex w-full flex-col border-t border-slate-200 bg-white shadow-2xl dark:border-tactical-border dark:bg-tactical-surface ${panelClassName}`
                : `relative w-full max-h-[90vh] overflow-y-auto ${panelClassName}`
            }
            style={isSheet ? { maxHeight: `${maxHeightVh}vh` } : undefined}
            onClick={(e) => e.stopPropagation()}
            {...(isSheet ? sheetPanelMotion : modalPanelMotion)}
          >
            <span id={titleId} className="sr-only">
              {title}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="sr-only"
            >
              {closeLabel}
            </button>
            {children}
          </motion.div>
          {!isSheet && (
            <div
              className="absolute inset-0 -z-10"
              onClick={handleBackdropClick}
              aria-hidden
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
