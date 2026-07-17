import { useTranslation } from 'react-i18next';
import { Trophy, ShieldCheck, CircleHelp } from 'lucide-react';
import BottomSheet from '../ui/BottomSheet';
import { LeaderboardEntry } from './types';

function medal(rank: number): string {
  if (rank === 1) return 'text-yellow-300';
  if (rank === 2) return 'text-slate-300';
  if (rank === 3) return 'text-amber-500';
  return 'text-tactical-dim';
}

function LeaderboardRows({
  entries,
  currentUserId,
  compact,
  scoresVerified,
}: {
  entries: LeaderboardEntry[];
  currentUserId?: string | null;
  compact?: boolean;
  scoresVerified?: boolean;
}) {
  const { t } = useTranslation();

  if (entries.length === 0) {
    return (
      <div className="px-3 py-3 font-sans text-[11px] text-tactical-label">
        {t('editor.game.no_players', { defaultValue: 'No players yet.' })}
      </div>
    );
  }

  return (
    <>
      {entries.map((e) => {
        const isMe = currentUserId && e.user_id === currentUserId;
        const verified = e.verified ?? scoresVerified;
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
              {isMe && (
                <span className="text-signal-cyan">
                  {' '}
                  ({t('editor.game.you', { defaultValue: 'you' })})
                </span>
              )}
            </span>
            {verified === false && (
              <span
                className="shrink-0 text-[9px] uppercase tracking-wide text-signal-amber"
                title={t('editor.game.provisional_hint', {
                  defaultValue: 'Provisional score — verified after the round',
                })}
              >
                {t('editor.game.provisional', { defaultValue: 'est.' })}
              </span>
            )}
            {verified === true && (
              <ShieldCheck
                className="w-3 h-3 text-signal-green shrink-0"
                aria-label={t('editor.game.verified', { defaultValue: 'Verified score' })}
              />
            )}
            <span className="font-mono text-signal-green font-bold tabular-nums">
              {Math.round(e.score)}
            </span>
          </div>
        );
      })}
      {!scoresVerified && entries.length > 0 && (
        <div className="px-3 py-2 font-sans text-[10px] text-tactical-label flex items-center gap-1.5">
          <CircleHelp className="w-3 h-3 shrink-0" />
          {t('editor.game.leaderboard_provisional_note', {
            defaultValue: 'Live scores are provisional until the server verifies them.',
          })}
        </div>
      )}
    </>
  );
}

/** Live ranked list of players, highlighting the current user. */
export default function GameLeaderboard({
  entries,
  currentUserId,
  compact = false,
  scoresVerified,
  mobileRankChip,
  mobileSheetOpen,
  onMobileSheetOpen,
  onMobileSheetClose,
}: {
  entries: LeaderboardEntry[];
  currentUserId?: string | null;
  compact?: boolean;
  scoresVerified?: boolean;
  /** Touch layout: show a fixed rank chip that opens the sheet. */
  mobileRankChip?: boolean;
  mobileSheetOpen?: boolean;
  onMobileSheetOpen?: () => void;
  onMobileSheetClose?: () => void;
}) {
  const { t } = useTranslation();
  const myEntry = currentUserId
    ? entries.find((e) => e.user_id === currentUserId) ?? null
    : null;

  return (
    <>
      {mobileRankChip && myEntry && (
        <button
          type="button"
          onClick={onMobileSheetOpen}
          aria-label={t('editor.game.open_leaderboard', {
            defaultValue: 'Open leaderboard. You are rank {{rank}}.',
            rank: myEntry.rank,
          })}
          className="fixed bottom-20 left-3 z-30 inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-signal-cyan/60 bg-tactical-surface/95 text-signal-cyan font-sans text-xs font-bold shadow-lg backdrop-blur-sm"
        >
          <Trophy className="w-3.5 h-3.5" />
          #{myEntry.rank}
          <span className="font-mono tabular-nums text-signal-green">{Math.round(myEntry.score)}</span>
          {!scoresVerified && (
            <span className="text-[9px] font-normal text-signal-amber uppercase">
              {t('editor.game.provisional', { defaultValue: 'est.' })}
            </span>
          )}
        </button>
      )}

      {mobileRankChip ? (
        <BottomSheet
          open={!!mobileSheetOpen}
          onClose={() => onMobileSheetClose?.()}
          title={t('editor.game.leaderboard', { defaultValue: 'Leaderboard' })}
        >
          <LeaderboardRows
            entries={entries}
            currentUserId={currentUserId}
            compact={compact}
            scoresVerified={scoresVerified}
          />
        </BottomSheet>
      ) : (
        <div className="bg-white/95 dark:bg-tactical-surface/95 border border-slate-200 dark:border-tactical-border rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-tactical-border font-sans text-[11px] font-medium text-slate-600 dark:text-signal-amber">
            <Trophy className="w-3.5 h-3.5" />
            {t('editor.game.leaderboard', { defaultValue: 'Leaderboard' })}
            {scoresVerified && (
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-signal-green">
                <ShieldCheck className="w-3 h-3" />
                {t('editor.game.verified', { defaultValue: 'Verified' })}
              </span>
            )}
          </div>
          <div className={`${compact ? 'max-h-64' : 'max-h-80'} overflow-y-auto`}>
            <LeaderboardRows
              entries={entries}
              currentUserId={currentUserId}
              compact={compact}
              scoresVerified={scoresVerified}
            />
          </div>
        </div>
      )}
    </>
  );
}
