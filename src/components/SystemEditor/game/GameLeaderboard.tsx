import { useTranslation } from 'react-i18next';
import { Trophy } from 'lucide-react';
import { LeaderboardEntry } from './types';

function medal(rank: number): string {
  if (rank === 1) return 'text-yellow-300';
  if (rank === 2) return 'text-slate-300';
  if (rank === 3) return 'text-amber-500';
  return 'text-tactical-dim';
}

/** Live ranked list of players, highlighting the current user. */
export default function GameLeaderboard({
  entries,
  currentUserId,
  compact = false,
}: {
  entries: LeaderboardEntry[];
  currentUserId?: string | null;
  compact?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="bg-white/95 dark:bg-tactical-surface/95 border border-slate-200 dark:border-tactical-border rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-tactical-border font-sans text-[11px] font-medium text-slate-600 dark:text-signal-amber">
        <Trophy className="w-3.5 h-3.5" />
        {t('editor.game.leaderboard', { defaultValue: 'Leaderboard' })}
      </div>
      <div className={`${compact ? 'max-h-64' : 'max-h-80'} overflow-y-auto`}>
        {entries.length === 0 ? (
          <div className="px-3 py-3 font-sans text-[11px] text-tactical-label">
            {t('editor.game.no_players', { defaultValue: 'No players yet.' })}
          </div>
        ) : (
          entries.map((e) => {
            const isMe = currentUserId && e.user_id === currentUserId;
            return (
              <div
                key={e.user_id}
                className={`flex items-center gap-2 px-3 py-1.5 font-sans text-[11px] border-b border-slate-100 dark:border-tactical-line/50 ${
                  isMe ? 'bg-signal-cyan/10' : ''
                }`}
              >
                <span className={`w-5 text-right font-bold ${medal(e.rank)}`}>{e.rank}</span>
                {e.avatar_image ? (
                  <img src={e.avatar_image} alt="" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-tactical-line inline-flex items-center justify-center text-[9px] text-tactical-dim">
                    {(e.nickname ?? '?').slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="truncate flex-1 text-tactical-text">
                  {e.nickname ?? t('editor.game.anon', { defaultValue: 'Anonymous' })}
                  {isMe && <span className="text-signal-cyan"> ({t('editor.game.you', { defaultValue: 'you' })})</span>}
                </span>
                <span className="font-mono text-signal-green font-bold tabular-nums">{Math.round(e.score)}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
