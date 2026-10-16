import { z } from 'zod';
import { defaultsForKind, type NodeKind } from './types.js';
import type { DesignV2, SerializedNode } from '../ui/persistence';
import type { EdgeSpec } from './types.js';
import type { ChaosEvent, LoadProfileType } from './scenarios';

export const MAX_DESIGN_NODES = 200;
export const MAX_DESIGN_EDGES = 500;
export const MAX_CHAOS_EVENTS = 50;
export const MAX_DESIGN_RAW_BYTES = 512_000;

const NODE_KINDS = [
  'client',
  'loadBalancer',
  'apiGateway',
  'cache',
  'server',
  'database',
  'replicatedDb',
  'shardRouter',
  'messageQueue',
  'circuitBreaker',
  'autoScaler',
  'externalDependency',
] as const satisfies readonly NodeKind[];

const LOAD_PROFILE_TYPES = ['constant', 'ramp', 'spike', 'diurnal', 'step'] as const satisfies readonly LoadProfileType[];

const nodeConfigSchema = z
  .object({
    id: z.string().min(1).max(128),
    kind: z.enum(NODE_KINDS),
    label: z.string().max(200),
    serviceTimeMs: z.number().finite().nonnegative().optional(),
    concurrency: z.number().int().positive().max(128).optional(),
    replicas: z.number().int().positive().max(100).optional(),
    failureRate: z.number().finite().min(0).max(1).optional(),
    timeoutMs: z.number().finite().positive().optional(),
    latencyDistribution: z.enum(['exponential', 'lognormal', 'deterministic']).optional(),
    latencyCv: z.number().finite().nonnegative().optional(),
    // JSON encodes Infinity as null. Restore the unbounded waiting room on load.
    queueCapacity: z.preprocess((v) => v === null ? Infinity : v,
      z.union([z.number().int().nonnegative(), z.literal(Infinity)]).optional()),
    retry: z.object({
      maxRetries: z.number().int().min(0).max(20),
      backoffBaseMs: z.number().finite().nonnegative(),
      jitter: z.boolean(),
    }).optional(),
    baseRate: z.number().finite().nonnegative().optional(),
    cronEnabled: z.boolean().optional(),
    cronRate: z.number().finite().nonnegative().optional(),
    strategy: z.enum(['roundRobin', 'leastConnections', 'weighted', 'hashing']).optional(),
    weights: z.record(z.number().finite().nonnegative()).optional(),
    rateLimit: z.number().finite().nonnegative().optional(),
    hitRate: z.number().finite().min(0).max(1).optional(),
    ttlSeconds: z.number().finite().nonnegative().optional(),
    maxQueue: z.number().int().nonnegative().optional(),
    dequeueRate: z.number().finite().nonnegative().optional(),
    replicaCount: z.number().int().positive().max(100).optional(),
    consistency: z.enum(['strong', 'eventual', 'quorum']).optional(),
    replicationLagMs: z.number().finite().nonnegative().optional(),
    writeFraction: z.number().finite().min(0).max(1).optional(),
    shardCount: z.number().int().positive().max(100).optional(),
    skew: z.number().finite().min(0).max(1).optional(),
    shardStrategy: z.enum(['hash', 'range']).optional(),
    errorThreshold: z.number().finite().min(0).max(1).optional(),
    resetTimeoutMs: z.number().finite().positive().optional(),
    autoScaleEnabled: z.boolean().optional(),
    targetUtilization: z.number().finite().positive().max(1).optional(),
    minReplicas: z.number().int().positive().max(100).optional(),
    maxReplicas: z.number().int().positive().max(100).optional(),
    locked: z.boolean().optional(),
    origin: z.enum(['seed', 'player']).optional(),
  })
  .transform((config) => ({ ...defaultsForKind(config.kind, config.id, config.label), ...config }))
  .superRefine((config, ctx) => {
    if (config.kind !== 'client' && config.serviceTimeMs <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['serviceTimeMs'], message: 'Service time must be positive' });
    }
    if ((config.minReplicas ?? 1) > (config.maxReplicas ?? 20)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['maxReplicas'], message: 'Maximum replicas must be at least the minimum' });
    }
  });

const serializedNodeSchema = z.object({
  id: z.string().min(1).max(128),
  position: z.object({
    x: z.number().finite(),
    y: z.number().finite(),
  }),
  config: nodeConfigSchema,
}).transform((node) => ({ ...node, config: { ...node.config, id: node.id } }));

const edgeSpecSchema = z.object({
  id: z.string().min(1).max(128),
  source: z.string().min(1).max(128),
  target: z.string().min(1).max(128),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
});

const chaosEventSchema = z.object({
  id: z.string().min(1).max(128),
  type: z.enum(['killNode', 'latencyInjection', 'partition']),
  targetId: z.string().min(1).max(128),
  startSec: z.number().finite().min(0),
  durationSec: z.number().finite().min(0),
  magnitude: z.number().finite().nonnegative().optional(),
});

export const designV2Schema = z.object({
  version: z.literal('2.0'),
  seed: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
  profileType: z.enum(LOAD_PROFILE_TYPES),
  profileMultiplier: z.number().finite().nonnegative().default(1),
  provider: z.enum(['aws', 'gcp']).default('aws'),
  chaos: z.array(chaosEventSchema).max(MAX_CHAOS_EVENTS),
  nodes: z.array(serializedNodeSchema).max(MAX_DESIGN_NODES),
  edges: z.array(edgeSpecSchema).max(MAX_DESIGN_EDGES),
}).superRefine((design, ctx) => {
  const nodeIds = new Set<string>();
  design.nodes.forEach((node, i) => {
    if (nodeIds.has(node.id)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['nodes', i, 'id'], message: 'Duplicate node ID' });
    nodeIds.add(node.id);
  });
  const edgeIds = new Set<string>();
  design.edges.forEach((edge, i) => {
    if (edgeIds.has(edge.id)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['edges', i, 'id'], message: 'Duplicate edge ID' });
    edgeIds.add(edge.id);
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['edges', i], message: 'Edge endpoint does not exist' });
    }
  });
});

export type ValidatedDesignV2 = z.infer<typeof designV2Schema>;

const LEGACY_KIND_MAP: Record<string, NodeKind> = {
  client: 'client',
  server: 'server',
  database: 'database',
  loadBalancer: 'loadBalancer',
  apiGateway: 'apiGateway',
  cache: 'cache',
  messageQueue: 'messageQueue',
};

/** Upgrade a legacy v1 export into DesignV2 before validation. */
export function upgradeLegacyDesign(parsed: unknown): DesignV2 {
  const legacy = parsed as {
    nodes?: { id?: unknown; type?: string; position?: { x?: number; y?: number }; data?: Record<string, unknown> }[];
    edges?: { id?: unknown; source?: unknown; target?: unknown }[];
  };
  if (!legacy?.nodes || !legacy?.edges) {
    throw new Error('INVALID_FILE');
  }
  const nodes: SerializedNode[] = legacy.nodes.map((n) => {
    const kind = LEGACY_KIND_MAP[String(n.type ?? '')] ?? 'server';
    const config = defaultsForKind(kind, String(n.id), String(n.data?.label ?? kind));
    if (typeof n.data?.throughput === 'number' && kind !== 'client') {
      config.serviceTimeMs = Math.max(
        1,
        (config.concurrency * config.replicas * 1000) / n.data.throughput,
      );
    }
    if (kind === 'client' && typeof n.data?.throughput === 'number') {
      config.baseRate = n.data.throughput;
    }
    if (typeof n.data?.rateLimit === 'number') config.rateLimit = n.data.rateLimit;
    if (typeof n.data?.hitRate === 'number') config.hitRate = n.data.hitRate;
    if (typeof n.data?.maxQueue === 'number') config.maxQueue = n.data.maxQueue;
    if (typeof n.data?.dequeueRate === 'number') config.dequeueRate = n.data.dequeueRate;
    if (typeof n.data?.failureRate === 'number') config.failureRate = n.data.failureRate / 100;
    return {
      id: String(n.id),
      position: { x: n.position?.x ?? 0, y: n.position?.y ?? 0 },
      config,
    };
  });
  const edges: EdgeSpec[] = legacy.edges.map((e) => ({
    id: String(e.id),
    source: String(e.source),
    target: String(e.target),
  }));
  return {
    version: '2.0',
    seed: 1,
    profileType: 'constant',
    chaos: [] as ChaosEvent[],
    nodes,
    edges,
  };
}

export function normalizeDesignInput(parsed: unknown): DesignV2 {
  const candidate =
    parsed && typeof parsed === 'object' && (parsed as { version?: string }).version === '2.0'
      ? (parsed as DesignV2)
      : upgradeLegacyDesign(parsed);
  return designV2Schema.parse(candidate) as unknown as DesignV2;
}

export function parseDesignRaw(raw: string): DesignV2 {
  if (raw.length > MAX_DESIGN_RAW_BYTES || new TextEncoder().encode(raw).byteLength > MAX_DESIGN_RAW_BYTES) {
    throw new Error('FILE_TOO_LARGE');
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('INVALID_FILE');
  }
  return normalizeDesignInput(parsed);
}

export function validateDesignPayload(design: unknown): DesignV2 {
  return normalizeDesignInput(design);
}
