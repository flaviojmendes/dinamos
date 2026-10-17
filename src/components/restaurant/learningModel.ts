export type SceneMode = 'counter' | 'queue' | 'routing' | 'cache' | 'storage' | 'replication' | 'consensus' | 'network' | 'saga' | 'security' | 'observability' | 'scaling' | 'ai' | 'delivery' | 'recovery' | 'events';
export type Station = 'entrance' | 'counter' | 'kitchen' | 'pickup' | 'stock' | 'branch' | 'dispatch' | 'terminal';
export interface LocalizedText { en: string; pt: string }
export interface ConceptStep { title: LocalizedText; description: LocalizedText; focus: Station }
export interface Concept {
  slug: string;
  path: string;
  mode: SceneMode;
  station: Station;
  title: LocalizedText;
  improvement: LocalizedText;
  steps: [ConceptStep, ConceptStep, ConceptStep];
}
export interface RestaurantStage {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  threshold: number;
  title: LocalizedText;
  stations: Station[];
}
export const restaurantStages: readonly RestaurantStage[] = [
  { level: 1, threshold: 0, title: { en: 'First orders', pt: 'Primeiros pedidos' }, stations: ['entrance', 'counter', 'kitchen'] },
  { level: 2, threshold: 3, title: { en: 'Kitchen in rhythm', pt: 'Cozinha em ritmo' }, stations: [] },
  { level: 3, threshold: 12, title: { en: 'Lunch rush', pt: 'Hora do almoço' }, stations: ['pickup', 'stock'] },
  { level: 4, threshold: 30, title: { en: 'Around the neighborhood', pt: 'Pelo bairro' }, stations: ['dispatch'] },
  { level: 5, threshold: 60, title: { en: 'A growing network', pt: 'Uma rede em expansão' }, stations: ['branch'] },
  { level: 6, threshold: 100, title: { en: 'Connected restaurant', pt: 'Hamburgueria conectada' }, stations: ['terminal'] },
];
export interface RestaurantProgress {
  level: RestaurantStage['level'];
  completed: number;
  total: number;
  percent: number;
  nextTarget: number | null;
  unlockedStations: Station[];
}

const text = (en: string, pt: string): LocalizedText => ({ en, pt });
const step = (titleEn: string, titlePt: string, descriptionEn: string, descriptionPt: string, focus: Station): ConceptStep => ({
  title: text(titleEn, titlePt), description: text(descriptionEn, descriptionPt), focus,
});

// Every published lesson has its own three observable moments. These scenes illustrate
// software used by the restaurant; physical food handling does not inherit data guarantees.
export const restaurantConcepts: Record<string, Concept> = {
  "intro": {
    slug: "intro", path: "/intro", mode: "counter", station: "counter",
    title: text("Introduction", "Introdução"),
    improvement: text("Open the counter and follow a burger order from request to pickup.", "Abra o balcão e acompanhe um pedido da solicitação até a retirada."),
    steps: [
      step("An order arrives", "Chega um pedido", "A customer requests a burger. The counter records what the system must deliver.", "Um cliente pede um hambúrguer. O balcão registra o que o sistema precisa entregar.", "counter"),
      step("Work moves inside", "O trabalho avança", "The kitchen prepares the order while the counter remains available for another customer.", "A cozinha prepara o pedido enquanto o balcão continua disponível para outro cliente.", "kitchen"),
      step("Observe the outcome", "Observe o resultado", "The pickup station confirms delivery. Following this flow makes delays and failures visible.", "A retirada confirma a entrega. Acompanhar esse fluxo torna atrasos e falhas visíveis.", "pickup"),
    ],
  },
  "distributed-systems-101": {
    slug: "distributed-systems-101", path: "/sistemas-distribuidos-101", mode: "network", station: "kitchen",
    title: text("Distributed Systems 101", "Sistemas Distribuídos 101"),
    improvement: text("Connect the order terminal, kitchen display and branch over a network.", "Conecte o terminal de pedidos, a tela da cozinha e a filial pela rede."),
    steps: [
      step("Independent stations", "Estações independentes", "The counter and kitchen each run their own software and maintain local state.", "Balcão e cozinha executam seus próprios programas e mantêm estado local.", "counter"),
      step("Exchange messages", "Troque mensagens", "An order travels over the network. The kitchen cannot inspect the counter's memory directly.", "Um pedido atravessa a rede. A cozinha não consulta diretamente a memória do caixa.", "kitchen"),
      step("A partial failure", "Uma falha parcial", "A disconnected branch stops receiving updates even while the main restaurant keeps serving.", "Uma filial desconectada deixa de receber atualizações enquanto a matriz continua atendendo.", "branch"),
    ],
  },
  "system-design-101": {
    slug: "system-design-101", path: "/system-design-101", mode: "counter", station: "terminal",
    title: text("System Design 101", "Projeto de Sistemas 101"),
    improvement: text("Design the ordering system around demand, constraints and measurable trade-offs.", "Projete o sistema de pedidos conforme demanda, restrições e escolhas mensuráveis."),
    steps: [
      step("Define the goal", "Defina o objetivo", "Estimate lunch orders and acceptable waiting time before choosing the restaurant's architecture.", "Estime os pedidos do almoço e a espera aceitável antes de escolher a arquitetura.", "entrance"),
      step("Draw the flow", "Desenhe o fluxo", "Connect ordering, preparation, payment and pickup with explicit responsibilities and interfaces.", "Conecte pedido, preparo, pagamento e retirada com responsabilidades e interfaces explícitas.", "counter"),
      step("Test the bottleneck", "Teste o gargalo", "Increase arrivals and inspect kitchen capacity; a second cashier cannot fix a saturated grill.", "Aumente as chegadas e examine a capacidade da cozinha; outro caixa não resolve uma chapa saturada.", "kitchen"),
    ],
  },
  "theoretical-foundations/index": {
    slug: "theoretical-foundations/index", path: "/theoretical-foundations", mode: "network", station: "branch",
    title: text("Theoretical Foundations", "Fundamentos Teóricos"),
    improvement: text("Explore what a restaurant network can guarantee when communication becomes uncertain.", "Explore as garantias possíveis quando a comunicação entre unidades fica incerta."),
    steps: [
      step("Share the menu", "Compartilhe o cardápio", "The main counter sends a menu update to a branch with its own copy.", "O balcão principal envia uma atualização do cardápio para a cópia da filial.", "counter"),
      step("Delay the update", "Atrase a atualização", "A delayed message leaves the branch uncertain about the latest version.", "Uma mensagem atrasada deixa a filial sem certeza sobre a versão mais recente.", "branch"),
      step("Choose a guarantee", "Escolha uma garantia", "Decide whether a disconnected terminal must wait or may return an older menu.", "Decida se um terminal desconectado deve esperar ou pode devolver um cardápio antigo.", "terminal"),
    ],
  },
  "theoretical-foundations/cap-theorem": {
    slug: "theoretical-foundations/cap-theorem", path: "/theoretical-foundations/cap-theorem", mode: "network", station: "branch",
    title: text("CAP Theorem", "Teorema CAP"),
    improvement: text("Make the availability-versus-consistency choice during a partition in the stock service.", "Escolha entre disponibilidade e consistência durante uma partição no serviço de estoque."),
    steps: [
      step("Partition the link", "Particione a conexão", "The stock database replicas lose contact; both cannot coordinate the latest inventory value.", "As réplicas do banco de estoque perdem contato e não coordenam o valor mais recente.", "stock"),
      step("Wait for coordination", "Espere a coordenação", "A consistency-first terminal refuses an uncoordinated inventory read until contact returns.", "Um terminal que prioriza consistência recusa uma leitura descoordenada até o contato voltar.", "counter"),
      step("Allow a stale answer", "Permita uma resposta antiga", "An availability-first branch answers locally, accepting that its stock value may be outdated.", "Uma filial que prioriza disponibilidade responde localmente, aceitando um estoque possivelmente desatualizado.", "branch"),
    ],
  },
  "theoretical-foundations/consistency-models": {
    slug: "theoretical-foundations/consistency-models", path: "/theoretical-foundations/consistency-models", mode: "replication", station: "stock",
    title: text("Consistency Models", "Modelos de Consistência"),
    improvement: text("Give menu readers explicit guarantees about the changes they can observe.", "Defina quais alterações os leitores do cardápio conseguem observar."),
    steps: [
      step("Publish a change", "Publique uma alteração", "The manager removes a sold-out burger from the menu database.", "A gerência remove um hambúrguer esgotado do banco do cardápio.", "stock"),
      step("Read a replica", "Leia uma réplica", "A branch reading an asynchronous replica may still see the previous menu.", "Uma filial que lê uma réplica assíncrona ainda pode ver o cardápio anterior.", "branch"),
      step("Define the contract", "Defina o contrato", "Choose the required read guarantee; eventual convergence alone does not ensure immediate visibility.", "Escolha a garantia de leitura necessária; convergência eventual não significa visibilidade imediata.", "terminal"),
    ],
  },
  "theoretical-foundations/distributed-challenges": {
    slug: "theoretical-foundations/distributed-challenges", path: "/theoretical-foundations/distributed-challenges", mode: "network", station: "dispatch",
    title: text("Distributed Systems Challenges", "Desafios de Sistemas Distribuídos"),
    improvement: text("Expose delayed messages, duplicates and partial failures in online orders.", "Revele mensagens atrasadas, duplicadas e falhas parciais nos pedidos digitais."),
    steps: [
      step("An uncertain request", "Uma solicitação incerta", "A payment request leaves the counter, but its response is delayed.", "Uma solicitação de pagamento sai do balcão, mas a resposta demora.", "counter"),
      step("Some services survive", "Alguns serviços continuam", "The kitchen display works while the payment service is unreachable; failure is partial.", "A tela da cozinha funciona enquanto o pagamento está inacessível; a falha é parcial.", "kitchen"),
      step("Resolve uncertainty", "Resolva a incerteza", "Check the order identifier before retrying so a missing response does not become a duplicate charge.", "Confira o identificador do pedido antes de repetir para evitar uma cobrança duplicada.", "terminal"),
    ],
  },
  "theoretical-foundations/network-partitions": {
    slug: "theoretical-foundations/network-partitions", path: "/theoretical-foundations/network-partitions", mode: "network", station: "branch",
    title: text("Network Partitions & Failures", "Partições de Rede e Falhas"),
    improvement: text("Watch separated restaurant replicas diverge and recover after reconnection.", "Observe réplicas separadas divergirem e se recuperarem após a reconexão."),
    steps: [
      step("Lose contact", "Perca o contato", "A failed network link separates the branch's order service from the main restaurant.", "Uma conexão de rede falha separa o serviço de pedidos da filial da matriz.", "branch"),
      step("Local work continues", "O trabalho local continua", "Permitted local changes accumulate while remote state remains unknown.", "Alterações locais permitidas se acumulam enquanto o estado remoto permanece desconhecido.", "counter"),
      step("Reconcile on return", "Reconcilie na volta", "After reconnection, exchange missed updates and resolve conflicts according to the data model.", "Após reconectar, troque atualizações pendentes e resolva conflitos conforme o modelo de dados.", "stock"),
    ],
  },
  "components/index": {
    slug: "components/index", path: "/componentes", mode: "counter", station: "kitchen",
    title: text("Basic Components", "Componentes Básicos"),
    improvement: text("Assemble the digital stations that support a complete restaurant order.", "Monte as estações digitais que sustentam um pedido completo."),
    steps: [
      step("Receive requests", "Receba solicitações", "The counter acts as the entry point for online orders and menu requests.", "O balcão funciona como entrada de pedidos digitais e consultas ao cardápio.", "counter"),
      step("Delegate the work", "Delegue o trabalho", "A queue connects the counter to kitchen workers, separating arrival from preparation.", "Uma fila conecta o balcão aos trabalhadores da cozinha, separando chegada e preparo.", "kitchen"),
      step("Keep durable state", "Mantenha estado durável", "The order database preserves status after a terminal restarts.", "O banco de pedidos preserva o estado após a reinicialização de um terminal.", "stock"),
    ],
  },
  "theoretical-foundations/pacelc": {
    slug: "theoretical-foundations/pacelc", path: "/theoretical-foundations/pacelc", mode: "replication", station: "branch",
    title: text("The PACELC Theorem", "O Teorema PACELC"),
    improvement: text("Compare coordination cost both during a partition and during healthy operation.", "Compare o custo de coordenação durante uma partição e também com a rede saudável."),
    steps: [
      step("A healthy network", "Uma rede saudável", "The counter can wait for a remote replica before confirming a menu change.", "O balcão pode esperar uma réplica remota antes de confirmar uma alteração do cardápio.", "counter"),
      step("Pay coordination latency", "Pague a latência de coordenação", "Waiting for remote coordination strengthens the chosen guarantee but adds network delay.", "Esperar a coordenação remota fortalece a garantia escolhida, mas acrescenta atraso de rede.", "branch"),
      step("A partition changes choices", "Uma partição muda as escolhas", "When replicas cannot communicate, the service again faces the availability-versus-consistency trade-off.", "Quando as réplicas não se comunicam, o serviço enfrenta a escolha entre disponibilidade e consistência.", "terminal"),
    ],
  },
  "components/database": {
    slug: "components/database", path: "/componentes/banco-dados", mode: "storage", station: "stock",
    title: text("Databases", "Bancos de Dados"),
    improvement: text("Give every order a durable record that survives a cashier restart.", "Dê a cada pedido um registro durável que sobreviva à reinicialização do caixa."),
    steps: [
      step("Record the order", "Registre o pedido", "The counter writes the order identifier, items and payment state to a database.", "O caixa grava identificador, itens e situação do pagamento em um banco de dados.", "counter"),
      step("Commit before confirming", "Confirme após gravar", "A successful commit makes the database change durable according to its configured guarantees.", "Uma confirmação de gravação torna a alteração durável conforme as garantias configuradas.", "stock"),
      step("Recover the record", "Recupere o registro", "After restarting, the terminal reads the saved order instead of relying on lost memory.", "Após reiniciar, o terminal lê o pedido salvo em vez de depender da memória perdida.", "terminal"),
    ],
  },
  "theoretical-foundations/flp-impossibility": {
    slug: "theoretical-foundations/flp-impossibility", path: "/theoretical-foundations/flp-impossibility", mode: "consensus", station: "branch",
    title: text("The FLP Impossibility", "A Impossibilidade FLP"),
    improvement: text("Show why an asynchronous ordering service cannot always guarantee consensus termination.", "Mostre por que um serviço assíncrono nem sempre garante o término do consenso."),
    steps: [
      step("Propose a decision", "Proponha uma decisão", "Restaurant replicas propose which menu revision should become the next committed version.", "As réplicas propõem qual revisão do cardápio deve ser confirmada em seguida.", "counter"),
      step("Silence is ambiguous", "O silêncio é ambíguo", "A replica may have crashed or its messages may simply be arbitrarily delayed.", "Uma réplica pode ter falhado ou suas mensagens podem estar arbitrariamente atrasadas.", "branch"),
      step("Add practical assumptions", "Adote hipóteses práticas", "Timeouts and eventual timing assumptions help real protocols progress; they do not disprove FLP.", "Tempos limite e hipóteses sobre a rede ajudam protocolos reais; isso não refuta o FLP.", "terminal"),
    ],
  },
  "components/cache": {
    slug: "components/cache", path: "/componentes/cache", mode: "cache", station: "counter",
    title: text("Cache", "Cache"),
    improvement: text("Keep a nearby menu copy and make freshness an explicit decision.", "Mantenha uma cópia próxima do cardápio e defina sua atualização."),
    steps: [
      step("A cache miss", "Uma consulta sem cópia", "The first menu request reads the database because the counter cache is empty.", "A primeira consulta lê o banco porque o cache do balcão está vazio.", "counter"),
      step("Reuse the copy", "Reutilize a cópia", "Following requests reuse the cached menu, reducing repeated database reads.", "As consultas seguintes reutilizam o cardápio em cache, reduzindo leituras repetidas no banco.", "pickup"),
      step("Expire or invalidate", "Expire ou invalide", "A price change requires invalidation or expiration; a fast copy can still be stale.", "Uma mudança de preço exige invalidação ou expiração; uma cópia rápida ainda pode estar antiga.", "stock"),
    ],
  },
  "theoretical-foundations/fallacies": {
    slug: "theoretical-foundations/fallacies", path: "/theoretical-foundations/fallacies", mode: "network", station: "dispatch",
    title: text("Fallacies of Distributed Computing", "Falácias da Computação Distribuída"),
    improvement: text("Challenge optimistic assumptions about the restaurant's network and dependencies.", "Questione hipóteses otimistas sobre a rede e as dependências da hamburgueria."),
    steps: [
      step("Assume instant delivery", "Suponha entrega instantânea", "The counter expects the remote kitchen display to receive every message immediately.", "O balcão espera que a tela remota da cozinha receba toda mensagem imediatamente.", "counter"),
      step("Introduce reality", "Introduza a realidade", "Latency, packet loss and bandwidth limits delay order notifications independently of preparation.", "Latência, perda de pacotes e limites de banda atrasam notificações independentemente do preparo.", "dispatch"),
      step("Design for uncertainty", "Projete para a incerteza", "Use measured budgets, authentication and recovery instead of assuming a perfect network.", "Use limites medidos, autenticação e recuperação em vez de presumir uma rede perfeita.", "terminal"),
    ],
  },
  "components/load-balancer": {
    slug: "components/load-balancer", path: "/componentes/load-balancer", mode: "routing", station: "counter",
    title: text("Load Balancers", "Balanceadores de Carga"),
    improvement: text("Route incoming orders across healthy kitchen service workers.", "Distribua pedidos entre trabalhadores saudáveis do serviço da cozinha."),
    steps: [
      step("One entrance", "Uma entrada", "Customers send requests to a single service address at the restaurant entrance.", "Os clientes enviam solicitações a um único endereço de serviço na entrada.", "entrance"),
      step("Choose a worker", "Escolha um trabalhador", "The load balancer selects a healthy kitchen instance using its configured routing policy.", "O balanceador escolhe uma instância saudável da cozinha conforme a política configurada.", "counter"),
      step("Remove a failed target", "Retire um destino com falha", "Health information removes an unavailable worker from future routing decisions.", "As informações de saúde retiram um trabalhador indisponível das próximas decisões de roteamento.", "kitchen"),
    ],
  },
  "components/message-queue": {
    slug: "components/message-queue", path: "/componentes/message-queue", mode: "queue", station: "kitchen",
    title: text("Message Queues", "Filas de Mensagens"),
    improvement: text("Buffer order tickets so kitchen processing can proceed independently of arrivals.", "Armazene comandas para que o preparo avance independentemente das chegadas."),
    steps: [
      step("Enqueue the ticket", "Enfileire a comanda", "The counter publishes an order ticket without waiting for the kitchen to finish.", "O balcão publica uma comanda sem esperar a cozinha terminar o preparo.", "counter"),
      step("Workers consume", "Trabalhadores consomem", "Kitchen workers claim queued tickets according to the broker's delivery and ordering rules.", "Trabalhadores retiram comandas conforme as regras de entrega e ordenação do intermediário.", "kitchen"),
      step("Acknowledge completion", "Confirme o processamento", "A worker acknowledges successful processing; failures may cause redelivery and require duplicate protection.", "Um trabalhador confirma o processamento; falhas podem causar reentrega e exigem proteção contra duplicatas.", "pickup"),
    ],
  },
  "components/cdn": {
    slug: "components/cdn", path: "/componentes/cdn", mode: "cache", station: "branch",
    title: text("CDN (Content Delivery Network)", "Rede de Distribuição de Conteúdo (CDN)"),
    improvement: text("Serve menu images near customers without treating every object as instantly fresh.", "Entregue imagens do cardápio perto dos clientes sem presumir atualização instantânea."),
    steps: [
      step("Fetch the origin", "Busque na origem", "An uncached burger image travels from the restaurant's origin storage to an edge location.", "Uma imagem ausente viaja do armazenamento de origem até um ponto de presença.", "stock"),
      step("Serve nearby", "Entregue por perto", "Customers near that edge receive the cached image with less network travel.", "Clientes próximos recebem a imagem em cache com menor percurso de rede.", "branch"),
      step("Update the asset", "Atualize o arquivo", "Versioned image URLs or invalidation prevent old photos from surviving a menu redesign.", "Endereços versionados ou invalidação evitam fotos antigas após uma atualização do cardápio.", "terminal"),
    ],
  },
  "components/api-gateway": {
    slug: "components/api-gateway", path: "/componentes/api-gateway", mode: "routing", station: "entrance",
    title: text("API Gateway", "Gateway de API"),
    improvement: text("Put authentication and request routing at the restaurant's digital front door.", "Coloque autenticação e roteamento na entrada digital da hamburgueria."),
    steps: [
      step("Enter once", "Entre por um ponto", "The mobile app sends its order request to the gateway instead of locating every service.", "O aplicativo envia o pedido ao gateway sem localizar cada serviço individualmente.", "entrance"),
      step("Apply entry policies", "Aplique políticas de entrada", "The gateway checks credentials and request limits before forwarding the request.", "O gateway verifica credenciais e limites antes de encaminhar a solicitação.", "counter"),
      step("Route by purpose", "Encaminhe pela finalidade", "Menu queries and payment requests reach different services behind the same public interface.", "Consultas ao cardápio e pagamentos chegam a serviços distintos pela mesma interface pública.", "kitchen"),
    ],
  },
  "components/firewall": {
    slug: "components/firewall", path: "/componentes/firewall", mode: "security", station: "entrance",
    title: text("Firewall", "Firewall"),
    improvement: text("Restrict network access to the restaurant's internal services.", "Restrinja o acesso de rede aos serviços internos da hamburgueria."),
    steps: [
      step("Inspect the connection", "Inspecione a conexão", "An incoming connection is compared against allowed addresses, ports and network policies.", "Uma conexão recebida é comparada com endereços, portas e políticas permitidos.", "entrance"),
      step("Block a forbidden path", "Bloqueie um caminho proibido", "A direct public connection to the stock database is rejected.", "Uma conexão pública direta ao banco de estoque é rejeitada.", "stock"),
      step("Allow the service path", "Permita o caminho do serviço", "The authorized application connection proceeds; network access alone does not grant user permissions.", "A conexão autorizada do aplicativo avança; acesso de rede não concede permissões de usuário.", "terminal"),
    ],
  },
  "components/polling-webhooks": {
    slug: "components/polling-webhooks", path: "/componentes/polling-webhooks", mode: "events", station: "pickup",
    title: text("Polling vs Webhooks", "Consulta Periódica e Webhooks"),
    improvement: text("Compare repeatedly checking an order with receiving a signed status notification.", "Compare consultar repetidamente um pedido com receber uma notificação de estado assinada."),
    steps: [
      step("Keep asking", "Continue consultando", "The app polls the pickup service at intervals, even when order status has not changed.", "O aplicativo consulta a retirada periodicamente, mesmo sem alteração no estado do pedido.", "pickup"),
      step("Notify on change", "Notifique na mudança", "A webhook sends a status event to a registered endpoint when the order becomes ready.", "Um webhook envia um evento ao endereço cadastrado quando o pedido fica pronto.", "kitchen"),
      step("Verify and retry", "Verifique e tente novamente", "The receiver verifies authenticity and handles repeated webhook deliveries using the event identifier.", "O receptor verifica autenticidade e trata entregas repetidas usando o identificador do evento.", "terminal"),
    ],
  },
  "components/vector-database": {
    slug: "components/vector-database", path: "/componentes/vector-database", mode: "storage", station: "terminal",
    title: text("Vector Database", "Banco de Dados Vetorial"),
    improvement: text("Store menu embeddings so recommendations can retrieve meaning rather than exact words.", "Armazene vetores do cardápio para buscar significado além das palavras exatas."),
    steps: [
      step("Embed the menu", "Vetorize o cardápio", "An embedding model turns burger descriptions into numeric vectors stored with item identifiers.", "Um modelo transforma descrições dos hambúrgueres em vetores associados aos identificadores dos itens.", "stock"),
      step("Embed the request", "Vetorize a solicitação", "A request for something smoky becomes a query vector in the same embedding space.", "Um pedido por algo defumado vira um vetor no mesmo espaço de representação.", "counter"),
      step("Retrieve neighbors", "Recupere os vizinhos", "The database retrieves nearby vectors; similarity suggests relevance but does not guarantee dietary safety.", "O banco recupera vetores próximos; similaridade sugere relevância, mas não garante segurança alimentar.", "terminal"),
    ],
  },
  "components/model-gateway": {
    slug: "components/model-gateway", path: "/componentes/model-gateway", mode: "ai", station: "terminal",
    title: text("Model Gateway", "Gateway de Modelos"),
    improvement: text("Route menu-assistant requests across model providers with explicit policies.", "Encaminhe solicitações do assistente entre provedores de modelos com políticas explícitas."),
    steps: [
      step("One model interface", "Uma interface de modelos", "The restaurant assistant sends a request through a common gateway API.", "O assistente da hamburgueria envia uma solicitação pela interface comum do gateway.", "counter"),
      step("Choose a provider", "Escolha um provedor", "The gateway selects a model using availability, cost and capability requirements.", "O gateway seleciona um modelo conforme disponibilidade, custo e capacidade necessária.", "terminal"),
      step("Bound the fallback", "Limite a alternativa", "An alternate provider must still satisfy privacy and response-format requirements.", "Um provedor alternativo ainda precisa atender aos requisitos de privacidade e formato.", "branch"),
    ],
  },
  "components/kafka-streaming": {
    slug: "components/kafka-streaming", path: "/componentes/kafka", mode: "events", station: "dispatch",
    title: text("Kafka & Event Streaming", "Kafka e Fluxos de Eventos"),
    improvement: text("Keep an ordered, replayable history of order events in a partitioned log.", "Mantenha um histórico de eventos ordenado e reprocessável em um registro particionado."),
    steps: [
      step("Append an event", "Acrescente um evento", "The order service appends an order-created event to a Kafka partition.", "O serviço acrescenta um evento de criação do pedido a uma partição do Kafka.", "counter"),
      step("Consume independently", "Consuma independentemente", "Kitchen and analytics consumers advance their own offsets through the retained log.", "Consumidores da cozinha e de análise avançam seus próprios marcadores pelo histórico retido.", "kitchen"),
      step("Replay deliberately", "Reprocesse com intenção", "Resetting an offset replays retained records; ordering is guaranteed within a partition.", "Reposicionar um marcador reprocessa registros retidos; a ordenação vale dentro de uma partição.", "terminal"),
    ],
  },
  "components/dns": {
    slug: "components/dns", path: "/componentes/dns", mode: "routing", station: "entrance",
    title: text("DNS — The Distributed Phone Book", "DNS — A Lista Telefônica Distribuída"),
    improvement: text("Resolve the restaurant's service name before connecting to its address.", "Resolva o nome do serviço da hamburgueria antes de conectar ao endereço."),
    steps: [
      step("Ask for the name", "Consulte o nome", "The ordering app asks its resolver for the address of the restaurant's domain.", "O aplicativo pede ao resolvedor o endereço do domínio da hamburgueria.", "entrance"),
      step("Follow the hierarchy", "Siga a hierarquia", "A cache miss may require recursive resolution through DNS delegations to authoritative records.", "Uma consulta sem cópia pode percorrer delegações de DNS até os registros autoritativos.", "dispatch"),
      step("Cache with a lifetime", "Armazene com validade", "Resolvers cache the answer for its TTL, so address changes may take time to propagate.", "Resolvedores guardam a resposta pelo TTL; mudanças de endereço podem demorar a se propagar.", "terminal"),
    ],
  },
  "components/reverse-proxy": {
    slug: "components/reverse-proxy", path: "/componentes/reverse-proxy", mode: "routing", station: "entrance",
    title: text("Reverse Proxy", "Proxy Reverso"),
    improvement: text("Place a proxy in front of the menu and ordering backends.", "Coloque um proxy à frente dos serviços de cardápio e pedidos."),
    steps: [
      step("Accept the connection", "Aceite a conexão", "The public client connects to the reverse proxy rather than directly to an internal server.", "O cliente público conecta ao proxy reverso em vez de acessar diretamente um servidor interno.", "entrance"),
      step("Forward upstream", "Encaminhe ao serviço", "The proxy forwards the request to the appropriate backend and relays its response.", "O proxy encaminha a solicitação ao serviço adequado e devolve a resposta.", "counter"),
      step("Centralize shared handling", "Centralize o tratamento comum", "Configured TLS termination, caching or load balancing can be handled at this shared edge.", "Terminação TLS, cache ou balanceamento configurados podem funcionar nessa entrada compartilhada.", "terminal"),
    ],
  },
  "components/service-discovery": {
    slug: "components/service-discovery", path: "/componentes/service-discovery", mode: "routing", station: "kitchen",
    title: text("Service Discovery", "Descoberta de Serviços"),
    improvement: text("Find changing kitchen service instances without hard-coded addresses.", "Encontre instâncias móveis da cozinha sem endereços fixos no código."),
    steps: [
      step("Register a worker", "Cadastre um trabalhador", "A new kitchen instance registers its service address and readiness information.", "Uma nova instância da cozinha cadastra seu endereço e suas informações de prontidão.", "kitchen"),
      step("Resolve the service", "Localize o serviço", "The ordering service queries discovery rather than remembering one worker's old address.", "O serviço de pedidos consulta a descoberta em vez de memorizar um endereço antigo.", "counter"),
      step("Refresh membership", "Atualize os participantes", "Unhealthy or expired registrations are removed so future requests find available instances.", "Cadastros expirados ou indisponíveis são retirados para direcionar solicitações a instâncias disponíveis.", "terminal"),
    ],
  },
  "components/service-mesh": {
    slug: "components/service-mesh", path: "/componentes/service-mesh", mode: "network", station: "kitchen",
    title: text("Service Mesh", "Malha de Serviços"),
    improvement: text("Give internal service calls consistent transport policies and telemetry.", "Dê às chamadas internas políticas de transporte e telemetria consistentes."),
    steps: [
      step("Make a service call", "Faça uma chamada interna", "The order service calls the kitchen service through the mesh's data plane.", "O serviço de pedidos chama a cozinha pelo plano de dados da malha.", "counter"),
      step("Apply traffic policy", "Aplique a política de tráfego", "The mesh can enforce mutual TLS and configured traffic limits between service identities.", "A malha pode aplicar TLS mútuo e limites de tráfego entre identidades de serviços.", "kitchen"),
      step("Observe the hop", "Observe o trecho", "Transport telemetry records the call; the mesh does not replace application authorization or business logic.", "A telemetria registra a chamada; a malha não substitui autorização nem regras de negócio.", "terminal"),
    ],
  },
  "components/kubernetes": {
    slug: "components/kubernetes", path: "/componentes/kubernetes", mode: "scaling", station: "kitchen",
    title: text("Kubernetes", "Kubernetes"),
    improvement: text("Keep the desired number of restaurant service replicas ready to work.", "Mantenha a quantidade desejada de réplicas dos serviços pronta para trabalhar."),
    steps: [
      step("Declare the desired state", "Declare o estado desejado", "A deployment requests several kitchen-service pods with resource limits and readiness checks.", "Uma implantação solicita vários pods da cozinha com limites de recursos e verificações de prontidão.", "terminal"),
      step("Schedule the workers", "Distribua os trabalhadores", "The scheduler places pods on suitable nodes; a service gives them a stable access point.", "O escalonador posiciona pods em nós adequados; um serviço fornece acesso estável.", "kitchen"),
      step("Reconcile a failure", "Reconcilie uma falha", "Controllers replace failed pods to restore desired state; durable data needs separate storage planning.", "Controladores substituem pods com falha; dados duráveis exigem planejamento próprio de armazenamento.", "stock"),
    ],
  },
  "design-principles/index": {
    slug: "design-principles/index", path: "/principios-design", mode: "counter", station: "terminal",
    title: text("Design Principles", "Princípios de Design"),
    improvement: text("Shape the restaurant's architecture around responsibilities and failure boundaries.", "Organize a arquitetura da hamburgueria por responsabilidades e limites de falha."),
    steps: [
      step("Separate responsibilities", "Separe responsabilidades", "Ordering, payment and preparation each receive a clear role in the digital workflow.", "Pedido, pagamento e preparo recebem papéis claros no fluxo digital.", "counter"),
      step("Connect through contracts", "Conecte por contratos", "Stations exchange defined messages instead of depending on each other's internal implementation.", "As estações trocam mensagens definidas sem depender da implementação interna das outras.", "kitchen"),
      step("Check the trade-off", "Confira a escolha", "Each extra boundary can improve isolation while adding communication and operational costs.", "Cada fronteira adicional pode melhorar o isolamento, mas acrescenta comunicação e custo operacional.", "terminal"),
    ],
  },
  "design-principles/event-driven": {
    slug: "design-principles/event-driven", path: "/principios-design/eventos", mode: "events", station: "kitchen",
    title: text("Event-Driven Development", "Desenvolvimento Orientado a Eventos"),
    improvement: text("Let services react to published order facts instead of direct chains of commands.", "Faça os serviços reagirem a fatos publicados sobre os pedidos."),
    steps: [
      step("Publish a fact", "Publique um fato", "The counter publishes that an order was accepted, describing something that already happened.", "O balcão publica que um pedido foi aceito, descrevendo algo que já aconteceu.", "counter"),
      step("Independent reactions", "Reações independentes", "Kitchen preparation and customer notifications subscribe independently to the accepted-order event.", "Preparo e notificações do cliente assinam independentemente o evento de pedido aceito.", "kitchen"),
      step("Handle delayed delivery", "Trate a entrega atrasada", "Consumers tolerate retries and delay because publishing does not mean every reaction has finished.", "Consumidores toleram repetição e atraso; publicar não significa que todas as reações terminaram.", "pickup"),
    ],
  },
  "design-principles/coupling": {
    slug: "design-principles/coupling", path: "/principios-design/acoplamento", mode: "network", station: "kitchen",
    title: text("Coupling in Distributed Systems", "Acoplamento em Sistemas Distribuídos"),
    improvement: text("Reduce how much a kitchen change forces the ordering service to change.", "Reduza quanto uma mudança na cozinha obriga o serviço de pedidos a mudar."),
    steps: [
      step("Expose a tight dependency", "Mostre uma dependência forte", "The counter reads private kitchen table fields, so a schema change breaks ordering.", "O balcão lê campos internos da cozinha; uma alteração no esquema quebra os pedidos.", "counter"),
      step("Introduce a contract", "Introduza um contrato", "A versioned order interface hides kitchen internals behind stable, documented messages.", "Uma interface versionada esconde detalhes da cozinha atrás de mensagens estáveis e documentadas.", "kitchen"),
      step("Change independently", "Altere com independência", "The kitchen changes its implementation while honoring the contract; compatibility still needs testing.", "A cozinha muda sua implementação mantendo o contrato; a compatibilidade ainda precisa ser testada.", "terminal"),
    ],
  },
  "design-principles/orchestration-vs-choreography": {
    slug: "design-principles/orchestration-vs-choreography", path: "/principios-design/orquestracao-vs-coreografia", mode: "saga", station: "kitchen",
    title: text("Orchestration vs Choreography", "Orquestração versus Coreografia"),
    improvement: text("Compare a central order coordinator with services reacting to one another's events.", "Compare um coordenador central com serviços que reagem aos eventos uns dos outros."),
    steps: [
      step("A coordinator directs", "Um coordenador orienta", "An order coordinator requests payment, then preparation, then dispatch, tracking each result.", "Um coordenador solicita pagamento, preparo e despacho, acompanhando o resultado de cada etapa.", "counter"),
      step("Events trigger reactions", "Eventos disparam reações", "In choreography, payment confirmation triggers preparation without a central workflow controller.", "Na coreografia, a confirmação do pagamento dispara o preparo sem um controlador central.", "kitchen"),
      step("Locate responsibility", "Localize a responsabilidade", "Central control simplifies workflow visibility; distributed reactions require careful event contracts and tracing.", "Controle central facilita acompanhar o fluxo; reações distribuídas exigem contratos e rastreamento cuidadosos.", "terminal"),
    ],
  },
  "design-principles/canary-deployment": {
    slug: "design-principles/canary-deployment", path: "/principios-design/canary-deployment", mode: "routing", station: "kitchen",
    title: text("Canary Deployment", "Implantação Canário"),
    improvement: text("Test a new kitchen-service version with a small, measurable share of real traffic.", "Teste uma nova versão da cozinha com uma parcela pequena e mensurável do tráfego."),
    steps: [
      step("Keep the stable version", "Mantenha a versão estável", "Most order requests continue reaching the existing kitchen-service release.", "A maioria dos pedidos continua chegando à versão existente do serviço da cozinha.", "kitchen"),
      step("Send a small sample", "Envie uma amostra pequena", "A controlled share reaches the candidate version while errors and latency are compared.", "Uma parcela controlada chega à versão candidata enquanto erros e latência são comparados.", "counter"),
      step("Promote or stop", "Promova ou interrompa", "Healthy results allow gradual promotion; regressions send traffic back to the stable release.", "Resultados saudáveis permitem promoção gradual; regressões devolvem o tráfego à versão estável.", "terminal"),
    ],
  },
  "design-principles/cqrs": {
    slug: "design-principles/cqrs", path: "/principios-design/cqrs", mode: "storage", station: "counter",
    title: text("CQRS — Command Query Responsibility Segregation", "CQRS — Segregação de responsabilidades de comandos e consultas"),
    improvement: text("Separate order-changing commands from menu and order-status read models.", "Separe comandos que alteram pedidos das projeções usadas nas consultas."),
    steps: [
      step("Handle a command", "Trate um comando", "An order command validates business rules and updates the authoritative write model.", "Um comando valida regras de negócio e atualiza o modelo autoritativo de escrita.", "counter"),
      step("Build a read view", "Monte uma visão de leitura", "Order events update a projection optimized for the pickup display's queries.", "Eventos atualizam uma projeção otimizada para as consultas do painel de retirada.", "pickup"),
      step("Expect projection delay", "Espere atraso na projeção", "An asynchronous display may lag behind an accepted command; read and write models need not match instantly.", "Um painel assíncrono pode atrasar após um comando aceito; as visões não mudam necessariamente juntas.", "terminal"),
    ],
  },
  "design-principles/rate-limiting": {
    slug: "design-principles/rate-limiting", path: "/principios-design/rate-limiting", mode: "queue", station: "entrance",
    title: text("Rate Limiting", "Limitação de Taxa"),
    improvement: text("Limit digital order requests before arrival volume overwhelms the restaurant.", "Limite solicitações digitais antes que o volume sobrecarregue a hamburgueria."),
    steps: [
      step("Measure an allowance", "Meça uma cota", "The entrance tracks a configured request allowance per client or identity.", "A entrada acompanha uma cota configurada de solicitações por cliente ou identidade.", "entrance"),
      step("Accept within the limit", "Aceite dentro do limite", "Requests with available allowance proceed to the ordering service.", "Solicitações com cota disponível avançam para o serviço de pedidos.", "counter"),
      step("Reject excess demand", "Rejeite o excesso", "Excess requests receive a retry policy; rate limiting does not create extra kitchen capacity.", "Solicitações excedentes recebem uma política de repetição; limitar taxa não cria capacidade na cozinha.", "kitchen"),
    ],
  },
  "design-principles/backpressure": {
    slug: "design-principles/backpressure", path: "/principios-design/backpressure", mode: "queue", station: "kitchen",
    title: text("Backpressure", "Controle de Pressão"),
    improvement: text("Let a saturated kitchen signal upstream services to slow their production.", "Faça a cozinha saturada sinalizar aos serviços anteriores que reduzam o ritmo."),
    steps: [
      step("Watch the backlog", "Observe o acúmulo", "Kitchen work falls behind and the order queue approaches its bounded capacity.", "O preparo fica para trás e a fila se aproxima da capacidade limitada.", "kitchen"),
      step("Signal upstream", "Sinalize para trás", "The consumer signals reduced capacity so the order producer slows or pauses.", "O consumidor sinaliza capacidade reduzida para que o produtor diminua ou pause o envio.", "counter"),
      step("Resume with capacity", "Retome com capacidade", "As the queue drains, demand resumes without allowing an unbounded memory backlog.", "Conforme a fila diminui, a demanda retorna sem permitir acúmulo ilimitado na memória.", "pickup"),
    ],
  },
  "design-principles/fault-tolerance": {
    slug: "design-principles/fault-tolerance", path: "/principios-design/tolerancia-falhas", mode: "recovery", station: "kitchen",
    title: text("Fault Tolerance", "Tolerância a Falhas"),
    improvement: text("Continue serving a defined workload despite one kitchen-service instance failing.", "Continue atendendo uma carga definida apesar da falha de uma instância da cozinha."),
    steps: [
      step("Introduce redundancy", "Introduza redundância", "More than one kitchen-service instance can process orders through the shared interface.", "Mais de uma instância da cozinha pode processar pedidos pela interface compartilhada.", "kitchen"),
      step("Lose one instance", "Perca uma instância", "One instance stops, and routing avoids it once failure is detected.", "Uma instância para e o roteamento a evita após detectar a falha.", "counter"),
      step("Preserve the essentials", "Preserve o essencial", "Remaining capacity and durable order records limit impact; redundant instances alone do not prevent every outage.", "Capacidade restante e registros duráveis limitam o impacto; redundância não evita toda indisponibilidade.", "stock"),
    ],
  },
  "design-principles/retries": {
    slug: "design-principles/retries", path: "/principios-design/tolerancia-falhas/retries", mode: "recovery", station: "counter",
    title: text("Retries", "Novas Tentativas"),
    improvement: text("Retry transient order failures with backoff and a stable operation identifier.", "Repita falhas transitórias com espera progressiva e identificador estável da operação."),
    steps: [
      step("A response disappears", "Uma resposta desaparece", "The payment service processes a request, but its acknowledgement never reaches the counter.", "O pagamento processa a solicitação, mas a confirmação não chega ao balcão.", "counter"),
      step("Wait before retrying", "Espere antes de repetir", "Backoff with jitter spreads retries instead of sending a synchronized burst.", "Espera progressiva com variação aleatória distribui tentativas em vez de sincronizar uma rajada.", "terminal"),
      step("Keep one logical operation", "Mantenha uma operação lógica", "An idempotency key lets the payment service recognize a repeated charge request.", "Uma chave de idempotência permite ao pagamento reconhecer uma solicitação de cobrança repetida.", "stock"),
    ],
  },
  "design-principles/circuit-breaker": {
    slug: "design-principles/circuit-breaker", path: "/principios-design/tolerancia-falhas/circuit-breaker", mode: "recovery", station: "counter",
    title: text("Circuit Breaker", "Disjuntor de Circuito"),
    improvement: text("Stop repeatedly calling a failing delivery dependency while it recovers.", "Interrompa chamadas repetidas a uma dependência de entrega com falha."),
    steps: [
      step("Count dependency failures", "Conte falhas da dependência", "Repeated delivery-service failures reach the circuit's configured threshold.", "Falhas repetidas no serviço de entrega atingem o limite configurado do circuito.", "dispatch"),
      step("Open the circuit", "Abra o circuito", "The order service rejects dependent calls quickly instead of consuming resources on likely failures.", "O serviço recusa chamadas dependentes rapidamente, evitando gastar recursos com falhas prováveis.", "counter"),
      step("Probe recovery", "Teste a recuperação", "A limited half-open probe checks recovery before normal traffic resumes.", "Um teste limitado no estado entreaberto verifica a recuperação antes de retomar o tráfego.", "terminal"),
    ],
  },
  "design-principles/timeout": {
    slug: "design-principles/timeout", path: "/principios-design/tolerancia-falhas/timeout", mode: "network", station: "counter",
    title: text("Timeout", "Tempo Limite"),
    improvement: text("Bound how long an order request waits for a remote dependency.", "Limite quanto um pedido espera por uma dependência remota."),
    steps: [
      step("Start a deadline", "Inicie um prazo", "The counter gives the remote payment request a deadline inside the overall order budget.", "O balcão define um prazo para o pagamento dentro do limite total do pedido.", "counter"),
      step("The deadline expires", "O prazo termina", "No response arrives in time, so the caller stops waiting and releases its resources.", "A resposta não chega a tempo; o chamador para de esperar e libera recursos.", "terminal"),
      step("Check uncertain results", "Confira resultados incertos", "A timeout does not prove payment failed or cancel remote work; verify state before retrying.", "Um tempo esgotado não prova falha nem cancela trabalho remoto; confira o estado antes de repetir.", "stock"),
    ],
  },
  "design-principles/fallback": {
    slug: "design-principles/fallback", path: "/principios-design/tolerancia-falhas/fallback", mode: "recovery", station: "pickup",
    title: text("Fallback", "Alternativa de Contingência (Plano B)"),
    improvement: text("Offer a clearly limited alternative when a recommendation dependency fails.", "Ofereça uma alternativa explicitamente limitada quando a recomendação falha."),
    steps: [
      step("Request personalization", "Peça personalização", "The menu assistant requests personalized burger recommendations from a remote service.", "O assistente solicita recomendações personalizadas a um serviço remoto.", "terminal"),
      step("Detect unavailability", "Detecte a indisponibilidade", "The remote service times out, so the normal recommendation path cannot finish.", "O serviço remoto excede o prazo e o caminho normal não consegue terminar.", "counter"),
      step("Show a safe alternative", "Mostre uma alternativa segura", "A static popular-items menu remains usable, clearly identified as non-personalized and checked for current availability.", "Um cardápio de populares continua utilizável, identificado como não personalizado e com disponibilidade verificada.", "pickup"),
    ],
  },
  "design-principles/scalability": {
    slug: "design-principles/scalability", path: "/principios-design/escalabilidade", mode: "scaling", station: "kitchen",
    title: text("Design for Scalability", "Design para Escalabilidade"),
    improvement: text("Grow restaurant throughput by finding the resource that actually limits orders.", "Aumente o atendimento identificando o recurso que realmente limita os pedidos."),
    steps: [
      step("Measure demand and capacity", "Meça demanda e capacidade", "Rising lunch arrivals increase queue length once sustained demand exceeds service capacity.", "As chegadas do almoço aumentam a fila quando a demanda sustentada supera a capacidade.", "entrance"),
      step("Find the limiting stage", "Encontre a etapa limitante", "Compare counter, kitchen and database utilization before choosing what to expand.", "Compare a utilização do balcão, da cozinha e do banco antes de escolher o que ampliar.", "kitchen"),
      step("Scale and measure again", "Amplie e meça novamente", "After expansion, test end-to-end throughput because the bottleneck can move elsewhere.", "Após ampliar, teste a vazão completa porque o gargalo pode mudar de lugar.", "terminal"),
    ],
  },
  "design-principles/horizontal-scaling": {
    slug: "design-principles/horizontal-scaling", path: "/principios-design/escalabilidade/horizontal", mode: "scaling", station: "branch",
    title: text("Horizontal Scalability (Scale-Out)", "Escalabilidade Horizontal (Scale-Out)"),
    improvement: text("Add parallel kitchen-service instances and distribute work safely.", "Adicione instâncias paralelas da cozinha e distribua o trabalho com segurança."),
    steps: [
      step("Add another worker", "Adicione outro trabalhador", "A new kitchen-service instance joins the available processing pool.", "Uma nova instância da cozinha entra no conjunto disponível de processamento.", "kitchen"),
      step("Distribute requests", "Distribua solicitações", "The routing layer spreads independent order work across the instances.", "A camada de roteamento distribui trabalho independente entre as instâncias.", "counter"),
      step("Handle shared limits", "Trate limites compartilhados", "Shared inventory and database capacity still need coordination; doubling workers does not guarantee double throughput.", "Estoque e banco compartilhados ainda exigem coordenação; dobrar trabalhadores não garante dobrar a vazão.", "stock"),
    ],
  },
  "design-principles/vertical-scaling": {
    slug: "design-principles/vertical-scaling", path: "/principios-design/escalabilidade/vertical", mode: "scaling", station: "kitchen",
    title: text("Vertical Scalability (Scale-Up)", "Escalabilidade Vertical (Scale-Up)"),
    improvement: text("Give one kitchen-service machine more resources while recognizing its ceiling.", "Dê mais recursos a uma máquina da cozinha reconhecendo seu limite."),
    steps: [
      step("Inspect resource pressure", "Inspecione a pressão nos recursos", "A kitchen-service machine runs short of CPU or memory under the current workload.", "Uma máquina da cozinha fica sem CPU ou memória suficientes para a carga atual.", "terminal"),
      step("Increase machine capacity", "Aumente a capacidade da máquina", "A larger instance supplies more resources without adding another service replica.", "Uma instância maior fornece mais recursos sem acrescentar outra réplica do serviço.", "kitchen"),
      step("Recognize the ceiling", "Reconheça o limite", "Hardware limits, cost and possible restart time constrain further growth and leave a failure boundary.", "Limites de hardware, custo e possível reinicialização restringem o crescimento e mantêm uma fronteira de falha.", "counter"),
    ],
  },
  "design-principles/data-consistency": {
    slug: "design-principles/data-consistency", path: "/principios-design/escalabilidade/consistencia", mode: "replication", station: "stock",
    title: text("Data Consistency", "Consistência de Dados"),
    improvement: text("Keep digital inventory changes valid across concurrent orders and replicas.", "Mantenha válidas as alterações de estoque entre pedidos concorrentes e réplicas."),
    steps: [
      step("Concurrent stock requests", "Solicitações concorrentes ao estoque", "Two counters request the final available item at almost the same time.", "Dois caixas solicitam o último item disponível quase ao mesmo tempo.", "counter"),
      step("Enforce the invariant", "Preserve a regra", "A conditional transactional update prevents both orders from reserving the same remaining unit.", "Uma atualização transacional condicional impede que ambos reservem a mesma unidade restante.", "stock"),
      step("Publish the accepted state", "Publique o estado aceito", "Replicas receive the committed change according to their consistency guarantees, potentially with delay.", "As réplicas recebem a alteração confirmada conforme suas garantias de consistência, possivelmente com atraso.", "branch"),
    ],
  },
  "design-principles/latency": {
    slug: "design-principles/latency", path: "/principios-design/escalabilidade/latencia", mode: "delivery", station: "dispatch",
    title: text("Latency", "Latência"),
    improvement: text("Break order-response time into queueing, service and network delays.", "Divida o tempo de resposta entre espera, processamento e rede."),
    steps: [
      step("Start the clock", "Inicie a medição", "A customer submits an order; the latency budget starts before any kitchen work.", "O cliente envia um pedido; o tempo começa antes de qualquer trabalho na cozinha.", "entrance"),
      step("Account for every stage", "Conte cada etapa", "Network hops, waiting in queues and service execution all contribute to response time.", "Percursos de rede, espera em filas e execução dos serviços contribuem para o tempo de resposta.", "kitchen"),
      step("Inspect the slow tail", "Inspecione a cauda lenta", "Compare high-percentile latency with the median; a fast average can hide customers waiting much longer.", "Compare percentis altos com a mediana; uma média rápida pode esconder esperas muito maiores.", "terminal"),
    ],
  },
  "design-principles/failover": {
    slug: "design-principles/failover", path: "/principios-design/escalabilidade/failover", mode: "recovery", station: "branch",
    title: text("Failover in Distributed Systems", "Comutação por Falha em Sistemas Distribuídos"),
    improvement: text("Move service responsibility to a healthy standby without allowing two active owners.", "Transfira o serviço para uma reserva saudável sem permitir dois responsáveis ativos."),
    steps: [
      step("The primary stops responding", "O principal deixa de responder", "The active order service stops answering health checks and requests.", "O serviço ativo de pedidos deixa de responder às verificações e solicitações.", "counter"),
      step("Promote with safeguards", "Promova com proteção", "A coordinated promotion selects a standby and fences the previous owner where required.", "Uma promoção coordenada escolhe a reserva e impede ações do responsável anterior quando necessário.", "branch"),
      step("Reconnect callers", "Reconecte os clientes", "Routing points to the new owner; recovery time and possible replication lag determine impact.", "O roteamento aponta ao novo responsável; tempo de recuperação e atraso de réplica determinam o impacto.", "terminal"),
    ],
  },
  "design-principles/availability": {
    slug: "design-principles/availability", path: "/principios-design/disponibilidade", mode: "recovery", station: "entrance",
    title: text("High Availability", "Alta Disponibilidade"),
    improvement: text("Keep the ordering path usable by avoiding single points of failure.", "Mantenha o caminho dos pedidos utilizável evitando pontos únicos de falha."),
    steps: [
      step("Find the critical path", "Encontre o caminho crítico", "Ordering depends on entry routing, a working application instance and available order storage.", "Os pedidos dependem da entrada, de uma instância funcional e do armazenamento disponível.", "entrance"),
      step("Remove shared weak points", "Retire fragilidades compartilhadas", "Redundant instances help only when their power, network and storage dependencies are considered.", "Instâncias redundantes ajudam quando suas dependências de energia, rede e armazenamento são consideradas.", "kitchen"),
      step("Measure usable service", "Meça o serviço utilizável", "Availability is measured against defined successful requests, not merely whether a process is running.", "A disponibilidade considera solicitações bem-sucedidas definidas, não apenas se um processo está ligado.", "terminal"),
    ],
  },
  "design-principles/replication": {
    slug: "design-principles/replication", path: "/principios-design/disponibilidade/replicacao", mode: "replication", station: "stock",
    title: text("Replication in Distributed Systems", "Replicação em Sistemas Distribuídos"),
    improvement: text("Copy committed order records to another database instance for a defined purpose.", "Copie pedidos confirmados para outra instância do banco com uma finalidade definida."),
    steps: [
      step("Write to the primary", "Grave no principal", "The active order database accepts an update and records the change in its replication log.", "O banco ativo aceita uma atualização e registra a mudança em seu histórico de replicação.", "stock"),
      step("Copy the change", "Copie a alteração", "A replica applies transferred changes, synchronously or asynchronously according to configuration.", "Uma réplica aplica alterações recebidas, de forma síncrona ou assíncrona conforme a configuração.", "branch"),
      step("Choose the read path", "Escolha o caminho da leitura", "Replica reads may reduce primary load, but asynchronous lag affects freshness and failover loss.", "Leituras na réplica aliviam o principal, mas atraso assíncrono afeta atualização e perdas na promoção.", "counter"),
    ],
  },
  "design-principles/availability-zones": {
    slug: "design-principles/availability-zones", path: "/principios-design/disponibilidade/zonas", mode: "recovery", station: "branch",
    title: text("Availability Zones", "Zonas de Disponibilidade"),
    improvement: text("Spread service replicas across independent local infrastructure failure domains.", "Distribua réplicas entre domínios locais de falha de infraestrutura."),
    steps: [
      step("Identify a shared risk", "Identifique um risco compartilhado", "Two kitchen-service instances in one infrastructure zone can fail together.", "Duas instâncias da cozinha na mesma zona de infraestrutura podem falhar juntas.", "kitchen"),
      step("Place replicas separately", "Posicione réplicas separadamente", "Deploy service capacity and necessary data copies across different availability zones.", "Distribua capacidade dos serviços e cópias necessárias dos dados entre zonas de disponibilidade.", "branch"),
      step("Test zone loss", "Teste a perda de uma zona", "The surviving zones need sufficient capacity and reachable dependencies to continue serving.", "As zonas restantes precisam de capacidade suficiente e dependências acessíveis para continuar atendendo.", "terminal"),
    ],
  },
  "consistency-strategies/index": {
    slug: "consistency-strategies/index", path: "/estrategias-de-consistencia", mode: "consensus", station: "stock",
    title: text("Consistency Strategies", "Estratégias de Consistência"),
    improvement: text("Choose how restaurant replicas coordinate writes and interpret concurrent updates.", "Escolha como as réplicas coordenam gravações e interpretam atualizações concorrentes."),
    steps: [
      step("Identify the shared decision", "Identifique a decisão compartilhada", "Both counters want to update a shared order record while preserving its business rules.", "Ambos os caixas querem alterar um pedido compartilhado preservando as regras de negócio.", "counter"),
      step("Select a coordination model", "Escolha a coordenação", "Transactions, consensus or mergeable data fit different requirements and failure assumptions.", "Transações, consenso ou dados mescláveis atendem requisitos e hipóteses de falha diferentes.", "stock"),
      step("Read the resulting state", "Leia o estado resultante", "Readers observe the guarantees of the selected model, not a universal promise of instant agreement.", "Leitores observam as garantias do modelo escolhido, não uma promessa universal de acordo instantâneo.", "branch"),
    ],
  },
  "consistency-strategies/consensus": {
    slug: "consistency-strategies/consensus", path: "/estrategias-de-consistencia/consenso", mode: "consensus", station: "branch",
    title: text("Consensus Strategies", "Estratégias de Consenso"),
    improvement: text("Agree on a committed sequence of menu revisions across replicated servers.", "Concorde sobre uma sequência confirmada de revisões do cardápio entre servidores replicados."),
    steps: [
      step("Propose through the leader", "Proponha pelo líder", "The active leader proposes a menu revision to the other replicated-log members.", "O líder ativo propõe uma revisão aos demais participantes do registro replicado.", "counter"),
      step("Collect a quorum", "Reúna um quórum", "A majority acknowledges the log entry according to the consensus protocol's commit rules.", "Uma maioria confirma a entrada conforme as regras de confirmação do protocolo.", "branch"),
      step("Commit safely", "Confirme com segurança", "Committed history survives permitted failures; without a reachable majority, new commits may stop.", "O histórico confirmado resiste às falhas previstas; sem maioria acessível, novas confirmações podem parar.", "stock"),
    ],
  },
  "consistency-strategies/lamport-timestamps": {
    slug: "consistency-strategies/lamport-timestamps", path: "/estrategias-de-consistencia/lamport-timestamps", mode: "events", station: "counter",
    title: text("Lamport Logical Clocks", "Relógios Lógicos de Lamport"),
    improvement: text("Track causal ordering between order messages without pretending to measure real time.", "Acompanhe a ordem causal das mensagens sem fingir medir o tempo real."),
    steps: [
      step("Advance on a local event", "Avance em um evento local", "The counter increments its logical clock when it records a new order event.", "O balcão incrementa seu relógio lógico ao registrar um novo evento do pedido.", "counter"),
      step("Carry the timestamp", "Leve a marca temporal", "An order message carries its clock value to the kitchen.", "Uma mensagem de pedido leva o valor do relógio até a cozinha.", "kitchen"),
      step("Merge and increment", "Combine e incremente", "The receiver advances beyond both values; ordered timestamps alone cannot prove that one event caused another.", "O receptor avança além dos dois valores; marcas ordenadas sozinhas não provam causalidade.", "terminal"),
    ],
  },
  "consistency-strategies/two-phase-commit": {
    slug: "consistency-strategies/two-phase-commit", path: "/estrategias-de-consistencia/two-phase-commit", mode: "saga", station: "stock",
    title: text("Two-Phase Commit (2PC)", "Confirmação em Duas Fases (2PC)"),
    improvement: text("Coordinate an atomic digital order-and-payment transaction across participating resources.", "Coordene uma transação digital atômica entre pedido e pagamento participantes."),
    steps: [
      step("Prepare each participant", "Prepare cada participante", "The coordinator asks transactional participants whether they can commit their pending changes.", "O coordenador pergunta aos participantes transacionais se podem confirmar as alterações pendentes.", "counter"),
      step("Record the decision", "Registre a decisão", "Only after all required votes agree does the coordinator durably choose commit.", "Somente após todos os votos necessários concordarem o coordenador registra a confirmação.", "stock"),
      step("Finish or wait", "Finalize ou espere", "Participants follow the decision; a prepared participant may block if it cannot learn that decision.", "Participantes seguem a decisão; um participante preparado pode bloquear sem conseguir consultá-la.", "branch"),
    ],
  },
  "consistency-strategies/synchronization": {
    slug: "consistency-strategies/synchronization", path: "/estrategias-de-consistencia/sincronizacao", mode: "consensus", station: "kitchen",
    title: text("Synchronization in Distributed Systems", "Sincronização em Sistemas Distribuídos"),
    improvement: text("Coordinate concurrent access to the restaurant's shared digital inventory.", "Coordene o acesso concorrente ao estoque digital compartilhado."),
    steps: [
      step("Expose concurrent access", "Mostre o acesso concorrente", "Two order workers read the same remaining stock value before either updates it.", "Dois trabalhadores leem o mesmo estoque restante antes que qualquer um o altere.", "counter"),
      step("Protect the update", "Proteja a atualização", "An appropriate transaction or synchronization primitive serializes the conflicting reservation changes.", "Uma transação ou primitiva adequada serializa alterações conflitantes de reserva.", "stock"),
      step("Release and continue", "Libere e continue", "After the protected operation finishes, the next worker checks the newly committed state.", "Após a operação protegida, o próximo trabalhador verifica o novo estado confirmado.", "kitchen"),
    ],
  },
  "consistency-strategies/synchronization-fundamentals": {
    slug: "consistency-strategies/synchronization-fundamentals", path: "/estrategias-de-consistencia/sincronizacao/fundamentos", mode: "queue", station: "stock",
    title: text("Synchronization Fundamentals", "Fundamentos da Sincronização"),
    improvement: text("Make the critical section and ownership rules visible around a shared order counter.", "Torne visíveis a região crítica e as regras de posse de um contador compartilhado."),
    steps: [
      step("A lost update", "Uma atualização perdida", "Two workers independently read and overwrite the same digital order count.", "Dois trabalhadores leem e sobrescrevem independentemente o mesmo contador digital de pedidos.", "counter"),
      step("Enter the critical section", "Entre na região crítica", "Mutual exclusion allows one holder at a time to perform the protected read-modify-write operation.", "A exclusão mútua permite um detentor por vez na operação protegida de leitura e alteração.", "stock"),
      step("Choose the right scope", "Escolha o escopo correto", "A process-local mutex protects one process; coordinating separate servers requires a suitable distributed mechanism.", "Uma trava local protege um processo; servidores separados exigem um mecanismo distribuído adequado.", "branch"),
    ],
  },
  "consistency-strategies/synchronization-deadlocks": {
    slug: "consistency-strategies/synchronization-deadlocks", path: "/estrategias-de-consistencia/sincronizacao/deadlocks", mode: "queue", station: "kitchen",
    title: text("Deadlocks in Distributed Systems", "Deadlocks em Sistemas Distribuídos"),
    improvement: text("Reveal a circular wait between order workers holding digital resource locks.", "Revele uma espera circular entre trabalhadores que seguram bloqueios digitais."),
    steps: [
      step("Acquire opposite resources", "Adquira recursos opostos", "One worker locks inventory while another locks payment; each still needs the other's resource.", "Um trabalhador bloqueia o estoque e outro o pagamento; cada um ainda precisa do outro recurso.", "stock"),
      step("The cycle stalls", "O ciclo trava", "Both workers wait without releasing what they hold, forming a deadlock.", "Ambos esperam sem liberar o que seguram, formando um impasse.", "kitchen"),
      step("Break the cycle", "Quebre o ciclo", "Consistent lock ordering or a detected transaction abort lets one operation retry safely.", "Uma ordem consistente de bloqueios ou o cancelamento detectado de uma transação permite retomar com segurança.", "terminal"),
    ],
  },
  "consistency-strategies/saga": {
    slug: "consistency-strategies/saga", path: "/estrategias-de-consistencia/saga", mode: "saga", station: "dispatch",
    title: text("The Saga Pattern", "O Padrão Saga"),
    improvement: text("Use local transactions and explicit compensations for a multi-service order workflow.", "Use transações locais e compensações explícitas num pedido que atravessa serviços."),
    steps: [
      step("Commit local steps", "Confirme etapas locais", "The order workflow reserves stock and authorizes payment in separate local transactions.", "O fluxo reserva estoque e autoriza pagamento em transações locais separadas.", "stock"),
      step("A later step fails", "Uma etapa posterior falha", "Delivery booking fails after earlier steps have committed, so one global rollback is unavailable.", "A reserva de entrega falha após confirmações anteriores; não existe uma reversão global única.", "dispatch"),
      step("Run compensations", "Execute compensações", "Release the reservation and void authorization where possible; compensation is a new action, not time reversal.", "Libere a reserva e cancele a autorização quando possível; compensar é agir novamente, não voltar no tempo.", "counter"),
    ],
  },
  "consistency-strategies/delivery-semantics": {
    slug: "consistency-strategies/delivery-semantics", path: "/estrategias-de-consistencia/delivery-semantics", mode: "delivery", station: "pickup",
    title: text("Delivery Semantics", "Semânticas de Entrega"),
    improvement: text("Distinguish message delivery guarantees from whether a physical burger is made once.", "Diferencie garantias de entrega de mensagens de preparar um hambúrguer uma única vez."),
    steps: [
      step("An acknowledgement is lost", "Uma confirmação se perde", "The kitchen consumes an order event, but the broker does not receive its acknowledgement.", "A cozinha consome um evento, mas o intermediário não recebe a confirmação.", "kitchen"),
      step("Redeliver the message", "Reentregue a mensagem", "At-least-once delivery may send the same event again; at-most-once can lose an event.", "Entrega ao menos uma vez pode repetir o evento; no máximo uma vez pode perdê-lo.", "counter"),
      step("Deduplicate side effects", "Elimine efeitos duplicados", "A durable order identifier protects supported digital effects; exactly-once claims need a clearly defined boundary.", "Um identificador durável protege efeitos digitais previstos; exatamente uma vez exige uma fronteira definida.", "stock"),
    ],
  },
  "consistency-strategies/vector-clocks": {
    slug: "consistency-strategies/vector-clocks", path: "/estrategias-de-consistencia/vector-clocks", mode: "replication", station: "branch",
    title: text("Vector Clocks", "Relógios Vetoriais"),
    improvement: text("Distinguish concurrent menu edits from edits that causally follow one another.", "Diferencie edições concorrentes do cardápio de edições causalmente posteriores."),
    steps: [
      step("Track per-replica changes", "Acompanhe mudanças por réplica", "Each branch maintains a vector that advances its own component when editing the menu.", "Cada filial mantém um vetor que avança seu próprio componente ao editar o cardápio.", "branch"),
      step("Compare the vectors", "Compare os vetores", "One vector dominating another indicates causal succession; incomparable vectors reveal concurrent changes.", "Um vetor dominante indica sucessão causal; vetores incomparáveis revelam alterações concorrentes.", "terminal"),
      step("Merge with domain rules", "Mescle com regras do domínio", "Combine causal metadata and resolve the actual menu conflict using an explicit application policy.", "Combine metadados causais e resolva o conflito do cardápio com uma política explícita.", "stock"),
    ],
  },
  "security/index": {
    slug: "security/index", path: "/seguranca", mode: "security", station: "entrance",
    title: text("Security in Distributed Systems", "Segurança em Sistemas Distribuídos"),
    improvement: text("Protect the restaurant's requests, identities and data across every station.", "Proteja solicitações, identidades e dados em todas as estações."),
    steps: [
      step("Identify the caller", "Identifique quem chama", "The ordering system establishes which customer or service is making a request.", "O sistema determina qual cliente ou serviço está fazendo uma solicitação.", "entrance"),
      step("Check the action", "Verifique a ação", "A recognized customer may view their order without receiving permission to edit menu prices.", "Um cliente reconhecido pode ver seu pedido sem receber permissão para editar preços.", "counter"),
      step("Protect the whole path", "Proteja o caminho inteiro", "Transport protection, input validation and least privilege work together across service boundaries.", "Proteção de transporte, validação e menor privilégio atuam juntas entre os serviços.", "terminal"),
    ],
  },
  "security/authentication": {
    slug: "security/authentication", path: "/seguranca/autenticacao", mode: "security", station: "entrance",
    title: text("Authentication in Distributed Systems", "Autenticação em Sistemas Distribuídos"),
    improvement: text("Establish who is signing in to the restaurant's ordering system.", "Determine quem está entrando no sistema de pedidos."),
    steps: [
      step("Present credentials", "Apresente credenciais", "A customer or staff member presents credentials through a trusted sign-in flow.", "Um cliente ou funcionário apresenta credenciais por um fluxo confiável de entrada.", "entrance"),
      step("Verify the identity", "Verifique a identidade", "The identity provider validates the credentials and returns a verifiable authentication result.", "O provedor valida as credenciais e devolve um resultado de autenticação verificável.", "terminal"),
      step("Create the session", "Crie a sessão", "The application establishes a protected session; being authenticated does not authorize every action.", "O aplicativo estabelece uma sessão protegida; autenticar não autoriza todas as ações.", "counter"),
    ],
  },
  "security/authorization": {
    slug: "security/authorization", path: "/seguranca/autorizacao", mode: "security", station: "stock",
    title: text("Authorization in Distributed Systems", "Autorização em Sistemas Distribuídos"),
    improvement: text("Enforce different permissions for customers, kitchen staff and restaurant managers.", "Aplique permissões diferentes a clientes, equipe da cozinha e gerência."),
    steps: [
      step("Read the identity", "Leia a identidade", "The server receives a verified caller identity alongside the requested operation.", "O servidor recebe uma identidade verificada junto da operação solicitada.", "entrance"),
      step("Evaluate permission", "Avalie a permissão", "Kitchen staff may update preparation status, while only authorized managers can change prices.", "A cozinha pode atualizar o preparo, enquanto apenas a gerência autorizada altera preços.", "kitchen"),
      step("Enforce ownership", "Verifique a propriedade", "Every order lookup also checks ownership or staff scope; hiding a button is insufficient.", "Cada consulta confere propriedade ou escopo da equipe; esconder um botão não basta.", "stock"),
    ],
  },
  "security/cryptography": {
    slug: "security/cryptography", path: "/seguranca/criptografia", mode: "security", station: "stock",
    title: text("Cryptography in Distributed Systems", "Criptografia em Sistemas Distribuídos"),
    improvement: text("Protect restaurant data with distinct tools for secrecy, integrity and password storage.", "Proteja dados com ferramentas distintas para sigilo, integridade e armazenamento de senhas."),
    steps: [
      step("Encrypt sensitive data", "Cifre dados sensíveis", "Encryption protects stored sensitive records when keys are separately controlled.", "A cifra protege registros sensíveis armazenados quando as chaves são controladas separadamente.", "stock"),
      step("Verify integrity", "Verifique a integridade", "An authenticated message or digital signature detects unauthorized alteration within its trust model.", "Uma mensagem autenticada ou assinatura detecta alterações não autorizadas conforme seu modelo de confiança.", "counter"),
      step("Handle passwords differently", "Trate senhas de outra forma", "Passwords need salted, adaptive password hashing; reversible encryption or a plain fast hash is unsuitable.", "Senhas exigem derivação adaptativa com sal; cifra reversível ou um hash rápido simples não servem.", "terminal"),
    ],
  },
  "security/tokens": {
    slug: "security/tokens", path: "/seguranca/tokens", mode: "security", station: "entrance",
    title: text("Tokens and JWT in Distributed Systems", "Tokens e JWT em Sistemas Distribuídos"),
    improvement: text("Validate a staff token before trusting its claims about restaurant access.", "Valide um token da equipe antes de confiar em suas declarações de acesso."),
    steps: [
      step("Receive the token", "Receba o token", "The terminal sends a signed access token with a request to update an order.", "O terminal envia um token assinado junto da solicitação para atualizar um pedido.", "entrance"),
      step("Validate its claims", "Valide as declarações", "The server verifies the allowed signature algorithm, issuer, audience and expiration.", "O servidor verifica algoritmo permitido, assinatura, emissor, destinatário e validade.", "terminal"),
      step("Apply authorization", "Aplique autorização", "Validated claims inform permission checks; a signed JWT payload is readable unless separately encrypted.", "Declarações válidas orientam permissões; o conteúdo de um JWT assinado é legível sem cifra adicional.", "counter"),
    ],
  },
  "security/ssl-tls": {
    slug: "security/ssl-tls", path: "/seguranca/ssl-tls", mode: "security", station: "dispatch",
    title: text("SSL/TLS in Distributed Systems", "SSL/TLS em Sistemas Distribuídos"),
    improvement: text("Secure the connection carrying order details between the app and the restaurant.", "Proteja a conexão que transporta detalhes dos pedidos até a hamburgueria."),
    steps: [
      step("Authenticate the endpoint", "Autentique o destino", "The client validates the server certificate and the intended restaurant hostname.", "O cliente valida o certificado do servidor e o nome esperado da hamburgueria.", "entrance"),
      step("Negotiate session keys", "Negocie chaves de sessão", "The TLS handshake establishes authenticated cryptographic parameters and session secrets.", "A negociação TLS estabelece parâmetros criptográficos autenticados e segredos de sessão.", "terminal"),
      step("Protect records in transit", "Proteja dados em trânsito", "Encrypted, integrity-protected traffic travels across the network; endpoint authorization remains a separate requirement.", "Tráfego cifrado e protegido contra alterações atravessa a rede; autorização no destino continua necessária.", "dispatch"),
    ],
  },
  "security/common-attacks": {
    slug: "security/common-attacks", path: "/seguranca/ataques", mode: "security", station: "entrance",
    title: text("Attacks on Distributed Systems", "Ataques em Sistemas Distribuídos"),
    improvement: text("Reject malicious order input and enforce access rules on the server.", "Rejeite entradas maliciosas e aplique regras de acesso no servidor."),
    steps: [
      step("An attacker crafts input", "Um invasor prepara a entrada", "A forged request tries to change another customer's order or alter a database query.", "Uma solicitação forjada tenta alterar o pedido de outro cliente ou manipular uma consulta.", "entrance"),
      step("Enforce safe boundaries", "Aplique limites seguros", "Parameterized queries, validation and server-side authorization stop different classes of attack.", "Consultas parametrizadas, validação e autorização no servidor barram classes distintas de ataque.", "stock"),
      step("Limit impact and detect", "Limite o impacto e detecte", "Least privilege, request limits and security telemetry reduce exposure when one defense is bypassed.", "Menor privilégio, limites e telemetria reduzem a exposição quando uma defesa é contornada.", "terminal"),
    ],
  },
  "security/prompt-injection": {
    slug: "security/prompt-injection", path: "/seguranca/prompt-injection", mode: "security", station: "terminal",
    title: text("Prompt Injection & LLM Guardrails", "Injeção de Instruções e Proteções de LLM"),
    improvement: text("Keep untrusted menu documents from becoming instructions to the restaurant assistant.", "Impeça documentos não confiáveis de virarem instruções para o assistente."),
    steps: [
      step("Retrieve untrusted text", "Recupere texto não confiável", "A supplier document contains hidden instructions asking the assistant to reveal private order data.", "Um documento do fornecedor contém instruções para revelar dados privados de pedidos.", "stock"),
      step("Keep trust boundaries", "Mantenha limites de confiança", "The application treats retrieved text as data, with tightly scoped tools and explicit permission checks.", "O aplicativo trata o texto como dados, com ferramentas restritas e verificações explícitas.", "terminal"),
      step("Validate consequential actions", "Valide ações importantes", "Sensitive actions require independent authorization and confirmation; a prompt alone cannot guarantee protection.", "Ações sensíveis exigem autorização e confirmação independentes; uma instrução textual sozinha não garante proteção.", "counter"),
    ],
  },
  "monitoring/index": {
    slug: "monitoring/index", path: "/monitoramento-e-manutencao", mode: "observability", station: "terminal",
    title: text("Monitoring and Maintenance of Distributed Systems", "Monitoramento e Manutenção de Sistemas Distribuídos"),
    improvement: text("Give the restaurant a control point for measured service behavior and recovery.", "Dê à hamburgueria um ponto de acompanhamento dos serviços e da recuperação."),
    steps: [
      step("Collect operating signals", "Colete sinais da operação", "Counter, kitchen and delivery services emit metrics, logs and traces.", "Balcão, cozinha e entrega emitem métricas, registros e rastros.", "kitchen"),
      step("Connect signal to impact", "Conecte sinal e impacto", "The operator compares service behavior with customer-visible order success and waiting time.", "A operação compara o comportamento dos serviços com sucesso e espera percebidos pelos clientes.", "terminal"),
      step("Investigate and improve", "Investigue e melhore", "Useful evidence guides diagnosis, repair and follow-up improvements instead of merely decorating a dashboard.", "Evidências úteis orientam diagnóstico, correção e melhorias em vez de apenas decorar um painel.", "counter"),
    ],
  },
  "monitoring/metrics": {
    slug: "monitoring/metrics", path: "/monitoramento-e-manutencao/metricas", mode: "observability", station: "terminal",
    title: text("Metrics and KPIs in Distributed Systems", "Métricas e KPIs em Sistemas Distribuídos"),
    improvement: text("Measure arrival rate, waiting time and errors without mistaking activity for success.", "Meça chegadas, espera e erros sem confundir atividade com sucesso."),
    steps: [
      step("Count the flow", "Conte o fluxo", "Counters record order requests and failures; a gauge tracks current queue depth.", "Contadores registram solicitações e falhas; uma medida instantânea acompanha o tamanho atual da fila.", "counter"),
      step("Describe the distribution", "Descreva a distribuição", "A latency histogram shows how many requests fall into each waiting-time range.", "Um histograma de latência mostra quantas solicitações caem em cada faixa de espera.", "kitchen"),
      step("Choose useful dimensions", "Escolha dimensões úteis", "Compare service and region labels while avoiding unbounded per-order labels in metrics.", "Compare rótulos de serviço e região, evitando rótulos por pedido sem limite de quantidade.", "terminal"),
    ],
  },
  "monitoring/logs": {
    slug: "monitoring/logs", path: "/monitoramento-e-manutencao/logs", mode: "observability", station: "terminal",
    title: text("Logs and Tracing in Distributed Systems", "Registros e Rastreamento em Sistemas Distribuídos"),
    improvement: text("Record structured order events and connect them with a shared correlation identifier.", "Registre eventos estruturados e conecte-os por um identificador de correlação."),
    steps: [
      step("Record meaningful events", "Registre eventos úteis", "The counter logs an accepted order with timestamp, service, outcome and correlation identifier.", "O balcão registra pedido aceito com horário, serviço, resultado e identificador de correlação.", "counter"),
      step("Connect the evidence", "Conecte as evidências", "Kitchen and delivery entries reuse the correlation identifier to support investigation.", "Registros da cozinha e da entrega reutilizam o identificador para apoiar a investigação.", "dispatch"),
      step("Protect sensitive details", "Proteja detalhes sensíveis", "Search structured fields while redacting credentials and unnecessary customer data.", "Pesquise campos estruturados removendo credenciais e dados desnecessários dos clientes.", "terminal"),
    ],
  },
  "monitoring/alerts": {
    slug: "monitoring/alerts", path: "/monitoramento-e-manutencao/alertas", mode: "observability", station: "terminal",
    title: text("Alerts and Notifications in Distributed Systems", "Alertas e Notificações em Sistemas Distribuídos"),
    improvement: text("Notify the operator when sustained order failures require action.", "Avise a operação quando falhas sustentadas nos pedidos exigirem ação."),
    steps: [
      step("Detect customer impact", "Detecte impacto nos clientes", "Order failure rate stays above the chosen threshold for the configured evaluation window.", "A taxa de falhas permanece acima do limite durante a janela de avaliação definida.", "counter"),
      step("Route an actionable alert", "Encaminhe um alerta útil", "The alert names the affected service, severity and investigation link for the responsible operator.", "O alerta identifica serviço, gravidade e investigação para a pessoa responsável.", "terminal"),
      step("Confirm recovery", "Confirme a recuperação", "Recovery clears the condition; grouping and sensible windows avoid one notification per failed request.", "A recuperação encerra a condição; agrupamento e janelas adequadas evitam um aviso por falha.", "kitchen"),
    ],
  },
  "monitoring/performance": {
    slug: "monitoring/performance", path: "/monitoramento-e-manutencao/performance", mode: "observability", station: "kitchen",
    title: text("Performance Analysis in Distributed Systems", "Análise de Desempenho em Sistemas Distribuídos"),
    improvement: text("Find the slow stage with measurements before optimizing the order workflow.", "Encontre a etapa lenta com medições antes de otimizar os pedidos."),
    steps: [
      step("Reproduce the workload", "Reproduza a carga", "Apply a representative mix of menu reads, order submissions and status checks.", "Aplique uma mistura representativa de consultas ao cardápio, pedidos e verificações de estado.", "entrance"),
      step("Inspect saturation", "Inspecione a saturação", "Compare queueing time, resource utilization and service duration at each stage.", "Compare espera em filas, utilização de recursos e duração do serviço em cada etapa.", "kitchen"),
      step("Verify the improvement", "Verifique a melhoria", "Repeat the same workload after changing the bottleneck and compare end-to-end percentiles and throughput.", "Repita a mesma carga após alterar o gargalo e compare percentis completos e vazão.", "terminal"),
    ],
  },
  "monitoring/health-checks": {
    slug: "monitoring/health-checks", path: "/monitoramento-e-manutencao/health-checks", mode: "recovery", station: "kitchen",
    title: text("Health Checks in Distributed Systems", "Verificações de Saúde em Sistemas Distribuídos"),
    improvement: text("Distinguish a running kitchen process from one ready to accept orders.", "Diferencie um processo da cozinha em execução de outro pronto para aceitar pedidos."),
    steps: [
      step("Check liveness", "Verifique a execução", "A liveness check asks whether the process is functioning enough to avoid a restart.", "Uma verificação de execução avalia se o processo funciona o suficiente para evitar reinicialização.", "kitchen"),
      step("Check readiness", "Verifique a prontidão", "A readiness check determines whether this instance should receive new order traffic.", "Uma verificação de prontidão determina se a instância deve receber novos pedidos.", "counter"),
      step("Respect startup and dependencies", "Respeite início e dependências", "Startup grace periods and carefully chosen checks prevent restart loops during initialization or shared outages.", "Tolerância de inicialização e verificações criteriosas evitam ciclos de reinício e falhas compartilhadas.", "terminal"),
    ],
  },
  "monitoring/llm-observability": {
    slug: "monitoring/llm-observability", path: "/monitoramento-e-manutencao/llm-observability", mode: "observability", station: "terminal",
    title: text("LLM Observability", "Observabilidade de LLM"),
    improvement: text("Measure assistant quality, token cost and latency while protecting customer information.", "Meça qualidade, custo de tokens e latência protegendo as informações dos clientes."),
    steps: [
      step("Trace the assistant request", "Rastreie a solicitação", "A menu question produces retrieval and generation spans with model and prompt-version metadata.", "Uma pergunta gera rastros de busca e geração com metadados do modelo e da versão da instrução.", "counter"),
      step("Measure more than speed", "Meça além da velocidade", "Track token usage, time to first token and evaluated answer quality separately.", "Acompanhe uso de tokens, tempo até o primeiro token e qualidade avaliada separadamente.", "terminal"),
      step("Review safe evidence", "Revise evidências seguras", "Sample redacted interactions and evaluations without logging private customer details indiscriminately.", "Examine interações e avaliações com dados removidos, sem registrar indiscriminadamente detalhes privados.", "stock"),
    ],
  },
  "monitoring/distributed-tracing": {
    slug: "monitoring/distributed-tracing", path: "/monitoramento-e-manutencao/distributed-tracing", mode: "observability", station: "dispatch",
    title: text("Distributed Tracing", "Rastreamento Distribuído"),
    improvement: text("Follow one order request through counter, payment, kitchen and delivery services.", "Acompanhe uma solicitação por balcão, pagamento, cozinha e entrega."),
    steps: [
      step("Start the trace", "Inicie o rastro", "The entry service creates trace context and a span for the order request.", "O serviço de entrada cria contexto e um trecho de rastreamento para o pedido.", "counter"),
      step("Propagate context", "Propague o contexto", "Outgoing calls carry trace context, connecting payment and kitchen spans to the same request.", "Chamadas levam o contexto, conectando trechos de pagamento e cozinha à mesma solicitação.", "kitchen"),
      step("Locate the delay", "Localize a demora", "The trace waterfall reveals a slow downstream call or waiting period in the sampled request.", "A linha temporal revela uma chamada lenta ou espera na solicitação amostrada.", "terminal"),
    ],
  },
  "monitoring/slo-sli-sla": {
    slug: "monitoring/slo-sli-sla", path: "/monitoramento-e-manutencao/slo-sli-sla", mode: "observability", station: "terminal",
    title: text("SLO, SLI & Error Budgets", "SLO, SLI e Orçamentos de Erros"),
    improvement: text("Turn reliable online ordering into a measurable objective and error budget.", "Transforme a confiabilidade dos pedidos digitais em objetivo mensurável e orçamento de erros."),
    steps: [
      step("Define the indicator", "Defina o indicador", "An SLI measures the fraction of eligible orders that succeed within a stated latency limit.", "Um indicador mede a fração de pedidos elegíveis concluídos dentro do limite de latência.", "counter"),
      step("Set the objective", "Estabeleça o objetivo", "An SLO targets that indicator over a window; an SLA adds an explicit external agreement.", "Um objetivo define a meta na janela; um acordo de serviço acrescenta um compromisso externo explícito.", "terminal"),
      step("Spend the error budget", "Use o orçamento de erros", "Failures consume the allowed budget, informing release decisions and reliability work.", "Falhas consomem o orçamento permitido, orientando decisões de implantação e trabalho de confiabilidade.", "kitchen"),
    ],
  },
  "monitoring/chaos-engineering": {
    slug: "monitoring/chaos-engineering", path: "/monitoramento-e-manutencao/chaos-engineering", mode: "recovery", station: "kitchen",
    title: text("Chaos Engineering", "Engenharia do Caos"),
    improvement: text("Test a stated resilience hypothesis with a controlled restaurant-service fault.", "Teste uma hipótese de resiliência com uma falha controlada nos serviços."),
    steps: [
      step("State the hypothesis", "Declare a hipótese", "With spare capacity, losing one kitchen-service instance should preserve the order-success objective.", "Com capacidade de reserva, perder uma instância da cozinha deve preservar o objetivo de sucesso.", "terminal"),
      step("Inject a bounded fault", "Introduza uma falha limitada", "Stop one selected instance within an approved experiment boundary and monitor abort conditions.", "Pare uma instância selecionada dentro dos limites do experimento e acompanhe condições de interrupção.", "kitchen"),
      step("Compare and restore", "Compare e restaure", "Measure customer impact, restore normal service and improve the safeguards revealed by the experiment.", "Meça o impacto, restaure o serviço e melhore as proteções avaliadas pelo experimento.", "counter"),
    ],
  },
  "monitoring/disaster-recovery": {
    slug: "monitoring/disaster-recovery", path: "/monitoramento-e-manutencao/disaster-recovery", mode: "recovery", station: "stock",
    title: text("Disaster Recovery & Backups", "Recuperação de Desastres e Cópias de Segurança"),
    improvement: text("Restore usable restaurant data and service after a failure beyond normal failover.", "Restaure dados e serviços utilizáveis após uma falha além da promoção normal de réplicas."),
    steps: [
      step("Protect a recovery point", "Proteja um ponto de recuperação", "Versioned backups and retained logs preserve recoverable order data separately from live replicas.", "Cópias versionadas e registros retidos preservam dados recuperáveis separados das réplicas ativas.", "stock"),
      step("Restore in isolation", "Restaure isoladamente", "Recover into an isolated environment and replay supported logs to the chosen recovery point.", "Restaure em ambiente isolado e reaplique registros suportados até o ponto escolhido.", "branch"),
      step("Validate before reopening", "Valide antes de reabrir", "Check integrity and measure actual data loss and recovery time against RPO and RTO targets.", "Confira integridade e meça perda real e tempo de recuperação perante as metas RPO e RTO.", "terminal"),
    ],
  },
  "monitoring/multi-region": {
    slug: "monitoring/multi-region", path: "/monitoramento-e-manutencao/multi-region", mode: "replication", station: "branch",
    title: text("Multi-Region & Geo-Replication", "Múltiplas Regiões e Replicação Geográfica"),
    improvement: text("Serve distant customers while planning replication, routing and regional failures explicitly.", "Atenda clientes distantes planejando replicação, roteamento e falhas regionais."),
    steps: [
      step("Serve near the customer", "Atenda perto do cliente", "Regional restaurant services reduce the network distance for nearby users.", "Serviços regionais reduzem a distância de rede para os usuários próximos.", "branch"),
      step("Choose the write model", "Escolha o modelo de escrita", "Single-writer and multi-writer designs impose different latency, conflict and coordination requirements.", "Modelos de escritor único ou múltiplos escritores impõem requisitos distintos de latência, conflito e coordenação.", "stock"),
      step("Route through a failure", "Encaminhe durante uma falha", "Regional failover needs healthy capacity and an explicit plan for replica lag and conflicting writes.", "A recuperação regional exige capacidade saudável e um plano para atraso de réplicas e conflitos.", "dispatch"),
    ],
  },
  "ai-systems/index": {
    slug: "ai-systems/index", path: "/sistemas-ia", mode: "ai", station: "terminal",
    title: text("AI & LLM Systems", "Sistemas de IA e LLMs"),
    improvement: text("Add an assistant whose answers and actions stay connected to trusted restaurant systems.", "Adicione um assistente com respostas e ações conectadas a sistemas confiáveis da hamburgueria."),
    steps: [
      step("Receive a question", "Receba uma pergunta", "A customer asks the restaurant assistant for a suitable burger recommendation.", "Um cliente pede ao assistente uma recomendação adequada de hambúrguer.", "counter"),
      step("Supply trusted context", "Forneça contexto confiável", "The application retrieves menu facts and applies access policies before calling the model.", "O aplicativo recupera fatos do cardápio e aplica políticas de acesso antes de chamar o modelo.", "stock"),
      step("Check the result", "Confira o resultado", "Generated text needs evaluation and grounding; the model does not replace inventory or permission checks.", "O texto gerado exige avaliação e fontes; o modelo não substitui estoque nem verificação de permissões.", "terminal"),
    ],
  },
  "ai-systems/llm-serving-fundamentals": {
    slug: "ai-systems/llm-serving-fundamentals", path: "/sistemas-ia/llm-serving-fundamentals", mode: "ai", station: "terminal",
    title: text("LLM Serving Fundamentals", "Fundamentos de Inferência de LLM"),
    improvement: text("Observe how an assistant request becomes queued, batched and generated tokens.", "Observe uma solicitação virar fila, lote e tokens gerados."),
    steps: [
      step("Prepare model input", "Prepare a entrada do modelo", "The assistant tokenizes the customer's menu question and supplies the selected context.", "O assistente divide a pergunta em tokens e fornece o contexto selecionado.", "counter"),
      step("Prefill and decode", "Processe e gere", "Serving computes the prompt context, then generates output tokens using model and KV-cache resources.", "A inferência processa o contexto e gera tokens usando recursos do modelo e cache de chaves e valores.", "terminal"),
      step("Balance service capacity", "Equilibre a capacidade", "Batching improves resource use, while queueing and decode limits affect first-token and total latency.", "Agrupamento melhora o uso dos recursos; filas e limites de geração afetam a latência.", "kitchen"),
    ],
  },
  "ai-systems/rag": {
    slug: "ai-systems/rag", path: "/sistemas-ia/rag", mode: "ai", station: "stock",
    title: text("Retrieval-Augmented Generation (RAG)", "Geração Aumentada por Recuperação (RAG)"),
    improvement: text("Ground menu-assistant answers in retrieved restaurant documents and show their sources.", "Fundamente respostas em documentos recuperados e mostre suas fontes."),
    steps: [
      step("Retrieve relevant evidence", "Recupere evidências relevantes", "The system searches approved menu and ingredient documents for the customer's question.", "O sistema busca documentos aprovados de cardápio e ingredientes relacionados à pergunta.", "stock"),
      step("Build grounded context", "Monte um contexto fundamentado", "Selected passages and source identifiers join the model prompt within its context budget.", "Trechos selecionados e identificadores das fontes entram na instrução dentro do limite de contexto.", "terminal"),
      step("Answer with limits", "Responda com limites", "The assistant cites evidence and admits missing information; retrieval cannot guarantee a correct answer.", "O assistente cita evidências e reconhece lacunas; recuperar documentos não garante uma resposta correta.", "counter"),
    ],
  },
  "ai-systems/vector-search": {
    slug: "ai-systems/vector-search", path: "/sistemas-ia/vector-search", mode: "ai", station: "terminal",
    title: text("Vector Search", "Busca Vetorial"),
    improvement: text("Tune semantic menu retrieval by comparing query embeddings with indexed descriptions.", "Ajuste a busca semântica comparando vetores das consultas com descrições indexadas."),
    steps: [
      step("Represent the request", "Represente a solicitação", "The phrase a lighter grilled option becomes a vector using the same embedding model as the menu.", "A frase uma opção grelhada mais leve vira um vetor com o mesmo modelo do cardápio.", "counter"),
      step("Search the vector index", "Busque no índice vetorial", "Approximate neighbor search finds candidate dishes without comparing every vector exhaustively.", "A busca aproximada encontra pratos candidatos sem comparar exaustivamente todos os vetores.", "stock"),
      step("Filter and evaluate", "Filtre e avalie", "Apply availability and dietary filters, then evaluate recall and ranking against known relevant examples.", "Aplique filtros de disponibilidade e dieta; avalie recuperação e ordenação com exemplos relevantes conhecidos.", "terminal"),
    ],
  },
  "ai-systems/llm-gateway": {
    slug: "ai-systems/llm-gateway", path: "/sistemas-ia/llm-gateway", mode: "ai", station: "terminal",
    title: text("LLM Gateway", "Gateway de LLM"),
    improvement: text("Control assistant cost, access and provider routing through a shared LLM entry point.", "Controle custo, acesso e provedores do assistente por uma entrada compartilhada de LLM."),
    steps: [
      step("Admit a permitted request", "Aceite uma solicitação permitida", "The gateway checks application identity, token allowance and the requested model capability.", "O gateway verifica identidade do aplicativo, cota de tokens e capacidade solicitada.", "entrance"),
      step("Route within policy", "Encaminhe conforme a política", "Choose a permitted provider with compatible privacy, region and response-format requirements.", "Escolha um provedor permitido com privacidade, região e formato compatíveis.", "terminal"),
      step("Account for usage", "Contabilize o uso", "Record usage and latency without indiscriminately storing prompts; fallback must respect the same constraints.", "Registre uso e latência sem armazenar instruções indiscriminadamente; alternativas respeitam as mesmas restrições.", "stock"),
    ],
  },
  "ai-systems/gpu-autoscaling": {
    slug: "ai-systems/gpu-autoscaling", path: "/sistemas-ia/gpu-autoscaling", mode: "scaling", station: "terminal",
    title: text("GPU Serving & Autoscaling", "Inferência em GPU e Escalonamento Automático"),
    improvement: text("Scale assistant inference using queue delay and available GPU memory, not requests alone.", "Amplie a inferência considerando espera e memória de GPU, não apenas solicitações."),
    steps: [
      step("Observe inference pressure", "Observe a pressão na inferência", "A lunch-time surge increases queued requests and memory pressure from active model contexts.", "O movimento do almoço aumenta a fila e a pressão de memória dos contextos ativos.", "entrance"),
      step("Add ready capacity", "Adicione capacidade pronta", "A new GPU worker loads model weights and passes readiness before receiving requests.", "Um trabalhador com GPU carrega os pesos e passa pela verificação de prontidão antes de atender.", "terminal"),
      step("Drain before shrinking", "Esvazie antes de reduzir", "When demand falls, stop new assignments and drain active generations before removing a worker.", "Quando a demanda cai, interrompa novas atribuições e conclua gerações ativas antes de remover um trabalhador.", "kitchen"),
    ],
  },
  "ai-systems/agentic-systems": {
    slug: "ai-systems/agentic-systems", path: "/sistemas-ia/agentic-systems", mode: "ai", station: "counter",
    title: text("Agentic Systems", "Sistemas com Agentes"),
    improvement: text("Let an assistant propose tool actions while the application enforces real permissions.", "Deixe um assistente propor ações enquanto o aplicativo aplica as permissões reais."),
    steps: [
      step("Propose a tool call", "Proponha uma chamada", "The assistant proposes checking stock before recommending an order modification.", "O assistente propõe consultar o estoque antes de recomendar uma alteração no pedido.", "terminal"),
      step("Validate outside the model", "Valide fora do modelo", "The application validates tool arguments, customer ownership and permitted operations independently of generated text.", "O aplicativo valida argumentos, propriedade do pedido e operações permitidas independentemente do texto gerado.", "stock"),
      step("Confirm and observe", "Confirme e observe", "Consequential changes require the appropriate confirmation, bounded execution and an auditable result.", "Mudanças importantes exigem confirmação adequada, execução limitada e resultado auditável.", "counter"),
    ],
  },
  "data-storage/index": {
    slug: "data-storage/index", path: "/dados-armazenamento", mode: "storage", station: "stock",
    title: text("Data & Storage", "Dados e Armazenamento"),
    improvement: text("Choose storage around the restaurant's access patterns, durability and scale.", "Escolha armazenamento conforme acesso, durabilidade e escala da hamburgueria."),
    steps: [
      step("Separate the workloads", "Separe as cargas", "Order transactions, menu images and historical sales analysis need different access patterns.", "Transações de pedidos, imagens e análise histórica exigem formas diferentes de acesso.", "counter"),
      step("Choose by requirements", "Escolha pelos requisitos", "Match the data model, consistency and query needs to an appropriate storage system.", "Associe modelo de dados, consistência e consultas a um sistema de armazenamento adequado.", "stock"),
      step("Plan lifecycle and recovery", "Planeje ciclo de vida e recuperação", "Retention, indexes, backup and restore procedures remain necessary after selecting a database.", "Retenção, índices, cópias e restauração continuam necessários após escolher o banco.", "terminal"),
    ],
  },
  "data-storage/consistent-hashing": {
    slug: "data-storage/consistent-hashing", path: "/dados-armazenamento/consistent-hashing", mode: "routing", station: "stock",
    title: text("Consistent Hashing", "Hashing Consistente"),
    improvement: text("Place cached menu keys on a ring so membership changes move fewer keys.", "Distribua chaves do cache em um anel para reduzir realocações ao mudar participantes."),
    steps: [
      step("Map keys to the ring", "Mapeie chaves no anel", "Hash each menu key and cache node into the same circular key space.", "Aplique hash a cada chave do cardápio e nó de cache no mesmo espaço circular.", "counter"),
      step("Choose the owner", "Escolha o responsável", "The ring rule assigns a key to its next node; virtual nodes improve distribution.", "A regra atribui a chave ao próximo nó; nós virtuais melhoram a distribuição.", "stock"),
      step("Change membership", "Mude os participantes", "Adding a node remaps a subset of keys; the hash scheme itself does not provide replication or durability.", "Adicionar um nó remapeia parte das chaves; o esquema não oferece replicação nem durabilidade sozinho.", "branch"),
    ],
  },
  "data-storage/sharding-partitioning": {
    slug: "data-storage/sharding-partitioning", path: "/dados-armazenamento/sharding", mode: "storage", station: "branch",
    title: text("Sharding & Partitioning", "Sharding e Particionamento"),
    improvement: text("Split order records across storage partitions with explicit ownership and hot-key risks.", "Divida pedidos entre partições com responsabilidade explícita e atenção a chaves quentes."),
    steps: [
      step("Choose a partition key", "Escolha uma chave de partição", "The order identifier or restaurant identifier determines which partition stores a record.", "O identificador do pedido ou da unidade determina qual partição armazena o registro.", "counter"),
      step("Route to the owner", "Encaminhe ao responsável", "The application routes each read or write using the partition map.", "O aplicativo encaminha cada leitura ou gravação usando o mapa de partições.", "stock"),
      step("Rebalance carefully", "Reequilibre com cuidado", "Skewed traffic can overload one partition; moving records requires coordinated routing and migration.", "Tráfego desigual pode sobrecarregar uma partição; mover registros exige roteamento e migração coordenados.", "branch"),
    ],
  },
  "data-storage/object-storage": {
    slug: "data-storage/object-storage", path: "/dados-armazenamento/object-storage", mode: "storage", station: "stock",
    title: text("Object & Blob Storage", "Armazenamento de Objetos e Blobs"),
    improvement: text("Store menu photos as versioned objects rather than mutable database rows or files.", "Armazene fotos como objetos versionados em vez de linhas ou arquivos mutáveis."),
    steps: [
      step("Upload an object", "Envie um objeto", "A burger photo is uploaded under an object key with metadata and access policy.", "Uma foto é enviada sob uma chave de objeto com metadados e política de acesso.", "stock"),
      step("Reference the key", "Referencie a chave", "The menu database stores the object reference instead of copying the image into every order.", "O banco guarda a referência do objeto sem copiar a imagem em cada pedido.", "counter"),
      step("Manage versions and access", "Gerencie versões e acesso", "Versioning, lifecycle rules and signed access control retention and delivery; object semantics differ from a local filesystem.", "Versionamento, ciclo de vida e acesso assinado controlam retenção e entrega; objetos diferem de arquivos locais.", "terminal"),
    ],
  },
  "data-storage/distributed-file-systems": {
    slug: "data-storage/distributed-file-systems", path: "/dados-armazenamento/distributed-file-systems", mode: "storage", station: "branch",
    title: text("Distributed File Systems", "Sistemas de Arquivos Distribuídos"),
    improvement: text("Split large restaurant datasets into replicated blocks managed across storage workers.", "Divida conjuntos de dados em blocos replicados entre trabalhadores de armazenamento."),
    steps: [
      step("Resolve file metadata", "Localize os metadados", "The client locates file blocks through the distributed filesystem's metadata service.", "O cliente localiza blocos pelo serviço de metadados do sistema de arquivos distribuído.", "terminal"),
      step("Read distributed blocks", "Leia blocos distribuídos", "Sales-data blocks are served from storage workers, with replicas placed according to policy.", "Blocos de vendas vêm dos trabalhadores, com réplicas posicionadas conforme a política.", "stock"),
      step("Repair missing replicas", "Repare réplicas ausentes", "After a worker fails, the system restores required block redundancy; metadata availability also needs protection.", "Após uma falha, o sistema recompõe a redundância de blocos; os metadados também precisam de proteção.", "branch"),
    ],
  },
  "data-storage/search-inverted-index": {
    slug: "data-storage/search-inverted-index", path: "/dados-armazenamento/inverted-index", mode: "storage", station: "terminal",
    title: text("Search & the Inverted Index", "Busca e o Índice Invertido"),
    improvement: text("Find menu items through a word-to-document index instead of scanning every description.", "Encontre itens com um índice de palavras para documentos em vez de varrer descrições."),
    steps: [
      step("Analyze the menu text", "Analise o texto do cardápio", "Tokenization and normalization turn dish descriptions into searchable terms.", "Divisão e normalização transformam descrições dos pratos em termos pesquisáveis.", "stock"),
      step("Build posting lists", "Monte listas de ocorrências", "Each term points to matching menu document identifiers in the inverted index.", "Cada termo aponta aos identificadores dos documentos correspondentes no índice invertido.", "terminal"),
      step("Retrieve and rank", "Recupere e ordene", "A query combines posting lists and ranks matches; lexical matching differs from semantic vector similarity.", "Uma consulta combina listas e ordena resultados; correspondência lexical difere da similaridade vetorial.", "counter"),
    ],
  },
  "real-cases/index": {
    slug: "real-cases/index", path: "/casos-reais", mode: "routing", station: "terminal",
    title: text("Learn from the Giants", "Aprenda com os Gigantes"),
    improvement: text("Apply large-system design lessons to concrete restaurant workloads without copying their scale blindly.", "Aplique lições de grandes sistemas a cargas reais sem copiar sua escala cegamente."),
    steps: [
      step("Name the workload", "Identifique a carga", "The restaurant distinguishes video menus, live delivery, messaging and assistant requests.", "A hamburgueria distingue vídeos do cardápio, entrega ao vivo, mensagens e solicitações ao assistente.", "counter"),
      step("Identify the hard constraint", "Identifique a restrição difícil", "Each workload favors different latency, storage and consistency decisions.", "Cada carga favorece decisões diferentes de latência, armazenamento e consistência.", "terminal"),
      step("Borrow the principle", "Adapte o princípio", "Adopt a useful architecture principle only after checking the restaurant's own volume and operating cost.", "Adote um princípio útil após conferir volume e custo operacional da própria hamburgueria.", "kitchen"),
    ],
  },
  "real-cases/youtube": {
    slug: "real-cases/youtube", path: "/casos-reais/youtube", mode: "delivery", station: "dispatch",
    title: text("YouTube System Design", "Projeto de Sistemas do YouTube"),
    improvement: text("Use a menu-video pipeline to explore upload processing and global media delivery.", "Use vídeos do cardápio para explorar processamento de envio e distribuição de mídia."),
    steps: [
      step("Accept the upload", "Aceite o envio", "A chef uploads a cooking video to durable object storage with processing metadata.", "Uma pessoa da cozinha envia um vídeo para armazenamento durável com metadados de processamento.", "stock"),
      step("Process asynchronously", "Processe de forma assíncrona", "Workers transcode the video into playback formats while the upload request has already finished.", "Trabalhadores convertem o vídeo para reprodução após a solicitação de envio ter terminado.", "kitchen"),
      step("Deliver near viewers", "Entregue perto de quem assiste", "Cached video segments reach customers through edge locations; popularity shapes storage and bandwidth demand.", "Trechos em cache chegam pelos pontos de presença; popularidade afeta armazenamento e banda.", "dispatch"),
    ],
  },
  "real-cases/spotify": {
    slug: "real-cases/spotify", path: "/casos-reais/spotify", mode: "delivery", station: "pickup",
    title: text("Spotify System Design", "Projeto de Sistemas do Spotify"),
    improvement: text("Explore catalog, personalization and cached streaming through the restaurant's music service.", "Explore catálogo, personalização e reprodução em cache pela música da hamburgueria."),
    steps: [
      step("Resolve the catalog item", "Localize o item no catálogo", "The restaurant player looks up a track and checks its playback entitlement.", "O reprodutor consulta uma faixa e verifica a permissão para reprodução.", "terminal"),
      step("Serve cached audio", "Entregue áudio em cache", "Audio segments stream from nearby caches while buffering smooths temporary network variations.", "Trechos vêm de caches próximos enquanto o armazenamento temporário suaviza variações de rede.", "pickup"),
      step("Process listening events", "Processe eventos de reprodução", "Playback events feed separate analytics and recommendations without blocking every audio segment.", "Eventos alimentam análise e recomendações separadas sem bloquear cada trecho de áudio.", "stock"),
    ],
  },
  "real-cases/whatsapp": {
    slug: "real-cases/whatsapp", path: "/casos-reais/whatsapp", mode: "events", station: "counter",
    title: text("WhatsApp System Design", "Projeto de Sistemas do WhatsApp"),
    improvement: text("Follow customer messages through durable delivery, acknowledgement and multi-device state.", "Acompanhe mensagens do cliente por entrega durável, confirmação e estado entre dispositivos."),
    steps: [
      step("Accept a message", "Aceite uma mensagem", "The order chat accepts a message with a stable identifier and stores required delivery state.", "O atendimento aceita uma mensagem com identificador estável e guarda o estado de entrega necessário.", "counter"),
      step("Reach connected devices", "Alcance dispositivos conectados", "A messaging service delivers to connected staff devices and retains pending work when recipients are offline.", "O serviço entrega aos dispositivos conectados e retém trabalho pendente para destinatários desconectados.", "kitchen"),
      step("Acknowledge and synchronize", "Confirme e sincronize", "Delivery and read acknowledgements represent distinct states; retries require duplicate handling across devices.", "Confirmação de entrega e de leitura são estados distintos; repetições exigem tratamento entre dispositivos.", "terminal"),
    ],
  },
  "real-cases/bitly": {
    slug: "real-cases/bitly", path: "/casos-reais/bitly", mode: "routing", station: "entrance",
    title: text("Bit.ly System Design", "Projeto de Sistemas do Bit.ly"),
    improvement: text("Create short links for menu campaigns and resolve them efficiently.", "Crie endereços curtos para campanhas e resolva-os com eficiência."),
    steps: [
      step("Allocate a unique code", "Aloque um código único", "The campaign service creates a short code and stores its destination with uniqueness protection.", "O serviço cria um código curto e guarda o destino com proteção de unicidade.", "counter"),
      step("Resolve the redirect", "Resolva o redirecionamento", "A customer opens the code; a cached lookup returns the destination and redirect response.", "Um cliente abre o código; uma consulta em cache devolve o destino e o redirecionamento.", "entrance"),
      step("Record clicks separately", "Registre acessos separadamente", "Asynchronous click events support analytics without unnecessarily delaying the redirect path.", "Eventos assíncronos alimentam análises sem atrasar desnecessariamente o redirecionamento.", "terminal"),
    ],
  },
  "real-cases/netflix": {
    slug: "real-cases/netflix", path: "/casos-reais/netflix", mode: "delivery", station: "dispatch",
    title: text("Netflix System Design", "Projeto de Sistemas do Netflix"),
    improvement: text("Explore reliable playback through a restaurant training-video catalog.", "Explore reprodução confiável com um catálogo de vídeos de treinamento."),
    steps: [
      step("Prepare playback assets", "Prepare arquivos de reprodução", "Training videos are encoded into multiple bitrates and distributed before staff begin watching.", "Vídeos são codificados em várias taxas e distribuídos antes de a equipe assistir.", "stock"),
      step("Adapt to the connection", "Adapte à conexão", "The player selects segment quality according to observed bandwidth and buffer state.", "O reprodutor escolhe a qualidade dos trechos conforme banda observada e armazenamento temporário.", "pickup"),
      step("Isolate optional features", "Isole recursos opcionais", "Recommendation or analytics failures should not unnecessarily interrupt an already authorized playback session.", "Falhas de recomendação ou análise não devem interromper sem necessidade uma sessão autorizada.", "terminal"),
    ],
  },
  "real-cases/uber": {
    slug: "real-cases/uber", path: "/casos-reais/uber", mode: "routing", station: "dispatch",
    title: text("Uber System Design", "Projeto de Sistemas do Uber"),
    improvement: text("Match delivery demand with nearby available couriers while handling moving locations.", "Combine demanda de entrega com entregadores próximos e disponíveis."),
    steps: [
      step("Update courier positions", "Atualize posições", "Courier location events continuously update a geospatial availability view.", "Eventos de localização atualizam continuamente uma visão geográfica de disponibilidade.", "dispatch"),
      step("Find candidates nearby", "Encontre candidatos próximos", "The dispatch service searches a geographic area and ranks suitable available couriers.", "O despacho pesquisa uma área geográfica e ordena entregadores disponíveis adequados.", "terminal"),
      step("Confirm the assignment", "Confirme a atribuição", "A coordinated assignment prevents competing matches from both claiming the same courier.", "Uma atribuição coordenada impede que combinações concorrentes reservem o mesmo entregador.", "pickup"),
    ],
  },
  "real-cases/chatgpt": {
    slug: "real-cases/chatgpt", path: "/casos-reais/chatgpt", mode: "ai", station: "terminal",
    title: text("ChatGPT System Design", "Projeto de Sistemas do ChatGPT"),
    improvement: text("Build a conversational menu assistant with streaming output and controlled tool access.", "Monte um assistente conversacional com resposta progressiva e ferramentas controladas."),
    steps: [
      step("Prepare conversation context", "Prepare o contexto da conversa", "The assistant selects permitted conversation history and menu context within the model's token budget.", "O assistente seleciona histórico permitido e contexto do cardápio dentro do limite de tokens.", "counter"),
      step("Stream generated tokens", "Transmita tokens gerados", "Model output arrives progressively; first-token delay and full-response time are different measures.", "A resposta chega progressivamente; atraso inicial e tempo total são medidas diferentes.", "terminal"),
      step("Control external actions", "Controle ações externas", "Order tools remain behind server-side validation and customer authorization, independent of the generated conversation.", "Ferramentas de pedidos ficam atrás de validação e autorização no servidor, independentemente do texto gerado.", "stock"),
    ],
  },
  "real-cases/perplexity": {
    slug: "real-cases/perplexity", path: "/casos-reais/perplexity", mode: "ai", station: "terminal",
    title: text("Perplexity System Design", "Projeto de Sistemas do Perplexity"),
    improvement: text("Answer restaurant research questions with retrieved evidence and inspectable citations.", "Responda perguntas de pesquisa com evidências recuperadas e citações verificáveis."),
    steps: [
      step("Search for evidence", "Busque evidências", "The assistant retrieves relevant approved supplier and ingredient documents for the question.", "O assistente recupera documentos aprovados de fornecedores e ingredientes relacionados à pergunta.", "stock"),
      step("Synthesize with references", "Sintetize com referências", "A generated answer associates claims with the retrieved passages that support them.", "Uma resposta gerada associa afirmações aos trechos recuperados que as sustentam.", "terminal"),
      step("Inspect source support", "Inspecione o suporte da fonte", "The user can inspect citations; a citation's presence alone does not prove that the claim is supported.", "O usuário pode consultar citações; sua presença sozinha não prova que sustentam a afirmação.", "counter"),
    ],
  },
  "real-cases/github-copilot": {
    slug: "real-cases/github-copilot", path: "/casos-reais/github-copilot", mode: "ai", station: "terminal",
    title: text("GitHub Copilot System Design", "Projeto de Sistemas do GitHub Copilot"),
    improvement: text("Explore code assistance by completing the restaurant app with scoped project context.", "Explore assistência de código ao completar o aplicativo com contexto restrito do projeto."),
    steps: [
      step("Gather relevant context", "Reúna contexto relevante", "The coding tool selects permitted nearby code and repository context for an order-form change.", "A ferramenta seleciona código próximo permitido e contexto do projeto para alterar o formulário.", "terminal"),
      step("Suggest an implementation", "Sugira uma implementação", "The model proposes code tokens or a patch without automatically proving correctness.", "O modelo propõe tokens de código ou uma alteração sem provar automaticamente a correção.", "counter"),
      step("Review and verify", "Revise e verifique", "The developer reviews permissions, behavior and tests before adopting the suggested change.", "A pessoa desenvolvedora revisa permissões, comportamento e testes antes de adotar a alteração.", "kitchen"),
    ],
  },
  "data-storage/storage-engines": {
    slug: "data-storage/storage-engines", path: "/dados-armazenamento/storage-engines", mode: "storage", station: "stock",
    title: text("Storage Engines: B-Tree vs LSM-Tree", "Mecanismos de Armazenamento: B-Tree vs LSM-Tree"),
    improvement: text("Compare how different storage engines maintain the restaurant's indexed order records.", "Compare como mecanismos de armazenamento mantêm pedidos indexados."),
    steps: [
      step("Update a tree", "Atualize uma árvore", "A B-tree-family engine maintains ordered pages for indexed point and range access.", "Um mecanismo da família B-tree mantém páginas ordenadas para consultas pontuais e por intervalo.", "stock"),
      step("Append then merge", "Acrescente e depois combine", "An LSM-family engine buffers writes and creates sorted files that later undergo compaction.", "Um mecanismo da família LSM acumula gravações e cria arquivos ordenados combinados posteriormente.", "kitchen"),
      step("Compare amplification", "Compare a amplificação", "Order workload and configuration determine read, write and space amplification; neither family wins every case.", "Carga e configuração determinam amplificação de leitura, escrita e espaço; nenhuma família vence sempre.", "terminal"),
    ],
  },
  "data-storage/bloom-filters": {
    slug: "data-storage/bloom-filters", path: "/dados-armazenamento/bloom-filters", mode: "storage", station: "stock",
    title: text("Bloom Filters", "Filtros de Bloom"),
    improvement: text("Skip unnecessary order-file reads with a compact probabilistic membership filter.", "Evite leituras desnecessárias usando um filtro probabilístico compacto."),
    steps: [
      step("Build the bitset", "Monte o conjunto de bits", "Order keys set several positions in a Bloom filter associated with stored data.", "Chaves de pedidos marcam posições em um filtro de Bloom associado aos dados armazenados.", "stock"),
      step("Reject definite absence", "Descarte a ausência certa", "An unset required bit proves the key is absent from that correctly maintained filter's dataset.", "Um bit necessário desmarcado prova ausência no conjunto representado pelo filtro mantido corretamente.", "counter"),
      step("Check possible presence", "Confira a presença possível", "All bits set means possibly present, so the database still checks storage for false positives.", "Todos os bits marcados significam presença possível; o banco ainda consulta os dados por causa dos falsos positivos.", "terminal"),
    ],
  },
  "data-storage/replication-quorums": {
    slug: "data-storage/replication-quorums", path: "/dados-armazenamento/replication-quorums", mode: "replication", station: "branch",
    title: text("Replication Models & Quorums", "Modelos de Replicação e Quóruns"),
    improvement: text("Choose replica acknowledgement thresholds and understand what quorum overlap does not guarantee alone.", "Escolha limites de confirmação e entenda o que a sobreposição de quóruns não garante sozinha."),
    steps: [
      step("Replicate the write", "Replique a gravação", "The stock service sends a versioned update to its configured replica set.", "O serviço de estoque envia uma atualização versionada ao conjunto configurado de réplicas.", "stock"),
      step("Wait for acknowledgements", "Espere confirmações", "The write waits for W acknowledgements; a read consults R replicas according to its policy.", "A gravação espera W confirmações; uma leitura consulta R réplicas conforme a política.", "branch"),
      step("Resolve the versions", "Resolva as versões", "R plus W greater than N gives overlap under assumptions, but requires suitable versioning and protocol for stronger guarantees.", "R mais W maior que N oferece sobreposição sob hipóteses, mas garantias fortes exigem versionamento e protocolo adequados.", "terminal"),
    ],
  },
  "data-storage/change-data-capture": {
    slug: "data-storage/change-data-capture", path: "/dados-armazenamento/cdc", mode: "events", station: "stock",
    title: text("Change Data Capture (CDC)", "Captura de Alterações de Dados (CDC)"),
    improvement: text("Propagate committed order changes from the database log to downstream views.", "Propague mudanças confirmadas dos pedidos pelo registro do banco até visões derivadas."),
    steps: [
      step("Commit the source change", "Confirme a alteração de origem", "The order database commits a status update and records it in its change log.", "O banco confirma uma atualização de estado e a registra no histórico de alterações.", "stock"),
      step("Capture the log position", "Capture a posição no histórico", "A CDC connector reads committed changes and tracks its position for restart recovery.", "Um conector lê mudanças confirmadas e acompanha sua posição para retomar após reiniciar.", "terminal"),
      step("Update downstream consumers", "Atualize consumidores derivados", "Search and analytics apply the change asynchronously and tolerate replays; their views can lag behind the source.", "Busca e análise aplicam mudanças assincronamente e toleram repetições; suas visões podem atrasar.", "pickup"),
    ],
  },
  "data-storage/oltp-olap": {
    slug: "data-storage/oltp-olap", path: "/dados-armazenamento/oltp-olap", mode: "storage", station: "stock",
    title: text("OLTP vs OLAP, Warehouses & Lakes", "OLTP e OLAP, Armazéns e Lagos de Dados"),
    improvement: text("Separate fast order transactions from broad historical restaurant analysis.", "Separe transações rápidas de pedidos da análise histórica abrangente."),
    steps: [
      step("Process current orders", "Processe pedidos atuais", "The transactional system handles small, selective writes and reads with business invariants.", "O sistema transacional realiza gravações e leituras seletivas preservando regras de negócio.", "counter"),
      step("Move analytical data", "Mova dados analíticos", "A controlled pipeline loads historical records into analytical storage, with explicit freshness and schema policies.", "Um fluxo controlado carrega histórico no armazenamento analítico com políticas de atualização e esquema.", "stock"),
      step("Aggregate the history", "Agregue o histórico", "Analytical queries scan many sales records without competing directly with every checkout transaction.", "Consultas analíticas percorrem muitas vendas sem competir diretamente com cada transação de compra.", "terminal"),
    ],
  },
  "data-storage/time-series-databases": {
    slug: "data-storage/time-series-databases", path: "/dados-armazenamento/time-series", mode: "observability", station: "stock",
    title: text("Time-Series Databases", "Bancos de Séries Temporais"),
    improvement: text("Store time-stamped kitchen-service measurements for efficient retention and windowed analysis.", "Armazene medições temporais da cozinha para retenção e análise por janelas."),
    steps: [
      step("Append a measurement", "Acrescente uma medição", "Service metrics arrive with timestamps, numeric values and bounded identifying labels.", "Métricas chegam com horários, valores numéricos e rótulos identificadores limitados.", "kitchen"),
      step("Group by time", "Agrupe pelo tempo", "Time-oriented storage and indexing support recent-window queries and historical aggregation.", "Armazenamento e índices temporais apoiam consultas por janelas recentes e agregações históricas.", "stock"),
      step("Manage resolution and retention", "Gerencie resolução e retenção", "Downsampling and retention reduce storage while preserving the resolution needed for investigations.", "Agregação e retenção reduzem espaço preservando a resolução necessária às investigações.", "terminal"),
    ],
  },
  "components/api-styles": {
    slug: "components/api-styles", path: "/componentes/api-styles", mode: "routing", station: "counter",
    title: text("API Styles: REST, gRPC & GraphQL", "Estilos de API: REST, gRPC e GraphQL"),
    improvement: text("Choose an interface style for menu reads, kitchen RPCs and tailored app queries.", "Escolha interfaces para consultas ao cardápio, chamadas internas e dados do aplicativo."),
    steps: [
      step("Expose resources", "Exponha recursos", "A REST interface models orders as resources with documented HTTP behavior.", "Uma interface REST modela pedidos como recursos com comportamento HTTP documentado.", "counter"),
      step("Call a typed operation", "Chame uma operação tipada", "A gRPC interface uses an explicit service schema for internal kitchen operations.", "Uma interface gRPC usa um esquema explícito para operações internas da cozinha.", "kitchen"),
      step("Select a response shape", "Selecione a resposta", "GraphQL lets clients request selected fields; authorization and query-cost controls remain server responsibilities.", "GraphQL permite selecionar campos; autorização e controle do custo das consultas continuam no servidor.", "terminal"),
    ],
  },
  "components/realtime-push": {
    slug: "components/realtime-push", path: "/componentes/realtime-push", mode: "events", station: "pickup",
    title: text("WebSockets & Real-Time Push", "WebSockets e Atualizações em Tempo Real"),
    improvement: text("Push changing pickup status to connected customers without repeated polling.", "Envie mudanças da retirada aos clientes conectados sem consultas repetidas."),
    steps: [
      step("Open the channel", "Abra o canal", "The customer app establishes a supported persistent channel, such as WebSocket or server-sent events.", "O aplicativo estabelece um canal persistente suportado, como WebSocket ou eventos enviados pelo servidor.", "entrance"),
      step("Publish status changes", "Publique mudanças de estado", "The pickup service pushes order-status updates to authorized subscribed connections.", "A retirada envia atualizações aos canais autorizados que assinam o pedido.", "pickup"),
      step("Recover a dropped connection", "Recupere uma conexão perdida", "On reconnect, the app resynchronizes current state or resumes from a cursor; live transport alone is not durable history.", "Ao reconectar, o aplicativo sincroniza o estado ou retoma por um marcador; transporte ao vivo não é histórico durável.", "terminal"),
    ],
  },
  "components/dead-letter-queue": {
    slug: "components/dead-letter-queue", path: "/componentes/dead-letter-queue", mode: "queue", station: "kitchen",
    title: text("Dead Letter Queues", "Filas de Mensagens Não Processadas"),
    improvement: text("Isolate repeatedly failing order messages so healthy work can continue.", "Isole mensagens que falham repetidamente para que o trabalho saudável avance."),
    steps: [
      step("Encounter a poison message", "Encontre uma mensagem problemática", "A malformed order event fails processing repeatedly beyond the configured retry policy.", "Um evento inválido falha repetidamente além da política configurada de novas tentativas.", "kitchen"),
      step("Move it aside", "Separe a mensagem", "The broker routes the event and failure context into a dead-letter queue for investigation.", "O intermediário encaminha o evento e o contexto da falha para uma fila de investigação.", "stock"),
      step("Repair and replay safely", "Corrija e reprocesse com segurança", "Operators correct the cause and replay with duplicate protection; moving a message does not solve the failure.", "A operação corrige a causa e reprocessa com proteção contra duplicatas; separar não resolve a falha.", "terminal"),
    ],
  },
  "components/stream-processing": {
    slug: "components/stream-processing", path: "/componentes/stream-processing", mode: "events", station: "terminal",
    title: text("Stream Processing", "Processamento de Fluxos"),
    improvement: text("Compute rolling restaurant activity while accounting for late and reordered events.", "Calcule atividade por janelas considerando eventos atrasados e fora de ordem."),
    steps: [
      step("Ingest the event stream", "Receba o fluxo de eventos", "Order events arrive continuously with identifiers and event timestamps.", "Eventos de pedidos chegam continuamente com identificadores e horários de ocorrência.", "counter"),
      step("Aggregate a window", "Agregue uma janela", "A stateful processor counts accepted orders within defined event-time windows.", "Um processador com estado conta pedidos aceitos dentro de janelas de tempo dos eventos.", "terminal"),
      step("Handle late arrivals", "Trate chegadas atrasadas", "Watermarks and lateness policies determine when delayed events update, correct or miss a window.", "Marcas de progresso e políticas de atraso definem quando eventos atualizam, corrigem ou perdem uma janela.", "stock"),
    ],
  },
  "consistency-strategies/crdts": {
    slug: "consistency-strategies/crdts", path: "/estrategias-de-consistencia/crdts", mode: "replication", station: "branch",
    title: text("CRDTs (Conflict-Free Replicated Data Types)", "CRDTs (Tipos de Dados Replicados Sem Conflito)"),
    improvement: text("Merge a carefully modeled branch counter without confusing convergence with stock safety.", "Combine contadores bem modelados sem confundir convergência com segurança do estoque."),
    steps: [
      step("Update a local component", "Atualize um componente local", "Each branch increments its own component of a grow-only digital counter.", "Cada filial incrementa seu próprio componente de um contador digital somente crescente.", "branch"),
      step("Merge by the rule", "Combine pela regra", "Replicas merge using the component-wise maximum, preserving the CRDT's algebraic properties.", "As réplicas combinam pelo máximo de cada componente, preservando as propriedades do tipo de dado.", "stock"),
      step("Respect model limits", "Respeite limites do modelo", "Repeated merges converge; this counter does not prevent overselling or represent arbitrary reversible stock changes.", "Combinações repetidas convergem; esse contador não impede vendas excessivas nem modela qualquer reversão de estoque.", "terminal"),
    ],
  },
  "consistency-strategies/gossip": {
    slug: "consistency-strategies/gossip", path: "/estrategias-de-consistencia/gossip", mode: "replication", station: "branch",
    title: text("Gossip & Anti-Entropy Protocols", "Protocolos de Gossip e Antientropia"),
    improvement: text("Spread restaurant service membership and repair replica differences through peer exchanges.", "Espalhe participantes dos serviços e repare diferenças entre réplicas por trocas entre pares."),
    steps: [
      step("Choose a peer", "Escolha um par", "A service instance periodically selects a peer and shares compact membership or state information.", "Uma instância escolhe periodicamente um par e compartilha informações compactas de participantes ou estado.", "branch"),
      step("Spread through exchanges", "Espalhe pelas trocas", "Repeated peer exchanges carry updates beyond the original sender without contacting every node directly.", "Trocas repetidas levam atualizações além da origem sem contatar diretamente todos os nós.", "dispatch"),
      step("Repair missed state", "Repare diferenças pendentes", "Anti-entropy compares retained state to repair divergence; gossip alone does not provide linearizable agreement.", "A antientropia compara estados para reparar divergências; gossip sozinho não oferece acordo linearizável.", "stock"),
    ],
  },
  "consistency-strategies/distributed-locks": {
    slug: "consistency-strategies/distributed-locks", path: "/estrategias-de-consistencia/distributed-locks", mode: "consensus", station: "stock",
    title: text("Distributed Locks, Leases & Fencing Tokens", "Bloqueios Distribuídos, Concessões Temporárias e Tokens de Proteção"),
    improvement: text("Protect stock mutations with bounded leases and storage-enforced fencing tokens.", "Proteja alterações de estoque com concessões limitadas e tokens verificados pelo armazenamento."),
    steps: [
      step("Acquire a lease", "Adquira uma concessão", "An order worker obtains a time-limited lease and a monotonically increasing fencing token.", "Um trabalhador recebe uma concessão temporária e um token de proteção crescente.", "counter"),
      step("An old owner pauses", "Um responsável antigo pausa", "A long pause outlasts the lease, allowing another worker to become the current owner.", "Uma pausa longa supera a concessão, permitindo que outro trabalhador assuma a responsabilidade.", "kitchen"),
      step("Fence stale writes", "Barre gravações antigas", "The stock store rejects an older token, preventing a resumed stale holder from overwriting newer work.", "O armazenamento rejeita um token antigo, impedindo que o responsável atrasado sobrescreva trabalho novo.", "stock"),
    ],
  },
  "design-principles/event-sourcing": {
    slug: "design-principles/event-sourcing", path: "/principios-design/event-sourcing", mode: "events", station: "stock",
    title: text("Event Sourcing", "Event Sourcing"),
    improvement: text("Store order-state transitions as an append-only history and rebuild derived views.", "Guarde transições do pedido num histórico de acréscimo e reconstrua visões derivadas."),
    steps: [
      step("Append the accepted event", "Acrescente o evento aceito", "Validated order changes append domain events rather than merely overwriting the latest state.", "Alterações validadas acrescentam eventos do domínio em vez de apenas sobrescrever o estado atual.", "counter"),
      step("Rebuild the projection", "Reconstrua a projeção", "Replaying order-created and order-prepared events reconstructs a pickup-status view.", "Reprocessar eventos de criação e preparo reconstrói uma visão do estado de retirada.", "pickup"),
      step("Evolve the history carefully", "Evolua o histórico com cuidado", "Event schemas, snapshots and replay-safe handlers are needed; a log alone is not a complete event-sourced design.", "Esquemas, retratos e tratamento seguro de repetição são necessários; um registro sozinho não completa o projeto.", "stock"),
    ],
  },
  "design-principles/outbox": {
    slug: "design-principles/outbox", path: "/principios-design/outbox", mode: "events", station: "stock",
    title: text("Transactional Outbox", "Caixa de Saída Transacional (Outbox)"),
    improvement: text("Commit an order update and its pending event together before publishing externally.", "Confirme a alteração do pedido e seu evento pendente juntos antes da publicação externa."),
    steps: [
      step("Write one transaction", "Grave em uma transação", "The database transaction stores both the order change and an outbox event record.", "A transação grava a alteração do pedido e um evento na caixa de saída.", "stock"),
      step("Relay after commit", "Envie após confirmar", "A relay or CDC process publishes committed outbox records to the message broker.", "Um processo de envio ou captura publica registros confirmados ao intermediário de mensagens.", "counter"),
      step("Tolerate relay retries", "Tolere repetições do envio", "A crash between publish and bookkeeping can repeat an event, so consumers still need idempotency.", "Uma falha entre publicação e controle pode repetir um evento; consumidores ainda precisam de idempotência.", "kitchen"),
    ],
  },
  "design-principles/bulkhead": {
    slug: "design-principles/bulkhead", path: "/principios-design/bulkhead", mode: "queue", station: "kitchen",
    title: text("The Bulkhead Pattern", "O Padrão Bulkhead"),
    improvement: text("Isolate slow recommendation work from the resources needed to accept orders.", "Isole recomendações lentas dos recursos necessários para aceitar pedidos."),
    steps: [
      step("Expose shared exhaustion", "Mostre o esgotamento compartilhado", "Slow assistant calls occupy a shared worker pool until checkout requests also wait.", "Chamadas lentas ao assistente ocupam o conjunto compartilhado até os pedidos também esperarem.", "terminal"),
      step("Separate the pools", "Separe os conjuntos", "Distinct concurrency limits and worker pools reserve resources for the critical order path.", "Limites de concorrência e trabalhadores separados reservam recursos para o caminho crítico dos pedidos.", "kitchen"),
      step("Bound each compartment", "Limite cada compartimento", "A saturated assistant pool rejects or degrades its own work without consuming every checkout worker.", "O conjunto saturado do assistente recusa ou reduz seu trabalho sem ocupar todos os trabalhadores dos pedidos.", "counter"),
    ],
  },
  "design-principles/blue-green": {
    slug: "design-principles/blue-green", path: "/principios-design/blue-green", mode: "routing", station: "kitchen",
    title: text("Blue-Green Deployment", "Implantação Azul-Verde"),
    improvement: text("Switch order traffic between two prepared service environments with compatibility safeguards.", "Troque o tráfego entre dois ambientes preparados com proteção de compatibilidade."),
    steps: [
      step("Keep blue serving", "Mantenha o azul atendendo", "The current environment serves orders while a separate green environment receives the candidate release.", "O ambiente atual atende enquanto um ambiente verde separado recebe a versão candidata.", "kitchen"),
      step("Validate green readiness", "Valide o ambiente verde", "Smoke checks and compatible database changes make the candidate ready before the traffic switch.", "Verificações básicas e alterações compatíveis no banco preparam a candidata antes da troca.", "terminal"),
      step("Switch the entry point", "Troque o ponto de entrada", "Routing moves to green; rollback needs compatible state and careful handling of in-flight work.", "O roteamento muda para o verde; voltar exige estado compatível e cuidado com trabalho em andamento.", "counter"),
    ],
  },
  "design-principles/feature-flags": {
    slug: "design-principles/feature-flags", path: "/principios-design/feature-flags", mode: "routing", station: "counter",
    title: text("Feature Flags", "Chaves de Funcionalidade (Feature Flags)"),
    improvement: text("Separate deploying a new ordering feature from enabling it for selected users.", "Separe implantar uma funcionalidade de ativá-la para usuários selecionados."),
    steps: [
      step("Deploy a guarded path", "Implante um caminho protegido", "The application contains a new customization flow behind a feature-flag decision.", "O aplicativo contém um novo fluxo de personalização atrás de uma decisão de ativação.", "kitchen"),
      step("Enable a defined cohort", "Ative para um grupo definido", "A stable targeting rule enables the feature for selected customers while others keep the existing flow.", "Uma regra estável ativa o recurso para clientes selecionados enquanto os demais mantêm o fluxo existente.", "counter"),
      step("Observe and retire the flag", "Observe e remova a chave", "Monitor outcomes, disable on regression and remove obsolete flag code after the rollout stabilizes.", "Monitore resultados, desative diante de regressão e remova código obsoleto após estabilizar.", "terminal"),
    ],
  },
};

export function getConcept(slug: string): Concept | undefined {
  return Object.prototype.hasOwnProperty.call(restaurantConcepts, slug) ? restaurantConcepts[slug] : undefined;
}

/** Unlocks come from persisted course completion, never from replaying a scene. */
export function getRestaurantProgress(
  pages: readonly { slug: string; path: string }[],
  progress: Readonly<Record<string, { completed: boolean } | undefined>>,
): RestaurantProgress {
  const lessonPaths = new Set(pages.filter((page) => getConcept(page.slug)?.path === page.path).map((page) => page.path));
  const total = lessonPaths.size;
  const completed = [...lessonPaths].filter((path) => progress[path]?.completed === true).length;
  const percent = total === 0 ? 0 : (completed / total) * 100;
  const stage = [...restaurantStages].reverse().find((candidate) => percent >= candidate.threshold)!;
  const next = restaurantStages.find((candidate) => candidate.threshold > percent);
  return {
    level: stage.level, completed, total, percent,
    nextTarget: next && total > 0 ? Math.ceil((total * next.threshold) / 100) : null,
    unlockedStations: restaurantStages.filter((candidate) => candidate.level <= stage.level).flatMap((candidate) => candidate.stations),
  };
}

export const getLessonConcept = getConcept;
export const deriveRestaurantProgress = getRestaurantProgress;
