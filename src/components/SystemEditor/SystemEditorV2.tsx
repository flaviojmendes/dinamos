import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useTranslation } from 'react-i18next';
import { Play, Pause, SkipForward, RotateCcw, Download, Upload, Settings2, Copy, Unplug, Zap, Trash2, type LucideIcon } from 'lucide-react';

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
  const edges: Edge[] = preset.edges.map((e) => ({ id: e.id, source: e.source, target: e.target, animated: true, style: { strokeWidth: 2.5 } }));
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

function EditorInner() {
  const { t } = useTranslation();
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

  const [menu, setMenu] = useState<{ kind: 'node' | 'edge'; id: string; x: number; y: number } | null>(null);
  const [showBill, setShowBill] = useState(false);

  const simRef = useRef<Simulator | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const rf = useReactFlow();

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

  // --- Node editing ---
  const patchSelected = useCallback(
    (patch: Partial<NodeConfig>) => {
      if (!selectedId) return;
      setNodes((nds) =>
        nds.map((n) => (n.id === selectedId ? { ...n, data: { config: { ...n.data.config, ...patch } } } : n)),
      );
    },
    [selectedId, setNodes],
  );

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedId));
    setEdges((eds) => eds.filter((e) => e.source !== selectedId && e.target !== selectedId));
    setSelectedId(null);
  }, [selectedId, setNodes, setEdges]);

  // --- Context-menu actions (operate on an explicit node id) ---
  const deleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      setSelectedId((cur) => (cur === id ? null : cur));
    },
    [setNodes, setEdges],
  );

  const duplicateNode = useCallback(
    (id: string) => {
      const src = nodes.find((n) => n.id === id);
      if (!src) return;
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
    [nodes, setNodes],
  );

  const disconnectNode = useCallback(
    (id: string) => {
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    },
    [setEdges],
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
      setEdges((eds) => eds.filter((e) => e.id !== id));
    },
    [setEdges],
  );

  const openMenuAt = useCallback((kind: 'node' | 'edge', id: string, event: React.MouseEvent) => {
    event.preventDefault();
    const bounds = canvasRef.current?.getBoundingClientRect();
    setMenu({
      kind,
      id,
      x: event.clientX - (bounds?.left ?? 0),
      y: event.clientY - (bounds?.top ?? 0),
    });
  }, []);

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
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, id: `e-${(params as Edge).source}-${(params as Edge).target}-${Date.now()}`, animated: true, style: { strokeWidth: 2.5 } }, eds)),
    [setEdges],
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      setEdges((eds) => eds.filter((e) => !deleted.some((n) => n.id === e.source || n.id === e.target)));
      if (deleted.some((n) => n.id === selectedId)) setSelectedId(null);
    },
    [setEdges, selectedId],
  );

  const onDragStart = (event: React.DragEvent, kind: NodeKind) => {
    event.dataTransfer.setData('application/dinamos', kind);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const kind = event.dataTransfer.getData('application/dinamos') as NodeKind;
      if (!kind) return;
      const position = rf.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const id = `n${Date.now()}`;
      const count = nodes.filter((n) => n.data.config.kind === kind).length + 1;
      const config = defaultsForKind(kind, id, `${t(`editor.kinds.${kind}`, { defaultValue: KIND_DEFAULT_LABEL[kind] })} ${count}`);
      const newNode: RFNode = { id, type: kind, position, data: { config } };
      setNodes((nds) => nds.concat(newNode));
    },
    [rf, nodes, setNodes, t],
  );

  // --- Presets / persistence ---
  const loadPreset = useCallback(
    (id: string) => {
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
    [setNodes, setEdges],
  );

  const exportDesign = useCallback(() => {
    setRunning(false);
    const sNodes: SerializedNode[] = nodes.map((n) => ({ id: n.id, position: n.position, config: n.data.config }));
    const json = serializeDesign(
      sNodes,
      edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
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
          const rfNodes: RFNode[] = design.nodes.map((n) => ({
            id: n.id,
            type: n.config.kind,
            position: n.position,
            data: { config: n.config },
          }));
          setNodes(rfNodes);
          setEdges(design.edges.map((ed) => ({ id: ed.id, source: ed.source, target: ed.target, animated: true, style: { strokeWidth: 2.5 } })));
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
    [setNodes, setEdges, t],
  );

  const selectedConfig = nodes.find((n) => n.id === selectedId)?.data.config ?? null;
  const nodeOptions = nodes.map((n) => ({ id: n.id, label: n.data.config.label }));

  const btn = 'px-3 py-2 font-mono text-sm uppercase tracking-wider border transition-colors flex items-center gap-2';

  return (
    <MetricsContext.Provider value={{ metrics, running, selectedId }}>
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
        <div className="label-mono text-signal-amber mb-1">[ SYSTEM DESIGN ] // {t('editor.engine_tagline', { defaultValue: 'SIMULATION ENGINE V2' })}</div>
        <h1 className="text-2xl md:text-3xl font-mono font-bold mb-4 tracking-tight text-slate-900 dark:text-tactical-text">
          {t('editor.title', { defaultValue: 'Distributed Systems Simulator' })}
        </h1>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
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

          <div className="border-l border-tactical-line h-8 mx-1" />

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

          <div className="border-l border-tactical-line h-8 mx-1" />

          <button onClick={exportDesign} className={`${btn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan`}>
            <Download className="w-4 h-4" /> {t('editor.buttons.export', { defaultValue: 'Export' })}
          </button>
          <button onClick={() => fileInputRef.current?.click()} className={`${btn} border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan`}>
            <Upload className="w-4 h-4" /> {t('editor.buttons.import', { defaultValue: 'Import' })}
          </button>
          <input type="file" ref={fileInputRef} accept=".din" className="hidden" onChange={importDesign} />
        </div>

        {importError && (
          <div className="bg-signal-red/10 border border-signal-red p-3 text-signal-red font-mono text-sm mb-3">{importError}</div>
        )}

        {/* Scenario controls */}
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

        {/* Canvas + inspector */}
        <div className="flex gap-0 tactical-panel" style={{ height: 560 }}>
          <div className="flex-1 relative" ref={canvasRef}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodesDelete={onNodesDelete}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onNodeClick={(_, node) => { setSelectedId(node.id); setShowBill(false); closeMenu(); }}
              onNodeContextMenu={onNodeContextMenu}
              onEdgeContextMenu={onEdgeContextMenu}
              onEdgeClick={closeMenu}
              onPaneClick={() => { setSelectedId(null); closeMenu(); }}
              onMoveStart={closeMenu}
              nodeTypes={nodeTypes}
              deleteKeyCode={['Backspace', 'Delete']}
              fitView
              fitViewOptions={{ padding: 0.4, maxZoom: 1 }}
              minZoom={0.2}
              maxZoom={1.5}
            >
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
              <Controls />
              <MiniMap nodeColor={(n) => NODE_CATALOG[(n.type as NodeKind) ?? 'server']?.hex ?? '#64748b'} />
              <Background variant={BackgroundVariant.Dots} gap={14} size={1} />
            </ReactFlow>

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
                    <div className="my-1 border-t border-slate-200 dark:border-tactical-border" />
                    <ContextItem icon={Trash2} label={t('editor.menu.delete')} tone="text-signal-red" onClick={() => { deleteNode(menu.id); closeMenu(); }} />
                  </>
                ) : (
                  <ContextItem icon={Trash2} label={t('editor.menu.delete_edge')} tone="text-signal-red" onClick={() => { deleteEdge(menu.id); closeMenu(); }} />
                )}
              </div>
            )}
          </div>

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
              <InspectorPanel config={selectedConfig} onChange={patchSelected} onDelete={deleteSelected} />
            )}
          </div>
        </div>

        {/* Dashboard */}
        <div className="mt-4">
          <Dashboard history={history} totalCost={totalCost} provider={provider} warnings={warnings} onCostClick={() => setShowBill(true)} />
        </div>
      </div>
    </MetricsContext.Provider>
  );
}

export default function SystemEditorV2() {
  return (
    <ReactFlowProvider>
      <EditorInner />
    </ReactFlowProvider>
  );
}
