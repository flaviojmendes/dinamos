// Right-hand inspector: edit the full configuration of the selected node.
// Renders common fields plus kind-specific controls.

import { useEffect, useRef, useState } from 'react';
import { Trash2, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NodeConfig, NodeKind, nodeCapacity } from '../engine/types';
import { NODE_CATALOG } from './nodeCatalog';

type TFunc = (key: string, opts?: Record<string, unknown>) => string;

function HintIcon({ hint }: { hint?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  if (!hint) return null;

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        type="button"
        title={hint}
        aria-label={hint}
        aria-expanded={open}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((o) => !o); }}
        className={`cursor-pointer transition-colors ${open ? 'text-signal-cyan' : 'text-tactical-label/60 hover:text-signal-cyan'}`}
      >
        <Info className="w-3 h-3" />
      </button>
      {open && (
        <div
          className="absolute z-50 left-4 top-0 w-56 normal-case tracking-normal bg-white dark:bg-tactical-surface border border-slate-200 dark:border-tactical-border rounded-lg shadow-lg p-2 font-sans text-[11px] leading-relaxed text-slate-700 dark:text-tactical-text"
          onClick={(e) => e.stopPropagation()}
        >
          {hint}
        </div>
      )}
    </span>
  );
}

interface Props {
  config: NodeConfig | null;
  onChange: (patch: Partial<NodeConfig>) => void;
  onDelete: () => void;
  /** When false (locked game component) the delete button is hidden. */
  canDelete?: boolean;
}

function Num({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  hint,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block mb-3">
      <div className="flex justify-between font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-1">
        <span className="flex items-center gap-1">{label}<HintIcon hint={hint} /></span>
        <span className="text-tactical-text">
          {value}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-signal-cyan"
      />
    </label>
  );
}

function Select<T extends string>({
  label,
  value,
  options,
  hint,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  hint?: string;
  onChange: (v: T) => void;
}) {
  return (
    <label className="block mb-3">
      <div className="flex items-center gap-1 font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-1">{label}<HintIcon hint={hint} /></div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full bg-tactical-raised border border-tactical-border rounded-md px-2 py-1 font-sans text-sm text-tactical-text"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function InspectorPanel({ config, onChange, onDelete, canDelete = true }: Props) {
  const { t } = useTranslation();
  if (!config) {
    return (
      <div className="p-4 font-sans text-xs text-tactical-label">
        <div className="font-sans text-[11px] font-medium text-slate-600 dark:text-signal-amber mb-2">{t('editor.inspector.title', { defaultValue: 'Inspector' })}</div>
        {t('editor.inspector.empty', { defaultValue: 'Select a node to edit its configuration.' })}
      </div>
    );
  }

  const entry = NODE_CATALOG[config.kind];
  const Icon = entry.icon;
  const capacity = nodeCapacity(config);

  return (
    <div className="p-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 font-sans text-sm font-bold text-tactical-text">
          <Icon className="w-4 h-4" />
          {t(`editor.kinds.${config.kind}`)}
        </div>
        {canDelete && (
          <button
            onClick={onDelete}
            className="text-tactical-label hover:text-signal-red transition-colors"
            aria-label="Delete node"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mb-4 border-l-2 border-signal-cyan/60 bg-signal-cyan/5 rounded-r-md px-3 py-2">
        <div className="font-sans text-[11px] font-medium text-signal-cyan mb-1">{t('editor.how_to_use')}</div>
        <p className="font-sans text-[11px] leading-relaxed text-tactical-dim">
          {t(`editor.descriptions.${config.kind}`)}
        </p>
      </div>

      <label className="block mb-3">
        <div className="flex items-center gap-1 font-sans text-[11px] font-medium text-slate-500 dark:text-tactical-label mb-1">{t('editor.inspector.label')}<HintIcon hint={t('editor.hints.label')} /></div>
        <input
          value={config.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className="w-full bg-tactical-raised border border-tactical-border rounded-md px-2 py-1 font-sans text-sm text-tactical-text"
        />
      </label>

      {config.kind === 'client' && (
        <Num label={t('editor.inspector.base_rate')} hint={t('editor.hints.base_rate')} value={config.baseRate ?? 50} min={1} max={5000} step={10} unit="req/s" onChange={(v) => onChange({ baseRate: v })} />
      )}

      {config.kind !== 'client' && (
        <>
          <Num label={t('editor.inspector.service_time')} hint={t('editor.hints.service_time')} value={config.serviceTimeMs} min={1} max={500} unit="ms" onChange={(v) => onChange({ serviceTimeMs: v })} />
          <Num label={t('editor.inspector.concurrency')} hint={t('editor.hints.concurrency')} value={config.concurrency} min={1} max={128} unit="srv" onChange={(v) => onChange({ concurrency: v })} />
          {config.kind !== 'autoScaler' && config.kind !== 'replicatedDb' && (
            <Num label={t('editor.inspector.replicas')} hint={t('editor.hints.replicas')} value={config.replicas} min={1} max={50} onChange={(v) => onChange({ replicas: v })} />
          )}
          <div className="font-sans text-[10px] text-slate-500 dark:text-tactical-label mb-3">
            {t('editor.inspector.capacity_approx', { value: isFinite(capacity) ? `${Math.round(capacity)} req/s` : '∞' })}
          </div>
        </>
      )}

      {/* Kind-specific controls */}
      {renderKindControls(config, onChange, t)}

      {/* Reliability */}
      <div className="font-sans text-[11px] font-medium text-slate-600 dark:text-signal-amber mt-2 mb-2">{t('editor.inspector.reliability')}</div>
      <Num label={t('editor.inspector.failure_rate')} hint={t('editor.hints.failure_rate')} value={Math.round(config.failureRate * 100)} min={0} max={100} unit="%" onChange={(v) => onChange({ failureRate: v / 100 })} />
      <Num label={t('editor.inspector.timeout')} hint={t('editor.hints.timeout')} value={config.timeoutMs} min={50} max={10000} step={50} unit="ms" onChange={(v) => onChange({ timeoutMs: v })} />
      <Num label={t('editor.inspector.max_retries')} hint={t('editor.hints.max_retries')} value={config.retry?.maxRetries ?? 0} min={0} max={6} onChange={(v) => onChange({ retry: { maxRetries: v, backoffBaseMs: config.retry?.backoffBaseMs ?? 50, jitter: config.retry?.jitter ?? true } })} />

      {/* Latency shape */}
      <div className="font-sans text-[11px] font-medium text-slate-600 dark:text-signal-amber mt-2 mb-2">{t('editor.inspector.latency_shape')}</div>
      <Select
        label={t('editor.inspector.distribution')}
        hint={t('editor.hints.distribution')}
        value={config.latencyDistribution}
        options={[
          { value: 'lognormal', label: t('editor.inspector.dist.lognormal') },
          { value: 'exponential', label: t('editor.inspector.dist.exponential') },
          { value: 'deterministic', label: t('editor.inspector.dist.deterministic') },
        ]}
        onChange={(v) => onChange({ latencyDistribution: v })}
      />
      {config.latencyDistribution === 'lognormal' && (
        <Num label={t('editor.inspector.variability')} hint={t('editor.hints.variability')} value={config.latencyCv} min={0.1} max={2} step={0.1} onChange={(v) => onChange({ latencyCv: v })} />
      )}
    </div>
  );
}

function renderKindControls(config: NodeConfig, onChange: (patch: Partial<NodeConfig>) => void, t: TFunc) {
  switch (config.kind) {
    case 'loadBalancer':
      return (
        <Select
          label={t('editor.inspector.strategy')}
          hint={t('editor.hints.strategy')}
          value={config.strategy ?? 'roundRobin'}
          options={[
            { value: 'roundRobin', label: t('editor.inspector.strat.roundRobin') },
            { value: 'leastConnections', label: t('editor.inspector.strat.leastConnections') },
            { value: 'weighted', label: t('editor.inspector.strat.weighted') },
            { value: 'hashing', label: t('editor.inspector.strat.hashing') },
          ]}
          onChange={(v) => onChange({ strategy: v })}
        />
      );
    case 'apiGateway':
      return <Num label={t('editor.inspector.rate_limit')} hint={t('editor.hints.rate_limit')} value={config.rateLimit ?? 1000} min={10} max={10000} step={10} unit="req/s" onChange={(v) => onChange({ rateLimit: v })} />;
    case 'cache':
      return (
        <>
          <Num label={t('editor.inspector.hit_rate')} hint={t('editor.hints.hit_rate')} value={Math.round((config.hitRate ?? 0.8) * 100)} min={0} max={100} unit="%" onChange={(v) => onChange({ hitRate: v / 100 })} />
          <Num label={t('editor.inspector.ttl')} hint={t('editor.hints.ttl')} value={config.ttlSeconds ?? 60} min={1} max={3600} step={1} unit="s" onChange={(v) => onChange({ ttlSeconds: v })} />
        </>
      );
    case 'messageQueue':
      return (
        <>
          <Num label={t('editor.inspector.queue_capacity')} hint={t('editor.hints.queue_capacity')} value={config.maxQueue ?? 1000} min={10} max={100000} step={10} unit="msgs" onChange={(v) => onChange({ maxQueue: v })} />
          <Num label={t('editor.inspector.drain_rate')} hint={t('editor.hints.drain_rate')} value={config.dequeueRate ?? 100} min={1} max={5000} step={10} unit="msgs/s" onChange={(v) => onChange({ dequeueRate: v })} />
        </>
      );
    case 'replicatedDb':
      return (
        <>
          <Num label={t('editor.inspector.replicas')} hint={t('editor.hints.replicas')} value={config.replicaCount ?? 3} min={1} max={15} onChange={(v) => onChange({ replicaCount: v })} />
          <Num label={t('editor.inspector.write_fraction')} hint={t('editor.hints.write_fraction')} value={Math.round((config.writeFraction ?? 0.2) * 100)} min={0} max={100} unit="%" onChange={(v) => onChange({ writeFraction: v / 100 })} />
          <Num label={t('editor.inspector.replication_lag')} hint={t('editor.hints.replication_lag')} value={config.replicationLagMs ?? 50} min={0} max={1000} step={5} unit="ms" onChange={(v) => onChange({ replicationLagMs: v })} />
          <Select
            label={t('editor.inspector.consistency')}
            hint={t('editor.hints.consistency')}
            value={config.consistency ?? 'quorum'}
            options={[
              { value: 'strong', label: t('editor.inspector.cons.strong') },
              { value: 'quorum', label: t('editor.inspector.cons.quorum') },
              { value: 'eventual', label: t('editor.inspector.cons.eventual') },
            ]}
            onChange={(v) => onChange({ consistency: v })}
          />
        </>
      );
    case 'shardRouter':
      return (
        <>
          <Num label={t('editor.inspector.shard_count')} hint={t('editor.hints.shard_count')} value={config.shardCount ?? 4} min={1} max={64} onChange={(v) => onChange({ shardCount: v })} />
          <Num label={t('editor.inspector.skew')} hint={t('editor.hints.skew')} value={Math.round((config.skew ?? 0) * 100)} min={0} max={100} unit="%" onChange={(v) => onChange({ skew: v / 100 })} />
          <Select
            label={t('editor.inspector.strategy')}
            hint={t('editor.hints.shard_strategy')}
            value={config.shardStrategy ?? 'hash'}
            options={[
              { value: 'hash', label: t('editor.inspector.shard_strat.hash') },
              { value: 'range', label: t('editor.inspector.shard_strat.range') },
            ]}
            onChange={(v) => onChange({ shardStrategy: v })}
          />
        </>
      );
    case 'circuitBreaker':
      return (
        <>
          <Num label={t('editor.inspector.error_threshold')} hint={t('editor.hints.error_threshold')} value={Math.round((config.errorThreshold ?? 0.5) * 100)} min={1} max={100} unit="%" onChange={(v) => onChange({ errorThreshold: v / 100 })} />
          <Num label={t('editor.inspector.reset_timeout')} hint={t('editor.hints.reset_timeout')} value={config.resetTimeoutMs ?? 5000} min={500} max={60000} step={500} unit="ms" onChange={(v) => onChange({ resetTimeoutMs: v })} />
        </>
      );
    case 'autoScaler':
      return (
        <>
          <Num label={t('editor.inspector.target_utilization')} hint={t('editor.hints.target_utilization')} value={Math.round((config.targetUtilization ?? 0.7) * 100)} min={10} max={95} unit="%" onChange={(v) => onChange({ targetUtilization: v / 100 })} />
          <Num label={t('editor.inspector.min_replicas')} hint={t('editor.hints.min_replicas')} value={config.minReplicas ?? 1} min={1} max={50} onChange={(v) => onChange({ minReplicas: v })} />
          <Num label={t('editor.inspector.max_replicas')} hint={t('editor.hints.max_replicas')} value={config.maxReplicas ?? 20} min={1} max={100} onChange={(v) => onChange({ maxReplicas: v })} />
        </>
      );
    default:
      return null;
  }
}

export type { NodeKind };
