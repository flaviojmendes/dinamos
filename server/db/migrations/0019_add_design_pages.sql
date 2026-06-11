-- Incremental content: new Design Principles lessons (idempotent upserts).

INSERT INTO "content_pages" ("slug", "path", "module_id", "order_index", "simulator_key", "published", "title_en", "title_pt", "body_en", "body_pt") VALUES
  ('design-principles/event-sourcing', '/principios-design/event-sourcing', 'design', 110, 'event-sourcing', true, 'Event Sourcing', 'Event Sourcing', $mdx$# Event Sourcing

Instead of storing the **current state** of an entity and overwriting it on every change, **Event Sourcing** stores the full, ordered, immutable log of **events** that happened. The current state is derived by replaying those events.

<Callout type="info" title="The mental shift">

A normal database row says "the order total is $90". An event-sourced system says "order created, item added ($50), item added ($40), discount applied (-$0)". The total is a *computation* over the log, not a stored value.

</Callout>

## Why do this?

<Cards cols={2}>

<Card title="Complete audit trail" accent="brand">

Every change is a first-class, immutable fact. You can answer "what was the state last Tuesday?" by replaying up to that point.

</Card>

<Card title="Temporal queries & replay" accent="green">

Rebuild any past state, debug by replay, and build entirely new read models retroactively from the same history.

</Card>

</Cards>

## Key concepts

- **Event store**: append-only log, the source of truth
- **Projections**: read models built by folding events (pairs naturally with [CQRS](/principios-design/cqrs))
- **Snapshots**: periodic state captures so you don't replay millions of events every time
- **Replay**: rebuild a projection from scratch by re-reading the log

<Callout type="warning" title="Costs">

Event sourcing adds real complexity: eventual consistency between the log and projections, schema/versioning of old events, and the need for snapshots. Use it where the audit trail and temporal queries genuinely pay for that complexity (finance, ordering, ledgers).

</Callout>

<Callout type="success" title="Try it">

Append events to an order and watch the current state rebuild from the log in the [Event Sourcing Simulator](/principios-design/event-sourcing/simulator).

</Callout>
$mdx$, $mdx$# Event Sourcing

Em vez de armazenar o **estado atual** de uma entidade e sobrescrevê-lo a cada mudança, o **Event Sourcing** armazena o log completo, ordenado e imutável dos **eventos** que aconteceram. O estado atual é derivado ao reproduzir esses eventos.

<Callout type="info" title="A mudança de mentalidade">

Um banco normal diz "o total do pedido é $90". Um sistema com event sourcing diz "pedido criado, item adicionado ($50), item adicionado ($40), desconto aplicado (-$0)". O total é um *cálculo* sobre o log, não um valor armazenado.

</Callout>

## Por que fazer isso?

<Cards cols={2}>

<Card title="Trilha de auditoria completa" accent="brand">

Cada mudança é um fato imutável de primeira classe. Você pode responder "qual era o estado na última terça?" reproduzindo até aquele ponto.

</Card>

<Card title="Consultas temporais e replay" accent="green">

Reconstrua qualquer estado passado, depure por replay e crie read models totalmente novos retroativamente a partir do mesmo histórico.

</Card>

</Cards>

## Conceitos-chave

- **Event store**: log somente-anexação, a fonte da verdade
- **Projeções**: read models construídos ao dobrar eventos (combina naturalmente com [CQRS](/principios-design/cqrs))
- **Snapshots**: capturas periódicas de estado para não reproduzir milhões de eventos toda vez
- **Replay**: reconstruir uma projeção do zero relendo o log

<Callout type="warning" title="Custos">

Event sourcing adiciona complexidade real: consistência eventual entre o log e as projeções, schema/versionamento de eventos antigos e a necessidade de snapshots. Use onde a trilha de auditoria e consultas temporais realmente pagam por essa complexidade (finanças, pedidos, ledgers).

</Callout>

<Callout type="success" title="Experimente">

Anexe eventos a um pedido e veja o estado atual ser reconstruído a partir do log no [Simulador de Event Sourcing](/principios-design/event-sourcing/simulator).

</Callout>
$mdx$),
  ('design-principles/outbox', '/principios-design/outbox', 'design', 111, 'outbox', true, 'Transactional Outbox', 'Transactional Outbox', $mdx$# Transactional Outbox

You just saved an order to your database. Now you need to publish an `OrderCreated` event so other services react. If you write to the DB **and** publish to the broker as two separate steps, you have a **dual-write problem**: either can fail independently, leaving your data and your events out of sync.

<Callout type="warning" title="The dual-write trap">

Commit succeeds, publish fails → the event is lost, downstream never hears about the order. Or publish succeeds, commit rolls back → you announced an order that does not exist. There is no atomic transaction spanning a database and a message broker.

</Callout>

## The pattern

<Cards cols={2}>

<Card title="1. Write atomically" accent="brand">

In a single local transaction, write the business data **and** insert the event into an `outbox` table. Either both commit or neither does.

</Card>

<Card title="2. Relay asynchronously" accent="green">

A separate relay process (or [CDC](/dados-armazenamento/cdc)) reads unpublished outbox rows and publishes them to the broker, retrying until success, then marks them done.

</Card>

</Cards>

<Callout type="info" title="At-least-once, so make consumers idempotent">

The relay may publish a row, crash before marking it done, and publish it again. So events are delivered **at-least-once** — consumers must deduplicate (see [Delivery Semantics](/estrategias-de-consistencia/delivery-semantics)).

</Callout>

<Callout type="success" title="Try it">

Compare a naive dual-write against the outbox pattern under a flaky broker, and watch events get lost in one but not the other in the [Outbox Simulator](/principios-design/outbox/simulator).

</Callout>

The outbox is the reliable companion to [Event-Driven](/principios-design/eventos) and [Saga](/estrategias-de-consistencia/saga) architectures.
$mdx$, $mdx$# Transactional Outbox

Você acabou de salvar um pedido no banco. Agora precisa publicar um evento `OrderCreated` para outros serviços reagirem. Se você escreve no banco **e** publica no broker como dois passos separados, surge o **problema da escrita dupla**: qualquer um pode falhar de forma independente, deixando seus dados e seus eventos fora de sincronia.

<Callout type="warning" title="A armadilha da escrita dupla">

O commit tem sucesso, a publicação falha → o evento se perde, o downstream nunca fica sabendo do pedido. Ou a publicação tem sucesso, o commit faz rollback → você anunciou um pedido que não existe. Não há transação atômica entre um banco e um broker de mensagens.

</Callout>

## O padrão

<Cards cols={2}>

<Card title="1. Escreva atomicamente" accent="brand">

Em uma única transação local, escreva os dados de negócio **e** insira o evento numa tabela `outbox`. Ou os dois fazem commit, ou nenhum.

</Card>

<Card title="2. Faça relay de forma assíncrona" accent="green">

Um processo relay separado (ou [CDC](/dados-armazenamento/cdc)) lê as linhas não publicadas do outbox e as publica no broker, retentando até ter sucesso, e então as marca como concluídas.

</Card>

</Cards>

<Callout type="info" title="At-least-once, então torne os consumidores idempotentes">

O relay pode publicar uma linha, falhar antes de marcá-la como concluída, e publicá-la de novo. Então eventos são entregues **at-least-once** — consumidores precisam deduplicar (veja [Semânticas de Entrega](/estrategias-de-consistencia/delivery-semantics)).

</Callout>

<Callout type="success" title="Experimente">

Compare uma escrita dupla ingênua com o padrão outbox sob um broker instável, e veja eventos se perderem em um mas não no outro no [Simulador de Outbox](/principios-design/outbox/simulator).

</Callout>

O outbox é o companheiro confiável de arquiteturas [Orientadas a Eventos](/principios-design/eventos) e [Saga](/estrategias-de-consistencia/saga).
$mdx$),
  ('design-principles/bulkhead', '/principios-design/bulkhead', 'design', 112, 'bulkhead', true, 'The Bulkhead Pattern', 'O Padrão Bulkhead', $mdx$# The Bulkhead Pattern

The name comes from shipbuilding: a hull is divided into sealed **bulkhead** compartments, so a breach in one does not flood the whole ship. In software, bulkheads **isolate resource pools** so a failure in one part cannot exhaust the resources every part shares.

<Callout type="warning" title="The failure it prevents">

Service A and Service B are both called from one shared thread pool of 10 workers. B's dependency gets slow, and its calls hang — soon all 10 workers are stuck waiting on B. Now A's healthy calls have no workers either. One slow dependency took down the entire service.

</Callout>

## How bulkheads help

<Cards cols={2}>

<Card title="Without bulkheads" accent="red">

A shared pool means one slow dependency can consume every connection/thread, cascading the failure to unrelated, healthy traffic.

</Card>

<Card title="With bulkheads" accent="green">

Each dependency gets its own bounded pool. When B saturates its pool, B's calls are rejected fast — but A's pool is untouched and keeps serving.

</Card>

</Cards>

## Forms of bulkheading

- **Thread/connection pools** per dependency
- **Separate process or container** per workload
- **Separate clusters** for critical vs best-effort traffic
- **Concurrency limits** per caller or tenant

<Callout type="info" title="Pairs with other resilience patterns">

Bulkheads contain the blast radius; [circuit breakers](/principios-design/tolerancia-falhas/circuit-breaker) stop hammering a failing dependency; [timeouts](/principios-design/tolerancia-falhas/timeout) free stuck workers quickly. Together they keep failures local.

</Callout>

<Callout type="success" title="Try it">

Make dependency B slow and compare a shared pool against isolated bulkheads — watch B's failure either sink A or stay contained in the [Bulkhead Simulator](/principios-design/bulkhead/simulator).

</Callout>
$mdx$, $mdx$# O Padrão Bulkhead

O nome vem da construção naval: o casco é dividido em compartimentos **bulkhead** selados, para que uma brecha em um não inunde o navio inteiro. No software, bulkheads **isolam pools de recursos** para que uma falha em uma parte não esgote os recursos que todas as partes compartilham.

<Callout type="warning" title="A falha que ele previne">

O Serviço A e o Serviço B são chamados a partir de um pool compartilhado de 10 workers. A dependência de B fica lenta e suas chamadas travam — logo todos os 10 workers estão presos esperando por B. Agora as chamadas saudáveis de A também não têm workers. Uma dependência lenta derrubou o serviço inteiro.

</Callout>

## Como bulkheads ajudam

<Cards cols={2}>

<Card title="Sem bulkheads" accent="red">

Um pool compartilhado significa que uma dependência lenta pode consumir toda conexão/thread, propagando a falha para tráfego saudável e não relacionado.

</Card>

<Card title="Com bulkheads" accent="green">

Cada dependência recebe seu próprio pool limitado. Quando B satura seu pool, as chamadas de B são rejeitadas rápido — mas o pool de A fica intacto e continua atendendo.

</Card>

</Cards>

## Formas de bulkheading

- **Pools de thread/conexão** por dependência
- **Processo ou container separado** por carga de trabalho
- **Clusters separados** para tráfego crítico vs best-effort
- **Limites de concorrência** por chamador ou tenant

<Callout type="info" title="Combina com outros padrões de resiliência">

Bulkheads contêm o raio de explosão; [circuit breakers](/principios-design/tolerancia-falhas/circuit-breaker) param de martelar uma dependência com falha; [timeouts](/principios-design/tolerancia-falhas/timeout) liberam workers presos rapidamente. Juntos, mantêm as falhas locais.

</Callout>

<Callout type="success" title="Experimente">

Deixe a dependência B lenta e compare um pool compartilhado com bulkheads isolados — veja a falha de B afundar A ou ficar contida no [Simulador de Bulkhead](/principios-design/bulkhead/simulator).

</Callout>
$mdx$),
  ('design-principles/blue-green', '/principios-design/blue-green', 'design', 113, 'canary-deployment', true, 'Blue-Green Deployment', 'Deploy Blue-Green', $mdx$# Blue-Green Deployment

**Blue-Green** is a release strategy that keeps **two identical production environments**. Only one serves live traffic at a time. You deploy the new version to the idle environment, test it, then switch all traffic over in one step.

<Cards cols={2}>

<Card title="Blue (live)" accent="brand">

The current version, serving 100% of production traffic right now.

</Card>

<Card title="Green (idle)" accent="green">

The new version, fully deployed and warmed up, receiving no real traffic yet.

</Card>

</Cards>

## The flow

1. Deploy the new release to **Green** while **Blue** keeps serving
2. Smoke-test Green with internal/synthetic traffic
3. Flip the router/load balancer so **Green** is now live
4. Keep **Blue** idle for fast **rollback** — just flip back

<Callout type="info" title="Blue-green vs canary">

Blue-green is an **instant, all-at-once** switch with trivial rollback. [Canary](/principios-design/canary-deployment) is a **gradual** shift (1% → 10% → 100%) that limits blast radius but takes longer. Many teams combine them: canary inside the green environment before the full cutover.

</Callout>

<Callout type="warning" title="The hard parts">

Database schema changes must be **backward compatible** (both versions may run during the switch), stateful sessions need care, and you pay for double the infrastructure during the overlap.

</Callout>

<Callout type="success" title="Try it">

Shift traffic between versions and trigger an instant rollback in the [deployment simulator](/principios-design/blue-green/simulator).

</Callout>
$mdx$, $mdx$# Deploy Blue-Green

**Blue-Green** é uma estratégia de release que mantém **dois ambientes de produção idênticos**. Apenas um atende tráfego real por vez. Você implanta a nova versão no ambiente ocioso, testa, e então redireciona todo o tráfego em um único passo.

<Cards cols={2}>

<Card title="Blue (ao vivo)" accent="brand">

A versão atual, atendendo 100% do tráfego de produção agora.

</Card>

<Card title="Green (ocioso)" accent="green">

A nova versão, totalmente implantada e aquecida, ainda sem tráfego real.

</Card>

</Cards>

## O fluxo

1. Implante o novo release no **Green** enquanto o **Blue** continua atendendo
2. Faça smoke tests no Green com tráfego interno/sintético
3. Vire o roteador/load balancer para que o **Green** fique ao vivo
4. Mantenha o **Blue** ocioso para **rollback** rápido — basta voltar a chave

<Callout type="info" title="Blue-green vs canary">

Blue-green é uma troca **instantânea e de uma vez** com rollback trivial. [Canary](/principios-design/canary-deployment) é uma mudança **gradual** (1% → 10% → 100%) que limita o raio de explosão, mas demora mais. Muitos times combinam os dois: canary dentro do ambiente green antes do corte total.

</Callout>

<Callout type="warning" title="As partes difíceis">

Mudanças de schema do banco precisam ser **retrocompatíveis** (ambas as versões podem rodar durante a troca), sessões com estado exigem cuidado, e você paga pelo dobro de infraestrutura durante a sobreposição.

</Callout>

<Callout type="success" title="Experimente">

Mude o tráfego entre versões e dispare um rollback instantâneo no [simulador de deploy](/principios-design/blue-green/simulator).

</Callout>
$mdx$),
  ('design-principles/feature-flags', '/principios-design/feature-flags', 'design', 114, NULL, true, 'Feature Flags', 'Feature Flags', $mdx$# Feature Flags

A **feature flag** (or toggle) is a runtime switch that turns functionality on or off **without deploying new code**. This decouples **deploy** (shipping code to servers) from **release** (exposing a feature to users) — two things that are usually fused together.

<Callout type="info" title="Deploy ≠ release">

With flags, you can deploy unfinished code behind an off flag, ship continuously, and flip the feature on later — for everyone, or just 1% of users, or just your internal team.

</Callout>

## What flags enable

<Cards cols={2}>

<Card title="Progressive delivery" accent="brand">

Roll a feature out to 1% → 10% → 100%, or to specific segments, and watch metrics before going wide. A close cousin of [canary](/principios-design/canary-deployment).

</Card>

<Card title="Instant kill switch" accent="red">

If a feature misbehaves in production, turn it off in seconds — no rollback, no redeploy.

</Card>

<Card title="Experimentation" accent="purple">

A/B test variants by flagging different cohorts and comparing outcomes.

</Card>

<Card title="Trunk-based development" accent="green">

Merge to main continuously behind flags instead of long-lived branches.

</Card>

</Cards>

## Types of flags

- **Release flags** — short-lived, hide in-progress work
- **Ops flags** — kill switches, load-shedding toggles
- **Permission flags** — gate features by plan/role
- **Experiment flags** — A/B tests

<Callout type="warning" title="Flag debt is real">

Every flag is a branch in your code. Stale flags accumulate into a combinatorial mess of untested paths. Treat flag removal as part of the work: when a release flag is fully rolled out, delete it.

</Callout>

Tools like LaunchDarkly, Unleash, and Flagsmith manage flags, targeting, and rollout percentages centrally.
$mdx$, $mdx$# Feature Flags

Uma **feature flag** (ou toggle) é uma chave em runtime que liga ou desliga uma funcionalidade **sem implantar código novo**. Isso desacopla o **deploy** (enviar código aos servidores) do **release** (expor uma feature aos usuários) — duas coisas que normalmente vêm fundidas.

<Callout type="info" title="Deploy ≠ release">

Com flags, você pode implantar código inacabado atrás de uma flag desligada, fazer deploy continuamente e ligar a feature depois — para todos, ou só 1% dos usuários, ou só seu time interno.

</Callout>

## O que as flags habilitam

<Cards cols={2}>

<Card title="Entrega progressiva" accent="brand">

Libere uma feature para 1% → 10% → 100%, ou para segmentos específicos, e acompanhe métricas antes de abrir para todos. Prima-irmã do [canary](/principios-design/canary-deployment).

</Card>

<Card title="Kill switch instantâneo" accent="red">

Se uma feature se comporta mal em produção, desligue-a em segundos — sem rollback, sem redeploy.

</Card>

<Card title="Experimentação" accent="purple">

Faça testes A/B de variantes marcando coortes diferentes e comparando resultados.

</Card>

<Card title="Desenvolvimento trunk-based" accent="green">

Faça merge para a main continuamente atrás de flags em vez de branches de longa duração.

</Card>

</Cards>

## Tipos de flags

- **Release flags** — curta duração, escondem trabalho em andamento
- **Ops flags** — kill switches, toggles de load-shedding
- **Permission flags** — liberam features por plano/role
- **Experiment flags** — testes A/B

<Callout type="warning" title="Dívida de flags é real">

Cada flag é um branch no seu código. Flags obsoletas se acumulam em uma bagunça combinatória de caminhos não testados. Trate a remoção de flags como parte do trabalho: quando uma release flag estiver 100% liberada, apague-a.

</Callout>

Ferramentas como LaunchDarkly, Unleash e Flagsmith gerenciam flags, segmentação e percentuais de rollout de forma centralizada.
$mdx$)
ON CONFLICT ("slug") DO UPDATE SET
  "path" = EXCLUDED."path", "module_id" = EXCLUDED."module_id",
  "order_index" = EXCLUDED."order_index", "simulator_key" = EXCLUDED."simulator_key",
  "published" = EXCLUDED."published", "title_en" = EXCLUDED."title_en",
  "title_pt" = EXCLUDED."title_pt", "body_en" = EXCLUDED."body_en",
  "body_pt" = EXCLUDED."body_pt", "updated_at" = now();
