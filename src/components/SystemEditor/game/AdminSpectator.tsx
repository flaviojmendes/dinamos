// Live spectator grid for the admin console: one card per player showing their
// current architecture, score and how recently they were active. Cards expand
// into a full-size view, and the admin can kick a player. Polls the admin
// players endpoint while mounted.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Boxes,
  GitBranch,
  Trophy,
  X,
  UserX,
  Timer,
  Activity,
  AlertTriangle,
  Gauge,
} from 'lucide-react';
import { apiClient } from '../../../designlab/utils/api';
import MiniArchitecture from './MiniArchitecture';
import type { GoldenSignals, SpectatorPlayer, SpectatorResponse } from './types';

const POLL_MS = 3000;

const pct = (v: number) => `${Math.round(v * 100)}%`;
const num = (v: number) => (v >= 100 ? Math.round(v).toString() : v.toFixed(1));

function latencyTone(p95: number) {
  return p95 < 250 ? 'text-signal-green' : p95 < 600 ? 'text-signal-amber' : 'text-signal-red';
}
function errorTone(rate: number) {
  return rate < 0.01 ? 'text-signal-green' : rate < 0.05 ? 'text-signal-amber' : 'text-signal-red';
}
function satTone(s: number) {
  return s < 0.7 ? 'text-signal-green' : s < 0.9 ? 'text-signal-amber' : 'text-signal-red';
}

/** Compact golden-signals row for the player card. */
function SignalsRow({ m }: { m: GoldenSignals }) {
  return (
    <div className="flex items-center gap-3 mt-1 font-mono text-[11px] text-tactical-dim">
      <span className="inline-flex items-center gap-1" title="Traffic (req/s)">
        <Activity className="w-3 h-3" /> {num(m.throughput)}
      </span>
      <span className={`inline-flex items-center gap-1 ${latencyTone(m.p95)}`} title="p95 latency">
        <Timer className="w-3 h-3" /> {Math.round(m.p95)}ms
      </span>
      <span className={`inline-flex items-center gap-1 ${errorTone(m.error_rate)}`} title="Error rate">
        <AlertTriangle className="w-3 h-3" /> {pct(m.error_rate)}
      </span>
      <span className={`inline-flex items-center gap-1 ${satTone(m.saturation)}`} title="Saturation (max utilization)">
        <Gauge className="w-3 h-3" /> {pct(m.saturation)}
      </span>
    </div>
  );
}

/** Full golden-signals panel for the expanded view. */
function SignalsPanel({ m }: { m: GoldenSignals }) {
  const { t } = useTranslation();
  const Card = ({
    icon,
    label,
    value,
    tone = 'text-tactical-text',
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    tone?: string;
  }) => (
    <div className="border border-tactical-border p-2">
      <div className="label-mono text-tactical-label flex items-center gap-1">{icon}{label}</div>
      <div className={`font-mono text-sm tabular-nums ${tone}`}>{value}</div>
    </div>
  );
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
      <Card
        icon={<Activity className="w-3 h-3" />}
        label={t('editor.game.traffic', { defaultValue: 'Traffic' })}
        value={`${num(m.throughput)} / ${num(m.offered_load)} rps`}
      />
      <Card
        icon={<Timer className="w-3 h-3" />}
        label={t('editor.game.latency', { defaultValue: 'Latency p95' })}
        value={`${Math.round(m.p95)} ms`}
        tone={latencyTone(m.p95)}
      />
      <Card
        icon={<AlertTriangle className="w-3 h-3" />}
        label={t('editor.game.errors', { defaultValue: 'Errors' })}
        value={pct(m.error_rate)}
        tone={errorTone(m.error_rate)}
      />
      <Card
        icon={<Gauge className="w-3 h-3" />}
        label={t('editor.game.saturation', { defaultValue: 'Saturation' })}
        value={pct(m.saturation)}
        tone={satTone(m.saturation)}
      />
    </div>
  );
}

interface Accumulator {
  total?: number;
  ticks?: number;
  throughput?: number;
  availability?: number;
  latencyPenalty?: number;
  costPenalty?: number;
}

/** Relative "active Xs ago" + a freshness tone based on the server clock. */
function activity(lastIso: string | null, serverNowMs: number) {
  if (!lastIso) return { label: 'no activity', tone: 'text-tactical-label', dot: '#475569' };
  const ageSec = Math.max(0, Math.round((serverNowMs - new Date(lastIso).getTime()) / 1000));
  let label: string;
  if (ageSec < 5) label = 'live';
  else if (ageSec < 60) label = `${ageSec}s ago`;
  else label = `${Math.floor(ageSec / 60)}m ago`;
  const tone = ageSec < 12 ? 'text-signal-green' : ageSec < 40 ? 'text-signal-amber' : 'text-tactical-dim';
  const dot = ageSec < 12 ? '#22c55e' : ageSec < 40 ? '#f59e0b' : '#475569';
  return { label, tone, dot };
}

function PlayerCard({
  p,
  serverNowMs,
  onExpand,
  onKick,
}: {
  p: SpectatorPlayer;
  serverNowMs: number;
  onExpand: () => void;
  onKick: () => void;
}) {
  const act = activity(p.last_submitted_at, serverNowMs);
  const rankTone =
    p.rank === 1 ? 'text-signal-amber' : p.rank <= 3 ? 'text-signal-cyan' : 'text-tactical-dim';
  return (
    <div
      onClick={onExpand}
      className="border border-tactical-border bg-tactical-surface/40 p-2 cursor-pointer hover:border-signal-cyan transition-colors group"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`font-mono text-xs font-bold ${rankTone}`}>#{p.rank}</span>
        {p.avatar_image ? (
          <img src={p.avatar_image} alt="" className="w-5 h-5 rounded-full object-cover" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-tactical-raised" />
        )}
        <span className="font-mono text-xs text-tactical-text truncate flex-1">
          {p.nickname ?? p.user_id.slice(0, 8)}
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: act.dot }} />
          <span className={`font-mono text-[10px] ${act.tone}`}>{act.label}</span>
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onKick(); }}
          className="text-tactical-dim hover:text-signal-red transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Kick player"
          title="Kick player"
        >
          <UserX className="w-3.5 h-3.5" />
        </button>
      </div>

      <MiniArchitecture architecture={p.architecture} height={130} />

      <div className="flex items-center gap-3 mt-1.5 font-mono text-[11px] text-tactical-dim">
        <span className="inline-flex items-center gap-1 text-signal-green font-bold">
          <Trophy className="w-3 h-3" /> {Math.round(p.score)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Boxes className="w-3 h-3" /> {p.node_count}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitBranch className="w-3 h-3" /> {p.edge_count}
        </span>
      </div>

      {p.metrics && <SignalsRow m={p.metrics} />}
    </div>
  );
}

function ExpandedPlayer({
  p,
  serverNowMs,
  onClose,
  onKick,
}: {
  p: SpectatorPlayer;
  serverNowMs: number;
  onClose: () => void;
  onKick: () => void;
}) {
  const { t } = useTranslation();
  const act = activity(p.last_submitted_at, serverNowMs);
  const bd = (p.score_breakdown ?? {}) as Accumulator;
  const stat = (label: string, value: number) => (
    <div className="border border-tactical-border p-2">
      <div className="label-mono text-tactical-label">{label}</div>
      <div className="font-mono text-sm text-tactical-text tabular-nums">{Math.round(value)}</div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="tactical-panel w-full max-w-3xl max-h-[90vh] overflow-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          {p.avatar_image ? (
            <img src={p.avatar_image} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-tactical-raised" />
          )}
          <div className="flex-1">
            <div className="font-mono text-base font-bold text-tactical-text">
              <span className="text-tactical-label">#{p.rank}</span> {p.nickname ?? p.user_id.slice(0, 12)}
            </div>
            <div className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: act.dot }} />
              <span className={`font-mono text-[11px] ${act.tone}`}>{act.label}</span>
            </div>
          </div>
          <button
            onClick={onKick}
            className="px-3 py-1.5 font-mono text-xs uppercase tracking-wider border border-signal-red text-signal-red hover:bg-signal-red/10 transition-colors flex items-center gap-1.5"
          >
            <UserX className="w-3.5 h-3.5" /> {t('editor.game.kick', { defaultValue: 'Kick' })}
          </button>
          <button onClick={onClose} className="text-tactical-dim hover:text-tactical-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <MiniArchitecture architecture={p.architecture} height={380} />

        {p.metrics && <SignalsPanel m={p.metrics} />}

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4">
          {stat(t('editor.game.score', { defaultValue: 'Score' }), p.score)}
          {stat(t('editor.game.parts', { defaultValue: 'Parts' }), p.node_count)}
          {stat(t('editor.game.links', { defaultValue: 'Links' }), p.edge_count)}
          {stat(t('editor.game.throughput', { defaultValue: 'Throughput' }), bd.throughput ?? 0)}
          {stat(t('editor.game.availability', { defaultValue: 'Avail.' }), bd.availability ?? 0)}
          {stat(t('editor.game.penalties', { defaultValue: 'Penalty' }), (bd.latencyPenalty ?? 0) + (bd.costPenalty ?? 0))}
        </div>
      </div>
    </div>
  );
}

export default function AdminSpectator({ code }: { code: string }) {
  const { t } = useTranslation();
  const [players, setPlayers] = useState<SpectatorPlayer[]>([]);
  const [serverNowMs, setServerNowMs] = useState(Date.now());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // Keep the server/local clock offset so "Xs ago" ticks even between polls.
  const offsetRef = useRef(0);

  const fetchPlayers = useCallback(async () => {
    try {
      const res = await apiClient.get(`/api/admin/game/${code}/players`);
      const data = res.data as SpectatorResponse;
      setPlayers(data.players ?? []);
      if (data.server_time) {
        offsetRef.current = new Date(data.server_time).getTime() - Date.now();
      }
    } catch {
      /* ignore transient errors */
    }
  }, [code]);

  const kick = useCallback(
    async (userId: string, nickname: string | null) => {
      if (!confirm(`Kick ${nickname ?? 'this player'} from the match?`)) return;
      try {
        await apiClient.delete(`/api/admin/game/${code}/players/${userId}`);
        setExpandedId((id) => (id === userId ? null : id));
        fetchPlayers();
      } catch {
        /* ignore */
      }
    },
    [code, fetchPlayers]
  );

  useEffect(() => {
    fetchPlayers();
    const id = setInterval(fetchPlayers, POLL_MS);
    return () => clearInterval(id);
  }, [fetchPlayers]);

  // Advance the displayed clock every second for smooth activity timers.
  useEffect(() => {
    const id = setInterval(() => setServerNowMs(Date.now() + offsetRef.current), 1000);
    return () => clearInterval(id);
  }, []);

  const expanded = players.find((p) => p.user_id === expandedId) ?? null;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 label-mono text-signal-cyan mb-2">
        <Users className="w-4 h-4" />
        {t('editor.game.spectate', { defaultValue: 'Live player view' })}
        <span className="text-tactical-label">({players.length})</span>
      </div>
      {players.length === 0 ? (
        <div className="font-mono text-xs text-tactical-dim border border-dashed border-tactical-border p-4 text-center">
          {t('editor.game.no_players', { defaultValue: 'No players have joined yet.' })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {players.map((p) => (
            <PlayerCard
              key={p.user_id}
              p={p}
              serverNowMs={serverNowMs}
              onExpand={() => setExpandedId(p.user_id)}
              onKick={() => kick(p.user_id, p.nickname)}
            />
          ))}
        </div>
      )}

      {expanded && (
        <ExpandedPlayer
          p={expanded}
          serverNowMs={serverNowMs}
          onClose={() => setExpandedId(null)}
          onKick={() => kick(expanded.user_id, expanded.nickname)}
        />
      )}
    </div>
  );
}
