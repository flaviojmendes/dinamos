-- Backfill content_pages.simulator_key for lessons whose interactive simulator
-- predates the CMS "attach simulator" feature. These simulators have always
-- worked via explicit (legacy) routes in src/App.tsx, but their owning page row
-- had simulator_key = NULL, so the admin CMS showed "— none —" even though a
-- simulator exists. Mapping page path -> registry key (see
-- src/config/simulatorRegistry.ts). Idempotent and safe to re-run.
UPDATE "content_pages" AS cp
SET "simulator_key" = m.key, "updated_at" = now()
FROM (VALUES
  ('/componentes/cache', 'cache'),
  ('/componentes/load-balancer', 'load-balancer'),
  ('/componentes/message-queue', 'message-queue'),
  ('/componentes/cdn', 'cdn'),
  ('/componentes/api-gateway', 'api-gateway'),
  ('/componentes/firewall', 'firewall'),
  ('/componentes/polling-webhooks', 'polling-webhooks'),
  ('/componentes/kafka', 'kafka'),
  ('/principios-design/eventos', 'event-sourcing'),
  ('/principios-design/canary-deployment', 'canary-deployment'),
  ('/principios-design/cqrs', 'cqrs'),
  ('/principios-design/rate-limiting', 'rate-limiter'),
  ('/principios-design/backpressure', 'backpressure'),
  ('/principios-design/tolerancia-falhas/retries', 'retries'),
  ('/principios-design/tolerancia-falhas/circuit-breaker', 'circuit-breaker'),
  ('/principios-design/tolerancia-falhas/timeout', 'timeout'),
  ('/principios-design/escalabilidade', 'scalability'),
  ('/principios-design/escalabilidade/horizontal', 'horizontal-scaling'),
  ('/principios-design/escalabilidade/vertical', 'vertical-scaling'),
  ('/principios-design/disponibilidade/zonas', 'availability-zones'),
  ('/principios-design/disponibilidade/replicacao', 'replication'),
  ('/estrategias-de-consistencia/consenso', 'consensus'),
  ('/estrategias-de-consistencia/lamport-timestamps', 'lamport-timestamps'),
  ('/estrategias-de-consistencia/two-phase-commit', 'two-phase-commit'),
  ('/estrategias-de-consistencia/sincronizacao', 'synchronization'),
  ('/estrategias-de-consistencia/saga', 'saga'),
  ('/estrategias-de-consistencia/delivery-semantics', 'delivery-semantics'),
  ('/seguranca/tokens', 'tokens'),
  ('/seguranca/criptografia', 'cryptography'),
  ('/seguranca/ataques', 'attacks'),
  ('/seguranca/prompt-injection', 'prompt-injection'),
  ('/monitoramento-e-manutencao/logs', 'logs'),
  ('/sistemas-ia/llm-serving-fundamentals', 'inference-batching'),
  ('/sistemas-ia/rag', 'rag-pipeline'),
  ('/sistemas-ia/vector-search', 'vector-search'),
  ('/sistemas-ia/llm-gateway', 'llm-gateway'),
  ('/sistemas-ia/gpu-autoscaling', 'gpu-autoscaler'),
  ('/sistemas-ia/agentic-systems', 'agent-orchestration'),
  ('/dados-armazenamento/consistent-hashing', 'consistent-hashing'),
  ('/dados-armazenamento/sharding', 'sharding'),
  ('/dados-armazenamento/inverted-index', 'inverted-index')
) AS m(path, key)
WHERE cp."path" = m.path
  AND cp."simulator_key" IS DISTINCT FROM m.key;
