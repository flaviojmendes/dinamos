// System-level dashboard: live stats + recharts time-series fed from the
// simulator's frame history.

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { SimulationFrame } from '../engine/types';
import { providerLabel, CloudProvider } from '../engine/costModel';

interface Props {
  history: SimulationFrame[];
  totalCost: number;
  provider: CloudProvider;
  warnings: string[];
  onCostClick?: () => void;
}

const SLO_P95_MS = 250;
const SLO_SUCCESS = 0.99;

function Stat({ label, value, tone, onClick, title }: { label: string; value: string; tone?: string; onClick?: () => void; title?: string }) {
  return (
    <div
      onClick={onClick}
      title={title}
      className={`border border-tactical-border bg-tactical-raised px-3 py-2 ${onClick ? 'cursor-pointer hover:border-signal-cyan transition-colors' : ''}`}
    >
      <div className="font-mono text-[10px] uppercase tracking-wider text-tactical-label">{label}</div>
      <div className={`font-mono text-lg font-bold ${tone ?? 'text-tactical-text'}`}>{value}</div>
    </div>
  );
}

const axis = { stroke: '#475569', fontSize: 10, fontFamily: 'monospace' };
const gridStroke = '#1f2937';

function formatWarning(w: string, t: (k: string, o?: Record<string, unknown>) => string): string {
  const [code, name] = w.split(':');
  return t(`editor.warnings.${code}`, { name: name ?? '', defaultValue: w.replace(/_/g, ' ') });
}

export default function Dashboard({ history, totalCost, provider, warnings, onCostClick }: Props) {
  const { t } = useTranslation();
  const latest = history[history.length - 1]?.system;
  const data = history.map((f) => ({
    t: Math.round(f.time),
    offered: Math.round(f.system.offeredLoad),
    throughput: Math.round(f.system.totalThroughput),
    p50: Math.round(f.system.p50),
    p95: Math.round(f.system.p95),
    p99: Math.round(f.system.p99),
    success: Math.round(f.system.successRate * 1000) / 10,
    inFlight: Math.round(f.system.inFlightTotal),
    cost: Math.round(f.system.costPerHour * 100) / 100,
  }));

  const successTone = (latest?.successRate ?? 1) >= SLO_SUCCESS ? 'text-signal-green' : 'text-signal-red';
  const p95Tone = (latest?.p95 ?? 0) <= SLO_P95_MS ? 'text-signal-green' : 'text-signal-amber';
  const errorBudgetUsed = latest ? Math.min(100, ((1 - latest.successRate) / (1 - SLO_SUCCESS)) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <Stat label={t('editor.dashboard.offered')} value={`${Math.round(latest?.offeredLoad ?? 0)}/s`} />
        <Stat label={t('editor.dashboard.throughput')} value={`${Math.round(latest?.totalThroughput ?? 0)}/s`} tone="text-signal-green" />
        <Stat label={t('editor.dashboard.success')} value={`${((latest?.successRate ?? 1) * 100).toFixed(1)}%`} tone={successTone} />
        <Stat label={t('editor.dashboard.p95')} value={`${Math.round(latest?.p95 ?? 0)}ms`} tone={p95Tone} />
        <Stat label={t('editor.dashboard.in_flight')} value={`${Math.round(latest?.inFlightTotal ?? 0)}`} />
        <Stat label={t('editor.dashboard.cost', { provider: providerLabel(provider) })} value={`$${(latest?.costPerHour ?? 0).toFixed(2)}/h`} tone="text-signal-cyan" onClick={onCostClick} title={t('editor.bill.open_hint')} />
      </div>

      {/* Error budget bar */}
      <div>
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-tactical-label mb-1">
          <span>{t('editor.dashboard.error_budget', { slo: SLO_SUCCESS * 100 })}</span>
          <span>{errorBudgetUsed.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-tactical-line overflow-hidden">
          <div
            className="h-full transition-all"
            style={{ width: `${errorBudgetUsed}%`, backgroundColor: errorBudgetUsed >= 100 ? '#ef4444' : errorBudgetUsed >= 70 ? '#eab308' : '#22c55e' }}
          />
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="border border-signal-amber/50 bg-signal-amber/10 p-2 font-mono text-[11px] text-signal-amber space-y-0.5">
          {warnings.slice(0, 6).map((w) => (
            <div key={w}>⚠ {formatWarning(w, t)}</div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title={t('editor.dashboard.chart_throughput')}>
          <AreaChart data={data}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
            <XAxis dataKey="t" {...axis} />
            <YAxis {...axis} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="offered" stroke="#64748b" fill="#64748b22" />
            <Area type="monotone" dataKey="throughput" stroke="#22c55e" fill="#22c55e33" />
          </AreaChart>
        </ChartCard>

        <ChartCard title={t('editor.dashboard.chart_latency')}>
          <LineChart data={data}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
            <XAxis dataKey="t" {...axis} />
            <YAxis {...axis} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="p50" stroke="#06b6d4" dot={false} />
            <Line type="monotone" dataKey="p95" stroke="#eab308" dot={false} />
            <Line type="monotone" dataKey="p99" stroke="#ef4444" dot={false} />
          </LineChart>
        </ChartCard>

        <ChartCard title={t('editor.dashboard.chart_success')}>
          <LineChart data={data}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
            <XAxis dataKey="t" {...axis} />
            <YAxis yAxisId="l" domain={[0, 100]} {...axis} />
            <YAxis yAxisId="r" orientation="right" {...axis} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line yAxisId="l" type="monotone" dataKey="success" stroke="#22c55e" dot={false} />
            <Line yAxisId="r" type="monotone" dataKey="inFlight" stroke="#a855f7" dot={false} />
          </LineChart>
        </ChartCard>
      </div>

      <div className="font-mono text-[11px] text-tactical-label">
        {t('editor.dashboard.accumulated_cost')} <span className="text-signal-cyan">${totalCost.toFixed(4)}</span>
      </div>
    </div>
  );
}

const tooltipStyle = {
  background: '#0f172a',
  border: '1px solid #334155',
  fontFamily: 'monospace',
  fontSize: 11,
};

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="border border-tactical-border bg-tactical-surface p-2">
      <div className="font-mono text-[10px] uppercase tracking-wider text-tactical-label mb-1">{title}</div>
      <div style={{ width: '100%', height: 160 }}>
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </div>
  );
}
