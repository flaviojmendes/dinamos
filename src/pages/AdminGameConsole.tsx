import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Gamepad2,
  Plus,
  Minus,
  Play,
  Pause,
  Square,
  Zap,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  Settings2,
  Clock,
  Rocket,
  Megaphone,
  Send,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api, { apiClient } from '../designlab/utils/api';
import { PRESETS } from '../components/SystemEditor/engine/scenarios';
import { presetNodesToArchitecture } from '../components/SystemEditor/game/architecture';
import { DEFAULT_SCORING } from '../components/SystemEditor/engine/scoring';
import GameLeaderboard from '../components/SystemEditor/game/GameLeaderboard';
import AdminSpectator from '../components/SystemEditor/game/AdminSpectator';
import type { LeaderboardEntry } from '../components/SystemEditor/game/types';

function fmtClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const mm = m.toString().padStart(2, '0');
  const ss = r.toString().padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

const LOAD_PROFILES = ['constant', 'ramp', 'spike', 'diurnal', 'step'] as const;
const CHAOS_TYPES = ['killNode', 'latencyInjection', 'partition'] as const;

interface AdminSession {
  id: number;
  code: string;
  name: string | null;
  status: string;
  seed: number;
  starts_at: string | null;
  started_at: string | null;
  ends_at: string | null;
  duration_sec: number | null;
  starting_architecture: {
    nodes: { id: string; config: { label: string } }[];
  } | null;
  locked_node_ids: string[];
  allow_delete_starting: boolean;
  load_profile: { type: string };
  chaos_events: unknown[];
  scoring_config: typeof DEFAULT_SCORING;
  leaderboard?: LeaderboardEntry[];
  announcement?: string | null;
  server_time?: string;
}

function matchUrl(code: string): string {
  return `${window.location.origin}/editor/game/${code}`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 px-2 py-1 border border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan font-mono text-xs transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy URL'}
    </button>
  );
}

// ---------------- Create match form ----------------

function CreateMatch({ onCreated }: { onCreated: () => void }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [allowDelete, setAllowDelete] = useState(false);
  const [lockedIds, setLockedIds] = useState<string[]>([]);
  const [loadType, setLoadType] = useState<(typeof LOAD_PROFILES)[number]>('constant');
  const [startInMin, setStartInMin] = useState(2);
  const [durationMin, setDurationMin] = useState(10);
  const [latencyTarget, setLatencyTarget] = useState(DEFAULT_SCORING.latencyTargetMs);
  const [budget, setBudget] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId) ?? PRESETS[0], [presetId]);

  const toggleLocked = (id: string) =>
    setLockedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const create = async () => {
    setSubmitting(true);
    setError('');
    try {
      const architecture = presetNodesToArchitecture(preset.nodes, preset.edges);
      const startsAt =
        startInMin > 0 ? new Date(Date.now() + startInMin * 60_000).toISOString() : null;
      await apiClient.post('/api/admin/game', {
        name: name || preset.name,
        seed: preset.seed,
        starting_architecture: architecture,
        allow_delete_starting: allowDelete,
        locked_node_ids: allowDelete ? lockedIds : architecture.nodes.map((n) => n.id),
        load_profile: { type: loadType },
        scoring_config: { ...DEFAULT_SCORING, latencyTargetMs: latencyTarget, budgetPerHour: budget },
        duration_sec: durationMin > 0 ? durationMin * 60 : null,
        starts_at: startsAt,
      });
      onCreated();
      setName('');
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to create match');
    } finally {
      setSubmitting(false);
    }
  };

  const field = 'w-full bg-tactical-raised border border-tactical-border px-2 py-1.5 font-mono text-xs text-tactical-text';
  const lbl = 'label-mono text-tactical-label mb-1 block';

  return (
    <div className="tactical-panel p-5 mb-8">
      <div className="flex items-center gap-2 label-mono text-signal-amber mb-4">
        <Plus className="w-4 h-4" /> {t('editor.game.create_match', { defaultValue: 'Create Match' })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>{t('editor.game.match_name', { defaultValue: 'Match name' })}</label>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder={preset.name} />
        </div>
        <div>
          <label className={lbl}>{t('editor.game.starting_architecture', { defaultValue: 'Starting architecture' })}</label>
          <select className={field} value={presetId} onChange={(e) => { setPresetId(e.target.value); setLockedIds([]); }}>
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>{t('editor.game.traffic', { defaultValue: 'Traffic profile' })}</label>
          <select className={field} value={loadType} onChange={(e) => setLoadType(e.target.value as typeof loadType)}>
            {LOAD_PROFILES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>{t('editor.game.start_in_min', { defaultValue: 'Start in (min)' })}</label>
            <input type="number" min={0} className={field} value={startInMin} onChange={(e) => setStartInMin(Number(e.target.value))} />
          </div>
          <div>
            <label className={lbl}>{t('editor.game.duration_min', { defaultValue: 'Duration (min)' })}</label>
            <input type="number" min={0} className={field} value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value))} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>{t('editor.game.latency_target', { defaultValue: 'p95 target (ms)' })}</label>
            <input type="number" min={1} className={field} value={latencyTarget} onChange={(e) => setLatencyTarget(Number(e.target.value))} />
          </div>
          <div>
            <label className={lbl}>{t('editor.game.budget', { defaultValue: 'Budget ($/hr, 0=off)' })}</label>
            <input type="number" min={0} className={field} value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="flex items-center gap-2 font-mono text-xs text-tactical-text">
          <input type="checkbox" checked={allowDelete} onChange={(e) => setAllowDelete(e.target.checked)} className="accent-signal-cyan" />
          {t('editor.game.allow_delete', { defaultValue: 'Allow players to delete starting components' })}
        </label>

        {allowDelete && (
          <div className="mt-3 border border-tactical-border p-3">
            <div className="label-mono text-tactical-label mb-2">
              {t('editor.game.lock_specific', { defaultValue: 'Lock specific components (optional)' })}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
              {preset.nodes.map((n) => (
                <label key={n.config.id} className="flex items-center gap-1.5 font-mono text-[11px] text-tactical-dim">
                  <input type="checkbox" checked={lockedIds.includes(n.config.id)} onChange={() => toggleLocked(n.config.id)} className="accent-signal-cyan" />
                  {n.config.label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <div className="mt-3 text-signal-red font-mono text-xs">{error}</div>}

      <button
        onClick={create}
        disabled={submitting}
        className="mt-4 px-4 py-2 font-mono text-sm uppercase tracking-wider border border-signal-green text-signal-green hover:bg-signal-green/10 transition-colors flex items-center gap-2 disabled:opacity-50"
      >
        <Gamepad2 className="w-4 h-4" /> {t('editor.game.create', { defaultValue: 'Create Match' })}
      </button>
    </div>
  );
}

// ---------------- Live management panel ----------------

function ManageMatch({ code }: { code: string }) {
  const { t } = useTranslation();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [chaosType, setChaosType] = useState<(typeof CHAOS_TYPES)[number]>('killNode');
  const [chaosTarget, setChaosTarget] = useState('');
  const [chaosDuration, setChaosDuration] = useState(15);
  const [announceMsg, setAnnounceMsg] = useState('');
  const [now, setNow] = useState(Date.now());
  const offsetRef = useRef(0);

  const fetchDetail = useCallback(async () => {
    try {
      const res = await apiClient.get(`/api/admin/game/${code}`);
      const data = res.data as AdminSession;
      if (data.server_time) {
        offsetRef.current = new Date(data.server_time).getTime() - Date.now();
      }
      setSession(data);
    } catch {
      /* ignore */
    }
  }, [code]);

  useEffect(() => {
    fetchDetail();
    const id = setInterval(fetchDetail, 3000);
    return () => clearInterval(id);
  }, [fetchDetail]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const patch = async (body: Record<string, unknown>) => {
    await api.patch(`/api/admin/game/${code}`, body);
    fetchDetail();
  };

  const sendAnnouncement = async (message: string) => {
    await apiClient.post(`/api/admin/game/${code}/announce`, { message });
    fetchDetail();
  };

  const injectChaos = async () => {
    const target = chaosTarget || session?.starting_architecture?.nodes?.[0]?.id;
    if (!target) return;
    await apiClient.post(`/api/admin/game/${code}/chaos`, {
      type: chaosType,
      targetId: target,
      durationSec: chaosDuration,
      magnitude: chaosType === 'latencyInjection' ? 5 : undefined,
    });
    fetchDetail();
  };

  if (!session) return null;
  const nodes = session.starting_architecture?.nodes ?? [];
  const status = session.status;
  const btn = 'px-3 py-1.5 font-mono text-xs uppercase tracking-wider border transition-colors flex items-center gap-1.5';

  const serverNow = now + offsetRef.current;
  const startsMs = session.starts_at ? new Date(session.starts_at).getTime() : null;
  const endsMs = session.ends_at ? new Date(session.ends_at).getTime() : null;
  const countdownSec = startsMs ? (startsMs - serverNow) / 1000 : null;
  const timeLeftSec = endsMs ? (endsMs - serverNow) / 1000 : null;

  // Shift the scheduled start time, never into the past.
  const shiftStart = (deltaSec: number) => {
    const base = startsMs && startsMs > serverNow ? startsMs : serverNow;
    const next = Math.max(serverNow, base + deltaSec * 1000);
    patch({ starts_at: new Date(next).toISOString() });
  };

  const tinyBtn = 'px-2 py-1 font-mono text-[11px] border border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan transition-colors inline-flex items-center gap-1';

  return (
    <div className="mt-3 border-t border-tactical-border pt-3">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {(status === 'lobby' || status === 'paused') && (
          <button onClick={() => patch({ action: status === 'paused' ? 'resume' : 'start' })} className={`${btn} border-signal-green text-signal-green hover:bg-signal-green/10`}>
            <Play className="w-3.5 h-3.5" /> {status === 'paused' ? t('editor.game.resume', { defaultValue: 'Resume' }) : t('editor.game.start_now', { defaultValue: 'Start now' })}
          </button>
        )}
        {status === 'running' && (
          <button onClick={() => patch({ action: 'pause' })} className={`${btn} border-signal-amber text-signal-amber hover:bg-signal-amber/10`}>
            <Pause className="w-3.5 h-3.5" /> {t('editor.game.pause', { defaultValue: 'Pause' })}
          </button>
        )}
        {status !== 'ended' && (
          <button onClick={() => patch({ action: 'end' })} className={`${btn} border-signal-red text-signal-red hover:bg-signal-red/10`}>
            <Square className="w-3.5 h-3.5" /> {t('editor.game.end', { defaultValue: 'End' })}
          </button>
        )}

        <div className="border-l border-tactical-line h-6 mx-1" />

        <label className="flex items-center gap-2 font-mono text-xs text-tactical-dim">
          {t('editor.game.traffic', { defaultValue: 'Traffic' })}
          <select
            value={session.load_profile?.type ?? 'constant'}
            onChange={(e) => patch({ load_profile: { type: e.target.value } })}
            className="bg-tactical-raised border border-tactical-border px-2 py-1 font-mono text-xs text-tactical-text"
          >
            {LOAD_PROFILES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Time controls: live countdown / time-left + fine adjustments */}
      <div className="flex flex-wrap items-center gap-3 mb-4 bg-tactical-raised/40 border border-tactical-border p-3">
        <div className="inline-flex items-center gap-2">
          <Clock className="w-4 h-4 text-signal-cyan" />
          {status === 'lobby' && countdownSec !== null ? (
            <span className="font-mono text-sm text-tactical-text">
              {t('editor.game.starts_in', { defaultValue: 'Starts in' })}{' '}
              <span className="font-bold text-signal-green tabular-nums">{fmtClock(countdownSec)}</span>
            </span>
          ) : status === 'running' ? (
            <span className="font-mono text-sm text-tactical-text">
              {timeLeftSec !== null ? (
                <>
                  {t('editor.game.time_left', { defaultValue: 'Time left' })}{' '}
                  <span className="font-bold text-signal-amber tabular-nums">{fmtClock(timeLeftSec)}</span>
                </>
              ) : (
                t('editor.game.open_ended', { defaultValue: 'Open-ended' })
              )}
            </span>
          ) : (
            <span className="font-mono text-sm text-tactical-dim uppercase">{status}</span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {status === 'lobby' && (
            <>
              <button onClick={() => shiftStart(-60)} className={tinyBtn}><Minus className="w-3 h-3" />1m</button>
              <button onClick={() => shiftStart(60)} className={tinyBtn}><Plus className="w-3 h-3" />1m</button>
              <button onClick={() => patch({ action: 'start' })} className={`${tinyBtn} border-signal-green text-signal-green hover:bg-signal-green/10`}>
                <Rocket className="w-3 h-3" /> {t('editor.game.start_now', { defaultValue: 'Start now' })}
              </button>
            </>
          )}
          {status === 'running' && (
            <>
              <span className="font-mono text-[11px] text-tactical-label">{t('editor.game.adjust_time', { defaultValue: 'Adjust' })}</span>
              <button onClick={() => patch({ add_sec: -60 })} className={tinyBtn}><Minus className="w-3 h-3" />1m</button>
              <button onClick={() => patch({ add_sec: 60 })} className={tinyBtn}><Plus className="w-3 h-3" />1m</button>
              <button onClick={() => patch({ add_sec: 300 })} className={tinyBtn}><Plus className="w-3 h-3" />5m</button>
            </>
          )}
        </div>
      </div>

      {/* Chaos injection */}
      <div className="flex flex-wrap items-end gap-2 mb-4 bg-tactical-raised/40 border border-tactical-border p-3">
        <div>
          <label className="label-mono text-tactical-label mb-1 block">{t('editor.game.chaos_type', { defaultValue: 'Chaos' })}</label>
          <select value={chaosType} onChange={(e) => setChaosType(e.target.value as typeof chaosType)} className="bg-tactical-raised border border-tactical-border px-2 py-1 font-mono text-xs text-tactical-text">
            {CHAOS_TYPES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-mono text-tactical-label mb-1 block">{t('editor.game.target', { defaultValue: 'Target' })}</label>
          <select value={chaosTarget} onChange={(e) => setChaosTarget(e.target.value)} className="bg-tactical-raised border border-tactical-border px-2 py-1 font-mono text-xs text-tactical-text">
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>{n.config.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-mono text-tactical-label mb-1 block">{t('editor.game.duration_sec', { defaultValue: 'Sec' })}</label>
          <input type="number" min={1} value={chaosDuration} onChange={(e) => setChaosDuration(Number(e.target.value))} className="w-16 bg-tactical-raised border border-tactical-border px-2 py-1 font-mono text-xs text-tactical-text" />
        </div>
        <button onClick={injectChaos} disabled={status !== 'running'} className={`${btn} border-signal-amber text-signal-amber hover:bg-signal-amber/10 disabled:opacity-40`}>
          <Zap className="w-3.5 h-3.5" /> {t('editor.game.inject', { defaultValue: 'Inject' })}
        </button>
      </div>

      {/* Broadcast announcement to all players */}
      <div className="mb-4 bg-tactical-raised/40 border border-tactical-border p-3">
        <div className="flex items-center gap-2 label-mono text-signal-amber mb-2">
          <Megaphone className="w-3.5 h-3.5" />
          {t('editor.game.broadcast', { defaultValue: 'Broadcast to players' })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={announceMsg}
            onChange={(e) => setAnnounceMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && announceMsg.trim()) {
                sendAnnouncement(announceMsg.trim());
                setAnnounceMsg('');
              }
            }}
            placeholder={t('editor.game.broadcast_ph', { defaultValue: 'Message shown to every player…' })}
            className="flex-1 min-w-[200px] bg-tactical-raised border border-tactical-border px-2 py-1.5 font-mono text-xs text-tactical-text"
          />
          <button
            onClick={() => { if (announceMsg.trim()) { sendAnnouncement(announceMsg.trim()); setAnnounceMsg(''); } }}
            disabled={!announceMsg.trim()}
            className={`${btn} border-signal-amber text-signal-amber hover:bg-signal-amber/10 disabled:opacity-40`}
          >
            <Send className="w-3.5 h-3.5" /> {t('editor.game.send', { defaultValue: 'Send' })}
          </button>
          {session.announcement && (
            <button
              onClick={() => sendAnnouncement('')}
              className={`${btn} border-tactical-border text-tactical-dim hover:text-signal-red hover:border-signal-red`}
            >
              {t('editor.game.clear', { defaultValue: 'Clear' })}
            </button>
          )}
        </div>
        {session.announcement && (
          <div className="mt-2 font-mono text-[11px] text-tactical-dim">
            {t('editor.game.current_broadcast', { defaultValue: 'Live:' })}{' '}
            <span className="text-tactical-text">{session.announcement}</span>
          </div>
        )}
      </div>

      <GameLeaderboard entries={session.leaderboard ?? []} />

      <AdminSpectator code={code} />
    </div>
  );
}

// ---------------- Match list ----------------

function MatchRow({ session, onChanged }: { session: AdminSession; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const statusTone =
    session.status === 'running'
      ? 'text-signal-green'
      : session.status === 'ended'
      ? 'text-signal-red'
      : 'text-signal-amber';

  const remove = async () => {
    if (!confirm('Delete this match permanently?')) return;
    await apiClient.delete(`/api/admin/game/${session.code}`);
    onChanged();
  };

  return (
    <div className="tactical-panel p-4 mb-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="font-mono text-sm font-bold text-tactical-text">
          {session.name || 'Untitled'}{' '}
          <span className="text-tactical-label">#{session.code}</span>
        </div>
        <span className={`font-mono text-xs uppercase tracking-wider ${statusTone}`}>{session.status}</span>
        <span className="font-mono text-xs text-tactical-dim">{session.starting_architecture?.nodes?.length ?? 0} parts</span>
        <div className="ml-auto flex items-center gap-2">
          <CopyButton text={matchUrl(session.code)} />
          <button onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1.5 px-2 py-1 border border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan font-mono text-xs transition-colors">
            <Settings2 className="w-3.5 h-3.5" /> Manage
          </button>
          <button onClick={remove} className="inline-flex items-center gap-1.5 px-2 py-1 border border-tactical-border text-tactical-dim hover:border-signal-red hover:text-signal-red font-mono text-xs transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="mt-1 font-mono text-[11px] text-tactical-label break-all">{matchUrl(session.code)}</div>
      {open && <ManageMatch code={session.code} />}
    </div>
  );
}

export default function AdminGameConsole() {
  const { t } = useTranslation();
  const { appUser } = useAuth();
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/admin/game');
      setSessions((res.data?.sessions ?? []) as AdminSession[]);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    const id = setInterval(fetchSessions, 5000);
    return () => clearInterval(id);
  }, [fetchSessions]);

  if (appUser && appUser.role !== 'Admin') {
    return (
      <div className="max-w-md mx-auto p-10 text-center font-mono text-tactical-dim">
        {t('editor.game.admin_only', { defaultValue: 'Admin privileges required.' })}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-tactical-bg">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="label-mono text-signal-amber mb-1">[ ADMIN ] // {t('editor.game.console', { defaultValue: 'GAME CONSOLE' })}</div>
        <h1 className="text-2xl md:text-3xl font-mono font-bold mb-6 tracking-tight text-slate-900 dark:text-tactical-text flex items-center gap-3">
          <Gamepad2 className="w-7 h-7 text-signal-cyan" />
          {t('editor.game.console_title', { defaultValue: 'Editor Game Console' })}
        </h1>

        <CreateMatch onCreated={fetchSessions} />

        <div className="flex items-center gap-2 label-mono text-signal-amber mb-3">
          {t('editor.game.matches', { defaultValue: 'Matches' })}
          <button onClick={fetchSessions} className="text-tactical-dim hover:text-signal-cyan transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="font-mono text-sm text-tactical-dim">Loading…</div>
        ) : sessions.length === 0 ? (
          <div className="font-mono text-sm text-tactical-dim">{t('editor.game.no_matches', { defaultValue: 'No matches yet. Create one above.' })}</div>
        ) : (
          sessions.map((s) => <MatchRow key={s.code} session={s} onChanged={fetchSessions} />)
        )}
      </div>
    </div>
  );
}
