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

/**
 * Reference service time (ms) that maps to a "1x" priced instance. Provisioning
 * a faster server (lower service time) needs beefier/more expensive compute, so
 * cost scales with how much faster than this baseline the node runs.
 */
const SERVICE_TIME_BASELINE_MS = 20;

/**
 * Compute price premium driven by per-request service time. A node that serves
 * requests faster than the baseline is treated as a more powerful (pricier)
 * instance; a slower one is cheaper. Clamped so the curve stays sane at the
 * extremes (e.g. 1ms caches don't cost 20x, 500ms externals don't go to zero).
 */
export function serviceTimePremium(serviceTimeMs: number): number {
  if (!serviceTimeMs || serviceTimeMs <= 0) return 4; // "instant" => max-tier compute
  const ratio = SERVICE_TIME_BASELINE_MS / serviceTimeMs;
  return Math.min(4, Math.max(0.4, ratio));
}

/**
 * Per-hour cost of a single compute/db node from its three capacity knobs:
 * service time, concurrency (c) and replicas. `servers` already folds in
 * concurrency * replicas; the service-time premium adds the third dimension so
 * all three realistically move the bill.
 */
function computeCostPerHour(
  kind: NodeKind,
  servers: number,
  serviceTimeMs: number,
  replicaCountForDb: number | undefined,
  rates: Rates,
): number {
  const premium = serviceTimePremium(serviceTimeMs);
  if (COMPUTE_KINDS.includes(kind)) {
    return Math.max(0, servers) * rates.serverHour * premium;
  }
  if (kind === 'database' || kind === 'replicatedDb') {
    const replicas = kind === 'replicatedDb' ? replicaCountForDb ?? 1 : 1;
    return Math.max(1, replicas) * rates.dbReplicaHour * premium;
  }
  return 0;
}

export function estimateNodeCostPerHour(rt: NodeRuntime, provider: CloudProvider = 'aws'): number {
  const rates = RATES[provider];
  const kind = rt.cfg.kind;

  if (COMPUTE_KINDS.includes(kind) || kind === 'database' || kind === 'replicatedDb') {
    return computeCostPerHour(kind, rt.servers, rt.cfg.serviceTimeMs, rt.cfg.replicaCount, rates);
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

/**
 * Cost of a node computed directly from its live metrics (servers/arrival),
 * mirroring estimateNodeCostPerHour but without needing a NodeRuntime — handy
 * for the UI bill which only has NodeMetrics.
 */
export function estimateCostFromMetrics(
  kind: NodeKind,
  servers: number,
  arrivalPerSec: number,
  replicaCount: number | undefined,
  provider: CloudProvider,
  serviceTimeMs = SERVICE_TIME_BASELINE_MS,
): number {
  const rates = RATES[provider];
  if (COMPUTE_KINDS.includes(kind) || kind === 'database' || kind === 'replicatedDb') {
    return computeCostPerHour(kind, servers, serviceTimeMs, replicaCount, rates);
  }
  if (USAGE_KINDS.includes(kind)) {
    return ((arrivalPerSec * 3600) / 1_000_000) * rates.perMillionRequests;
  }
  if (kind === 'externalDependency') {
    return ((arrivalPerSec * 3600) / 1_000_000) * rates.externalPerMillion;
  }
  return 0;
}

/** Marketing name of the cloud product a node maps to, per provider. */
export function productName(kind: NodeKind, provider: CloudProvider): string {
  const aws = provider === 'aws';
  switch (kind) {
    case 'server':
      return aws ? 'EC2' : 'Compute Engine';
    case 'autoScaler':
      return aws ? 'EC2 Auto Scaling' : 'Managed Instance Group';
    case 'loadBalancer':
      return aws ? 'Elastic Load Balancing' : 'Cloud Load Balancing';
    case 'cache':
      return aws ? 'ElastiCache' : 'Memorystore';
    case 'circuitBreaker':
      return aws ? 'App Mesh' : 'Traffic Director';
    case 'shardRouter':
      return aws ? 'EC2 (sharding)' : 'Compute Engine (sharding)';
    case 'database':
      return aws ? 'RDS' : 'Cloud SQL';
    case 'replicatedDb':
      return aws ? 'RDS Multi-AZ' : 'Cloud SQL HA';
    case 'apiGateway':
      return aws ? 'API Gateway' : 'API Gateway (Apigee)';
    case 'messageQueue':
      return aws ? 'SQS' : 'Pub/Sub';
    case 'externalDependency':
      return aws ? 'Third-party API' : 'Third-party API';
    default:
      return aws ? 'AWS' : 'GCP';
  }
}
