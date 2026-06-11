// Between-round results and final standings. When a round ends the player gets
// an immediate debrief (round score, what earned and what cost points, current
// rank); when the match ends, a podium with the final top three and full
// standings. Data streams in via the normal polling, so values refresh live
// while the overlay is open.

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Trophy, X, Flame, Activity, ShieldCheck, ShieldAlert, Timer, DollarSign, Medal } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useGameContext } from './GameContext';

interface BreakdownLike {
  throughput?: number;
  availability?: number;
  latencyPenalty?: number;
  costPenalty?: number;
  bonus?: number;
  bestStreak?: number;
  nonCompliantTicks?: number;
}

function Row({
  icon: Icon,
  label,
  value,
  tone = 'text-tactical-text',
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 border-b border-tactical-line/50 last:border-0">
      <span className="flex items-center gap-2 font-sans text-xs text-tactical-dim">
        <Icon className="w-3.5 h-3.5" /> {label}
      </span>
      <span className={`font-mono text-sm font-bold tabular-nums ${tone}`}>{value}</span>
    </div>
  );
}

const medalTone = ['text-yellow-300', 'text-slate-300', 'text-amber-500'];

export default function RoundResults() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const game = useGameContext();
  const reduceMotion = useReducedMotion();

  // Which round's results are open (1-based), or 'final', or null.
  const [open, setOpen] = useState<number | 'final' | null>(null);
  const prevPhaseRef = useRef<string | null>(null);
  const shownFinalRef = useRef(false);

  const st = game?.state ?? null;
  const phase = st?.phase ?? null;

  useEffect(() => {
    const prev = prevPhaseRef.current;
    prevPhaseRef.current = phase;
    if (!st || prev === null || prev === phase) return;
    if (prev === 'round' && phase === 'interval') {
      setOpen(st.current_round);
    } else if (phase === 'ended' && !shownFinalRef.current) {
      shownFinalRef.current = true;
      setOpen('final');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (!st || open === null) return null;

  const leaderboard = game?.leaderboard ?? [];
  const myEntry = leaderboard.find((e) => e.user_id === user?.uid) ?? null;
  const isFinal = open === 'final';
  const roundIdx = isFinal ? null : (open as number) - 1;
  const roundScore = roundIdx !== null ? st.my_round_scores?.[String(roundIdx)] : null;
  const bd = (roundScore?.breakdown ?? {}) as BreakdownLike;
  const meta = roundIdx !== null ? st.rounds_public?.[roundIdx] : null;
  const nextMeta = roundIdx !== null ? st.rounds_public?.[roundIdx + 1] : null;
  const top = leaderboard.slice(0, 3);

  return (
    <AnimatePresence>
      <motion.div
        key={String(open)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        onClick={() => setOpen(null)}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="tactical-panel w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-sans text-[11px] font-medium text-signal-cyan mb-1">
                {isFinal
                  ? t('editor.game.results.final_title', { defaultValue: 'Final standings' })
                  : t('editor.game.results.round_title', { defaultValue: 'Round {{n}} results', n: open })}
              </div>
              <div className="font-sans text-xl font-bold text-tactical-text tracking-tight">
                {isFinal
                  ? st.name ?? t('editor.game.untitled_match', { defaultValue: 'Distributed Systems Match' })
                  : meta?.name ?? t('editor.game.round', { defaultValue: 'Round' }) + ` ${open}`}
              </div>
            </div>
            <button
              onClick={() => setOpen(null)}
              className="text-tactical-dim hover:text-tactical-text transition-colors"
              aria-label={t('editor.game.results.close', { defaultValue: 'Close results' })}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Podium (final) or my-round summary. */}
          {isFinal ? (
            <div className="mb-5">
              <div className="flex items-end justify-center gap-3 mb-4">
                {[1, 0, 2].map((pos) => {
                  const e = top[pos];
                  if (!e) return <div key={pos} className="w-24" />;
                  const heights = ['h-24', 'h-16', 'h-12'];
                  return (
                    <motion.div
                      key={e.user_id}
                      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduceMotion ? 0 : 0.15 * (2 - pos), duration: 0.3, ease: 'easeOut' }}
                      className="flex flex-col items-center w-24"
                    >
                      {e.avatar_image ? (
                        <img src={e.avatar_image} alt="" className="w-10 h-10 rounded-full object-cover mb-1" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-tactical-raised mb-1 flex items-center justify-center font-sans text-sm text-tactical-dim">
                          {(e.nickname ?? '?').slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div className="font-sans text-xs text-tactical-text truncate w-full text-center mb-1">
                        {e.nickname ?? t('editor.game.anon', { defaultValue: 'Anonymous' })}
                      </div>
                      <div className={`w-full ${heights[pos]} rounded-t-md bg-tactical-raised border border-tactical-border flex flex-col items-center justify-center`}>
                        <Medal className={`w-4 h-4 ${medalTone[pos]}`} />
                        <span className="font-mono text-sm font-bold text-tactical-text tabular-nums">{Math.round(e.score)}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {myEntry && (
                <div className="text-center font-sans text-sm text-tactical-dim mb-2">
                  {t('editor.game.results.you_finished', { defaultValue: 'You finished #{{rank}} with {{score}} points', rank: myEntry.rank, score: Math.round(myEntry.score) })}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-mono text-4xl font-bold text-signal-green tabular-nums">
                  {Math.round(roundScore?.score ?? 0)}
                </span>
                <span className="font-sans text-xs text-tactical-label">
                  {t('editor.game.results.points', { defaultValue: 'points' })}
                </span>
                {myEntry && (
                  <span className="ml-auto font-sans text-sm text-tactical-dim">
                    {t('editor.game.results.rank_now', { defaultValue: 'Rank' })}{' '}
                    <span className="font-mono font-bold text-tactical-text">#{myEntry.rank}</span>
                  </span>
                )}
              </div>

              <div className="mb-4">
                <Row icon={Activity} label={t('editor.game.throughput', { defaultValue: 'Throughput' })} value={`+${Math.round(bd.throughput ?? 0)}`} tone="text-signal-green" />
                <Row icon={ShieldCheck} label={t('editor.game.availability', { defaultValue: 'Availability' })} value={`+${Math.round(bd.availability ?? 0)}`} tone="text-signal-green" />
                {(bd.bonus ?? 0) > 0 && (
                  <Row
                    icon={Flame}
                    label={t('editor.game.results.streak_bonus', { defaultValue: 'SLO streak bonus (best {{sec}}s)', sec: bd.bestStreak ?? 0 })}
                    value={`+${Math.round(bd.bonus ?? 0)}`}
                    tone="text-signal-amber"
                  />
                )}
                <Row icon={Timer} label={t('editor.game.results.latency_penalty', { defaultValue: 'Latency penalty' })} value={`-${Math.round(bd.latencyPenalty ?? 0)}`} tone={(bd.latencyPenalty ?? 0) > 0 ? 'text-signal-red' : 'text-tactical-dim'} />
                <Row icon={DollarSign} label={t('editor.game.results.cost_penalty', { defaultValue: 'Cost penalty' })} value={`-${Math.round(bd.costPenalty ?? 0)}`} tone={(bd.costPenalty ?? 0) > 0 ? 'text-signal-red' : 'text-tactical-dim'} />
                {(bd.nonCompliantTicks ?? 0) > 0 && (
                  <Row
                    icon={ShieldAlert}
                    label={t('editor.game.results.non_compliant', { defaultValue: 'Time with an invalid architecture (no points)' })}
                    value={`${bd.nonCompliantTicks}s`}
                    tone="text-signal-red"
                  />
                )}
              </div>

              {nextMeta && (
                <div className="mb-4 rounded-md border border-signal-cyan/40 bg-signal-cyan/5 px-3 py-2">
                  <div className="font-sans text-[11px] font-medium text-signal-cyan mb-0.5">
                    {t('editor.game.results.up_next', { defaultValue: 'Up next: {{name}}', name: nextMeta.name ?? `${t('editor.game.round', { defaultValue: 'Round' })} ${(roundIdx ?? 0) + 2}` })}
                  </div>
                  {nextMeta.story && (
                    <p className="font-sans text-[11px] leading-relaxed text-tactical-dim">{nextMeta.story}</p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Top standings list. */}
          <div className="border border-tactical-border rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-tactical-border font-sans text-[11px] font-medium text-signal-amber">
              <Trophy className="w-3.5 h-3.5" />
              {t('editor.game.leaderboard', { defaultValue: 'Leaderboard' })}
            </div>
            <div className="max-h-48 overflow-y-auto">
              {leaderboard.slice(0, 10).map((e) => {
                const isMe = e.user_id === user?.uid;
                return (
                  <div
                    key={e.user_id}
                    className={`flex items-center gap-2 px-3 py-1.5 font-sans text-xs border-b border-tactical-line/50 last:border-0 ${isMe ? 'bg-signal-cyan/10' : ''}`}
                  >
                    <span className={`w-6 text-right font-mono font-bold ${e.rank <= 3 ? medalTone[e.rank - 1] : 'text-tactical-dim'}`}>{e.rank}</span>
                    <span className="truncate flex-1 text-tactical-text">
                      {e.nickname ?? t('editor.game.anon', { defaultValue: 'Anonymous' })}
                      {isMe && <span className="text-signal-cyan"> ({t('editor.game.you', { defaultValue: 'you' })})</span>}
                    </span>
                    <span className="font-mono font-bold text-signal-green tabular-nums">{Math.round(e.score)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setOpen(null)}
            className="mt-4 w-full px-4 py-2 font-sans text-sm rounded-md border border-signal-cyan text-signal-cyan hover:bg-signal-cyan/10 transition-colors"
          >
            {isFinal
              ? t('editor.game.results.close_final', { defaultValue: 'Close standings' })
              : t('editor.game.results.back_to_build', { defaultValue: 'Back to building' })}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
