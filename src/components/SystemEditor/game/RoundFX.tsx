// Live-round theatrics layered over the editor in game mode:
//  - a splash when a round goes live (name + scenario story) and when it ends
//  - chaos telegraphs: "incoming in Ns" warnings and "active" banners, so a
//    failure is an event players see coming and react to, not a silent dip
//  - a final-10-seconds countdown
//  - rank-change toasts ("You're #2 ▲") while the round is live
// Everything is non-interactive (pointer-events-none) and respects reduced
// motion via framer-motion's useReducedMotion.

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Zap, Timer, Unplug, Flag, Play, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useGameContext } from './GameContext';
import { ChaosEvent } from '../engine/scenarios';

interface Splash {
  kind: 'start' | 'over';
  round: number;
  name: string | null;
  story: string | null;
}

interface RankToast {
  id: number;
  rank: number;
  direction: 'up' | 'down';
}

function chaosIcon(type: ChaosEvent['type']) {
  if (type === 'killNode') return Zap;
  if (type === 'latencyInjection') return Timer;
  return Unplug;
}

export default function RoundFX({ nodeLabels }: { nodeLabels: Record<string, string> }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const game = useGameContext();
  const reduceMotion = useReducedMotion();
  const [now, setNow] = useState(Date.now());
  const [splash, setSplash] = useState<Splash | null>(null);
  const [rankToasts, setRankToasts] = useState<RankToast[]>([]);
  const prevPhaseRef = useRef<string | null>(null);
  const prevRankRef = useRef<number | null>(null);
  const toastIdRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const st = game?.state ?? null;
  const phase = st?.phase ?? null;
  const currentRound = st?.current_round ?? 0;

  // Round start / end splash.
  useEffect(() => {
    const prev = prevPhaseRef.current;
    prevPhaseRef.current = phase;
    if (!st || prev === null || prev === phase) return;
    const meta = st.rounds_public?.[Math.max(0, currentRound - 1)] ?? null;
    if (phase === 'round') {
      setSplash({ kind: 'start', round: currentRound, name: meta?.name ?? null, story: meta?.story ?? null });
    } else if (prev === 'round' && phase === 'interval') {
      setSplash({ kind: 'over', round: currentRound, name: meta?.name ?? null, story: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentRound]);

  useEffect(() => {
    if (!splash) return;
    const id = setTimeout(() => setSplash(null), splash.kind === 'start' ? 3500 : 2200);
    return () => clearTimeout(id);
  }, [splash]);

  // Rank-change toasts while the round is live.
  const myRank = game?.leaderboard?.find((e) => e.user_id === user?.uid)?.rank ?? null;
  useEffect(() => {
    const prev = prevRankRef.current;
    prevRankRef.current = myRank;
    if (phase !== 'round' || myRank === null || prev === null || prev === myRank) return;
    const toast: RankToast = {
      id: ++toastIdRef.current,
      rank: myRank,
      direction: myRank < prev ? 'up' : 'down',
    };
    setRankToasts((ts) => [...ts.slice(-2), toast]);
    const id = setTimeout(
      () => setRankToasts((ts) => ts.filter((x) => x.id !== toast.id)),
      3000,
    );
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myRank, phase]);

  if (!st) return null;

  const serverNow = now + (game?.serverOffsetMs ?? 0);
  const isLive = phase === 'round';
  const roundStartedMs = st.round_started_at ? new Date(st.round_started_at).getTime() : null;
  const roundEndsMs = st.round_ends_at ? new Date(st.round_ends_at).getTime() : null;
  const elapsed = isLive && roundStartedMs ? (serverNow - roundStartedMs) / 1000 : null;
  const remaining =
    st.seconds_until_deadline ??
    (isLive && roundEndsMs ? (roundEndsMs - serverNow) / 1000 : null);

  // Chaos telegraphs: events arriving within 6s, and currently active ones.
  const chaosNotices: { ev: ChaosEvent; mode: 'incoming' | 'active'; sec: number }[] = [];
  if (isLive && elapsed !== null) {
    for (const ev of (st.chaos_events ?? []) as ChaosEvent[]) {
      const until = ev.startSec - elapsed;
      if (until > 0 && until <= 6) {
        chaosNotices.push({ ev, mode: 'incoming', sec: Math.ceil(until) });
      } else if (elapsed >= ev.startSec && elapsed < ev.startSec + ev.durationSec) {
        chaosNotices.push({ ev, mode: 'active', sec: Math.ceil(ev.startSec + ev.durationSec - elapsed) });
      }
    }
  }

  const finalCountdown = remaining !== null && remaining > 0 && remaining <= 10 ? Math.ceil(remaining) : null;

  const label = (id: string) => nodeLabels[id] ?? id;
  const chaosText = (n: { ev: ChaosEvent; mode: 'incoming' | 'active'; sec: number }) => {
    const target = label(n.ev.targetId);
    if (n.mode === 'incoming') {
      if (n.ev.type === 'killNode')
        return t('editor.game.fx.kill_incoming', { defaultValue: '{{target}} goes down in {{sec}}s', target, sec: n.sec });
      if (n.ev.type === 'latencyInjection')
        return t('editor.game.fx.slow_incoming', { defaultValue: '{{target}} slowdown in {{sec}}s', target, sec: n.sec });
      return t('editor.game.fx.partition_incoming', { defaultValue: '{{target}} network partition in {{sec}}s', target, sec: n.sec });
    }
    if (n.ev.type === 'killNode')
      return t('editor.game.fx.kill_active', { defaultValue: '{{target}} is DOWN · {{sec}}s remaining', target, sec: n.sec });
    if (n.ev.type === 'latencyInjection')
      return t('editor.game.fx.slow_active', { defaultValue: '{{target}} degraded · {{sec}}s remaining', target, sec: n.sec });
    return t('editor.game.fx.partition_active', { defaultValue: '{{target}} partitioned · {{sec}}s remaining', target, sec: n.sec });
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-40" aria-live="polite">
      {/* Chaos telegraph toasts (top center). */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <AnimatePresence>
          {chaosNotices.map((n) => {
            const Icon = chaosIcon(n.ev.type);
            const toneCls =
              n.mode === 'incoming'
                ? 'border-signal-amber text-signal-amber bg-tactical-surface/95'
                : 'border-signal-red text-signal-red bg-tactical-surface/95';
            return (
              <motion.div
                key={`${n.ev.id}-${n.mode}`}
                initial={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 font-sans text-xs font-medium shadow-lg backdrop-blur-sm ${toneCls}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${n.mode === 'active' && !reduceMotion ? 'animate-pulse' : ''}`} />
                {chaosText(n)}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Rank-change toasts (right side). */}
      <div className="absolute top-24 right-4 flex flex-col items-end gap-2">
        <AnimatePresence>
          {rankToasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduceMotion ? 0 : 16 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 font-sans text-xs font-bold shadow-lg bg-tactical-surface/95 backdrop-blur-sm ${
                toast.direction === 'up' ? 'border-signal-green text-signal-green' : 'border-signal-red text-signal-red'
              }`}
            >
              {toast.direction === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {toast.direction === 'up'
                ? t('editor.game.fx.rank_up', { defaultValue: "You're #{{rank}}", rank: toast.rank })
                : t('editor.game.fx.rank_down', { defaultValue: 'Dropped to #{{rank}}', rank: toast.rank })}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Final 10-second countdown (bottom center). */}
      <AnimatePresence>
        {finalCountdown !== null && (
          <motion.div
            key={finalCountdown}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <span
              className={`font-mono text-6xl font-bold tabular-nums ${
                finalCountdown <= 5 ? 'text-signal-red' : 'text-signal-amber'
              }`}
            >
              {finalCountdown}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Round start / end splash. */}
      <AnimatePresence>
        {splash && (
          <motion.div
            key={`${splash.kind}-${splash.round}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]"
          >
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-center px-6"
            >
              <div className="flex items-center justify-center gap-2 font-sans text-sm font-medium text-signal-cyan mb-2">
                {splash.kind === 'start' ? <Play className="w-4 h-4" /> : <Flag className="w-4 h-4" />}
                {splash.kind === 'start'
                  ? t('editor.game.fx.round_start', { defaultValue: 'Round {{n}}', n: splash.round })
                  : t('editor.game.fx.round_over', { defaultValue: 'Round {{n}} over', n: splash.round })}
              </div>
              <div className="font-sans text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                {splash.kind === 'start'
                  ? splash.name ?? t('editor.game.fx.go', { defaultValue: 'Go!' })
                  : t('editor.game.fx.hands_off', { defaultValue: 'Scores are in' })}
              </div>
              {splash.story && (
                <p className="font-sans text-sm text-tactical-dim max-w-md mx-auto leading-relaxed">{splash.story}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
