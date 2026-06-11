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

const lazy = (loader: () => Promise<{ default: React.ComponentType<any> }>) =>
  React.lazy(loader) as React.LazyExoticComponent<React.ComponentType<unknown>>;

export const SIMULATORS: SimulatorDef[] = [
  // System components
  { key: 'cache', label: 'Cache', component: lazy(() => import('../components/CacheSimulation/CacheSimulation')) },
  { key: 'load-balancer', label: 'Load Balancer (Round Robin)', component: lazy(() => import('../components/RoundRobin/RoundRobin')) },
  { key: 'message-queue', label: 'Message Queue', component: lazy(() => import('../components/MessageQueue/MessageQueue')) },
  { key: 'cdn', label: 'CDN', component: lazy(() => import('../components/CDN/CDN')) },
  { key: 'api-gateway', label: 'API Gateway', component: lazy(() => import('../components/APIGateway/APIGatewaySimulator')) },
  { key: 'firewall', label: 'Firewall', component: lazy(() => import('../components/SystemComponents/FirewallSimulator')) },
  { key: 'polling-webhooks', label: 'Polling vs Webhooks', component: lazy(() => import('../components/SystemComponents/PollingWebhooks')) },
  { key: 'kafka', label: 'Kafka Streaming', component: lazy(() => import('../components/SystemComponents/KafkaSimulator')) },
  { key: 'api-styles', label: 'API Styles (REST/gRPC/GraphQL)', component: lazy(() => import('../components/SystemComponents/ApiStylesSimulator')) },
  { key: 'realtime-push', label: 'Real-Time Push (WS/SSE)', component: lazy(() => import('../components/SystemComponents/RealtimePushSimulator')) },
  { key: 'dead-letter-queue', label: 'Dead Letter Queue', component: lazy(() => import('../components/SystemComponents/DeadLetterQueueSimulator')) },

  // Design principles
  { key: 'circuit-breaker', label: 'Circuit Breaker', component: lazy(() => import('../components/CircuitBreaker/CircuitBreaker')) },
  { key: 'backpressure', label: 'Backpressure', component: lazy(() => import('../components/Backpressure/Backpressure')) },
  { key: 'rate-limiter', label: 'Rate Limiter', component: lazy(() => import('../components/RateLimiter/RateLimiter')) },
  { key: 'async-sync', label: 'Async vs Sync', component: lazy(() => import('../components/AsyncSync/AsyncSync')) },
  { key: 'event-sourcing', label: 'Event Sourcing', component: lazy(() => import('../components/DesignPrinciples/EventSourcingSimulator')) },
  { key: 'service-architecture', label: 'Service Architecture', component: lazy(() => import('../components/DesignPrinciples/ServiceArchitectureSimulator')) },
  { key: 'retries', label: 'Retries', component: lazy(() => import('../components/DesignPrinciples/RetriesSimulator')) },
  { key: 'timeout', label: 'Timeout', component: lazy(() => import('../components/DesignPrinciples/TimeoutSimulator')) },
  { key: 'horizontal-scaling', label: 'Horizontal Scaling', component: lazy(() => import('../components/HorizontalScaling/HorizontalScalingSimulator')) },
  { key: 'vertical-scaling', label: 'Vertical Scaling', component: lazy(() => import('../components/DesignPrinciples/VerticalScalingSimulator')) },
  { key: 'scalability', label: 'Scalability', component: lazy(() => import('../components/DesignPrinciples/ScalabilitySimulator')) },
  { key: 'availability-zones', label: 'Availability Zones', component: lazy(() => import('../components/DesignPrinciples/AvailabilityZonesSimulator')) },
  { key: 'replication', label: 'Replication', component: lazy(() => import('../components/DesignPrinciples/ReplicationSimulator')) },
  { key: 'cqrs', label: 'CQRS', component: lazy(() => import('../components/DesignPrinciples/CqrsSimulator')) },
  { key: 'canary-deployment', label: 'Canary Deployment', component: lazy(() => import('../components/CanaryDeployment/CanaryDeploymentSimulator')) },
  { key: 'outbox', label: 'Transactional Outbox', component: lazy(() => import('../components/DesignPrinciples/OutboxSimulator')) },
  { key: 'bulkhead', label: 'Bulkhead', component: lazy(() => import('../components/DesignPrinciples/BulkheadSimulator')) },
  { key: 'pacelc', label: 'PACELC', component: lazy(() => import('../components/Theory/PacelcSimulator')) },
  { key: 'chaos', label: 'Chaos Engineering', component: lazy(() => import('../components/Monitoring/ChaosSimulator')) },

  // Consistency strategies
  { key: 'consensus', label: 'Consensus', component: lazy(() => import('../components/ConsistencyStrategies/ConsensusSimulator')) },
  { key: 'lamport-timestamps', label: 'Lamport Timestamps', component: lazy(() => import('../components/ConsistencyStrategies/LamportTimestampsSimulator')) },
  { key: 'two-phase-commit', label: 'Two-Phase Commit', component: lazy(() => import('../components/ConsistencyStrategies/TwoPhaseCommitSimulator')) },
  { key: 'synchronization', label: 'Synchronization', component: lazy(() => import('../components/ConsistencyStrategies/SynchronizationSimulator')) },
  { key: 'synchronization-algorithms', label: 'Synchronization Algorithms', component: lazy(() => import('../components/ConsistencyStrategies/SynchronizationAlgorithms')) },
  { key: 'saga', label: 'Saga', component: lazy(() => import('../components/ConsistencyStrategies/SagaSimulator')) },
  { key: 'delivery-semantics', label: 'Delivery Semantics', component: lazy(() => import('../components/ConsistencyStrategies/DeliverySemanticsSimulator')) },
  { key: 'crdt', label: 'CRDTs', component: lazy(() => import('../components/ConsistencyStrategies/CrdtSimulator')) },
  { key: 'gossip', label: 'Gossip Protocol', component: lazy(() => import('../components/ConsistencyStrategies/GossipSimulator')) },
  { key: 'distributed-lock', label: 'Distributed Locks & Fencing', component: lazy(() => import('../components/ConsistencyStrategies/DistributedLockSimulator')) },

  // Security
  { key: 'tokens', label: 'Tokens', component: lazy(() => import('../components/Security/TokensSimulator')) },
  { key: 'cryptography', label: 'Cryptography', component: lazy(() => import('../components/Security/CryptographySimulator')) },
  { key: 'attacks', label: 'Common Attacks', component: lazy(() => import('../components/Security/AttackSimulatorPage')) },
  { key: 'prompt-injection', label: 'Prompt Injection', component: lazy(() => import('../components/Security/PromptInjectionSimulator')) },

  // Monitoring
  { key: 'logs', label: 'Logs', component: lazy(() => import('../components/Monitoramento/LogSimulator')) },
  { key: 'tracing', label: 'Distributed Tracing', component: lazy(() => import('../components/Monitoramento/TracingSimulator')) },

  // AI systems
  { key: 'inference-batching', label: 'Inference Batching', component: lazy(() => import('../components/AISystems/InferenceBatchingSimulator')) },
  { key: 'rag-pipeline', label: 'RAG Pipeline', component: lazy(() => import('../components/AISystems/RagPipelineSimulator')) },
  { key: 'vector-search', label: 'Vector Search', component: lazy(() => import('../components/AISystems/VectorSearchSimulator')) },
  { key: 'llm-gateway', label: 'LLM Gateway', component: lazy(() => import('../components/AISystems/LlmGatewaySimulator')) },
  { key: 'gpu-autoscaler', label: 'GPU Autoscaler', component: lazy(() => import('../components/AISystems/GpuAutoscalerSimulator')) },
  { key: 'agent-orchestration', label: 'Agent Orchestration', component: lazy(() => import('../components/AISystems/AgentOrchestrationSimulator')) },

  // Data & storage
  { key: 'consistent-hashing', label: 'Consistent Hashing', component: lazy(() => import('../components/DataStorage/ConsistentHashingSimulator')) },
  { key: 'sharding', label: 'Sharding', component: lazy(() => import('../components/DataStorage/ShardingSimulator')) },
  { key: 'inverted-index', label: 'Inverted Index', component: lazy(() => import('../components/DataStorage/InvertedIndexSimulator')) },
  { key: 'storage-engine', label: 'Storage Engines (B-Tree vs LSM)', component: lazy(() => import('../components/DataStorage/StorageEngineSimulator')) },
  { key: 'bloom-filter', label: 'Bloom Filter', component: lazy(() => import('../components/DataStorage/BloomFilterSimulator')) },
  { key: 'quorum-replication', label: 'Quorum Replication', component: lazy(() => import('../components/DataStorage/QuorumReplicationSimulator')) },
  { key: 'cdc', label: 'Change Data Capture', component: lazy(() => import('../components/DataStorage/CdcSimulator')) },
];

const byKey = new Map(SIMULATORS.map((s) => [s.key, s]));

export function getSimulator(key: string | null | undefined): SimulatorDef | undefined {
  if (!key) return undefined;
  return byKey.get(key);
}

/** Keys + labels for the CMS "attach simulator" dropdown. */
export const SIMULATOR_OPTIONS = SIMULATORS.map((s) => ({ key: s.key, label: s.label }));
