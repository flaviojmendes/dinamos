// Save/load the design as a .din file. v2 stores full node configs, the load
// profile, chaos events and the RNG seed. v1 files (legacy SimpleSystemEditor)
// are upgraded on import so old designs keep working.

import { NodeConfig, NodeKind, defaultsForKind, EdgeSpec } from '../engine/types';
import { ChaosEvent, LoadProfileType } from '../engine/scenarios';

export interface SerializedNode {
  id: string;
  position: { x: number; y: number };
  config: NodeConfig;
}

export interface DesignV2 {
  version: '2.0';
  seed: number;
  profileType: LoadProfileType;
  chaos: ChaosEvent[];
  nodes: SerializedNode[];
  edges: EdgeSpec[];
}

export function serializeDesign(
  nodes: SerializedNode[],
  edges: EdgeSpec[],
  seed: number,
  profileType: LoadProfileType,
  chaos: ChaosEvent[],
): string {
  const design: DesignV2 = { version: '2.0', seed, profileType, chaos, nodes, edges };
  return JSON.stringify(design, null, 2);
}

const LEGACY_KIND_MAP: Record<string, NodeKind> = {
  client: 'client',
  server: 'server',
  database: 'database',
  loadBalancer: 'loadBalancer',
  apiGateway: 'apiGateway',
  cache: 'cache',
  messageQueue: 'messageQueue',
};

export function parseDesign(raw: string): DesignV2 {
  const parsed = JSON.parse(raw);
  if (parsed?.version === '2.0') {
    return parsed as DesignV2;
  }
  // Upgrade a v1 design.
  if (parsed?.nodes && parsed?.edges) {
    const nodes: SerializedNode[] = parsed.nodes.map((n: any) => {
      const kind = LEGACY_KIND_MAP[n.type] ?? 'server';
      const config = defaultsForKind(kind, String(n.id), n.data?.label ?? kind);
      if (typeof n.data?.throughput === 'number' && kind !== 'client') {
        // v1 throughput was a flat capacity; translate to a service time.
        config.serviceTimeMs = Math.max(1, (config.concurrency * config.replicas * 1000) / n.data.throughput);
      }
      if (kind === 'client' && typeof n.data?.throughput === 'number') {
        config.baseRate = n.data.throughput;
      }
      if (typeof n.data?.rateLimit === 'number') config.rateLimit = n.data.rateLimit;
      if (typeof n.data?.hitRate === 'number') config.hitRate = n.data.hitRate;
      if (typeof n.data?.maxQueue === 'number') config.maxQueue = n.data.maxQueue;
      if (typeof n.data?.dequeueRate === 'number') config.dequeueRate = n.data.dequeueRate;
      if (typeof n.data?.failureRate === 'number') config.failureRate = n.data.failureRate / 100;
      return { id: String(n.id), position: n.position ?? { x: 0, y: 0 }, config };
    });
    const edges: EdgeSpec[] = parsed.edges.map((e: any) => ({ id: String(e.id), source: String(e.source), target: String(e.target) }));
    return { version: '2.0', seed: 1, profileType: 'constant', chaos: [], nodes, edges };
  }
  throw new Error('INVALID_FILE');
}
