import { useEffect, useState } from 'react';

/** Shared app/editor/challenge desktop breakpoint (Tailwind `lg`). */
export const APP_BREAKPOINT_PX = 1024;

const TOUCH_LAYOUT_QUERY = `(pointer: coarse), (max-width: ${APP_BREAKPOINT_PX - 1}px)`;
const COMPACT_QUERY = `(max-width: ${APP_BREAKPOINT_PX - 1}px)`;

function matchQuery(query: string): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(query).matches;
}

function subscribe(query: string, onChange: () => void): () => void {
  const mql = window.matchMedia(query);
  onChange();
  if (mql.addEventListener) {
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }
  mql.addListener(onChange);
  return () => mql.removeListener(onChange);
}

export interface AppBreakpoint {
  /** Viewport narrower than the shared desktop breakpoint. */
  isCompact: boolean;
  /** Touch-first layout (coarse pointer or compact viewport). */
  isTouchLayout: boolean;
}

export function useAppBreakpoint(): AppBreakpoint {
  const [state, setState] = useState<AppBreakpoint>(() => ({
    isCompact: matchQuery(COMPACT_QUERY),
    isTouchLayout: matchQuery(TOUCH_LAYOUT_QUERY),
  }));

  useEffect(() => {
    const sync = () =>
      setState({
        isCompact: matchQuery(COMPACT_QUERY),
        isTouchLayout: matchQuery(TOUCH_LAYOUT_QUERY),
      });
    const offCompact = subscribe(COMPACT_QUERY, sync);
    const offTouch = subscribe(TOUCH_LAYOUT_QUERY, sync);
    return () => {
      offCompact();
      offTouch();
    };
  }, []);

  return state;
}

export default useAppBreakpoint;
