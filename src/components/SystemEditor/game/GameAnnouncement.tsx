import { useEffect, useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { useGameContext } from './GameContext';

/**
 * Shows the latest admin broadcast to the player. Dismissible, but re-appears
 * automatically when the admin sends a newer announcement (tracked by its
 * timestamp).
 */
export default function GameAnnouncement() {
  const game = useGameContext();
  const [dismissedAt, setDismissedAt] = useState<string | null>(null);

  const message = game?.state?.announcement ?? null;
  const at = game?.state?.announcement_at ?? null;

  // Reset the dismissal whenever a newer announcement arrives.
  useEffect(() => {
    if (at && dismissedAt && at !== dismissedAt) setDismissedAt(null);
  }, [at, dismissedAt]);

  if (!message || !at || dismissedAt === at) return null;

  return (
    <div className="tactical-panel border-l-2 border-signal-amber p-3 mb-3 flex items-start gap-3 font-sans text-xs">
      <Megaphone className="w-4 h-4 text-signal-amber shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="inline-block rounded-full bg-amber-100 dark:bg-signal-amber/10 px-2 py-0.5 text-[10px] font-medium text-signal-amber mb-1">Host</div>
        <div className="text-tactical-text whitespace-pre-wrap break-words">{message}</div>
      </div>
      <button
        onClick={() => setDismissedAt(at)}
        className="text-tactical-dim hover:text-signal-red transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
