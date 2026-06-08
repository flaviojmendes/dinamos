/**
 * Manifest of content-only pages, each rendered from MDX via <MdxPage slug>.
 *
 * `path`  MUST match the existing route/URL byte-for-byte — user completion
 *         progress is keyed by pathname (useContentProgress) and roadmap.tsx
 *         links to these exact paths.
 * `slug`  maps to src/content/<slug>.<lang>.mdx (internal, decoupled from URL).
 *
 * Interactive simulators, the Roadmap, and the Forum are NOT here — they stay
 * as bespoke routes in App.tsx.
 */
export interface ContentEntry {
  path: string;
  slug: string;
}

export const contentManifest: ContentEntry[] = [
  // Fundamentals
  { path: '/intro', slug: 'intro' },
  { path: '/sistemas-distribuidos-101', slug: 'distributed-systems-101' },
  { path: '/system-design-101', slug: 'system-design-101' },

  // Theoretical foundations
  { path: '/theoretical-foundations', slug: 'theoretical-foundations/index' },
  { path: '/theoretical-foundations/cap-theorem', slug: 'theoretical-foundations/cap-theorem' },
  { path: '/theoretical-foundations/consistency-models', slug: 'theoretical-foundations/consistency-models' },
  { path: '/theoretical-foundations/distributed-challenges', slug: 'theoretical-foundations/distributed-challenges' },
  { path: '/theoretical-foundations/network-partitions', slug: 'theoretical-foundations/network-partitions' },

  // System components
  { path: '/componentes', slug: 'components/index' },
  { path: '/componentes/banco-dados', slug: 'components/database' },
  { path: '/componentes/cache', slug: 'components/cache' },
  { path: '/componentes/load-balancer', slug: 'components/load-balancer' },
  { path: '/componentes/message-queue', slug: 'components/message-queue' },
  { path: '/componentes/cdn', slug: 'components/cdn' },
  { path: '/componentes/api-gateway', slug: 'components/api-gateway' },
  { path: '/componentes/firewall', slug: 'components/firewall' },
  { path: '/componentes/polling-webhooks', slug: 'components/polling-webhooks' },
  { path: '/componentes/vector-database', slug: 'components/vector-database' },
  { path: '/componentes/model-gateway', slug: 'components/model-gateway' },
  { path: '/componentes/kafka', slug: 'components/kafka-streaming' },
  { path: '/componentes/dns', slug: 'components/dns' },
  { path: '/componentes/reverse-proxy', slug: 'components/reverse-proxy' },
  { path: '/componentes/service-discovery', slug: 'components/service-discovery' },
  { path: '/componentes/service-mesh', slug: 'components/service-mesh' },
  { path: '/componentes/kubernetes', slug: 'components/kubernetes' },

  // Design principles
  { path: '/principios-design', slug: 'design-principles/index' },
  { path: '/principios-design/eventos', slug: 'design-principles/event-driven' },
  { path: '/principios-design/acoplamento', slug: 'design-principles/coupling' },
  { path: '/principios-design/orquestracao-vs-coreografia', slug: 'design-principles/orchestration-vs-choreography' },
  { path: '/principios-design/canary-deployment', slug: 'design-principles/canary-deployment' },
  { path: '/principios-design/cqrs', slug: 'design-principles/cqrs' },
  { path: '/principios-design/rate-limiting', slug: 'design-principles/rate-limiting' },
  { path: '/principios-design/backpressure', slug: 'design-principles/backpressure' },
  { path: '/principios-design/tolerancia-falhas', slug: 'design-principles/fault-tolerance' },
  { path: '/principios-design/tolerancia-falhas/retries', slug: 'design-principles/retries' },
  { path: '/principios-design/tolerancia-falhas/circuit-breaker', slug: 'design-principles/circuit-breaker' },
  { path: '/principios-design/tolerancia-falhas/timeout', slug: 'design-principles/timeout' },
  { path: '/principios-design/tolerancia-falhas/fallback', slug: 'design-principles/fallback' },
  { path: '/fallback', slug: 'design-principles/fallback' },
  { path: '/principios-design/escalabilidade', slug: 'design-principles/scalability' },
  { path: '/principios-design/escalabilidade/horizontal', slug: 'design-principles/horizontal-scaling' },
  { path: '/horizontal-scaling', slug: 'design-principles/horizontal-scaling' },
  { path: '/principios-design/escalabilidade/vertical', slug: 'design-principles/vertical-scaling' },
  { path: '/principios-design/escalabilidade/consistencia', slug: 'design-principles/data-consistency' },
  { path: '/principios-design/escalabilidade/latencia', slug: 'design-principles/latency' },
  { path: '/principios-design/escalabilidade/failover', slug: 'design-principles/failover' },
  { path: '/principios-design/disponibilidade', slug: 'design-principles/availability' },
  { path: '/principios-design/disponibilidade/replicacao', slug: 'design-principles/replication' },
  { path: '/principios-design/disponibilidade/zonas', slug: 'design-principles/availability-zones' },
  { path: '/principios-design/disponibilidade/failover', slug: 'design-principles/failover' },

  // Consistency strategies
  { path: '/estrategias-de-consistencia', slug: 'consistency-strategies/index' },
  { path: '/estrategias-de-consistencia/consenso', slug: 'consistency-strategies/consensus' },
  { path: '/estrategias-de-consistencia/lamport-timestamps', slug: 'consistency-strategies/lamport-timestamps' },
  { path: '/estrategias-de-consistencia/two-phase-commit', slug: 'consistency-strategies/two-phase-commit' },
  { path: '/estrategias-de-consistencia/sincronizacao', slug: 'consistency-strategies/synchronization' },
  { path: '/estrategias-de-consistencia/sincronizacao/fundamentos', slug: 'consistency-strategies/synchronization-fundamentals' },
  { path: '/estrategias-de-consistencia/sincronizacao/deadlocks', slug: 'consistency-strategies/synchronization-deadlocks' },
  { path: '/estrategias-de-consistencia/saga', slug: 'consistency-strategies/saga' },
  { path: '/estrategias-de-consistencia/delivery-semantics', slug: 'consistency-strategies/delivery-semantics' },
  { path: '/estrategias-de-consistencia/vector-clocks', slug: 'consistency-strategies/vector-clocks' },

  // Security
  { path: '/seguranca', slug: 'security/index' },
  { path: '/seguranca/autenticacao', slug: 'security/authentication' },
  { path: '/seguranca/autorizacao', slug: 'security/authorization' },
  { path: '/seguranca/criptografia', slug: 'security/cryptography' },
  { path: '/seguranca/tokens', slug: 'security/tokens' },
  { path: '/seguranca/ssl-tls', slug: 'security/ssl-tls' },
  { path: '/seguranca/ataques', slug: 'security/common-attacks' },
  { path: '/seguranca/prompt-injection', slug: 'security/prompt-injection' },

  // Monitoring & maintenance
  { path: '/monitoramento-e-manutencao', slug: 'monitoring/index' },
  { path: '/monitoramento-e-manutencao/metricas', slug: 'monitoring/metrics' },
  { path: '/monitoramento-e-manutencao/logs', slug: 'monitoring/logs' },
  { path: '/monitoramento-e-manutencao/alertas', slug: 'monitoring/alerts' },
  { path: '/monitoramento-e-manutencao/performance', slug: 'monitoring/performance' },
  { path: '/monitoramento-e-manutencao/health-checks', slug: 'monitoring/health-checks' },
  { path: '/monitoramento-e-manutencao/llm-observability', slug: 'monitoring/llm-observability' },
  { path: '/monitoramento-e-manutencao/distributed-tracing', slug: 'monitoring/distributed-tracing' },
  { path: '/monitoramento-e-manutencao/slo-sli-sla', slug: 'monitoring/slo-sli-sla' },

  // AI & LLM systems
  { path: '/sistemas-ia', slug: 'ai-systems/index' },
  { path: '/sistemas-ia/llm-serving-fundamentals', slug: 'ai-systems/llm-serving-fundamentals' },
  { path: '/sistemas-ia/rag', slug: 'ai-systems/rag' },
  { path: '/sistemas-ia/vector-search', slug: 'ai-systems/vector-search' },
  { path: '/sistemas-ia/llm-gateway', slug: 'ai-systems/llm-gateway' },
  { path: '/sistemas-ia/gpu-autoscaling', slug: 'ai-systems/gpu-autoscaling' },
  { path: '/sistemas-ia/agentic-systems', slug: 'ai-systems/agentic-systems' },

  // Data & storage
  { path: '/dados-armazenamento', slug: 'data-storage/index' },
  { path: '/dados-armazenamento/consistent-hashing', slug: 'data-storage/consistent-hashing' },
  { path: '/dados-armazenamento/sharding', slug: 'data-storage/sharding-partitioning' },
  { path: '/dados-armazenamento/object-storage', slug: 'data-storage/object-storage' },
  { path: '/dados-armazenamento/distributed-file-systems', slug: 'data-storage/distributed-file-systems' },
  { path: '/dados-armazenamento/inverted-index', slug: 'data-storage/search-inverted-index' },

  // Real-world cases
  { path: '/casos-reais', slug: 'real-cases/index' },
  { path: '/casos-reais/youtube', slug: 'real-cases/youtube' },
  { path: '/casos-reais/spotify', slug: 'real-cases/spotify' },
  { path: '/casos-reais/whatsapp', slug: 'real-cases/whatsapp' },
  { path: '/casos-reais/bitly', slug: 'real-cases/bitly' },
  { path: '/casos-reais/netflix', slug: 'real-cases/netflix' },
  { path: '/casos-reais/uber', slug: 'real-cases/uber' },
  { path: '/casos-reais/chatgpt', slug: 'real-cases/chatgpt' },
  { path: '/casos-reais/perplexity', slug: 'real-cases/perplexity' },
  { path: '/casos-reais/github-copilot', slug: 'real-cases/github-copilot' },
];
