import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGameContext } from './GameContext';

/** Visible join/sync/offline errors with manual retry. */
export default function GameSyncAlerts() {
  const { t } = useTranslation();
  const game = useGameContext();
  if (!game) return null;

  const messages: { key: string; text: string; retry?: () => void; tone: 'warn' | 'error' }[] = [];

  if (game.isOffline) {
    messages.push({
      key: 'offline',
      text: t('editor.game.offline', {
        defaultValue: 'You are offline. Match sync will resume when you reconnect.',
      }),
      tone: 'warn',
    });
  }
  if (game.joinStatus === 'error' && game.error) {
    messages.push({
      key: 'join',
      text: game.error,
      retry: game.retryJoin,
      tone: 'error',
    });
  } else if (game.syncStatus === 'error' && game.error) {
    messages.push({
      key: 'sync',
      text: game.error,
      retry: game.retrySync,
      tone: 'error',
    });
  } else if (game.syncStatus === 'stale') {
    messages.push({
      key: 'stale',
      text: t('editor.game.sync_stale', {
        defaultValue: 'Match state may be stale. Tap retry to refresh.',
      }),
      retry: game.retrySync,
      tone: 'warn',
    });
  }
  if (game.leaderboardError) {
    messages.push({
      key: 'lb',
      text: game.leaderboardError,
      retry: game.retrySync,
      tone: 'warn',
    });
  }
  if (game.scoreSyncError) {
    messages.push({
      key: 'score',
      text: game.scoreSyncError,
      retry: game.retrySync,
      tone: 'warn',
    });
  }

  if (messages.length === 0) return null;

  return (
    <div className="space-y-2 mb-3">
      {messages.map((m) => (
        <div
          key={m.key}
          role="alert"
          className={`flex items-start gap-2 rounded-md border px-3 py-2 font-sans text-xs ${
            m.tone === 'error'
              ? 'border-signal-red/60 bg-signal-red/10 text-signal-red'
              : 'border-signal-amber/50 bg-signal-amber/5 text-signal-amber'
          }`}
        >
          {m.key === 'offline' ? (
            <WifiOff className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          )}
          <span className="flex-1">{m.text}</span>
          {m.retry && (
            <button
              type="button"
              onClick={() => m.retry?.()}
              className="inline-flex items-center gap-1 shrink-0 font-medium underline hover:no-underline"
            >
              <RefreshCw className="w-3 h-3" />
              {t('editor.game.retry', { defaultValue: 'Retry' })}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
