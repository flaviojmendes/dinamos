import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Panel, TacticalButton, SegmentBar } from '../tactical';
import { AnimatedMetric, GridBackdrop } from './motion';

const DATASET_SIZES = [10_000, 100_000, 1_000_000, 10_000_000];

interface Result {
  recall: number;
  latency: number;
  exactLatency: number;
  comparisons: number;
  memoryMB: number;
  speedup: number;
}

interface GraphNode {
  id: number;
  x: number;
  y: number;
}

const NODE_COUNT = 46;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

export default function VectorSearchSimulator() {
  const { t } = useTranslation();
  const [efSearch, setEfSearch] = useState(64);
  const [m, setM] = useState(16);
  const [datasetIdx, setDatasetIdx] = useState(2);
  const [result, setResult] = useState<Result | null>(null);
  const [query, setQuery] = useState({ x: 70, y: 40 });
  const [runId, setRunId] = useState(0);

  // Deterministic node layout + nearest-neighbour edges (the navigable graph).
  const { nodes, edges } = useMemo(() => {
    const rng = mulberry32(1337);
    const ns: GraphNode[] = Array.from({ length: NODE_COUNT }).map((_, i) => ({
      id: i,
      x: 6 + rng() * 88,
      y: 6 + rng() * 48,
    }));
    const neighborsOf = Math.max(2, Math.round(m / 6));
    const es: Array<[number, number]> = [];
    const seen = new Set<string>();
    ns.forEach((node) => {
      const near = ns
        .filter((o) => o.id !== node.id)
        .sort((a, b) => dist(node, a) - dist(node, b))
        .slice(0, neighborsOf);
      near.forEach((o) => {
        const key = node.id < o.id ? `${node.id}-${o.id}` : `${o.id}-${node.id}`;
        if (!seen.has(key)) {
          seen.add(key);
          es.push([node.id, o.id]);
        }
      });
    });
    return { nodes: ns, edges: es };
  }, [m]);

  const adjacency = useMemo(() => {
    const adj: Record<number, number[]> = {};
    nodes.forEach((n) => (adj[n.id] = []));
    edges.forEach(([a, b]) => {
      adj[a].push(b);
      adj[b].push(a);
    });
    return adj;
  }, [nodes, edges]);

  // Greedy best-first walk from an entry point toward the query (HNSW search layer).
  const visited = useMemo(() => {
    let current = 0;
    const order = [current];
    const guard = new Set<number>([current]);
    for (let step = 0; step < 12; step++) {
      const here = nodes[current];
      let best = current;
      let bestD = dist(here, query);
      adjacency[current].forEach((nb) => {
        const d = dist(nodes[nb], query);
        if (d < bestD) {
          bestD = d;
          best = nb;
        }
      });
      if (best === current || guard.has(best)) break;
      guard.add(best);
      order.push(best);
      current = best;
    }
    return order;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, adjacency, nodes, runId]);

  const nearestId = useMemo(() => {
    let id = 0;
    let d = Infinity;
    nodes.forEach((n) => {
      const dd = dist(n, query);
      if (dd < d) {
        d = dd;
        id = n.id;
      }
    });
    return id;
  }, [nodes, query]);

  const compute = useCallback((): Result => {
    const n = DATASET_SIZES[datasetIdx];
    const log2n = Math.log2(n);
    const recall = Math.max(
      40,
      Math.min(99.8, 52 + (efSearch / 200) * 38 + (m / 48) * 12 - (Math.log10(n) - 4) * 2.5),
    );
    const comparisons = Math.round(efSearch * log2n * (1 + m / 32));
    const latency = Math.max(1, Math.round(comparisons / 600));
    const exactLatency = Math.round(n / 8000);
    const memoryMB = Math.round((n * m * 10) / 1_000_000);
    const speedup = Math.max(1, Math.round(exactLatency / latency));
    return {
      recall: Number(recall.toFixed(1)),
      latency,
      exactLatency,
      comparisons,
      memoryMB,
      speedup,
    };
  }, [efSearch, m, datasetIdx]);

  const run = useCallback(() => {
    setQuery({ x: 14 + Math.random() * 72, y: 8 + Math.random() * 44 });
    setRunId((r) => r + 1);
    setResult(compute());
  }, [compute]);

  const reset = useCallback(() => {
    setResult(null);
    setRunId((r) => r + 1);
  }, []);

  const n = DATASET_SIZES[datasetIdx];
  const datasetLabel = n >= 1_000_000 ? `${n / 1_000_000}M` : `${n / 1_000}K`;
  const memLabel = result ? (result.memoryMB >= 1024 ? `${(result.memoryMB / 1024).toFixed(1)} GB` : `${result.memoryMB} MB`) : '';

  const rangeClass = 'flex-1 h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';
  const base = 'simulators.vector_search';

  const visitedSet = new Set(visited);
  const pathD = visited.map((id, i) => `${i === 0 ? 'M' : 'L'} ${nodes[id].x} ${nodes[id].y}`).join(' ');

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant="secondary" onClick={run}>{t(`${base}.buttons.search`)}</TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>{t(`${base}.buttons.reset`)}</TacticalButton>
          </div>
        }
      >
        <p className="font-mono text-xs text-slate-500 dark:text-tactical-dim mb-6">{t(`${base}.subtitle`)}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.controls.ef_search`)}</label>
            <div className="flex items-center gap-2">
              <input type="range" min="10" max="200" step="2" value={efSearch} onChange={e => setEfSearch(Number(e.target.value))} className={rangeClass} />
              <span className="font-mono text-sm w-10 text-right text-signal-cyan tabular-nums">{efSearch}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.controls.m_links`)}</label>
            <div className="flex items-center gap-2">
              <input type="range" min="4" max="48" step="2" value={m} onChange={e => setM(Number(e.target.value))} className={rangeClass} />
              <span className="font-mono text-sm w-10 text-right text-signal-cyan tabular-nums">{m}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.controls.dataset`)}</label>
            <div className="flex items-center gap-2">
              <input type="range" min="0" max="3" value={datasetIdx} onChange={e => setDatasetIdx(Number(e.target.value))} className={rangeClass} />
              <span className="font-mono text-sm w-10 text-right text-signal-cyan tabular-nums">{datasetLabel}</span>
            </div>
          </div>
        </div>
      </Panel>

      {/* Navigable graph visualization */}
      <Panel title={t(`${base}.controls.m_links`)} accent="cyan" bodyClassName="p-0">
        <div className="relative">
          <GridBackdrop />
          <svg viewBox="0 0 100 60" className="relative w-full" style={{ aspectRatio: '100 / 60' }}>
            {/* graph edges */}
            {edges.map(([a, b], i) => (
              <line
                key={`e-${i}`}
                x1={nodes[a].x}
                y1={nodes[a].y}
                x2={nodes[b].x}
                y2={nodes[b].y}
                className="stroke-slate-300 dark:stroke-tactical-border"
                strokeWidth={0.25}
              />
            ))}

            {result && (
              <g key={runId}>
                {/* traversal path */}
                <motion.path
                  d={pathD}
                  fill="none"
                  className="stroke-signal-cyan"
                  strokeWidth={0.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0.9 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: Math.max(0.6, visited.length * 0.22), ease: 'easeInOut' }}
                />
                {/* query target */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  style={{ transformOrigin: `${query.x}px ${query.y}px`, transformBox: 'fill-box' }}
                >
                  <motion.circle
                    cx={query.x}
                    cy={query.y}
                    r={2.6}
                    className="fill-none stroke-signal-amber"
                    strokeWidth={0.4}
                    animate={{ r: [2.6, 4.2, 2.6], opacity: [0.9, 0.2, 0.9] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <circle cx={query.x} cy={query.y} r={1.4} className="fill-signal-amber" />
                </motion.g>
              </g>
            )}

            {/* nodes */}
            {nodes.map((node) => {
              const order = visited.indexOf(node.id);
              const isVisited = result && visitedSet.has(node.id);
              const isNearest = result && node.id === nearestId;
              return (
                <motion.circle
                  key={`${node.id}-${runId}`}
                  cx={node.x}
                  cy={node.y}
                  r={isNearest ? 1.8 : 1.2}
                  className={
                    isNearest
                      ? 'fill-signal-green'
                      : isVisited
                        ? 'fill-signal-cyan'
                        : 'fill-slate-400 dark:fill-tactical-label'
                  }
                  initial={false}
                  animate={
                    isVisited
                      ? { scale: [0.6, 1.8, 1], opacity: 1 }
                      : { scale: 1, opacity: 0.55 }
                  }
                  transition={{ delay: isVisited && order >= 0 ? order * 0.22 : 0, duration: 0.4 }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px`, transformBox: 'fill-box' }}
                />
              );
            })}
          </svg>
          <div className="flex flex-wrap items-center gap-4 border-t border-slate-200 dark:border-tactical-border px-4 py-2 font-mono text-[11px] text-slate-500 dark:text-tactical-dim">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-signal-amber" />{t(`${base}.buttons.search`)}</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-signal-cyan" />{t(`${base}.metrics.comparisons`)}</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-signal-green" />{t(`${base}.labels.approx`)}</span>
          </div>
        </div>
      </Panel>

      {!result && (
        <div className="border border-dashed border-slate-300 dark:border-tactical-border px-4 py-8 text-center font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-tactical-label">
          {t(`${base}.labels.idle`)}
        </div>
      )}

      {result && (
        <>
          <Panel title={t(`${base}.metrics.recall`)} accent="green">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <AnimatedMetric value={result.recall} decimals={1} suffix="%" label={t(`${base}.metrics.recall`)} color={result.recall > 90 ? 'green' : 'amber'} />
              <AnimatedMetric value={result.latency} suffix="ms" label={t(`${base}.metrics.latency`)} color="cyan" />
              <AnimatedMetric value={result.comparisons} format={(v) => Math.round(v).toLocaleString()} label={t(`${base}.metrics.comparisons`)} color="default" />
              <AnimatedMetric value={result.memoryMB} format={() => memLabel} label={t(`${base}.metrics.memory`)} color={result.memoryMB > 1024 ? 'red' : 'default'} />
            </div>
          </Panel>

          <Panel title={`${t(`${base}.labels.exact`)} vs ${t(`${base}.labels.approx`)}`} accent="amber">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.labels.exact`)}</span>
                  <span className="font-mono text-xs text-signal-red tabular-nums">{result.exactLatency}ms</span>
                </div>
                <SegmentBar value={result.exactLatency} max={Math.max(result.exactLatency, result.latency)} color="red" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="label-mono text-slate-500 dark:text-tactical-label">{t(`${base}.labels.approx`)}</span>
                  <span className="font-mono text-xs text-signal-green tabular-nums">{result.latency}ms</span>
                </div>
                <SegmentBar value={result.latency} max={Math.max(result.exactLatency, result.latency)} color="green" />
              </div>
              <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
                <div className="font-mono text-2xl font-bold tabular-nums leading-none text-signal-cyan">
                  <AnimatedMetricInline value={result.speedup} suffix="×" />
                </div>
                <div className="label-mono mt-2">{t(`${base}.labels.approx`)} / {t(`${base}.labels.exact`)}</div>
              </div>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}

function AnimatedMetricInline({ value, suffix }: { value: number; suffix?: string }) {
  return (
    <motion.span key={value} initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
      {value}
      {suffix ?? ''}
    </motion.span>
  );
}
