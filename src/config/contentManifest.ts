/**
 * Manifest of content-only pages, each rendered from MDX via <MdxPage slug>.
 *
 * `path`  MUST match the existing route/URL byte-for-byte — user completion
 *         progress is keyed by pathname (useContentProgress) and roadmap.tsx
 *         links to these exact paths.
 * `slug`  maps to src/content/<slug>.<lang>.mdx (internal, decoupled from URL).
 * `requiresSubscription` defaults to true; free pages set it to false.
 *
 * Interactive simulators, the Roadmap, and the Forum are NOT here — they stay
 * as bespoke routes in App.tsx.
 */
export interface ContentEntry {
  path: string;
  slug: string;
  requiresSubscription?: boolean;
}

export const contentManifest: ContentEntry[] = [
  // Fundamentals (free)
  { path: '/intro', slug: 'intro', requiresSubscription: false },
  { path: '/sistemas-distribuidos-101', slug: 'distributed-systems-101', requiresSubscription: false },
  { path: '/system-design-101', slug: 'system-design-101', requiresSubscription: false },

  // Theoretical foundations (free)
  { path: '/theoretical-foundations', slug: 'theoretical-foundations/index', requiresSubscription: false },
  { path: '/theoretical-foundations/cap-theorem', slug: 'theoretical-foundations/cap-theorem', requiresSubscription: false },
  { path: '/theoretical-foundations/consistency-models', slug: 'theoretical-foundations/consistency-models', requiresSubscription: false },
  { path: '/theoretical-foundations/distributed-challenges', slug: 'theoretical-foundations/distributed-challenges', requiresSubscription: false },
  { path: '/theoretical-foundations/network-partitions', slug: 'theoretical-foundations/network-partitions', requiresSubscription: false },

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

  // Design principles
  { path: '/principios-design', slug: 'design-principles/index' },
  { path: '/principios-design/eventos', slug: 'design-principles/event-driven' },
  { path: '/principios-design/acoplamento', slug: 'design-principles/coupling' },
  { path: '/principios-design/orquestracao-vs-coreografia', slug: 'design-principles/orchestration-vs-choreography' },
  { path: '/principios-design/canary-deployment', slug: 'design-principles/canary-deployment' },
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

  // Security
  { path: '/seguranca', slug: 'security/index' },
  { path: '/seguranca/autenticacao', slug: 'security/authentication' },
  { path: '/seguranca/autorizacao', slug: 'security/authorization' },
  { path: '/seguranca/criptografia', slug: 'security/cryptography' },
  { path: '/seguranca/tokens', slug: 'security/tokens' },
  { path: '/seguranca/ssl-tls', slug: 'security/ssl-tls' },
  { path: '/seguranca/ataques', slug: 'security/common-attacks' },

  // Monitoring & maintenance
  { path: '/monitoramento-e-manutencao', slug: 'monitoring/index' },
  { path: '/monitoramento-e-manutencao/metricas', slug: 'monitoring/metrics' },
  { path: '/monitoramento-e-manutencao/logs', slug: 'monitoring/logs' },
  { path: '/monitoramento-e-manutencao/alertas', slug: 'monitoring/alerts' },
  { path: '/monitoramento-e-manutencao/performance', slug: 'monitoring/performance' },
  { path: '/monitoramento-e-manutencao/health-checks', slug: 'monitoring/health-checks' },

  // Real-world cases
  { path: '/casos-reais', slug: 'real-cases/index' },
  { path: '/casos-reais/youtube', slug: 'real-cases/youtube' },
  { path: '/casos-reais/spotify', slug: 'real-cases/spotify' },
  { path: '/casos-reais/whatsapp', slug: 'real-cases/whatsapp' },
  { path: '/casos-reais/bitly', slug: 'real-cases/bitly' },
  { path: '/casos-reais/netflix', slug: 'real-cases/netflix' },
  { path: '/casos-reais/uber', slug: 'real-cases/uber' },
];
