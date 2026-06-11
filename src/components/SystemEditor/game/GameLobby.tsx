import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Gamepad2, Clock, Users, Lock, Activity, MonitorPlay } from 'lucide-react';
import { useGameContext } from './GameContext';
import GameLeaderboard from './GameLeaderboard';
import GameAnnouncement from './GameAnnouncement';

function fmtCountdown(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

/** Pre-match waiting room with a live countdown to the start time. */
export default function GameLobby({ currentUserId }: { currentUserId?: string | null }) {
  const { t } = useTranslation();
  const game = useGameContext();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  if (!game?.state) return null;
  const st = game.state;
  const serverNow = now + game.serverOffsetMs;
  const startsMs = st.starts_at ? new Date(st.starts_at).getTime() : null;
  const remaining = startsMs ? (startsMs - serverNow) / 1000 : null;
  const nodeCount = st.starting_architecture?.nodes?.length ?? 0;
  const lockedCount = st.allow_delete_starting ? (st.locked_node_ids?.length ?? 0) : nodeCount;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-1">{t('editor.game.lobby', { defaultValue: 'Match lobby' })}</div>
      <h1 className="text-2xl md:text-3xl font-sans font-bold mb-6 tracking-tight text-slate-900 dark:text-tactical-text flex items-center gap-3">
        <Gamepad2 className="w-7 h-7 text-signal-cyan" />
        {st.name || t('editor.game.untitled_match', { defaultValue: 'Distributed Systems Match' })}
      </h1>

      <GameAnnouncement />

      <div className="tactical-panel p-6 mb-6 text-center">
        <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-2">
          {st.status === 'lobby'
            ? t('editor.game.starts_in', { defaultValue: 'Starts in' })
            : t('editor.game.status', { defaultValue: 'Status' })}
        </div>
        {remaining !== null && st.status === 'lobby' ? (
          <div className="text-5xl md:text-6xl font-mono font-bold text-signal-green tabular-nums">
            {fmtCountdown(remaining)}
          </div>
        ) : (
          <div className="text-2xl font-sans font-bold text-signal-amber">
            {t('editor.game.waiting_host', { defaultValue: 'Waiting for the host to start…' })}
          </div>
        )}
        <div className="mt-3 font-sans text-xs text-tactical-dim">
          {t('editor.game.lobby_hint', {
            defaultValue:
              'The match begins automatically. Build and optimize your system to climb the leaderboard.',
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="tactical-panel p-4 flex items-center gap-3">
          <Users className="w-5 h-5 text-signal-cyan" />
          <div>
            <div className="font-mono text-xl font-bold text-tactical-text tabular-nums">{st.player_count}</div>
            <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t('editor.game.players', { defaultValue: 'Players' })}</div>
          </div>
        </div>
        <div className="tactical-panel p-4 flex items-center gap-3">
          <Activity className="w-5 h-5 text-signal-amber" />
          <div>
            <div className="font-sans text-xl font-bold text-tactical-text capitalize">{st.load_profile?.type ?? 'constant'}</div>
            <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t('editor.game.traffic', { defaultValue: 'Traffic' })}</div>
          </div>
        </div>
        <div className="tactical-panel p-4 flex items-center gap-3">
          <Lock className="w-5 h-5 text-signal-red" />
          <div>
            <div className="font-mono text-xl font-bold text-tactical-text tabular-nums">{lockedCount}/{nodeCount}</div>
            <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t('editor.game.locked_components', { defaultValue: 'Locked parts' })}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2 font-sans text-xs text-tactical-dim">
        <Clock className="w-3.5 h-3.5" />
        {t('editor.game.joined_players', { defaultValue: 'Players in the lobby' })}
        <Link
          to={`/editor/game/${st.code}/stage`}
          target="_blank"
          className="ml-auto inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-tactical-border text-tactical-dim hover:border-signal-amber hover:text-signal-amber transition-colors"
        >
          <MonitorPlay className="w-3.5 h-3.5" />
          {t('editor.game.open_stage', { defaultValue: 'Audience screen' })}
        </Link>
      </div>
      <GameLeaderboard entries={game.leaderboard} currentUserId={currentUserId} />
    </div>
  );
}
