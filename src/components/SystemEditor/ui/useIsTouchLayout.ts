import { useEffect, useState } from 'react';

/**
 * Returns true when the editor should render its touch-friendly layout:
 * either a coarse pointer (phones / tablets) or a viewport narrower than the
 * desktop breakpoint. Using `pointer: coarse` (not width alone) keeps a desktop
 * PC on the desktop layout even when its window is narrow.
 */
const QUERY = '(pointer: coarse), (max-width: 1023px)';

function evaluate(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

export function useIsTouchLayout(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(evaluate);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mql = window.matchMedia(QUERY);
    const onChange = () => setIsTouch(mql.matches);
    onChange();
    // Safari < 14 only supports addListener/removeListener.
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  return isTouch;
}

export default useIsTouchLayout;
