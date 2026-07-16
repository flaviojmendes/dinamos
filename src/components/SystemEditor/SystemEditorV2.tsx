import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  Connection,
  ConnectionMode,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useTranslation } from 'react-i18next';
import { Play, Pause, SkipForward, RotateCcw, Download, Upload, Settings2, Copy, Unplug, Zap, Trash2, ArrowDownUp, ArrowLeftRight, Undo2, Redo2, Plus, SlidersHorizontal, Boxes, X, Save, Share2, FolderOpen, Link2, Check, type LucideIcon } from 'lucide-react';

import {
  NodeConfig,
  NodeKind,
  SimulationFrame,
  defaultsForKind,
} from './engine/types';
import { Simulator } from './engine/simulator';
import { makeLoadProfile, LoadProfileType, ChaosEvent, getPreset } from './engine/scenarios';
import { CloudProvider, estimateCostFromMetrics } from './engine/costModel';

import SimNode, { SimNodeData } from './ui/SimNode';
import { NODE_CATALOG, PALETTE_ORDER, KIND_DEFAULT_LABEL } from './ui/nodeCatalog';
import { MetricsContext } from './ui/MetricsContext';
import InspectorPanel from './ui/InspectorPanel';
import CostPanel from './ui/CostPanel';
import Dashboard from './ui/Dashboard';
import ScenarioBar from './ui/ScenarioBar';
import { parseDesign, serializeDesign, SerializedNode, DesignV2 } from './ui/persistence';
import { apiClient } from '../../app/utils/api';
import { layoutGraph, LayoutDirection } from './ui/autoLayout';
import { useGameContext } from './game/GameContext';
import type { ScoreSubmission } from './game/types';
import { architectureToRF, rfToArchitecture } from './game/architecture';
import {
  frameScore,
  normalizeScoring,
  emptyAccumulator,
  accumulate,
  applyCompliance,
  type ScoreAccumulator,
} from './engine/scoring';
import { evaluateCompliance, type ComplianceResult } from './engine/compliance';
import { stableHash } from './engine/stableHash';
import GameBanner from './game/GameBanner';
import GameLeaderboard from './game/GameLeaderboard';
import RoundFX from './game/RoundFX';
import RoundResults from './game/RoundResults';
import { useIsTouchLayout } from './ui/useIsTouchLayout';
import BottomSheet from './ui/BottomSheet';
import MobilePalette from './ui/MobilePalette';
import SelectionActionBar from './ui/SelectionActionBar';

type RFNode = Node<SimNodeData>;

interface SavedArchitectureSummary {
  id: string;
  title: string | null;
  visibility: 'private' | 'unlisted' | 'public';
  updated_at: string | null;
}

interface SavedArchitectureRow extends SavedArchitectureSummary {
  design: DesignV2;
}

const nodeTypes = Object.fromEntries(
  Object.keys(NODE_CATALOG).map((k) => [k, SimNode]),
) as Record<string, typeof SimNode>;

function presetToRF(presetId: string): { nodes: RFNode[]; edges: Edge[]; seed: number } {
  const preset = getPreset(presetId) ?? getPreset('three-tier')!;
  const nodes: RFNode[] = preset.nodes.map((n) => ({
    id: n.config.id,
    type: n.config.kind,
    position: n.position,
    data: { config: n.config },
  }));
  const edges: Edge[] = preset.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? 'bottom',
    targetHandle: e.targetHandle ?? 'top',
    animated: true,
    style: { strokeWidth: 2.5 },
  }));
  return { nodes, edges, seed: preset.seed };
}

function ContextItem({
  icon: Icon,
  label,
  onClick,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  tone?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-1.5 font-sans text-xs text-left hover:bg-slate-100 dark:hover:bg-tactical-line ${tone ?? 'text-slate-700 dark:text-tactical-text'}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" /> {label}
    </button>
  );
}

// Small copy-to-clipboard row used by the share panel.
function CopyField({ value, label }: { value: string; label: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable; the field is still selectable */
    }
  };
  return (
    <div>
      <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-1">{label}</div>
      <div className="flex items-stretch gap-2">
        <input
          readOnly
          value={value}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 bg-slate-50 dark:bg-tactical-raised border border-slate-200 dark:border-tactical-border rounded-md px-2 py-1.5 font-mono text-[11px] text-slate-700 dark:text-tactical-text"
        />
        <button
          onClick={copy}
          className="shrink-0 inline-flex items-center gap-1 px-2.5 rounded-md border border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan font-sans text-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
          {copied ? t('editor.save.copied', { defaultValue: 'Copied' }) : t('editor.save.copy', { defaultValue: 'Copy' })}
        </button>
      </div>
    </div>
  );
}

function SharePanel({
  designId,
  title,
  visibility,
  canSave,
  saving,
  onSave,
  onTitleChange,
  onVisibilityChange,
  onClose,
}: {
  designId: string | null;
  title: string;
  visibility: 'private' | 'unlisted' | 'public';
  canSave: boolean;
  saving: boolean;
  onSave: () => void;
  onTitleChange: (value: string) => void;
  onVisibilityChange: (value: 'private' | 'unlisted' | 'public') => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = designId ? `${origin}/editor?design=${designId}` : '';
  const embedUrl = designId ? `${origin}/embed/editor/${designId}` : '';
  const embedSnippet = `<iframe src="${embedUrl}" width="100%" height="600" style="border:0" loading="lazy" title="${title || 'Distributed system'}"></iframe>`;
  const isShareable = visibility !== 'private';
  const isSaved = !!designId;

  return (
    <div className="tactical-panel p-4 mb-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-sans text-sm font-medium text-slate-700 dark:text-tactical-text">
          {t('editor.save.share_title', { defaultValue: 'Share this architecture' })}
        </div>
        <button onClick={onClose} aria-label={t('editor.errors.dismiss', { defaultValue: 'Dismiss' })} className="text-tactical-dim hover:text-tactical-text">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t('editor.save.title_label', { defaultValue: 'Title' })}</span>
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={t('editor.save.title_placeholder', { defaultValue: 'Untitled architecture' })}
            className="mt-1 w-full bg-slate-50 dark:bg-tactical-raised border border-slate-200 dark:border-tactical-border rounded-md px-2 py-1.5 font-sans text-xs text-slate-700 dark:text-tactical-text"
          />
        </label>
        <label className="block">
          <span className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t('editor.save.visibility_label', { defaultValue: 'Visibility' })}</span>
          <select
            value={visibility}
            onChange={(e) => onVisibilityChange(e.target.value as 'private' | 'unlisted' | 'public')}
            className="mt-1 w-full bg-slate-50 dark:bg-tactical-raised border border-slate-200 dark:border-tactical-border rounded-md px-2 py-1.5 font-sans text-xs text-slate-700 dark:text-tactical-text"
          >
            <option value="private">{t('editor.save.visibility_private', { defaultValue: 'Private (only me)' })}</option>
            <option value="unlisted">{t('editor.save.visibility_unlisted', { defaultValue: 'Unlisted (anyone with the link)' })}</option>
            <option value="public">{t('editor.save.visibility_public', { defaultValue: 'Public (anyone with the link)' })}</option>
          </select>
        </label>
      </div>

      {!isSaved ? (
        // Not saved yet: ask the user to save before a link can be generated.
        canSave ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="flex-1 font-sans text-xs text-tactical-dim">
              {t('editor.save.save_to_share', { defaultValue: 'Save this architecture to generate a share link and embed code.' })}
            </p>
            <button
              onClick={onSave}
              disabled={saving}
              className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-signal-cyan text-signal-cyan hover:bg-signal-cyan/10 font-sans text-xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving
                ? t('editor.save.saving', { defaultValue: 'Saving…' })
                : t('editor.save.save_and_share', { defaultValue: 'Save & create link' })}
            </button>
          </div>
        ) : (
          <p className="font-sans text-xs text-tactical-dim">
            {t('editor.save.sign_in_to_save', { defaultValue: 'Sign in to save & share' })}
          </p>
        )
      ) : isShareable ? (
        <div className="space-y-3">
          <CopyField value={shareUrl} label={t('editor.save.link_label', { defaultValue: 'Share link' })} />
          <CopyField value={embedSnippet} label={t('editor.save.embed_label', { defaultValue: 'Embed (iframe)' })} />
        </div>
      ) : (
        <p className="font-sans text-xs text-tactical-dim">
          {t('editor.save.private_hint', { defaultValue: 'Set visibility to Unlisted or Public to get a shareable link and embed code.' })}
        </p>
      )}
    </div>
  );
}

function LibraryModal({
  items,
  loading,
  currentId,
  onLoad,
  onDelete,
  onClose,
}: {
  items: SavedArchitectureSummary[];
  loading: boolean;
  currentId: string | null;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="tactical-panel w-full max-w-lg max-h-[80vh] overflow-y-auto p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-sans text-sm font-medium text-slate-700 dark:text-tactical-text">
            {t('editor.save.my_designs', { defaultValue: 'My designs' })}
          </div>
          <button onClick={onClose} aria-label={t('editor.errors.dismiss', { defaultValue: 'Dismiss' })} className="text-tactical-dim hover:text-tactical-text">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <p className="font-sans text-xs text-tactical-dim py-6 text-center">{t('editor.save.loading', { defaultValue: 'Loading…' })}</p>
        ) : items.length === 0 ? (
          <p className="font-sans text-xs text-tactical-dim py-6 text-center">{t('editor.save.empty', { defaultValue: 'No saved architectures yet. Build something and hit Save.' })}</p>
        ) : (
          <ul className="space-y-2">
            {items.map((it) => (
              <li
                key={it.id}
                className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 ${it.id === currentId ? 'border-signal-cyan' : 'border-tactical-border'}`}
              >
                <button onClick={() => onLoad(it.id)} className="flex-1 text-left min-w-0">
                  <div className="font-sans text-sm text-slate-700 dark:text-tactical-text truncate">
                    {it.title || t('editor.save.untitled', { defaultValue: 'Untitled architecture' })}
                  </div>
                  <div className="font-sans text-[11px] text-tactical-dim">
                    {t(`editor.save.visibility_${it.visibility}_short`, { defaultValue: it.visibility })}
                    {it.updated_at ? ` · ${new Date(it.updated_at).toLocaleDateString()}` : ''}
                  </div>
                </button>
                <button
                  onClick={() => onDelete(it.id)}
                  aria-label={t('editor.save.delete', { defaultValue: 'Delete' })}
                  className="shrink-0 text-tactical-dim hover:text-signal-red"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export interface SystemEditorV2Props {
  gameId?: string;
  /** Hydrate the canvas from a saved design (e.g. a recovered/embedded build). */
  initialDesign?: DesignV2 | null;
  /** View-only mode: no editing/saving, but pan/zoom and running the sim stay on. */
  readOnly?: boolean;
  /** Hide the save/share library affordances (used by the embed view). */
  hideChrome?: boolean;
}

function EditorInner({ gameId, initialDesign, readOnly, hideChrome }: SystemEditorV2Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const game = useGameContext();
  const gameState = game?.state ?? null;
  const gameActive = !!gameId && !!game;
  // During a live round players are locked out of editing; they build during
  // intervals (and the lobby). Non-game sessions are always editable. Read-only
  // (embed/share view) freezes editing the same way a live round does.
  const frozen = (gameActive && gameState?.phase === 'round') || !!readOnly;
  const initial = useMemo(() => presetToRF('three-tier'), []);

  const [nodes, setNodes, onNodesChange] = useNodesState<SimNodeData>(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(2); // ticks per second
  const [seed, setSeed] = useState(initial.seed);

  const [metrics, setMetrics] = useState<Record<string, SimulationFrame['nodeMetrics'][string]>>({});
  const [history, setHistory] = useState<SimulationFrame[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [warnings, setWarnings] = useState<string[]>([]);

  const [profileType, setProfileType] = useState<LoadProfileType>('constant');
  // Admin-set traffic intensity (multiplier on top of the profile shape).
  const [profileMultiplier, setProfileMultiplier] = useState(1);
  const [provider, setProvider] = useState<CloudProvider>('aws');
  const [chaos, setChaos] = useState<ChaosEvent[]>([]);
  const [importError, setImportError] = useState<string | null>(null);

  // --- Saved architectures (DB persistence: recover + share + embed) ---
  // Identity of the currently-loaded saved design, so Save re-saves in place.
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);
  // Pre-populated, inline-editable title so there is always something to save.
  const defaultTitle = t('editor.save.untitled', { defaultValue: 'Untitled architecture' });
  const [currentTitle, setCurrentTitle] = useState(defaultTitle);
  const [currentVisibility, setCurrentVisibility] = useState<'private' | 'unlisted' | 'public'>('private');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [library, setLibrary] = useState<SavedArchitectureSummary[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const initialDesignHydratedRef = useRef(false);

  const [menu, setMenu] = useState<{ kind: 'node' | 'edge' | 'pane'; id: string; x: number; y: number } | null>(null);
  const [showBill, setShowBill] = useState(false);

  // --- Touch / mobile layout state ---
  const isTouch = useIsTouchLayout();
  type MobileSheet = 'palette' | 'scenario' | 'tools' | 'inspector' | null;
  const [sheet, setSheet] = useState<MobileSheet>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const simRef = useRef<Simulator | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const rf = useReactFlow();

  // --- Game mode state (only used when gameId is set) ---
  // Live refs so the synced run loop / score submitter read fresh values
  // without re-subscribing on every poll.
  const gameRef = useRef(game);
  gameRef.current = game;
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Latest-value freeze check for use inside callbacks (avoids re-creating them
  // on every poll). Editing is blocked only while a round is live.
  const isFrozen = useCallback(
    () => gameActive && gameStateRef.current?.phase === 'round',
    [gameActive],
  );
  const scoreRef = useRef<ScoreAccumulator>(emptyAccumulator());
  const lastFrameRef = useRef<SimulationFrame | null>(null);
  const seededKeyRef = useRef<string | null>(null);
  const finalSubmittedRef = useRef<string | null>(null);
  const lastSubmittedArchHashRef = useRef<string | null>(null);
  // Latest house-rules verdict, read by the synced round loop.
  const complianceRef = useRef<ComplianceResult>({ ok: true, violations: [] });

  const isNodeLocked = useCallback(
    (id: string | null) =>
      !!id && nodesRef.current.some((n) => n.id === id && n.data.config.locked),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // --- Undo / redo history (graph snapshots) ---
  // We keep stacks of {nodes, edges} snapshots. `takeSnapshot` is called at the
  // start of every mutating action to record the pre-change state; undo/redo
  // then swap the current graph with the neighbouring snapshot.
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  nodesRef.current = nodes;
  edgesRef.current = edges;

  const pastRef = useRef<{ nodes: RFNode[]; edges: Edge[] }[]>([]);
  const futureRef = useRef<{ nodes: RFNode[]; edges: Edge[] }[]>([]);
  const [, setHistoryVersion] = useState(0);
  const snapshotGuardRef = useRef(false);
  const lastPatchAtRef = useRef(0);
  const MAX_HISTORY = 100;

  const takeSnapshot = useCallback(() => {
    // Coalesce multiple snapshots fired within the same gesture (e.g. deleting a
    // node also deletes its edges, firing two callbacks synchronously).
    if (snapshotGuardRef.current) return;
    snapshotGuardRef.current = true;
    queueMicrotask(() => {
      snapshotGuardRef.current = false;
    });
    pastRef.current.push({ nodes: nodesRef.current, edges: edgesRef.current });
    if (pastRef.current.length > MAX_HISTORY) pastRef.current.shift();
    futureRef.current = [];
    setHistoryVersion((v) => v + 1);
  }, []);

  const undo = useCallback(() => {
    if (isFrozen()) return;
    const previous = pastRef.current.pop();
    if (!previous) return;
    futureRef.current.push({ nodes: nodesRef.current, edges: edgesRef.current });
    setNodes(previous.nodes);
    setEdges(previous.edges);
    setSelectedId(null);
    setHistoryVersion((v) => v + 1);
  }, [setNodes, setEdges, isFrozen]);

  const redo = useCallback(() => {
    if (isFrozen()) return;
    const next = futureRef.current.pop();
    if (!next) return;
    pastRef.current.push({ nodes: nodesRef.current, edges: edgesRef.current });
    setNodes(next.nodes);
    setEdges(next.edges);
    setSelectedId(null);
    setHistoryVersion((v) => v + 1);
  }, [setNodes, setEdges, isFrozen]);

  const canUndo = pastRef.current.length > 0 && !frozen;
  const canRedo = futureRef.current.length > 0 && !frozen;

  // Keyboard shortcuts: Cmd/Ctrl+Z = undo, Cmd/Ctrl+Shift+Z or Ctrl+Y = redo.
  // Ignored while typing in form fields so native text undo keeps working.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return;
      const key = e.key.toLowerCase();
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  // Map ReactFlow graph -> engine config.
  const buildConfig = useCallback(
    () => ({
      nodes: nodes.map((n) => n.data.config),
      edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
      seed,
      dtSeconds: 1,
      traceSamples: 2000,
    }),
    [nodes, edges, seed],
  );

  // Create the simulator once.
  if (!simRef.current) {
    simRef.current = new Simulator(buildConfig());
  }

  // Keep the engine graph / profile / chaos in sync with the UI.
  useEffect(() => {
    simRef.current?.setGraph(
      nodes.map((n) => n.data.config),
      edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
    );
  }, [nodes, edges]);

  useEffect(() => {
    const base = makeLoadProfile(profileType);
    const mult = profileMultiplier > 0 ? profileMultiplier : 1;
    const profile =
      mult === 1
        ? base
        : { ...base, multiplierAt: (tt: number) => base.multiplierAt(tt) * mult };
    simRef.current?.setProfile(profile);
  }, [profileType, profileMultiplier]);

  useEffect(() => {
    simRef.current?.setChaos(chaos);
  }, [chaos]);

  useEffect(() => {
    simRef.current?.setProvider(provider);
  }, [provider]);

  const applyFrame = useCallback((frame: SimulationFrame) => {
    setMetrics(frame.nodeMetrics);
    setHistory(simRef.current ? [...simRef.current.history] : []);
    setTotalCost(simRef.current?.totalCost ?? 0);
    setSuccessCount(simRef.current?.totalSuccess ?? 0);
    setFailedCount(simRef.current?.totalFailed ?? 0);
    setWarnings(frame.system.warnings);
    // Style edges by flow volume and target load.
    setEdges((eds) =>
      eds.map((edge) => {
        const flow = frame.edgeFlow[edge.id] ?? 0;
        const targetUtil = frame.nodeMetrics[edge.target]?.utilization ?? 0;
        const strokeWidth = Math.max(2.5, Math.min(12, Math.log10(flow + 1) * 3.2));
        const stroke = targetUtil >= 1 ? '#ef4444' : targetUtil >= 0.8 ? '#eab308' : '#64748b';
        return { ...edge, animated: flow > 0, style: { ...edge.style, strokeWidth, stroke } };
      }),
    );
  }, [setEdges]);

  const step = useCallback(() => {
    const frame = simRef.current?.tick();
    if (frame) applyFrame(frame);
  }, [applyFrame]);

  // Run loop.
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(step, Math.max(100, 1000 / speed));
    return () => clearInterval(interval);
  }, [running, speed, step]);

  const reset = useCallback(() => {
    setRunning(false);
    simRef.current?.reset(seed);
    setMetrics({});
    setHistory([]);
    setTotalCost(0); setSuccessCount(0); setFailedCount(0);
    setWarnings([]);
  }, [seed]);

  // ===================== Game mode wiring =====================
  // Seed the graph from the match's starting (or the player's saved) architecture
  // once per match start, applying the admin's lock rules. Guarded so polling
  // never clobbers the player's in-progress edits.
  useEffect(() => {
    if (!gameActive || !gameState) return;
    // Wait until we've joined so we resume the player's saved build on rejoin
    // rather than the pristine starting architecture.
    if (!gameState.joined) return;
    const arch = gameState.my_architecture ?? gameState.starting_architecture;
    if (!arch) return;
    const key = `${gameState.code}:${gameState.started_at ?? gameState.starts_at ?? 'lobby'}`;
    if (seededKeyRef.current === key) return;
    seededKeyRef.current = key;

    const { nodes: gn, edges: ge } = architectureToRF(
      arch,
      gameState.locked_node_ids ?? [],
      gameState.allow_delete_starting ?? true,
    );
    setRunning(false);
    setNodes(gn);
    setEdges(ge);
    setSeed(gameState.seed);
    setSelectedId(null);
    simRef.current?.reset(gameState.seed);
    setProfileType((gameState.load_profile?.type ?? 'constant') as LoadProfileType);
    setProfileMultiplier(gameState.load_profile?.multiplier ?? 1);
    setChaos(gameState.chaos_events ?? []);
    scoreRef.current = emptyAccumulator();
    lastFrameRef.current = null;
    setMetrics({});
    setHistory([]);
    setTotalCost(0); setSuccessCount(0); setFailedCount(0);
    pastRef.current = [];
    futureRef.current = [];
  }, [gameActive, gameState, setNodes, setEdges]);

  // Keep lock state in sync with the admin's rules *after* seeding. The seed
  // computes `locked` only once, so if the admin enables deletion (or toggles
  // which components are locked) mid-match, re-apply it to the nodes already on
  // canvas. We only flip the `locked`/`deletable` flags on existing seed nodes —
  // never add back deleted nodes or lock player-added ones.
  const lockedKey = (gameState?.locked_node_ids ?? []).join(',');
  const allowDelete = gameState?.allow_delete_starting ?? true;
  useEffect(() => {
    if (!gameActive) return;
    const lockSet = new Set(lockedKey ? lockedKey.split(',') : []);
    const lockAll = !allowDelete;
    setNodes((nds) =>
      nds.map((n) => {
        const cfg = n.data.config;
        const isSeed = cfg.origin ? cfg.origin === 'seed' : true;
        const locked = isSeed && (lockAll || lockSet.has(n.id));
        if (!!cfg.locked === locked && n.deletable === !locked) return n;
        return { ...n, deletable: !locked, data: { ...n.data, config: { ...cfg, locked } } };
      }),
    );
  }, [gameActive, lockedKey, allowDelete, setNodes]);

  // Live-sync the broadcast traffic profile (admin can change it mid-match).
  useEffect(() => {
    if (!gameActive || !gameState) return;
    setProfileType((gameState.load_profile?.type ?? 'constant') as LoadProfileType);
    setProfileMultiplier(gameState.load_profile?.multiplier ?? 1);
  }, [gameActive, gameState?.load_profile?.type, gameState?.load_profile?.multiplier]);

  // Live-sync the broadcast chaos timeline (admin injections appear here).
  const chaosKey = gameActive ? JSON.stringify(gameState?.chaos_events ?? []) : '';
  useEffect(() => {
    if (!gameActive) return;
    try {
      setChaos(JSON.parse(chaosKey || '[]'));
    } catch {
      /* ignore */
    }
  }, [gameActive, chaosKey]);

  // When a new round goes live, reset the deterministic sim and the per-round
  // score accumulator so each round is scored independently (from t=0) against
  // the player's carried-over architecture.
  const roundKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!gameActive || !gameState) return;
    if (gameState.phase !== 'round' || !gameState.round_started_at) return;
    const key = `${gameState.code}:r${gameState.current_round}:${gameState.round_started_at}`;
    if (roundKeyRef.current === key) return;
    roundKeyRef.current = key;
    simRef.current?.reset(gameState.seed);
    scoreRef.current = emptyAccumulator();
    lastFrameRef.current = null;
    setMetrics({});
    setHistory([]);
    setTotalCost(0); setSuccessCount(0); setFailedCount(0);
  }, [gameActive, gameState?.phase, gameState?.current_round, gameState?.round_started_at]);

  // Synced round loop: drive the deterministic sim by wall-clock round-time so
  // all players experience the same traffic/chaos at the same simulated second.
  // Runs only while the round is live (not during build intervals).
  useEffect(() => {
    if (!gameActive) return;
    if (gameState?.phase !== 'round' || gameState?.status !== 'running' || !gameState.round_started_at)
      return;
    const startedMs = new Date(gameState.round_started_at).getTime();
    const id = setInterval(() => {
      const g = gameRef.current;
      const gs = gameStateRef.current;
      if (!g || !gs || gs.phase !== 'round') return;
      const offset = g.serverOffsetMs ?? 0;
      let target = Math.floor((Date.now() + offset - startedMs) / 1000);
      if (gs.round_ends_at) {
        const endTick = Math.floor((new Date(gs.round_ends_at).getTime() - startedMs) / 1000);
        if (target > endTick) target = endTick;
      }
      const scoringCfg = normalizeScoring(gs.scoring_config);
      let guard = 0;
      let last = lastFrameRef.current;
      while ((simRef.current?.currentTime ?? 0) < target && guard < 600) {
        const frame = simRef.current?.tick();
        if (frame) {
          last = frame;
          scoreRef.current = accumulate(
            scoreRef.current,
            applyCompliance(
              frameScore(frame.system, scoringCfg),
              complianceRef.current.ok,
            ),
          );
        }
        guard++;
      }
      if (last && last !== lastFrameRef.current) {
        lastFrameRef.current = last;
        applyFrame(last);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [gameActive, gameState?.phase, gameState?.status, gameState?.round_started_at, applyFrame]);

  // Snapshot the latest "golden signals" from the most recent sim frame.
  const gameMetrics = useCallback(() => {
    const frame = lastFrameRef.current;
    if (!frame) return undefined;
    const sys = frame.system;
    let saturation = 0;
    for (const m of Object.values(frame.nodeMetrics)) {
      if (m.utilization > saturation) saturation = m.utilization;
    }
    return {
      throughput: sys.totalThroughput,
      offered_load: sys.offeredLoad,
      error_rate: sys.errorRate,
      p50: sys.p50,
      p95: sys.p95,
      p99: sys.p99,
      saturation,
      cost_per_hour: sys.costPerHour,
    };
  }, []);

  // While a round is live, periodically push the player's per-round score. The
  // architecture blob is included only when its stable hash changes.
  useEffect(() => {
    if (!gameActive || gameState?.phase !== 'round') return;
    const submit = () => {
      const g = gameRef.current;
      const gs = gameStateRef.current;
      if (!g || !gs) return;
      const roundIndex = Math.max(0, (gs.current_round ?? 1) - 1);
      const roundScore = Math.round(scoreRef.current.total);
      const arch = rfToArchitecture(nodesRef.current, edgesRef.current);
      const archHash = stableHash(arch);
      const payload: ScoreSubmission = {
        score: roundScore,
        score_breakdown: scoreRef.current,
        metrics: gameMetrics(),
        round_index: roundIndex,
        round_score: roundScore,
        round_breakdown: scoreRef.current,
      };
      if (archHash !== lastSubmittedArchHashRef.current) {
        payload.architecture = arch;
        lastSubmittedArchHashRef.current = archHash;
      }
      g.submitScore(payload);
    };
    submit();
    const id = setInterval(submit, 4000);
    return () => clearInterval(id);
  }, [gameActive, gameState?.phase, gameState?.current_round, gameMetrics]);

  // During build windows, persist architecture only when it changes (debounced).
  useEffect(() => {
    if (!gameActive) return;
    const phase = gameState?.phase;
    if (phase !== 'interval' && phase !== 'lobby') return;
    const arch = rfToArchitecture(nodesRef.current, edgesRef.current);
    const archHash = stableHash(arch);
    if (archHash === lastSubmittedArchHashRef.current) return;
    const timer = setTimeout(() => {
      const g = gameRef.current;
      const gs = gameStateRef.current;
      if (!g) return;
      const latest = stableHash(rfToArchitecture(nodesRef.current, edgesRef.current));
      if (latest === lastSubmittedArchHashRef.current) return;
      g.submitScore({
        architecture: rfToArchitecture(nodesRef.current, edgesRef.current),
        score: Math.round(gs?.my_score ?? 0),
      });
      lastSubmittedArchHashRef.current = latest;
    }, 1500);
    return () => clearTimeout(timer);
  }, [gameActive, gameState?.phase, nodes, edges]);

  // Submit the final per-round score once when a round ends (transition out of
  // the 'round' phase), covering both the next interval and the match end.
  const lastPhaseRef = useRef<string | null>(null);
  useEffect(() => {
    const prev = lastPhaseRef.current;
    const cur = gameState?.phase ?? null;
    lastPhaseRef.current = cur;
    if (!gameActive) return;
    if (prev !== 'round' || cur === 'round') return;
    const g = gameRef.current;
    const gs = gameStateRef.current;
    if (!g || !gs) return;
    const submitKey = `${gs.code}:r${gs.current_round}`;
    if (finalSubmittedRef.current === submitKey) return;
    finalSubmittedRef.current = submitKey;
    const roundIndex = Math.max(0, (gs.current_round ?? 1) - 1);
    const roundScore = Math.round(scoreRef.current.total);
    g.submitScore({
      architecture: rfToArchitecture(nodesRef.current, edgesRef.current),
      score: roundScore,
      score_breakdown: scoreRef.current,
      metrics: gameMetrics(),
      round_index: roundIndex,
      round_score: roundScore,
      round_breakdown: scoreRef.current,
    });
  }, [gameActive, gameState?.phase, gameMetrics]);

  // --- Node editing ---
  const patchSelected = useCallback(
    (patch: Partial<NodeConfig>) => {
      if (!selectedId || isFrozen()) return;
      // Coalesce rapid edits (e.g. dragging a slider) into one history entry.
      const now = Date.now();
      if (now - lastPatchAtRef.current > 600) takeSnapshot();
      lastPatchAtRef.current = now;
      setNodes((nds) =>
        nds.map((n) => (n.id === selectedId ? { ...n, data: { config: { ...n.data.config, ...patch } } } : n)),
      );
    },
    [selectedId, setNodes, takeSnapshot, isFrozen],
  );

  const deleteSelected = useCallback(() => {
    if (!selectedId || isNodeLocked(selectedId) || isFrozen()) return;
    takeSnapshot();
    setNodes((nds) => nds.filter((n) => n.id !== selectedId));
    setEdges((eds) => eds.filter((e) => e.source !== selectedId && e.target !== selectedId));
    setSelectedId(null);
  }, [selectedId, setNodes, setEdges, takeSnapshot, isNodeLocked, isFrozen]);

  // --- Context-menu actions (operate on an explicit node id) ---
  const deleteNode = useCallback(
    (id: string) => {
      if (isNodeLocked(id) || isFrozen()) return;
      takeSnapshot();
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      setSelectedId((cur) => (cur === id ? null : cur));
    },
    [setNodes, setEdges, takeSnapshot, isNodeLocked, isFrozen],
  );

  const duplicateNode = useCallback(
    (id: string) => {
      if (isFrozen()) return;
      const src = nodes.find((n) => n.id === id);
      if (!src) return;
      takeSnapshot();
      const newId = `n${Date.now()}`;
      const config: NodeConfig = { ...src.data.config, id: newId, label: `${src.data.config.label} (copy)` };
      const newNode: RFNode = {
        id: newId,
        type: src.type,
        position: { x: src.position.x + 48, y: src.position.y + 48 },
        data: { config },
      };
      setNodes((nds) => nds.concat(newNode));
      setSelectedId(newId);
    },
    [nodes, setNodes, takeSnapshot, isFrozen],
  );

  const disconnectNode = useCallback(
    (id: string) => {
      if (isFrozen()) return;
      takeSnapshot();
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    },
    [setEdges, takeSnapshot, isFrozen],
  );

  const killNode = useCallback((id: string) => {
    if (isFrozen()) return;
    setChaos((c) => [
      ...c,
      {
        id: `chaos-${Date.now()}`,
        type: 'killNode',
        targetId: id,
        startSec: Math.ceil(simRef.current?.currentTime ?? 0) + 1,
        durationSec: 15,
      },
    ]);
  }, [isFrozen]);

  const deleteEdge = useCallback(
    (id: string) => {
      if (isFrozen()) return;
      takeSnapshot();
      setEdges((eds) => eds.filter((e) => e.id !== id));
    },
    [setEdges, takeSnapshot, isFrozen],
  );

  const openMenuAt = useCallback((kind: 'node' | 'edge' | 'pane', id: string, event: React.MouseEvent) => {
    event.preventDefault();
    // On touch we replace context menus with the SelectionActionBar / tools sheet.
    if (isTouch) return;
    const bounds = canvasRef.current?.getBoundingClientRect();
    setMenu({
      kind,
      id,
      x: event.clientX - (bounds?.left ?? 0),
      y: event.clientY - (bounds?.top ?? 0),
    });
  }, [isTouch]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedId(node.id);
      setShowBill(false);
      openMenuAt('node', node.id, event);
    },
    [openMenuAt],
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      setSelectedId(null);
      openMenuAt('edge', edge.id, event);
    },
    [openMenuAt],
  );

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent | MouseEvent) => {
      setSelectedId(null);
      setShowBill(false);
      openMenuAt('pane', '', event as React.MouseEvent);
    },
    [openMenuAt],
  );

  const closeMenu = useCallback(() => setMenu(null), []);

  useEffect(() => {
    if (!menu) return;
    const onDocClick = () => setMenu(null);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(null); };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menu]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      if (isFrozen()) return;
      takeSnapshot();
      setEdges((eds) => addEdge({ ...params, id: `e-${(params as Edge).source}-${(params as Edge).target}-${Date.now()}`, animated: true, style: { strokeWidth: 2.5 } }, eds));
    },
    [setEdges, takeSnapshot, isFrozen],
  );

  // Direction is enforced here (not by handle type) so any side of a box can be
  // wired up: a connection is only valid from a node that emits traffic into a
  // node that accepts it, and self-loops are rejected.
  const isValidConnection = useCallback(
    (conn: Connection) => {
      if (!conn.source || !conn.target || conn.source === conn.target) return false;
      const srcKind = nodes.find((n) => n.id === conn.source)?.data.config.kind;
      const tgtKind = nodes.find((n) => n.id === conn.target)?.data.config.kind;
      if (!srcKind || !tgtKind) return false;
      return !!NODE_CATALOG[srcKind]?.hasSource && !!NODE_CATALOG[tgtKind]?.hasTarget;
    },
    [nodes],
  );

  // Auto-arrange the whole graph into clean ranks and re-fit the viewport.
  const applyLayout = useCallback(
    (direction: LayoutDirection) => {
      if (isFrozen()) return;
      takeSnapshot();
      const { nodes: laidOut, edges: rewired } = layoutGraph(nodes, edges, direction);
      setNodes(laidOut);
      setEdges(rewired);
      window.requestAnimationFrame(() => rf.fitView({ padding: 0.3, duration: 400 }));
    },
    [nodes, edges, setNodes, setEdges, rf, takeSnapshot, isFrozen],
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      takeSnapshot();
      setEdges((eds) => eds.filter((e) => !deleted.some((n) => n.id === e.source || n.id === e.target)));
      if (deleted.some((n) => n.id === selectedId)) setSelectedId(null);
    },
    [setEdges, selectedId, takeSnapshot],
  );

  // Snapshot before edges are removed (keyboard delete) and before a node drag
  // starts, so both are individually undoable.
  const onEdgesDelete = useCallback(() => takeSnapshot(), [takeSnapshot]);
  const onNodeDragStart = useCallback(() => takeSnapshot(), [takeSnapshot]);

  const onDragStart = (event: React.DragEvent, kind: NodeKind) => {
    event.dataTransfer.setData('application/dinamos', kind);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Shared node creation used by both desktop drag-drop and touch tap-to-add.
  const addNodeAt = useCallback(
    (kind: NodeKind, position: { x: number; y: number }) => {
      if (isFrozen()) return undefined;
      takeSnapshot();
      const id = `n${Date.now()}`;
      const count = nodesRef.current.filter((n) => n.data.config.kind === kind).length + 1;
      const config = defaultsForKind(kind, id, `${t(`editor.kinds.${kind}`, { defaultValue: KIND_DEFAULT_LABEL[kind] })} ${count}`);
      const newNode: RFNode = { id, type: kind, position, data: { config } };
      setNodes((nds) => nds.concat(newNode));
      return id;
    },
    [setNodes, t, takeSnapshot, isFrozen],
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const kind = event.dataTransfer.getData('application/dinamos') as NodeKind;
      if (!kind) return;
      addNodeAt(kind, rf.screenToFlowPosition({ x: event.clientX, y: event.clientY }));
    },
    [rf, addNodeAt],
  );

  // Touch tap-to-add: drop the node at the centre of the visible canvas.
  const addNodeOfKind = useCallback(
    (kind: NodeKind) => {
      const bounds = canvasRef.current?.getBoundingClientRect();
      const screen = bounds
        ? { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const id = addNodeAt(kind, rf.screenToFlowPosition(screen));
      if (!id) return;
      setSelectedId(id);
      setSheet(null);
    },
    [rf, addNodeAt],
  );

  // --- Presets / persistence ---
  const loadPreset = useCallback(
    (id: string) => {
      takeSnapshot();
      const { nodes: pn, edges: pe, seed: ps } = presetToRF(id);
      setRunning(false);
      setNodes(pn);
      setEdges(pe);
      setSeed(ps);
      setSelectedId(null);
      setChaos([]);
      simRef.current?.reset(ps);
      setMetrics({});
      setHistory([]);
      setTotalCost(0); setSuccessCount(0); setFailedCount(0);
    },
    [setNodes, setEdges, takeSnapshot],
  );

  // Snapshot the current canvas as a DesignV2 document (shared by file export
  // and DB save).
  const buildDesign = useCallback((): DesignV2 => {
    const sNodes: SerializedNode[] = nodes.map((n) => ({ id: n.id, position: n.position, config: n.data.config }));
    return {
      version: '2.0',
      seed,
      profileType,
      chaos,
      nodes: sNodes,
      edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, targetHandle: e.targetHandle })),
    };
  }, [nodes, edges, seed, profileType, chaos]);

  // Hydrate the canvas + simulation from a DesignV2 document (file import, DB
  // recover, embed). Caller decides whether to snapshot for undo first.
  const applyDesign = useCallback(
    (design: DesignV2) => {
      const rfNodes: RFNode[] = design.nodes.map((n) => ({
        id: n.id,
        type: n.config.kind,
        position: n.position,
        data: { config: n.config },
      }));
      setRunning(false);
      setNodes(rfNodes);
      setEdges(design.edges.map((ed) => ({ id: ed.id, source: ed.source, target: ed.target, sourceHandle: ed.sourceHandle ?? 'bottom', targetHandle: ed.targetHandle ?? 'top', animated: true, style: { strokeWidth: 2.5 } })));
      setSeed(design.seed);
      setProfileType(design.profileType);
      setChaos(design.chaos);
      setSelectedId(null);
      simRef.current?.reset(design.seed);
      setMetrics({});
      setHistory([]);
      setTotalCost(0); setSuccessCount(0); setFailedCount(0);
    },
    [setNodes, setEdges],
  );

  // Hydrate once from a server-provided design (recovered share link / embed).
  useEffect(() => {
    if (!initialDesign) return;
    if (initialDesignHydratedRef.current) return;
    initialDesignHydratedRef.current = true;
    applyDesign(initialDesign);
  }, [initialDesign, applyDesign]);

  const exportDesign = useCallback(() => {
    setRunning(false);
    const design = buildDesign();
    const json = serializeDesign(design.nodes, design.edges, design.seed, design.profileType, design.chaos);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `distributed-system-${new Date().toISOString().slice(0, 10)}.din`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [buildDesign]);

  const importDesign = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setRunning(false);
      setImportError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const design = parseDesign(e.target?.result as string);
          takeSnapshot();
          applyDesign(design);
          // An imported file is a fresh local build, not the loaded saved row.
          setCurrentDesignId(null);
        } catch {
          setImportError(t('editor.errors.import_error', { defaultValue: 'Failed to import design file.' }));
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.onerror = () => setImportError(t('editor.errors.read_error', { defaultValue: 'Could not read file.' }));
      reader.readAsText(file);
    },
    [applyDesign, t, takeSnapshot],
  );

  // --- Save / load / share against /api/architectures ---
  const saveDesign = useCallback(async () => {
    if (!user) return;
    setSaveState('saving');
    setSaveError(null);
    try {
      const payload = {
        title: currentTitle || null,
        visibility: currentVisibility,
        design: buildDesign(),
      };
      let row: SavedArchitectureRow;
      if (currentDesignId) {
        const res = await apiClient.put(`/api/architectures/${currentDesignId}`, payload);
        row = res.data;
      } else {
        const res = await apiClient.post('/api/architectures', payload);
        row = res.data;
      }
      setCurrentDesignId(row.id);
      setCurrentTitle(row.title || defaultTitle);
      setCurrentVisibility(row.visibility);
      setSaveState('saved');
      setShowShare(true);
    } catch (err) {
      setSaveState('error');
      setSaveError(t('editor.save.error', { defaultValue: 'Could not save the architecture.' }));
    }
  }, [user, currentTitle, currentVisibility, currentDesignId, buildDesign, defaultTitle, t]);

  // Persist a visibility change immediately for an already-saved design so the
  // share/embed link works without a second explicit save.
  const updateVisibility = useCallback(
    async (visibility: 'private' | 'unlisted' | 'public') => {
      setCurrentVisibility(visibility);
      if (!currentDesignId) return;
      try {
        await apiClient.put(`/api/architectures/${currentDesignId}`, { visibility });
      } catch {
        /* non-fatal; the next full save will retry */
      }
    },
    [currentDesignId],
  );

  // Persist a title edit for an already-saved design (called on blur). New
  // designs just keep the value in state until the first save.
  const updateTitle = useCallback(
    async (title: string) => {
      if (!currentDesignId) return;
      try {
        await apiClient.put(`/api/architectures/${currentDesignId}`, { title: title || null });
      } catch {
        /* non-fatal; the next full save will retry */
      }
    },
    [currentDesignId],
  );

  // Share button: open the share panel. If the design isn't saved yet, the panel
  // prompts the user to save first and then reveals the link/embed.
  const handleShare = useCallback(() => {
    setShowShare(true);
  }, []);

  const openLibrary = useCallback(async () => {
    setShowLibrary(true);
    setLibraryLoading(true);
    try {
      const res = await apiClient.get('/api/architectures');
      setLibrary(res.data.architectures ?? []);
    } catch {
      setLibrary([]);
    } finally {
      setLibraryLoading(false);
    }
  }, []);

  const loadFromLibrary = useCallback(
    async (id: string) => {
      try {
        const res = await apiClient.get(`/api/architectures/${id}`);
        const row: SavedArchitectureRow = res.data;
        takeSnapshot();
        applyDesign(row.design);
        setCurrentDesignId(row.id);
        setCurrentTitle(row.title || defaultTitle);
        setCurrentVisibility(row.visibility);
        setShowLibrary(false);
        setSaveState('idle');
      } catch {
        setImportError(t('editor.save.load_error', { defaultValue: 'Could not load that architecture.' }));
      }
    },
    [applyDesign, takeSnapshot, defaultTitle, t],
  );

  const deleteFromLibrary = useCallback(
    async (id: string) => {
      try {
        await apiClient.delete(`/api/architectures/${id}`);
        setLibrary((items) => items.filter((it) => it.id !== id));
        if (currentDesignId === id) setCurrentDesignId(null);
      } catch {
        /* ignore */
      }
    },
    [currentDesignId],
  );

  const selectedConfig = nodes.find((n) => n.id === selectedId)?.data.config ?? null;
  const nodeOptions = nodes.map((n) => ({ id: n.id, label: n.data.config.label }));
  // id -> label map used by the chaos telegraphs in RoundFX.
  const nodeLabels = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n.data.config.label])),
    [nodes],
  );

  // House-rules check (stateful service, database present, no client→DB, ...).
  // While violated, the round loop earns no points and the banner names the
  // broken rule so players can fix it during the build phase.
  const compliance: ComplianceResult = useMemo(() => {
    if (!gameActive) return { ok: true, violations: [] };
    return evaluateCompliance(
      nodes.map((n) => ({ id: n.id, kind: n.data.config.kind })),
      edges.map((e) => ({ source: e.source, target: e.target })),
    );
  }, [gameActive, nodes, edges]);
  useEffect(() => {
    complianceRef.current = compliance;
  }, [compliance]);

  // Live cloud cost that reacts to capacity edits (service time, concurrency,
  // replicas) immediately — even when the sim is idle. Uses live metrics when a
  // run is in progress, otherwise estimates provisioned compute straight from
  // each node's config.
  const liveCostPerHour = useMemo(() => {
    return nodes.reduce((sum, n) => {
      const cfg = n.data.config;
      const m = metrics[n.id];
      const servers = m?.servers ?? Math.max(1, Math.round(cfg.concurrency * cfg.replicas));
      const arrival = m?.arrivalRate ?? 0;
      return sum + estimateCostFromMetrics(cfg.kind, servers, arrival, cfg.replicaCount, provider, cfg.serviceTimeMs);
    }, 0);
  }, [nodes, metrics, provider]);

  const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-cyan/70';
  const btn = `px-3 ${isTouch ? 'py-2.5 min-h-[44px]' : 'py-2'} font-sans text-sm rounded-md border transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${focusRing}`;
  const iconBtn = `${isTouch ? 'p-2.5 min-h-[44px] min-w-[44px]' : 'p-2'} rounded-md border transition-colors flex items-center justify-center shrink-0 ${focusRing}`;

  return (
    <MetricsContext.Provider value={{ metrics, running, selectedId }}>
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
        <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-1">{t('editor.engine_tagline', { defaultValue: 'Simulation engine v2' })}</div>
        <h1 className="text-2xl md:text-3xl font-sans font-bold mb-4 tracking-tight text-slate-900 dark:text-tactical-text">
          {t('editor.title', { defaultValue: 'Distributed Systems Simulator' })}
        </h1>

        {/* Game-mode status bar (replaces manual sim controls when in a match) */}
        {gameActive && (
          <GameBanner
            liveRound={{
              score: scoreRef.current.total,
              streak: scoreRef.current.streak,
              multiplier: scoreRef.current.multiplier,
            }}
            compliance={compliance}
          />
        )}
        {/* Round splashes, chaos telegraphs, countdowns and rank toasts. */}
        {gameActive && <RoundFX nodeLabels={nodeLabels} />}
        {/* Post-round debrief and final standings. */}
        {gameActive && <RoundResults />}

        {/* Toolbar */}
        <div className={`flex items-center gap-2 mb-3 ${isTouch ? 'overflow-x-auto pb-1' : 'flex-wrap'}`}>
          {!gameActive && (
            <>
              <button
                onClick={() => setRunning((r) => !r)}
                className={`${btn} ${running ? 'border-signal-red text-signal-red hover:bg-signal-red/10' : 'border-signal-green text-signal-green hover:bg-signal-green/10'}`}
              >
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {running ? t('editor.buttons.stop', { defaultValue: 'Pause' }) : t('editor.buttons.start', { defaultValue: 'Run' })}
              </button>
              <button onClick={step} className={`${btn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan`}>
                <SkipForward className="w-4 h-4" /> {t('editor.buttons.step', { defaultValue: 'Step' })}
              </button>
              <button onClick={reset} className={`${btn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan`}>
                <RotateCcw className="w-4 h-4" /> {t('editor.buttons.reset', { defaultValue: 'Reset' })}
              </button>

              {/* Live sim clock: lets users line chaos events (in seconds) up
                  with what they see, and makes the running state unmissable. */}
              <div
                title={t('editor.labels.sim_time', { defaultValue: 'Simulated time' })}
                className="flex items-center gap-1.5 px-2 font-mono text-xs text-tactical-dim shrink-0 tabular-nums"
              >
                <span
                  aria-hidden
                  className={`w-2 h-2 rounded-full ${running ? 'bg-signal-green animate-pulse motion-reduce:animate-none' : 'bg-tactical-line'}`}
                />
                t={Math.floor(simRef.current?.currentTime ?? 0)}s
              </div>

              <div className="border-l border-tactical-line h-8 mx-1 shrink-0" />
            </>
          )}

          <button
            onClick={undo}
            disabled={!canUndo}
            title={t('editor.buttons.undo', { defaultValue: 'Undo' })}
            aria-label={t('editor.buttons.undo', { defaultValue: 'Undo' })}
            className={`${iconBtn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-tactical-border disabled:hover:text-tactical-dim`}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title={t('editor.buttons.redo', { defaultValue: 'Redo' })}
            aria-label={t('editor.buttons.redo', { defaultValue: 'Redo' })}
            className={`${iconBtn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-tactical-border disabled:hover:text-tactical-dim`}
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {/* Arrange: inline on desktop; folded into the Tools sheet on touch. */}
          {!isTouch && (
            <>
              <div className="border-l border-tactical-line h-8 mx-1 shrink-0" />
              <button
                onClick={() => applyLayout('vertical')}
                disabled={frozen}
                title={t('editor.buttons.arrange_vertical', { defaultValue: 'Arrange vertically' })}
                aria-label={t('editor.buttons.arrange_vertical', { defaultValue: 'Arrange vertically' })}
                className={`${iconBtn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => applyLayout('horizontal')}
                disabled={frozen}
                title={t('editor.buttons.arrange_horizontal', { defaultValue: 'Arrange horizontally' })}
                aria-label={t('editor.buttons.arrange_horizontal', { defaultValue: 'Arrange horizontally' })}
                className={`${iconBtn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Desktop advanced inline controls (speed / seed / export / import). */}
          {!gameActive && !isTouch && (
            <>
              <div className="border-l border-tactical-line h-8 mx-1 shrink-0" />

              <label className="flex items-center gap-2 font-sans text-xs text-tactical-dim">
                {t('editor.labels.speed', { defaultValue: 'Speed' })}
                <input type="range" min={1} max={10} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="accent-signal-cyan" />
                <span className="font-mono text-tactical-text">{speed}x</span>
              </label>
              <label className="flex items-center gap-2 font-sans text-xs text-tactical-dim">
                {t('editor.labels.seed', { defaultValue: 'Seed' })}
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                  className="w-20 bg-tactical-raised border border-tactical-border rounded-md px-2 py-1 font-mono text-xs text-tactical-text"
                />
              </label>

              <div className="border-l border-tactical-line h-8 mx-1 shrink-0" />

              <button onClick={exportDesign} className={`${btn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan`}>
                <Download className="w-4 h-4" /> {t('editor.buttons.export', { defaultValue: 'Export' })}
              </button>
              {!readOnly && (
                <button onClick={() => fileInputRef.current?.click()} className={`${btn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan`}>
                  <Upload className="w-4 h-4" /> {t('editor.buttons.import', { defaultValue: 'Import' })}
                </button>
              )}

              {/* Save / share to the user's library (recover + share + embed). */}
              {!readOnly && !hideChrome && (
                <>
                  <div className="border-l border-tactical-line h-8 mx-1 shrink-0" />

                  {/* Pre-populated, click-to-edit title for the current design. */}
                  <input
                    value={currentTitle}
                    onChange={(e) => setCurrentTitle(e.target.value)}
                    onBlur={(e) => updateTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                    aria-label={t('editor.save.title_label', { defaultValue: 'Title' })}
                    title={t('editor.save.title_label', { defaultValue: 'Title' })}
                    placeholder={t('editor.save.title_placeholder', { defaultValue: 'Untitled architecture' })}
                    className="w-44 bg-transparent border border-transparent hover:border-tactical-border focus:border-signal-cyan rounded-md px-2 py-1 font-sans text-sm font-medium text-slate-700 dark:text-tactical-text focus:bg-tactical-raised outline-none transition-colors"
                  />

                  {user ? (
                    <>
                      <button
                        onClick={saveDesign}
                        disabled={saveState === 'saving'}
                        className={`${btn} border-signal-cyan text-signal-cyan hover:bg-signal-cyan/10 disabled:opacity-50`}
                      >
                        <Save className="w-4 h-4" />
                        {saveState === 'saving'
                          ? t('editor.save.saving', { defaultValue: 'Saving…' })
                          : t('editor.save.save', { defaultValue: 'Save' })}
                      </button>
                      <button
                        onClick={handleShare}
                        className={`${btn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan`}
                      >
                        <Share2 className="w-4 h-4" /> {t('editor.save.share', { defaultValue: 'Share' })}
                      </button>
                      <button
                        onClick={openLibrary}
                        className={`${btn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan`}
                      >
                        <FolderOpen className="w-4 h-4" /> {t('editor.save.my_designs', { defaultValue: 'My designs' })}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleShare}
                      className={`${btn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan`}
                    >
                      <Share2 className="w-4 h-4" /> {t('editor.save.share', { defaultValue: 'Share' })}
                    </button>
                  )}
                </>
              )}
            </>
          )}

          {/* Touch quick-access: open the components / scenario / tools sheets. */}
          {isTouch && (
            <>
              <div className="border-l border-tactical-line h-8 mx-1 shrink-0" />
              <button onClick={() => setSheet('palette')} className={`${btn} border-signal-cyan text-signal-cyan hover:bg-signal-cyan/10`}>
                <Plus className="w-4 h-4" /> {t('editor.labels.components', { defaultValue: 'Components' })}
              </button>
              {!gameActive && (
                <button onClick={() => setSheet('scenario')} className={`${btn} border-tactical-border text-tactical-dim`}>
                  <Boxes className="w-4 h-4" /> {t('editor.mobile.scenario', { defaultValue: 'Scenario' })}
                </button>
              )}
              <button onClick={() => setSheet('tools')} className={`${btn} border-tactical-border text-tactical-dim`}>
                <SlidersHorizontal className="w-4 h-4" /> {t('editor.mobile.tools', { defaultValue: 'Tools' })}
              </button>
            </>
          )}

          {/* Hidden file input shared by desktop toolbar and the Tools sheet. */}
          {!gameActive && (
            <input type="file" ref={fileInputRef} accept=".din" className="hidden" onChange={importDesign} />
          )}
        </div>

        {importError && (
          <div role="alert" className="flex items-start justify-between gap-3 bg-signal-red/10 border border-signal-red rounded-lg p-3 text-signal-red font-sans text-sm mb-3">
            <span>{importError}</span>
            <button
              onClick={() => setImportError(null)}
              aria-label={t('editor.errors.dismiss', { defaultValue: 'Dismiss error' })}
              className={`shrink-0 hover:opacity-70 transition-opacity ${focusRing} rounded`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {saveError && (
          <div role="alert" className="flex items-start justify-between gap-3 bg-signal-red/10 border border-signal-red rounded-lg p-3 text-signal-red font-sans text-sm mb-3">
            <span>{saveError}</span>
            <button
              onClick={() => setSaveError(null)}
              aria-label={t('editor.errors.dismiss', { defaultValue: 'Dismiss error' })}
              className={`shrink-0 hover:opacity-70 transition-opacity ${focusRing} rounded`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Share + visibility panel. When the design isn't saved yet it prompts
            the user to save first, then reveals the share link / embed code. */}
        {showShare && !readOnly && !hideChrome && (
          <SharePanel
            designId={currentDesignId}
            title={currentTitle}
            visibility={currentVisibility}
            canSave={!!user}
            saving={saveState === 'saving'}
            onSave={saveDesign}
            onTitleChange={setCurrentTitle}
            onVisibilityChange={updateVisibility}
            onClose={() => setShowShare(false)}
          />
        )}

        {/* "My designs" library picker. */}
        {showLibrary && !readOnly && !hideChrome && (
          <LibraryModal
            items={library}
            loading={libraryLoading}
            currentId={currentDesignId}
            onLoad={loadFromLibrary}
            onDelete={deleteFromLibrary}
            onClose={() => setShowLibrary(false)}
          />
        )}

        {/* Scenario controls (admin-driven in game mode, so hidden for players;
            on touch they live in the Scenario bottom sheet). */}
        {!gameActive && !isTouch && (
          <div className="tactical-panel p-3 mb-4">
            <ScenarioBar
              profileType={profileType}
              onProfileChange={setProfileType}
              onLoadPreset={loadPreset}
              nodeOptions={nodeOptions}
              chaos={chaos}
              onAddChaos={(ev) => setChaos((c) => [...c, ev])}
              onRemoveChaos={(id) => setChaos((c) => c.filter((e) => e.id !== id))}
              provider={provider}
              onProviderChange={setProvider}
              currentTime={simRef.current?.currentTime ?? 0}
            />
          </div>
        )}

        {/* Canvas + inspector */}
        <div
          className="flex gap-0 tactical-panel"
          style={{ height: isTouch ? '60vh' : 560, minHeight: isTouch ? 380 : undefined }}
        >
          <div className={`flex-1 relative ${isTouch ? 'rf-touch' : ''}`} ref={canvasRef}>
            {isTouch && (
              <style>{`
                .rf-controls-touch .react-flow__controls-button{width:34px;height:34px;}
                .rf-touch .react-flow__handle{width:16px;height:16px;}
              `}</style>
            )}
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              isValidConnection={isValidConnection}
              connectionMode={ConnectionMode.Loose}
              nodesDraggable={!frozen}
              nodesConnectable={!frozen}
              onNodesDelete={onNodesDelete}
              onEdgesDelete={onEdgesDelete}
              onNodeDragStart={onNodeDragStart}
              onSelectionDragStart={onNodeDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onNodeClick={(_, node) => { setSelectedId(node.id); setSelectedEdgeId(null); setShowBill(false); closeMenu(); }}
              onNodeContextMenu={onNodeContextMenu}
              onEdgeContextMenu={onEdgeContextMenu}
              onPaneContextMenu={onPaneContextMenu}
              onEdgeClick={(_, edge) => { closeMenu(); if (isTouch) { setSelectedId(null); setSelectedEdgeId(edge.id); } }}
              onPaneClick={() => { setSelectedId(null); setSelectedEdgeId(null); closeMenu(); }}
              onMoveStart={closeMenu}
              nodeTypes={nodeTypes}
              deleteKeyCode={frozen ? null : ['Backspace', 'Delete']}
              fitView
              fitViewOptions={{ padding: 0.4, maxZoom: 1 }}
              minZoom={0.2}
              maxZoom={1.5}
            >
              {/* Desktop drag-and-drop palette. On touch this is replaced by the
                  tap-to-add MobilePalette in a bottom sheet. Hidden in read-only
                  (share/embed) views where there is nothing to drag. */}
              {!isTouch && !readOnly && (
                <Panel position="top-left" className="bg-white/95 dark:bg-tactical-surface/95 border border-slate-200 dark:border-tactical-border rounded-lg p-3 backdrop-blur-sm max-h-[520px] overflow-y-auto">
                  <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-2">{t('editor.labels.components', { defaultValue: 'Components' })}</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PALETTE_ORDER.map((kind) => {
                      const entry = NODE_CATALOG[kind];
                      const Icon = entry.icon;
                      return (
                        <div
                          key={kind}
                          draggable={!frozen}
                          onDragStart={(e) => { if (frozen) { e.preventDefault(); return; } onDragStart(e, kind); }}
                          title={t(`editor.descriptions.${kind}`)}
                          className={`px-2 py-1.5 rounded-md bg-slate-50 dark:bg-tactical-raised border-l-2 ${entry.accent} font-sans text-[11px] text-slate-700 dark:text-tactical-text flex items-center gap-1.5 ${frozen ? 'opacity-40 cursor-not-allowed' : 'cursor-move hover:bg-slate-100 dark:hover:bg-tactical-line'}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {t(`editor.kinds.${kind}`, { defaultValue: KIND_DEFAULT_LABEL[kind] })}
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              )}
              {gameActive && game && !isTouch && (
                <Panel position="top-right" className="w-60">
                  <GameLeaderboard entries={game.leaderboard} currentUserId={user?.uid} />
                </Panel>
              )}
              <Controls className={isTouch ? 'rf-controls-touch' : undefined} showInteractive={!isTouch} />
              {!isTouch && <MiniMap nodeColor={(n) => NODE_CATALOG[(n.type as NodeKind) ?? 'server']?.hex ?? '#64748b'} />}
              <Background variant={BackgroundVariant.Dots} gap={14} size={1} />
            </ReactFlow>

            {/* Teaching empty state: shows how to get the first node on canvas
                instead of leaving a blank dot grid. Non-interactive overlay. */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="max-w-xs text-center font-sans px-4">
                  <Boxes className="w-8 h-8 mx-auto mb-3 text-tactical-label" aria-hidden />
                  <div className="text-sm font-medium text-slate-700 dark:text-tactical-text mb-1">
                    {t('editor.canvas.empty_title', { defaultValue: 'Build your first system' })}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-tactical-dim">
                    {isTouch
                      ? t('editor.canvas.empty_hint_touch', { defaultValue: 'Tap Components to add a node, then drag between handles to connect them.' })
                      : t('editor.canvas.empty_hint', { defaultValue: 'Drag a component from the palette onto the canvas, then drag between handles to connect nodes.' })}
                  </p>
                </div>
              </div>
            )}

            {/* Touch: floating action bar replaces right-click context menus. */}
            {isTouch && selectedId && (
              <SelectionActionBar
                mode="node"
                canDelete={!isNodeLocked(selectedId)}
                onEdit={() => { setShowBill(false); setSheet('inspector'); }}
                onDuplicate={() => duplicateNode(selectedId)}
                onDisconnect={() => disconnectNode(selectedId)}
                onKill={() => killNode(selectedId)}
                onDelete={() => { deleteNode(selectedId); setSelectedId(null); }}
                onClose={() => setSelectedId(null)}
              />
            )}
            {isTouch && selectedEdgeId && (
              <SelectionActionBar
                mode="edge"
                onDelete={() => { deleteEdge(selectedEdgeId); setSelectedEdgeId(null); }}
                onClose={() => setSelectedEdgeId(null)}
              />
            )}

            {menu && (
              <div
                className="absolute z-50 min-w-[180px] bg-white dark:bg-tactical-surface border border-slate-200 dark:border-tactical-border rounded-lg shadow-lg py-1"
                style={{
                  left: Math.max(0, Math.min(menu.x, (canvasRef.current?.clientWidth ?? 9999) - 190)),
                  // Keep the tallest menu variant (node: 5 items + divider) inside the canvas.
                  top: Math.max(0, Math.min(menu.y, (canvasRef.current?.clientHeight ?? 9999) - (menu.kind === 'node' ? 200 : 90))),
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {menu.kind === 'node' ? (
                  <>
                    <ContextItem icon={Settings2} label={t('editor.menu.edit')} onClick={() => { setSelectedId(menu.id); closeMenu(); }} />
                    <ContextItem icon={Copy} label={t('editor.menu.duplicate')} onClick={() => { duplicateNode(menu.id); closeMenu(); }} />
                    <ContextItem icon={Unplug} label={t('editor.menu.disconnect')} onClick={() => { disconnectNode(menu.id); closeMenu(); }} />
                    <ContextItem icon={Zap} label={t('editor.menu.kill')} tone="text-signal-amber" onClick={() => { killNode(menu.id); closeMenu(); }} />
                    {!isNodeLocked(menu.id) && (
                      <>
                        <div className="my-1 border-t border-slate-200 dark:border-tactical-border" />
                        <ContextItem icon={Trash2} label={t('editor.menu.delete')} tone="text-signal-red" onClick={() => { deleteNode(menu.id); closeMenu(); }} />
                      </>
                    )}
                  </>
                ) : menu.kind === 'edge' ? (
                  <ContextItem icon={Trash2} label={t('editor.menu.delete_edge')} tone="text-signal-red" onClick={() => { deleteEdge(menu.id); closeMenu(); }} />
                ) : (
                  <>
                    <ContextItem icon={ArrowDownUp} label={t('editor.menu.arrange_vertical', { defaultValue: 'Arrange vertically' })} onClick={() => { applyLayout('vertical'); closeMenu(); }} />
                    <ContextItem icon={ArrowLeftRight} label={t('editor.menu.arrange_horizontal', { defaultValue: 'Arrange horizontally' })} onClick={() => { applyLayout('horizontal'); closeMenu(); }} />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Desktop side panel. On touch this content moves into a bottom sheet. */}
          {!isTouch && (
            <div className="w-80 shrink-0 border-l border-slate-200 dark:border-tactical-border bg-white dark:bg-tactical-surface">
              {showBill ? (
                <CostPanel
                  nodes={nodes.map((n) => ({ id: n.id, config: n.data.config }))}
                  metrics={metrics}
                  provider={provider}
                  totalCost={totalCost}
                  onClose={() => setShowBill(false)}
                />
              ) : (
                <InspectorPanel config={selectedConfig} onChange={patchSelected} onDelete={deleteSelected} canDelete={!selectedConfig?.locked} readOnly={gameActive && selectedConfig?.kind === 'client'} gameMode={gameActive} />
              )}
            </div>
          )}
        </div>

        {/* Dashboard */}
        <div className="mt-4">
          <Dashboard
            history={history}
            totalCost={totalCost}
            costPerHour={liveCostPerHour}
            successCount={successCount}
            failedCount={failedCount}
            provider={provider}
            warnings={warnings}
            onCostClick={() => { setShowBill(true); if (isTouch) setSheet('inspector'); }}
          />
        </div>

        {/* ===================== Touch bottom sheets ===================== */}
        {isTouch && (
          <>
            <BottomSheet
              open={sheet === 'palette'}
              onClose={() => setSheet(null)}
              title={t('editor.labels.components', { defaultValue: 'Components' })}
            >
              <MobilePalette onAdd={addNodeOfKind} />
            </BottomSheet>

            <BottomSheet
              open={sheet === 'inspector'}
              onClose={() => { setSheet(null); setShowBill(false); }}
              title={showBill ? t('editor.bill.title', { defaultValue: 'Cost breakdown' }) : t('editor.inspector.title', { defaultValue: 'Inspector' })}
            >
              {showBill ? (
                <CostPanel
                  nodes={nodes.map((n) => ({ id: n.id, config: n.data.config }))}
                  metrics={metrics}
                  provider={provider}
                  totalCost={totalCost}
                  onClose={() => { setShowBill(false); setSheet(null); }}
                />
              ) : (
                <InspectorPanel config={selectedConfig} onChange={patchSelected} onDelete={() => { deleteSelected(); setSheet(null); }} canDelete={!selectedConfig?.locked} readOnly={gameActive && selectedConfig?.kind === 'client'} gameMode={gameActive} />
              )}
            </BottomSheet>

            {!gameActive && (
              <>
                <BottomSheet
                  open={sheet === 'scenario'}
                  onClose={() => setSheet(null)}
                  title={t('editor.mobile.scenario', { defaultValue: 'Scenario' })}
                >
                  <div className="p-3">
                    <ScenarioBar
                      profileType={profileType}
                      onProfileChange={setProfileType}
                      onLoadPreset={loadPreset}
                      nodeOptions={nodeOptions}
                      chaos={chaos}
                      onAddChaos={(ev) => setChaos((c) => [...c, ev])}
                      onRemoveChaos={(id) => setChaos((c) => c.filter((e) => e.id !== id))}
                      provider={provider}
                      onProviderChange={setProvider}
                      currentTime={simRef.current?.currentTime ?? 0}
                    />
                  </div>
                </BottomSheet>

                <BottomSheet
                  open={sheet === 'tools'}
                  onClose={() => setSheet(null)}
                  title={t('editor.mobile.tools', { defaultValue: 'Tools' })}
                  maxHeightVh={60}
                >
                  <div className="p-4 space-y-4">
                    <div>
                      <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-2">{t('editor.mobile.arrange', { defaultValue: 'Arrange' })}</div>
                      <div className="flex gap-2">
                        <button onClick={() => { applyLayout('vertical'); setSheet(null); }} className={`${btn} flex-1 justify-center border-tactical-border text-tactical-dim`}>
                          <ArrowDownUp className="w-4 h-4" /> {t('editor.mobile.vertical', { defaultValue: 'Vertical' })}
                        </button>
                        <button onClick={() => { applyLayout('horizontal'); setSheet(null); }} className={`${btn} flex-1 justify-center border-tactical-border text-tactical-dim`}>
                          <ArrowLeftRight className="w-4 h-4" /> {t('editor.mobile.horizontal', { defaultValue: 'Horizontal' })}
                        </button>
                      </div>
                    </div>

                    <label className="block">
                      <div className="flex justify-between font-sans text-xs text-tactical-dim mb-1">
                        <span>{t('editor.labels.speed', { defaultValue: 'Speed' })}</span>
                        <span className="font-mono text-tactical-text">{speed}x</span>
                      </div>
                      <input type="range" min={1} max={10} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-signal-cyan" />
                    </label>

                    <label className="block">
                      <div className="font-sans text-xs text-tactical-dim mb-1">{t('editor.labels.seed', { defaultValue: 'Seed' })}</div>
                      <input
                        type="number"
                        value={seed}
                        onChange={(e) => setSeed(Number(e.target.value))}
                        className="w-full bg-tactical-raised border border-tactical-border rounded-md px-2 py-2 font-mono text-sm text-tactical-text"
                      />
                    </label>

                    <div className="flex gap-2">
                      <button onClick={() => { exportDesign(); setSheet(null); }} className={`${btn} flex-1 justify-center border-tactical-border text-tactical-dim`}>
                        <Download className="w-4 h-4" /> {t('editor.buttons.export', { defaultValue: 'Export' })}
                      </button>
                      <button onClick={() => fileInputRef.current?.click()} className={`${btn} flex-1 justify-center border-tactical-border text-tactical-dim`}>
                        <Upload className="w-4 h-4" /> {t('editor.buttons.import', { defaultValue: 'Import' })}
                      </button>
                    </div>
                  </div>
                </BottomSheet>
              </>
            )}
          </>
        )}
      </div>
    </MetricsContext.Provider>
  );
}

export default function SystemEditorV2({
  gameId,
  initialDesign,
  readOnly,
  hideChrome,
}: SystemEditorV2Props = {}) {
  return (
    <ReactFlowProvider>
      <EditorInner
        gameId={gameId}
        initialDesign={initialDesign}
        readOnly={readOnly}
        hideChrome={hideChrome}
      />
    </ReactFlowProvider>
  );
}
