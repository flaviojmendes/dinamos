-- Incremental content: new Consistency Strategies lessons (idempotent upserts).

INSERT INTO "content_pages" ("slug", "path", "module_id", "order_index", "simulator_key", "published", "title_en", "title_pt", "body_en", "body_pt") VALUES
  ('consistency-strategies/crdts', '/estrategias-de-consistencia/crdts', 'consistency', 107, 'crdt', true, 'CRDTs (Conflict-Free Replicated Data Types)', 'CRDTs (Tipos de Dados Replicados Sem Conflito)', $mdx$# CRDTs (Conflict-Free Replicated Data Types)

A **CRDT** is a data structure that can be replicated across many nodes, updated independently and concurrently — even while offline — and then merged automatically, with a mathematical guarantee that **all replicas converge to the same state**, without coordination or conflict resolution.

<Callout type="info" title="Why this is remarkable">

Normally, concurrent edits on different replicas create conflicts (think Git merge conflicts). CRDTs are designed so that merging is **commutative, associative, and idempotent** — apply updates in any order, any number of times, and you always land on the same value.

</Callout>

## Two families

<Cards cols={2}>

<Card title="State-based (CvRDT)" accent="brand">

Replicas exchange their **full state** and merge with a join function (e.g. element-wise max). Robust to lost/duplicate messages.

</Card>

<Card title="Operation-based (CmRDT)" accent="purple">

Replicas broadcast **operations**. Requires reliable, exactly-once delivery, but sends much less data.

</Card>

</Cards>

## Common CRDTs

- **G-Counter** — grow-only counter; each node counts in its own slot, value = sum
- **PN-Counter** — two G-Counters (increments + decrements)
- **G-Set / OR-Set** — add-only and add/remove sets
- **LWW-Register** — last-writer-wins value, ordered by timestamp
- **Sequence CRDTs** — collaborative text (the magic behind Figma, Google Docs-style editors, Yjs, Automerge)

<Callout type="success" title="Try it">

Increment counters on three replicas independently, then merge and watch them converge to the same total in the [CRDT Simulator](/estrategias-de-consistencia/crdts/simulator).

</Callout>

## Trade-offs

CRDTs give you **availability and partition tolerance** with strong eventual consistency — no coordinator, no locks. The cost is metadata overhead and the fact that they only support operations whose conflicts can be resolved mathematically. For arbitrary invariants (e.g. "balance must stay positive"), you still need [consensus](/estrategias-de-consistencia/consenso).
$mdx$, $mdx$# CRDTs (Tipos de Dados Replicados Sem Conflito)

Um **CRDT** é uma estrutura de dados que pode ser replicada em muitos nós, atualizada de forma independente e concorrente — mesmo offline — e depois mesclada automaticamente, com a garantia matemática de que **todas as réplicas convergem para o mesmo estado**, sem coordenação nem resolução de conflitos.

<Callout type="info" title="Por que isso é notável">

Normalmente, edições concorrentes em réplicas diferentes criam conflitos (pense em conflitos de merge do Git). CRDTs são projetados para que o merge seja **comutativo, associativo e idempotente** — aplique atualizações em qualquer ordem, qualquer número de vezes, e você sempre chega ao mesmo valor.

</Callout>

## Duas famílias

<Cards cols={2}>

<Card title="Baseado em estado (CvRDT)" accent="brand">

As réplicas trocam seu **estado completo** e mesclam com uma função de join (ex.: máximo elemento a elemento). Robusto a mensagens perdidas/duplicadas.

</Card>

<Card title="Baseado em operação (CmRDT)" accent="purple">

As réplicas transmitem **operações**. Exige entrega confiável e exactly-once, mas envia muito menos dados.

</Card>

</Cards>

## CRDTs comuns

- **G-Counter** — contador só de incremento; cada nó conta no seu slot, valor = soma
- **PN-Counter** — dois G-Counters (incrementos + decrementos)
- **G-Set / OR-Set** — conjuntos só de adição e de adição/remoção
- **LWW-Register** — valor last-writer-wins, ordenado por timestamp
- **CRDTs de sequência** — texto colaborativo (a mágica por trás de editores estilo Figma, Google Docs, Yjs, Automerge)

<Callout type="success" title="Experimente">

Incremente contadores em três réplicas de forma independente, depois mescle e veja-as convergir para o mesmo total no [Simulador de CRDT](/estrategias-de-consistencia/crdts/simulator).

</Callout>

## Trade-offs

CRDTs dão **disponibilidade e tolerância a partição** com consistência eventual forte — sem coordenador, sem locks. O custo é o overhead de metadados e o fato de só suportarem operações cujos conflitos podem ser resolvidos matematicamente. Para invariantes arbitrárias (ex.: "o saldo deve ficar positivo"), você ainda precisa de [consenso](/estrategias-de-consistencia/consenso).
$mdx$),
  ('consistency-strategies/gossip', '/estrategias-de-consistencia/gossip', 'consistency', 108, 'gossip', true, 'Gossip & Anti-Entropy Protocols', 'Protocolos de Gossip e Anti-Entropia', $mdx$# Gossip & Anti-Entropy Protocols

How do thousands of nodes agree on cluster membership, failure detection, or shared state — without a central coordinator? **Gossip protocols** borrow from how rumors (and epidemics) spread: each node periodically picks a few random peers and exchanges information. In a few rounds, everybody knows.

<Callout type="info" title="Why epidemic spread is powerful">

If each informed node tells just a handful of random peers each round, the number of informed nodes grows **exponentially**. A cluster of N nodes converges in roughly **log(N)** rounds — 1000 nodes in about 10 rounds.

</Callout>

## Properties

<Cards cols={2}>

<Card title="Decentralized & robust" accent="green">

No leader, no single point of failure. Nodes can join, leave, or die and the protocol keeps working.

</Card>

<Card title="Scalable & eventually consistent" accent="brand">

Each node talks to only a few peers per round, so load stays constant as the cluster grows — at the cost of eventual (not instant) convergence.

</Card>

</Cards>

## Anti-entropy

**Anti-entropy** is the repair side of gossip: replicas periodically compare their data (often via compact **Merkle trees**) and exchange only the differences to heal divergence. Combined with **read repair** and **hinted handoff**, it is how Dynamo-style databases (Cassandra, Riak) stay eventually consistent.

<Callout type="success" title="Try it">

Seed a rumor on one node, tune the fanout, and watch it spread across the cluster round by round in the [Gossip Simulator](/estrategias-de-consistencia/gossip/simulator).

</Callout>

## Where it is used

- **Membership & failure detection**: Cassandra, Consul, Serf (SWIM protocol)
- **Configuration propagation** across large fleets
- **Database anti-entropy**: repairing replicas in the background

Gossip is the counterpoint to [consensus](/estrategias-de-consistencia/consenso): consensus gives strong agreement for a small group; gossip gives scalable, eventual agreement for huge ones.
$mdx$, $mdx$# Protocolos de Gossip e Anti-Entropia

Como milhares de nós concordam sobre membership do cluster, detecção de falhas ou estado compartilhado — sem um coordenador central? **Protocolos de gossip** se inspiram em como rumores (e epidemias) se espalham: cada nó periodicamente escolhe alguns peers aleatórios e troca informação. Em poucas rodadas, todos sabem.

<Callout type="info" title="Por que o espalhamento epidêmico é poderoso">

Se cada nó informado avisa apenas um punhado de peers aleatórios por rodada, o número de nós informados cresce **exponencialmente**. Um cluster de N nós converge em cerca de **log(N)** rodadas — 1000 nós em aproximadamente 10 rodadas.

</Callout>

## Propriedades

<Cards cols={2}>

<Card title="Descentralizado e robusto" accent="green">

Sem líder, sem ponto único de falha. Nós podem entrar, sair ou morrer e o protocolo continua funcionando.

</Card>

<Card title="Escalável e eventualmente consistente" accent="brand">

Cada nó fala com poucos peers por rodada, então a carga permanece constante conforme o cluster cresce — ao custo de convergência eventual (não instantânea).

</Card>

</Cards>

## Anti-entropia

A **anti-entropia** é o lado de reparo do gossip: as réplicas periodicamente comparam seus dados (em geral via **árvores de Merkle** compactas) e trocam apenas as diferenças para curar a divergência. Combinada com **read repair** e **hinted handoff**, é como bancos estilo Dynamo (Cassandra, Riak) se mantêm eventualmente consistentes.

<Callout type="success" title="Experimente">

Semeie um rumor em um nó, ajuste o fanout e veja-o se espalhar pelo cluster rodada a rodada no [Simulador de Gossip](/estrategias-de-consistencia/gossip/simulator).

</Callout>

## Onde é usado

- **Membership e detecção de falhas**: Cassandra, Consul, Serf (protocolo SWIM)
- **Propagação de configuração** por frotas grandes
- **Anti-entropia de banco**: reparando réplicas em segundo plano

O gossip é o contraponto ao [consenso](/estrategias-de-consistencia/consenso): consenso dá acordo forte para um grupo pequeno; gossip dá acordo escalável e eventual para grupos enormes.
$mdx$),
  ('consistency-strategies/distributed-locks', '/estrategias-de-consistencia/distributed-locks', 'consistency', 109, 'distributed-lock', true, 'Distributed Locks, Leases & Fencing Tokens', 'Locks Distribuídos, Leases e Fencing Tokens', $mdx$# Distributed Locks, Leases & Fencing Tokens

Sometimes only one node should do a thing at a time — process a job, write to a file, run a migration. A **distributed lock** provides this mutual exclusion across machines. Getting it right is famously tricky.

<Callout type="warning" title="A lock is never truly held forever">

A node can crash, pause for a long GC, or get partitioned **while holding the lock**. So distributed locks use a **lease**: the lock auto-expires after a timeout, letting others make progress. But this creates a dangerous window.

</Callout>

## The stale-holder problem

<Cards cols={2}>

<Card title="The hazard" accent="red">

Client A acquires the lock, then pauses (GC). Its lease expires; Client B acquires the lock. Then A wakes up — still believing it holds the lock — and writes. Now **two writers** corrupt the resource.

</Card>

<Card title="The fix: fencing tokens" accent="green">

Every lock grant includes a monotonically increasing **fencing token**. The protected resource remembers the highest token it has seen and **rejects any write with a lower token**. A's stale write is fenced off.

</Card>

</Cards>

<Callout type="success" title="Try it">

Acquire the lock, stall the holder until its lease expires, let another client take it, then have the stalled client try to write — and watch the fencing token reject it in the [Distributed Lock Simulator](/estrategias-de-consistencia/distributed-locks/simulator).

</Callout>

## How locks are implemented

- **Single-node**: a key in Redis with a TTL (`SET key val NX PX`) — simple, but not safe under failover alone
- **Redlock**: Redis's multi-node algorithm (debated for correctness)
- **Consensus-backed**: ZooKeeper ephemeral nodes, etcd leases, Chubby — safe but heavier

<Callout type="info" title="Prefer to avoid locks">

Distributed locks are subtle. Where possible, design with **idempotency**, [CRDTs](/estrategias-de-consistencia/crdts), or [consensus](/estrategias-de-consistencia/consenso)-backed leader election instead. When you do need a lock, always use fencing tokens.

</Callout>
$mdx$, $mdx$# Locks Distribuídos, Leases e Fencing Tokens

Às vezes só um nó deve fazer algo por vez — processar um job, escrever em um arquivo, rodar uma migration. Um **lock distribuído** fornece essa exclusão mútua entre máquinas. Acertar isso é notoriamente difícil.

<Callout type="warning" title="Um lock nunca é realmente eterno">

Um nó pode falhar, pausar por um GC longo ou ser particionado **enquanto segura o lock**. Por isso locks distribuídos usam um **lease**: o lock expira automaticamente após um timeout, deixando outros progredirem. Mas isso cria uma janela perigosa.

</Callout>

## O problema do dono obsoleto

<Cards cols={2}>

<Card title="O risco" accent="red">

O Cliente A adquire o lock, depois pausa (GC). Seu lease expira; o Cliente B adquire o lock. Então A acorda — ainda acreditando que segura o lock — e escreve. Agora **dois escritores** corrompem o recurso.

</Card>

<Card title="A solução: fencing tokens" accent="green">

Cada concessão de lock inclui um **fencing token** monotonicamente crescente. O recurso protegido lembra o maior token que viu e **rejeita qualquer escrita com token menor**. A escrita obsoleta de A é bloqueada.

</Card>

</Cards>

<Callout type="success" title="Experimente">

Adquira o lock, trave o dono até o lease expirar, deixe outro cliente pegá-lo e então faça o cliente travado tentar escrever — e veja o fencing token rejeitá-la no [Simulador de Lock Distribuído](/estrategias-de-consistencia/distributed-locks/simulator).

</Callout>

## Como locks são implementados

- **Nó único**: uma chave no Redis com TTL (`SET key val NX PX`) — simples, mas não seguro só sob failover
- **Redlock**: o algoritmo multi-nó do Redis (correção é debatida)
- **Apoiado em consenso**: nós efêmeros do ZooKeeper, leases do etcd, Chubby — seguro, porém mais pesado

<Callout type="info" title="Prefira evitar locks">

Locks distribuídos são sutis. Quando possível, projete com **idempotência**, [CRDTs](/estrategias-de-consistencia/crdts) ou eleição de líder apoiada em [consenso](/estrategias-de-consistencia/consenso). Quando precisar de um lock, sempre use fencing tokens.

</Callout>
$mdx$)
ON CONFLICT ("slug") DO UPDATE SET
  "path" = EXCLUDED."path", "module_id" = EXCLUDED."module_id",
  "order_index" = EXCLUDED."order_index", "simulator_key" = EXCLUDED."simulator_key",
  "published" = EXCLUDED."published", "title_en" = EXCLUDED."title_en",
  "title_pt" = EXCLUDED."title_pt", "body_en" = EXCLUDED."body_en",
  "body_pt" = EXCLUDED."body_pt", "updated_at" = now();
