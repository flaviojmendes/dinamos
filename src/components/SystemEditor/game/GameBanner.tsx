import { useEffect, useState } from 'react';
import { useTranslation, type UseTranslationResponse } from 'react-i18next';
import {
  Gamepad2,
  Clock,
  Activity,
  Users,
  Flag,
  Layers,
  Hammer,
  Lock,
  Flame,
  ShieldAlert,
  ShieldCheck,
  Pause,
} from 'lucide-react';
import { useGameContext } from './GameContext';
import GameAnnouncement from './GameAnnouncement';
import type { GameState } from './types';
import type { ComplianceResult, ComplianceRuleId } from '../engine/compliance';

function fmtClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

/** Live round-local stats fed by the editor's score accumulator. */
export interface LiveRoundStats {
  score: number;
  streak: number;
  multiplier: number;
}

type TFn = UseTranslationResponse<'translation', undefined>['t'];

/** Short, actionable label for each broken house rule. */
function ruleLabel(t: TFn, rule: ComplianceRuleId): string {
  switch (rule) {
    case 'client_present':
      return t('editor.game.rules.client_present', { defaultValue: 'add a traffic source (client)' });
    case 'database_present':
      return t('editor.game.rules.database_present', { defaultValue: 'keep at least one database' });
    case 'service_present':
      return t('editor.game.rules.service_present', { defaultValue: 'keep at least one app server' });
    case 'path_to_db':
      return t('editor.game.rules.path_to_db', {
        defaultValue: 'every client must reach a database through your service tier',
      });
    case 'cache_miss_path':
      return t('editor.game.rules.cache_miss_path', {
        defaultValue: 'every cache needs a miss path to a database',
      });
    case 'no_client_to_db':
      return t('editor.game.rules.no_client_to_db', {
        defaultValue: 'clients cannot talk to the database directly',
      });
  }
}

function deadlineSec(st: GameState | null | undefined, serverNow: number): number | null {
  if (st?.seconds_until_deadline != null) return st.seconds_until_deadline;
  if (st?.phase === 'round' && st.round_ends_at) {
    return (new Date(st.round_ends_at).getTime() - serverNow) / 1000;
  }
  if (st?.phase === 'interval' && st.interval_ends_at) {
    return (new Date(st.interval_ends_at).getTime() - serverNow) / 1000;
  }
  if (st?.phase === 'lobby' && st.starts_at) {
    return (new Date(st.starts_at).getTime() - serverNow) / 1000;
  }
  return null;
}

/**
 * Match status bar shown above the canvas in game mode: live status, countdown
 * to start, elapsed/remaining match time, broadcast traffic and player count.
 */
export default function GameBanner({
  liveRound,
  compliance,
}: {
  liveRound?: LiveRoundStats;
  compliance?: ComplianceResult;
}) {
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
  const phase = st.phase ?? 'lobby';
  const isLive = phase === 'round';
  const isBuild = phase === 'interval';
  const isPaused = st.is_paused || st.status === 'paused';
  const remaining = deadlineSec(st, serverNow);

  let timeLabel = '';
  let timeValue = '';
  if (isPaused) {
    timeLabel = t('editor.game.paused', { defaultValue: 'Paused' });
    timeValue = remaining != null ? fmtClock(remaining) : '--:--';
  } else if (isLive) {
    timeLabel = t('editor.game.round_time_left', { defaultValue: 'Round time left' });
    timeValue = remaining != null ? fmtClock(remaining) : '--:--';
  } else if (phase === 'lobby') {
    timeLabel = t('editor.game.starts_in', { defaultValue: 'Starts in' });
    timeValue = remaining != null ? fmtClock(remaining) : '--:--';
  } else if (isBuild) {
    timeLabel = t('editor.game.build_time_left', { defaultValue: 'Build time left' });
    timeValue = remaining != null ? fmtClock(remaining) : '--:--';
  } else {
    timeLabel = t('editor.game.status', { defaultValue: 'Status' });
    timeValue = t('editor.game.ended', { defaultValue: 'Ended' });
  }

  const phaseTone = isLive
    ? isPaused
      ? 'text-signal-amber border-signal-amber'
      : 'text-signal-green border-signal-green'
    : phase === 'ended'
    ? 'text-signal-red border-signal-red'
    : 'text-signal-amber border-signal-amber';

  const phaseName = isPaused
    ? t('editor.game.paused', { defaultValue: 'Paused' })
    : isLive
    ? t('editor.game.live', { defaultValue: 'Live' })
    : isBuild
    ? t('editor.game.build', { defaultValue: 'Build' })
    : phase === 'ended'
    ? t('editor.game.ended', { defaultValue: 'Ended' })
    : t('editor.game.lobby', { defaultValue: 'Lobby' });

  const roundsMeta = st.rounds_public ?? [];
  const liveMeta = isLive ? roundsMeta[Math.max(0, st.current_round - 1)] : null;
  const nextMeta = isBuild ? roundsMeta[Math.max(0, st.current_round)] : null;
  const streakActive = isLive && liveRound && liveRound.multiplier > 1 && !isPaused;

  const displayTotal = st.scores_verified
    ? st.my_score
    : st.my_provisional_score ?? st.my_score;
  const showProvisional = !st.scores_verified && isLive;

  return (
    <>
      <GameAnnouncement />
      <div className="tactical-panel p-3 mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-xs">
        <div className="flex items-center gap-2 text-signal-cyan font-semibold">
          <Gamepad2 className="w-4 h-4" />
          {t('editor.game.mode', { defaultValue: 'Game mode' })}
          {st.name && <span className="text-tactical-text font-normal">· {st.name}</span>}
        </div>

        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${phaseTone}`}>
          {isPaused ? (
            <Pause className="w-3.5 h-3.5" />
          ) : phase === 'ended' ? (
            <Flag className="w-3.5 h-3.5" />
          ) : isLive ? (
            <Activity className="w-3.5 h-3.5" />
          ) : (
            <Hammer className="w-3.5 h-3.5" />
          )}
          {phaseName}
        </div>

        {(st.total_rounds ?? 0) > 0 && (
          <div className="flex items-center gap-1.5 text-tactical-dim">
            <Layers className="w-3.5 h-3.5" />
            <span className="text-tactical-label">{t('editor.game.round', { defaultValue: 'Round' })}:</span>
            <span className="text-tactical-text font-bold tabular-nums">
              {Math.max(isLive ? st.current_round : st.current_round + (isBuild ? 1 : 0), 0)}/
              {st.total_rounds}
            </span>
            {liveMeta?.name && <span className="text-tactical-text">· {liveMeta.name}</span>}
            {nextMeta?.name && (
              <span className="text-tactical-label">
                · {t('editor.game.next_round_name', { defaultValue: 'Next: {{name}}', name: nextMeta.name })}
              </span>
            )}
          </div>
        )}

        {streakActive && (
          <div
            title={t('editor.game.streak_hint', {
              defaultValue:
                'SLO streak: keep errors <1% and p95 under target to grow your score multiplier.',
            })}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-signal-amber text-signal-amber font-bold tabular-nums"
          >
            <Flame className="w-3.5 h-3.5" />×{liveRound!.multiplier.toFixed(2)}
            <span className="font-normal text-tactical-label">({liveRound!.streak}s)</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-tactical-dim">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-tactical-label">{timeLabel}:</span>
          <span className="text-tactical-text font-bold tabular-nums">{timeValue}</span>
        </div>

        <div className="flex items-center gap-1.5 text-tactical-dim">
          <Activity className="w-3.5 h-3.5" />
          <span className="text-tactical-label">{t('editor.game.traffic', { defaultValue: 'Traffic' })}:</span>
          <span className="text-tactical-text">{st.load_profile?.type ?? 'constant'}</span>
        </div>

        <div className="flex items-center gap-1.5 text-tactical-dim">
          <Users className="w-3.5 h-3.5" />
          <span className="text-tactical-text">{st.player_count}</span>
          <span className="text-tactical-label">{t('editor.game.players', { defaultValue: 'Players' })}</span>
        </div>

        <div className="flex items-center gap-1.5 ml-auto text-tactical-dim">
          {isLive && liveRound && (
            <>
              <span className="text-tactical-label">{t('editor.game.round_score', { defaultValue: 'Round' })}:</span>
              <span className="text-signal-cyan font-bold tabular-nums">{Math.round(liveRound.score)}</span>
              <span className="text-[10px] text-signal-amber uppercase">
                {t('editor.game.provisional', { defaultValue: 'est.' })}
              </span>
              <span className="text-tactical-label mx-1">·</span>
            </>
          )}
          <span className="text-tactical-label">{t('editor.game.your_score', { defaultValue: 'Your score' })}:</span>
          <span className="text-signal-green font-bold tabular-nums">{Math.round(displayTotal)}</span>
          {showProvisional ? (
            <span
              className="text-[10px] text-signal-amber uppercase"
              title={t('editor.game.provisional_hint', {
                defaultValue: 'Provisional total — verified after the round',
              })}
            >
              {t('editor.game.provisional', { defaultValue: 'est.' })}
            </span>
          ) : st.scores_verified ? (
            <ShieldCheck
              className="w-3.5 h-3.5 text-signal-green"
              aria-label={t('editor.game.verified', { defaultValue: 'Verified score' })}
            />
          ) : null}
        </div>
      </div>

      {compliance && !compliance.ok && phase !== 'ended' && (
        <div
          role="alert"
          className={`mb-3 flex items-start gap-2 rounded-md border px-3 py-2 font-sans text-xs ${
            isLive
              ? 'border-signal-red/60 bg-signal-red/10 text-signal-red'
              : 'border-signal-amber/50 bg-signal-amber/5 text-signal-amber'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">
              {isLive
                ? t('editor.game.compliance_live', {
                    defaultValue: 'Invalid architecture: you are not earning points.',
                  })
                : t('editor.game.compliance_build', {
                    defaultValue: 'Invalid architecture: fix it before the round starts.',
                  })}
            </span>{' '}
            {compliance.violations.map((v) => ruleLabel(t, v)).join(' · ')}
          </div>
        </div>
      )}

      {isLive && (
        <div className="mb-3 flex items-center gap-2 rounded-md border border-signal-amber/50 bg-signal-amber/5 px-3 py-2 font-sans text-xs text-signal-amber">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          {t('editor.game.round_locked', {
            defaultValue:
              'Round in progress: your architecture is locked. Make changes during the build phase.',
          })}
        </div>
      )}
      {isBuild && (
        <div className="mb-3 flex items-center gap-2 rounded-md border border-signal-cyan/50 bg-signal-cyan/5 px-3 py-2 font-sans text-xs text-signal-cyan">
          <Hammer className="w-3.5 h-3.5 shrink-0" />
          {t('editor.game.build_now', {
            defaultValue: 'Build phase: refine your architecture before the next round starts.',
          })}
        </div>
      )}
    </>
  );
}
