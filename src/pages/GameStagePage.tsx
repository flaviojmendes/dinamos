// Audience stage view: a projector-friendly, real-time score screen for a
// match. Big countdown, phase state, a podium for the top three (with live
// mini architectures and golden signals), and an animated leaderboard where
// rank changes visibly reorder. Polls the spectate endpoint; no editing, no
// admin controls, safe to leave open on a venue screen.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Crown,
  Flag,
  Gauge,
  Hammer,
  Medal,
  Megaphone,
  Radio,
  Timer,
  Trophy,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../app/utils/api';
import MiniArchitecture from '../components/SystemEditor/game/MiniArchitecture';
import type { GoldenSignals, SpectatorPlayer, StageState } from '../components/SystemEditor/game/types';

const POLL_MS = 2000;

function fmtClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

const pct = (v: number) => `${Math.round(v * 100)}%`;
const medalTone = ['text-yellow-300', 'text-slate-300', 'text-amber-500'];

function latencyTone(p95: number) {
  return p95 < 250 ? 'text-signal-green' : p95 < 600 ? 'text-signal-amber' : 'text-signal-red';
}
function errorTone(rate: number) {
  return rate < 0.01 ? 'text-signal-green' : rate < 0.05 ? 'text-signal-amber' : 'text-signal-red';
}
function satTone(s: number) {
  return s < 0.7 ? 'text-signal-green' : s < 0.9 ? 'text-signal-amber' : 'text-signal-red';
}

function Signals({ m, large = false }: { m: GoldenSignals; large?: boolean }) {
  const txt = large ? 'text-sm' : 'text-xs';
  const icon = large ? 'w-4 h-4' : 'w-3 h-3';
  return (
    <div className={`flex items-center gap-4 font-mono ${txt} text-tactical-dim`}>
      <span className="inline-flex items-center gap-1" title="Throughput (req/s)">
        <Activity className={icon} /> {Math.round(m.throughput)}
      </span>
      <span className={`inline-flex items-center gap-1 ${latencyTone(m.p95)}`} title="p95 latency">
        <Timer className={icon} /> {Math.round(m.p95)}ms
      </span>
      <span className={`inline-flex items-center gap-1 ${errorTone(m.error_rate)}`} title="Error rate">
        <AlertTriangle className={icon} /> {pct(m.error_rate)}
      </span>
      <span className={`inline-flex items-center gap-1 ${satTone(m.saturation)}`} title="Saturation">
        <Gauge className={icon} /> {pct(m.saturation)}
      </span>
    </div>
  );
}

function Avatar({ p, size }: { p: SpectatorPlayer; size: string }) {
  return p.avatar_image ? (
    <img src={p.avatar_image} alt="" className={`${size} rounded-full object-cover`} />
  ) : (
    <div className={`${size} rounded-full bg-tactical-raised flex items-center justify-center font-sans text-tactical-dim`}>
      {(p.nickname ?? '?').slice(0, 1).toUpperCase()}
    </div>
  );
}

/** Podium card for the top three: identity, score, live system, signals. */
function PodiumCard({
  p,
  delta,
  anon,
}: {
  p: SpectatorPlayer;
  delta: number;
  anon: string;
}) {
  const reduceMotion = useReducedMotion();
  const border =
    p.rank === 1 ? 'border-yellow-300/60' : p.rank === 2 ? 'border-slate-300/40' : 'border-amber-500/40';
  return (
    <motion.div
      layout={!reduceMotion}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`tactical-panel border ${border} p-4 flex flex-col gap-3 ${p.rank === 1 ? 'lg:scale-[1.03]' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className={`font-mono text-2xl font-bold ${medalTone[p.rank - 1]}`}>
          {p.rank === 1 ? <Crown className="w-7 h-7" /> : `#${p.rank}`}
        </span>
        <Avatar p={p} size="w-10 h-10" />
        <div className="flex-1 min-w-0">
          <div className="font-sans text-lg font-bold text-tactical-text truncate">{p.nickname ?? anon}</div>
          {p.metrics && <Signals m={p.metrics} />}
        </div>
        <div className="text-right">
          <div className="font-mono text-3xl font-bold text-signal-green tabular-nums">{Math.round(p.score)}</div>
          {delta !== 0 && (
            <div className={`font-mono text-xs font-bold ${delta < 0 ? 'text-signal-green' : 'text-signal-red'}`}>
              {delta < 0 ? `▲${-delta}` : `▼${delta}`}
            </div>
          )}
        </div>
      </div>
      <MiniArchitecture architecture={p.architecture} height={150} />
    </motion.div>
  );
}

function StageInner({ code }: { code: string }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<StageState | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [now, setNow] = useState(Date.now());
  const offsetRef = useRef(0);
  // user_id -> rank from the previous poll, to render ▲/▼ movement.
  const prevRanksRef = useRef<Map<string, number>>(new Map());
  const [deltas, setDeltas] = useState<Map<string, number>>(new Map());

  const fetchStage = useCallback(async () => {
    try {
      const res = await apiClient.get(`/api/game/${code}/spectate`);
      const data = res.data as StageState;
      if (data.server_time) {
        offsetRef.current = new Date(data.server_time).getTime() - Date.now();
      }
      const prev = prevRanksRef.current;
      const next = new Map<string, number>();
      const nextDeltas = new Map<string, number>();
      for (const p of data.players) {
        next.set(p.user_id, p.rank);
        const before = prev.get(p.user_id);
        if (before !== undefined && before !== p.rank) nextDeltas.set(p.user_id, p.rank - before);
      }
      prevRanksRef.current = next;
      if (nextDeltas.size > 0) setDeltas(nextDeltas);
      setStage(data);
    } catch (err: any) {
      if (err?.response?.status === 404) setNotFound(true);
    }
  }, [code]);

  useEffect(() => {
    fetchStage();
    const id = setInterval(fetchStage, POLL_MS);
    return () => clearInterval(id);
  }, [fetchStage]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  // Rank-movement arrows fade after a few seconds.
  useEffect(() => {
    if (deltas.size === 0) return;
    const id = setTimeout(() => setDeltas(new Map()), 6000);
    return () => clearTimeout(id);
  }, [deltas]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-tactical-bg flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-signal-amber mx-auto mb-4" />
          <div className="font-sans text-xl font-bold text-tactical-text mb-2">
            {t('editor.game.not_found', { defaultValue: 'Match not found' })}
          </div>
          <Link to="/editor" className="font-sans text-sm text-signal-cyan underline">
            {t('editor.game.go_editor', { defaultValue: 'Go to the editor' })}
          </Link>
        </div>
      </div>
    );
  }

  if (!stage) {
    return (
      <div className="min-h-screen bg-tactical-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-signal-green border-t-transparent" aria-label="Loading" />
      </div>
    );
  }

  const serverNow = now + offsetRef.current;
  const phase = stage.phase;
  const isLive = phase === 'round';
  const ended = phase === 'ended';
  const roundEndsMs = stage.round_ends_at ? new Date(stage.round_ends_at).getTime() : null;
  const startsMs = stage.starts_at ? new Date(stage.starts_at).getTime() : null;
  const remaining = isLive && roundEndsMs ? (roundEndsMs - serverNow) / 1000 : null;
  const lobbyIn = phase === 'lobby' && startsMs ? (startsMs - serverNow) / 1000 : null;
  const meta = stage.rounds_public?.[Math.max(0, stage.current_round - 1)] ?? null;
  const nextMeta = phase === 'interval' ? stage.rounds_public?.[stage.current_round] ?? null : null;

  const phaseChip = isLive
    ? { label: t('editor.stage.live', { defaultValue: 'LIVE' }), cls: 'border-signal-green text-signal-green', icon: Radio }
    : phase === 'interval'
    ? { label: t('editor.stage.build', { defaultValue: 'BUILD PHASE' }), cls: 'border-signal-amber text-signal-amber', icon: Hammer }
    : ended
    ? { label: t('editor.stage.final', { defaultValue: 'FINAL' }), cls: 'border-signal-red text-signal-red', icon: Flag }
    : { label: t('editor.stage.lobby', { defaultValue: 'LOBBY' }), cls: 'border-signal-cyan text-signal-cyan', icon: Users };
  const PhaseIcon = phaseChip.icon;

  const podium = stage.players.slice(0, 3);
  const rest = stage.players.slice(3);
  const clockUrgent = remaining !== null && remaining <= 10;
  const anon = t('editor.game.anon', { defaultValue: 'Anonymous' });

  return (
    <div className="min-h-screen bg-tactical-bg text-tactical-text px-6 py-5 lg:px-12 lg:py-8 flex flex-col">
      {/* Header: identity left, clock right. */}
      <div className="flex flex-wrap items-start gap-x-8 gap-y-3 mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-sans text-xs font-bold tracking-wide ${phaseChip.cls}`}>
              <PhaseIcon className={`w-3.5 h-3.5 ${isLive && !reduceMotion ? 'animate-pulse motion-reduce:animate-none' : ''}`} />
              {phaseChip.label}
            </span>
            {(stage.total_rounds ?? 0) > 0 && !ended && (
              <span className="font-sans text-xs text-tactical-dim">
                {t('editor.game.round', { defaultValue: 'Round' })}{' '}
                <span className="font-mono font-bold text-tactical-text tabular-nums">
                  {Math.max(isLive ? stage.current_round : stage.current_round + (phase === 'interval' ? 1 : 0), 0)}/{stage.total_rounds}
                </span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 font-sans text-xs text-tactical-dim">
              <Users className="w-3.5 h-3.5" /> {stage.player_count}
            </span>
          </div>
          <h1 className="font-sans text-3xl lg:text-4xl font-bold tracking-tight text-tactical-text truncate">
            {stage.name ?? t('editor.game.untitled_match', { defaultValue: 'Distributed Systems Match' })}
          </h1>
          {(isLive && meta?.name) || nextMeta?.name ? (
            <div className="mt-1 font-sans text-sm text-tactical-dim">
              {isLive && meta?.name ? (
                <>
                  <span className="text-signal-cyan font-medium">{meta.name}</span>
                  {meta.story ? <span> · {meta.story}</span> : null}
                </>
              ) : (
                <>
                  <span className="text-signal-amber font-medium">
                    {t('editor.game.next_round_name', { defaultValue: 'Next: {{name}}', name: nextMeta!.name })}
                  </span>
                  {nextMeta!.story ? <span> · {nextMeta!.story}</span> : null}
                </>
              )}
            </div>
          ) : null}
        </div>

        <div className="ml-auto text-right">
          <div className="font-sans text-[11px] font-medium text-tactical-label mb-0.5">
            {isLive
              ? t('editor.game.round_time_left', { defaultValue: 'Round time left' })
              : phase === 'lobby'
              ? t('editor.game.starts_in', { defaultValue: 'Starts in' })
              : phase === 'interval'
              ? t('editor.stage.building_now', { defaultValue: 'Players are building' })
              : t('editor.stage.match_over', { defaultValue: 'Match complete' })}
          </div>
          <div
            className={`font-mono font-bold tabular-nums leading-none ${
              clockUrgent ? 'text-signal-red' : isLive ? 'text-signal-green' : 'text-tactical-text'
            } text-6xl lg:text-7xl ${clockUrgent && !reduceMotion ? 'animate-pulse motion-reduce:animate-none' : ''}`}
          >
            {isLive && remaining !== null
              ? fmtClock(remaining)
              : lobbyIn !== null
              ? fmtClock(lobbyIn)
              : ended
              ? '0:00'
              : '--:--'}
          </div>
          <div className="mt-1 font-mono text-xs text-tactical-label">
            {t('editor.stage.join_at', { defaultValue: 'Join at' })}{' '}
            <span className="text-signal-cyan">{`${window.location.host}/editor/game/${stage.code}`}</span>
          </div>
        </div>
      </div>

      {/* Host announcement. */}
      <AnimatePresence>
        {stage.announcement && (
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-5 flex items-center gap-3 rounded-md border border-signal-amber/60 bg-signal-amber/10 px-4 py-2.5 font-sans text-sm text-signal-amber"
          >
            <Megaphone className="w-4 h-4 shrink-0" />
            <span className="text-tactical-text">{stage.announcement}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {stage.players.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Trophy className="w-10 h-10 text-tactical-label mx-auto mb-3" />
            <div className="font-sans text-lg text-tactical-dim">
              {t('editor.stage.waiting_players', { defaultValue: 'Waiting for players to join…' })}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Winner banner when the match ends. */}
          {ended && podium[0] && (
            <motion.div
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mb-5 tactical-panel border border-yellow-300/60 px-6 py-4 flex items-center gap-4"
            >
              <Crown className="w-8 h-8 text-yellow-300 shrink-0" />
              <div className="min-w-0">
                <div className="font-sans text-[11px] font-medium text-tactical-label">
                  {t('editor.stage.champion', { defaultValue: 'Champion' })}
                </div>
                <div className="font-sans text-2xl font-bold text-tactical-text truncate">
                  {podium[0].nickname ?? anon}
                </div>
              </div>
              <div className="ml-auto font-mono text-4xl font-bold text-signal-green tabular-nums">
                {Math.round(podium[0].score)}
              </div>
            </motion.div>
          )}

          {/* Top three: live architectures + golden signals. */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {podium.map((p) => (
              <PodiumCard key={p.user_id} p={p} delta={deltas.get(p.user_id) ?? 0} anon={anon} />
            ))}
          </div>

          {/* Everyone else: animated rank list. */}
          {rest.length > 0 && (
            <div className="tactical-panel overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-tactical-border font-sans text-[11px] font-medium text-signal-amber">
                <Medal className="w-3.5 h-3.5" />
                {t('editor.stage.standings', { defaultValue: 'Standings' })}
              </div>
              <div className="divide-y divide-tactical-line/40">
                <AnimatePresence initial={false}>
                  {rest.map((p) => {
                    const delta = deltas.get(p.user_id) ?? 0;
                    return (
                      <motion.div
                        key={p.user_id}
                        layout={!reduceMotion}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="flex items-center gap-3 px-4 py-2"
                      >
                        <span className="w-8 text-right font-mono text-sm font-bold text-tactical-dim tabular-nums">
                          {p.rank}
                        </span>
                        <span className="w-5 text-center font-mono text-xs font-bold">
                          {delta < 0 ? (
                            <span className="text-signal-green">▲</span>
                          ) : delta > 0 ? (
                            <span className="text-signal-red">▼</span>
                          ) : (
                            <span className="text-tactical-line">·</span>
                          )}
                        </span>
                        <Avatar p={p} size="w-7 h-7" />
                        <span className="font-sans text-sm text-tactical-text truncate flex-1">
                          {p.nickname ?? anon}
                        </span>
                        {p.metrics && (
                          <div className="hidden md:block">
                            <Signals m={p.metrics} />
                          </div>
                        )}
                        <span className="w-24 text-right font-mono text-lg font-bold text-signal-green tabular-nums">
                          {Math.round(p.score)}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function GameStagePage() {
  const { code } = useParams<{ code: string }>();
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-tactical-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-signal-green border-t-transparent" aria-label="Loading" />
      </div>
    );
  }
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: `/editor/game/${code ?? ''}/stage` }} />;
  }
  if (!code) {
    return <Navigate to="/editor" replace />;
  }
  return <StageInner code={code} />;
}
