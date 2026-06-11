-- Announcement broadcasting the new lessons & simulators batch. Idempotent: a
-- stable marker title guards the insert so re-running on every deploy is a
-- no-op (the announcements table has no natural unique key, so we guard with
-- NOT EXISTS instead of ON CONFLICT). Runs after the announcements schema is
-- ensured (SCHEMA_DDL in applyContentSeed) and after the content addenda.

INSERT INTO "announcements" ("title_en", "title_pt", "body_en", "body_pt", "published", "published_at")
SELECT
  'New lessons & interactive simulators',
  'Novas lições e simuladores interativos',
  $mdx$We've expanded the platform with **24 new lessons** and a batch of **interactive simulators** across six modules:

- **Data & Storage:** [Storage Engines (B-Tree vs LSM)](/dados-armazenamento/storage-engines), [Bloom Filters](/dados-armazenamento/bloom-filters), [Replication & Quorums](/dados-armazenamento/replication-quorums), [Change Data Capture](/dados-armazenamento/cdc), OLTP vs OLAP, Time-Series
- **Components:** [API Styles (REST/gRPC/GraphQL)](/componentes/api-styles), [WebSockets & Real-Time Push](/componentes/realtime-push), [Dead Letter Queues](/componentes/dead-letter-queue), Stream Processing
- **Consistency:** [CRDTs](/estrategias-de-consistencia/crdts), [Gossip & Anti-Entropy](/estrategias-de-consistencia/gossip), [Distributed Locks & Fencing](/estrategias-de-consistencia/distributed-locks)
- **Design Principles:** [Transactional Outbox](/principios-design/outbox), [Bulkhead](/principios-design/bulkhead), [Blue-Green](/principios-design/blue-green), Event Sourcing, Feature Flags
- **Theory:** [PACELC](/theoretical-foundations/pacelc), FLP Impossibility, Fallacies of Distributed Computing
- **Reliability:** [Chaos Engineering](/monitoramento-e-manutencao/chaos-engineering), Disaster Recovery, Multi-Region

Most topics ship with a hands-on simulator. Open the sidebar to explore.
$mdx$,
  $mdx$Expandimos a plataforma com **24 novas lições** e um conjunto de **simuladores interativos** em seis módulos:

- **Dados & Armazenamento:** [Motores de Armazenamento (B-Tree vs LSM)](/dados-armazenamento/storage-engines), [Filtros de Bloom](/dados-armazenamento/bloom-filters), [Replicação & Quóruns](/dados-armazenamento/replication-quorums), [Change Data Capture](/dados-armazenamento/cdc), OLTP vs OLAP, Séries Temporais
- **Componentes:** [Estilos de API (REST/gRPC/GraphQL)](/componentes/api-styles), [WebSockets & Push em Tempo Real](/componentes/realtime-push), [Dead Letter Queues](/componentes/dead-letter-queue), Stream Processing
- **Consistência:** [CRDTs](/estrategias-de-consistencia/crdts), [Gossip & Anti-Entropia](/estrategias-de-consistencia/gossip), [Locks Distribuídos & Fencing](/estrategias-de-consistencia/distributed-locks)
- **Princípios de Design:** [Transactional Outbox](/principios-design/outbox), [Bulkhead](/principios-design/bulkhead), [Blue-Green](/principios-design/blue-green), Event Sourcing, Feature Flags
- **Teoria:** [PACELC](/theoretical-foundations/pacelc), Impossibilidade FLP, Falácias da Computação Distribuída
- **Confiabilidade:** [Chaos Engineering](/monitoramento-e-manutencao/chaos-engineering), Disaster Recovery, Multi-Região

A maioria dos tópicos vem com um simulador prático. Abra a barra lateral para explorar.
$mdx$,
  true,
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM "announcements" WHERE "title_en" = 'New lessons & interactive simulators'
);
