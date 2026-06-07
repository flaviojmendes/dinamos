import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Panel, TacticalButton } from '../tactical';
import { AnimatedMetric, GridBackdrop } from '../AISystems/motion';

const PALETTE = ['#22c55e', '#06b6d4', '#f59e0b', '#a855f7', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6'];

function hash01(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

const RADIUS = 38;
const CENTER = 50;
const polar = (a: number, r = RADIUS) => {
  const theta = a * 2 * Math.PI - Math.PI / 2;
  return { x: CENTER + r * Math.cos(theta), y: CENTER + r * Math.sin(theta) };
};

interface VNode {
  angle: number;
  node: number;
}

export default function ConsistentHashingSimulator() {
  const { t } = useTranslation();
  const base = 'simulators.consistent_hashing';

  const [nodeCount, setNodeCount] = useState(3);
  const [vnodes, setVnodes] = useState(4);
  const [keyCount, setKeyCount] = useState(60);
  const [seed, setSeed] = useState(1);

  const [movedSet, setMovedSet] = useState<Set<number>>(new Set());
  const [movedPct, setMovedPct] = useState(0);
  const prevOwners = useRef<Map<number, number>>(new Map());

  const ring: VNode[] = useMemo(() => {
    const vs: VNode[] = [];
    for (let n = 0; n < nodeCount; n++) {
      for (let v = 0; v < vnodes; v++) {
        vs.push({ angle: hash01(`N${n}#${v}`), node: n });
      }
    }
    return vs.sort((a, b) => a.angle - b.angle);
  }, [nodeCount, vnodes]);

  const keys = useMemo(
    () => Array.from({ length: keyCount }).map((_, i) => ({ id: i, angle: hash01(`key-${seed}-${i}`) })),
    [keyCount, seed],
  );

  const ownerOf = (angle: number): number => {
    if (ring.length === 0) return -1;
    for (const v of ring) {
      if (v.angle >= angle) return v.node;
    }
    return ring[0].node;
  };

  const owners = useMemo(() => {
    const m = new Map<number, number>();
    keys.forEach(k => m.set(k.id, ownerOf(k.angle)));
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, ring]);

  // Detect which keys changed owner since the last topology/key change.
  useEffect(() => {
    const prev = prevOwners.current;
    const moved = new Set<number>();
    owners.forEach((node, id) => {
      if (prev.has(id) && prev.get(id) !== node) moved.add(id);
    });
    if (prev.size > 0) {
      setMovedSet(moved);
      setMovedPct(keys.length > 0 ? Math.round((moved.size / keys.length) * 100) : 0);
    }
    prevOwners.current = new Map(owners);
    const timer = window.setTimeout(() => setMovedSet(new Set()), 1400);
    return () => window.clearTimeout(timer);
  }, [owners, keys.length]);

  // Load distribution + imbalance.
  const { imbalance } = useMemo(() => {
    const load = new Array(nodeCount).fill(0);
    owners.forEach(node => { if (node >= 0) load[node] += 1; });
    const avg = keys.length / Math.max(1, nodeCount);
    const max = Math.max(...load, 0);
    return { imbalance: avg > 0 ? Math.round(((max - avg) / avg) * 100) : 0 };
  }, [owners, nodeCount, keys.length]);

  const reset = () => {
    prevOwners.current = new Map();
    setNodeCount(3);
    setVnodes(4);
    setKeyCount(60);
    setSeed(1);
    setMovedSet(new Set());
    setMovedPct(0);
  };

  const rangeClass = 'flex-1 h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';

  return (
    <div className="space-y-6">
      <Panel
        title={t(`${base}.title`)}
        accent="cyan"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TacticalButton size="sm" variant="secondary" onClick={() => setNodeCount(c => Math.min(PALETTE.length, c + 1))} disabled={nodeCount >= PALETTE.length}>
              {t(`${base}.buttons.add_node`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="secondary" onClick={() => setNodeCount(c => Math.max(1, c - 1))} disabled={nodeCount <= 1}>
              {t(`${base}.buttons.remove_node`)}
            </TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={() => setSeed(s => s + 1)}>{t(`${base}.buttons.shuffle`)}</TacticalButton>
            <TacticalButton size="sm" variant="ghost" onClick={reset}>{t(`${base}.buttons.reset`)}</TacticalButton>
          </div>
        }
      >
        <p className="font-sans text-xs text-slate-500 dark:text-tactical-dim mb-6">{t(`${base}.subtitle`)}</p>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.controls.vnodes`)}</label>
            <div className="flex items-center gap-2">
              <input type="range" min="1" max="40" value={vnodes} onChange={e => setVnodes(Number(e.target.value))} className={rangeClass} />
              <span className="font-mono text-sm w-10 text-right text-signal-cyan tabular-nums">{vnodes}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label">{t(`${base}.controls.keys`)}</label>
            <div className="flex items-center gap-2">
              <input type="range" min="10" max="200" step="10" value={keyCount} onChange={e => setKeyCount(Number(e.target.value))} className={rangeClass} />
              <span className="font-mono text-sm w-10 text-right text-signal-cyan tabular-nums">{keyCount}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-center">
          {/* Ring */}
          <div className="relative">
            <GridBackdrop />
            <svg viewBox="0 0 100 100" className="relative mx-auto w-full max-w-[460px]">
              <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" className="stroke-slate-300 dark:stroke-tactical-border" strokeWidth={0.4} />

              {/* virtual nodes */}
              {ring.map((v, i) => {
                const p = polar(v.angle, RADIUS);
                const inner = polar(v.angle, RADIUS - 2.5);
                return (
                  <line key={`v-${i}`} x1={inner.x} y1={inner.y} x2={p.x} y2={p.y} stroke={PALETTE[v.node]} strokeWidth={1.1} strokeLinecap="round" />
                );
              })}

              {/* keys */}
              {keys.map(k => {
                const owner = owners.get(k.id) ?? 0;
                const p = polar(k.angle, RADIUS - 6);
                const moved = movedSet.has(k.id);
                return (
                  <motion.circle
                    key={k.id}
                    cx={p.x}
                    cy={p.y}
                    r={moved ? 1.6 : 1.1}
                    fill={PALETTE[owner]}
                    initial={false}
                    animate={moved ? { scale: [1, 2.2, 1], opacity: [1, 0.6, 1] } : { scale: 1, opacity: 0.9 }}
                    transition={{ duration: 0.8 }}
                    style={{ transformOrigin: `${p.x}px ${p.y}px`, transformBox: 'fill-box' }}
                  />
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-row flex-wrap gap-2 lg:flex-col">
            {Array.from({ length: nodeCount }).map((_, n) => {
              const load = Array.from(owners.values()).filter(o => o === n).length;
              return (
                <div key={n} className="flex items-center gap-2 rounded-md dark:rounded-none border border-slate-200 dark:border-tactical-border px-3 py-1.5">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: PALETTE[n] }} />
                  <span className="font-sans text-xs text-slate-700 dark:text-tactical-text">{t(`${base}.labels.node`)} {n}</span>
                  <span className="font-mono text-[11px] text-slate-500 dark:text-tactical-dim tabular-nums">{load}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      <Panel title={t(`${base}.metrics.title`)} accent="green">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <AnimatedMetric value={nodeCount} label={t(`${base}.metrics.nodes`)} color="cyan" />
          <AnimatedMetric value={nodeCount * vnodes} label={t(`${base}.metrics.vnodes`)} color="default" />
          <AnimatedMetric value={keyCount} label={t(`${base}.metrics.keys`)} color="default" />
          <AnimatedMetric value={movedPct} suffix="%" label={t(`${base}.metrics.moved`)} color={movedPct > 40 ? 'red' : 'amber'} pulse={movedSet.size > 0} />
          <AnimatedMetric value={imbalance} suffix="%" label={t(`${base}.metrics.imbalance`)} color={imbalance > 50 ? 'red' : 'green'} />
        </div>
        <p className="mt-3 font-sans text-[11px] text-slate-500 dark:text-tactical-dim">{t(`${base}.labels.hint`)}</p>
      </Panel>
    </div>
  );
}
