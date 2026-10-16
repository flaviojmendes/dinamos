import type React from 'react';
import i18n, { loadLocale } from './i18n';

// Kept behind one dynamic import so the 59 route preload maps do not inflate
// the app shell. Each simulator remains an independent lazy chunk.
const loaders: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  'cache': () => import('../components/CacheSimulation/CacheSimulation'),
  'load-balancer': () => import('../components/RoundRobin/RoundRobin'),
  'message-queue': () => import('../components/MessageQueue/MessageQueue'),
  'cdn': () => import('../components/CDN/CDN'),
  'api-gateway': () => import('../components/APIGateway/APIGatewaySimulator'),
  'firewall': () => import('../components/SystemComponents/FirewallSimulator'),
  'polling-webhooks': () => import('../components/SystemComponents/PollingWebhooks'),
  'kafka': () => import('../components/SystemComponents/KafkaSimulator'),
  'api-styles': () => import('../components/SystemComponents/ApiStylesSimulator'),
  'realtime-push': () => import('../components/SystemComponents/RealtimePushSimulator'),
  'dead-letter-queue': () => import('../components/SystemComponents/DeadLetterQueueSimulator'),
  'circuit-breaker': () => import('../components/CircuitBreaker/CircuitBreaker'),
  'backpressure': () => import('../components/Backpressure/Backpressure'),
  'rate-limiter': () => import('../components/RateLimiter/RateLimiter'),
  'async-sync': () => import('../components/AsyncSync/AsyncSync'),
  'event-sourcing': () => import('../components/DesignPrinciples/EventSourcingSimulator'),
  'service-architecture': () => import('../components/DesignPrinciples/ServiceArchitectureSimulator'),
  'retries': () => import('../components/DesignPrinciples/RetriesSimulator'),
  'timeout': () => import('../components/DesignPrinciples/TimeoutSimulator'),
  'horizontal-scaling': () => import('../components/HorizontalScaling/HorizontalScalingSimulator'),
  'vertical-scaling': () => import('../components/DesignPrinciples/VerticalScalingSimulator'),
  'scalability': () => import('../components/DesignPrinciples/ScalabilitySimulator'),
  'availability-zones': () => import('../components/DesignPrinciples/AvailabilityZonesSimulator'),
  'replication': () => import('../components/DesignPrinciples/ReplicationSimulator'),
  'cqrs': () => import('../components/DesignPrinciples/CqrsSimulator'),
  'canary-deployment': () => import('../components/CanaryDeployment/CanaryDeploymentSimulator'),
  'outbox': () => import('../components/DesignPrinciples/OutboxSimulator'),
  'bulkhead': () => import('../components/DesignPrinciples/BulkheadSimulator'),
  'pacelc': () => import('../components/Theory/PacelcSimulator'),
  'chaos': () => import('../components/Monitoring/ChaosSimulator'),
  'consensus': () => import('../components/ConsistencyStrategies/ConsensusSimulator'),
  'lamport-timestamps': () => import('../components/ConsistencyStrategies/LamportTimestampsSimulator'),
  'two-phase-commit': () => import('../components/ConsistencyStrategies/TwoPhaseCommitSimulator'),
  'synchronization': () => import('../components/ConsistencyStrategies/SynchronizationSimulator'),
  'synchronization-algorithms': () => import('../components/ConsistencyStrategies/SynchronizationAlgorithms'),
  'saga': () => import('../components/ConsistencyStrategies/SagaSimulator'),
  'delivery-semantics': () => import('../components/ConsistencyStrategies/DeliverySemanticsSimulator'),
  'crdt': () => import('../components/ConsistencyStrategies/CrdtSimulator'),
  'gossip': () => import('../components/ConsistencyStrategies/GossipSimulator'),
  'distributed-lock': () => import('../components/ConsistencyStrategies/DistributedLockSimulator'),
  'tokens': () => import('../components/Security/TokensSimulator'),
  'cryptography': () => import('../components/Security/CryptographySimulator'),
  'attacks': () => import('../components/Security/AttackSimulatorPage'),
  'prompt-injection': () => import('../components/Security/PromptInjectionSimulator'),
  'logs': () => import('../components/Monitoramento/LogSimulator'),
  'tracing': () => import('../components/Monitoramento/TracingSimulator'),
  'inference-batching': () => import('../components/AISystems/InferenceBatchingSimulator'),
  'rag-pipeline': () => import('../components/AISystems/RagPipelineSimulator'),
  'vector-search': () => import('../components/AISystems/VectorSearchSimulator'),
  'llm-gateway': () => import('../components/AISystems/LlmGatewaySimulator'),
  'gpu-autoscaler': () => import('../components/AISystems/GpuAutoscalerSimulator'),
  'agent-orchestration': () => import('../components/AISystems/AgentOrchestrationSimulator'),
  'consistent-hashing': () => import('../components/DataStorage/ConsistentHashingSimulator'),
  'sharding': () => import('../components/DataStorage/ShardingSimulator'),
  'inverted-index': () => import('../components/DataStorage/InvertedIndexSimulator'),
  'storage-engine': () => import('../components/DataStorage/StorageEngineSimulator'),
  'bloom-filter': () => import('../components/DataStorage/BloomFilterSimulator'),
  'quorum-replication': () => import('../components/DataStorage/QuorumReplicationSimulator'),
  'cdc': () => import('../components/DataStorage/CdcSimulator'),
};

export async function loadSimulator(key: string) {
  const loader = loaders[key];
  if (!loader) throw new Error(`Unknown simulator: ${key}`);
  const [component] = await Promise.all([
    loader(),
    loadLocale(i18n.resolvedLanguage || i18n.language, { extended: true }),
  ]);
  return component;
}
