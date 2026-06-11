-- Incremental content: new Data & Storage lessons (idempotent upserts).
-- Applied on every deploy by server/scripts/applyContentSeed.ts (CONTENT_ADDENDA).

INSERT INTO "content_pages" ("slug", "path", "module_id", "order_index", "simulator_key", "published", "title_en", "title_pt", "body_en", "body_pt") VALUES
  ('data-storage/storage-engines', '/dados-armazenamento/storage-engines', 'data-storage', 97, 'storage-engine', true, 'Storage Engines: B-Tree vs LSM-Tree', 'Engines de Armazenamento: B-Tree vs LSM-Tree', $mdx$# Storage Engines: B-Tree vs LSM-Tree

Every database has a **storage engine** — the layer that decides how rows are physically written to and read from disk. The two dominant designs are **B-Trees** (Postgres, MySQL/InnoDB) and **LSM-Trees** (Cassandra, RocksDB, ScyllaDB). The choice shapes write throughput, read latency, and space usage.

<Callout type="info" title="The durable write first: the WAL">

Before either engine touches its main structures, it appends the change to a **Write-Ahead Log** (WAL). The WAL is a sequential, append-only file — fast to write and enough to recover after a crash. Only then is the write applied to the engine's data structures.

</Callout>

## B-Tree: update in place

<Cards cols={2}>

<Card title="How it works" accent="brand">

- Data lives in a balanced tree of fixed-size **pages**
- A write finds the right leaf page and **overwrites it in place**
- Reads are a single top-to-bottom tree walk

</Card>

<Card title="Trade-offs" accent="amber">

- Low **read amplification** — one path to the value
- Higher **write amplification** — random I/O, page splits
- Great for read-heavy, transactional workloads

</Card>

</Cards>

## LSM-Tree: log-structured

<Cards cols={2}>

<Card title="How it works" accent="green">

- Writes go to an in-memory **memtable** (sorted)
- When full, the memtable is flushed to an immutable **SSTable** on disk
- Background **compaction** merges SSTables into larger, sorted files

</Card>

<Card title="Trade-offs" accent="amber">

- Very high write throughput — sequential appends
- Reads may check the memtable **plus several SSTables** (read amplification)
- Compaction adds background write amplification

</Card>

</Cards>

<Callout type="success" title="Try it">

Stream writes through both engines and watch write amplification, read amplification, and compaction events in the [Storage Engine Simulator](/dados-armazenamento/storage-engines/simulator).

</Callout>

## When to choose which

| Workload | Prefer |
| --- | --- |
| Read-heavy, point lookups, transactions | B-Tree |
| Write-heavy, ingest, time-series, logs | LSM-Tree |
| Predictable read latency | B-Tree |
| Maximum write throughput | LSM-Tree |

Bloom filters (next lesson) are what make LSM reads tolerable: they let the engine skip SSTables that definitely do not contain a key.
$mdx$, $mdx$# Engines de Armazenamento: B-Tree vs LSM-Tree

Todo banco tem uma **engine de armazenamento** — a camada que decide como as linhas são escritas e lidas fisicamente em disco. Os dois projetos dominantes são **B-Trees** (Postgres, MySQL/InnoDB) e **LSM-Trees** (Cassandra, RocksDB, ScyllaDB). A escolha molda a vazão de escrita, a latência de leitura e o uso de espaço.

<Callout type="info" title="A escrita durável primeiro: o WAL">

Antes de qualquer engine tocar suas estruturas principais, ela anexa a mudança a um **Write-Ahead Log** (WAL). O WAL é um arquivo sequencial, somente-anexação — rápido de escrever e suficiente para recuperar após uma falha. Só então a escrita é aplicada às estruturas de dados da engine.

</Callout>

## B-Tree: atualização no lugar

<Cards cols={2}>

<Card title="Como funciona" accent="brand">

- Os dados vivem em uma árvore balanceada de **páginas** de tamanho fixo
- Uma escrita encontra a página folha certa e a **sobrescreve no lugar**
- Leituras são uma única travessia de cima para baixo

</Card>

<Card title="Trade-offs" accent="amber">

- Baixa **amplificação de leitura** — um caminho até o valor
- Maior **amplificação de escrita** — I/O aleatório, divisão de páginas
- Ótimo para cargas transacionais com muitas leituras

</Card>

</Cards>

## LSM-Tree: estruturada em log

<Cards cols={2}>

<Card title="Como funciona" accent="green">

- Escritas vão para uma **memtable** em memória (ordenada)
- Quando cheia, a memtable é descarregada em uma **SSTable** imutável no disco
- A **compactação** em segundo plano mescla SSTables em arquivos maiores e ordenados

</Card>

<Card title="Trade-offs" accent="amber">

- Vazão de escrita altíssima — anexações sequenciais
- Leituras podem checar a memtable **mais várias SSTables** (amplificação de leitura)
- A compactação adiciona amplificação de escrita em segundo plano

</Card>

</Cards>

<Callout type="success" title="Experimente">

Envie escritas pelas duas engines e observe a amplificação de escrita, a amplificação de leitura e os eventos de compactação no [Simulador de Engine de Armazenamento](/dados-armazenamento/storage-engines/simulator).

</Callout>

## Quando escolher qual

| Carga | Prefira |
| --- | --- |
| Muitas leituras, buscas por chave, transações | B-Tree |
| Muitas escritas, ingestão, séries temporais, logs | LSM-Tree |
| Latência de leitura previsível | B-Tree |
| Vazão máxima de escrita | LSM-Tree |

Os Bloom filters (próxima lição) são o que torna as leituras LSM toleráveis: eles permitem à engine pular SSTables que definitivamente não contêm uma chave.
$mdx$),
  ('data-storage/bloom-filters', '/dados-armazenamento/bloom-filters', 'data-storage', 98, 'bloom-filter', true, 'Bloom Filters', 'Bloom Filters', $mdx$# Bloom Filters

A **Bloom filter** is a compact, probabilistic data structure that answers one question very fast: *"have I possibly seen this key before?"* It can say **"definitely no"** or **"probably yes"** — it never produces a false negative, but it can produce false positives.

<Callout type="info" title="Why it matters">

LSM-tree databases keep a Bloom filter per SSTable. Before reading an SSTable from disk, the engine asks the filter; if it says "definitely not here", the engine skips the disk read entirely. That single trick saves enormous amounts of I/O.

</Callout>

## How it works

<Cards cols={3}>

<Card title="The bit array" accent="brand">

A fixed array of **m** bits, all starting at 0.

</Card>

<Card title="k hash functions" accent="purple">

Each key is hashed by **k** independent functions to **k** positions.

</Card>

<Card title="Insert & query" accent="green">

Insert: set all k bits. Query: if any of the k bits is 0, the key is **definitely absent**.

</Card>

</Cards>

## False positives

When the bit array fills up, an unrelated key may happen to hash to bits that other keys already set — a **false positive**. The expected rate is approximately:

\[ p \approx \left(1 - e^{-kn/m}\right)^k \]

where **n** is the number of inserted items. More bits (**m**) lower the rate; too many hash functions (**k**) for a given fill actually raises it.

<Callout type="success" title="Try it">

Insert keys, tune the bit count and number of hashes, then query a key you never inserted to trigger a false positive in the [Bloom Filter Simulator](/dados-armazenamento/bloom-filters/simulator).

</Callout>

## Where they show up

- **Databases**: skip SSTables (Cassandra, HBase, RocksDB)
- **Caches/CDNs**: avoid caching one-hit-wonder URLs
- **Web**: Chrome's old malicious-URL check, Medium's "already read" feed
- **Networking**: deduplication and routing tables

Variants like **Counting Bloom filters** (support deletion) and **Cuckoo filters** (better space/false-positive trade-off) extend the idea.
$mdx$, $mdx$# Bloom Filters

Um **Bloom filter** é uma estrutura de dados compacta e probabilística que responde muito rápido a uma pergunta: *"talvez eu já tenha visto esta chave?"* Ele pode dizer **"definitivamente não"** ou **"provavelmente sim"** — nunca produz um falso negativo, mas pode produzir falsos positivos.

<Callout type="info" title="Por que importa">

Bancos baseados em LSM-tree mantêm um Bloom filter por SSTable. Antes de ler uma SSTable do disco, a engine pergunta ao filtro; se ele diz "definitivamente não está aqui", a engine pula a leitura de disco por completo. Esse único truque economiza enormes quantidades de I/O.

</Callout>

## Como funciona

<Cards cols={3}>

<Card title="O array de bits" accent="brand">

Um array fixo de **m** bits, todos começando em 0.

</Card>

<Card title="k funções de hash" accent="purple">

Cada chave é hasheada por **k** funções independentes para **k** posições.

</Card>

<Card title="Inserir e consultar" accent="green">

Inserir: setar todos os k bits. Consultar: se qualquer um dos k bits for 0, a chave está **definitivamente ausente**.

</Card>

</Cards>

## Falsos positivos

Quando o array de bits enche, uma chave não relacionada pode acabar hasheando para bits que outras chaves já setaram — um **falso positivo**. A taxa esperada é aproximadamente:

\[ p \approx \left(1 - e^{-kn/m}\right)^k \]

onde **n** é o número de itens inseridos. Mais bits (**m**) reduzem a taxa; hashes (**k**) em excesso para um dado preenchimento na verdade a aumentam.

<Callout type="success" title="Experimente">

Insira chaves, ajuste a quantidade de bits e de hashes, depois consulte uma chave que nunca inseriu para disparar um falso positivo no [Simulador de Bloom Filter](/dados-armazenamento/bloom-filters/simulator).

</Callout>

## Onde aparecem

- **Bancos de dados**: pular SSTables (Cassandra, HBase, RocksDB)
- **Caches/CDNs**: evitar cachear URLs acessadas uma única vez
- **Web**: a antiga checagem de URL maliciosa do Chrome, o feed "já lido" do Medium
- **Redes**: deduplicação e tabelas de roteamento

Variantes como **Counting Bloom filters** (suportam remoção) e **Cuckoo filters** (melhor relação espaço/falso positivo) estendem a ideia.
$mdx$),
  ('data-storage/replication-quorums', '/dados-armazenamento/replication-quorums', 'data-storage', 99, 'quorum-replication', true, 'Replication Models & Quorums', 'Modelos de Replicação e Quóruns', $mdx$# Replication Models & Quorums

Replication keeps copies of data on multiple nodes for **durability**, **availability**, and **read scaling**. The hard part is keeping those copies consistent. There are three broad models and one unifying idea: the **quorum**.

## The three models

<Cards cols={3}>

<Card title="Leader–Follower" accent="brand">

One leader takes all writes and streams them to followers. Simple and consistent, but the leader is a write bottleneck and a failover point.

</Card>

<Card title="Multi-Leader" accent="purple">

Several leaders accept writes (often one per region). Great for write locality, but **write conflicts** must be resolved.

</Card>

<Card title="Leaderless" accent="green">

Any replica accepts reads and writes (Dynamo, Cassandra). Clients use **quorums** to stay consistent.

</Card>

</Cards>

## Quorums: the R + W > N rule

In a leaderless system with **N** replicas, a write must be acknowledged by **W** of them and a read must consult **R** of them. The key inequality:

<Callout type="info" title="The overlap guarantee">

If **R + W > N**, the read set and the write set are guaranteed to **overlap** by at least one node — so every read sees at least one replica that has the latest write. This gives strong consistency without a leader.

</Callout>

- **W = N, R = 1** — fast reads, slow/fragile writes
- **W = 1, R = N** — fast writes, slow reads
- **W = R = ⌈(N+1)/2⌉** — balanced majority quorum

Lowering R and W below the overlap threshold trades consistency for **availability and latency** — reads may return stale values until anti-entropy (read repair, hinted handoff) catches up.

<Callout type="success" title="Try it">

Tune N, W, and R, issue writes and reads, and watch stale reads appear when the quorums stop overlapping in the [Quorum Replication Simulator](/dados-armazenamento/replication-quorums/simulator).

</Callout>

## Related ideas

This connects directly to the [CAP theorem](/theoretical-foundations/cap-theorem): quorum tuning is exactly how you slide along the consistency/availability spectrum during a partition.
$mdx$, $mdx$# Modelos de Replicação e Quóruns

A replicação mantém cópias dos dados em vários nós para **durabilidade**, **disponibilidade** e **escala de leitura**. A parte difícil é manter essas cópias consistentes. Há três modelos amplos e uma ideia unificadora: o **quórum**.

## Os três modelos

<Cards cols={3}>

<Card title="Líder–Seguidor" accent="brand">

Um líder recebe todas as escritas e as transmite aos seguidores. Simples e consistente, mas o líder é um gargalo de escrita e um ponto de failover.

</Card>

<Card title="Multi-Líder" accent="purple">

Vários líderes aceitam escritas (em geral um por região). Ótimo para localidade de escrita, mas **conflitos de escrita** precisam ser resolvidos.

</Card>

<Card title="Sem Líder" accent="green">

Qualquer réplica aceita leituras e escritas (Dynamo, Cassandra). Os clientes usam **quóruns** para manter a consistência.

</Card>

</Cards>

## Quóruns: a regra R + W > N

Em um sistema sem líder com **N** réplicas, uma escrita precisa ser confirmada por **W** delas e uma leitura precisa consultar **R** delas. A desigualdade-chave:

<Callout type="info" title="A garantia de sobreposição">

Se **R + W > N**, o conjunto de leitura e o de escrita são garantidos a **se sobrepor** em ao menos um nó — então toda leitura vê pelo menos uma réplica com a última escrita. Isso dá consistência forte sem um líder.

</Callout>

- **W = N, R = 1** — leituras rápidas, escritas lentas/frágeis
- **W = 1, R = N** — escritas rápidas, leituras lentas
- **W = R = ⌈(N+1)/2⌉** — quórum de maioria balanceado

Reduzir R e W abaixo do limiar de sobreposição troca consistência por **disponibilidade e latência** — leituras podem retornar valores antigos até que a anti-entropia (read repair, hinted handoff) se atualize.

<Callout type="success" title="Experimente">

Ajuste N, W e R, faça escritas e leituras e veja leituras antigas surgirem quando os quóruns deixam de se sobrepor no [Simulador de Quórum de Replicação](/dados-armazenamento/replication-quorums/simulator).

</Callout>

## Ideias relacionadas

Isso conecta diretamente ao [teorema CAP](/theoretical-foundations/cap-theorem): ajustar quóruns é exatamente como você desliza pelo espectro consistência/disponibilidade durante uma partição.
$mdx$),
  ('data-storage/change-data-capture', '/dados-armazenamento/cdc', 'data-storage', 100, 'cdc', true, 'Change Data Capture (CDC)', 'Change Data Capture (CDC)', $mdx$# Change Data Capture (CDC)

**Change Data Capture** streams every row-level change (insert, update, delete) out of a database **as it happens**, so other systems can react without polling and without the application doing dual writes.

<Callout type="warning" title="The dual-write problem it solves">

If your app writes to the database *and* publishes an event itself, the two can diverge: one succeeds, the other fails. CDC reads changes straight from the database's own transaction log, so the event stream is always an exact mirror of committed state.

</Callout>

## How it works

<Cards cols={2}>

<Card title="Log tailing" accent="brand">

A connector (Debezium, Maxwell) reads the database's replication log — Postgres WAL, MySQL binlog, Mongo oplog — in commit order.

</Card>

<Card title="Fan-out" accent="green">

Each change becomes an event on a stream (often Kafka), consumed by caches, search indexes, data warehouses, and other services.

</Card>

</Cards>

## What it powers

- **Cache invalidation** without TTL guesswork
- **Search index** updates (keep Elasticsearch in sync)
- **Data warehouse / lake** ingestion in near real time
- **Microservice integration** via the outbox-free path
- **Audit logs** and event-driven workflows

<Callout type="info" title="Replication lag">

CDC is asynchronous, so downstream systems are **eventually consistent**. If writes outpace the connector or consumers, **lag** builds up and downstream views fall behind. Monitoring lag is essential.

</Callout>

<Callout type="success" title="Try it">

Speed up database writes past the connector's throughput and watch replication lag grow as caches, search, and the warehouse fall behind in the [CDC Simulator](/dados-armazenamento/cdc/simulator).

</Callout>
$mdx$, $mdx$# Change Data Capture (CDC)

**Change Data Capture** transmite cada mudança em nível de linha (insert, update, delete) para fora de um banco **no momento em que acontece**, para que outros sistemas reajam sem polling e sem que a aplicação faça escrita dupla.

<Callout type="warning" title="O problema de escrita dupla que ele resolve">

Se sua aplicação escreve no banco *e* publica um evento por conta própria, os dois podem divergir: um tem sucesso, o outro falha. O CDC lê as mudanças direto do log de transações do próprio banco, então o fluxo de eventos é sempre um espelho exato do estado confirmado.

</Callout>

## Como funciona

<Cards cols={2}>

<Card title="Leitura do log" accent="brand">

Um conector (Debezium, Maxwell) lê o log de replicação do banco — WAL do Postgres, binlog do MySQL, oplog do Mongo — em ordem de commit.

</Card>

<Card title="Fan-out" accent="green">

Cada mudança vira um evento em um fluxo (geralmente Kafka), consumido por caches, índices de busca, data warehouses e outros serviços.

</Card>

</Cards>

## O que ele habilita

- **Invalidação de cache** sem chutar TTLs
- Atualização de **índices de busca** (manter o Elasticsearch em sincronia)
- Ingestão em **data warehouse / lake** quase em tempo real
- **Integração de microsserviços** sem escrita dupla
- **Logs de auditoria** e workflows orientados a eventos

<Callout type="info" title="Atraso de replicação">

O CDC é assíncrono, então sistemas downstream são **eventualmente consistentes**. Se as escritas superam o conector ou os consumidores, o **atraso** se acumula e as visões downstream ficam para trás. Monitorar o atraso é essencial.

</Callout>

<Callout type="success" title="Experimente">

Acelere as escritas do banco além da vazão do conector e veja o atraso de replicação crescer enquanto caches, busca e o warehouse ficam para trás no [Simulador de CDC](/dados-armazenamento/cdc/simulator).

</Callout>
$mdx$),
  ('data-storage/oltp-olap', '/dados-armazenamento/oltp-olap', 'data-storage', 101, NULL, true, 'OLTP vs OLAP, Warehouses & Lakes', 'OLTP vs OLAP, Warehouses e Lakes', $mdx$# OLTP vs OLAP, Warehouses & Lakes

Not all databases do the same job. **Transactional** systems run your product; **analytical** systems answer questions about it. Mixing them on one database is a classic scaling mistake.

## OLTP vs OLAP

<Cards cols={2}>

<Card title="OLTP — Transactional" accent="brand">

- Many small reads/writes per second
- Row-oriented storage
- Indexed point lookups, strict consistency
- Examples: Postgres, MySQL, DynamoDB

</Card>

<Card title="OLAP — Analytical" accent="purple">

- Few huge scans/aggregations
- **Column-oriented** storage (compresses well)
- Reads billions of rows for one report
- Examples: BigQuery, Snowflake, Redshift, ClickHouse

</Card>

</Cards>

<Callout type="info" title="Why columnar wins for analytics">

A report like "average order value by month" touches two columns out of fifty. Column stores read only those two columns and compress them heavily, so the same query scans a fraction of the bytes a row store would.

</Callout>

## Warehouse vs Lake vs Lakehouse

<Cards cols={3}>

<Card title="Data Warehouse" accent="brand">

Structured, schema-on-write, curated tables optimized for SQL analytics.

</Card>

<Card title="Data Lake" accent="green">

Raw files (Parquet, JSON) in object storage, schema-on-read, cheap and flexible.

</Card>

<Card title="Lakehouse" accent="purple">

Warehouse-style tables (Delta, Iceberg) on top of a lake — one system for both.

</Card>

</Cards>

## Getting data across

Data moves from OLTP to OLAP via **ETL/ELT** batch jobs or, increasingly, via [Change Data Capture](/dados-armazenamento/cdc) for near-real-time analytics. The pattern of keeping separate read-optimized models also echoes [CQRS](/principios-design/cqrs).
$mdx$, $mdx$# OLTP vs OLAP, Warehouses e Lakes

Nem todo banco faz o mesmo trabalho. Sistemas **transacionais** rodam seu produto; sistemas **analíticos** respondem perguntas sobre ele. Misturar os dois num único banco é um erro clássico de escala.

## OLTP vs OLAP

<Cards cols={2}>

<Card title="OLTP — Transacional" accent="brand">

- Muitas leituras/escritas pequenas por segundo
- Armazenamento orientado a linha
- Buscas por chave indexadas, consistência estrita
- Exemplos: Postgres, MySQL, DynamoDB

</Card>

<Card title="OLAP — Analítico" accent="purple">

- Poucas varreduras/agregações enormes
- Armazenamento **orientado a coluna** (comprime bem)
- Lê bilhões de linhas para um relatório
- Exemplos: BigQuery, Snowflake, Redshift, ClickHouse

</Card>

</Cards>

<Callout type="info" title="Por que colunar vence em analytics">

Um relatório como "valor médio do pedido por mês" toca duas colunas de cinquenta. Bancos colunares leem só essas duas colunas e as comprimem fortemente, então a mesma consulta varre uma fração dos bytes que um banco de linhas leria.

</Callout>

## Warehouse vs Lake vs Lakehouse

<Cards cols={3}>

<Card title="Data Warehouse" accent="brand">

Tabelas estruturadas e curadas, schema-on-write, otimizadas para analytics SQL.

</Card>

<Card title="Data Lake" accent="green">

Arquivos brutos (Parquet, JSON) em object storage, schema-on-read, barato e flexível.

</Card>

<Card title="Lakehouse" accent="purple">

Tabelas estilo warehouse (Delta, Iceberg) sobre um lake — um sistema para os dois.

</Card>

</Cards>

## Levando os dados de um lado a outro

Os dados vão do OLTP ao OLAP via jobs em lote de **ETL/ELT** ou, cada vez mais, via [Change Data Capture](/dados-armazenamento/cdc) para analytics quase em tempo real. O padrão de manter modelos separados otimizados para leitura também ecoa o [CQRS](/principios-design/cqrs).
$mdx$),
  ('data-storage/time-series-databases', '/dados-armazenamento/time-series', 'data-storage', 102, NULL, true, 'Time-Series Databases', 'Bancos de Séries Temporais', $mdx$# Time-Series Databases

A **time-series database** (TSDB) is specialized for data that is written in time order and queried by time range: metrics, sensor readings, financial ticks, application telemetry. Examples: Prometheus, InfluxDB, TimescaleDB, VictoriaMetrics.

<Callout type="info" title="What makes time-series special">

The workload is **append-heavy and read-by-range**: writes almost always have a newer timestamp, and queries ask "the last 6 hours" or "this metric, downsampled to 1-minute averages". General-purpose databases are poorly shaped for this.

</Callout>

## Key techniques

<Cards cols={2}>

<Card title="Time-based partitioning" accent="brand">

Data is chunked by time window so old chunks can be compressed, moved to cold storage, or dropped wholesale.

</Card>

<Card title="Columnar + delta compression" accent="green">

Timestamps and values compress extremely well (delta-of-delta, Gorilla encoding), shrinking storage 10x or more.

</Card>

<Card title="Downsampling & rollups" accent="purple">

Raw points are aggregated into coarser resolutions over time, keeping recent data fine-grained and old data cheap.

</Card>

<Card title="Retention policies" accent="amber">

Automatic expiry — keep raw data for days, rollups for years.

</Card>

</Cards>

## Cardinality: the classic trap

Each unique combination of labels/tags is a separate series. Adding a high-cardinality label (like a user ID) can explode the series count into the millions and overwhelm the database. **Keep tag values bounded.**

<Callout type="success" title="See it in context">

Time-series databases are the storage layer behind [Metrics & KPIs](/monitoramento-e-manutencao/metricas) and the dashboards you build for observability.

</Callout>
$mdx$, $mdx$# Bancos de Séries Temporais

Um **banco de séries temporais** (TSDB) é especializado em dados escritos em ordem de tempo e consultados por intervalo: métricas, leituras de sensores, ticks financeiros, telemetria de aplicação. Exemplos: Prometheus, InfluxDB, TimescaleDB, VictoriaMetrics.

<Callout type="info" title="O que torna séries temporais especiais">

A carga é **pesada em anexação e lida por intervalo**: escritas quase sempre têm um timestamp mais novo, e consultas pedem "as últimas 6 horas" ou "esta métrica, reamostrada em médias de 1 minuto". Bancos de propósito geral são mal moldados para isso.

</Callout>

## Técnicas-chave

<Cards cols={2}>

<Card title="Particionamento por tempo" accent="brand">

Os dados são divididos por janela de tempo para que blocos antigos possam ser comprimidos, movidos para armazenamento frio ou descartados em massa.

</Card>

<Card title="Colunar + compressão delta" accent="green">

Timestamps e valores comprimem muito bem (delta-of-delta, codificação Gorilla), reduzindo o armazenamento em 10x ou mais.

</Card>

<Card title="Downsampling e rollups" accent="purple">

Pontos brutos são agregados em resoluções mais grosseiras ao longo do tempo, mantendo dados recentes detalhados e dados antigos baratos.

</Card>

<Card title="Políticas de retenção" accent="amber">

Expiração automática — manter dados brutos por dias, rollups por anos.

</Card>

</Cards>

## Cardinalidade: a armadilha clássica

Cada combinação única de labels/tags é uma série separada. Adicionar uma label de alta cardinalidade (como um ID de usuário) pode explodir a contagem de séries para milhões e sobrecarregar o banco. **Mantenha os valores de tag limitados.**

<Callout type="success" title="Veja no contexto">

Bancos de séries temporais são a camada de armazenamento por trás de [Métricas e KPIs](/monitoramento-e-manutencao/metricas) e dos dashboards que você cria para observabilidade.

</Callout>
$mdx$)
ON CONFLICT ("slug") DO UPDATE SET
  "path" = EXCLUDED."path", "module_id" = EXCLUDED."module_id",
  "order_index" = EXCLUDED."order_index", "simulator_key" = EXCLUDED."simulator_key",
  "published" = EXCLUDED."published", "title_en" = EXCLUDED."title_en",
  "title_pt" = EXCLUDED."title_pt", "body_en" = EXCLUDED."body_en",
  "body_pt" = EXCLUDED."body_pt", "updated_at" = now();
