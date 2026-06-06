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
import { Play, Pause, SkipForward, RotateCcw, Download, Upload, Settings2, Copy, Unplug, Zap, Trash2, ArrowDownUp, ArrowLeftRight, Undo2, Redo2, Plus, SlidersHorizontal, Boxes, type LucideIcon } from 'lucide-react';

import {
  NodeConfig,
  NodeKind,
  SimulationFrame,
  defaultsForKind,
} from './engine/types';
import { Simulator } from './engine/simulator';
import { makeLoadProfile, LoadProfileType, ChaosEvent, getPreset } from './engine/scenarios';
import { CloudProvider } from './engine/costModel';

import SimNode, { SimNodeData } from './ui/SimNode';
import { NODE_CATALOG, PALETTE_ORDER, KIND_DEFAULT_LABEL } from './ui/nodeCatalog';
import { MetricsContext } from './ui/MetricsContext';
import InspectorPanel from './ui/InspectorPanel';
import CostPanel from './ui/CostPanel';
import Dashboard from './ui/Dashboard';
import ScenarioBar from './ui/ScenarioBar';
import { parseDesign, serializeDesign, SerializedNode } from './ui/persistence';
import { layoutGraph, LayoutDirection } from './ui/autoLayout';
import { useGameContext } from './game/GameContext';
import { architectureToRF, rfToArchitecture } from './game/architecture';
import {
  frameScore,
  normalizeScoring,
  emptyAccumulator,
  accumulate,
  type ScoreAccumulator,
} from './engine/scoring';
import GameBanner from './game/GameBanner';
import GameLeaderboard from './game/GameLeaderboard';
import { useIsTouchLayout } from './ui/useIsTouchLayout';
import BottomSheet from './ui/BottomSheet';
import MobilePalette from './ui/MobilePalette';
import SelectionActionBar from './ui/SelectionActionBar';

type RFNode = Node<SimNodeData>;

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
      className={`w-full flex items-center gap-2 px-3 py-1.5 font-mono text-xs text-left hover:bg-slate-100 dark:hover:bg-tactical-line ${tone ?? 'text-slate-700 dark:text-tactical-text'}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" /> {label}
    </button>
  );
}

function EditorInner({ gameId }: { gameId?: string }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const game = useGameContext();
  const gameState = game?.state ?? null;
  const gameActive = !!gameId && !!game;
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
  const [warnings, setWarnings] = useState<string[]>([]);

  const [profileType, setProfileType] = useState<LoadProfileType>('constant');
  const [provider, setProvider] = useState<CloudProvider>('aws');
  const [chaos, setChaos] = useState<ChaosEvent[]>([]);
  const [importError, setImportError] = useState<string | null>(null);

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
  const scoreRef = useRef<ScoreAccumulator>(emptyAccumulator());
  const lastFrameRef = useRef<SimulationFrame | null>(null);
  const seededKeyRef = useRef<string | null>(null);
  const finalSubmittedRef = useRef<string | null>(null);

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
    const previous = pastRef.current.pop();
    if (!previous) return;
    futureRef.current.push({ nodes: nodesRef.current, edges: edgesRef.current });
    setNodes(previous.nodes);
    setEdges(previous.edges);
    setSelectedId(null);
    setHistoryVersion((v) => v + 1);
  }, [setNodes, setEdges]);

  const redo = useCallback(() => {
    const next = futureRef.current.pop();
    if (!next) return;
    pastRef.current.push({ nodes: nodesRef.current, edges: edgesRef.current });
    setNodes(next.nodes);
    setEdges(next.edges);
    setSelectedId(null);
    setHistoryVersion((v) => v + 1);
  }, [setNodes, setEdges]);

  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

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
    simRef.current?.setProfile(makeLoadProfile(profileType));
  }, [profileType]);

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
    setTotalCost(0);
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
    setChaos(gameState.chaos_events ?? []);
    scoreRef.current = emptyAccumulator();
    lastFrameRef.current = null;
    setMetrics({});
    setHistory([]);
    setTotalCost(0);
    pastRef.current = [];
    futureRef.current = [];
  }, [gameActive, gameState, setNodes, setEdges]);

  // Live-sync the broadcast traffic profile (admin can change it mid-match).
  useEffect(() => {
    if (!gameActive || !gameState) return;
    setProfileType((gameState.load_profile?.type ?? 'constant') as LoadProfileType);
  }, [gameActive, gameState?.load_profile?.type]);

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

  // Synced run loop: drive the deterministic sim by wall-clock match-time so all
  // players experience the same traffic/chaos at the same simulated second.
  useEffect(() => {
    if (!gameActive) return;
    if (gameState?.status !== 'running' || !gameState.started_at) return;
    const startedMs = new Date(gameState.started_at).getTime();
    const id = setInterval(() => {
      const g = gameRef.current;
      const gs = gameStateRef.current;
      if (!g || !gs) return;
      const offset = g.serverOffsetMs ?? 0;
      let target = Math.floor((Date.now() + offset - startedMs) / 1000);
      if (gs.ends_at) {
        const endTick = Math.floor((new Date(gs.ends_at).getTime() - startedMs) / 1000);
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
            frameScore(frame.system, scoringCfg),
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
  }, [gameActive, gameState?.status, gameState?.started_at, applyFrame]);

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

  // Periodically push the player's architecture + accumulated score.
  useEffect(() => {
    if (!gameActive) return;
    const status = gameState?.status;
    if (status !== 'running' && status !== 'paused') return;
    const submit = () => {
      const g = gameRef.current;
      if (!g) return;
      g.submitScore({
        architecture: rfToArchitecture(nodesRef.current, edgesRef.current),
        score: Math.round(scoreRef.current.total),
        score_breakdown: scoreRef.current,
        metrics: gameMetrics(),
      });
    };
    submit();
    const id = setInterval(submit, 4000);
    return () => clearInterval(id);
  }, [gameActive, gameState?.status, gameMetrics]);

  // Submit a final score once when the match ends.
  useEffect(() => {
    if (!gameActive || gameState?.status !== 'ended' || !gameState.code) return;
    if (finalSubmittedRef.current === gameState.code) return;
    finalSubmittedRef.current = gameState.code;
    const g = gameRef.current;
    if (!g) return;
    g.submitScore({
      architecture: rfToArchitecture(nodesRef.current, edgesRef.current),
      score: Math.round(scoreRef.current.total),
      score_breakdown: scoreRef.current,
      metrics: gameMetrics(),
    });
  }, [gameActive, gameState?.status, gameState?.code, gameMetrics]);

  // --- Node editing ---
  const patchSelected = useCallback(
    (patch: Partial<NodeConfig>) => {
      if (!selectedId) return;
      // Coalesce rapid edits (e.g. dragging a slider) into one history entry.
      const now = Date.now();
      if (now - lastPatchAtRef.current > 600) takeSnapshot();
      lastPatchAtRef.current = now;
      setNodes((nds) =>
        nds.map((n) => (n.id === selectedId ? { ...n, data: { config: { ...n.data.config, ...patch } } } : n)),
      );
    },
    [selectedId, setNodes, takeSnapshot],
  );

  const deleteSelected = useCallback(() => {
    if (!selectedId || isNodeLocked(selectedId)) return;
    takeSnapshot();
    setNodes((nds) => nds.filter((n) => n.id !== selectedId));
    setEdges((eds) => eds.filter((e) => e.source !== selectedId && e.target !== selectedId));
    setSelectedId(null);
  }, [selectedId, setNodes, setEdges, takeSnapshot, isNodeLocked]);

  // --- Context-menu actions (operate on an explicit node id) ---
  const deleteNode = useCallback(
    (id: string) => {
      if (isNodeLocked(id)) return;
      takeSnapshot();
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      setSelectedId((cur) => (cur === id ? null : cur));
    },
    [setNodes, setEdges, takeSnapshot, isNodeLocked],
  );

  const duplicateNode = useCallback(
    (id: string) => {
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
    [nodes, setNodes, takeSnapshot],
  );

  const disconnectNode = useCallback(
    (id: string) => {
      takeSnapshot();
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    },
    [setEdges, takeSnapshot],
  );

  const killNode = useCallback((id: string) => {
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
  }, []);

  const deleteEdge = useCallback(
    (id: string) => {
      takeSnapshot();
      setEdges((eds) => eds.filter((e) => e.id !== id));
    },
    [setEdges, takeSnapshot],
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
      takeSnapshot();
      setEdges((eds) => addEdge({ ...params, id: `e-${(params as Edge).source}-${(params as Edge).target}-${Date.now()}`, animated: true, style: { strokeWidth: 2.5 } }, eds));
    },
    [setEdges, takeSnapshot],
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
      takeSnapshot();
      const { nodes: laidOut, edges: rewired } = layoutGraph(nodes, edges, direction);
      setNodes(laidOut);
      setEdges(rewired);
      window.requestAnimationFrame(() => rf.fitView({ padding: 0.3, duration: 400 }));
    },
    [nodes, edges, setNodes, setEdges, rf, takeSnapshot],
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
      takeSnapshot();
      const id = `n${Date.now()}`;
      const count = nodesRef.current.filter((n) => n.data.config.kind === kind).length + 1;
      const config = defaultsForKind(kind, id, `${t(`editor.kinds.${kind}`, { defaultValue: KIND_DEFAULT_LABEL[kind] })} ${count}`);
      const newNode: RFNode = { id, type: kind, position, data: { config } };
      setNodes((nds) => nds.concat(newNode));
      return id;
    },
    [setNodes, t, takeSnapshot],
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
      setTotalCost(0);
    },
    [setNodes, setEdges, takeSnapshot],
  );

  const exportDesign = useCallback(() => {
    setRunning(false);
    const sNodes: SerializedNode[] = nodes.map((n) => ({ id: n.id, position: n.position, config: n.data.config }));
    const json = serializeDesign(
      sNodes,
      edges.map((e) => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, targetHandle: e.targetHandle })),
      seed,
      profileType,
      chaos,
    );
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `distributed-system-${new Date().toISOString().slice(0, 10)}.din`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [nodes, edges, seed, profileType, chaos]);

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
          const rfNodes: RFNode[] = design.nodes.map((n) => ({
            id: n.id,
            type: n.config.kind,
            position: n.position,
            data: { config: n.config },
          }));
          setNodes(rfNodes);
          setEdges(design.edges.map((ed) => ({ id: ed.id, source: ed.source, target: ed.target, sourceHandle: ed.sourceHandle ?? 'bottom', targetHandle: ed.targetHandle ?? 'top', animated: true, style: { strokeWidth: 2.5 } })));
          setSeed(design.seed);
          setProfileType(design.profileType);
          setChaos(design.chaos);
          setSelectedId(null);
          simRef.current?.reset(design.seed);
          setMetrics({});
          setHistory([]);
          setTotalCost(0);
        } catch {
          setImportError(t('editor.errors.import_error', { defaultValue: 'Failed to import design file.' }));
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.onerror = () => setImportError(t('editor.errors.read_error', { defaultValue: 'Could not read file.' }));
      reader.readAsText(file);
    },
    [setNodes, setEdges, t, takeSnapshot],
  );

  const selectedConfig = nodes.find((n) => n.id === selectedId)?.data.config ?? null;
  const nodeOptions = nodes.map((n) => ({ id: n.id, label: n.data.config.label }));

  const btn = `px-3 ${isTouch ? 'py-2.5 min-h-[44px]' : 'py-2'} font-mono text-sm uppercase tracking-wider border transition-colors flex items-center gap-2 whitespace-nowrap shrink-0`;
  const iconBtn = `${isTouch ? 'p-2.5 min-h-[44px] min-w-[44px]' : 'p-2'} border transition-colors flex items-center justify-center shrink-0`;

  return (
    <MetricsContext.Provider value={{ metrics, running, selectedId }}>
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
        <div className="label-mono text-signal-amber mb-1">[ SYSTEM DESIGN ] // {t('editor.engine_tagline', { defaultValue: 'SIMULATION ENGINE V2' })}</div>
        <h1 className="text-2xl md:text-3xl font-mono font-bold mb-4 tracking-tight text-slate-900 dark:text-tactical-text">
          {t('editor.title', { defaultValue: 'Distributed Systems Simulator' })}
        </h1>

        {/* Game-mode status bar (replaces manual sim controls when in a match) */}
        {gameActive && <GameBanner />}

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
                title={t('editor.buttons.arrange_vertical', { defaultValue: 'Arrange vertically' })}
                aria-label={t('editor.buttons.arrange_vertical', { defaultValue: 'Arrange vertically' })}
                className={`${iconBtn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan`}
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => applyLayout('horizontal')}
                title={t('editor.buttons.arrange_horizontal', { defaultValue: 'Arrange horizontally' })}
                aria-label={t('editor.buttons.arrange_horizontal', { defaultValue: 'Arrange horizontally' })}
                className={`${iconBtn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan`}
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Desktop advanced inline controls (speed / seed / export / import). */}
          {!gameActive && !isTouch && (
            <>
              <div className="border-l border-tactical-line h-8 mx-1 shrink-0" />

              <label className="flex items-center gap-2 font-mono text-xs text-tactical-dim">
                {t('editor.labels.speed', { defaultValue: 'Speed' })}
                <input type="range" min={1} max={10} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="accent-signal-cyan" />
                <span className="text-tactical-text">{speed}x</span>
              </label>
              <label className="flex items-center gap-2 font-mono text-xs text-tactical-dim">
                {t('editor.labels.seed', { defaultValue: 'Seed' })}
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                  className="w-20 bg-tactical-raised border border-tactical-border px-2 py-1 font-mono text-xs text-tactical-text"
                />
              </label>

              <div className="border-l border-tactical-line h-8 mx-1 shrink-0" />

              <button onClick={exportDesign} className={`${btn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan`}>
                <Download className="w-4 h-4" /> {t('editor.buttons.export', { defaultValue: 'Export' })}
              </button>
              <button onClick={() => fileInputRef.current?.click()} className={`${btn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan`}>
                <Upload className="w-4 h-4" /> {t('editor.buttons.import', { defaultValue: 'Import' })}
              </button>
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
          <div className="bg-signal-red/10 border border-signal-red p-3 text-signal-red font-mono text-sm mb-3">{importError}</div>
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
              deleteKeyCode={['Backspace', 'Delete']}
              fitView
              fitViewOptions={{ padding: 0.4, maxZoom: 1 }}
              minZoom={0.2}
              maxZoom={1.5}
            >
              {/* Desktop drag-and-drop palette. On touch this is replaced by the
                  tap-to-add MobilePalette in a bottom sheet. */}
              {!isTouch && (
                <Panel position="top-left" className="bg-white/95 dark:bg-tactical-surface/95 border border-slate-200 dark:border-tactical-border p-3 backdrop-blur-sm max-h-[520px] overflow-y-auto">
                  <div className="label-mono text-signal-amber mb-2">{t('editor.labels.components', { defaultValue: 'Components' })}</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PALETTE_ORDER.map((kind) => {
                      const entry = NODE_CATALOG[kind];
                      const Icon = entry.icon;
                      return (
                        <div
                          key={kind}
                          draggable
                          onDragStart={(e) => onDragStart(e, kind)}
                          title={t(`editor.descriptions.${kind}`)}
                          className={`px-2 py-1.5 bg-slate-50 dark:bg-tactical-raised cursor-move hover:bg-slate-100 dark:hover:bg-tactical-line border-l-2 ${entry.accent} font-mono text-[11px] text-slate-700 dark:text-tactical-text flex items-center gap-1.5`}
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
                className="absolute z-50 min-w-[180px] bg-white dark:bg-tactical-surface border border-slate-200 dark:border-tactical-border shadow-lg py-1"
                style={{ left: Math.min(menu.x, (canvasRef.current?.clientWidth ?? 9999) - 190), top: menu.y }}
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
                <InspectorPanel config={selectedConfig} onChange={patchSelected} onDelete={deleteSelected} canDelete={!selectedConfig?.locked} />
              )}
            </div>
          )}
        </div>

        {/* Dashboard */}
        <div className="mt-4">
          <Dashboard
            history={history}
            totalCost={totalCost}
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
                <InspectorPanel config={selectedConfig} onChange={patchSelected} onDelete={() => { deleteSelected(); setSheet(null); }} canDelete={!selectedConfig?.locked} />
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
                      <div className="label-mono text-tactical-label mb-2">{t('editor.menu.arrange_vertical', { defaultValue: 'Arrange' })}</div>
                      <div className="flex gap-2">
                        <button onClick={() => { applyLayout('vertical'); setSheet(null); }} className={`${btn} flex-1 justify-center border-tactical-border text-tactical-dim`}>
                          <ArrowDownUp className="w-4 h-4" /> {t('editor.buttons.arrange_vertical', { defaultValue: 'Vertical' })}
                        </button>
                        <button onClick={() => { applyLayout('horizontal'); setSheet(null); }} className={`${btn} flex-1 justify-center border-tactical-border text-tactical-dim`}>
                          <ArrowLeftRight className="w-4 h-4" /> {t('editor.buttons.arrange_horizontal', { defaultValue: 'Horizontal' })}
                        </button>
                      </div>
                    </div>

                    <label className="block">
                      <div className="flex justify-between font-mono text-xs text-tactical-dim mb-1">
                        <span>{t('editor.labels.speed', { defaultValue: 'Speed' })}</span>
                        <span className="text-tactical-text">{speed}x</span>
                      </div>
                      <input type="range" min={1} max={10} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-signal-cyan" />
                    </label>

                    <label className="block">
                      <div className="font-mono text-xs text-tactical-dim mb-1">{t('editor.labels.seed', { defaultValue: 'Seed' })}</div>
                      <input
                        type="number"
                        value={seed}
                        onChange={(e) => setSeed(Number(e.target.value))}
                        className="w-full bg-tactical-raised border border-tactical-border px-2 py-2 font-mono text-sm text-tactical-text"
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

export default function SystemEditorV2({ gameId }: { gameId?: string } = {}) {
  return (
    <ReactFlowProvider>
      <EditorInner gameId={gameId} />
    </ReactFlowProvider>
  );
}
