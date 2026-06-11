-- Incremental content: new Theoretical Foundations lessons (idempotent upserts).

INSERT INTO "content_pages" ("slug", "path", "module_id", "order_index", "simulator_key", "published", "title_en", "title_pt", "body_en", "body_pt") VALUES
  ('theoretical-foundations/pacelc', '/theoretical-foundations/pacelc', 'theory', 8, 'pacelc', true, 'The PACELC Theorem', 'O Teorema PACELC', $mdx$# The PACELC Theorem

The [CAP theorem](/theoretical-foundations/cap-theorem) only tells you what happens **during a network partition**. But partitions are rare. What governs your system the other 99.9% of the time? **PACELC** (2010, Daniel Abadi) completes the picture.

<Callout type="info" title="Read it as a sentence">

**P**artition → **A**vailability or **C**onsistency, **E**lse (no partition) → **L**atency or **C**onsistency.

If there **is** a partition (P), trade between **A** and **C** (this is plain CAP). **Else** (E), when the network is healthy, you *still* trade between **L** (latency) and **C** (consistency).

</Callout>

## Why "else" matters

Even with no partition, keeping replicas strongly consistent requires coordination (quorums, two-phase commit, consensus) — and coordination costs **latency**. So every replicated system makes a steady-state choice: answer fast from one replica (more latency-friendly, weaker consistency), or coordinate first (slower, strongly consistent).

## Classifying real systems

<Cards cols={2}>

<Card title="PA/EL" accent="amber">

Available under partition, low-latency otherwise. **DynamoDB, Cassandra, Riak.** Tunable, but default toward availability and speed.

</Card>

<Card title="PC/EC" accent="brand">

Consistent under partition, consistent otherwise. **MongoDB (default), HBase, BigTable, VoltDB.** Pay latency for strong guarantees.

</Card>

<Card title="PA/EC" accent="purple">

Available during partitions, but consistent in normal operation. A rarer, asymmetric choice.

</Card>

<Card title="PC/EL" accent="green">

Consistent under partition, but latency-optimized otherwise — e.g. **PNUTS**.

</Card>

</Cards>

<Callout type="success" title="Try it">

Walk both branches of the decision tree and classify real databases in the [PACELC Simulator](/theoretical-foundations/pacelc/simulator).

</Callout>
$mdx$, $mdx$# O Teorema PACELC

O [teorema CAP](/theoretical-foundations/cap-theorem) só te diz o que acontece **durante uma partição de rede**. Mas partições são raras. O que governa seu sistema nos outros 99,9% do tempo? O **PACELC** (2010, Daniel Abadi) completa o quadro.

<Callout type="info" title="Leia como uma frase">

**P**artição → **A**vailability ou **C**onsistency, **E**lse (sem partição) → **L**atency ou **C**onsistency.

Se **há** uma partição (P), troque entre **A** e **C** (isso é o CAP puro). **Senão** (E), quando a rede está saudável, você *ainda* troca entre **L** (latência) e **C** (consistência).

</Callout>

## Por que o "senão" importa

Mesmo sem partição, manter réplicas fortemente consistentes exige coordenação (quóruns, two-phase commit, consenso) — e coordenação custa **latência**. Então todo sistema replicado faz uma escolha de regime permanente: responder rápido de uma réplica (mais amigável à latência, consistência mais fraca), ou coordenar primeiro (mais lento, fortemente consistente).

## Classificando sistemas reais

<Cards cols={2}>

<Card title="PA/EL" accent="amber">

Disponível sob partição, baixa latência caso contrário. **DynamoDB, Cassandra, Riak.** Ajustáveis, mas com padrão voltado a disponibilidade e velocidade.

</Card>

<Card title="PC/EC" accent="brand">

Consistente sob partição, consistente caso contrário. **MongoDB (padrão), HBase, BigTable, VoltDB.** Pagam latência por garantias fortes.

</Card>

<Card title="PA/EC" accent="purple">

Disponível durante partições, mas consistente em operação normal. Uma escolha assimétrica mais rara.

</Card>

<Card title="PC/EL" accent="green">

Consistente sob partição, mas otimizado para latência caso contrário — ex: **PNUTS**.

</Card>

</Cards>

<Callout type="success" title="Experimente">

Percorra os dois ramos da árvore de decisão e classifique bancos reais no [Simulador PACELC](/theoretical-foundations/pacelc/simulator).

</Callout>
$mdx$),
  ('theoretical-foundations/flp-impossibility', '/theoretical-foundations/flp-impossibility', 'theory', 9, NULL, true, 'The FLP Impossibility', 'A Impossibilidade FLP', $mdx$# The FLP Impossibility Result

In 1985, Fischer, Lynch, and Paterson proved one of the most important — and humbling — results in distributed computing:

<Callout type="warning" title="The result">

In an **asynchronous** system where even **one** process may fail (crash), there is **no deterministic algorithm** that is guaranteed to reach **consensus** in bounded time.

</Callout>

## Why it's surprising

Consensus seems simple: a group of nodes must all agree on a single value (e.g. "is the transaction committed?"). FLP says that with no timing assumptions, you cannot build an algorithm that is simultaneously:

- **Safe** — never decides two different values
- **Live** — always eventually decides

…and tolerates even a single crash. The killer is the **asynchronous** assumption: you cannot distinguish a *crashed* node from a *very slow* one, because messages have no time bound.

## This is not a death sentence

Real systems reach consensus every day (Raft, Paxos, Zab). They escape FLP by **relaxing assumptions**:

<Cards cols={2}>

<Card title="Partial synchrony" accent="brand">

Assume the network is *eventually* timely. Use **timeouts** to suspect failures. This is how Raft and Paxos guarantee liveness in practice.

</Card>

<Card title="Randomization" accent="purple">

Randomized algorithms (Ben-Or) reach consensus with probability 1, sidestepping the deterministic impossibility.

</Card>

</Cards>

<Callout type="info" title="The practical lesson">

FLP explains why every real consensus protocol relies on **timeouts and failure detectors** — and why, during a bad network spell, a Raft cluster can stall (no leader elected) rather than violate safety. You trade guaranteed liveness for guaranteed safety. See [Consensus & Coordination](/estrategias-de-consistencia/consenso) and [Network Partitions](/theoretical-foundations/network-partitions).

</Callout>
$mdx$, $mdx$# O Resultado de Impossibilidade FLP

Em 1985, Fischer, Lynch e Paterson provaram um dos resultados mais importantes — e humildes — da computação distribuída:

<Callout type="warning" title="O resultado">

Em um sistema **assíncrono** onde até **um** processo pode falhar (crash), **não existe algoritmo determinístico** com garantia de alcançar **consenso** em tempo limitado.

</Callout>

## Por que é surpreendente

Consenso parece simples: um grupo de nós deve concordar com um único valor (ex: "a transação foi confirmada?"). O FLP diz que, sem suposições de tempo, você não consegue construir um algoritmo que seja simultaneamente:

- **Seguro** (safe) — nunca decide dois valores diferentes
- **Vivo** (live) — sempre decide eventualmente

…e que tolere até um único crash. O ponto fatal é a suposição **assíncrona**: você não consegue distinguir um nó que *travou* de um *muito lento*, porque mensagens não têm limite de tempo.

## Isso não é uma sentença de morte

Sistemas reais alcançam consenso todo dia (Raft, Paxos, Zab). Eles escapam do FLP **relaxando suposições**:

<Cards cols={2}>

<Card title="Sincronia parcial" accent="brand">

Assuma que a rede é *eventualmente* pontual. Use **timeouts** para suspeitar de falhas. É assim que Raft e Paxos garantem liveness na prática.

</Card>

<Card title="Aleatorização" accent="purple">

Algoritmos aleatorizados (Ben-Or) alcançam consenso com probabilidade 1, contornando a impossibilidade determinística.

</Card>

</Cards>

<Callout type="info" title="A lição prática">

O FLP explica por que todo protocolo de consenso real depende de **timeouts e detectores de falha** — e por que, durante um período ruim de rede, um cluster Raft pode travar (nenhum líder eleito) em vez de violar a segurança. Você troca liveness garantida por segurança garantida. Veja [Consenso & Coordenação](/estrategias-de-consistencia/consenso) e [Partições de Rede](/theoretical-foundations/network-partitions).

</Callout>
$mdx$),
  ('theoretical-foundations/fallacies', '/theoretical-foundations/fallacies', 'theory', 10, NULL, true, 'Fallacies of Distributed Computing', 'Falácias da Computação Distribuída', $mdx$# The Fallacies of Distributed Computing

In the 1990s, engineers at Sun Microsystems catalogued the **false assumptions** that developers new to distributed systems almost always make. Believing any of them leads to broken systems. There are eight.

<Callout type="warning" title="The eight fallacies">

1. The network is **reliable**
2. **Latency** is zero
3. **Bandwidth** is infinite
4. The network is **secure**
5. **Topology** doesn't change
6. There is **one administrator**
7. **Transport cost** is zero
8. The network is **homogeneous**

</Callout>

## Why each one bites

<Cards cols={2}>

<Card title="1-3: Network physics" accent="red">

Packets drop, links flap, and the speed of light is real. A cross-region call is ~100ms no matter how much you spend. Chatty designs (N+1 calls) die here.

</Card>

<Card title="4: Security" accent="amber">

Anything on the wire can be intercepted or spoofed. Assume hostile networks: encrypt, authenticate, authorize.

</Card>

<Card title="5-6: Change & ownership" accent="purple">

Nodes come and go, IPs change, and many teams operate pieces of the system. Hard-coded hosts and hidden config rot quickly.

</Card>

<Card title="7-8: Cost & heterogeneity" accent="green">

Serialization and marshalling aren't free, and you'll talk to many OSes, languages, and protocol versions. Plan for it.

</Card>

</Cards>

## What to do about them

- **Embrace failure**: [retries](/principios-design/tolerancia-falhas/retry-pattern) with backoff, [timeouts](/principios-design/tolerancia-falhas/timeout), [circuit breakers](/principios-design/tolerancia-falhas/circuit-breaker)
- **Minimize round trips**: batch, cache, and co-locate chatty services
- **Assume hostility**: encrypt in transit, authenticate every hop
- **Design for change**: service discovery, health checks, idempotency

<Callout type="info" title="The mindset">

The fallacies are not bugs to fix once — they are a permanent checklist. Every time you make a remote call, assume it can be slow, fail, be intercepted, or hit a node that just moved.

</Callout>
$mdx$, $mdx$# As Falácias da Computação Distribuída

Nos anos 1990, engenheiros da Sun Microsystems catalogaram as **suposições falsas** que desenvolvedores novos em sistemas distribuídos quase sempre fazem. Acreditar em qualquer uma delas leva a sistemas quebrados. São oito.

<Callout type="warning" title="As oito falácias">

1. A rede é **confiável**
2. A **latência** é zero
3. A **largura de banda** é infinita
4. A rede é **segura**
5. A **topologia** não muda
6. Existe **um administrador**
7. O **custo de transporte** é zero
8. A rede é **homogênea**

</Callout>

## Por que cada uma morde

<Cards cols={2}>

<Card title="1-3: Física da rede" accent="red">

Pacotes caem, links oscilam e a velocidade da luz é real. Uma chamada entre regiões é ~100ms não importa quanto você gaste. Designs "tagarelas" (chamadas N+1) morrem aqui.

</Card>

<Card title="4: Segurança" accent="amber">

Qualquer coisa no fio pode ser interceptada ou falsificada. Assuma redes hostis: criptografe, autentique, autorize.

</Card>

<Card title="5-6: Mudança e propriedade" accent="purple">

Nós entram e saem, IPs mudam e muitos times operam partes do sistema. Hosts fixos no código e configs escondidas apodrecem rápido.

</Card>

<Card title="7-8: Custo e heterogeneidade" accent="green">

Serialização e marshalling não são de graça, e você vai falar com muitos SOs, linguagens e versões de protocolo. Planeje para isso.

</Card>

</Cards>

## O que fazer a respeito

- **Abrace a falha**: [retries](/principios-design/tolerancia-falhas/retry-pattern) com backoff, [timeouts](/principios-design/tolerancia-falhas/timeout), [circuit breakers](/principios-design/tolerancia-falhas/circuit-breaker)
- **Minimize round trips**: batch, cache e co-localize serviços tagarelas
- **Assuma hostilidade**: criptografe em trânsito, autentique cada salto
- **Projete para mudança**: service discovery, health checks, idempotência

<Callout type="info" title="A mentalidade">

As falácias não são bugs para corrigir uma vez — são um checklist permanente. Toda vez que você faz uma chamada remota, assuma que ela pode ser lenta, falhar, ser interceptada ou atingir um nó que acabou de se mover.

</Callout>
$mdx$)
ON CONFLICT ("slug") DO UPDATE SET
  "path" = EXCLUDED."path", "module_id" = EXCLUDED."module_id",
  "order_index" = EXCLUDED."order_index", "simulator_key" = EXCLUDED."simulator_key",
  "published" = EXCLUDED."published", "title_en" = EXCLUDED."title_en",
  "title_pt" = EXCLUDED."title_pt", "body_en" = EXCLUDED."body_en",
  "body_pt" = EXCLUDED."body_pt", "updated_at" = now();
