import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Panel, TacticalButton, SegmentBar } from '../tactical';

const DATASET_SIZES = [10_000, 100_000, 1_000_000, 10_000_000];

interface Result {
  recall: number;
  latency: number;
  exactLatency: number;
  comparisons: number;
  memoryMB: number;
  speedup: number;
}

export default function VectorSearchSimulator() {
  const { t } = useTranslation();
  const [efSearch, setEfSearch] = useState(64);
  const [m, setM] = useState(16);
  const [datasetIdx, setDatasetIdx] = useState(2);
  const [result, setResult] = useState<Result | null>(null);

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

  const run = useCallback(() => setResult(compute()), [compute]);
  const reset = useCallback(() => setResult(null), []);

  const n = DATASET_SIZES[datasetIdx];
  const datasetLabel = n >= 1_000_000 ? `${n / 1_000_000}M` : `${n / 1_000}K`;
  const memLabel = result ? (result.memoryMB >= 1024 ? `${(result.memoryMB / 1024).toFixed(1)} GB` : `${result.memoryMB} MB`) : '';

  const rangeClass = 'flex-1 h-2 bg-slate-200 dark:bg-tactical-border appearance-none cursor-pointer accent-signal-green';
  const base = 'simulators.vector_search';

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

        {!result && (
          <div className="mt-6 border border-dashed border-slate-300 dark:border-tactical-border px-4 py-8 text-center font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-tactical-label">
            {t(`${base}.labels.idle`)}
          </div>
        )}
      </Panel>

      {result && (
        <>
          <Panel title={t(`${base}.metrics.recall`)} accent="green">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Metric value={`${result.recall}%`} label={t(`${base}.metrics.recall`)} color={result.recall > 90 ? 'green' : 'amber'} />
              <Metric value={`${result.latency}ms`} label={t(`${base}.metrics.latency`)} color="cyan" />
              <Metric value={result.comparisons.toLocaleString()} label={t(`${base}.metrics.comparisons`)} color="default" />
              <Metric value={memLabel} label={t(`${base}.metrics.memory`)} color={result.memoryMB > 1024 ? 'red' : 'default'} />
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
                <div className="font-mono text-2xl font-bold tabular-nums leading-none text-signal-cyan">{result.speedup}×</div>
                <div className="label-mono mt-2">{t(`${base}.labels.approx`)} / {t(`${base}.labels.exact`)}</div>
              </div>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}

function Metric({ value, label, color }: { value: string; label: string; color: 'default' | 'green' | 'amber' | 'red' | 'cyan' }) {
  const colorClass: Record<string, string> = {
    default: 'text-slate-900 dark:text-tactical-text',
    green: 'text-signal-green',
    amber: 'text-signal-amber',
    red: 'text-signal-red',
    cyan: 'text-signal-cyan',
  };
  return (
    <div className="border border-slate-200 dark:border-tactical-border px-3 py-3">
      <div className={`font-mono text-2xl font-bold tabular-nums leading-none ${colorClass[color]}`}>{value}</div>
      <div className="label-mono mt-2">{label}</div>
    </div>
  );
}
