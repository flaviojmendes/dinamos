// Load profiles, chaos events and a library of preset topologies.

import { EdgeSpec, NodeConfig, defaultsForKind } from './types';

export type LoadProfileType = 'constant' | 'ramp' | 'spike' | 'diurnal' | 'step';

export interface LoadProfile {
  type: LoadProfileType;
  /** Multiplier applied to every client's base rate at time t (seconds). */
  multiplierAt: (t: number) => number;
  label: string;
}

export function makeLoadProfile(type: LoadProfileType): LoadProfile {
  switch (type) {
    case 'ramp':
      return {
        type,
        label: 'Ramp',
        // Linear ramp from 0.2x to 2x over 60s, then hold.
        multiplierAt: (t) => 0.2 + Math.min(1.8, (t / 60) * 1.8),
      };
    case 'spike':
      return {
        type,
        label: 'Spike',
        // Baseline 1x with a sharp 4x spike between 20s and 30s.
        multiplierAt: (t) => (t >= 20 && t <= 30 ? 4 : 1),
      };
    case 'diurnal':
      return {
        type,
        label: 'Diurnal',
        // Sine wave between 0.3x and 1.7x with a 120s period.
        multiplierAt: (t) => 1 + 0.7 * Math.sin((2 * Math.PI * t) / 120),
      };
    case 'step':
      return {
        type,
        label: 'Step',
        // Steps up every 30s: 1x, 2x, 3x, ...
        multiplierAt: (t) => 1 + Math.floor(t / 30),
      };
    case 'constant':
    default:
      return { type: 'constant', label: 'Constant', multiplierAt: () => 1 };
  }
}

export type ChaosType = 'killNode' | 'latencyInjection' | 'partition';

export interface ChaosEvent {
  id: string;
  type: ChaosType;
  targetId: string;
  startSec: number;
  durationSec: number;
  /** For latencyInjection: service-time multiplier. */
  magnitude?: number;
}

export function isChaosActive(event: ChaosEvent, t: number): boolean {
  return t >= event.startSec && t < event.startSec + event.durationSec;
}

export interface PresetNode {
  config: NodeConfig;
  position: { x: number; y: number };
}

export interface Preset {
  id: string;
  name: string;
  nodes: PresetNode[];
  edges: EdgeSpec[];
  seed: number;
}

function node(kind: Parameters<typeof defaultsForKind>[0], id: string, label: string, x: number, y: number, overrides: Partial<NodeConfig> = {}): PresetNode {
  return { config: { ...defaultsForKind(kind, id, label), ...overrides }, position: { x, y } };
}

function edge(source: string, target: string): EdgeSpec {
  return { id: `e-${source}-${target}`, source, target };
}

/** Three-tier web app: client -> LB -> servers -> database. */
function threeTier(): Preset {
  return {
    id: 'three-tier',
    name: 'Three-Tier Web App',
    seed: 1,
    nodes: [
      node('client', 'c1', 'Users', 400, 0, { baseRate: 120 }),
      node('loadBalancer', 'lb', 'Load Balancer', 400, 140),
      node('server', 's1', 'App Server 1', 200, 300, { replicas: 1 }),
      node('server', 's2', 'App Server 2', 600, 300, { replicas: 1 }),
      node('database', 'db', 'Database', 400, 460),
    ],
    edges: [edge('c1', 'lb'), edge('lb', 's1'), edge('lb', 's2'), edge('s1', 'db'), edge('s2', 'db')],
  };
}

/** Read-heavy app with a cache fronting the database. */
function readHeavyCache(): Preset {
  return {
    id: 'read-heavy-cache',
    name: 'Read-Heavy + Cache',
    seed: 2,
    nodes: [
      node('client', 'c1', 'Users', 400, 0, { baseRate: 300 }),
      node('apiGateway', 'gw', 'API Gateway', 400, 130, { rateLimit: 500 }),
      node('cache', 'cache', 'Cache', 400, 270, { hitRate: 0.85 }),
      node('server', 's1', 'App Server', 400, 410, { replicas: 2 }),
      node('database', 'db', 'Database', 400, 560),
    ],
    edges: [edge('c1', 'gw'), edge('gw', 'cache'), edge('cache', 's1'), edge('s1', 'db')],
  };
}

/** Event-driven pipeline with a buffering queue and a circuit breaker. */
function eventDriven(): Preset {
  return {
    id: 'event-driven',
    name: 'Event-Driven + Queue',
    seed: 3,
    nodes: [
      node('client', 'c1', 'Producers', 400, 0, { baseRate: 200 }),
      node('apiGateway', 'gw', 'Ingest API', 400, 130),
      node('messageQueue', 'q', 'Message Queue', 400, 270, { maxQueue: 2000, dequeueRate: 150 }),
      node('circuitBreaker', 'cb', 'Circuit Breaker', 400, 410),
      node('server', 'w', 'Worker Pool', 400, 550, { replicas: 3, serviceTimeMs: 40 }),
      node('externalDependency', 'ext', 'Payment API', 400, 700, { failureRate: 0.05 }),
    ],
    edges: [edge('c1', 'gw'), edge('gw', 'q'), edge('q', 'cb'), edge('cb', 'w'), edge('w', 'ext')],
  };
}

/** Sharded datastore behind a router. */
function shardedStore(): Preset {
  return {
    id: 'sharded-store',
    name: 'Sharded Datastore',
    seed: 4,
    nodes: [
      node('client', 'c1', 'Users', 400, 0, { baseRate: 400 }),
      node('loadBalancer', 'lb', 'Load Balancer', 400, 130),
      node('shardRouter', 'sr', 'Shard Router', 400, 270, { shardCount: 4, skew: 0.2 }),
      node('replicatedDb', 'db1', 'Shard A (replicated)', 150, 430, { replicaCount: 3 }),
      node('replicatedDb', 'db2', 'Shard B (replicated)', 400, 430, { replicaCount: 3 }),
      node('replicatedDb', 'db3', 'Shard C (replicated)', 650, 430, { replicaCount: 3 }),
    ],
    edges: [edge('c1', 'lb'), edge('lb', 'sr'), edge('sr', 'db1'), edge('sr', 'db2'), edge('sr', 'db3')],
  };
}

/** Autoscaling microservice mesh. */
function microserviceMesh(): Preset {
  return {
    id: 'microservice-mesh',
    name: 'Microservice Mesh',
    seed: 5,
    nodes: [
      node('client', 'c1', 'Clients', 400, 0, { baseRate: 250 }),
      node('apiGateway', 'gw', 'API Gateway', 400, 120),
      node('autoScaler', 'svcA', 'Service A (auto)', 200, 270, { targetUtilization: 0.7 }),
      node('autoScaler', 'svcB', 'Service B (auto)', 600, 270, { targetUtilization: 0.7 }),
      node('cache', 'cache', 'Shared Cache', 400, 420, { hitRate: 0.7 }),
      node('replicatedDb', 'db', 'Primary DB', 400, 560, { replicaCount: 2, consistency: 'quorum' }),
    ],
    edges: [
      edge('c1', 'gw'),
      edge('gw', 'svcA'),
      edge('gw', 'svcB'),
      edge('svcA', 'cache'),
      edge('svcB', 'cache'),
      edge('cache', 'db'),
    ],
  };
}

export const PRESETS: Preset[] = [
  threeTier(),
  readHeavyCache(),
  eventDriven(),
  shardedStore(),
  microserviceMesh(),
];

export function getPreset(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}
