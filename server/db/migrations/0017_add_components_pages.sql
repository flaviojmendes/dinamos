-- Incremental content: new System Components lessons (idempotent upserts).

INSERT INTO "content_pages" ("slug", "path", "module_id", "order_index", "simulator_key", "published", "title_en", "title_pt", "body_en", "body_pt") VALUES
  ('components/api-styles', '/componentes/api-styles', 'components', 103, 'api-styles', true, 'API Styles: REST, gRPC & GraphQL', 'Estilos de API: REST, gRPC e GraphQL', $mdx$# API Styles: REST, gRPC & GraphQL

How services talk to each other is one of the most consequential design choices in a distributed system. The three dominant styles each optimize for different things.

<Cards cols={3}>

<Card title="REST" accent="brand">

Resources over HTTP verbs. Simple, cacheable, universal — but tends to **over-fetch** and needs multiple round trips for related data.

</Card>

<Card title="GraphQL" accent="purple">

The client asks for **exactly** the fields it needs in one request. No over-fetching, great for rich UIs — at the cost of server-side query planning and harder caching.

</Card>

<Card title="gRPC" accent="green">

Binary Protobuf over HTTP/2 with a strict schema and streaming. The fastest on the wire, ideal **service-to-service** — but not human-readable and browser-unfriendly.

</Card>

</Cards>

## The trade-offs that matter

| Dimension | REST | GraphQL | gRPC |
| --- | --- | --- | --- |
| Payload | JSON (verbose) | JSON (exact) | Protobuf (compact) |
| Round trips | Often many | One | One |
| Schema/contract | Optional (OpenAPI) | Strong | Strong (.proto) |
| Caching | Easy (HTTP) | Hard | Custom |
| Browser support | Native | Native | Needs proxy |
| Best for | Public APIs | Aggregating UIs | Internal microservices |

<Callout type="info" title="Over-fetching and under-fetching">

REST endpoints return fixed shapes. A mobile screen that needs 3 fields still downloads all 30 (**over-fetching**), and a screen needing data from two resources makes two calls (**under-fetching**). GraphQL and gRPC let the caller request just what it needs.

</Callout>

<Callout type="success" title="Try it">

Pick a style, choose how many fields your screen needs, and compare round trips, payload size, and over-fetch in the [API Styles Simulator](/componentes/api-styles/simulator).

</Callout>

## A pragmatic default

Many teams use **REST or GraphQL at the edge** (public/mobile clients) and **gRPC internally** between services, getting browser-friendliness where it matters and raw efficiency where it does not.
$mdx$, $mdx$# Estilos de API: REST, gRPC e GraphQL

Como os serviços conversam entre si é uma das escolhas de design mais importantes em um sistema distribuído. Os três estilos dominantes otimizam coisas diferentes.

<Cards cols={3}>

<Card title="REST" accent="brand">

Recursos sobre verbos HTTP. Simples, cacheável, universal — mas tende a **over-fetch** e exige vários round trips para dados relacionados.

</Card>

<Card title="GraphQL" accent="purple">

O cliente pede **exatamente** os campos que precisa em uma requisição. Sem over-fetching, ótimo para UIs ricas — ao custo de planejamento de consulta no servidor e cache mais difícil.

</Card>

<Card title="gRPC" accent="green">

Protobuf binário sobre HTTP/2 com schema estrito e streaming. O mais rápido na rede, ideal **serviço-a-serviço** — mas não legível por humanos e pouco amigável ao navegador.

</Card>

</Cards>

## Os trade-offs que importam

| Dimensão | REST | GraphQL | gRPC |
| --- | --- | --- | --- |
| Payload | JSON (verboso) | JSON (exato) | Protobuf (compacto) |
| Round trips | Muitos | Um | Um |
| Schema/contrato | Opcional (OpenAPI) | Forte | Forte (.proto) |
| Cache | Fácil (HTTP) | Difícil | Customizado |
| Suporte a navegador | Nativo | Nativo | Precisa de proxy |
| Ideal para | APIs públicas | UIs agregadoras | Microsserviços internos |

<Callout type="info" title="Over-fetching e under-fetching">

Endpoints REST retornam formatos fixos. Uma tela mobile que precisa de 3 campos ainda baixa todos os 30 (**over-fetching**), e uma tela que precisa de dois recursos faz duas chamadas (**under-fetching**). GraphQL e gRPC deixam o chamador pedir só o necessário.

</Callout>

<Callout type="success" title="Experimente">

Escolha um estilo, defina quantos campos sua tela precisa e compare round trips, tamanho do payload e over-fetch no [Simulador de Estilos de API](/componentes/api-styles/simulator).

</Callout>

## Um padrão pragmático

Muitos times usam **REST ou GraphQL na borda** (clientes públicos/mobile) e **gRPC internamente** entre serviços, ganhando amigabilidade com o navegador onde importa e eficiência bruta onde não importa.
$mdx$),
  ('components/realtime-push', '/componentes/realtime-push', 'components', 104, 'realtime-push', true, 'WebSockets & Real-Time Push', 'WebSockets e Push em Tempo Real', $mdx$# WebSockets & Real-Time Push

When the **server** has new information — a chat message, a price tick, a notification — how does it reach the client? The naive answer (keep asking) wastes resources and adds latency. Real-time push solves it.

## The spectrum

<Cards cols={2}>

<Card title="Short polling" accent="amber">

The client re-requests on a timer. Dead simple, works everywhere — but adds latency (up to one interval) and wastes requests when nothing changed.

</Card>

<Card title="Long polling" accent="amber">

The request is held open until there is data. Lower latency than short polling, but still one request per message.

</Card>

<Card title="Server-Sent Events (SSE)" accent="green">

One long-lived HTTP connection over which the **server streams** events to the client. One-way, simple, auto-reconnecting — ideal for feeds and notifications.

</Card>

<Card title="WebSockets" accent="brand">

A persistent, **full-duplex** TCP connection. Both sides send anytime — the right tool for chat, multiplayer games, and live collaboration.

</Card>

</Cards>

<Callout type="info" title="Persistent connections change the scaling model">

Polling is stateless and load-balances trivially. WebSockets/SSE hold **stateful, long-lived connections**, so you must plan for connection limits, sticky routing, and fanning a message out to thousands of open sockets (often via a pub/sub backplane like Redis).

</Callout>

<Callout type="success" title="Try it">

Compare polling, SSE, and WebSockets and watch delivery latency, request count, and wasted empty polls in the [Real-Time Push Simulator](/componentes/realtime-push/simulator).

</Callout>

## Choosing

- **Notifications, feeds, dashboards** → SSE (one-way, simplest)
- **Chat, games, collaboration** → WebSockets (bidirectional)
- **Occasional, low-stakes updates** → polling (no infrastructure)

This complements [Polling vs Webhooks](/componentes/polling-webhooks), which covers server-to-server delivery.
$mdx$, $mdx$# WebSockets e Push em Tempo Real

Quando o **servidor** tem uma informação nova — uma mensagem de chat, uma cotação, uma notificação — como ela chega ao cliente? A resposta ingênua (ficar perguntando) desperdiça recursos e adiciona latência. O push em tempo real resolve isso.

## O espectro

<Cards cols={2}>

<Card title="Short polling" accent="amber">

O cliente refaz a requisição em um timer. Simplíssimo, funciona em todo lugar — mas adiciona latência (até um intervalo) e desperdiça requisições quando nada mudou.

</Card>

<Card title="Long polling" accent="amber">

A requisição fica aberta até haver dados. Menor latência que o short polling, mas ainda uma requisição por mensagem.

</Card>

<Card title="Server-Sent Events (SSE)" accent="green">

Uma conexão HTTP de longa duração pela qual o **servidor transmite** eventos ao cliente. Unidirecional, simples, com reconexão automática — ideal para feeds e notificações.

</Card>

<Card title="WebSockets" accent="brand">

Uma conexão TCP persistente e **full-duplex**. Os dois lados enviam a qualquer momento — a ferramenta certa para chat, jogos multiplayer e colaboração ao vivo.

</Card>

</Cards>

<Callout type="info" title="Conexões persistentes mudam o modelo de escala">

Polling é stateless e faz load balancing trivialmente. WebSockets/SSE mantêm **conexões stateful de longa duração**, então é preciso planejar limites de conexão, roteamento fixo e o fan-out de uma mensagem para milhares de sockets abertos (em geral via um backplane pub/sub como o Redis).

</Callout>

<Callout type="success" title="Experimente">

Compare polling, SSE e WebSockets e observe latência de entrega, número de requisições e polls vazios desperdiçados no [Simulador de Push em Tempo Real](/componentes/realtime-push/simulator).

</Callout>

## Escolhendo

- **Notificações, feeds, dashboards** → SSE (unidirecional, mais simples)
- **Chat, jogos, colaboração** → WebSockets (bidirecional)
- **Atualizações ocasionais e de baixo risco** → polling (sem infraestrutura)

Isso complementa [Polling vs Webhooks](/componentes/polling-webhooks), que cobre a entrega servidor-a-servidor.
$mdx$),
  ('components/dead-letter-queue', '/componentes/dead-letter-queue', 'components', 105, 'dead-letter-queue', true, 'Dead Letter Queues', 'Dead Letter Queues', $mdx$# Dead Letter Queues

In any message-driven system, some messages **cannot be processed** — a malformed payload, a bug, a downstream service that is down. A **Dead Letter Queue (DLQ)** is where those messages go so they stop blocking everyone else.

<Callout type="warning" title="The poison message problem">

Without a DLQ, a single un-processable ("poison") message at the head of a queue can be retried forever, stalling the whole consumer. The DLQ is the escape valve.

</Callout>

## The flow

<Cards cols={2}>

<Card title="Retry first" accent="brand">

Transient failures (timeouts, brief outages) should be **retried**, ideally with exponential backoff. Most failures are temporary.

</Card>

<Card title="Then dead-letter" accent="red">

After a configured **max retries**, the message is moved to the DLQ with its error context, and the consumer moves on.

</Card>

</Cards>

## What to do with the DLQ

- **Alert** on DLQ depth — a growing DLQ signals a real problem
- **Inspect** messages to find the root cause (bad data? bug? schema change?)
- **Replay** them back to the main queue once the issue is fixed
- **Discard** genuinely unprocessable messages after review

<Callout type="info" title="Tuning matters">

Too few retries dead-letters messages that would have succeeded on a second try. Too many retries waste capacity on poison messages and delay the DLQ. The right number depends on how transient your failures are.

</Callout>

<Callout type="success" title="Try it">

Tune the failure rate and retry limit and watch messages cycle through retries before landing in the DLQ in the [Dead Letter Queue Simulator](/componentes/dead-letter-queue/simulator).

</Callout>

Closely related: [Retries](/principios-design/tolerancia-falhas/retries) and [Message Queues](/componentes/message-queue).
$mdx$, $mdx$# Dead Letter Queues

Em qualquer sistema orientado a mensagens, algumas mensagens **não podem ser processadas** — um payload malformado, um bug, um serviço downstream fora do ar. Uma **Dead Letter Queue (DLQ)** é para onde essas mensagens vão para que parem de bloquear todas as outras.

<Callout type="warning" title="O problema da mensagem venenosa">

Sem uma DLQ, uma única mensagem não processável ("venenosa") no início da fila pode ser retentada para sempre, travando o consumidor inteiro. A DLQ é a válvula de escape.

</Callout>

## O fluxo

<Cards cols={2}>

<Card title="Retry primeiro" accent="brand">

Falhas transitórias (timeouts, quedas breves) devem ser **retentadas**, idealmente com backoff exponencial. A maioria das falhas é temporária.

</Card>

<Card title="Depois dead-letter" accent="red">

Após um **máximo de retries** configurado, a mensagem é movida para a DLQ com seu contexto de erro, e o consumidor segue em frente.

</Card>

</Cards>

## O que fazer com a DLQ

- **Alertar** sobre a profundidade da DLQ — uma DLQ crescendo sinaliza um problema real
- **Inspecionar** mensagens para achar a causa raiz (dado ruim? bug? mudança de schema?)
- **Reprocessar** de volta à fila principal quando o problema for corrigido
- **Descartar** mensagens genuinamente não processáveis após revisão

<Callout type="info" title="Ajustar importa">

Poucos retries enviam à DLQ mensagens que teriam sucesso numa segunda tentativa. Retries demais desperdiçam capacidade em mensagens venenosas e atrasam a DLQ. O número certo depende de quão transitórias são suas falhas.

</Callout>

<Callout type="success" title="Experimente">

Ajuste a taxa de falha e o limite de retries e veja mensagens passarem por retentativas antes de cair na DLQ no [Simulador de Dead Letter Queue](/componentes/dead-letter-queue/simulator).

</Callout>

Muito relacionado: [Retries](/principios-design/tolerancia-falhas/retries) e [Filas de Mensagens](/componentes/message-queue).
$mdx$),
  ('components/stream-processing', '/componentes/stream-processing', 'components', 106, NULL, true, 'Stream Processing', 'Processamento de Streams', $mdx$# Stream Processing

**Stream processing** runs continuous computation over unbounded streams of events, producing results within milliseconds to seconds — instead of waiting for a nightly batch job. It powers fraud detection, real-time analytics, recommendations, and monitoring.

<Cards cols={2}>

<Card title="Batch processing" accent="amber">

Process a bounded, finite dataset all at once (a day of logs). High throughput, high latency, simple.

</Card>

<Card title="Stream processing" accent="green">

Process events one at a time (or in micro-batches) as they arrive. Low latency, continuous, harder to reason about.

</Card>

</Cards>

## The hard parts

<Callout type="info" title="Time, windows, and lateness">

Streams never end, so you compute over **windows** (e.g. "clicks per minute"). But events arrive out of order and late. Systems distinguish **event time** (when it happened) from **processing time** (when it was seen), and use **watermarks** to decide when a window is complete.

</Callout>

- **Windowing**: tumbling, sliding, and session windows
- **State**: aggregations need fault-tolerant, checkpointed state
- **Exactly-once**: avoiding double-counting on failure (see [Delivery Semantics](/estrategias-de-consistencia/delivery-semantics))
- **Backpressure**: slowing producers when consumers fall behind (see [Backpressure](/principios-design/backpressure))

## The ecosystem

| Tool | Niche |
| --- | --- |
| Kafka Streams | Library on top of Kafka, simple deploys |
| Apache Flink | True streaming, rich windowing, large state |
| Spark Structured Streaming | Micro-batch, unified with batch |
| ksqlDB | SQL over Kafka topics |

Stream processing builds directly on [Kafka & Event Streaming](/componentes/kafka) — the log is the source of truth, and processors are consumers that emit new streams.
$mdx$, $mdx$# Processamento de Streams

O **processamento de streams** executa computação contínua sobre fluxos ilimitados de eventos, produzindo resultados em milissegundos a segundos — em vez de esperar um job em lote noturno. Ele alimenta detecção de fraude, analytics em tempo real, recomendações e monitoramento.

<Cards cols={2}>

<Card title="Processamento em lote" accent="amber">

Processa um conjunto de dados finito e limitado de uma vez (um dia de logs). Alta vazão, alta latência, simples.

</Card>

<Card title="Processamento de streams" accent="green">

Processa eventos um a um (ou em micro-lotes) conforme chegam. Baixa latência, contínuo, mais difícil de raciocinar.

</Card>

</Cards>

## As partes difíceis

<Callout type="info" title="Tempo, janelas e atraso">

Streams nunca terminam, então você computa sobre **janelas** (ex.: "cliques por minuto"). Mas eventos chegam fora de ordem e atrasados. Os sistemas distinguem **tempo do evento** (quando aconteceu) de **tempo de processamento** (quando foi visto), e usam **watermarks** para decidir quando uma janela está completa.

</Callout>

- **Janelamento**: janelas tumbling, sliding e de sessão
- **Estado**: agregações precisam de estado tolerante a falhas e com checkpoint
- **Exactly-once**: evitar contagem dupla em falhas (veja [Semânticas de Entrega](/estrategias-de-consistencia/delivery-semantics))
- **Backpressure**: frear produtores quando consumidores ficam para trás (veja [Backpressure](/principios-design/backpressure))

## O ecossistema

| Ferramenta | Nicho |
| --- | --- |
| Kafka Streams | Biblioteca sobre o Kafka, deploys simples |
| Apache Flink | Streaming verdadeiro, janelamento rico, estado grande |
| Spark Structured Streaming | Micro-lote, unificado com batch |
| ksqlDB | SQL sobre tópicos Kafka |

O processamento de streams se apoia diretamente em [Kafka e Streaming de Eventos](/componentes/kafka) — o log é a fonte da verdade, e os processadores são consumidores que emitem novos streams.
$mdx$)
ON CONFLICT ("slug") DO UPDATE SET
  "path" = EXCLUDED."path", "module_id" = EXCLUDED."module_id",
  "order_index" = EXCLUDED."order_index", "simulator_key" = EXCLUDED."simulator_key",
  "published" = EXCLUDED."published", "title_en" = EXCLUDED."title_en",
  "title_pt" = EXCLUDED."title_pt", "body_en" = EXCLUDED."body_en",
  "body_pt" = EXCLUDED."body_pt", "updated_at" = now();
