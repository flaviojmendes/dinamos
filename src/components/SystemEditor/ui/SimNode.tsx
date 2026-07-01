// Single presentational node used for every kind. Reads its config from
// ReactFlow node data and its live metrics from MetricsContext. No sliders here
// (all editing lives in the InspectorPanel) so nodes stay compact and readable.

import { memo, useEffect, useRef, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useTranslation } from 'react-i18next';
import { ArrowUp, ArrowDown, Layers, Lock, Clock } from 'lucide-react';
import { NodeConfig, NodeMetrics } from '../engine/types';
import { NODE_CATALOG } from './nodeCatalog';
import { useNodeMetrics } from './MetricsContext';

export interface SimNodeData {
  config: NodeConfig;
}

/** Kinds whose replica count can scale at runtime (auto-scaler driven). */
const SCALABLE_KINDS = new Set(['autoScaler']);

/**
 * Connection anchors on every side of a box. They are all rendered as `source`
 * handles and ReactFlow runs in `ConnectionMode.Loose`, so any side can act as
 * either end of an edge — direction validity is enforced in the editor via
 * `isValidConnection`. Ids stay stable so saved/imported edges re-anchor.
 */
const HANDLE_SIDES: { id: string; position: Position }[] = [
  { id: 'top', position: Position.Top },
  { id: 'right', position: Position.Right },
  { id: 'bottom', position: Position.Bottom },
  { id: 'left', position: Position.Left },
];

const handleStyle = {
  width: 10,
  height: 10,
  borderRadius: 9999,
  background: '#64748b',
  border: '2px solid #0f172a',
};

function utilColor(util: number): string {
  if (util >= 1) return '#ef4444';
  if (util >= 0.8) return '#eab308';
  return '#22c55e';
}

/**
 * Animated stack of blocks representing the live replica count. Blocks grow and
 * shrink as the simulator scales the tier, with a brief up/down flash so the
 * change is visible at a glance.
 */
function ReplicaStack({ count, label }: { count: number; label: string }) {
  const prev = useRef(count);
  const [pulse, setPulse] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const before = prev.current;
    if (count > before) setPulse('up');
    else if (count < before) setPulse('down');
    prev.current = count;
    const tmo = setTimeout(() => setPulse(null), 800);
    return () => clearTimeout(tmo);
  }, [count]);

  const maxBlocks = 12;
  const shown = Math.min(count, maxBlocks);
  const pulseColor = pulse === 'up' ? 'text-signal-green' : pulse === 'down' ? 'text-signal-amber' : 'text-cyan-300';

  return (
    <div className="mt-1.5">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-tactical-label">{label}</span>
        <span className={`flex items-center gap-0.5 font-bold transition-colors ${pulseColor}`}>
          {pulse === 'up' && <ArrowUp className="w-3 h-3" />}
          {pulse === 'down' && <ArrowDown className="w-3 h-3" />}
          {count}
        </span>
      </div>
      <div className="flex items-end gap-0.5 h-5">
        {Array.from({ length: maxBlocks }).map((_, i) => {
          const active = i < shown;
          return (
            <div
              key={i}
              className="flex-1 rounded-[1px] transition-all duration-300 ease-out"
              style={{
                height: active ? '100%' : '22%',
                backgroundColor: active
                  ? pulse === 'up' && i === shown - 1
                    ? '#22c55e'
                    : '#22d3ee'
                  : '#1f2937',
                opacity: active ? 1 : 0.5,
              }}
            />
          );
        })}
      </div>
      {count > maxBlocks && <div className="text-[9px] text-tactical-label mt-0.5">+{count - maxBlocks}</div>}
    </div>
  );
}

function MetricRow({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-tactical-label">{label}</span>
      <span className={tone ?? 'text-tactical-text'}>{value}</span>
    </div>
  );
}

function KindExtras({ kind, config, metrics, t }: { kind: string; config: NodeConfig; metrics?: NodeMetrics; t: (k: string) => string }) {
  if (kind === 'cache' && metrics) {
    return (
      <>
        <MetricRow label={t('editor.node.hit_s')} value={`${metrics.cacheHits ?? 0}`} tone="text-pink-300" />
        <MetricRow label={t('editor.node.miss_s')} value={`${metrics.cacheMisses ?? 0}`} tone="text-red-300" />
        <MetricRow label={t('editor.node.hit_rate')} value={`${Math.round((config.hitRate ?? 0) * 100)}%`} tone="text-purple-300" />
      </>
    );
  }
  if (kind === 'messageQueue' && metrics) {
    const pct = config.maxQueue ? Math.min(100, (metrics.queueLength / config.maxQueue) * 100) : 0;
    return (
      <>
        <MetricRow label={t('editor.node.queue')} value={`${Math.round(metrics.queueLength)}/${config.maxQueue ?? '∞'}`} tone="text-orange-300" />
        <MetricRow label={t('editor.node.dropped_s')} value={`${metrics.droppedRate}`} tone="text-red-300" />
        <div className="mt-1 flex gap-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-2 flex-1"
              style={{
                backgroundColor: pct >= (i + 1) * 10 ? (pct >= 90 ? '#ef4444' : pct >= 80 ? '#eab308' : '#f97316') : '#1f2937',
              }}
            />
          ))}
        </div>
      </>
    );
  }
  if (kind === 'circuitBreaker' && metrics) {
    const state = metrics.circuitState ?? 'closed';
    const tone = state === 'open' ? 'text-red-400' : state === 'halfOpen' ? 'text-yellow-300' : 'text-green-400';
    return <MetricRow label={t('editor.node.breaker')} value={state === 'halfOpen' ? 'Half-open' : state.charAt(0).toUpperCase() + state.slice(1)} tone={tone} />;
  }
  if (kind === 'apiGateway' && metrics) {
    return <MetricRow label={t('editor.node.dropped_s')} value={`${metrics.droppedRate}`} tone="text-orange-300" />;
  }
  if (kind === 'replicatedDb' && metrics) {
    const rc = Math.max(1, config.replicaCount ?? 3);
    const writeFrac = config.writeFraction ?? 0.2;
    const writes = Math.round(metrics.throughput * writeFrac);
    const reads = Math.max(0, metrics.throughput - writes);
    const maxBlocks = 12;
    const shown = Math.min(rc, maxBlocks);
    return (
      <>
        <MetricRow label={t('editor.node.consistency')} value={t(`editor.inspector.cons.${config.consistency ?? 'quorum'}`)} tone="text-amber-200" />
        <MetricRow label={t('editor.node.writes')} value={`${writes}/s`} tone="text-amber-300" />
        <MetricRow label={t('editor.node.reads')} value={`${reads}/s`} tone="text-sky-300" />
        <div className="mt-1">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-tactical-label">{t('editor.node.replica_set')}</span>
            <span className="text-amber-300 font-bold">{rc}</span>
          </div>
          <div className="flex items-end gap-0.5 h-5">
            {Array.from({ length: shown }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-[1px] transition-all duration-300 ease-out"
                style={{ height: '100%', backgroundColor: i === 0 ? '#f59e0b' : '#38bdf8' }}
                title={i === 0 ? t('editor.node.primary') : `${t('editor.node.replica')} ${i}`}
              />
            ))}
          </div>
          {rc > maxBlocks && <div className="text-[9px] text-tactical-label mt-0.5">+{rc - maxBlocks}</div>}
        </div>
      </>
    );
  }
  if (kind === 'shardRouter' && metrics?.shardLoads) {
    const max = Math.max(...metrics.shardLoads, 1);
    return (
      <>
        <MetricRow label={t('editor.node.shards')} value={`${metrics.shardLoads.length}`} tone="text-teal-300" />
        <div className="mt-1 flex items-end gap-0.5 h-6">
          {metrics.shardLoads.map((l, i) => {
            const ratio = l / max;
            const hot = ratio >= 0.85;
            return (
              <div
                key={i}
                className="flex-1 transition-all duration-300 ease-out"
                style={{ height: `${Math.max(8, ratio * 100)}%`, backgroundColor: hot ? '#f59e0b' : '#2dd4bf' }}
                title={`shard ${i}: ${l}/s`}
              />
            );
          })}
        </div>
      </>
    );
  }
  return null;
}

function SimNodeImpl({ id, data, isConnectable, selected }: NodeProps<SimNodeData>) {
  const { t } = useTranslation();
  const config = data.config;
  const metrics = useNodeMetrics(id);
  const entry = NODE_CATALOG[config.kind];
  const Icon = entry.icon;
  const util = metrics?.utilization ?? 0;

  // A tier scales at runtime if it is an autoScaler node or a node that opted
  // into autoscaling via autoScaleEnabled.
  const isAutoScaling = SCALABLE_KINDS.has(config.kind) || !!config.autoScaleEnabled;
  // Effective replica count: live for auto-scaled tiers, configured otherwise.
  const replicaCount = Math.max(
    1,
    Math.round(isAutoScaling ? metrics?.replicas ?? config.replicas : config.replicas),
  );
  // How many "stacked card" layers to draw behind the box (capped for sanity).
  const stackLayers = Math.min(3, Math.max(0, replicaCount - 1));

  return (
    <div className="relative" style={{ minWidth: 190 }}>
      {/* Stacked cards behind the box visualise multiple replicas. Rendered
          before the main card so they paint underneath, offset to the corner. */}
      {Array.from({ length: stackLayers }).map((_, i) => (
        <div
          key={i}
          aria-hidden
          className={`absolute inset-0 border-2 ${entry.accent} bg-tactical-surface opacity-60`}
          style={{ transform: `translate(${(i + 1) * 4}px, ${(i + 1) * 4}px)` }}
        />
      ))}

      <div
        className={`relative px-3 py-2 border-2 ${entry.accent} bg-tactical-surface ${
          selected ? 'ring-2 ring-signal-cyan' : ''
        }`}
      >
      {HANDLE_SIDES.map(({ id: handleId, position }) => (
        <Handle
          key={handleId}
          id={handleId}
          type="source"
          position={position}
          isConnectable={isConnectable}
          style={handleStyle}
          className="transition-colors hover:!bg-signal-cyan"
        />
      ))}

      <div className="flex items-center gap-2 font-sans font-bold text-white tracking-tight text-sm">
        <Icon className="w-4 h-4 shrink-0" />
        {config.locked && (
          <Lock
            className="w-3 h-3 shrink-0 text-signal-amber"
            aria-label={t('editor.node.locked', { defaultValue: 'Locked component' })}
          />
        )}
        <span className="truncate">{config.label}</span>
        {config.cronEnabled && (
          <span
            title={t('editor.node.cron', { rate: config.cronRate ?? 0 })}
            className="flex items-center gap-0.5 px-1 py-0.5 bg-tactical-line text-signal-cyan text-[10px] font-bold rounded-sm"
          >
            <Clock className="w-3 h-3" />
          </span>
        )}
        {replicaCount > 1 && (
          <span
            title={t('editor.node.replicas')}
            className="ml-auto flex items-center gap-0.5 px-1 py-0.5 bg-tactical-line text-cyan-300 text-[10px] font-bold rounded-sm"
          >
            <Layers className="w-3 h-3" />×{replicaCount}
          </span>
        )}
      </div>

      {metrics ? (
        <div className="mt-2 text-[11px] font-mono space-y-0.5">
          <MetricRow label={t('editor.node.in')} value={`${metrics.arrivalRate}/s`} tone="text-yellow-300" />
          <MetricRow label={t('editor.node.out')} value={`${metrics.throughput}/s`} tone="text-green-300" />
          <MetricRow label={t('editor.node.p95')} value={`${metrics.p95.toFixed(0)}ms`} tone="text-cyan-300" />
          {metrics.failedRate > 0 && <MetricRow label={t('editor.node.fail_s')} value={`${metrics.failedRate}`} tone="text-red-300" />}
          {metrics.retriedRate > 0 && <MetricRow label={t('editor.node.retry_s')} value={`${metrics.retriedRate}`} tone="text-amber-300" />}
          <KindExtras kind={config.kind} config={config} metrics={metrics} t={t} />
          {isAutoScaling && <ReplicaStack count={metrics.replicas} label={t('editor.node.replicas')} />}
        </div>
      ) : (
        <div className="mt-2 text-[11px] font-sans text-tactical-label">{t('editor.node.idle')} · {t(`editor.kinds.${config.kind}`)}</div>
      )}

      {config.kind !== 'client' && (
        <div className="mt-1.5 h-1.5 bg-tactical-line overflow-hidden">
          <div className="h-full transition-all duration-300" style={{ width: `${Math.min(100, util * 100)}%`, backgroundColor: utilColor(util) }} />
        </div>
      )}
      </div>
    </div>
  );
}

export const SimNode = memo(SimNodeImpl);
export default SimNode;
