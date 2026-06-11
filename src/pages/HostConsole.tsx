import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Gamepad2,
  Plus,
  Minus,
  Play,
  Pause,
  Zap,
  Copy,
  Check,
  Trash2,
  RefreshCw,
  Settings2,
  Clock,
  Megaphone,
  Send,
  Layers,
  Hammer,
  SkipForward,
  Flag,
  MonitorPlay,
  Lock,
  EyeOff,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api, { apiClient } from '../app/utils/api';
import { PRESETS } from '../components/SystemEditor/engine/scenarios';
import { presetNodesToArchitecture } from '../components/SystemEditor/game/architecture';
import { MATCH_SCENARIOS, getMatchScenario } from '../components/SystemEditor/game/matchScenarios';
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

interface RoundConfig {
  name?: string;
  story?: string;
  intervalSec: number;
  durationSec: number;
  loadProfile: { type: string; multiplier?: number };
  chaosEvents: unknown[];
  scoringConfig: typeof DEFAULT_SCORING;
  weight: number;
}

function defaultRound(idx: number): RoundConfig {
  return {
    name: `Round ${idx + 1}`,
    intervalSec: 60,
    durationSec: 120,
    loadProfile: { type: 'constant', multiplier: 1 },
    chaosEvents: [],
    scoringConfig: { ...DEFAULT_SCORING },
    weight: 1,
  };
}

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
  load_profile: { type: string; multiplier?: number };
  chaos_events: unknown[];
  scoring_config: typeof DEFAULT_SCORING;
  rounds?: RoundConfig[];
  phase?: string;
  current_round?: number;
  total_rounds?: number;
  round_started_at?: string | null;
  round_ends_at?: string | null;
  leaderboard?: LeaderboardEntry[];
  announcement?: string | null;
  join_open?: boolean;
  listed?: boolean;
  join_key?: string | null;
  server_time?: string;
}

// Private matches embed the invite key in the link so only invited players
// can join; the bare code is not enough.
function matchUrl(code: string, joinKey?: string | null): string {
  const base = `${window.location.origin}/editor/game/${code}`;
  return joinKey ? `${base}?key=${joinKey}` : base;
}

function inviteUrl(session: AdminSession): string {
  return matchUrl(session.code, session.join_open === false ? session.join_key : null);
}

function stageUrl(code: string): string {
  return `${window.location.origin}/editor/game/${code}/stage`;
}

function CopyButton({ text }: { text: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan font-sans text-xs transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied
        ? t('editor.game.copied', { defaultValue: 'Copied' })
        : t('editor.game.copy_invite', { defaultValue: 'Copy invite link' })}
    </button>
  );
}

// ---------------- Create match form ----------------

function CreateMatch({ onCreated }: { onCreated: () => void }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [scenarioId, setScenarioId] = useState('custom');
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [allowDelete, setAllowDelete] = useState(true);
  const [lockedIds, setLockedIds] = useState<string[]>([]);
  const [startInMin, setStartInMin] = useState(2);
  const [joinOpen, setJoinOpen] = useState(true);
  const [listed, setListed] = useState(true);
  const [rounds, setRounds] = useState<RoundConfig[]>([defaultRound(0)]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId) ?? PRESETS[0], [presetId]);
  const scenario = scenarioId === 'custom' ? undefined : getMatchScenario(scenarioId);

  // Picking a scripted scenario fills the whole match: starting architecture,
  // story-driven rounds (with scripted chaos), locks and scoring. Everything
  // stays editable below before creating.
  const applyScenario = (id: string) => {
    setScenarioId(id);
    const s = getMatchScenario(id);
    if (!s) return;
    setPresetId(s.presetId);
    setLockedIds(s.lockedNodeIds);
    setRounds(
      s.rounds.map((r) => ({
        name: r.name,
        story: r.story,
        intervalSec: r.intervalSec,
        durationSec: r.durationSec,
        loadProfile: { ...r.loadProfile },
        chaosEvents: r.chaosEvents,
        scoringConfig: { ...r.scoringConfig },
        weight: r.weight,
      })),
    );
  };

  const toggleLocked = (id: string) =>
    setLockedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const patchRound = (idx: number, patch: Partial<RoundConfig>) =>
    setRounds((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  const patchRoundScoring = (idx: number, patch: Partial<typeof DEFAULT_SCORING>) =>
    setRounds((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, scoringConfig: { ...r.scoringConfig, ...patch } } : r))
    );
  const addRound = () => setRounds((prev) => [...prev, defaultRound(prev.length)]);
  const removeRound = (idx: number) =>
    setRounds((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx)));

  const create = async () => {
    setSubmitting(true);
    setError('');
    try {
      const architecture = presetNodesToArchitecture(preset.nodes, preset.edges);
      const startsAt =
        startInMin > 0 ? new Date(Date.now() + startInMin * 60_000).toISOString() : null;
      await apiClient.post('/api/games/host', {
        name: name || scenario?.name || preset.name,
        seed: preset.seed,
        starting_architecture: architecture,
        allow_delete_starting: allowDelete,
        locked_node_ids: allowDelete ? lockedIds : architecture.nodes.map((n) => n.id),
        rounds,
        // Keep the legacy column populated with the first round's length.
        duration_sec: rounds[0]?.durationSec ?? null,
        starts_at: startsAt,
        join_open: joinOpen,
        listed,
      });
      onCreated();
      setName('');
      setRounds([defaultRound(0)]);
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to create match');
    } finally {
      setSubmitting(false);
    }
  };

  const field = 'w-full bg-tactical-raised border border-tactical-border rounded-md px-2 py-1.5 font-sans text-xs text-tactical-text';
  const lbl = 'font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-1 block';
  const totalWeight = rounds.reduce((s, r) => s + (r.weight || 0), 0);

  return (
    <div className="tactical-panel p-5 mb-8">
      <div className="flex items-center gap-2 font-sans text-[11px] font-medium text-slate-600 dark:text-signal-amber mb-4">
        <Plus className="w-4 h-4" /> {t('editor.game.create_match', { defaultValue: 'Create Match' })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>{t('editor.game.scenario', { defaultValue: 'Scenario' })}</label>
          <select className={field} value={scenarioId} onChange={(e) => applyScenario(e.target.value)}>
            <option value="custom">{t('editor.game.scenario_custom', { defaultValue: 'Custom (build your own)' })}</option>
            {MATCH_SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {scenario && (
            <p className="mt-1 font-sans text-[11px] leading-relaxed text-tactical-dim">{scenario.description}</p>
          )}
        </div>
        <div>
          <label className={lbl}>{t('editor.game.match_name', { defaultValue: 'Match name' })}</label>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder={scenario?.name ?? preset.name} />
        </div>
        <div>
          <label className={lbl}>{t('editor.game.starting_architecture', { defaultValue: 'Starting architecture' })}</label>
          <select
            className={field}
            value={presetId}
            onChange={(e) => {
              // Manual preset change breaks scenario chaos targets: fall back
              // to custom and drop the scripted events.
              setPresetId(e.target.value);
              setLockedIds([]);
              setScenarioId('custom');
              setRounds((prev) => prev.map((r) => ({ ...r, chaosEvents: [] })));
            }}
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lbl}>{t('editor.game.start_in_min', { defaultValue: 'Open lobby in (min)' })}</label>
          <input type="number" min={0} className={field} value={startInMin} onChange={(e) => setStartInMin(Number(e.target.value))} />
        </div>
      </div>

      {/* Who can find and join the match */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className={lbl}>{t('editor.game.joining', { defaultValue: 'Joining' })}</span>
          <div className="flex rounded-md border border-tactical-border overflow-hidden" role="radiogroup" aria-label={t('editor.game.joining', { defaultValue: 'Joining' })}>
            <button
              type="button"
              role="radio"
              aria-checked={joinOpen}
              onClick={() => setJoinOpen(true)}
              className={`flex-1 px-3 py-2 font-sans text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-cyan ${joinOpen ? 'bg-signal-cyan/10 text-signal-cyan' : 'text-tactical-dim hover:text-tactical-text'}`}
            >
              {t('editor.game.join_public', { defaultValue: 'Public' })}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={!joinOpen}
              onClick={() => setJoinOpen(false)}
              className={`flex-1 px-3 py-2 font-sans text-xs transition-colors border-l border-tactical-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-cyan ${!joinOpen ? 'bg-signal-amber/10 text-signal-amber' : 'text-tactical-dim hover:text-tactical-text'}`}
            >
              {t('editor.game.join_private', { defaultValue: 'Private' })}
            </button>
          </div>
          <p className="mt-1 font-sans text-[11px] leading-relaxed text-tactical-dim">
            {joinOpen
              ? t('editor.game.join_public_hint', { defaultValue: 'Anyone with the match code can join.' })
              : t('editor.game.join_private_hint', { defaultValue: 'Only people with your invite link can join. The link is generated when the match is created.' })}
          </p>
        </div>
        <div>
          <span className={lbl}>{t('editor.game.arena_listing', { defaultValue: 'Arena listing' })}</span>
          <label className="flex items-center gap-2 rounded-md border border-tactical-border px-3 py-2 font-sans text-xs text-tactical-text cursor-pointer hover:border-signal-cyan/60 transition-colors">
            <input type="checkbox" checked={listed} onChange={(e) => setListed(e.target.checked)} className="accent-signal-cyan" />
            {t('editor.game.listed_label', { defaultValue: 'Show in “Happening now” on the arena' })}
          </label>
          <p className="mt-1 font-sans text-[11px] leading-relaxed text-tactical-dim">
            {listed
              ? t('editor.game.listed_hint', { defaultValue: 'Visitors browsing the arena will see this match.' })
              : t('editor.game.unlisted_hint', { defaultValue: 'Hidden from the arena. Only people with the link will find it.' })}
          </p>
        </div>
      </div>

      {/* Rounds builder */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 font-sans text-[11px] font-medium text-slate-600 dark:text-signal-amber">
            <Layers className="w-4 h-4" /> {t('editor.game.rounds', { defaultValue: 'Rounds' })}
            <span className="text-tactical-label font-normal">
              ({rounds.length} · {t('editor.game.total_weight', { defaultValue: 'total weight' })} {totalWeight})
            </span>
          </div>
          <button onClick={addRound} className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-signal-cyan text-signal-cyan hover:bg-signal-cyan/10 font-sans text-xs transition-colors">
            <Plus className="w-3.5 h-3.5" /> {t('editor.game.add_round', { defaultValue: 'Add round' })}
          </button>
        </div>

        <div className="space-y-3">
          {rounds.map((r, idx) => (
            <div key={idx} className="border border-tactical-border rounded-lg p-3 bg-tactical-raised/30">
              <div className="flex items-center justify-between mb-2">
                <div className="font-sans text-xs font-bold text-tactical-text">
                  {t('editor.game.round', { defaultValue: 'Round' })} {idx + 1}
                  {r.name && r.name !== `Round ${idx + 1}` && <span className="text-signal-cyan"> · {r.name}</span>}
                  {(r.chaosEvents?.length ?? 0) > 0 && (
                    <span className="ml-2 font-normal text-signal-amber">
                      <Zap className="w-3 h-3 inline -mt-0.5" /> {r.chaosEvents.length} {t('editor.game.scripted_chaos', { defaultValue: 'scripted chaos' })}
                    </span>
                  )}
                </div>
                {rounds.length > 1 && (
                  <button onClick={() => removeRound(idx)} className="text-tactical-dim hover:text-signal-red transition-colors" aria-label="Remove round">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {r.story && (
                <p className="mb-2 font-sans text-[11px] leading-relaxed text-tactical-dim">{r.story}</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <label className={lbl}>{t('editor.game.interval_sec', { defaultValue: 'Build (sec)' })}</label>
                  <input type="number" min={0} className={field} value={r.intervalSec} onChange={(e) => patchRound(idx, { intervalSec: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={lbl}>{t('editor.game.round_duration_sec', { defaultValue: 'Live (sec)' })}</label>
                  <input type="number" min={5} className={field} value={r.durationSec} onChange={(e) => patchRound(idx, { durationSec: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={lbl}>{t('editor.game.traffic', { defaultValue: 'Traffic' })}</label>
                  <select className={field} value={r.loadProfile.type} onChange={(e) => patchRound(idx, { loadProfile: { ...r.loadProfile, type: e.target.value } })}>
                    {LOAD_PROFILES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={lbl}>{t('editor.game.traffic_intensity', { defaultValue: 'Traffic ×' })}</label>
                  <input type="number" min={0.1} step={0.5} className={field} value={r.loadProfile.multiplier ?? 1} onChange={(e) => patchRound(idx, { loadProfile: { ...r.loadProfile, multiplier: Number(e.target.value) } })} />
                </div>
                <div>
                  <label className={lbl}>{t('editor.game.round_weight', { defaultValue: 'Weight' })}</label>
                  <input type="number" min={0} step={0.5} className={field} value={r.weight} onChange={(e) => patchRound(idx, { weight: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={lbl}>{t('editor.game.latency_target', { defaultValue: 'p95 target (ms)' })}</label>
                  <input type="number" min={1} className={field} value={r.scoringConfig.latencyTargetMs} onChange={(e) => patchRoundScoring(idx, { latencyTargetMs: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={lbl}>{t('editor.game.budget', { defaultValue: 'Budget ($/hr)' })}</label>
                  <input type="number" min={0} className={field} value={r.scoringConfig.budgetPerHour} onChange={(e) => patchRoundScoring(idx, { budgetPerHour: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={lbl}>{t('editor.game.w_throughput', { defaultValue: 'w·throughput' })}</label>
                  <input type="number" min={0} step={0.5} className={field} value={r.scoringConfig.wThroughput} onChange={(e) => patchRoundScoring(idx, { wThroughput: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={lbl}>{t('editor.game.w_success', { defaultValue: 'w·success' })}</label>
                  <input type="number" min={0} step={0.5} className={field} value={r.scoringConfig.wSuccess} onChange={(e) => patchRoundScoring(idx, { wSuccess: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={lbl}>{t('editor.game.w_latency', { defaultValue: 'w·latency' })}</label>
                  <input type="number" min={0} step={0.5} className={field} value={r.scoringConfig.wLatency} onChange={(e) => patchRoundScoring(idx, { wLatency: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={lbl}>{t('editor.game.w_cost', { defaultValue: 'w·cost' })}</label>
                  <input type="number" min={0} step={0.5} className={field} value={r.scoringConfig.wCost} onChange={(e) => patchRoundScoring(idx, { wCost: Number(e.target.value) })} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="flex items-center gap-2 font-sans text-xs text-tactical-text">
          <input type="checkbox" checked={allowDelete} onChange={(e) => setAllowDelete(e.target.checked)} className="accent-signal-cyan" />
          {t('editor.game.allow_delete', { defaultValue: 'Allow players to delete starting components' })}
        </label>

        {allowDelete && (
          <div className="mt-3 border border-tactical-border p-3">
            <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-2">
              {t('editor.game.lock_specific', { defaultValue: 'Lock specific components (optional)' })}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
              {preset.nodes.map((n) => (
                <label key={n.config.id} className="flex items-center gap-1.5 font-sans text-[11px] text-tactical-dim">
                  <input type="checkbox" checked={lockedIds.includes(n.config.id)} onChange={() => toggleLocked(n.config.id)} className="accent-signal-cyan" />
                  {n.config.label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <div className="mt-3 text-signal-red font-sans text-xs">{error}</div>}

      <button
        onClick={create}
        disabled={submitting}
        className="mt-4 px-4 py-2 font-sans text-sm rounded-md border border-signal-green text-signal-green hover:bg-signal-green/10 transition-colors flex items-center gap-2 disabled:opacity-50"
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
      const res = await apiClient.get(`/api/games/host/${code}`);
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
    await api.patch(`/api/games/host/${code}`, body);
    fetchDetail();
  };

  const sendAnnouncement = async (message: string) => {
    await apiClient.post(`/api/games/host/${code}/announce`, { message });
    fetchDetail();
  };

  const injectChaos = async () => {
    const target = chaosTarget || session?.starting_architecture?.nodes?.[0]?.id;
    if (!target) return;
    await apiClient.post(`/api/games/host/${code}/chaos`, {
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
  const phase = session.phase ?? 'lobby';
  const totalRounds = session.total_rounds ?? session.rounds?.length ?? 0;
  const curRound = session.current_round ?? 0;
  const nextRound = Math.min(totalRounds, curRound + 1);
  const hasNextRound = curRound < totalRounds;
  const btn = 'px-3 py-1.5 font-sans text-xs rounded-md border transition-colors flex items-center gap-1.5';

  const serverNow = now + offsetRef.current;
  const startsMs = session.starts_at ? new Date(session.starts_at).getTime() : null;
  const roundEndsMs = session.round_ends_at ? new Date(session.round_ends_at).getTime() : null;
  const countdownSec = startsMs ? (startsMs - serverNow) / 1000 : null;
  const roundLeftSec = roundEndsMs ? (roundEndsMs - serverNow) / 1000 : null;

  // Shift the scheduled lobby-open time, never into the past.
  const shiftStart = (deltaSec: number) => {
    const base = startsMs && startsMs > serverNow ? startsMs : serverNow;
    const next = Math.max(serverNow, base + deltaSec * 1000);
    patch({ starts_at: new Date(next).toISOString() });
  };

  const tinyBtn = 'px-2 py-1 font-sans text-[11px] rounded-md border border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan transition-colors inline-flex items-center gap-1';

  const phaseLabel =
    phase === 'round'
      ? t('editor.game.round_live', { defaultValue: 'Round {{n}}/{{total}} · Live', n: curRound, total: totalRounds })
      : phase === 'interval'
      ? t('editor.game.building', { defaultValue: 'Build phase · Round {{n}} next', n: nextRound })
      : phase === 'ended'
      ? t('editor.game.ended', { defaultValue: 'Ended' })
      : t('editor.game.lobby', { defaultValue: 'Lobby' });

  return (
    <div className="mt-3 border-t border-tactical-border pt-3">
      {/* Phase + round controls */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border font-sans text-xs ${phase === 'round' ? 'border-signal-green text-signal-green' : phase === 'ended' ? 'border-signal-red text-signal-red' : 'border-signal-amber text-signal-amber'}`}>
          <Layers className="w-3.5 h-3.5" /> {phaseLabel}
        </span>

        {phase !== 'round' && phase !== 'ended' && hasNextRound && (
          <>
            {phase === 'lobby' && (
              <button onClick={() => patch({ action: 'open_interval' })} className={`${btn} border-signal-cyan text-signal-cyan hover:bg-signal-cyan/10`}>
                <Hammer className="w-3.5 h-3.5" /> {t('editor.game.open_build', { defaultValue: 'Open build phase' })}
              </button>
            )}
            <button onClick={() => patch({ action: 'start_round' })} className={`${btn} border-signal-green text-signal-green hover:bg-signal-green/10`}>
              <Play className="w-3.5 h-3.5" /> {t('editor.game.start_round', { defaultValue: 'Start round {{n}}', n: nextRound })}
            </button>
          </>
        )}

        {phase === 'round' && (
          <>
            {status === 'running' ? (
              <button onClick={() => patch({ action: 'pause' })} className={`${btn} border-signal-amber text-signal-amber hover:bg-signal-amber/10`}>
                <Pause className="w-3.5 h-3.5" /> {t('editor.game.pause', { defaultValue: 'Pause' })}
              </button>
            ) : (
              <button onClick={() => patch({ action: 'resume' })} className={`${btn} border-signal-green text-signal-green hover:bg-signal-green/10`}>
                <Play className="w-3.5 h-3.5" /> {t('editor.game.resume', { defaultValue: 'Resume' })}
              </button>
            )}
            <button onClick={() => patch({ action: 'end_round' })} className={`${btn} border-signal-cyan text-signal-cyan hover:bg-signal-cyan/10`}>
              <SkipForward className="w-3.5 h-3.5" /> {curRound >= totalRounds ? t('editor.game.finish_match', { defaultValue: 'Finish match' }) : t('editor.game.end_round', { defaultValue: 'End round' })}
            </button>
          </>
        )}

        {phase !== 'ended' && (
          <button onClick={() => patch({ action: 'end' })} className={`${btn} border-signal-red text-signal-red hover:bg-signal-red/10`}>
            <Flag className="w-3.5 h-3.5" /> {t('editor.game.end', { defaultValue: 'End match' })}
          </button>
        )}

        <div className="border-l border-tactical-line h-6 mx-1" />

        <label className="flex items-center gap-2 font-sans text-xs text-tactical-dim">
          {t('editor.game.traffic', { defaultValue: 'Traffic' })}
          <select
            value={session.load_profile?.type ?? 'constant'}
            onChange={(e) => patch({ load_profile: { ...session.load_profile, type: e.target.value } })}
            className="bg-tactical-raised border border-tactical-border rounded-md px-2 py-1 font-sans text-xs text-tactical-text"
          >
            {LOAD_PROFILES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 font-sans text-xs text-tactical-dim">
          {t('editor.game.traffic_intensity', { defaultValue: 'Traffic ×' })}
          <input
            type="number"
            min={0.1}
            step={0.5}
            value={session.load_profile?.multiplier ?? 1}
            onChange={(e) => patch({ load_profile: { ...session.load_profile, multiplier: Number(e.target.value) } })}
            className="w-16 bg-tactical-raised border border-tactical-border rounded-md px-2 py-1 font-mono text-xs text-tactical-text"
          />
        </label>
        <label className="flex items-center gap-2 font-sans text-xs text-tactical-dim">
          <input
            type="checkbox"
            checked={session.allow_delete_starting ?? true}
            onChange={(e) => patch({ allow_delete_starting: e.target.checked })}
            className="accent-signal-cyan"
          />
          {t('editor.game.allow_delete_live', { defaultValue: 'Players can delete components' })}
        </label>

        <div className="border-l border-tactical-line h-6 mx-1" />

        <label className="flex items-center gap-2 font-sans text-xs text-tactical-dim" title={t('editor.game.join_public_hint', { defaultValue: 'Anyone with the match code can join.' })}>
          <input
            type="checkbox"
            checked={session.join_open ?? true}
            onChange={(e) => patch({ join_open: e.target.checked })}
            className="accent-signal-cyan"
          />
          {t('editor.game.open_joining', { defaultValue: 'Open joining' })}
        </label>
        <label className="flex items-center gap-2 font-sans text-xs text-tactical-dim" title={t('editor.game.listed_hint', { defaultValue: 'Visitors browsing the arena will see this match.' })}>
          <input
            type="checkbox"
            checked={session.listed ?? true}
            onChange={(e) => patch({ listed: e.target.checked })}
            className="accent-signal-cyan"
          />
          {t('editor.game.listed_live', { defaultValue: 'Listed on the arena' })}
        </label>
      </div>

      {/* Time controls: lobby countdown / live round time + fine adjustments */}
      <div className="flex flex-wrap items-center gap-3 mb-4 bg-tactical-raised/40 border border-tactical-border rounded-lg p-3">
        <div className="inline-flex items-center gap-2">
          <Clock className="w-4 h-4 text-signal-cyan" />
          {phase === 'round' ? (
            <span className="font-sans text-sm text-tactical-text">
              {roundLeftSec !== null ? (
                <>
                  {t('editor.game.round_time_left', { defaultValue: 'Round time left' })}{' '}
                  <span className="font-bold text-signal-amber tabular-nums">{fmtClock(roundLeftSec)}</span>
                </>
              ) : (
                t('editor.game.open_ended', { defaultValue: 'Open-ended' })
              )}
            </span>
          ) : phase === 'lobby' && countdownSec !== null ? (
            <span className="font-sans text-sm text-tactical-text">
              {t('editor.game.lobby_opens_in', { defaultValue: 'Lobby opens in' })}{' '}
              <span className="font-bold text-signal-green tabular-nums">{fmtClock(countdownSec)}</span>
            </span>
          ) : (
            <span className="font-sans text-sm text-tactical-dim capitalize">{phaseLabel}</span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {phase === 'lobby' && (
            <>
              <button onClick={() => shiftStart(-60)} className={tinyBtn}><Minus className="w-3 h-3" />1m</button>
              <button onClick={() => shiftStart(60)} className={tinyBtn}><Plus className="w-3 h-3" />1m</button>
            </>
          )}
          {phase === 'round' && (
            <>
              <span className="font-sans text-[11px] text-tactical-label">{t('editor.game.adjust_time', { defaultValue: 'Adjust round' })}</span>
              <button onClick={() => patch({ add_sec: -30 })} className={tinyBtn}><Minus className="w-3 h-3" />30s</button>
              <button onClick={() => patch({ add_sec: 30 })} className={tinyBtn}><Plus className="w-3 h-3" />30s</button>
              <button onClick={() => patch({ add_sec: 60 })} className={tinyBtn}><Plus className="w-3 h-3" />1m</button>
            </>
          )}
        </div>
      </div>

      {/* Rounds summary */}
      {(session.rounds?.length ?? 0) > 0 && (
        <div className="mb-4 bg-tactical-raised/40 border border-tactical-border rounded-lg p-3">
          <div className="flex items-center gap-2 font-sans text-[11px] font-medium text-slate-600 dark:text-signal-amber mb-2">
            <Layers className="w-3.5 h-3.5" /> {t('editor.game.rounds', { defaultValue: 'Rounds' })}
          </div>
          <div className="flex flex-wrap gap-2">
            {session.rounds!.map((r, i) => (
              <div
                key={i}
                className={`px-2 py-1 rounded-md border font-sans text-[11px] ${i + 1 === curRound && phase === 'round' ? 'border-signal-green text-signal-green' : 'border-tactical-border text-tactical-dim'}`}
              >
                R{i + 1}: {r.durationSec}s · {r.loadProfile?.type ?? 'constant'} · ×{r.weight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chaos injection */}
      <div className="flex flex-wrap items-end gap-2 mb-4 bg-tactical-raised/40 border border-tactical-border rounded-lg p-3">
        <div>
          <label className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-1 block">{t('editor.game.chaos_type', { defaultValue: 'Chaos' })}</label>
          <select value={chaosType} onChange={(e) => setChaosType(e.target.value as typeof chaosType)} className="bg-tactical-raised border border-tactical-border rounded-md px-2 py-1 font-sans text-xs text-tactical-text">
            {CHAOS_TYPES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-1 block">{t('editor.game.target', { defaultValue: 'Target' })}</label>
          <select value={chaosTarget} onChange={(e) => setChaosTarget(e.target.value)} className="bg-tactical-raised border border-tactical-border rounded-md px-2 py-1 font-sans text-xs text-tactical-text">
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>{n.config.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-1 block">{t('editor.game.duration_sec', { defaultValue: 'Sec' })}</label>
          <input type="number" min={1} value={chaosDuration} onChange={(e) => setChaosDuration(Number(e.target.value))} className="w-16 bg-tactical-raised border border-tactical-border rounded-md px-2 py-1 font-mono text-xs text-tactical-text" />
        </div>
        <button onClick={injectChaos} disabled={status !== 'running'} className={`${btn} border-signal-amber text-signal-amber hover:bg-signal-amber/10 disabled:opacity-40`}>
          <Zap className="w-3.5 h-3.5" /> {t('editor.game.inject', { defaultValue: 'Inject' })}
        </button>
      </div>

      {/* Broadcast announcement to all players */}
      <div className="mb-4 bg-tactical-raised/40 border border-tactical-border rounded-lg p-3">
        <div className="flex items-center gap-2 font-sans text-[11px] font-medium text-slate-600 dark:text-signal-amber mb-2">
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
            className="flex-1 min-w-[200px] bg-tactical-raised border border-tactical-border rounded-md px-2 py-1.5 font-sans text-xs text-tactical-text"
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
          <div className="mt-2 font-sans text-[11px] text-tactical-dim">
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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const statusTone =
    session.status === 'running'
      ? 'text-signal-green'
      : session.status === 'ended'
      ? 'text-signal-red'
      : 'text-signal-amber';

  const remove = async () => {
    if (!confirm(t('editor.game.delete_confirm', { defaultValue: 'Delete this match permanently?' }))) return;
    await apiClient.delete(`/api/games/host/${session.code}`);
    onChanged();
  };

  return (
    <div className="tactical-panel p-4 mb-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="font-sans text-sm font-bold text-tactical-text">
          {session.name || 'Untitled'}{' '}
          <span className="text-tactical-label">#{session.code}</span>
        </div>
        <span className={`font-sans text-xs capitalize ${statusTone}`}>{session.status}</span>
        <span className="font-sans text-xs text-tactical-dim">{session.starting_architecture?.nodes?.length ?? 0} parts</span>
        {session.join_open === false && (
          <span className="inline-flex items-center gap-1 font-sans text-[11px] text-signal-amber" title={t('editor.game.join_private_hint', { defaultValue: 'Only people with your invite link can join.' })}>
            <Lock className="w-3 h-3" /> {t('editor.game.chip_private', { defaultValue: 'Invite only' })}
          </span>
        )}
        {session.listed === false && (
          <span className="inline-flex items-center gap-1 font-sans text-[11px] text-tactical-dim" title={t('editor.game.unlisted_hint', { defaultValue: 'Hidden from the arena.' })}>
            <EyeOff className="w-3 h-3" /> {t('editor.game.chip_unlisted', { defaultValue: 'Unlisted' })}
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <CopyButton text={inviteUrl(session)} />
          <a
            href={stageUrl(session.code)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-tactical-border text-tactical-dim hover:border-signal-amber hover:text-signal-amber font-sans text-xs transition-colors"
            title={stageUrl(session.code)}
          >
            <MonitorPlay className="w-3.5 h-3.5" /> {t('editor.game.stage', { defaultValue: 'Stage' })}
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan font-sans text-xs transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" /> {t('editor.game.manage', { defaultValue: 'Manage' })}
          </button>
          <button
            onClick={remove}
            aria-label={t('editor.game.delete_match', { defaultValue: 'Delete match' })}
            title={t('editor.game.delete_match', { defaultValue: 'Delete match' })}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-tactical-border text-tactical-dim hover:border-signal-red hover:text-signal-red font-sans text-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="mt-1 font-sans text-[11px] text-tactical-label break-all">{inviteUrl(session)}</div>
      {open && <ManageMatch code={session.code} />}
    </div>
  );
}

export default function HostConsole() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/games/host');
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

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-tactical-bg">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-1">
          <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t('editor.game.console', { defaultValue: 'Host console' })}</div>
          <Link to="/arena" className="font-sans text-xs text-signal-cyan hover:underline">
            ← {t('editor.game.back_to_arena', { defaultValue: 'Back to the arena' })}
          </Link>
        </div>
        <h1 className="text-2xl md:text-3xl font-sans font-bold mb-2 tracking-tight text-slate-900 dark:text-tactical-text flex items-center gap-3">
          <Gamepad2 className="w-7 h-7 text-signal-cyan" />
          {t('editor.game.console_title', { defaultValue: 'Host a Match' })}
        </h1>
        <p className="font-sans text-sm text-slate-500 dark:text-tactical-dim mb-6 max-w-2xl">
          {t('editor.game.console_subtitle', {
            defaultValue:
              'Pick a scenario, create the match, then share the join link with your players and the stage link with your audience.',
          })}
        </p>

        <CreateMatch onCreated={fetchSessions} />

        <div className="flex items-center gap-2 font-sans text-[11px] font-medium text-slate-600 dark:text-signal-amber mb-3">
          {t('editor.game.matches', { defaultValue: 'Your matches' })}
          <button onClick={fetchSessions} className="text-tactical-dim hover:text-signal-cyan transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="font-sans text-sm text-tactical-dim">Loading…</div>
        ) : sessions.length === 0 ? (
          <div className="font-sans text-sm text-tactical-dim">{t('editor.game.no_matches', { defaultValue: 'No matches yet. Create one above.' })}</div>
        ) : (
          sessions.map((s) => <MatchRow key={s.code} session={s} onChanged={fetchSessions} />)
        )}
      </div>
    </div>
  );
}
