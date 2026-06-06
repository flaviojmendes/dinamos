import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Gamepad2, Clock, Activity, Users, Flag } from 'lucide-react';
import { useGameContext } from './GameContext';
import GameAnnouncement from './GameAnnouncement';

function fmtClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

/**
 * Match status bar shown above the canvas in game mode: live status, countdown
 * to start, elapsed/remaining match time, broadcast traffic and player count.
 */
export default function GameBanner() {
  const { t } = useTranslation();
  const game = useGameContext();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  if (!game?.state) return null;
  const st = game.state;
  const serverNow = now + game.serverOffsetMs;

  let phaseLabel = '';
  let phaseValue = '';
  if (st.status === 'lobby') {
    const startsMs = st.starts_at ? new Date(st.starts_at).getTime() : null;
    phaseLabel = t('editor.game.starts_in', { defaultValue: 'Starts in' });
    phaseValue = startsMs ? fmtClock((startsMs - serverNow) / 1000) : '--:--';
  } else if (st.status === 'running') {
    const startedMs = st.started_at ? new Date(st.started_at).getTime() : null;
    const endsMs = st.ends_at ? new Date(st.ends_at).getTime() : null;
    if (endsMs) {
      phaseLabel = t('editor.game.time_left', { defaultValue: 'Time left' });
      phaseValue = fmtClock((endsMs - serverNow) / 1000);
    } else {
      phaseLabel = t('editor.game.elapsed', { defaultValue: 'Elapsed' });
      phaseValue = startedMs ? fmtClock((serverNow - startedMs) / 1000) : '0:00';
    }
  } else if (st.status === 'paused') {
    phaseLabel = t('editor.game.status', { defaultValue: 'Status' });
    phaseValue = t('editor.game.paused', { defaultValue: 'Paused' });
  } else {
    phaseLabel = t('editor.game.status', { defaultValue: 'Status' });
    phaseValue = t('editor.game.ended', { defaultValue: 'Ended' });
  }

  const statusTone =
    st.status === 'running'
      ? 'text-signal-green border-signal-green'
      : st.status === 'ended'
      ? 'text-signal-red border-signal-red'
      : 'text-signal-amber border-signal-amber';

  return (
    <>
    <GameAnnouncement />
    <div className="tactical-panel p-3 mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs">
      <div className="flex items-center gap-2 text-signal-cyan font-bold uppercase tracking-wider">
        <Gamepad2 className="w-4 h-4" />
        {t('editor.game.mode', { defaultValue: 'Game Mode' })}
        {st.name && <span className="text-tactical-text normal-case">· {st.name}</span>}
      </div>

      <div className={`flex items-center gap-1.5 px-2 py-0.5 border ${statusTone} uppercase tracking-wider`}>
        {st.status === 'ended' ? <Flag className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
        {st.status}
      </div>

      <div className="flex items-center gap-1.5 text-tactical-dim">
        <Clock className="w-3.5 h-3.5" />
        <span className="text-tactical-label">{phaseLabel}:</span>
        <span className="text-tactical-text font-bold tabular-nums">{phaseValue}</span>
      </div>

      <div className="flex items-center gap-1.5 text-tactical-dim">
        <Activity className="w-3.5 h-3.5" />
        <span className="text-tactical-label">{t('editor.game.traffic', { defaultValue: 'Traffic' })}:</span>
        <span className="text-tactical-text">{st.load_profile?.type ?? 'constant'}</span>
      </div>

      <div className="flex items-center gap-1.5 text-tactical-dim">
        <Users className="w-3.5 h-3.5" />
        <span className="text-tactical-text">{st.player_count}</span>
        <span className="text-tactical-label">{t('editor.game.players', { defaultValue: 'players' })}</span>
      </div>

      <div className="flex items-center gap-1.5 ml-auto text-tactical-dim">
        <span className="text-tactical-label">{t('editor.game.your_score', { defaultValue: 'Your score' })}:</span>
        <span className="text-signal-green font-bold tabular-nums">{Math.round(st.my_score)}</span>
      </div>
    </div>
    </>
  );
}
