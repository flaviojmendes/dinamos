// Cloud bill panel. Renders in the inspector slot when the user clicks the cost
// tile: a per-product breakdown (AWS or GCP) with live cost and an up/down
// indicator showing whether each line is getting more or less expensive.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { NodeConfig, NodeMetrics } from '../engine/types';
import { CloudProvider, estimateCostFromMetrics, productName, providerLabel } from '../engine/costModel';

interface Props {
  nodes: { id: string; config: NodeConfig }[];
  metrics: Record<string, NodeMetrics>;
  provider: CloudProvider;
  totalCost: number;
  onClose: () => void;
}

interface BillLine {
  product: string;
  cost: number;
  count: number;
}

export default function CostPanel({ nodes, metrics, provider, totalCost, onClose }: Props) {
  const { t } = useTranslation();

  const lines = useMemo<BillLine[]>(() => {
    const map = new Map<string, BillLine>();
    nodes.forEach(({ id, config }) => {
      const m = metrics[id];
      const servers = m?.servers ?? config.concurrency * config.replicas;
      const arrival = m?.arrivalRate ?? 0;
      const cost = estimateCostFromMetrics(config.kind, servers, arrival, config.replicaCount, provider);
      if (cost <= 0) return;
      const product = productName(config.kind, provider);
      const cur = map.get(product) ?? { product, cost: 0, count: 0 };
      cur.cost += cost;
      cur.count += 1;
      map.set(product, cur);
    });
    return [...map.values()].sort((a, b) => b.cost - a.cost);
  }, [nodes, metrics, provider]);

  const total = lines.reduce((s, l) => s + l.cost, 0);

  // Track previous per-product cost to show increasing / decreasing.
  const prevRef = useRef<Record<string, number>>({});
  const [dirs, setDirs] = useState<Record<string, 'up' | 'down' | 'flat'>>({});
  useEffect(() => {
    const next: Record<string, number> = {};
    const nd: Record<string, 'up' | 'down' | 'flat'> = {};
    lines.forEach((l) => {
      const prev = prevRef.current[l.product];
      if (prev !== undefined) {
        if (l.cost > prev + 1e-6) nd[l.product] = 'up';
        else if (l.cost < prev - 1e-6) nd[l.product] = 'down';
        else nd[l.product] = 'flat';
      }
      next[l.product] = l.cost;
    });
    prevRef.current = next;
    setDirs(nd);
  }, [lines]);

  return (
    <div className="p-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="font-sans text-[11px] font-medium text-signal-cyan">{t('editor.bill.title', { provider: providerLabel(provider) })}</div>
        <button onClick={onClose} className="text-tactical-label hover:text-signal-red transition-colors" aria-label={t('editor.bill.close')}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="font-sans text-xs text-tactical-label">{t('editor.bill.empty')}</div>
      ) : (
        <div className="space-y-1.5">
          {lines.map((l) => {
            const dir = dirs[l.product] ?? 'flat';
            const dirTone = dir === 'up' ? 'text-signal-red' : dir === 'down' ? 'text-signal-green' : 'text-tactical-label';
            return (
              <div key={l.product} className="flex items-center justify-between border-b border-tactical-line pb-1.5">
                <div className="min-w-0">
                  <div className="font-sans text-xs text-tactical-text truncate">{l.product}</div>
                  <div className="font-sans text-[10px] text-slate-500 dark:text-tactical-label">{t('editor.bill.units', { count: l.count })}</div>
                </div>
                <div className={`flex items-center gap-1 font-mono text-xs ${dirTone}`}>
                  {dir === 'up' && <ArrowUp className="w-3 h-3" />}
                  {dir === 'down' && <ArrowDown className="w-3 h-3" />}
                  {dir === 'flat' && <Minus className="w-3 h-3 opacity-40" />}
                  <span className="text-tactical-text">${l.cost.toFixed(4)}/h</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-tactical-border flex items-center justify-between font-sans text-xs">
        <span className="font-sans text-[11px] font-medium text-slate-600 dark:text-signal-amber">{t('editor.bill.total')}</span>
        <span className="text-signal-cyan font-bold">${total.toFixed(4)}/h</span>
      </div>
      <div className="mt-1 flex items-center justify-between font-sans text-[11px] text-tactical-label">
        <span>{t('editor.bill.accumulated')}</span>
        <span className="font-mono text-signal-cyan">${totalCost.toFixed(4)}</span>
      </div>
    </div>
  );
}
