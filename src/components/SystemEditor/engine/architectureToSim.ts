// Node-safe conversion from stored game architecture JSON to engine SimConfig.

import type { GameArchitecture } from '../game/types';
import { SIM_DT_SECONDS, SIM_TRACE_SAMPLES } from './constants';
import type { EdgeSpec, SimConfig } from './types';

/** Build a deterministic SimConfig from a player's architecture snapshot. */
export function architectureToSimConfig(
  architecture: GameArchitecture,
  seed: number,
  overrides?: Partial<Pick<SimConfig, 'dtSeconds' | 'traceSamples'>>,
): SimConfig {
  const nodes = (architecture.nodes ?? []).map((n) => n.config);
  const edges: EdgeSpec[] = (architecture.edges ?? []).map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? null,
    targetHandle: e.targetHandle ?? null,
  }));

  return {
    nodes,
    edges,
    seed,
    dtSeconds: overrides?.dtSeconds ?? SIM_DT_SECONDS,
    traceSamples: overrides?.traceSamples ?? SIM_TRACE_SAMPLES,
  };
}

/** Compliance graph view used by evaluateCompliance. */
export function architectureComplianceGraph(architecture: GameArchitecture): {
  nodes: { id: string; kind: string }[];
  edges: { source: string; target: string }[];
} {
  const nodes = (architecture.nodes ?? [])
    .filter((n) => n?.id && n.config?.kind)
    .map((n) => ({ id: n.id, kind: n.config.kind }));
  const edges = (architecture.edges ?? [])
    .filter((e) => e?.source && e?.target)
    .map((e) => ({ source: e.source, target: e.target }));
  return { nodes, edges };
}
