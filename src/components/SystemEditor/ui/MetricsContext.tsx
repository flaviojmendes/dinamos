// Shares per-tick metrics with the presentational node components without
// mutating ReactFlow node data. Node components subscribe via useNodeMetrics.

import { createContext, useContext } from 'react';
import { NodeMetrics } from '../engine/types';

export interface MetricsContextValue {
  metrics: Record<string, NodeMetrics>;
  running: boolean;
  selectedId: string | null;
}

export const MetricsContext = createContext<MetricsContextValue>({
  metrics: {},
  running: false,
  selectedId: null,
});

export function useNodeMetrics(id: string): NodeMetrics | undefined {
  return useContext(MetricsContext).metrics[id];
}

export function useMetricsContext(): MetricsContextValue {
  return useContext(MetricsContext);
}
