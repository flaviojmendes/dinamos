/**
 * simulatorRegistry — maps a stable string key to an interactive simulator
 * component.
 *
 * Lesson content now lives in the database (content_pages). A page can declare
 * a `simulatorKey`; when present, App.tsx auto-registers a route at
 * `<page.path>/simulator` that renders the mapped component. This lets an admin
 * attach any existing simulator to a (new or edited) lesson from the CMS
 * without touching code.
 *
 * The components stay as code (they are not editable content). They are
 * lazy-loaded here so the registry can be imported anywhere without eagerly
 * pulling every simulator into the bundle.
 *
 * NOTE: the original bespoke simulator routes remain declared explicitly in
 * App.tsx for back-compat; this registry powers the CMS "attach simulator"
 * feature for pages that opt in via `simulatorKey`.
 */
import React from 'react';

export interface SimulatorDef {
  key: string;
  /** Human label shown in the CMS dropdown. */
  label: string;
  component: React.LazyExoticComponent<React.ComponentType<unknown>>;
}

const lazy = (key: string) =>
  React.lazy(() => import('./simulatorLoaders').then(module => module.loadSimulator(key))) as
    React.LazyExoticComponent<React.ComponentType<unknown>>;

export const SIMULATORS: SimulatorDef[] = [
  // System components
  { key: 'cache', label: 'Cache', component: lazy('cache') },
  { key: 'load-balancer', label: 'Load Balancer (Round Robin)', component: lazy('load-balancer') },
  { key: 'message-queue', label: 'Message Queue', component: lazy('message-queue') },
  { key: 'cdn', label: 'CDN', component: lazy('cdn') },
  { key: 'api-gateway', label: 'API Gateway', component: lazy('api-gateway') },
  { key: 'firewall', label: 'Firewall', component: lazy('firewall') },
  { key: 'polling-webhooks', label: 'Polling vs Webhooks', component: lazy('polling-webhooks') },
  { key: 'kafka', label: 'Kafka Streaming', component: lazy('kafka') },
  { key: 'api-styles', label: 'API Styles (REST/gRPC/GraphQL)', component: lazy('api-styles') },
  { key: 'realtime-push', label: 'Real-Time Push (WS/SSE)', component: lazy('realtime-push') },
  { key: 'dead-letter-queue', label: 'Dead Letter Queue', component: lazy('dead-letter-queue') },

  // Design principles
  { key: 'circuit-breaker', label: 'Circuit Breaker', component: lazy('circuit-breaker') },
  { key: 'backpressure', label: 'Backpressure', component: lazy('backpressure') },
  { key: 'rate-limiter', label: 'Rate Limiter', component: lazy('rate-limiter') },
  { key: 'async-sync', label: 'Async vs Sync', component: lazy('async-sync') },
  { key: 'event-sourcing', label: 'Event Sourcing', component: lazy('event-sourcing') },
  { key: 'service-architecture', label: 'Service Architecture', component: lazy('service-architecture') },
  { key: 'retries', label: 'Retries', component: lazy('retries') },
  { key: 'timeout', label: 'Timeout', component: lazy('timeout') },
  { key: 'horizontal-scaling', label: 'Horizontal Scaling', component: lazy('horizontal-scaling') },
  { key: 'vertical-scaling', label: 'Vertical Scaling', component: lazy('vertical-scaling') },
  { key: 'scalability', label: 'Scalability', component: lazy('scalability') },
  { key: 'availability-zones', label: 'Availability Zones', component: lazy('availability-zones') },
  { key: 'replication', label: 'Replication', component: lazy('replication') },
  { key: 'cqrs', label: 'CQRS', component: lazy('cqrs') },
  { key: 'canary-deployment', label: 'Canary Deployment', component: lazy('canary-deployment') },
  { key: 'outbox', label: 'Transactional Outbox', component: lazy('outbox') },
  { key: 'bulkhead', label: 'Bulkhead', component: lazy('bulkhead') },
  { key: 'pacelc', label: 'PACELC', component: lazy('pacelc') },
  { key: 'chaos', label: 'Chaos Engineering', component: lazy('chaos') },

  // Consistency strategies
  { key: 'consensus', label: 'Consensus', component: lazy('consensus') },
  { key: 'lamport-timestamps', label: 'Lamport Timestamps', component: lazy('lamport-timestamps') },
  { key: 'two-phase-commit', label: 'Two-Phase Commit', component: lazy('two-phase-commit') },
  { key: 'synchronization', label: 'Synchronization', component: lazy('synchronization') },
  { key: 'synchronization-algorithms', label: 'Synchronization Algorithms', component: lazy('synchronization-algorithms') },
  { key: 'saga', label: 'Saga', component: lazy('saga') },
  { key: 'delivery-semantics', label: 'Delivery Semantics', component: lazy('delivery-semantics') },
  { key: 'crdt', label: 'CRDTs', component: lazy('crdt') },
  { key: 'gossip', label: 'Gossip Protocol', component: lazy('gossip') },
  { key: 'distributed-lock', label: 'Distributed Locks & Fencing', component: lazy('distributed-lock') },

  // Security
  { key: 'tokens', label: 'Tokens', component: lazy('tokens') },
  { key: 'cryptography', label: 'Cryptography', component: lazy('cryptography') },
  { key: 'attacks', label: 'Common Attacks', component: lazy('attacks') },
  { key: 'prompt-injection', label: 'Prompt Injection', component: lazy('prompt-injection') },

  // Monitoring
  { key: 'logs', label: 'Logs', component: lazy('logs') },
  { key: 'tracing', label: 'Distributed Tracing', component: lazy('tracing') },

  // AI systems
  { key: 'inference-batching', label: 'Inference Batching', component: lazy('inference-batching') },
  { key: 'rag-pipeline', label: 'RAG Pipeline', component: lazy('rag-pipeline') },
  { key: 'vector-search', label: 'Vector Search', component: lazy('vector-search') },
  { key: 'llm-gateway', label: 'LLM Gateway', component: lazy('llm-gateway') },
  { key: 'gpu-autoscaler', label: 'GPU Autoscaler', component: lazy('gpu-autoscaler') },
  { key: 'agent-orchestration', label: 'Agent Orchestration', component: lazy('agent-orchestration') },

  // Data & storage
  { key: 'consistent-hashing', label: 'Consistent Hashing', component: lazy('consistent-hashing') },
  { key: 'sharding', label: 'Sharding', component: lazy('sharding') },
  { key: 'inverted-index', label: 'Inverted Index', component: lazy('inverted-index') },
  { key: 'storage-engine', label: 'Storage Engines (B-Tree vs LSM)', component: lazy('storage-engine') },
  { key: 'bloom-filter', label: 'Bloom Filter', component: lazy('bloom-filter') },
  { key: 'quorum-replication', label: 'Quorum Replication', component: lazy('quorum-replication') },
  { key: 'cdc', label: 'Change Data Capture', component: lazy('cdc') },
];

const byKey = new Map(SIMULATORS.map((s) => [s.key, s]));

export function getSimulator(key: string | null | undefined): SimulatorDef | undefined {
  if (!key) return undefined;
  return byKey.get(key);
}

/** Keys + labels for the CMS "attach simulator" dropdown. */
export const SIMULATOR_OPTIONS = SIMULATORS.map((s) => ({ key: s.key, label: s.label }));
