-- Incremental content: new Monitoring & Reliability lessons (idempotent upserts).

INSERT INTO "content_pages" ("slug", "path", "module_id", "order_index", "simulator_key", "published", "title_en", "title_pt", "body_en", "body_pt") VALUES
  ('monitoring/chaos-engineering', '/monitoramento-e-manutencao/chaos-engineering', 'monitoring', 74, 'chaos', true, 'Chaos Engineering', 'Chaos Engineering', $mdx$# Chaos Engineering

You can't know how your system behaves under failure until it fails. **Chaos Engineering** flips this around: instead of waiting for production to break at 3am, you **deliberately inject failures** in a controlled way to find weaknesses *before* they find you. Pioneered by Netflix with **Chaos Monkey**.

<Callout type="info" title="The core idea">

Resilience is a hypothesis until tested. Chaos engineering is the experiment: "I believe the system tolerates a node loss with no user impact." Then you kill a node and check whether reality agrees.

</Callout>

## The scientific method, applied to failure

1. **Define steady state** — a measurable signal of "healthy" (e.g. orders/sec, p99 latency)
2. **Hypothesize** — steady state continues even when X fails
3. **Inject** — kill a node, add latency, drop packets, exhaust CPU
4. **Observe** — did steady state hold? If not, you found a real weakness
5. **Minimize blast radius** — start tiny (staging, 1%), expand only when confident

## Common failure injections

<Cards cols={2}>

<Card title="Infrastructure" accent="red">

Terminate instances, reboot hosts, detach disks, kill containers.

</Card>

<Card title="Network" accent="amber">

Add latency, drop or corrupt packets, simulate partitions and DNS failures.

</Card>

<Card title="Resource" accent="purple">

Burn CPU, fill memory or disk, throttle I/O to mimic noisy neighbors.

</Card>

<Card title="Application" accent="brand">

Inject exceptions, slow dependencies, return errors from a service.

</Card>

</Cards>

<Callout type="warning" title="Do it safely">

Chaos in production requires monitoring, an automatic stop ("abort the experiment if error rate > 5%"), and a blast radius you can contain. Start in staging. A **game day** is a scheduled, supervised chaos exercise the whole team runs together.

</Callout>

<Callout type="success" title="Try it">

Run a game day: kill nodes with and without redundancy and watch availability hold or collapse in the [Chaos Simulator](/monitoramento-e-manutencao/chaos-engineering/simulator).

</Callout>
$mdx$, $mdx$# Chaos Engineering

Você não sabe como seu sistema se comporta sob falha até ele falhar. O **Chaos Engineering** inverte isso: em vez de esperar a produção quebrar às 3h da manhã, você **injeta falhas deliberadamente** de forma controlada para encontrar fraquezas *antes* que elas te encontrem. Pioneirado pela Netflix com o **Chaos Monkey**.

<Callout type="info" title="A ideia central">

Resiliência é uma hipótese até ser testada. O chaos engineering é o experimento: "Acredito que o sistema tolera a perda de um nó sem impacto ao usuário." Então você mata um nó e verifica se a realidade concorda.

</Callout>

## O método científico, aplicado à falha

1. **Defina o steady state** — um sinal mensurável de "saudável" (ex: pedidos/seg, latência p99)
2. **Hipotetize** — o steady state continua mesmo quando X falha
3. **Injete** — mate um nó, adicione latência, derrube pacotes, esgote CPU
4. **Observe** — o steady state se manteve? Se não, você achou uma fraqueza real
5. **Minimize o raio de explosão** — comece pequeno (staging, 1%), expanda só com confiança

## Injeções de falha comuns

<Cards cols={2}>

<Card title="Infraestrutura" accent="red">

Termine instâncias, reinicie hosts, desconecte discos, mate containers.

</Card>

<Card title="Rede" accent="amber">

Adicione latência, derrube ou corrompa pacotes, simule partições e falhas de DNS.

</Card>

<Card title="Recurso" accent="purple">

Queime CPU, encha memória ou disco, limite I/O para imitar vizinhos barulhentos.

</Card>

<Card title="Aplicação" accent="brand">

Injete exceções, deixe dependências lentas, retorne erros de um serviço.

</Card>

</Cards>

<Callout type="warning" title="Faça com segurança">

Chaos em produção exige monitoramento, uma parada automática ("aborte o experimento se a taxa de erro > 5%") e um raio de explosão que você consiga conter. Comece em staging. Um **game day** é um exercício de chaos agendado e supervisionado que o time inteiro roda junto.

</Callout>

<Callout type="success" title="Experimente">

Rode um game day: mate nós com e sem redundância e veja a disponibilidade resistir ou desabar no [Simulador de Chaos](/monitoramento-e-manutencao/chaos-engineering/simulator).

</Callout>
$mdx$),
  ('monitoring/disaster-recovery', '/monitoramento-e-manutencao/disaster-recovery', 'monitoring', 75, NULL, true, 'Disaster Recovery & Backups', 'Disaster Recovery & Backups', $mdx$# Disaster Recovery & Backups

A disaster is any event that takes out a meaningful chunk of your system — a region outage, a corrupting deploy, a fat-fingered `DROP TABLE`, ransomware. **Disaster Recovery (DR)** is your plan to restore service afterward. Two numbers define the target.

<Cards cols={2}>

<Card title="RPO — Recovery Point Objective" accent="amber">

How much **data** can you afford to lose? An RPO of 5 minutes means backups/replication must be at most 5 minutes behind. It bounds **data loss**.

</Card>

<Card title="RTO — Recovery Time Objective" accent="brand">

How long can you be **down**? An RTO of 1 hour means you must be back within an hour. It bounds **downtime**.

</Card>

</Cards>

<Callout type="info" title="Tighter targets cost more">

RPO ≈ 0 needs synchronous replication; RTO ≈ 0 needs hot standby running 24/7. Both are expensive. Match the targets to what the business actually needs per system — your billing DB and your meme cache are not the same.

</Callout>

## DR strategies, cheapest to costliest

1. **Backup & restore** — restore from backups into a new environment. Cheap; high RTO (hours).
2. **Pilot light** — core data replicated, minimal infra always on, scaled up on disaster.
3. **Warm standby** — a smaller always-running copy you scale up and cut over to.
4. **Hot standby / multi-site active-active** — full duplicate serving traffic; near-zero RTO/RPO; most expensive. (See [Multi-Region](/monitoramento-e-manutencao/multi-region).)

## Backups that actually work

- **3-2-1 rule**: 3 copies, on 2 media types, 1 off-site
- **Test restores** — an untested backup is not a backup; rehearse recovery
- **Immutable / offline copies** to survive ransomware that targets backups
- **Encrypt** backups and verify their integrity

<Callout type="warning" title="The classic trap">

Teams back up religiously and never test a restore. On disaster day they discover the backups were corrupt, incomplete, or take 12 hours to restore. DR is only real if you regularly practice the recovery.

</Callout>
$mdx$, $mdx$# Disaster Recovery & Backups

Um desastre é qualquer evento que derruba uma parte significativa do seu sistema — uma queda de região, um deploy que corrompe dados, um `DROP TABLE` por engano, ransomware. **Disaster Recovery (DR)** é seu plano para restaurar o serviço depois. Dois números definem o alvo.

<Cards cols={2}>

<Card title="RPO — Recovery Point Objective" accent="amber">

Quanto **dado** você pode perder? Um RPO de 5 minutos significa que backups/replicação devem estar no máximo 5 minutos atrás. Limita a **perda de dados**.

</Card>

<Card title="RTO — Recovery Time Objective" accent="brand">

Por quanto tempo você pode ficar **fora do ar**? Um RTO de 1 hora significa que você precisa voltar em uma hora. Limita o **downtime**.

</Card>

</Cards>

<Callout type="info" title="Alvos mais apertados custam mais">

RPO ≈ 0 exige replicação síncrona; RTO ≈ 0 exige hot standby rodando 24/7. Ambos são caros. Ajuste os alvos ao que o negócio realmente precisa por sistema — seu banco de billing e seu cache de memes não são a mesma coisa.

</Callout>

## Estratégias de DR, da mais barata à mais cara

1. **Backup & restore** — restaure de backups em um novo ambiente. Barato; RTO alto (horas).
2. **Pilot light** — dados core replicados, infra mínima sempre ligada, escalada no desastre.
3. **Warm standby** — uma cópia menor sempre rodando que você escala e assume o tráfego.
4. **Hot standby / multi-site active-active** — duplicata completa atendendo tráfego; RTO/RPO quase zero; o mais caro. (Veja [Multi-Região](/monitoramento-e-manutencao/multi-region).)

## Backups que realmente funcionam

- **Regra 3-2-1**: 3 cópias, em 2 tipos de mídia, 1 off-site
- **Teste os restores** — um backup não testado não é um backup; ensaie a recuperação
- **Cópias imutáveis / offline** para sobreviver a ransomware que mira backups
- **Criptografe** backups e verifique sua integridade

<Callout type="warning" title="A armadilha clássica">

Times fazem backup religiosamente e nunca testam um restore. No dia do desastre descobrem que os backups estavam corrompidos, incompletos, ou levam 12 horas para restaurar. DR só é real se você pratica a recuperação regularmente.

</Callout>
$mdx$),
  ('monitoring/multi-region', '/monitoramento-e-manutencao/multi-region', 'monitoring', 76, NULL, true, 'Multi-Region & Geo-Replication', 'Multi-Região & Geo-Replicação', $mdx$# Multi-Region & Geo-Replication

Running in a single region is simple — until that region has a bad day, or your users are 8,000km away paying 300ms for every request. **Multi-region** architectures spread your system across geographic regions for three reasons: **lower latency** (serve users locally), **higher availability** (survive a region outage), and **data residency** (keep data in-country).

## Topologies

<Cards cols={2}>

<Card title="Active-Passive" accent="brand">

One region serves traffic; another stands by, replicated and ready for failover. Simpler, but the standby is idle capacity and failover takes time.

</Card>

<Card title="Active-Active" accent="green">

All regions serve traffic simultaneously. Best latency and availability — but now you must handle **concurrent writes in multiple regions**, the hard part.

</Card>

</Cards>

## The hard part: writes

Reads geo-replicate easily. **Writes** are where physics and [CAP](/theoretical-foundations/cap-theorem) bite. Strategies:

- **Single-writer region**: all writes route to one region (simple, consistent, but distant writers pay latency)
- **Conflict resolution**: accept writes anywhere and resolve conflicts — last-write-wins, or [CRDTs](/estrategias-de-consistencia/crdts) for automatic merge
- **Partitioned by geography**: each region owns a slice of the data (e.g. EU users' data lives in EU), avoiding cross-region write conflicts entirely

<Callout type="info" title="Routing users to regions">

**GeoDNS** and **anycast** route each user to the nearest healthy region. Global load balancers health-check regions and shift traffic away from one that's failing — the front door to availability.

</Callout>

<Callout type="warning" title="The trade-offs are real">

Cross-region replication adds **lag** (data is stale in remote regions), egress is **expensive**, and active-active forces you to confront [consistency models](/theoretical-foundations/consistency-models) head-on. Go multi-region when latency, availability, or compliance genuinely demand it — not by default.

</Callout>
$mdx$, $mdx$# Multi-Região & Geo-Replicação

Rodar em uma única região é simples — até essa região ter um dia ruim, ou seus usuários estarem a 8.000km de distância pagando 300ms por requisição. Arquiteturas **multi-região** espalham seu sistema por regiões geográficas por três motivos: **menor latência** (atender usuários localmente), **maior disponibilidade** (sobreviver à queda de uma região) e **residência de dados** (manter dados no país).

## Topologias

<Cards cols={2}>

<Card title="Active-Passive" accent="brand">

Uma região atende o tráfego; outra fica de prontidão, replicada e pronta para failover. Mais simples, mas a standby é capacidade ociosa e o failover leva tempo.

</Card>

<Card title="Active-Active" accent="green">

Todas as regiões atendem tráfego simultaneamente. Melhor latência e disponibilidade — mas agora você precisa lidar com **escritas concorrentes em múltiplas regiões**, a parte difícil.

</Card>

</Cards>

## A parte difícil: escritas

Leituras geo-replicam facilmente. As **escritas** são onde a física e o [CAP](/theoretical-foundations/cap-theorem) mordem. Estratégias:

- **Região de escrita única**: todas as escritas vão para uma região (simples, consistente, mas escritores distantes pagam latência)
- **Resolução de conflitos**: aceite escritas em qualquer lugar e resolva conflitos — last-write-wins, ou [CRDTs](/estrategias-de-consistencia/crdts) para merge automático
- **Particionado por geografia**: cada região é dona de uma fatia dos dados (ex: dados de usuários da UE ficam na UE), evitando conflitos de escrita entre regiões por completo

<Callout type="info" title="Roteando usuários para regiões">

**GeoDNS** e **anycast** roteiam cada usuário para a região saudável mais próxima. Load balancers globais fazem health-check das regiões e desviam o tráfego de uma que esteja falhando — a porta de entrada da disponibilidade.

</Callout>

<Callout type="warning" title="Os trade-offs são reais">

Replicação entre regiões adiciona **lag** (dados ficam desatualizados em regiões remotas), egress é **caro**, e active-active te força a encarar [modelos de consistência](/theoretical-foundations/consistency-models) de frente. Vá multi-região quando latência, disponibilidade ou compliance realmente exigirem — não por padrão.

</Callout>
$mdx$)
ON CONFLICT ("slug") DO UPDATE SET
  "path" = EXCLUDED."path", "module_id" = EXCLUDED."module_id",
  "order_index" = EXCLUDED."order_index", "simulator_key" = EXCLUDED."simulator_key",
  "published" = EXCLUDED."published", "title_en" = EXCLUDED."title_en",
  "title_pt" = EXCLUDED."title_pt", "body_en" = EXCLUDED."body_en",
  "body_pt" = EXCLUDED."body_pt", "updated_at" = now();
