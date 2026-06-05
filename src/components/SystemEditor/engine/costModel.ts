// Cost model. Instead of a flat per-node price, cost is driven by the simulated
// workload: provisioned compute (servers/replicas) plus usage-based charges
// (requests through gateways/queues, calls to external dependencies).

import { NodeRuntime } from './fluidSolver';
import { NodeKind } from './types';

export type CloudProvider = 'aws' | 'gcp';

interface Rates {
  /** USD per server-hour for compute-style nodes. */
  serverHour: number;
  /** USD per replica-hour for database-style nodes. */
  dbReplicaHour: number;
  /** USD per million requests for usage-billed nodes. */
  perMillionRequests: number;
  /** USD per million external dependency calls. */
  externalPerMillion: number;
}

const RATES: Record<CloudProvider, Rates> = {
  aws: { serverHour: 0.0416, dbReplicaHour: 0.136, perMillionRequests: 1.0, externalPerMillion: 5.0 },
  gcp: { serverHour: 0.0395, dbReplicaHour: 0.128, perMillionRequests: 0.9, externalPerMillion: 4.5 },
};

const COMPUTE_KINDS: NodeKind[] = [
  'server',
  'autoScaler',
  'loadBalancer',
  'cache',
  'circuitBreaker',
  'shardRouter',
];

const USAGE_KINDS: NodeKind[] = ['apiGateway', 'messageQueue'];

export function estimateNodeCostPerHour(rt: NodeRuntime, provider: CloudProvider = 'aws'): number {
  const rates = RATES[provider];
  const kind = rt.cfg.kind;

  if (COMPUTE_KINDS.includes(kind)) {
    return rt.servers * rates.serverHour;
  }
  if (kind === 'database' || kind === 'replicatedDb') {
    const replicas = kind === 'replicatedDb' ? rt.cfg.replicaCount ?? 1 : 1;
    return Math.max(1, replicas) * rates.dbReplicaHour;
  }
  if (USAGE_KINDS.includes(kind)) {
    const reqPerHour = rt.arrival * 3600;
    return (reqPerHour / 1_000_000) * rates.perMillionRequests;
  }
  if (kind === 'externalDependency') {
    const reqPerHour = rt.arrival * 3600;
    return (reqPerHour / 1_000_000) * rates.externalPerMillion;
  }
  return 0;
}

export function providerLabel(provider: CloudProvider): string {
  return provider === 'aws' ? 'AWS' : 'Google Cloud';
}
