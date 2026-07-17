import { useAppBreakpoint } from '../../../hooks/useAppBreakpoint';

export { APP_BREAKPOINT_PX, useAppBreakpoint } from '../../../hooks/useAppBreakpoint';

/**
 * Returns true when the editor should render its touch-friendly layout:
 * either a coarse pointer (phones / tablets) or a viewport narrower than the
 * shared desktop breakpoint.
 */
export function useIsTouchLayout(): boolean {
  return useAppBreakpoint().isTouchLayout;
}

export default useIsTouchLayout;
