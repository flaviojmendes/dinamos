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
  { level: 6, threshold: 100, title: { en: 'Restaurant management', pt: 'Gestão da hamburgueria' }, stations: ['terminal'] },
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

// Each lesson is acted out using the restaurant's people, documents and workstations.
// An analogy explains a guarantee; physical food never inherits software semantics.
export const restaurantConcepts: Record<string, Concept> = {
  "intro": {
    slug: "intro", path: "/intro", mode: "counter", station: "counter",
    title: text("Introduction", "Introdução"),
    improvement: text("Open the burger counter and follow the same numbered order through the restaurant.", "Abra o balcão e acompanhe a mesma comanda numerada pela hamburgueria."),
    steps: [
      step("Take the customer's order", "Anote o pedido do cliente", "The cashier writes burger order #42 on a slip. Its number stays with the customer throughout the visit.", "O caixa anota o hambúrguer na comanda #42. Esse número acompanha o cliente durante todo o atendimento.", "counter"),
      step("Pass the slip to the cook", "Leve a comanda à cozinha", "The cook receives slip #42 and prepares the burger while the cashier serves the next customer.", "A pessoa da cozinha recebe a comanda #42 e prepara o hambúrguer enquanto o caixa atende o próximo cliente.", "kitchen"),
      step("Match the tray at pickup", "Confira a bandeja na retirada", "The attendant matches tray #42 with the customer's receipt before handing it over. We will keep improving this restaurant together.", "O atendente confere a bandeja #42 com o comprovante do cliente antes de entregá-la. Vamos melhorar esta hamburgueria ao longo do curso.", "pickup"),
    ],
  },
  "distributed-systems-101": {
    slug: "distributed-systems-101", path: "/sistemas-distribuidos-101", mode: "network", station: "kitchen",
    title: text("Distributed Systems 101", "Sistemas Distribuídos 101"),
    improvement: text("Let the cashier, cooks and neighboring branch work independently while exchanging order slips.", "Faça caixa, cozinha e filial trabalharem com autonomia e trocarem comandas."),
    steps: [
      step("Each station keeps its own book", "Cada estação tem seu livro", "The cashier records accepted orders; the cook keeps a separate preparation list. Neither person can silently change the other's book.", "O caixa registra pedidos aceitos; a cozinha mantém sua lista de preparo. Ninguém altera silenciosamente o livro da outra estação.", "counter"),
      step("Carry the order across", "Leve o pedido até lá", "A runner carries slip #42 from the cashier to the cook. The handoff represents a message between independent parts.", "Um ajudante leva a comanda #42 do caixa à cozinha. A entrega representa uma mensagem entre partes independentes.", "kitchen"),
      step("The branch misses a delivery", "A filial fica sem a entrega", "The runner cannot reach the branch, but the main kitchen keeps cooking. One isolated station need not stop the entire restaurant.", "O ajudante não consegue chegar à filial, mas a cozinha principal continua preparando pedidos. Uma estação isolada não precisa parar toda a hamburgueria.", "branch"),
    ],
  },
  "system-design-101": {
    slug: "system-design-101", path: "/system-design-101", mode: "counter", station: "terminal",
    title: text("System Design 101", "Projeto de Sistemas 101"),
    improvement: text("Plan the restaurant around the lunch rush before buying more equipment or hiring more staff.", "Planeje a hamburgueria para o almoço antes de comprar equipamentos ou contratar mais gente."),
    steps: [
      step("Count arrivals and waiting time", "Conte chegadas e tempo de espera", "The manager observes the entrance queue and writes an acceptable waiting time on a clipboard. Those needs guide the layout.", "A gerência observa a fila de entrada e anota uma espera aceitável na prancheta. Essas necessidades orientam o espaço.", "entrance"),
      step("Give every station a job", "Dê uma função a cada estação", "The cashier marks who takes payment, grills burgers and hands over trays on order #42. Clear responsibilities make the flow understandable.", "O caixa marca na comanda #42 quem cobra, prepara e entrega. Responsabilidades claras tornam o fluxo compreensível.", "counter"),
      step("Find the grill bottleneck", "Encontre o gargalo da chapa", "Slips pile up beside the only busy grill. Adding a cashier would not cook those burgers faster; the constraint is in the kitchen.", "Comandas se acumulam ao lado da única chapa ocupada. Outro caixa não prepararia esses hambúrgueres mais rápido; a limitação está na cozinha.", "kitchen"),
    ],
  },
  "theoretical-foundations/index": {
    slug: "theoretical-foundations/index", path: "/theoretical-foundations", mode: "network", station: "branch",
    title: text("Theoretical Foundations", "Fundamentos Teóricos"),
    improvement: text("Compare the restaurant's menu copies when a runner is late or a branch cannot be reached.", "Compare cópias do cardápio quando um ajudante atrasa ou não chega à filial."),
    steps: [
      step("Send a revised menu", "Envie o cardápio revisado", "The manager marks menu v2 and gives a copy to the runner heading toward the branch.", "A gerência marca o cardápio v2 e entrega uma cópia ao ajudante que vai à filial.", "counter"),
      step("A copy has not arrived", "Uma cópia ainda não chegou", "The branch still holds v1 while the runner waits outside. The attendant cannot know an unseen change merely by checking the old page.", "A filial ainda tem v1 enquanto o ajudante espera do lado de fora. O atendente não descobre uma mudança olhando a página antiga.", "branch"),
      step("Choose the serving rule", "Escolha a regra de atendimento", "At the manager's desk, compare waiting for confirmation with serving from the local copy. Each rule promises something different to customers.", "Na mesa da gerência, compare esperar confirmação com atender pela cópia local. Cada regra promete algo diferente aos clientes.", "terminal"),
    ],
  },
  "theoretical-foundations/cap-theorem": {
    slug: "theoretical-foundations/cap-theorem", path: "/theoretical-foundations/cap-theorem", mode: "network", station: "branch",
    title: text("CAP Theorem", "Teorema CAP"),
    improvement: text("Keep two stock ledgers apart and show the CAP choice specifically while the branch is unreachable.", "Separe dois livros de estoque e mostre a escolha do CAP enquanto a filial está inacessível."),
    steps: [
      step("The stock update cannot cross", "A atualização do estoque não passa", "A runner carrying the revised ingredient ledger cannot reach the branch. The two counters can no longer coordinate the latest count.", "O ajudante com o livro de ingredientes revisado não chega à filial. Os dois balcões deixam de coordenar a contagem mais recente.", "stock"),
      step("Wait for a confirmed count", "Espere a contagem confirmada", "The cashier holds the customer's slip instead of promising the last ingredient without confirmation. That choice preserves the coordination rule by refusing service.", "O caixa segura a comanda em vez de prometer o último ingrediente sem confirmação. Essa escolha preserva a regra de coordenação recusando o atendimento.", "counter"),
      step("Answer from the old ledger", "Responda pelo livro antigo", "The isolated branch answers from its own ledger, which may be stale. The route remains blocked: availability does not make the counts agree.", "A filial isolada responde pelo próprio livro, possivelmente antigo. O caminho continua bloqueado: atender não faz as contagens concordarem.", "branch"),
    ],
  },
  "theoretical-foundations/consistency-models": {
    slug: "theoretical-foundations/consistency-models", path: "/theoretical-foundations/consistency-models", mode: "replication", station: "stock",
    title: text("Consistency Models", "Modelos de Consistência"),
    improvement: text("Show which menu revision each customer is allowed to see at the two counters.", "Mostre qual revisão do cardápio cada cliente pode consultar nos dois balcões."),
    steps: [
      step("Mark the new revision", "Marque a nova revisão", "The manager crosses out an unavailable burger on menu v2 and keeps the signed master in the restaurant's binder.", "A gerência risca um hambúrguer indisponível no cardápio v2 e guarda o original assinado no fichário.", "stock"),
      step("A branch shows an older page", "A filial mostra uma página antiga", "Before the runner arrives, a branch customer is handed menu v1. A local copy can be quick to consult and still be outdated.", "Antes de o ajudante chegar, o cliente da filial recebe v1. Uma cópia local pode ser rápida de consultar e ainda estar antiga.", "branch"),
      step("Write the reading promise", "Escreva a promessa de consulta", "The manager's checklist states whether staff must confirm the latest revision or may use an older one. Eventual delivery does not mean immediate freshness.", "A lista da gerência define se a equipe confirma a última revisão ou usa uma anterior. Entrega eventual não significa atualização imediata.", "terminal"),
    ],
  },
  "theoretical-foundations/distributed-challenges": {
    slug: "theoretical-foundations/distributed-challenges", path: "/theoretical-foundations/distributed-challenges", mode: "network", station: "dispatch",
    title: text("Distributed Systems Challenges", "Desafios de Sistemas Distribuídos"),
    improvement: text("Handle a missing payment receipt without duplicating a charge or stopping the cooks.", "Trate um comprovante de pagamento ausente sem cobrar duas vezes nem parar a cozinha."),
    steps: [
      step("A receipt has not returned", "O comprovante não voltou", "The cashier sends payment slip #42 to be checked, but no stamped receipt returns. Silence does not reveal whether payment was recorded.", "O caixa envia o pagamento #42 para conferência, mas o comprovante carimbado não volta. O silêncio não revela se houve registro.", "counter"),
      step("The kitchen can still work", "A cozinha ainda pode trabalhar", "The cook continues an already confirmed order while the receipt runner is delayed. A local problem does not mean every station has stopped.", "A cozinha continua um pedido já confirmado enquanto o ajudante do comprovante atrasa. Um problema local não significa que todas as estações pararam.", "kitchen"),
      step("Check the number before charging", "Confira o número antes de cobrar", "The manager looks up #42 in the payment book before issuing another charge. A repeated question should not become a second payment.", "A gerência procura #42 no livro de pagamentos antes de cobrar novamente. Uma pergunta repetida não deve virar um segundo pagamento.", "terminal"),
    ],
  },
  "theoretical-foundations/network-partitions": {
    slug: "theoretical-foundations/network-partitions", path: "/theoretical-foundations/network-partitions", mode: "network", station: "branch",
    title: text("Network Partitions & Failures", "Partições de Rede e Falhas"),
    improvement: text("Keep the branch serving locally, then reconcile its written records when the runner can return.", "Mantenha o trabalho local da filial e confira os livros quando o ajudante puder voltar."),
    steps: [
      step("Separate the branch", "Isole a filial", "A blocked passage prevents the runner carrying the order ledger from reaching the branch. Each side can only inspect its own records.", "Uma passagem bloqueada impede o ajudante de levar o livro de pedidos à filial. Cada lado só consulta seus registros.", "branch"),
      step("Write permitted local orders", "Anote pedidos locais permitidos", "The main cashier records permitted work in the local ledger while the branch remains unreachable. Remote changes are still unknown.", "O caixa principal registra trabalho permitido no livro local enquanto a filial segue inacessível. Mudanças do outro lado continuam desconhecidas.", "counter"),
      step("Bring the books together", "Reúna os livros", "Once the passage reopens, the runner brings the branch ledger for comparison. Staff reconcile missing entries and conflicts using a stated rule.", "Quando a passagem reabre, o ajudante traz o livro da filial. A equipe confere registros ausentes e conflitos com uma regra definida.", "stock"),
    ],
  },
  "components/index": {
    slug: "components/index", path: "/componentes", mode: "counter", station: "kitchen",
    title: text("Basic Components", "Componentes Básicos"),
    improvement: text("Give each restaurant station a distinct object and responsibility in preparing one order.", "Dê a cada estação um objeto e uma responsabilidade no preparo de um pedido."),
    steps: [
      step("Write the customer's slip", "Escreva a comanda do cliente", "The cashier records order #42 on a slip instead of shouting an instruction that can be forgotten.", "O caixa registra o pedido #42 numa comanda em vez de gritar uma instrução que pode ser esquecida.", "counter"),
      step("Hang work on the rail", "Pendure o trabalho na régua", "The cook takes slips from the kitchen rail when a preparation space is free. The rail buffers arrivals.", "A cozinha retira comandas da régua quando há espaço para preparar. A régua absorve as chegadas.", "kitchen"),
      step("Archive the completed entry", "Arquive o registro concluído", "A signed entry goes into the order book. Another attendant can recover the record even after the original cashier leaves.", "Um registro assinado entra no livro de pedidos. Outro atendente o recupera mesmo após a saída do caixa original.", "stock"),
    ],
  },
  "theoretical-foundations/pacelc": {
    slug: "theoretical-foundations/pacelc", path: "/theoretical-foundations/pacelc", mode: "replication", station: "branch",
    title: text("The PACELC Theorem", "O Teorema PACELC"),
    improvement: text("Compare waiting for the runner during normal service with losing contact with the branch.", "Compare esperar pelo ajudante no atendimento normal com perder contato com a filial."),
    steps: [
      step("Send the menu with confirmation", "Envie o cardápio com confirmação", "With the passage open, the cashier sends menu v2 and asks the branch to return a signed acknowledgement.", "Com a passagem aberta, o caixa envia o cardápio v2 e pede uma confirmação assinada à filial.", "counter"),
      step("Waiting has a price", "Esperar tem um custo", "The branch signs the copy, but the round trip takes time. Stronger coordination can add waiting even when nothing is broken.", "A filial assina a cópia, mas a ida e volta demora. Coordenação mais forte pode aumentar a espera mesmo sem falhas.", "branch"),
      step("A blocked passage changes the choice", "Uma passagem bloqueada muda a escolha", "Now the runner cannot return. At the manager's desk, choose between waiting for agreement and permitting a local answer under partition.", "Agora o ajudante não consegue voltar. Na mesa da gerência, escolha entre esperar acordo e permitir uma resposta local durante a partição.", "terminal"),
    ],
  },
  "components/database": {
    slug: "components/database", path: "/componentes/banco-dados", mode: "storage", station: "stock",
    title: text("Databases", "Bancos de Dados"),
    improvement: text("Keep numbered orders in a signed book that survives a change of cashier.", "Guarde pedidos numerados num livro assinado que sobreviva à troca do caixa."),
    steps: [
      step("Enter the order in the book", "Lance o pedido no livro", "The cashier writes order #42, its items and payment status on a new ledger line.", "O caixa escreve o pedido #42, seus itens e a situação do pagamento numa nova linha do livro.", "counter"),
      step("Confirm the recorded entry", "Confirme o registro feito", "The stockroom clerk checks and stamps the written entry before the cashier promises it was saved. The book represents durable storage.", "A pessoa do estoque confere e carimba o registro antes de o caixa prometer que foi salvo. O livro representa armazenamento durável.", "stock"),
      step("A new attendant finds it", "Outro atendente encontra o pedido", "After a shift change, the manager retrieves #42 from the book rather than asking the previous cashier to remember.", "Após a troca de turno, a gerência encontra #42 no livro sem depender da memória do caixa anterior.", "terminal"),
    ],
  },
  "theoretical-foundations/flp-impossibility": {
    slug: "theoretical-foundations/flp-impossibility", path: "/theoretical-foundations/flp-impossibility", mode: "consensus", station: "branch",
    title: text("The FLP Impossibility", "A Impossibilidade FLP"),
    improvement: text("Use unanswered menu-approval slips to expose the difference between a delay and a missing participant.", "Use aprovações sem resposta para distinguir atraso e ausência de um participante."),
    steps: [
      step("Ask everyone to agree", "Peça um acordo entre todos", "The cashier sends a proposed menu revision to the branch managers for the next shared edition.", "O caixa envia uma revisão proposta aos responsáveis das filiais para a próxima edição compartilhada.", "counter"),
      step("One reply never arrives", "Uma resposta não chega", "One branch has not returned its slip. From the counter, a slow runner and an absent manager can look identical.", "Uma filial não devolveu a ficha. Do balcão, um ajudante lento e uma gerência ausente podem parecer a mesma coisa.", "branch"),
      step("State the missing assumption", "Explicite a hipótese necessária", "The manager uses a clock and a declared delivery assumption to explain practical waiting rules. A deadline is not proof that silence means failure.", "A gerência usa um relógio e uma hipótese de entrega para explicar regras práticas. Um prazo não prova que o silêncio é falha.", "terminal"),
    ],
  },
  "components/cache": {
    slug: "components/cache", path: "/componentes/cache", mode: "cache", station: "counter",
    title: text("Cache", "Cache"),
    improvement: text("Keep a nearby paper menu copy, then replace it when the master changes.", "Mantenha uma cópia próxima do cardápio e troque-a quando o original mudar."),
    steps: [
      step("Copy the master menu", "Copie o cardápio original", "With no local copy, an attendant fetches the master menu from the binder and makes a counter copy. Only information is copied.", "Sem cópia local, um atendente busca o original no fichário e faz uma cópia para o balcão. Apenas informação é copiada.", "counter"),
      step("Reuse the nearby page", "Reutilize a página próxima", "At pickup, another customer reads the nearby menu copy without sending someone back to the stockroom.", "Na retirada, outro cliente lê a cópia próxima sem mandar alguém novamente ao estoque.", "pickup"),
      step("Retire an outdated copy", "Retire a cópia desatualizada", "A revised price in the master binder makes the old page invalid. Staff replace or expire the copy; no prepared burger is reused.", "Um preço revisado no fichário invalida a página antiga. A equipe substitui ou vence a cópia; nenhum hambúrguer pronto é reutilizado.", "stock"),
    ],
  },
  "theoretical-foundations/fallacies": {
    slug: "theoretical-foundations/fallacies", path: "/theoretical-foundations/fallacies", mode: "network", station: "dispatch",
    title: text("Fallacies of Distributed Computing", "Falácias da Computação Distribuída"),
    improvement: text("Challenge the belief that every runner arrives instantly, safely and at no cost.", "Questione a ideia de que todo ajudante chega instantaneamente, com segurança e sem custo."),
    steps: [
      step("Expect an instant handoff", "Espere uma entrega instantânea", "The cashier hands slip #42 toward the cook as if distance and competing work did not exist.", "O caixa entrega a comanda #42 à cozinha como se distância e trabalho concorrente não existissem.", "counter"),
      step("The runner is delayed", "O ajudante atrasa", "A runner with a delivery bag waits at a crowded passage. Travel time, space and staff effort are finite.", "Um ajudante com a bolsa de entrega espera numa passagem cheia. Tempo de deslocamento, espaço e esforço são limitados.", "dispatch"),
      step("Plan for imperfect delivery", "Planeje entregas imperfeitas", "The manager checks waiting limits, receipt checks and recovery rules on a clipboard instead of assuming a perfect handoff.", "A gerência confere limites de espera, comprovantes e recuperação numa prancheta em vez de presumir uma entrega perfeita.", "terminal"),
    ],
  },
  "components/load-balancer": {
    slug: "components/load-balancer", path: "/componentes/load-balancer", mode: "routing", station: "counter",
    title: text("Load Balancers", "Balanceadores de Carga"),
    improvement: text("Have one host distribute incoming order slips among available cooks.", "Faça uma pessoa distribuir comandas entre cozinheiros disponíveis."),
    steps: [
      step("Customers use one entrance", "Clientes usam uma entrada", "Customers arrive at the same host rather than choosing a cook's preparation bench themselves.", "Clientes chegam à mesma pessoa da entrada em vez de escolher uma bancada da cozinha.", "entrance"),
      step("Share slips among cooks", "Distribua comandas pela cozinha", "The host sends each numbered slip to an available cook according to the chosen rotation or workload rule.", "A pessoa distribui cada comanda numerada a um cozinheiro disponível conforme rodízio ou carga de trabalho.", "counter"),
      step("Skip an unavailable bench", "Pule a bancada indisponível", "A cook marks their bench unavailable on the checklist. New slips go to other ready cooks instead of piling up there.", "Um cozinheiro marca sua bancada como indisponível. Novas comandas vão aos demais, em vez de se acumularem ali.", "kitchen"),
    ],
  },
  "components/message-queue": {
    slug: "components/message-queue", path: "/componentes/message-queue", mode: "queue", station: "kitchen",
    title: text("Message Queues", "Filas de Mensagens"),
    improvement: text("Keep order slips on a kitchen rail until a cook can claim and finish them.", "Mantenha comandas na régua até que alguém possa retirá-las e finalizar o preparo."),
    steps: [
      step("Put the slip on the rail", "Pendure a comanda na régua", "The cashier places slip #42 on the kitchen rail and can serve another customer without waiting for the burger.", "O caixa coloca a comanda #42 na régua da cozinha e atende outro cliente sem esperar o hambúrguer.", "counter"),
      step("Claim the next ticket", "Retire a próxima comanda", "A cook takes an eligible slip when a preparation bench is free. Waiting tickets remain visible on the rail.", "Um cozinheiro pega uma comanda permitida quando uma bancada fica livre. As demais continuam visíveis na régua.", "kitchen"),
      step("Stamp work as completed", "Carimbe o trabalho concluído", "At pickup, the finished slip receives a completion stamp. An unstamped redelivery must be checked by number before repeating the work.", "Na retirada, a comanda pronta recebe um carimbo. Uma reentrega sem carimbo precisa ser conferida pelo número antes de repetir o trabalho.", "pickup"),
    ],
  },
  "components/cdn": {
    slug: "components/cdn", path: "/componentes/cdn", mode: "cache", station: "branch",
    title: text("CDN (Content Delivery Network)", "Rede de Distribuição de Conteúdo (CDN)"),
    improvement: text("Place copies of menu photos at neighborhood burger counters so customers consult them nearby.", "Coloque cópias das fotos do cardápio em balcões do bairro para consultas próximas."),
    steps: [
      step("Distribute the photo booklet", "Distribua o livreto de fotos", "The main restaurant's binder holds the original menu photos. A runner takes a copy to a neighborhood branch.", "O fichário principal guarda as fotos originais. Um ajudante leva uma cópia à filial do bairro.", "stock"),
      step("Read the neighborhood copy", "Leia a cópia do bairro", "A customer at the branch views the local photo menu instead of sending a runner to the main restaurant.", "Um cliente da filial consulta o cardápio de fotos local sem buscar o original na matriz.", "branch"),
      step("Replace the old edition", "Troque a edição antiga", "The manager sends a clearly numbered new edition and retires outdated pages. Nearby copies need an explicit freshness rule.", "A gerência envia uma edição nova numerada e retira páginas antigas. Cópias próximas precisam de uma regra explícita de atualização.", "terminal"),
    ],
  },
  "components/api-gateway": {
    slug: "components/api-gateway", path: "/componentes/api-gateway", mode: "routing", station: "entrance",
    title: text("API Gateway", "Gateway de API"),
    improvement: text("Put one trained host at the entrance to check and route requests to the right station.", "Coloque uma pessoa na entrada para conferir e encaminhar solicitações à estação certa."),
    steps: [
      step("Ask at one front door", "Peça em uma única entrada", "A customer hands an order slip to the host instead of walking into every work area.", "Um cliente entrega a comanda à pessoa da entrada em vez de entrar em cada área de trabalho.", "entrance"),
      step("Check entry conditions", "Confira as condições de entrada", "The host checks the slip, the customer's collection receipt and the allowed queue before admitting the request.", "A pessoa confere a comanda, o comprovante de retirada e a fila permitida antes de aceitar a solicitação.", "counter"),
      step("Send to the proper station", "Encaminhe à estação correta", "A preparation request goes to the cook; a menu question goes to the counter. The host coordinates entry, not every kitchen decision.", "Um preparo vai à cozinha; uma pergunta de cardápio vai ao balcão. A entrada não decide todos os detalhes da cozinha.", "kitchen"),
    ],
  },
  "components/firewall": {
    slug: "components/firewall", path: "/componentes/firewall", mode: "security", station: "entrance",
    title: text("Firewall", "Firewall"),
    improvement: text("Use a staff-only stockroom door with explicit entry rules.", "Use uma porta de estoque restrita à equipe com regras explícitas de entrada."),
    steps: [
      step("Read the door rule", "Leia a regra da porta", "An attendant checks the access list at the restaurant entrance before allowing passage toward the stockroom.", "Um atendente confere a lista de acesso na entrada antes de permitir passagem ao estoque.", "entrance"),
      step("Stop an unauthorized visitor", "Pare uma visita não autorizada", "A customer tries the stockroom route without a staff badge and is stopped at the locked door.", "Um cliente tenta chegar ao estoque sem crachá da equipe e é parado na porta trancada.", "stock"),
      step("Allow the approved route", "Permita o caminho aprovado", "A permitted staff member carries a checklist through to the manager's desk. Entering an area still does not authorize every action there.", "Uma pessoa autorizada leva a lista à mesa da gerência. Entrar numa área ainda não autoriza todas as ações naquele local.", "terminal"),
    ],
  },
  "components/polling-webhooks": {
    slug: "components/polling-webhooks", path: "/componentes/polling-webhooks", mode: "events", station: "pickup",
    title: text("Polling vs Webhooks", "Consulta Periódica e Webhooks"),
    improvement: text("Compare repeatedly asking at pickup with receiving a ready-order receipt from the cook.", "Compare perguntar repetidamente na retirada com receber um aviso da cozinha."),
    steps: [
      step("Keep asking whether it is ready", "Pergunte repetidamente se está pronto", "A customer returns to the pickup attendant to ask about #42, even while the preparation slip is unchanged.", "Um cliente volta à retirada para perguntar sobre #42, mesmo enquanto a comanda de preparo não mudou.", "pickup"),
      step("Send the ready notice", "Envie o aviso de pronto", "When the burger is ready, the cook sends its numbered receipt to pickup instead of waiting for another question.", "Quando o hambúrguer fica pronto, a cozinha envia o comprovante numerado à retirada sem esperar outra pergunta.", "kitchen"),
      step("Check a repeated notice", "Confira um aviso repetido", "The manager checks the sender's stamp and receipt number before accepting another notice. Repeated notices must not create another order.", "A gerência confere carimbo e número antes de aceitar outro aviso. Avisos repetidos não devem criar outro pedido.", "terminal"),
    ],
  },
  "components/vector-database": {
    slug: "components/vector-database", path: "/componentes/vector-database", mode: "storage", station: "terminal",
    title: text("Vector Database", "Banco de Dados Vetorial"),
    improvement: text("Organize burger recipe cards by flavor characteristics to illustrate similarity-based retrieval.", "Organize fichas de hambúrgueres por características de sabor para ilustrar busca por semelhança."),
    steps: [
      step("Give each recipe a profile", "Dê um perfil a cada receita", "The cook marks smoky, spicy and fresh characteristics on recipe cards kept in a binder. These profiles stand in for numeric representations.", "A cozinha marca características defumadas, picantes e frescas nas fichas do fichário. Esses perfis representam descrições numéricas.", "stock"),
      step("Find a similar profile", "Encontre um perfil parecido", "A customer asks for something smoky. The cashier compares that preference card with the recipe profiles rather than requiring the same words.", "Um cliente pede algo defumado. O caixa compara essa preferência às fichas, sem exigir as mesmas palavras.", "counter"),
      step("Verify the suggested dish", "Confira o prato sugerido", "At the manager's recipe desk, staff check ingredients and availability. Flavor similarity alone never guarantees allergy safety.", "Na mesa de receitas da gerência, a equipe confere ingredientes e disponibilidade. Semelhança de sabor nunca garante segurança contra alergias.", "terminal"),
    ],
  },
  "components/model-gateway": {
    slug: "components/model-gateway", path: "/componentes/model-gateway", mode: "ai", station: "terminal",
    title: text("Model Gateway", "Gateway de Modelos"),
    improvement: text("Let a head attendant choose a recipe adviser using the customer's needs and restaurant rules.", "Faça um responsável escolher um ajudante de receitas conforme o pedido e as regras da casa."),
    steps: [
      step("Use one advice counter", "Use um balcão de orientação", "A customer hands a recipe question to one attendant instead of choosing among all the restaurant's advisers.", "O cliente entrega uma pergunta a um atendente em vez de escolher entre todos os ajudantes de receitas.", "counter"),
      step("Choose an appropriate adviser", "Escolha o ajudante adequado", "At the recipe desk, the attendant checks which adviser can answer, is available and fits the allowed cost.", "Na mesa de receitas, o atendente confere quem sabe responder, está disponível e cabe no custo permitido.", "terminal"),
      step("Keep the same restrictions", "Mantenha as mesmas restrições", "If a branch adviser takes over, the dietary checklist and privacy rules travel with the question. An alternative must not bypass the requirements.", "Se um ajudante da filial assumir, a lista alimentar e as regras de privacidade acompanham a pergunta. A alternativa não ignora requisitos.", "branch"),
    ],
  },
  "components/kafka-streaming": {
    slug: "components/kafka-streaming", path: "/componentes/kafka", mode: "events", station: "dispatch",
    title: text("Kafka & Event Streaming", "Kafka e Fluxos de Eventos"),
    improvement: text("Keep a numbered order journal that cooks and the manager can read at their own pace.", "Mantenha um diário numerado de pedidos que cozinha e gerência leem em ritmos próprios."),
    steps: [
      step("Append the accepted order", "Acrescente o pedido aceito", "The cashier writes accepted order #42 at the end of the bound journal without erasing earlier entries.", "O caixa escreve o pedido #42 no fim do diário encadernado sem apagar os registros anteriores.", "counter"),
      step("Use separate bookmarks", "Use marcadores separados", "The kitchen follows one bookmark while the manager follows another. Reading an entry does not remove it from the journal.", "A cozinha segue um marcador e a gerência outro. Ler um registro não o retira do diário.", "kitchen"),
      step("Revisit retained entries", "Releia registros guardados", "The manager moves a bookmark backward to review earlier orders. Each journal volume preserves its own order; separate volumes need no single global sequence.", "A gerência recua o marcador para revisar pedidos. Cada volume preserva sua ordem; volumes separados não precisam de sequência global única.", "terminal"),
    ],
  },
  "components/dns": {
    slug: "components/dns", path: "/componentes/dns", mode: "routing", station: "entrance",
    title: text("DNS — The Distributed Phone Book", "DNS — A Lista Telefônica Distribuída"),
    improvement: text("Find a named burger branch through a directory, then keep its address for a limited time.", "Encontre uma filial pelo nome num guia e guarde seu endereço por tempo limitado."),
    steps: [
      step("Ask for the branch name", "Pergunte pelo nome da filial", "A customer knows the branch name but not its location and asks the entrance attendant for directions.", "Um cliente conhece o nome da filial, mas não sua localização, e pede orientação na entrada.", "entrance"),
      step("Consult the branch directory", "Consulte o guia de filiais", "The runner checks the restaurant directory and follows its listed referral to the correct branch address.", "O ajudante consulta o guia da hamburgueria e segue a indicação até o endereço correto da filial.", "dispatch"),
      step("Keep a dated address card", "Guarde uma ficha de endereço datada", "The manager keeps the address card only until its marked expiry. A moved branch may still be listed on an unexpired old copy.", "A gerência guarda a ficha até o vencimento marcado. Uma filial que mudou ainda pode aparecer numa cópia antiga válida.", "terminal"),
    ],
  },
  "components/reverse-proxy": {
    slug: "components/reverse-proxy", path: "/componentes/reverse-proxy", mode: "routing", station: "entrance",
    title: text("Reverse Proxy", "Proxy Reverso"),
    improvement: text("Let a host receive customer slips and carry them to staff behind the counter.", "Faça uma pessoa receber comandas dos clientes e levá-las à equipe atrás do balcão."),
    steps: [
      step("Hand the request to the host", "Entregue o pedido à entrada", "The customer hands slip #42 to the host without walking into the preparation area.", "O cliente entrega a comanda #42 à pessoa da entrada sem entrar na área de preparo.", "entrance"),
      step("Carry it behind the counter", "Leve para trás do balcão", "The host carries the slip to the proper staff member and brings the answer back through the same front door.", "A pessoa leva a comanda ao responsável e traz a resposta pela mesma entrada.", "counter"),
      step("Apply shared handling", "Aplique o tratamento comum", "At the manager's desk, a checklist defines receipt checks, menu-copy reuse and routing that the host applies consistently.", "Na mesa da gerência, uma lista define conferência, cópias do cardápio e encaminhamento aplicados igualmente pela entrada.", "terminal"),
    ],
  },
  "components/service-discovery": {
    slug: "components/service-discovery", path: "/componentes/service-discovery", mode: "routing", station: "kitchen",
    title: text("Service Discovery", "Descoberta de Serviços"),
    improvement: text("Keep a current roster of staffed preparation benches instead of remembering yesterday's cook.", "Mantenha uma lista atual das bancadas ativas em vez de memorizar o cozinheiro de ontem."),
    steps: [
      step("Register an active bench", "Cadastre uma bancada ativa", "A cook clips a signed readiness card onto the kitchen roster when their bench is ready to receive orders.", "Um cozinheiro prende uma ficha assinada na lista da cozinha quando sua bancada está pronta para receber pedidos.", "kitchen"),
      step("Look up the current worker", "Consulte quem está trabalhando", "Before sending slip #42, the cashier reads the roster rather than guessing which cook is still on duty.", "Antes de enviar a comanda #42, o caixa consulta a lista em vez de adivinhar quem continua no turno.", "counter"),
      step("Remove an expired card", "Retire uma ficha vencida", "The manager removes a departed cook's expired readiness card. New slips should no longer be sent to an unstaffed bench.", "A gerência retira a ficha vencida de quem saiu. Novas comandas não devem ir à bancada sem equipe.", "terminal"),
    ],
  },
  "components/service-mesh": {
    slug: "components/service-mesh", path: "/componentes/service-mesh", mode: "network", station: "kitchen",
    title: text("Service Mesh", "Malha de Serviços"),
    improvement: text("Give internal runners the same identity checks and handoff checklist between restaurant stations.", "Dê aos ajudantes internos as mesmas verificações de identidade e entrega entre estações."),
    steps: [
      step("An internal handoff", "Uma entrega interna", "A cashier gives order #42 to the restaurant's runner for the trip to the cook.", "O caixa entrega a comanda #42 ao ajudante interno que vai até a cozinha.", "counter"),
      step("Check both staff identities", "Confira as duas identidades", "Runner and cook show staff badges and follow the same handoff checklist. The rule surrounds the stations without deciding the recipe.", "Ajudante e cozinheiro mostram crachás e seguem a mesma lista de entrega. A regra envolve as estações sem decidir a receita.", "kitchen"),
      step("Keep the handoff record", "Guarde o registro da entrega", "A signed receipt reaches the manager's binder for timing and investigation. Uniform delivery rules do not replace who may change an order.", "Um comprovante assinado chega ao fichário da gerência para medir e investigar. Regras de entrega não substituem permissões sobre pedidos.", "terminal"),
    ],
  },
  "components/kubernetes": {
    slug: "components/kubernetes", path: "/componentes/kubernetes", mode: "scaling", station: "kitchen",
    title: text("Kubernetes", "Kubernetes"),
    improvement: text("Let a shift manager maintain the planned number of staffed preparation benches.", "Faça a gerência manter a quantidade planejada de bancadas ativas."),
    steps: [
      step("Write the staffing plan", "Escreva o plano da equipe", "At the desk, the manager marks how many identical preparation stations should be open and which checks make them ready.", "Na mesa, a gerência marca quantas estações iguais devem abrir e quais verificações indicam prontidão.", "terminal"),
      step("Place cooks at free benches", "Distribua cozinheiros nas bancadas", "The manager assigns cooks to benches with enough room and ingredients before putting them on the order roster.", "A gerência distribui cozinheiros em bancadas com espaço e ingredientes antes de incluí-los na lista de pedidos.", "kitchen"),
      step("Replace a missing worker", "Substitua quem saiu", "When a cook leaves, a replacement restores the staffing plan. The order book stays in the stockroom; replacing staff does not recreate lost records.", "Quando alguém sai, uma substituição recompõe a equipe. O livro fica no estoque; trocar pessoas não recria registros perdidos.", "stock"),
    ],
  },
  "design-principles/index": {
    slug: "design-principles/index", path: "/principios-design", mode: "counter", station: "terminal",
    title: text("Design Principles", "Princípios de Design"),
    improvement: text("Give the cashier, cook and pickup attendant clear responsibilities for order #42.", "Defina o papel do caixa, do cozinheiro e da retirada no pedido #42."),
    steps: [
      step("One ticket at the counter", "Uma comanda no balcão", "The cashier writes burger, quantity and payment on ticket #42. The cook does not have to ask the customer again.", "O caixa registra hambúrguer, quantidade e pagamento na comanda #42. O cozinheiro não precisa entrevistar o cliente novamente.", "counter"),
      step("A clear kitchen handoff", "Uma passagem clara à cozinha", "The cook receives the same ticket, follows the recipe and sends the finished tray to pickup. Each station knows its task.", "O cozinheiro recebe a mesma comanda, segue a receita e envia a bandeja pronta à retirada. Cada posto conhece sua tarefa.", "kitchen"),
      step("Check the whole journey", "Confira o caminho completo", "The manager follows #42 on a checklist. Extra handoffs can isolate mistakes, but each handoff also adds waiting and coordination.", "A gerência acompanha #42 numa prancheta. Separar tarefas pode conter erros, mas cada passagem também acrescenta espera e coordenação.", "terminal"),
    ],
  },
  "design-principles/event-driven": {
    slug: "design-principles/event-driven", path: "/principios-design/eventos", mode: "events", station: "kitchen",
    title: text("Event-Driven Development", "Desenvolvimento Orientado a Eventos"),
    improvement: text("Post an accepted-order ticket so kitchen and pickup staff can react independently.", "Pendure a comanda aceita para cozinha e retirada reagirem por conta própria."),
    steps: [
      step("Stamp an accepted order", "Carimbe o pedido aceito", "The cashier stamps ticket #42 as accepted and posts a copy. The paper records a fact that has already happened.", "O caixa carimba a comanda #42 como aceita e pendura uma cópia. O papel registra um fato que já aconteceu.", "counter"),
      step("Staff react to the ticket", "A equipe reage à comanda", "A cook takes the posted copy to start preparation, while the pickup attendant can organize packaging without waiting for a manager to direct both.", "Um cozinheiro leva a cópia para iniciar o preparo, enquanto a retirada organiza a embalagem sem esperar que a gerência dê cada ordem.", "kitchen"),
      step("A delayed copy arrives", "Uma cópia atrasada chega", "A second copy of #42 reaches pickup later. The attendant checks the stamped order before reacting again; posting a ticket never meant every task was finished.", "Outra cópia de #42 chega depois à retirada. A equipe confere a comanda carimbada antes de agir novamente; pendurar o papel não concluiu todas as tarefas.", "pickup"),
    ],
  },
  "design-principles/coupling": {
    slug: "design-principles/coupling", path: "/principios-design/acoplamento", mode: "network", station: "kitchen",
    title: text("Coupling in Distributed Systems", "Acoplamento em Sistemas Distribuídos"),
    improvement: text("Use a stable order slip so changing the grill does not force the cashier to change the ordering routine.", "Use uma comanda estável para mudar a chapa sem refazer a rotina do caixa."),
    steps: [
      step("A fragile kitchen shorthand", "Uma abreviação frágil", "The cashier writes the cook's private grill-position codes on #42. When the cook rearranges the grill, the same paper is misunderstood.", "O caixa escreve em #42 códigos internos das posições da chapa. Quando o cozinheiro reorganiza a chapa, o mesmo papel passa a ser entendido errado.", "kitchen"),
      step("Agree on the order slip", "Combine o formato da comanda", "The manager prints a v1 slip with burger, doneness and quantity. The cashier fills these agreed fields instead of naming a grill position.", "A gerência imprime a comanda v1 com hambúrguer, ponto e quantidade. O caixa preenche os campos combinados, sem escolher a posição da chapa.", "counter"),
      step("Change the kitchen behind it", "Mude a cozinha por trás dela", "The cook replaces the grill layout but still accepts the same v1 slip. Both staff members check a sample order before adopting the change.", "O cozinheiro muda a organização da chapa, mas continua aceitando a comanda v1. A equipe confere um pedido de exemplo antes de adotar a mudança.", "kitchen"),
    ],
  },
  "design-principles/orchestration-vs-choreography": {
    slug: "design-principles/orchestration-vs-choreography", path: "/principios-design/orquestracao-vs-coreografia", mode: "saga", station: "kitchen",
    title: text("Orchestration vs Choreography", "Orquestração versus Coreografia"),
    improvement: text("Compare a manager directing each order step with staff reacting to stamped receipts.", "Compare a gerência comandando cada etapa com a equipe reagindo a recibos carimbados."),
    steps: [
      step("The manager directs #42", "A gerência dirige #42", "With a checklist, the manager asks the cashier to confirm payment, then tells the cook to prepare #42 and pickup staff to package it.", "Com uma prancheta, a gerência pede a confirmação ao caixa, manda preparar #42 e depois orienta a retirada a embalar.", "terminal"),
      step("Try the receipt-driven routine", "Experimente a rotina por recibos", "In the alternative routine, the cook sees a paid receipt and starts preparation. A ready tray tells pickup staff to package it, without another manager command.", "Na rotina alternativa, o cozinheiro vê o recibo pago e inicia o preparo. A bandeja pronta avisa a retirada, sem outra ordem da gerência.", "kitchen"),
      step("Find who tracks the order", "Veja quem acompanha o pedido", "The manager's checklist makes the first routine easy to follow. In the second, matching #42 on every receipt keeps responsibility and missed handoffs visible.", "A prancheta central facilita acompanhar a primeira rotina. Na segunda, o número #42 em cada recibo ajuda a localizar responsáveis e passagens esquecidas.", "terminal"),
    ],
  },
  "design-principles/canary-deployment": {
    slug: "design-principles/canary-deployment", path: "/principios-design/canary-deployment", mode: "routing", station: "kitchen",
    title: text("Canary Deployment", "Implantação Canário"),
    improvement: text("Try recipe v2 on a small share of lunch orders while most burgers keep the proven recipe.", "Experimente a receita v2 em poucos pedidos, mantendo a receita conhecida na maioria."),
    steps: [
      step("Keep the familiar recipe", "Mantenha a receita conhecida", "Most lunch tickets still reach the cook following recipe v1. The restaurant keeps its usual preparation available during the trial.", "A maioria das comandas do almoço continua com o cozinheiro que segue a receita v1. O preparo conhecido permanece disponível durante o teste.", "kitchen"),
      step("Send one trial ticket", "Envie uma comanda de teste", "The cashier sends one in ten eligible orders to the cook using v2 and marks the trial ticket. Other orders still follow v1.", "O caixa envia um em cada dez pedidos elegíveis ao cozinheiro que usa v2 e marca a comanda de teste. Os demais continuam em v1.", "kitchen"),
      step("Compare before expanding", "Compare antes de ampliar", "The manager checks trial waiting times and returned trays. Good results permit a larger trial; problems stop new v2 tickets instead of changing burgers already served.", "A gerência confere esperas e bandejas devolvidas do teste. Bons resultados permitem ampliar a amostra; problemas interrompem novos pedidos v2, sem mudar hambúrgueres já servidos.", "terminal"),
    ],
  },
  "design-principles/cqrs": {
    slug: "design-principles/cqrs", path: "/principios-design/cqrs", mode: "storage", station: "counter",
    title: text("CQRS — Command Query Responsibility Segregation", "CQRS — Segregação de responsabilidades de comandos e consultas"),
    improvement: text("Keep the authoritative order ledger separate from the pickup attendant's quick status sheet.", "Separe o livro oficial de pedidos da folha rápida consultada na retirada."),
    steps: [
      step("Change the official order", "Altere o pedido oficial", "The cashier checks the rules for #42 and records its change in the official ledger. Editing the pickup sheet cannot authorize an order.", "O caixa confere as regras de #42 e registra a alteração no livro oficial. Alterar a folha da retirada não autoriza um pedido.", "stock"),
      step("Copy a pickup view", "Monte a visão da retirada", "A runner copies only the order number and preparation status onto the pickup sheet, making it quick to answer which burgers are ready.", "Um ajudante copia apenas número e estado de preparo para a folha da retirada, facilitando responder quais hambúrgueres estão prontos.", "pickup"),
      step("Notice the copy lag", "Perceba o atraso da cópia", "The next correction is still on its way, so the pickup sheet briefly shows an older state. The official ledger remains the place to confirm the accepted change.", "A correção seguinte ainda está a caminho; a folha mostra por um instante o estado antigo. O livro oficial confirma a alteração já aceita.", "pickup"),
    ],
  },
  "design-principles/rate-limiting": {
    slug: "design-principles/rate-limiting", path: "/principios-design/rate-limiting", mode: "queue", station: "entrance",
    title: text("Rate Limiting", "Limitação de Taxa"),
    improvement: text("Give the entrance a fixed allowance of new tickets per minute, separate from grill capacity.", "Defina na entrada uma cota de novas comandas por minuto, separada da capacidade da chapa."),
    steps: [
      step("Set a timed allowance", "Defina uma cota por intervalo", "The host checks the clock and opens a new allowance of two ordering tickets for this minute. This rule limits arrivals, not cooking time.", "A pessoa na entrada confere o relógio e libera duas novas comandas neste minuto. A regra limita chegadas, não o tempo de preparo.", "entrance"),
      step("Admit an allowed order", "Admita um pedido dentro da cota", "A customer with an available ticket reaches the cashier and places #42. The cook still works at the same pace.", "Um cliente com senha disponível chega ao caixa e faz #42. O cozinheiro continua trabalhando no mesmo ritmo.", "counter"),
      step("Hold excess arrivals", "Segure as chegadas excedentes", "When the allowance is used up, the next customer waits for the next interval at the entrance. A longer queue does not manufacture extra grill capacity.", "Quando a cota acaba, o próximo cliente espera o intervalo seguinte na entrada. A fila maior não cria capacidade adicional na chapa.", "entrance"),
    ],
  },
  "design-principles/backpressure": {
    slug: "design-principles/backpressure", path: "/principios-design/backpressure", mode: "queue", station: "kitchen",
    title: text("Backpressure", "Controle de Pressão"),
    improvement: text("Let the cook pause new tickets when the kitchen rail fills, then reopen it as work clears.", "Faça o cozinheiro pausar novas comandas quando o suporte encher e retomar conforme o preparo avança."),
    steps: [
      step("The kitchen rail fills", "O suporte da cozinha enche", "Six pending tickets fill the kitchen rail. The cashier could keep taking orders, but the cook has nowhere safe to put more work.", "Seis comandas pendentes ocupam o suporte. O caixa poderia continuar recebendo pedidos, mas a cozinha não tem espaço seguro para mais trabalho.", "kitchen"),
      step("Send the pause upstream", "Leve a pausa ao balcão", "The cook sends a full-capacity checklist back to the cashier, who pauses new tickets instead of piling them onto the kitchen.", "O cozinheiro leva ao caixa o aviso de capacidade cheia; o caixa pausa novas comandas, em vez de empilhá-las na cozinha.", "counter"),
      step("Resume when space returns", "Retome quando houver espaço", "After the cook clears several tickets, only two remain. The cashier resumes sending orders at a pace the kitchen can accept.", "Depois de concluir vários pedidos, restam duas comandas. O caixa retoma o envio num ritmo que a cozinha consegue aceitar.", "kitchen"),
    ],
  },
  "design-principles/fault-tolerance": {
    slug: "design-principles/fault-tolerance", path: "/principios-design/tolerancia-falhas", mode: "recovery", station: "kitchen",
    title: text("Fault Tolerance", "Tolerância a Falhas"),
    improvement: text("Keep a spare preparation team and trustworthy order records so a broken grill need not stop every order.", "Mantenha preparo de reserva e comandas confiáveis para uma chapa quebrada não parar todos os pedidos."),
    steps: [
      step("Prepare a second team", "Prepare uma equipe de reserva", "The main kitchen and a nearby branch receive the same approved recipe. Both teams can read the restaurant's numbered order slips.", "A cozinha principal e uma filial próxima recebem a mesma receita aprovada. As duas equipes sabem ler as comandas numeradas da hamburgueria.", "kitchen"),
      step("A grill stops working", "Uma chapa deixa de funcionar", "The main cook reports a failed grill. The cashier holds #42 instead of continuing to send work toward equipment that cannot prepare it.", "O cozinheiro informa a falha da chapa. O caixa segura #42 em vez de continuar enviando trabalho para um equipamento incapaz de prepará-lo.", "kitchen"),
      step("Use real spare capacity", "Use uma reserva de verdade", "The branch accepts the recorded ticket and checks whether work already started. Spare staff and ingredients limit the loss; a second team cannot cover unlimited demand.", "A filial recebe a comanda registrada e confere se o preparo começou. Equipe e ingredientes de reserva limitam o impacto, mas não cobrem demanda ilimitada.", "branch"),
    ],
  },
  "design-principles/retries": {
    slug: "design-principles/retries", path: "/principios-design/tolerancia-falhas/retries", mode: "recovery", station: "counter",
    title: text("Retries", "Novas Tentativas"),
    improvement: text("Resend kitchen ticket #42 after a measured wait, keeping its number so the cook can recognize a repeat.", "Reenvie a comanda #42 após uma espera medida, mantendo o número para a cozinha reconhecer a repetição."),
    steps: [
      step("The receipt does not return", "O comprovante não volta", "The cook records #42, but the receipt confirming acceptance never reaches the cashier. The cashier cannot tell whether the ticket arrived.", "O cozinheiro registra #42, mas o comprovante de aceite não volta ao caixa. O caixa não sabe se a comanda chegou.", "counter"),
      step("Wait before sending again", "Espere antes de reenviar", "The cashier waits before trying again, varying the wait slightly between orders so every pending ticket does not return at once.", "O caixa espera antes de tentar novamente e varia um pouco a espera entre pedidos, evitando reenviar todas as comandas ao mesmo tempo.", "counter"),
      step("Recognize the same #42", "Reconheça o mesmo #42", "The repeated slip keeps #42. The cook checks the recorded number and returns its existing result instead of registering a second preparation job.", "A comanda reenviada mantém #42. O cozinheiro confere o número registrado e devolve o resultado existente, sem registrar outro trabalho de preparo.", "kitchen"),
    ],
  },
  "design-principles/circuit-breaker": {
    slug: "design-principles/circuit-breaker", path: "/principios-design/tolerancia-falhas/circuit-breaker", mode: "recovery", station: "counter",
    title: text("Circuit Breaker", "Disjuntor de Circuito"),
    improvement: text("Suspend new delivery requests after repeated courier failures and test recovery with one small trial.", "Suspenda novas entregas após falhas repetidas dos entregadores e teste a recuperação com uma tentativa limitada."),
    steps: [
      step("Repeated bags come back", "As bolsas voltam repetidamente", "Delivery staff cannot dispatch several accepted bags. The manager counts these failures instead of letting the cashier request couriers indefinitely.", "A equipe não consegue despachar várias bolsas aceitas. A gerência conta essas falhas, em vez de deixar o caixa pedir entregadores indefinidamente.", "dispatch"),
      step("Stop promising delivery", "Pare de prometer entrega", "A checklist at the cashier closes new delivery bookings quickly. Customers can still choose pickup; already prepared bags remain accounted for.", "Um aviso no caixa interrompe rapidamente novas reservas de entrega. Os clientes ainda podem retirar; as bolsas já prontas continuam registradas.", "counter"),
      step("Try one delivery first", "Teste uma única entrega", "After a waiting period, the manager permits one test bag. Only a successful return confirmation justifies reopening the normal delivery routine.", "Após uma espera, a gerência libera uma bolsa de teste. Só a confirmação de sucesso permite reabrir a rotina normal de entregas.", "dispatch"),
    ],
  },
  "design-principles/timeout": {
    slug: "design-principles/timeout", path: "/principios-design/tolerancia-falhas/timeout", mode: "network", station: "counter",
    title: text("Timeout", "Tempo Limite"),
    improvement: text("Limit how long the cashier waits for a kitchen receipt, then check the order before trying again.", "Limite a espera do caixa pelo comprovante da cozinha e confira o pedido antes de repetir."),
    steps: [
      step("Give #42 a waiting budget", "Dê um prazo à espera de #42", "The cashier sends #42 and starts a two-minute timer for its acceptance receipt. Other customers must not wait indefinitely at the counter.", "O caixa envia #42 e marca dois minutos para receber o comprovante de aceite. Os outros clientes não podem ficar esperando indefinidamente no balcão.", "kitchen"),
      step("The timer runs out", "O prazo termina", "No receipt returns before the timer expires. The cashier stops waiting at that counter and tells the customer that the outcome is still uncertain.", "Nenhum comprovante volta antes do prazo. O caixa para de aguardar naquele atendimento e informa ao cliente que o resultado ainda é incerto.", "counter"),
      step("Check before repeating", "Confira antes de repetir", "The cashier checks the order ledger for #42. Ending the wait did not erase a ticket already accepted or stop a burger already on the grill.", "O caixa consulta #42 no livro de pedidos. Encerrar a espera não apagou uma comanda aceita nem interrompeu um hambúrguer que já estava na chapa.", "stock"),
    ],
  },
  "design-principles/fallback": {
    slug: "design-principles/fallback", path: "/principios-design/tolerancia-falhas/fallback", mode: "recovery", station: "pickup",
    title: text("Fallback", "Alternativa de Contingência (Plano B)"),
    improvement: text("Offer a checked printed menu when the manager cannot provide a personalized suggestion.", "Ofereça um cardápio impresso conferido quando a gerência não puder dar uma sugestão personalizada."),
    steps: [
      step("Ask for a tailored suggestion", "Peça uma sugestão personalizada", "The cashier takes a customer's preferences to the manager's recipe desk, asking which burger to recommend today.", "O caixa leva as preferências do cliente à mesa de receitas da gerência e pede uma sugestão de hambúrguer para aquele dia.", "terminal"),
      step("The recipe desk cannot answer", "A mesa de receitas não responde", "The manager is unavailable and the agreed waiting time expires. The cashier cannot deliver the promised personalized suggestion.", "A gerência está indisponível e a espera combinada termina. O caixa não consegue oferecer a sugestão personalizada prometida.", "counter"),
      step("Offer the checked classics", "Ofereça os clássicos conferidos", "The cashier retrieves the printed classics menu, checks available ingredients and clearly offers a standard choice. It is a limited alternative, not a personalized answer.", "O caixa pega o cardápio impresso de clássicos, confere os ingredientes disponíveis e oferece uma opção padrão. É uma alternativa limitada, não uma resposta personalizada.", "counter"),
    ],
  },
  "design-principles/scalability": {
    slug: "design-principles/scalability", path: "/principios-design/escalabilidade", mode: "scaling", station: "kitchen",
    title: text("Design for Scalability", "Design para Escalabilidade"),
    improvement: text("Measure the lunch queue, find the busiest station and expand it before measuring the whole restaurant again.", "Meça a fila do almoço, encontre o posto mais ocupado e amplie antes de medir a hamburgueria novamente."),
    steps: [
      step("Lunch arrivals outpace service", "O almoço supera o atendimento", "More customers join the entrance queue each minute than the restaurant finishes orders. The line grows even though everyone is working.", "Entram mais clientes por minuto do que a hamburgueria conclui pedidos. A fila cresce mesmo com toda a equipe trabalhando.", "entrance"),
      step("Count unfinished tickets", "Conte as comandas pendentes", "The manager finds a clear cashier but a full kitchen rail. Adding another cashier would feed the same overloaded grill faster.", "A gerência encontra o caixa livre, mas o suporte da cozinha cheio. Outro caixa apenas enviaria trabalho mais rápido à mesma chapa sobrecarregada.", "kitchen"),
      step("Expand the actual bottleneck", "Amplie o gargalo verdadeiro", "A second grill clears more kitchen tickets. The manager measures finished orders again because ingredient handling or pickup may now become the slowest station.", "Uma segunda chapa libera mais comandas. A gerência mede os pedidos concluídos novamente, pois estoque ou retirada podem virar a etapa mais lenta.", "kitchen"),
    ],
  },
  "design-principles/horizontal-scaling": {
    slug: "design-principles/horizontal-scaling", path: "/principios-design/escalabilidade/horizontal", mode: "scaling", station: "branch",
    title: text("Horizontal Scalability (Scale-Out)", "Escalabilidade Horizontal (Scale-Out)"),
    improvement: text("Add another cooking station and split independent tickets while respecting the shared ingredient supply.", "Adicione outro posto de preparo e divida comandas independentes, respeitando o estoque compartilhado."),
    steps: [
      step("Open another cooking station", "Abra outro posto de preparo", "A second cook receives the approved recipe and starts at another grill. The first grill remains in service.", "Outro cozinheiro recebe a receita aprovada e assume uma segunda chapa. A primeira continua atendendo.", "kitchen"),
      step("Split the tickets", "Divida as comandas", "The cashier sends different numbered orders to the available cooks. One ticket belongs to one preparation job, rather than every cook making #42.", "O caixa distribui pedidos com números diferentes entre cozinheiros disponíveis. Cada comanda corresponde a um preparo; todos não fazem #42 ao mesmo tempo.", "kitchen"),
      step("Check what is still shared", "Confira o que continua compartilhado", "Both cooks collect buns from the same stockroom. Twice as many grills cannot double finished orders if buns, the cashier or pickup remain limiting.", "Os dois cozinheiros pegam pães no mesmo estoque. Dobrar chapas não dobra pedidos concluídos se pães, caixa ou retirada continuarem limitando o fluxo.", "stock"),
    ],
  },
  "design-principles/vertical-scaling": {
    slug: "design-principles/vertical-scaling", path: "/principios-design/escalabilidade/vertical", mode: "scaling", station: "kitchen",
    title: text("Vertical Scalability (Scale-Up)", "Escalabilidade Vertical (Scale-Up)"),
    improvement: text("Replace one small grill with a larger grill, increasing that station without creating an independent second team.", "Troque uma chapa pequena por uma maior, ampliando o mesmo posto sem criar uma segunda equipe independente."),
    steps: [
      step("Inspect the small grill", "Examine a chapa pequena", "One cook can fit only a few patties on the existing grill. The manager checks that this station, not pickup, is limiting lunch service.", "Um cozinheiro acomoda poucos hambúrgueres na chapa atual. A gerência confere que esse posto, e não a retirada, limita o almoço.", "kitchen"),
      step("Upgrade the same station", "Amplie o mesmo posto", "The restaurant pauses that station to install a larger grill. The same cook and order handoff now have more cooking surface.", "A hamburgueria pausa o posto para instalar uma chapa maior. O mesmo cozinheiro e a mesma passagem de comandas ganham mais superfície de preparo.", "kitchen"),
      step("Recognize the remaining dependency", "Reconheça a dependência restante", "The upgraded station handles a larger batch, but its interruption still stops that station's work. A larger grill is not a spare grill.", "O posto ampliado prepara uma leva maior, mas sua interrupção ainda para aquele trabalho. Uma chapa maior não é uma chapa de reserva.", "kitchen"),
    ],
  },
  "design-principles/data-consistency": {
    slug: "design-principles/data-consistency", path: "/principios-design/escalabilidade/consistencia", mode: "replication", station: "stock",
    title: text("Data Consistency", "Consistência de Dados"),
    improvement: text("Confirm the last bun in the official reservation ledger before another counter promises the same portion.", "Confirme o último pão no livro oficial de reservas antes que outro balcão prometa a mesma porção."),
    steps: [
      step("Two counters see one bun", "Dois balcões veem um pão", "The main cashier and branch cashier each hold a stock sheet showing one bun. Their two copies do not create a second bun.", "O caixa principal e o da filial têm folhas de estoque mostrando um pão. Duas cópias da informação não criam outro pão.", "counter"),
      step("Reserve in the official ledger", "Reserve no livro oficial", "Before promising #42, the cashier asks the stockkeeper to record its reservation in the official ledger. A second conflicting promise must be checked there.", "Antes de prometer #42, o caixa pede ao estoquista que registre a reserva no livro oficial. Outra promessa conflitante precisa ser conferida ali.", "stock"),
      step("Bring the copy up to date", "Atualize a cópia", "The branch receives the revised sheet. Waiting for confirmation avoids a conflicting promise; using an older copy is faster but can be wrong.", "A filial recebe a folha revisada. Esperar pela confirmação evita promessas conflitantes; consultar uma cópia antiga é mais rápido, mas pode estar errado.", "branch"),
    ],
  },
  "design-principles/latency": {
    slug: "design-principles/latency", path: "/principios-design/escalabilidade/latencia", mode: "delivery", station: "dispatch",
    title: text("Latency", "Latência"),
    improvement: text("Time one order from customer arrival to pickup, including the minutes its ticket spends waiting.", "Cronometre um pedido da chegada à retirada, incluindo os minutos em que a comanda fica esperando."),
    steps: [
      step("Start with customer #42", "Comece com o cliente de #42", "The cashier notes the start time when accepting #42. The customer experiences the entire journey, not just the time on the grill.", "O caixa anota o início ao aceitar #42. O cliente sente o caminho inteiro, não apenas o tempo na chapa.", "counter"),
      step("Wait behind other tickets", "Espere atrás das outras comandas", "Ticket #42 waits behind six earlier orders before the cook can start. This waiting adds latency even when the cooking recipe itself has not changed.", "A comanda #42 espera seis pedidos anteriores antes do preparo. Essa espera aumenta a latência mesmo sem alterar a receita ou o tempo de chapa.", "kitchen"),
      step("Stop at the actual pickup", "Pare na retirada de verdade", "Pickup records six minutes from acceptance to handoff. The manager separates queueing, cooking and packing time before deciding which delay to reduce.", "A retirada registra seis minutos do aceite à entrega. A gerência separa espera, preparo e embalagem antes de decidir qual atraso reduzir.", "pickup"),
    ],
  },
  "design-principles/failover": {
    slug: "design-principles/failover", path: "/principios-design/escalabilidade/failover", mode: "recovery", station: "branch",
    title: text("Failover in Distributed Systems", "Comutação por Falha em Sistemas Distribuídos"),
    improvement: text("Move the cashier role to the backup counter with an up-to-date ledger and one clearly authorized owner.", "Transfira o atendimento ao balcão de reserva com livro atualizado e uma única posse autorizada."),
    steps: [
      step("The main counter closes", "O balcão principal fecha", "The main cashier can no longer accept #42. Staff mark that counter unavailable instead of silently losing its outstanding tickets.", "O caixa principal não consegue mais aceitar #42. A equipe marca o balcão como indisponível e preserva as comandas pendentes.", "counter"),
      step("Hand over the latest ledger", "Entregue o livro atualizado", "The manager hands the backup branch the confirmed order ledger and authority to continue. The previous cashier must no longer change the same register.", "A gerência entrega à filial de reserva o livro confirmado e a autorização para continuar. O caixa anterior deixa de alterar o mesmo registro.", "branch"),
      step("Resume at the backup counter", "Retome no balcão de reserva", "New ticket #43 goes to the backup cashier. Staff check earlier orders before repeating work; a backup with an old ledger can still lose recent information.", "A nova comanda #43 vai ao caixa de reserva. A equipe confere pedidos anteriores antes de repetir trabalho; um livro atrasado ainda pode perder informações recentes.", "branch"),
    ],
  },
  "design-principles/availability": {
    slug: "design-principles/availability", path: "/principios-design/disponibilidade", mode: "recovery", station: "entrance",
    title: text("High Availability", "Alta Disponibilidade"),
    improvement: text("Measure whether customers can actually receive orders during the promised opening hours, even with one counter closed.", "Meça se clientes conseguem receber pedidos no horário prometido, inclusive com um balcão fechado."),
    steps: [
      step("State the service promise", "Defina a promessa de atendimento", "The manager writes the opening hours and an acceptable order wait on the checklist. An open door alone does not mean customers are being served.", "A gerência escreve o horário de atendimento e a espera aceitável na prancheta. Uma porta aberta não significa que os clientes estão sendo atendidos.", "counter"),
      step("Keep a working alternative", "Mantenha uma alternativa funcionando", "When the main cashier stops, customers can use the prepared backup counter. It needs staff, ingredients and access to confirmed orders.", "Quando o caixa principal para, os clientes usam o balcão de reserva preparado. Ele precisa de equipe, ingredientes e acesso às comandas confirmadas.", "branch"),
      step("Count completed service", "Conte o atendimento concluído", "The manager checks pickup receipts against attempted orders and their deadlines. Long waits and rejected customers count against the promise, even if another counter stayed open.", "A gerência compara recibos da retirada com pedidos tentados e seus prazos. Esperas excessivas e recusas pesam contra a promessa, mesmo com outro balcão aberto.", "terminal"),
    ],
  },
  "design-principles/replication": {
    slug: "design-principles/replication", path: "/principios-design/disponibilidade/replicacao", mode: "replication", station: "stock",
    title: text("Replication in Distributed Systems", "Replicação em Sistemas Distribuídos"),
    improvement: text("Carry an approved recipe copy to each branch and make delayed copies visible.", "Leve uma cópia da receita aprovada a cada filial e deixe visível o atraso das cópias."),
    steps: [
      step("Approve recipe v2", "Aprove a receita v2", "The manager signs recipe v2 at the main kitchen. The branch still holds the previous sheet; changing the original does not update paper elsewhere.", "A gerência assina a receita v2 na cozinha principal. A filial ainda guarda a folha anterior; alterar o original não atualiza papéis em outro lugar.", "kitchen"),
      step("The copy is still travelling", "A cópia ainda está a caminho", "The runner carrying v2 is delayed before reaching the branch. Staff there must recognize that their local recipe can be behind.", "O ajudante que leva v2 demora a chegar à filial. A equipe de lá precisa reconhecer que sua receita local pode estar atrasada.", "branch"),
      step("Check the arriving version", "Confira a versão recebida", "The branch receives v2 and replaces the old copy after checking its version. Further branches need their own confirmed handoffs; the copies do not change simultaneously.", "A filial recebe v2 e substitui a cópia antiga após conferir a versão. Outras filiais precisam de suas próprias entregas confirmadas; as cópias não mudam simultaneamente.", "branch"),
    ],
  },
  "design-principles/availability-zones": {
    slug: "design-principles/availability-zones", path: "/principios-design/disponibilidade/zonas", mode: "recovery", station: "branch",
    title: text("Availability Zones", "Zonas de Disponibilidade"),
    improvement: text("Prepare another neighborhood kitchen with its own utilities and recipe copy, while checking shared suppliers.", "Prepare outra cozinha no bairro com instalações e receita próprias, sem esquecer fornecedores compartilhados."),
    steps: [
      step("Check independent premises", "Confira instalações independentes", "The manager checks that the branch has its own power and water rather than sharing every failure point with the main kitchen.", "A gerência confere se a filial tem energia e água próprias, em vez de compartilhar todos os pontos de falha com a cozinha principal.", "branch"),
      step("Prepare before the outage", "Prepare antes da interrupção", "A runner delivers the approved recipe and stock checklist to the branch. A second building is useless if its staff lack ingredients or current instructions.", "Um ajudante entrega a receita aprovada e a lista de estoque à filial. Outro prédio não ajuda sem ingredientes e instruções atuais para sua equipe.", "branch"),
      step("Serve around the affected kitchen", "Atenda fora da cozinha afetada", "A local kitchen interruption sends eligible orders to the ready branch. A supplier serving both locations can still affect both; separate premises do not remove every shared risk.", "Uma interrupção local leva pedidos elegíveis à filial pronta. Um fornecedor das duas unidades ainda pode afetar ambas; separar prédios não elimina todo risco comum.", "branch"),
    ],
  },
  "consistency-strategies/index": {
    slug: "consistency-strategies/index", path: "/estrategias-de-consistencia", mode: "consensus", station: "stock",
    title: text("Consistency Strategies", "Estratégias de Consistência"),
    improvement: text("Choose how cashiers share the last-bun reservation, instead of letting separate notebooks make contradictory promises.", "Escolha como os caixas compartilham a reserva do último pão, evitando promessas contraditórias em cadernos separados."),
    steps: [
      step("Spot the conflicting promises", "Perceba as promessas conflitantes", "Two cashiers each see one bun on their copied sheets. If both accept an order without coordinating, two customers are promised the same portion.", "Dois caixas veem um pão em suas folhas copiadas. Se aceitarem sem combinar, dois clientes recebem a promessa da mesma porção.", "counter"),
      step("Protect the shared decision", "Proteja a decisão compartilhada", "One cashier takes the reservation key and checks the official stock ledger before recording #42. The other must wait or use a different explicitly chosen rule.", "Um caixa pega a chave de reservas e confere o livro oficial antes de registrar #42. O outro espera ou segue outra regra escolhida explicitamente.", "stock"),
      step("Show the rule to the branch", "Mostre a regra à filial", "The branch receives the confirmed reservation sheet. The manager explains when copies may lag and which promises require an official check first.", "A filial recebe a folha de reservas confirmada. A gerência explica quando cópias podem atrasar e quais promessas exigem conferência oficial antes.", "branch"),
    ],
  },
  "consistency-strategies/consensus": {
    slug: "consistency-strategies/consensus", path: "/estrategias-de-consistencia/consenso", mode: "consensus", station: "branch",
    title: text("Consensus Strategies", "Estratégias de Consenso"),
    improvement: text("Have branch supervisors approve one recipe version under an agreed voting procedure before it becomes official.", "Faça os responsáveis das filiais aprovarem uma única versão de receita pelo procedimento combinado antes de oficializá-la."),
    steps: [
      step("Propose the same recipe", "Proponha a mesma receita", "The manager sends recipe v2 to three branch supervisors. Each supervisor sees the proposal version and voting round before signing.", "A gerência envia a receita v2 a três responsáveis de filiais. Cada um confere a versão proposta e a rodada antes de assinar.", "branch"),
      step("Count compatible approvals", "Conte aprovações compatíveis", "The manager checks two recorded approvals for v2 in the same round. Signatures for different recipes or rounds cannot be added together.", "A gerência confere duas aprovações registradas para v2 na mesma rodada. Assinaturas de receitas ou rodadas diferentes não podem ser somadas.", "terminal"),
      step("Record one official version", "Registre uma versão oficial", "Following the agreed procedure, the manager records the chosen v2 and sends that signed recipe to the cook. A missing supervisor cannot simply announce a conflicting official recipe.", "Seguindo o procedimento combinado, a gerência registra v2 e entrega a receita assinada ao cozinheiro. Um responsável ausente não pode simplesmente declarar outra receita oficial conflitante.", "kitchen"),
    ],
  },
  "consistency-strategies/lamport-timestamps": {
    slug: "consistency-strategies/lamport-timestamps", path: "/estrategias-de-consistencia/lamport-timestamps", mode: "events", station: "counter",
    title: text("Lamport Logical Clocks", "Relógios Lógicos de Lamport"),
    improvement: text("Stamp order handoffs with logical sequence numbers, without treating those numbers as wall-clock time.", "Carimbe passagens de comandas com números lógicos, sem confundi-los com o horário do relógio."),
    steps: [
      step("Advance the cashier stamp", "Avance o carimbo do caixa", "After stamp 4, the cashier marks the next order handoff with 5. This counts logical events; it does not mean five o'clock.", "Depois do carimbo 4, o caixa marca a próxima passagem de comanda com 5. O número conta eventos lógicos; não significa cinco horas.", "counter"),
      step("Carry the stamp with #42", "Leve o carimbo com #42", "The runner carries ticket #42 and stamp 5 to the cook. The cook's own notebook is already at 8.", "O ajudante leva a comanda #42 com carimbo 5 ao cozinheiro. O caderno do cozinheiro já está em 8.", "kitchen"),
      step("Write a larger received stamp", "Registre um carimbo maior", "The cook records 9, one beyond the larger of 8 and 5. The manager knows an earlier handoff gets a smaller stamp, but stamp order alone does not prove causation.", "O cozinheiro registra 9, um além do maior entre 8 e 5. A gerência sabe que uma passagem anterior recebe marca menor, mas só a ordem das marcas não prova causalidade.", "terminal"),
    ],
  },
  "consistency-strategies/two-phase-commit": {
    slug: "consistency-strategies/two-phase-commit", path: "/estrategias-de-consistencia/two-phase-commit", mode: "saga", station: "stock",
    title: text("Two-Phase Commit (2PC)", "Confirmação em Duas Fases (2PC)"),
    improvement: text("Hold the cashier and stockkeeper's pending reservations until the manager records one final decision.", "Mantenha as reservas pendentes do caixa e do estoque até a gerência registrar uma decisão final."),
    steps: [
      step("Ask everyone to prepare", "Peça que todos se preparem", "For #42, the manager asks the cashier and stockkeeper to reserve their entries and sign readiness. Ingredients are held; no burger is cooked in this preparation phase.", "Para #42, a gerência pede ao caixa e ao estoque que reservem seus lançamentos e assinem a prontidão. Os ingredientes ficam separados; nenhum hambúrguer é preparado nessa fase.", "stock"),
      step("Write the final decision", "Escreva a decisão final", "Only after all required readiness slips return does the manager record the commit decision in the decision ledger. Participants must follow this recorded decision.", "Só depois de receber todos os comprovantes necessários a gerência registra a confirmação no livro de decisões. Os participantes devem seguir essa decisão registrada.", "terminal"),
      step("A prepared reservation waits", "Uma reserva preparada espera", "If the final decision cannot reach the stockkeeper, the prepared reservation remains held. Uncertainty can block the order; this does not make cooked food reversible.", "Se a decisão final não chegar ao estoque, a reserva preparada continua retida. A incerteza pode bloquear o pedido; isso não torna comida pronta reversível.", "stock"),
    ],
  },
  "consistency-strategies/synchronization": {
    slug: "consistency-strategies/synchronization", path: "/estrategias-de-consistencia/sincronizacao", mode: "consensus", station: "kitchen",
    title: text("Synchronization in Distributed Systems", "Sincronização em Sistemas Distribuídos"),
    improvement: text("Use one reservation key to protect checking and reserving the last cheese slice as a single guarded routine.", "Use uma chave de reserva para proteger a conferência e a reserva da última fatia de queijo na mesma rotina."),
    steps: [
      step("Two cooks read the same count", "Dois cozinheiros leem a mesma quantidade", "Two cooks consult copied sheets showing one cheese slice. Neither has reserved it yet, so both might wrongly promise it.", "Dois cozinheiros consultam folhas que mostram uma fatia de queijo. Nenhum a reservou; os dois poderiam prometê-la por engano.", "kitchen"),
      step("Take the reservation key", "Pegue a chave de reservas", "One cook takes the shared key, rechecks the official ledger and reserves the slice for #42 before releasing the key.", "Um cozinheiro pega a chave compartilhada, confere novamente o livro oficial e reserva a fatia para #42 antes de devolver a chave.", "stock"),
      step("The next cook checks zero", "O próximo cozinheiro confere zero", "The next worker takes the returned key and reads zero available slices in the updated ledger. Waiting for ownership prevents both from using the old count.", "O próximo trabalhador pega a chave devolvida e lê zero fatias disponíveis no livro atualizado. Esperar a posse impede ambos de usar a contagem antiga.", "counter"),
    ],
  },
  "consistency-strategies/synchronization-fundamentals": {
    slug: "consistency-strategies/synchronization-fundamentals", path: "/estrategias-de-consistencia/sincronizacao/fundamentos", mode: "queue", station: "stock",
    title: text("Synchronization Fundamentals", "Fundamentos da Sincronização"),
    improvement: text("Guard the order-count notebook with one shared key and make the key's scope explicit.", "Proteja o caderno de contagem com uma chave compartilhada e deixe claro onde essa chave vale."),
    steps: [
      step("Lose an increment", "Perca um incremento", "Two cashiers both read 10 in the order notebook and each writes 11. Two new orders have arrived, but the notebook gained only one.", "Dois caixas leem 10 no caderno e cada um escreve 11. Chegaram dois pedidos, mas o caderno ganhou apenas um.", "counter"),
      step("Guard read and write together", "Proteja leitura e alteração juntas", "The manager issues one key for that notebook. Its holder reads the latest count, adds the order and returns the key only after writing.", "A gerência entrega uma única chave para esse caderno. Quem a segura lê a contagem atual, acrescenta o pedido e só devolve a chave depois de escrever.", "counter"),
      step("A branch key is not the same key", "A chave da filial não é a mesma", "A separate branch key cannot protect this notebook. Workers sharing one count must use an ownership rule shared by all of them, not independent local keys.", "Uma chave separada da filial não protege este caderno. Quem compartilha a contagem precisa da mesma regra de posse, não de chaves locais independentes.", "counter"),
    ],
  },
  "consistency-strategies/synchronization-deadlocks": {
    slug: "consistency-strategies/synchronization-deadlocks", path: "/estrategias-de-consistencia/sincronizacao/deadlocks", mode: "queue", station: "kitchen",
    title: text("Deadlocks in Distributed Systems", "Deadlocks em Sistemas Distribuídos"),
    improvement: text("Expose two cooks holding different cupboard keys while waiting for one another, then impose one acquisition order.", "Mostre dois cozinheiros com chaves diferentes esperando um pelo outro e depois imponha uma ordem de retirada."),
    steps: [
      step("Hold different keys", "Segure chaves diferentes", "One cook holds the fridge key and needs the pantry key. Another holds the pantry key and still needs the fridge key for the same preparation stage.", "Um cozinheiro segura a chave da geladeira e precisa da despensa. Outro segura a da despensa e ainda precisa da geladeira para a mesma etapa de preparo.", "stock"),
      step("Neither cook can continue", "Nenhum cozinheiro consegue avançar", "Both cooks wait while keeping the key they already hold. Tickets pile up because each requires the resource held by the other.", "Os dois esperam sem devolver a chave que já seguram. As comandas se acumulam porque cada um precisa do recurso retido pelo outro.", "kitchen"),
      step("Break the circular wait", "Quebre a espera circular", "The manager asks one cook to return the keys and restarts the reservation. A shared rule now requests fridge before pantry, preventing this opposite acquisition order.", "A gerência manda devolver as chaves de uma reserva e reinicia essa reserva. A regra comum agora exige geladeira antes de despensa, evitando essa ordem invertida.", "terminal"),
    ],
  },
  "consistency-strategies/saga": {
    slug: "consistency-strategies/saga", path: "/estrategias-de-consistencia/saga", mode: "saga", station: "dispatch",
    title: text("The Saga Pattern", "O Padrão Saga"),
    improvement: text("Compensate a failed delivery booking with a refund receipt and release of an unprepared ingredient reservation.", "Compense uma entrega não reservada com comprovante de estorno e liberação de ingredientes ainda não preparados."),
    steps: [
      step("Record completed local steps", "Registre as etapas locais concluídas", "For #42, the cashier records payment and the stockkeeper reserves an ingredient kit in separate books. Each completed step has its own receipt.", "Para #42, o caixa registra o pagamento e o estoque reserva um kit em livros separados. Cada etapa concluída tem seu próprio comprovante.", "stock"),
      step("No courier can accept the bag", "Nenhum entregador aceita a bolsa", "Delivery booking fails after those earlier entries were recorded. The manager cannot erase history and pretend neither earlier step happened.", "A reserva de entrega falha depois dos registros anteriores. A gerência não pode apagar o histórico e fingir que essas etapas nunca aconteceram.", "dispatch"),
      step("Write compensating receipts", "Registre os comprovantes de compensação", "The cashier issues and checks a refund receipt, while stock staff release the still-unprepared kit reservation. These are new actions; a cooked burger cannot be made raw again.", "O caixa emite e confere o estorno, enquanto o estoque libera a reserva do kit ainda não preparado. São novas ações; um hambúrguer pronto não volta a ficar cru.", "counter"),
    ],
  },
  "consistency-strategies/delivery-semantics": {
    slug: "consistency-strategies/delivery-semantics", path: "/estrategias-de-consistencia/delivery-semantics", mode: "delivery", station: "pickup",
    title: text("Delivery Semantics", "Semânticas de Entrega"),
    improvement: text("Track delivery of kitchen ticket #42 separately from the physical preparation or delivery of its burger.", "Acompanhe a entrega da comanda #42 separadamente do preparo ou da entrega física do hambúrguer."),
    steps: [
      step("The acceptance receipt is missing", "Falta o comprovante de aceite", "The cook records receiving ticket #42, but its acceptance receipt never reaches the cashier. A missing receipt does not reveal whether the slip arrived.", "O cozinheiro registra que recebeu a comanda #42, mas o comprovante não chega ao caixa. A falta do recibo não revela se o papel chegou.", "counter"),
      step("Choose whether to resend", "Escolha se deve reenviar", "Resending #42 avoids abandoning a lost ticket but can deliver a duplicate. Refusing to resend avoids that repeat but can leave a lost ticket unhandled.", "Reenviar #42 evita abandonar uma comanda perdida, mas pode repetir sua entrega. Não reenviar evita essa repetição, mas pode deixar uma comanda perdida sem tratamento.", "kitchen"),
      step("Check the recorded number", "Confira o número registrado", "The cook checks #42 in the order archive before registering another job. This protects the recorded action within that rule; it does not promise exactly one physical burger delivery.", "O cozinheiro confere #42 no arquivo antes de registrar outro trabalho. A regra protege essa ação registrada; não promete uma única entrega física de hambúrguer.", "stock"),
    ],
  },
  "consistency-strategies/vector-clocks": {
    slug: "consistency-strategies/vector-clocks", path: "/estrategias-de-consistencia/vector-clocks", mode: "replication", station: "branch",
    title: text("Vector Clocks", "Relógios Vetoriais"),
    improvement: text("Annotate recipe copies with per-branch revision counts so independent edits are not mistaken for later replacements.", "Anote as revisões de cada filial nas receitas para não confundir mudanças independentes com substituições posteriores."),
    steps: [
      step("Branches edit their own copies", "As filiais editam suas cópias", "Supervisor A adds a change to a recipe marked [1,0], producing [2,0]. Separately, supervisor B changes the earlier copy to [1,1].", "O responsável A altera a receita marcada [1,0], produzindo [2,0]. Separadamente, B muda a cópia anterior para [1,1].", "branch"),
      step("Compare both revision columns", "Compare as duas colunas de revisão", "The manager compares the sheets. Neither [2,0] nor [1,1] includes all revisions of the other, so these edits are concurrent, not a simple newer-and-older pair.", "A gerência compara as folhas. Nem [2,0] nem [1,1] inclui todas as revisões da outra; são mudanças concorrentes, não apenas uma cópia nova e outra velha.", "terminal"),
      step("Resolve the actual recipe", "Resolva a receita de verdade", "The manager resolves the ingredients with supervisor A. Their approved revision advances A again to [3,1]; merging counts alone never chooses which recipe to serve.", "A gerência resolve os ingredientes com o responsável A. A revisão aprovada avança A para [3,1]; mesclar contagens não escolhe sozinho a receita a servir.", "kitchen"),
    ],
  },
  "security/index": {
    slug: "security/index", path: "/seguranca", mode: "security", station: "entrance",
    title: text("Security in Distributed Systems", "Segurança em Sistemas Distribuídos"),
    improvement: text("Protect the burger restaurant with an identity check, a restricted stockroom and a private order envelope.", "Proteja a hamburgueria com identificação, acesso restrito ao estoque e um envelope de pedido reservado."),
    steps: [
      step("Check the staff badge", "Confira o crachá da equipe", "At the entrance, the host compares the employee badge with the shift roster before letting a worker behind the counter.", "Na entrada, a recepção compara o crachá com a escala antes de permitir a passagem para trás do balcão.", "entrance"),
      step("Restrict the stockroom key", "Restrinja a chave do estoque", "The manager keeps the stockroom key; a valid employee badge alone does not entitle every worker to take ingredients.", "A gerência guarda a chave do estoque; um crachá válido não dá a qualquer funcionário permissão para retirar ingredientes.", "stock"),
      step("Seal private order details", "Lacre os detalhes privados", "The counter seals the customer details before passing the order to dispatch. Identity, permission and confidentiality solve different problems.", "O balcão lacra os dados do cliente antes de encaminhar o pedido à expedição. Identidade, permissão e sigilo resolvem problemas diferentes.", "dispatch"),
    ],
  },
  "security/authentication": {
    slug: "security/authentication", path: "/seguranca/autenticacao", mode: "security", station: "entrance",
    title: text("Authentication in Distributed Systems", "Autenticação em Sistemas Distribuídos"),
    improvement: text("Recognize a restaurant employee by checking their badge against the manager’s shift record.", "Reconheça um funcionário conferindo seu crachá com o registro de turnos da gerência."),
    steps: [
      step("Present the badge", "Apresente o crachá", "A worker arrives at the burger restaurant and presents a named employee badge to the host. Possessing a name alone is not enough.", "Um funcionário chega à hamburgueria e apresenta um crachá nominal à recepção. Saber um nome não basta.", "entrance"),
      step("Compare with the shift record", "Compare com o registro do turno", "The host takes the badge to the manager’s desk, where its identity is checked against the approved shift roster.", "A recepção leva o crachá à mesa da gerência, que confere a identidade na escala aprovada.", "terminal"),
      step("Recognize the checked worker", "Reconheça o funcionário verificado", "The checked badge reaches the counter so the worker can be recognized during this shift. Separate rules still govern stockroom access.", "O crachá conferido chega ao balcão para identificar o funcionário durante o turno. O acesso ao estoque ainda depende de regras próprias.", "counter"),
    ],
  },
  "security/authorization": {
    slug: "security/authorization", path: "/seguranca/autorizacao", mode: "security", station: "stock",
    title: text("Authorization in Distributed Systems", "Autorização em Sistemas Distribuídos"),
    improvement: text("Give each restaurant role access only to the actions and orders it is responsible for.", "Dê a cada função da hamburgueria acesso apenas às ações e aos pedidos sob sua responsabilidade."),
    steps: [
      step("Identify the kitchen worker", "Identifique a pessoa da cozinha", "At the counter, a checked kitchen badge identifies who is asking to collect the next preparation slip.", "No balcão, um crachá conferido da cozinha identifica quem está pedindo a próxima comanda de preparo.", "counter"),
      step("Allow preparation, not price changes", "Permita preparar, não alterar preços", "The counter passes an order slip to the kitchen worker. Their role permits marking preparation, while price changes require the manager.", "O balcão passa uma comanda à pessoa da cozinha. Sua função permite marcar o preparo; alterações de preço exigem a gerência.", "kitchen"),
      step("Match the collection receipt", "Confira o comprovante de retirada", "At pickup, the attendant matches receipt 42 to order 42 before releasing the tray. A recognized customer cannot collect someone else’s order.", "Na retirada, o atendente confere o comprovante 42 com o pedido 42 antes de liberar a bandeja. Um cliente reconhecido não pode retirar o pedido alheio.", "pickup"),
    ],
  },
  "security/cryptography": {
    slug: "security/cryptography", path: "/seguranca/criptografia", mode: "security", station: "stock",
    title: text("Cryptography in Distributed Systems", "Criptografia em Sistemas Distribuídos"),
    improvement: text("Use distinct restaurant safeguards for private order records, tampering checks and password verification.", "Use proteções distintas da hamburgueria para registros privados, conferência de violação e verificação de senha."),
    steps: [
      step("Keep the key separate", "Guarde a chave separadamente", "The manager secures a private order envelope in a locked stockroom cabinet and keeps the key separately. This illustrates encrypted records and separate key control.", "A gerência protege um envelope de pedido privado no armário trancado do estoque e mantém a chave separada. Isso ilustra registros cifrados e controle separado das chaves.", "stock"),
      step("Inspect the envelope seal", "Inspecione o lacre do envelope", "At the counter, the receiver checks the sender’s registered seal before trusting the order note. A seal represents integrity; it does not hide the writing.", "No balcão, quem recebe confere o lacre cadastrado do remetente antes de confiar na comanda. O lacre representa integridade; não oculta a escrita.", "counter"),
      step("Compare without retrieving a password", "Compare sem recuperar a senha", "The manager checks a derived password record, never a recoverable password list. Real password storage needs a salted, adaptive hash; a paper stamp cannot supply that guarantee.", "A gerência confere um registro derivado, nunca uma lista de senhas recuperáveis. Senhas reais exigem derivação adaptativa com sal; um carimbo de papel não oferece essa garantia.", "terminal"),
    ],
  },
  "security/tokens": {
    slug: "security/tokens", path: "/seguranca/tokens", mode: "security", station: "entrance",
    title: text("Tokens and JWT in Distributed Systems", "Tokens e JWT em Sistemas Distribuídos"),
    improvement: text("Treat a signed restaurant badge as a limited, expiring statement rather than a secret or universal pass.", "Trate um crachá assinado da hamburgueria como declaração limitada e temporária, não como segredo ou passe universal."),
    steps: [
      step("Receive the shift badge", "Receba o crachá do turno", "At the entrance, a temporary worker presents a restaurant-issued badge carrying the shift, role and closing time.", "Na entrada, um funcionário temporário apresenta um crachá emitido pela hamburgueria com turno, função e horário de término.", "entrance"),
      step("Check issuer and expiry", "Confira emissor e validade", "The manager checks the approved stamp, the intended branch and the expiry before trusting the badge. In a JWT, cryptographic verification replaces visual stamp inspection.", "A gerência confere o carimbo autorizado, a filial destinatária e a validade antes de confiar no crachá. Em um JWT, a verificação criptográfica substitui a inspeção visual do carimbo.", "terminal"),
      step("Apply the badge’s limits", "Aplique os limites do crachá", "The counter allows only the printed kitchen duties. A readable signed badge, like an unencrypted signed JWT, proves neither secrecy nor permission for every action.", "O balcão permite apenas as tarefas de cozinha indicadas. Um crachá assinado legível, como um JWT assinado sem cifra, não oferece sigilo nem permissão para qualquer ação.", "counter"),
    ],
  },
  "security/ssl-tls": {
    slug: "security/ssl-tls", path: "/seguranca/ssl-tls", mode: "security", station: "dispatch",
    title: text("SSL/TLS in Distributed Systems", "SSL/TLS em Sistemas Distribuídos"),
    improvement: text("Check the intended restaurant recipient before exchanging protected order envelopes.", "Confira o destinatário correto da hamburgueria antes de trocar envelopes de pedido protegidos."),
    steps: [
      step("Check the recipient’s identity", "Confira a identidade do destinatário", "At the entrance, the courier checks the recipient’s restaurant badge against the expected branch before handing over private paperwork. This represents certificate and hostname checks.", "Na entrada, o entregador confere o crachá do destinatário com a filial esperada antes de passar documentos privados. Isso representa a conferência de certificado e nome do destino.", "entrance"),
      step("Agree a temporary key", "Combine uma chave temporária", "At the manager’s desk, the verified parties arrange a temporary lock and key for their exchange. Real TLS derives session secrets; it does not send a visible key in an open envelope.", "Na mesa da gerência, as partes verificadas combinam uma chave temporária para a troca. O TLS real deriva segredos de sessão; não envia uma chave visível em envelope aberto.", "terminal"),
      step("Carry the protected order", "Leve a comanda protegida", "Dispatch receives the sealed order and checks its protection before opening it. Protecting this journey does not grant permission to alter the order after arrival.", "A expedição recebe a comanda lacrada e confere sua proteção antes de abri-la. Proteger o trajeto não concede permissão para alterar o pedido no destino.", "dispatch"),
    ],
  },
  "security/common-attacks": {
    slug: "security/common-attacks", path: "/seguranca/ataques", mode: "security", station: "entrance",
    title: text("Attacks on Distributed Systems", "Ataques em Sistemas Distribuídos"),
    improvement: text("Stop forged collection slips and unauthorized stockroom instructions at the restaurant’s existing boundaries.", "Barre comprovantes de retirada forjados e instruções de acesso indevido ao estoque nos limites da hamburgueria."),
    steps: [
      step("Present a forged receipt", "Apresente um comprovante forjado", "Someone arrives with a slip claiming order 42 and an added instruction to release stockroom ingredients. The written instruction does not create authority.", "Alguém chega com um papel que alega ser do pedido 42 e manda liberar ingredientes do estoque. A instrução escrita não cria autorização.", "counter"),
      step("Reject the stockroom instruction", "Rejeite a ordem de acesso ao estoque", "The stockkeeper keeps the key and compares the request with the approved order ledger. The customer’s note is never treated as a manager’s command.", "Quem cuida do estoque mantém a chave e confere a solicitação no livro de pedidos aprovado. A nota do cliente nunca vira ordem da gerência.", "stock"),
      step("Record and limit the attempt", "Registre e limite a tentativa", "The manager records the attempted fraud and limits repeated suspicious requests. Layered checks limit damage; they do not prove that every attack is impossible.", "A gerência registra a tentativa e limita solicitações suspeitas repetidas. Conferências em camadas reduzem danos; não provam que todo ataque é impossível.", "terminal"),
    ],
  },
  "security/prompt-injection": {
    slug: "security/prompt-injection", path: "/seguranca/prompt-injection", mode: "security", station: "terminal",
    title: text("Prompt Injection & LLM Guardrails", "Injeção de Instruções e Proteções de LLM"),
    improvement: text("Keep a supplier’s note from becoming an instruction to the restaurant’s menu advisor.", "Impeça uma nota do fornecedor de virar ordem para o orientador de cardápio da hamburgueria."),
    steps: [
      step("Read the supplier’s note", "Leia a nota do fornecedor", "The menu advisor fetches an ingredient note from stock. Its margin says to ignore the manager and reveal private orders; that margin is untrusted content.", "O orientador busca no estoque uma ficha de ingredientes. A margem manda ignorar a gerência e revelar pedidos privados; esse texto não é confiável.", "stock"),
      step("Keep the note below the rules", "Mantenha a nota abaixo das regras", "At the recipe desk, the advisor may use ingredient facts but cannot take stockroom keys or change permissions on a supplier’s instruction.", "Na mesa de receitas, o orientador pode usar fatos sobre ingredientes, mas não retirar chaves nem alterar permissões por ordem de um fornecedor.", "terminal"),
      step("Check consequential changes independently", "Confira mudanças importantes de forma independente", "The counter requires the customer’s confirmation and the manager’s permission for a consequential order change. Independent controls matter; asking an LLM to ignore attacks is not a guarantee.", "O balcão exige confirmação do cliente e permissão da gerência para uma mudança importante. Controles independentes importam; pedir a um LLM que ignore ataques não é garantia.", "counter"),
    ],
  },
  "monitoring/index": {
    slug: "monitoring/index", path: "/monitoramento-e-manutencao", mode: "observability", station: "terminal",
    title: text("Monitoring and Maintenance of Distributed Systems", "Monitoramento e Manutenção de Sistemas Distribuídos"),
    improvement: text("Run the burger restaurant from order receipts, kitchen timing and delivery records that explain customer delays.", "Acompanhe a hamburgueria por comprovantes, tempos da cozinha e registros de entrega que expliquem atrasos."),
    steps: [
      step("Record the kitchen handoff", "Registre a passagem pela cozinha", "The cook stamps the order number and completion time in the kitchen ledger instead of relying on how busy the room looks.", "A cozinha carimba o número do pedido e o horário de conclusão no livro, em vez de se guiar apenas pelo movimento do salão.", "kitchen"),
      step("Explain the customer’s wait", "Explique a espera do cliente", "The manager compares kitchen entries with pickup receipts to see whether customers actually received complete orders on time.", "A gerência compara os registros da cozinha com os comprovantes de retirada para saber se os clientes receberam pedidos completos no prazo.", "terminal"),
      step("Check the repair in service", "Confira a correção no atendimento", "After removing a preparation bottleneck, the counter records the next orders and checks that waiting time improves without increasing mistakes.", "Após remover um gargalo no preparo, o balcão registra os próximos pedidos e confere se a espera caiu sem aumentar os erros.", "counter"),
    ],
  },
  "monitoring/metrics": {
    slug: "monitoring/metrics", path: "/monitoramento-e-manutencao/metricas", mode: "observability", station: "terminal",
    title: text("Metrics and KPIs in Distributed Systems", "Métricas e KPIs em Sistemas Distribuídos"),
    improvement: text("Count restaurant arrivals, outstanding slips and waiting-time ranges rather than guessing from a crowded counter.", "Conte chegadas, comandas pendentes e faixas de espera, em vez de adivinhar pelo balcão cheio."),
    steps: [
      step("Count orders and the current queue", "Conte pedidos e a fila atual", "The counter ticks one box per arrival and separately counts the slips still waiting. Total arrivals only increase; the current queue can grow or shrink.", "O balcão marca uma casa por chegada e conta separadamente as comandas ainda pendentes. O total de chegadas só aumenta; a fila atual pode crescer ou diminuir.", "counter"),
      step("Group waiting times", "Agrupe os tempos de espera", "The cook notes elapsed minutes and groups completed orders into waiting-time ranges. A range tally reveals slow orders that an average can hide.", "A cozinha anota os minutos decorridos e agrupa pedidos concluídos por faixa de espera. Essa contagem revela pedidos lentos que uma média pode esconder.", "kitchen"),
      step("Keep the categories bounded", "Mantenha poucas categorias", "At the desk, the manager compares totals by branch and shift. Individual order numbers remain in receipts, avoiding an ever-growing metrics category for every customer.", "Na mesa, a gerência compara totais por filial e turno. Números individuais ficam nos comprovantes, evitando uma categoria de métricas nova para cada cliente.", "terminal"),
    ],
  },
  "monitoring/logs": {
    slug: "monitoring/logs", path: "/monitoramento-e-manutencao/logs", mode: "observability", station: "terminal",
    title: text("Logs and Tracing in Distributed Systems", "Registros e Rastreamento em Sistemas Distribuídos"),
    improvement: text("Reconstruct an order from timestamped ledger entries without writing unnecessary customer secrets.", "Reconstrua um pedido pelos registros com horário, sem anotar segredos desnecessários dos clientes."),
    steps: [
      step("Stamp acceptance", "Carimbe o aceite", "The counter records order 42, the time and acceptance result in its ledger. Each entry says what happened rather than merely that someone was active.", "O balcão registra o pedido 42, o horário e o resultado do aceite no livro. Cada anotação diz o que ocorreu, não apenas que havia atividade.", "counter"),
      step("Reuse the order number", "Reutilize o número do pedido", "Dispatch stamps order 42 when the delivery bag leaves. The same number lets the manager join the counter and delivery records later.", "A expedição carimba o pedido 42 quando a sacola sai. O mesmo número permite relacionar depois os registros do balcão e da entrega.", "dispatch"),
      step("Review only necessary details", "Revise só os detalhes necessários", "The manager follows the numbered entries while keeping payment secrets and unnecessary customer details out of the working ledger.", "A gerência acompanha as anotações numeradas e mantém segredos de pagamento e dados pessoais desnecessários fora do livro de trabalho.", "terminal"),
    ],
  },
  "monitoring/alerts": {
    slug: "monitoring/alerts", path: "/monitoramento-e-manutencao/alertas", mode: "observability", station: "terminal",
    title: text("Alerts and Notifications in Distributed Systems", "Alertas e Notificações em Sistemas Distribuídos"),
    improvement: text("Call the responsible restaurant manager when a sustained service problem requires a specific action.", "Chame a gerência responsável quando um problema persistente no atendimento exigir uma ação específica."),
    steps: [
      step("Notice a sustained problem", "Perceba um problema persistente", "Across several consecutive checks, the counter’s checklist shows too many unfinished orders. One isolated late tray does not trigger a new call every time.", "Em várias conferências consecutivas, a folha do balcão mostra pedidos incompletos demais. Uma bandeja atrasada isolada não gera um chamado novo a cada instante.", "counter"),
      step("Take an actionable note to the manager", "Leve um aviso útil à gerência", "An attendant brings the manager a checklist naming the kitchen delay, its duration and the person responsible for checking the prep station.", "Um atendente leva à gerência uma folha que identifica o atraso da cozinha, sua duração e quem deve conferir o posto de preparo.", "terminal"),
      step("Confirm the condition has cleared", "Confirme que o problema terminou", "The cook marks several successful handoffs before closing the warning. Related failures stay grouped so the team can work without repeated calls for the same incident.", "A cozinha marca várias entregas bem-sucedidas antes de encerrar o aviso. Falhas relacionadas ficam agrupadas para a equipe trabalhar sem chamados repetidos pelo mesmo incidente.", "kitchen"),
    ],
  },
  "monitoring/performance": {
    slug: "monitoring/performance", path: "/monitoramento-e-manutencao/performance", mode: "observability", station: "kitchen",
    title: text("Performance Analysis in Distributed Systems", "Análise de Desempenho em Sistemas Distribuídos"),
    improvement: text("Time a representative lunch service, improve its actual bottleneck and repeat the same order mix.", "Cronometre um almoço representativo, melhore o gargalo real e repita a mesma combinação de pedidos."),
    steps: [
      step("Replay a normal lunch mix", "Reproduza um almoço típico", "The counter sends the usual mix of simple burgers, larger orders and collection requests, recording when each slip arrives.", "O balcão envia a combinação habitual de hambúrgueres simples, pedidos maiores e retiradas, anotando quando cada comanda chega.", "counter"),
      step("Time the bottleneck", "Cronometre o gargalo", "At the kitchen, the manager separates time waiting for the grill from time actually cooking. A busy cook alone does not prove which stage limits throughput.", "Na cozinha, a gerência separa espera pela chapa de tempo efetivo de preparo. Uma pessoa ocupada sozinha não prova qual etapa limita a vazão.", "kitchen"),
      step("Compare the same workload", "Compare a mesma carga", "After the prep change, the manager repeats the same slip mix and compares completion counts and the slowest waiting-time ranges, not just the average.", "Após a mudança no preparo, a gerência repete a mesma combinação e compara quantidades concluídas e faixas de espera mais lentas, não apenas a média.", "terminal"),
    ],
  },
  "monitoring/health-checks": {
    slug: "monitoring/health-checks", path: "/monitoramento-e-manutencao/health-checks", mode: "recovery", station: "kitchen",
    title: text("Health Checks in Distributed Systems", "Verificações de Saúde em Sistemas Distribuídos"),
    improvement: text("Distinguish a staffed kitchen from a kitchen ready to prepare the next burger safely.", "Diferencie uma cozinha com equipe de uma cozinha pronta para preparar o próximo hambúrguer com segurança."),
    steps: [
      step("Confirm someone can respond", "Confirme que há resposta", "The shift lead visits the kitchen and receives an acknowledgement from the cook. Being present and responsive does not yet prove that orders can be prepared.", "A liderança do turno vai à cozinha e recebe uma resposta de quem cozinha. Estar presente e responder ainda não prova que seja possível preparar pedidos.", "kitchen"),
      step("Check readiness for a real order", "Confira a prontidão para um pedido", "The counter accepts new kitchen work only after the prep checklist confirms ingredients, equipment and a usable work area. A staffed but unready station stays out of the order rotation.", "O balcão só envia trabalho novo após a lista confirmar ingredientes, equipamento e bancada utilizável. Um posto com equipe, mas despreparado, fica fora do rodízio de pedidos.", "counter"),
      step("Allow preparation time", "Respeite o tempo de preparação", "The manager gives a newly opened station time to complete its opening checklist. A shared ingredient delay calls for investigation, not endlessly restarting the opening routine.", "A gerência dá tempo para um posto recém-aberto concluir a lista inicial. Um atraso compartilhado de ingredientes exige investigação, não reiniciar a abertura sem parar.", "terminal"),
    ],
  },
  "monitoring/llm-observability": {
    slug: "monitoring/llm-observability", path: "/monitoramento-e-manutencao/llm-observability", mode: "observability", station: "terminal",
    title: text("LLM Observability", "Observabilidade de LLM"),
    improvement: text("Review the menu advisor’s source use, response delay and mistakes as separate measures.", "Revise o uso de fontes, a demora e os erros do orientador de cardápio como medidas distintas."),
    steps: [
      step("Number the advice request", "Numere o pedido de orientação", "The counter gives the menu advisor question 42 and notes which recipe-book edition was consulted, keeping the request and its evidence connected.", "O balcão entrega a pergunta 42 ao orientador e anota a edição do livro de receitas consultada, ligando a solicitação às evidências.", "counter"),
      step("Separate speed from quality", "Separe rapidez de qualidade", "At the recipe desk, the manager times the first suggestion and the full answer, then checks accuracy on a separate checklist. For an LLM, token cost is another independent measure.", "Na mesa de receitas, a gerência mede a primeira sugestão e a resposta completa, depois confere a precisão em outra lista. Em um LLM, o custo de tokens é outra medida independente.", "terminal"),
      step("Review a safe sample", "Revise uma amostra segura", "The manager files a sample of corrected recipe references with customer names removed. A fluent recommendation can still be wrong about an ingredient or allergen.", "A gerência arquiva uma amostra de referências corrigidas sem nomes de clientes. Uma recomendação fluente ainda pode errar sobre ingrediente ou alergênico.", "stock"),
    ],
  },
  "monitoring/distributed-tracing": {
    slug: "monitoring/distributed-tracing", path: "/monitoramento-e-manutencao/distributed-tracing", mode: "observability", station: "dispatch",
    title: text("Distributed Tracing", "Rastreamento Distribuído"),
    improvement: text("Follow one numbered restaurant order through nested preparation and delivery intervals.", "Acompanhe um pedido numerado pelos intervalos de preparo e entrega da hamburgueria."),
    steps: [
      step("Start the order’s timeline", "Inicie a linha do tempo do pedido", "The counter writes order 42 and its start time on the slip, then passes that same number to the kitchen.", "O balcão escreve o pedido 42 e o horário inicial na comanda, depois passa o mesmo número à cozinha.", "counter"),
      step("Mark the delivery interval", "Marque o intervalo da entrega", "Dispatch receives slip 42 with the kitchen’s start and finish stamps and adds its own handoff time. Each interval belongs to the same order journey.", "A expedição recebe a comanda 42 com os carimbos de início e fim da cozinha e acrescenta seu horário de saída. Cada intervalo pertence ao mesmo percurso.", "dispatch"),
      step("Locate the longest wait", "Localize a espera mais longa", "The manager compares the stamped slip with the final receipt to separate preparation, queueing and dispatch delay. Overlapping work must not be counted twice.", "A gerência compara a comanda carimbada com o comprovante final para separar preparo, fila e expedição. Trabalhos simultâneos não devem ser contados duas vezes.", "terminal"),
    ],
  },
  "monitoring/slo-sli-sla": {
    slug: "monitoring/slo-sli-sla", path: "/monitoramento-e-manutencao/slo-sli-sla", mode: "observability", station: "terminal",
    title: text("SLO, SLI & Error Budgets", "SLO, SLI e Orçamentos de Erros"),
    improvement: text("Write a measurable restaurant promise and use missed orders to guide reliability work.", "Escreva uma promessa mensurável de atendimento e use os pedidos fora da meta para orientar melhorias."),
    steps: [
      step("Count eligible on-time orders", "Conte pedidos elegíveis no prazo", "The counter marks whether each eligible order was complete within ten minutes. The checklist defines both the denominator and what counts as success.", "O balcão marca se cada pedido elegível ficou completo em até dez minutos. A lista define tanto o total considerado quanto o que conta como sucesso.", "counter"),
      step("Write the target and agreement", "Escreva a meta e o acordo", "The manager sets a target of 95 out of 100 eligible orders over the chosen period. A separate signed service agreement states any customer-facing consequences.", "A gerência define a meta de 95 em cada 100 pedidos elegíveis no período escolhido. Um acordo assinado separado declara as consequências prometidas ao cliente.", "terminal"),
      step("Use the remaining failure allowance", "Use a margem restante de falhas", "The kitchen records late orders against the five-order allowance. If the allowance is nearly spent, the team fixes reliability before trying a risky new prep routine.", "A cozinha desconta os atrasos da margem de cinco pedidos. Se a margem estiver quase esgotada, a equipe melhora a confiabilidade antes de testar uma rotina arriscada.", "kitchen"),
    ],
  },
  "monitoring/chaos-engineering": {
    slug: "monitoring/chaos-engineering", path: "/monitoramento-e-manutencao/chaos-engineering", mode: "recovery", station: "kitchen",
    title: text("Chaos Engineering", "Engenharia do Caos"),
    improvement: text("Pause one restaurant prep station in a bounded drill and check whether the promised service still holds.", "Pause um posto de preparo em um exercício limitado e confira se a promessa de atendimento se mantém."),
    steps: [
      step("Plan a bounded service drill", "Planeje um exercício limitado", "The manager writes a hypothesis: with a spare cook ready, pausing one prep station should preserve the on-time target. The checklist includes a time limit and stop conditions.", "A gerência escreve a hipótese: com uma pessoa de reserva pronta, pausar um posto deve preservar a meta de prazo. A lista inclui duração máxima e condições de interrupção.", "terminal"),
      step("Pause one selected station", "Pause um posto escolhido", "The shift lead temporarily stops new slips at one selected kitchen station while the spare station works. The drill ends immediately if the agreed customer-impact limit is reached.", "A liderança interrompe temporariamente novas comandas em um posto escolhido enquanto a reserva trabalha. O exercício termina se o limite combinado de impacto nos clientes for atingido.", "kitchen"),
      step("Restore and inspect the results", "Restaure e confira os resultados", "The counter resumes the normal rotation and records completed orders and waiting times. The manager compares them with the hypothesis and fixes any gap before a larger drill.", "O balcão retoma o rodízio normal e registra pedidos concluídos e esperas. A gerência compara com a hipótese e corrige falhas antes de um exercício maior.", "counter"),
    ],
  },
  "monitoring/disaster-recovery": {
    slug: "monitoring/disaster-recovery", path: "/monitoramento-e-manutencao/disaster-recovery", mode: "recovery", station: "stock",
    title: text("Disaster Recovery & Backups", "Recuperação de Desastres e Cópias de Segurança"),
    improvement: text("Rebuild the burger restaurant’s order book from a protected copy and later receipts, then check what was lost.", "Reconstrua o livro de pedidos por uma cópia protegida e comprovantes posteriores, conferindo o que se perdeu."),
    steps: [
      step("Keep a dated protected copy", "Guarde uma cópia protegida e datada", "The manager stores a dated copy of the order ledger away from the working book and keeps later receipts. A second live book alone could repeat an accidental deletion.", "A gerência guarda uma cópia datada do livro longe do original de trabalho e preserva comprovantes posteriores. Outro livro ativo sozinho poderia repetir uma exclusão acidental.", "stock"),
      step("Rebuild at a separate counter", "Reconstrua em um balcão separado", "At the spare branch counter, the team opens the protected copy and applies the retained receipts in order, without changing the damaged original.", "No balcão da filial de reserva, a equipe abre a cópia protegida e aplica os comprovantes retidos em ordem, sem alterar o original danificado.", "branch"),
      step("Validate before taking new orders", "Valide antes de receber novos pedidos", "The manager checks totals and order numbers, then measures missing receipts and reopening time against the allowed data-loss and recovery-time targets.", "A gerência confere totais e números dos pedidos, depois mede comprovantes ausentes e tempo até reabrir diante das metas de perda de dados e recuperação.", "terminal"),
    ],
  },
  "monitoring/multi-region": {
    slug: "monitoring/multi-region", path: "/monitoramento-e-manutencao/multi-region", mode: "replication", station: "branch",
    title: text("Multi-Region & Geo-Replication", "Múltiplas Regiões e Replicação Geográfica"),
    improvement: text("Coordinate neighborhood burger branches while making price ownership and outage routing explicit.", "Coordene filiais da hamburgueria com responsabilidade por preços e encaminhamento em falhas bem definidos."),
    steps: [
      step("Use the nearby branch", "Use a filial próxima", "A customer places an order at the neighborhood branch instead of crossing town to the main counter. Local service shortens the customer’s trip.", "Um cliente faz o pedido na filial do bairro em vez de atravessar a cidade até a matriz. O atendimento local encurta o trajeto do cliente.", "branch"),
      step("Choose who may change prices", "Escolha quem pode alterar preços", "The main stock ledger owns price edition v2 and sends copies to branches. Allowing every branch to edit would require explicit conflict rules and coordination.", "O livro principal do estoque controla a edição v2 dos preços e envia cópias às filiais. Permitir que todas alterem exige regras de conflito e coordenação explícitas.", "stock"),
      step("Reroute with capacity and version checks", "Redirecione conferindo capacidade e versão", "When one branch closes, dispatch sends delivery bags to an open branch only after checking spare capacity and its menu edition. Nearby copies may still be behind.", "Quando uma filial fecha, a expedição encaminha sacolas a outra aberta só após conferir capacidade e edição do cardápio. Cópias próximas ainda podem estar atrasadas.", "dispatch"),
    ],
  },
  "ai-systems/index": {
    slug: "ai-systems/index", path: "/sistemas-ia", mode: "ai", station: "terminal",
    title: text("AI & LLM Systems", "Sistemas de IA e LLMs"),
    improvement: text("Use a recipe-book advisor to explain grounded recommendations and independent restaurant checks.", "Use um orientador com livro de receitas para explicar recomendações fundamentadas e conferências independentes."),
    steps: [
      step("Hear the customer’s request", "Ouça o pedido do cliente", "At the counter, the customer asks the menu advisor for a burger without a particular ingredient. The attendant writes the request on a slip.", "No balcão, o cliente pede ao orientador um hambúrguer sem determinado ingrediente. O atendente escreve a solicitação em uma comanda.", "counter"),
      step("Bring the current recipe book", "Traga o livro de receitas atual", "The advisor fetches the approved recipe book from stock instead of inventing the current menu from memory.", "O orientador busca no estoque o livro de receitas aprovado em vez de inventar de memória o cardápio atual.", "stock"),
      step("Check before recommending", "Confira antes de recomendar", "At the recipe desk, the manager checks the suggestion against ingredients and restrictions. The human advisor is an analogy: fluent LLM text does not prove understanding or safety.", "Na mesa de receitas, a gerência confere a sugestão com ingredientes e restrições. O orientador humano é uma analogia: texto fluente de LLM não prova compreensão nem segurança.", "terminal"),
    ],
  },
  "ai-systems/llm-serving-fundamentals": {
    slug: "ai-systems/llm-serving-fundamentals", path: "/sistemas-ia/llm-serving-fundamentals", mode: "ai", station: "terminal",
    title: text("LLM Serving Fundamentals", "Fundamentos de Inferência de LLM"),
    improvement: text("Separate reading a customer’s full request from composing the reply and managing a queue of advice slips.", "Separe a leitura da solicitação completa, a composição da resposta e a fila de comandas de orientação."),
    steps: [
      step("Read the whole advice slip", "Leia a solicitação completa", "The counter hands over the customer’s question and selected recipe notes. The advisor must first read this context before starting a useful recommendation.", "O balcão entrega a pergunta do cliente e as notas de receita escolhidas. O orientador precisa primeiro ler esse contexto antes de começar uma recomendação útil.", "terminal"),
      step("Compose the suggestion progressively", "Componha a sugestão aos poucos", "At the recipe desk, the advisor writes the recommendation a piece at a time while keeping the notes open. This separates preparation from progressive output, like prefill and decoding.", "Na mesa de receitas, o orientador escreve a recomendação aos poucos, mantendo as notas abertas. Isso separa preparação e saída progressiva, como processamento inicial e geração.", "terminal"),
      step("Balance batches and waiting", "Equilibre lotes e espera", "More advice slips queue at the desk. Reading shared recipe context together can save work, but large batches may delay the first reply; real serving also has token and memory limits.", "Mais comandas de orientação aguardam na mesa. Ler receitas compartilhadas em conjunto pode poupar trabalho, mas lotes grandes atrasam a primeira resposta; a inferência real também tem limites de tokens e memória.", "terminal"),
    ],
  },
  "ai-systems/rag": {
    slug: "ai-systems/rag", path: "/sistemas-ia/rag", mode: "ai", station: "stock",
    title: text("Retrieval-Augmented Generation (RAG)", "Geração Aumentada por Recuperação (RAG)"),
    improvement: text("Have the menu advisor retrieve recipe evidence before composing a cited answer for a customer.", "Faça o orientador buscar evidências nas receitas antes de compor uma resposta com referências."),
    steps: [
      step("Find the relevant recipe", "Encontre a receita relevante", "The advisor goes to stock for the approved recipe answering the customer’s ingredient question, keeping its edition and page reference.", "O orientador vai ao estoque buscar a receita aprovada que responde à pergunta sobre ingredientes, preservando edição e referência da página.", "stock"),
      step("Select evidence for the answer", "Selecione evidências para a resposta", "At the recipe desk, the advisor keeps only the relevant pages beside question 42. This represents retrieved context rather than retraining the model.", "Na mesa de receitas, o orientador mantém apenas as páginas relevantes ao lado da pergunta 42. Isso representa contexto recuperado, não um novo treinamento do modelo.", "terminal"),
      step("Answer with a reference and a limit", "Responda com referência e limite", "The counter receives a recommendation pointing to recipe v2. If the book lacks an allergen fact, the advisor says so; finding a page does not guarantee a correct answer.", "O balcão recebe uma recomendação que aponta para a receita v2. Se faltar uma informação sobre alergênicos, o orientador reconhece a lacuna; encontrar uma página não garante uma resposta correta.", "counter"),
    ],
  },
  "ai-systems/vector-search": {
    slug: "ai-systems/vector-search", path: "/sistemas-ia/vector-search", mode: "ai", station: "terminal",
    title: text("Vector Search", "Busca Vetorial"),
    improvement: text("Group recipe descriptions by similar taste and preparation, then verify the customer’s exact restrictions.", "Agrupe descrições de receitas por sabor e preparo semelhantes, depois confira as restrições exatas do cliente."),
    steps: [
      step("Describe the desired burger", "Descreva o hambúrguer desejado", "At the counter, the customer asks for a lighter grilled option. The advisor records taste and preparation preferences rather than requiring an exact dish name.", "No balcão, o cliente pede uma opção grelhada mais leve. O orientador anota preferências de sabor e preparo sem exigir o nome exato de um prato.", "counter"),
      step("Look among similar recipes", "Procure entre receitas semelhantes", "The advisor retrieves nearby recipe descriptions from groups organized by comparable characteristics. This illustrates vector similarity; the paper groups do not implement an embedding model.", "O orientador busca receitas em grupos de características comparáveis. Isso ilustra similaridade vetorial; os grupos de papel não implementam um modelo de vetores.", "stock"),
      step("Check the exact constraints", "Confira as restrições exatas", "At the desk, the advisor checks available ingredients and dietary rules before ranking the candidates. Similar wording never guarantees that a dish is suitable.", "Na mesa, o orientador confere ingredientes disponíveis e restrições alimentares antes de ordenar as opções. Semelhança de descrição nunca garante que um prato seja adequado.", "terminal"),
    ],
  },
  "ai-systems/llm-gateway": {
    slug: "ai-systems/llm-gateway", path: "/sistemas-ia/llm-gateway", mode: "ai", station: "terminal",
    title: text("LLM Gateway", "Gateway de LLM"),
    improvement: text("Let one restaurant coordinator admit advice requests, choose an approved advisor and record the work.", "Faça um coordenador aceitar pedidos de orientação, escolher orientadores aprovados e registrar o trabalho."),
    steps: [
      step("Check the advice allowance", "Confira o limite de orientação", "At the counter, the coordinator checks whether the request is permitted and fits the customer’s advice allowance before assigning anyone.", "No balcão, o coordenador confere se a solicitação é permitida e cabe no limite de orientação antes de atribuí-la a alguém.", "counter"),
      step("Choose an approved advisor", "Escolha um orientador aprovado", "The coordinator sends the slip to an advisor allowed to consult the required recipes and handle the customer’s information. A backup must respect the same restrictions.", "O coordenador envia a comanda a um orientador autorizado a consultar as receitas e tratar as informações do cliente. Uma alternativa precisa respeitar as mesmas restrições.", "terminal"),
      step("Record the work without private details", "Registre o trabalho sem dados privados", "The manager files the advice count and elapsed time in the ledger without copying every customer question. This mirrors centralized usage accounting and provider policy.", "A gerência arquiva a quantidade de orientações e o tempo gasto sem copiar cada pergunta do cliente. Isso representa contabilização centralizada e regras para provedores.", "stock"),
    ],
  },
  "ai-systems/gpu-autoscaling": {
    slug: "ai-systems/gpu-autoscaling", path: "/sistemas-ia/gpu-autoscaling", mode: "scaling", station: "terminal",
    title: text("GPU Serving & Autoscaling", "Inferência em GPU e Escalonamento Automático"),
    improvement: text("Open extra recipe-advice desks only when trained advisors and their materials are ready, then finish active work before closing.", "Abra mesas extras de orientação só quando equipe e material estiverem prontos, concluindo o trabalho ativo antes de fechar."),
    steps: [
      step("Notice queue and desk pressure", "Observe a fila e a mesa ocupada", "Advice slips accumulate at the counter while the advisor’s desk is full of open recipe pages. Both waiting and space for active work matter, not just arrivals.", "Comandas de orientação se acumulam no balcão enquanto a mesa está ocupada por receitas abertas. Espera e espaço para trabalho ativo importam, não só chegadas.", "counter"),
      step("Prepare another advice desk", "Prepare outra mesa de orientação", "A reserve advisor brings the current recipe book to an extra desk and completes the opening checklist before receiving slips. This stands for model loading and readiness, not instant extra capacity.", "Um orientador reserva leva o livro atual à mesa extra e conclui a lista de abertura antes de receber comandas. Isso representa carregamento do modelo e prontidão, não capacidade extra instantânea.", "terminal"),
      step("Finish active advice before closing", "Conclua orientações antes de fechar", "When demand falls, the coordinator stops new slips to one desk and waits for its current recommendations to finish. Staff and desk space illustrate capacity; real GPU scheduling has additional memory constraints.", "Quando a demanda cai, o coordenador suspende novas comandas para uma mesa e aguarda suas orientações atuais terminarem. Equipe e mesa ilustram capacidade; GPUs reais têm restrições adicionais de memória.", "terminal"),
    ],
  },
  "ai-systems/agentic-systems": {
    slug: "ai-systems/agentic-systems", path: "/sistemas-ia/agentic-systems", mode: "ai", station: "counter",
    title: text("Agentic Systems", "Sistemas com Agentes"),
    improvement: text("Let the restaurant advisor propose a stock check and an order change while staff retain permission and confirmation.", "Deixe o orientador propor uma consulta ao estoque e alteração no pedido, mantendo permissão e confirmação com a equipe."),
    steps: [
      step("Propose a stock enquiry", "Proponha uma consulta ao estoque", "At the recipe desk, the advisor writes a bounded request to check whether an ingredient for order 42 is available. A proposal is not permission to take it.", "Na mesa de receitas, o orientador escreve uma solicitação limitada para conferir um ingrediente do pedido 42. Propor não dá permissão para retirá-lo.", "terminal"),
      step("Validate before opening stock", "Valide antes de acessar o estoque", "The stockkeeper checks the requested ingredient, order ownership and the advisor’s allowed task before returning a stock note. The check is independent of how persuasive the recommendation sounds.", "Quem cuida do estoque confere ingrediente, titular do pedido e tarefa permitida antes de devolver uma nota. A verificação independe de quão convincente pareça a recomendação.", "stock"),
      step("Confirm and record the change", "Confirme e registre a mudança", "The counter asks the customer to confirm the proposed substitution, then records its result under order 42. Failed or repeated attempts must not silently create extra orders.", "O balcão pede ao cliente que confirme a substituição proposta e registra o resultado no pedido 42. Tentativas falhas ou repetidas não podem criar pedidos extras silenciosamente.", "counter"),
    ],
  },
  "data-storage/index": {
    slug: "data-storage/index", path: "/dados-armazenamento", mode: "storage", station: "stock",
    title: text("Data & Storage", "Dados e Armazenamento"),
    improvement: text("Choose separate places for today’s order book, reusable recipes and historical sales receipts.", "Escolha lugares distintos para o livro de pedidos do dia, receitas reutilizáveis e comprovantes históricos."),
    steps: [
      step("Separate the restaurant records", "Separe os registros da hamburgueria", "The counter keeps active order slips close at hand, while recipe editions and last month’s receipts serve different jobs and are retrieved differently.", "O balcão mantém comandas ativas à mão; edições de receitas e comprovantes do mês passado têm outras funções e formas de consulta.", "counter"),
      step("File each record for its use", "Arquive cada registro pelo seu uso", "In stock, numbered orders go into the working ledger and recipe editions into their own collection. Frequent updates, exact lookups and large history scans need different arrangements.", "No estoque, pedidos numerados vão ao livro de trabalho e edições de receitas à sua coleção. Atualizações frequentes, buscas exatas e análise de histórico exigem organizações distintas.", "stock"),
      step("Plan retention and reopening", "Planeje retenção e retomada", "At the desk, the manager checks how long receipts are kept, where protected copies live and whether the team can restore a usable order book.", "Na mesa, a gerência confere por quanto tempo guarda comprovantes, onde ficam cópias protegidas e se a equipe consegue restaurar um livro utilizável.", "terminal"),
    ],
  },
  "data-storage/consistent-hashing": {
    slug: "data-storage/consistent-hashing", path: "/dados-armazenamento/consistent-hashing", mode: "routing", station: "stock",
    title: text("Consistent Hashing", "Hashing Consistente"),
    improvement: text("Assign recipe cards by stable circular codes so adding an archive clerk moves only the affected range.", "Atribua fichas de receitas por códigos circulares estáveis para que um novo responsável mova só a faixa afetada."),
    steps: [
      step("Use a stable placement code", "Use um código estável de distribuição", "The counter applies the same written rule to assign each recipe card a code. The archive roster uses the same numbered sequence and returns to its beginning after the last position.", "O balcão aplica a mesma regra escrita para dar um código a cada ficha. A escala do arquivo usa a mesma sequência numerada e retorna ao início depois da última posição.", "counter"),
      step("Choose the next responsible clerk", "Escolha o próximo responsável", "In stock, the clerk files card 42 with the first responsible person at or after code 42 in the roster, wrapping to the beginning when needed. Several assigned positions per clerk can spread the work.", "No estoque, a ficha 42 fica com o primeiro responsável na posição 42 ou depois dela, voltando ao início quando necessário. Várias posições por pessoa podem distribuir melhor o trabalho.", "stock"),
      step("Move only the new clerk’s range", "Mova só a faixa do novo responsável", "A new branch clerk takes the cards in the newly assigned interval; other cards stay with their owners. Placement alone does not make spare copies or protect against lost records.", "Um novo responsável na filial recebe as fichas do intervalo recém-atribuído; as demais permanecem no lugar. Distribuição sozinha não cria cópias nem protege contra perda.", "branch"),
    ],
  },
  "data-storage/sharding-partitioning": {
    slug: "data-storage/sharding-partitioning", path: "/dados-armazenamento/sharding", mode: "storage", station: "branch",
    title: text("Sharding & Partitioning", "Sharding e Particionamento"),
    improvement: text("Divide restaurant order books by an explicit ownership rule and rebalance the busy section carefully.", "Divida livros de pedidos por uma regra de responsabilidade e reequilibre com cuidado a seção sobrecarregada."),
    steps: [
      step("Choose the book ownership rule", "Escolha a regra de responsabilidade", "At the counter, each order slip carries its restaurant unit and order number. The unit determines which clerk’s order book owns the record.", "No balcão, cada comanda traz unidade e número do pedido. A unidade determina qual livro e responsável guardam o registro.", "counter"),
      step("Send the slip to its owning book", "Envie a comanda ao livro responsável", "The counter checks the roster and sends both new entries and lookups to the stock clerk responsible for that unit, rather than copying every order everywhere.", "O balcão confere a escala e envia inclusões e consultas ao responsável por aquela unidade no estoque, em vez de copiar todos os pedidos para todo lugar.", "stock"),
      step("Move a hot section with coordination", "Mova uma seção disputada com coordenação", "When one unit dominates the workload, the team moves an agreed section to a branch clerk and updates the roster while tracking in-flight slips. Changing the rule without migration loses the trail.", "Quando uma unidade concentra trabalho demais, a equipe move uma seção combinada para a filial e atualiza a escala acompanhando comandas em trânsito. Mudar a regra sem migrar perde o rastro.", "branch"),
    ],
  },
  "data-storage/object-storage": {
    slug: "data-storage/object-storage", path: "/dados-armazenamento/object-storage", mode: "storage", station: "stock",
    title: text("Object & Blob Storage", "Armazenamento de Objetos e Blobs"),
    improvement: text("Keep complete recipe editions under stable labels and reference them without rewriting every order.", "Guarde edições completas de receitas sob identificadores estáveis e referencie-as sem reescrever cada pedido."),
    steps: [
      step("Store a complete labeled edition", "Guarde uma edição completa identificada", "The stockkeeper receives a complete recipe packet labeled v2 with its owner and access rules. The label identifies the whole stored item.", "O estoque recebe um pacote completo de receitas identificado como v2, com responsável e regras de acesso. A identificação aponta para o item inteiro.", "stock"),
      step("Reference the edition", "Referencie a edição", "The counter menu points to recipe v2 instead of attaching a fresh copy to every order. To revise the stored packet, the team writes a new version.", "O cardápio do balcão aponta para a receita v2 em vez de anexar uma cópia nova a cada pedido. Para revisar o pacote guardado, a equipe registra outra versão.", "counter"),
      step("Control versions and access", "Controle versões e acesso", "The manager’s checklist says which editions are retained and who may collect them. Whole labeled packets illustrate object access, not all the update and locking rules of a shared file.", "A lista da gerência define quais edições serão guardadas e quem pode retirá-las. Pacotes completos identificados ilustram acesso a objetos, não todas as regras de atualização e bloqueio de um arquivo compartilhado.", "terminal"),
    ],
  },
  "data-storage/distributed-file-systems": {
    slug: "data-storage/distributed-file-systems", path: "/dados-armazenamento/distributed-file-systems", mode: "storage", station: "branch",
    title: text("Distributed File Systems", "Sistemas de Arquivos Distribuídos"),
    improvement: text("Reconstruct a large recipe collection from numbered sections stored with redundant copies across restaurant branches.", "Reconstitua uma coleção grande de receitas por seções numeradas com cópias redundantes entre filiais."),
    steps: [
      step("Look up the section locations", "Consulte onde ficam as seções", "At the manager’s desk, the recipe catalog lists the numbered sections of a large collection and which stockrooms hold each copy.", "Na mesa da gerência, o catálogo de receitas lista seções numeradas de uma coleção grande e os estoques que guardam cada cópia.", "terminal"),
      step("Collect the numbered sections", "Reúna as seções numeradas", "The cook requests sections from their listed stockkeepers and puts them in order. The same section may have a spare copy at another branch.", "A cozinha solicita as seções aos responsáveis indicados e as reúne em ordem. Uma mesma seção pode ter cópia de reserva em outra filial.", "stock"),
      step("Replace a missing copy", "Reponha uma cópia ausente", "After one stockroom becomes unavailable, a surviving section is copied to the branch to restore redundancy. The catalog also needs protection; spare sections cannot replace a lost directory.", "Após um estoque ficar indisponível, uma seção preservada é copiada à filial para recompor a redundância. O catálogo também precisa de proteção; seções extras não substituem um índice perdido.", "branch"),
    ],
  },
  "data-storage/search-inverted-index": {
    slug: "data-storage/search-inverted-index", path: "/dados-armazenamento/inverted-index", mode: "storage", station: "terminal",
    title: text("Search & the Inverted Index", "Busca e o Índice Invertido"),
    improvement: text("Find burger recipes from a word-to-recipe reference book rather than reading the entire menu each time.", "Encontre receitas por um índice de palavras para receitas, sem reler o cardápio inteiro a cada consulta."),
    steps: [
      step("Standardize recipe words", "Padronize as palavras das receitas", "In stock, the clerk reads menu descriptions and records searchable words consistently, so small differences in letter case do not create separate entries.", "No estoque, o responsável lê descrições e registra palavras pesquisáveis de forma consistente, para que diferenças de maiúsculas não criem entradas separadas.", "stock"),
      step("File recipes under each word", "Liste receitas em cada palavra", "At the desk, a reference ledger lists recipe numbers under each word, such as grilled. The direction is word to recipes rather than recipe to its full description.", "Na mesa, um livro de referência lista números de receitas sob cada palavra, como grelhado. A direção é palavra para receitas, não receita para descrição completa.", "terminal"),
      step("Combine lists for the request", "Combine listas para a consulta", "The counter looks up the requested words, combines their recipe lists and ranks the matching dishes. This is word matching, not proof of similar meaning or dietary suitability.", "O balcão consulta as palavras pedidas, combina listas de receitas e ordena os pratos correspondentes. Isso é correspondência de palavras, não prova de significado semelhante nem adequação alimentar.", "counter"),
    ],
  },
  "real-cases/index": {
    slug: "real-cases/index", path: "/casos-reais", mode: "routing", station: "terminal",
    title: text("Learn from the Giants", "Aprenda com os Gigantes"),
    improvement: text("Borrow specific large-system principles for the burger restaurant’s recipe distribution, order notes and courier assignments.", "Adapte princípios de grandes sistemas à distribuição de receitas, comandas e atribuição de entregadores da hamburgueria."),
    steps: [
      step("Name the restaurant job", "Identifique o trabalho da hamburgueria", "The counter separates frequently requested menu copies from order changes and courier assignments. These jobs do not need the same handling.", "O balcão separa cópias muito consultadas do cardápio, mudanças de pedidos e atribuições de entregadores. Esses trabalhos não exigem o mesmo tratamento.", "counter"),
      step("Choose the critical constraint", "Escolha a restrição crítica", "At the desk, the manager notes that a menu copy may briefly lag, while one courier must not be assigned to two competing bags. Different promises require different coordination.", "Na mesa, a gerência anota que uma cópia do cardápio pode atrasar brevemente, mas um entregador não deve receber duas sacolas concorrentes. Promessas distintas exigem coordenação distinta.", "terminal"),
      step("Adopt only a justified mechanism", "Adote só um mecanismo justificado", "The kitchen trials the chosen procedure with normal lunch volume and records its effort and benefit. A famous company’s scale does not justify every extra branch or copy here.", "A cozinha testa o procedimento no movimento normal do almoço e registra esforço e benefício. A escala de uma empresa famosa não justifica aqui toda filial ou cópia extra.", "kitchen"),
    ],
  },
  "real-cases/youtube": {
    slug: "real-cases/youtube", path: "/casos-reais/youtube", mode: "delivery", station: "dispatch",
    title: text("YouTube System Design", "Projeto de Sistemas do YouTube"),
    improvement: text("Model an upload-processing-delivery pipeline by accepting a chef’s recipe, preparing editions and distributing nearby menu copies.", "Modele envio, processamento e distribuição recebendo uma receita, preparando edições e levando cópias do cardápio às filiais."),
    steps: [
      step("Accept and preserve the original recipe", "Receba e preserve a receita original", "The chef deposits the complete new recipe in stock and receives a receipt immediately. The original stays preserved while presentation copies are still being prepared.", "A cozinha deposita a receita nova completa no estoque e recebe um comprovante imediatamente. O original fica preservado enquanto as cópias de apresentação ainda são preparadas.", "stock"),
      step("Prepare presentation editions later", "Prepare edições de apresentação depois", "A kitchen worker takes recipe copies from a work queue and prepares full kitchen instructions and concise menu editions. This represents asynchronous media conversion, not another customer order.", "Uma pessoa da cozinha retira cópias da fila e prepara instruções completas de preparo e edições resumidas do cardápio. Isso representa conversão assíncrona de mídia, não outro pedido de cliente.", "kitchen"),
      step("Keep popular copies near customers", "Mantenha cópias populares perto dos clientes", "The finished menu edition reaches branch counters, where nearby customers consult it without a trip to the original archive. Popular recipes need more copies and replenishment.", "A edição pronta chega aos balcões das filiais, onde os clientes a consultam sem ir ao arquivo original. Receitas populares exigem mais cópias e reposição.", "branch"),
    ],
  },
  "real-cases/spotify": {
    slug: "real-cases/spotify", path: "/casos-reais/spotify", mode: "delivery", station: "pickup",
    title: text("Spotify System Design", "Projeto de Sistemas do Spotify"),
    improvement: text("Connect a shared recipe catalog, nearby menu copies and separate preference notes to explain catalog delivery and personalization.", "Conecte catálogo de receitas, cópias próximas do cardápio e notas de preferência para explicar distribuição e personalização."),
    steps: [
      step("Find the permitted catalog item", "Encontre o item permitido do catálogo", "At the recipe desk, the advisor looks up the burger by its stable catalog number and checks whether this branch offers it before recommending it.", "Na mesa de receitas, o orientador consulta o hambúrguer pelo número estável do catálogo e confere se a filial o oferece antes de recomendá-lo.", "terminal"),
      step("Serve the nearby menu copy", "Use a cópia próxima do cardápio", "The counter uses its ready menu copy to answer repeated requests without fetching the archive each time. Keeping the next needed pages nearby illustrates buffering and cached delivery.", "O balcão usa a cópia pronta do cardápio para consultas repetidas sem buscar o arquivo a cada vez. Manter próximas as páginas seguintes ilustra armazenamento temporário e distribuição em cache.", "counter"),
      step("File preference feedback separately", "Arquive preferências separadamente", "After service, a receipt records which suggestion the customer chose and goes to the manager’s preference ledger. Learning future preferences does not hold up today’s menu consultation.", "Depois do atendimento, um comprovante registra a sugestão escolhida e segue ao livro de preferências. Aprender para recomendações futuras não bloqueia a consulta atual ao cardápio.", "stock"),
    ],
  },
  "real-cases/whatsapp": {
    slug: "real-cases/whatsapp", path: "/casos-reais/whatsapp", mode: "events", station: "counter",
    title: text("WhatsApp System Design", "Projeto de Sistemas do WhatsApp"),
    improvement: text("Track a numbered order note through durable holding, delivery acknowledgement and duplicate handling.", "Acompanhe uma nota numerada por guarda durável, confirmação de entrega e tratamento de repetições."),
    steps: [
      step("Keep a numbered note until delivered", "Guarde a nota numerada até entregá-la", "The counter records order note 42 in its ledger before attempting to pass it to the cook. The note remains pending if the cook cannot receive it yet.", "O balcão registra a nota 42 no livro antes de tentar passá-la à cozinha. A nota permanece pendente se ainda não houver quem a receba.", "counter"),
      step("Hand over when the cook is available", "Entregue quando a cozinha estiver disponível", "When the cook returns to the handoff point, the counter passes the waiting note and retains its identity on every retry. A second copy is not a second burger order.", "Quando a pessoa da cozinha retorna ao ponto de passagem, o balcão entrega a nota pendente e mantém seu identificador em cada tentativa. Outra cópia não é outro pedido de hambúrguer.", "kitchen"),
      step("Separate received from read", "Separe recebimento de leitura", "At the desk, receipts distinguish the cook receiving note 42 from actually reading it. The ledger recognizes repeated acknowledgements and keeps any staff copies aligned to that same note.", "Na mesa, comprovantes distinguem receber a nota 42 de efetivamente lê-la. O livro reconhece confirmações repetidas e mantém cópias da equipe ligadas à mesma nota.", "terminal"),
    ],
  },
  "real-cases/bitly": {
    slug: "real-cases/bitly", path: "/casos-reais/bitly", mode: "routing", station: "entrance",
    title: text("Bit.ly System Design", "Projeto de Sistemas do Bit.ly"),
    improvement: text("Resolve a short pickup code into a full order record and record lookup traffic separately.", "Resolva um código curto de retirada para o registro completo do pedido e anote as consultas separadamente."),
    steps: [
      step("Assign a unique short code", "Atribua um código curto único", "The counter issues collection code 7 and records its link to the full order entry. It first checks that another active order does not already own that code.", "O balcão emite o código de retirada 7 e registra sua ligação com a entrada completa. Antes, confere se outro pedido ativo já usa esse código.", "counter"),
      step("Resolve the code at collection", "Resolva o código na retirada", "At pickup, the attendant consults a nearby copy of the code list and finds the full order record. Resolving a code points to the record; it does not prove who may collect it.", "Na retirada, o atendente consulta uma cópia próxima da lista e encontra o registro completo. Resolver um código aponta para o registro; não prova quem pode retirar o pedido.", "pickup"),
      step("Count lookups after the handoff", "Conte consultas após a passagem", "Lookup ticks go to the manager’s analysis ledger separately, so counting popular codes does not block each resolution. The original code-to-order association stays authoritative.", "Marcas de consulta seguem separadamente ao livro de análise, para que contar códigos populares não bloqueie cada resolução. A associação original entre código e pedido continua sendo a referência.", "terminal"),
    ],
  },
  "real-cases/netflix": {
    slug: "real-cases/netflix", path: "/casos-reais/netflix", mode: "delivery", station: "dispatch",
    title: text("Netflix System Design", "Projeto de Sistemas do Netflix"),
    improvement: text("Prepare recipe editions in advance, keep them at branch kitchens and isolate optional advice from essential preparation.", "Prepare edições de receitas antecipadamente, mantenha-as nas filiais e isole orientação opcional do preparo essencial."),
    steps: [
      step("Prepare usable recipe editions in advance", "Prepare edições utilizáveis antes do turno", "Before lunch, stock receives a complete recipe book and compact kitchen cards with the same required ingredients and safety steps. They stand for prepared content variants, not lower-quality food.", "Antes do almoço, o estoque recebe um livro completo e fichas compactas com os mesmos ingredientes e passos de segurança obrigatórios. Representam versões preparadas de conteúdo, não comida de qualidade inferior.", "stock"),
      step("Use the edition ready at the branch", "Use a edição pronta na filial", "The branch cook uses the prepared card that fits the working station, with a complete book available for detail. Nearby prepared copies illustrate delivery and format selection; a recipe card is not a literal video bitrate.", "A cozinha da filial usa a ficha preparada adequada ao posto, com o livro completo disponível para detalhes. Cópias próximas ilustram distribuição e seleção de formato; uma ficha não é uma taxa literal de vídeo.", "branch"),
      step("Keep optional advice off the critical path", "Tire a orientação opcional do caminho crítico", "If the menu advisor is unavailable, the kitchen still prepares an already accepted order from its approved recipe. Optional recommendations and sales analysis do not take away essential instructions.", "Se o orientador estiver indisponível, a cozinha ainda prepara o pedido já aceito pela receita aprovada. Recomendações opcionais e análise de vendas não retiram instruções essenciais.", "kitchen"),
    ],
  },
  "real-cases/uber": {
    slug: "real-cases/uber", path: "/casos-reais/uber", mode: "routing", station: "dispatch",
    title: text("Uber System Design", "Projeto de Sistemas do Uber"),
    improvement: text("Assign restaurant delivery bags to nearby available couriers using fresh check-ins and one confirmed reservation.", "Atribua sacolas de entrega a entregadores próximos e disponíveis usando registros recentes e uma reserva confirmada."),
    steps: [
      step("Refresh courier availability", "Atualize a disponibilidade dos entregadores", "Couriers check in at dispatch with their badge, current neighborhood and availability time. Old check-ins cannot be assumed to describe where a courier is now.", "Entregadores se apresentam na expedição com crachá, bairro atual e horário de disponibilidade. Registros antigos não garantem onde alguém está agora.", "dispatch"),
      step("Choose a nearby suitable courier", "Escolha alguém próximo e adequado", "At the manager’s desk, the dispatcher compares fresh check-ins with bag 42’s delivery neighborhood and carrying needs, ranking available candidates.", "Na mesa da gerência, quem despacha compara registros recentes com o bairro e a necessidade de transporte da sacola 42, ordenando candidatos disponíveis.", "terminal"),
      step("Confirm one assignment before release", "Confirme uma atribuição antes de liberar", "Pickup releases bag 42 only after the selected courier accepts and the assignment ledger reserves them. Competing dispatchers must coordinate rather than promise the same courier twice.", "A retirada só libera a sacola 42 depois do aceite e da reserva do entregador no livro. Pessoas despachando em paralelo precisam coordenar, sem prometer o mesmo entregador duas vezes.", "pickup"),
    ],
  },
  "real-cases/chatgpt": {
    slug: "real-cases/chatgpt", path: "/casos-reais/chatgpt", mode: "ai", station: "terminal",
    title: text("ChatGPT System Design", "Projeto de Sistemas do ChatGPT"),
    improvement: text("Explain conversation context and progressive answers through a menu advisor who cannot authorize order changes alone.", "Explique contexto de conversa e resposta progressiva com um orientador que não pode autorizar mudanças sozinho."),
    steps: [
      step("Choose relevant conversation notes", "Escolha notas relevantes da conversa", "The counter passes the advisor the current menu question and only the relevant permitted notes from earlier requests, keeping the recipe desk within its working capacity.", "O balcão passa ao orientador a pergunta atual e apenas notas anteriores relevantes e permitidas, respeitando o espaço de trabalho da mesa de receitas.", "counter"),
      step("Offer the answer progressively", "Apresente a resposta aos poucos", "At the recipe desk, the advisor writes the suggestion piece by piece. The first useful phrase can arrive before the whole recommendation; a human advisor only illustrates the LLM workflow.", "Na mesa de receitas, o orientador escreve a sugestão aos poucos. A primeira frase útil pode chegar antes da recomendação completa; o orientador humano apenas ilustra o fluxo do LLM.", "terminal"),
      step("Keep action checks independent", "Mantenha verificações de ação independentes", "The stockkeeper requires a valid order and customer permission before acting on a proposed substitution. A convincing conversation cannot grant the advisor access to ingredients or private records.", "Quem cuida do estoque exige pedido válido e permissão do cliente antes de executar uma substituição proposta. Uma conversa convincente não concede acesso a ingredientes nem registros privados.", "stock"),
    ],
  },
  "real-cases/perplexity": {
    slug: "real-cases/perplexity", path: "/casos-reais/perplexity", mode: "ai", station: "terminal",
    title: text("Perplexity System Design", "Projeto de Sistemas do Perplexity"),
    improvement: text("Answer an ingredient question with supplier and recipe references that the restaurant can inspect.", "Responda a uma pergunta sobre ingredientes com referências de fornecedores e receitas que a hamburgueria possa conferir."),
    steps: [
      step("Collect relevant ingredient evidence", "Reúna evidências sobre ingredientes", "The advisor retrieves approved supplier notes and recipe editions from stock for the customer’s ingredient question, keeping their dates and identifiers.", "O orientador busca no estoque notas aprovadas de fornecedores e edições de receitas para a pergunta do cliente, mantendo datas e identificadores.", "stock"),
      step("Compose an answer with references", "Componha uma resposta com referências", "At the recipe desk, the advisor writes the recommendation and points each ingredient claim to the supporting recipe or supplier entry. Missing evidence remains a gap.", "Na mesa de receitas, o orientador escreve a recomendação e liga cada afirmação à receita ou nota do fornecedor que a sustenta. Evidência ausente continua sendo lacuna.", "terminal"),
      step("Inspect what the source actually says", "Confira o que a fonte realmente diz", "At the counter, the attendant opens the cited entry before repeating an allergen claim. A reference may be outdated or fail to support the statement; its presence alone does not establish truth.", "No balcão, o atendente abre a entrada citada antes de repetir uma afirmação sobre alergênicos. A referência pode estar antiga ou não sustentar a frase; sua presença sozinha não prova a verdade.", "counter"),
    ],
  },
  "real-cases/github-copilot": {
    slug: "real-cases/github-copilot", path: "/casos-reais/github-copilot", mode: "ai", station: "terminal",
    title: text("GitHub Copilot System Design", "Projeto de Sistemas do GitHub Copilot"),
    improvement: text("Model scoped completion by having a recipe assistant suggest the next kitchen instruction for a chef to verify.", "Modele sugestões com contexto restrito fazendo um auxiliar completar uma instrução de receita para a cozinha verificar."),
    steps: [
      step("Read the permitted recipe context", "Leia o contexto permitido da receita", "At the recipe desk, an assistant receives the current preparation step and nearby approved recipe pages, rather than every private book in the restaurant.", "Na mesa de receitas, um auxiliar recebe a etapa atual de preparo e páginas aprovadas próximas, não todos os livros privados da hamburgueria.", "terminal"),
      step("Suggest the next instruction", "Sugira a próxima instrução", "The assistant takes a proposed next recipe instruction to the counter for review. It is a suggestion based on context, not a proven change; recipe completion illustrates code assistance.", "O auxiliar leva ao balcão uma proposta para a próxima instrução da receita. É uma sugestão contextual, não uma alteração comprovada; completar receitas ilustra assistência de código.", "counter"),
      step("Verify before using the suggestion", "Verifique antes de usar a sugestão", "The chef checks the proposed step against ingredients, preparation rules and safety, then trials it before changing the approved recipe. Plausible instructions can still be wrong.", "A cozinha confere a etapa proposta com ingredientes, regras de preparo e segurança, depois a testa antes de alterar a receita aprovada. Instruções plausíveis ainda podem estar erradas.", "kitchen"),
    ],
  },
  "data-storage/storage-engines": {
    slug: "data-storage/storage-engines", path: "/dados-armazenamento/storage-engines", mode: "storage", station: "stock",
    title: text("Storage Engines: B-Tree vs LSM-Tree", "Mecanismos de Armazenamento: B-Tree vs LSM-Tree"),
    improvement: text("Compare an ordered restaurant ledger with sorted batches of receipts that must later be merged.", "Compare um livro ordenado da hamburgueria com lotes classificados de comprovantes que depois precisam ser combinados."),
    steps: [
      step("Maintain ordered ledger pages", "Mantenha páginas ordenadas", "In stock, the clerk keeps order numbers in ordered ledger pages and updates the page containing order 42. This illustrates indexed point and range access in a B-tree family.", "No estoque, o responsável mantém números de pedidos em páginas ordenadas e atualiza a página do pedido 42. Isso ilustra buscas pontuais e por intervalo na família B-tree.", "stock"),
      step("Collect sorted receipt batches", "Acumule lotes ordenados de comprovantes", "The kitchen first appends changes as receipt slips, then files sorted batches that a clerk later merges, retaining the newest versions. This illustrates the LSM write-and-compaction path.", "A cozinha primeiro acrescenta mudanças em comprovantes e depois arquiva lotes ordenados que serão mesclados, preservando as versões mais novas. Isso ilustra gravação e compactação na família LSM.", "kitchen"),
      step("Compare the work each method creates", "Compare o trabalho de cada método", "The manager counts pages read, entries rewritten and space occupied under the same restaurant workload. Neither the ordered-book method nor batch merging wins every workload.", "A gerência conta páginas lidas, entradas reescritas e espaço ocupado na mesma carga da hamburgueria. Nem livro ordenado nem lotes mesclados vencem em todos os casos.", "terminal"),
    ],
  },
  "data-storage/bloom-filters": {
    slug: "data-storage/bloom-filters", path: "/dados-armazenamento/bloom-filters", mode: "storage", station: "stock",
    title: text("Bloom Filters", "Filtros de Bloom"),
    improvement: text("Use a compact marked checklist to avoid impossible receipt searches while checking possible matches in the ledger.", "Use uma lista compacta marcada para evitar buscas impossíveis, conferindo possíveis ocorrências no livro."),
    steps: [
      step("Mark shared checklist positions", "Marque casas compartilhadas da lista", "For every stored receipt number, the stock clerk applies fixed rules to mark several checklist positions. Different receipt numbers may mark the same positions.", "Para cada comprovante guardado, o estoque aplica regras fixas para marcar várias casas de uma lista. Números diferentes podem marcar as mesmas casas.", "stock"),
      step("Skip a definitely absent receipt", "Evite buscar um comprovante ausente", "At the counter, one required unchecked position means the receipt is not in the correctly maintained collection, so no stockroom trip is needed.", "No balcão, uma casa necessária desmarcada indica que o comprovante não está na coleção mantida corretamente, dispensando a ida ao estoque.", "counter"),
      step("Verify a possible match", "Confira uma possível ocorrência", "If all required positions are marked, the clerk still checks the order ledger. Shared marks can create a false positive; the checklist never proves that receipt 42 exists.", "Se todas as casas necessárias estiverem marcadas, o responsável ainda consulta o livro. Marcas compartilhadas podem gerar falso positivo; a lista não prova que o comprovante 42 exista.", "stock"),
    ],
  },
  "data-storage/replication-quorums": {
    slug: "data-storage/replication-quorums", path: "/dados-armazenamento/replication-quorums", mode: "replication", station: "branch",
    title: text("Replication Models & Quorums", "Modelos de Replicação e Quóruns"),
    improvement: text("Count acknowledgements from separate restaurant books and compare their versions before trusting a read.", "Conte confirmações de livros separados da hamburgueria e compare versões antes de confiar em uma consulta."),
    steps: [
      step("Copy a versioned change", "Copie uma alteração com versão", "The stock clerk sends order 42 edition v2 to three separate restaurant order books. Sending a slip is not yet confirmation that each book has recorded it.", "O estoque envia a edição v2 do pedido 42 para três livros separados. Enviar a comanda ainda não confirma que cada livro a registrou.", "branch"),
      step("Wait for distinct acknowledgements", "Espere confirmações distintas", "At the branch, the clerk collects two stamped acknowledgements before declaring the write accepted. A read consults two of the three books under the chosen policy.", "Na filial, o responsável reúne duas confirmações carimbadas antes de aceitar a gravação. Uma consulta lê dois dos três livros conforme a política escolhida.", "branch"),
      step("Compare versions, not just counts", "Compare versões, não só quantidades", "The manager compares editions from the consulted books. Two plus two exceeds three, but overlap alone does not settle concurrent updates or guarantee linearizable reads.", "A gerência compara edições dos livros consultados. Dois mais dois supera três, mas a sobreposição sozinha não resolve alterações simultâneas nem garante leituras linearizáveis.", "terminal"),
    ],
  },
  "data-storage/change-data-capture": {
    slug: "data-storage/change-data-capture", path: "/dados-armazenamento/cdc", mode: "events", station: "stock",
    title: text("Change Data Capture (CDC)", "Captura de Alterações de Dados (CDC)"),
    improvement: text("Copy confirmed order-book changes into pickup and sales records while retaining a place to resume.", "Copie mudanças confirmadas do livro para registros de retirada e vendas, preservando o ponto de retomada."),
    steps: [
      step("Record a confirmed order change", "Registre uma mudança confirmada", "The stock clerk commits order 42’s completed status in the main ledger and appends a numbered change entry. An unconfirmed scribble is not sent onward.", "O estoque confirma no livro principal que o pedido 42 ficou pronto e acrescenta uma alteração numerada. Um rascunho não confirmado não segue adiante.", "stock"),
      step("Keep the last copied position", "Guarde a última posição copiada", "At the manager’s desk, the copying clerk reads confirmed change entries and records the last copied number so work can resume after a break.", "Na mesa da gerência, quem copia lê alterações confirmadas e anota o último número copiado para retomar após uma interrupção.", "terminal"),
      step("Apply changes to the pickup list", "Aplique alterações à lista de retirada", "Pickup receives numbered change slips and updates its checklist, ignoring repeats already applied. The checklist can lag behind the main order book while slips are still in transit.", "A retirada recebe alterações numeradas e atualiza sua lista, ignorando repetições já aplicadas. A lista pode atrasar em relação ao livro principal enquanto há papéis em trânsito.", "pickup"),
    ],
  },
  "data-storage/oltp-olap": {
    slug: "data-storage/oltp-olap", path: "/dados-armazenamento/oltp-olap", mode: "storage", station: "stock",
    title: text("OLTP vs OLAP, Warehouses & Lakes", "OLTP e OLAP, Armazéns e Lagos de Dados"),
    improvement: text("Keep checkout work separate from the manager’s analysis of months of restaurant receipts.", "Separe o trabalho do caixa da análise de meses de comprovantes pela gerência."),
    steps: [
      step("Complete one current sale", "Conclua uma venda atual", "The counter records order 42 and its payment together under the restaurant’s checkout rules, keeping the active record small and immediately usable.", "O balcão registra pedido 42 e pagamento juntos conforme as regras do caixa, mantendo o registro ativo pequeno e pronto para uso imediato.", "counter"),
      step("File a dated history copy", "Arquive uma cópia datada do histórico", "Confirmed sales receipts move to a separate historical collection on a known schedule. The manager records which period and fields each copy contains.", "Comprovantes de vendas confirmadas seguem para uma coleção histórica separada em horários conhecidos. A gerência registra período e campos incluídos em cada cópia.", "stock"),
      step("Analyze without taking over checkout", "Analise sem ocupar o caixa", "At the desk, the manager totals many days of receipts to compare burger sales. The historical analysis can be slightly delayed without holding the active checkout ledger.", "Na mesa, a gerência soma vários dias de comprovantes para comparar vendas. A análise histórica pode estar um pouco atrasada sem ocupar o livro ativo do caixa.", "terminal"),
    ],
  },
  "data-storage/time-series-databases": {
    slug: "data-storage/time-series-databases", path: "/dados-armazenamento/time-series", mode: "observability", station: "stock",
    title: text("Time-Series Databases", "Bancos de Séries Temporais"),
    improvement: text("Store repeated kitchen measurements by time and keep useful summaries after fine-grained records expire.", "Guarde medições repetidas da cozinha por horário e preserve resumos úteis após expirar o detalhe."),
    steps: [
      step("Record a timestamped sample", "Registre uma amostra com horário", "Every agreed interval, the kitchen writes the current waiting-slip count and time on its measurement sheet, using fixed station and shift labels.", "A cada intervalo combinado, a cozinha anota a quantidade de comandas em espera e o horário, usando rótulos fixos de posto e turno.", "kitchen"),
      step("File samples by time window", "Arquive amostras por período", "The stock clerk groups the measurement sheets by hour and day so the manager can retrieve the lunch window without reading the entire archive.", "O estoque agrupa folhas por hora e dia para que a gerência consulte o período do almoço sem ler o arquivo inteiro.", "stock"),
      step("Choose detail and retention", "Escolha detalhe e retenção", "The manager keeps recent samples in detail and older hourly summaries under a written retention rule. Summaries save space but cannot recreate a short spike that was averaged away.", "A gerência guarda amostras recentes em detalhe e resumos antigos por hora conforme uma regra de retenção. Resumos poupam espaço, mas não recriam um pico curto diluído na média.", "terminal"),
    ],
  },
  "components/api-styles": {
    slug: "components/api-styles", path: "/componentes/api-styles", mode: "routing", station: "counter",
    title: text("API Styles: REST, gRPC & GraphQL", "Estilos de API: REST, gRPC e GraphQL"),
    improvement: text("Compare three ways to ask the burger staff for menu and preparation information.", "Compare três formas de pedir informações à equipe da hamburgueria."),
    steps: [
      step("Ask about a named order", "Pergunte por um pedido identificado", "At the counter, a customer presents receipt #42 and asks for that order's current status: a request centered on an identified thing.", "No balcão, o cliente apresenta o comprovante #42 e consulta aquele pedido: uma solicitação centrada numa coisa identificada.", "counter"),
      step("Use a prescribed kitchen instruction", "Use uma instrução padronizada", "The cook receives a strictly formatted recipe instruction with agreed fields. The fixed form illustrates a typed operation contract.", "A cozinha recebe uma instrução com campos combinados. O formulário fixo ilustra um contrato de operação tipado.", "kitchen"),
      step("Choose the fields to receive", "Escolha os campos da resposta", "At the recipe desk, a checklist requests only ingredients and price. The manager still checks permission and limits how much work one question creates.", "Na mesa de receitas, uma lista pede apenas ingredientes e preço. A gerência ainda confere permissão e limita o trabalho de cada pergunta.", "terminal"),
    ],
  },
  "components/realtime-push": {
    slug: "components/realtime-push", path: "/componentes/realtime-push", mode: "events", station: "pickup",
    title: text("WebSockets & Real-Time Push", "WebSockets e Atualizações em Tempo Real"),
    improvement: text("Keep a customer's pickup slip visible and send its updates as preparation changes.", "Mantenha a comanda do cliente à vista e avise quando o preparo mudar."),
    steps: [
      step("Register interest in one order", "Cadastre interesse em um pedido", "At the entrance, the customer leaves receipt #42 with an attendant who will relay its pickup updates.", "Na entrada, o cliente deixa o comprovante #42 com um atendente que repassará as atualizações da retirada.", "entrance"),
      step("Carry the ready-order notice", "Leve o aviso de pedido pronto", "When the cook marks #42 ready, the attendant brings the changed receipt to pickup without waiting for another question.", "Quando a cozinha marca #42 como pronto, o atendente leva o comprovante à retirada sem esperar outra pergunta.", "pickup"),
      step("Catch up after an interruption", "Atualize após uma interrupção", "If the customer misses the announcement, the manager checks the order book and restores the latest known status. A spoken notice alone is not a history.", "Se o cliente perde o aviso, a gerência consulta o livro e recupera o estado atual. Um anúncio falado sozinho não é histórico.", "terminal"),
    ],
  },
  "components/dead-letter-queue": {
    slug: "components/dead-letter-queue", path: "/componentes/dead-letter-queue", mode: "queue", station: "kitchen",
    title: text("Dead Letter Queues", "Filas de Mensagens Não Processadas"),
    improvement: text("Put an unreadable order slip in an exception tray instead of blocking every other burger.", "Coloque uma comanda ilegível numa bandeja de exceções sem travar os outros hambúrgueres."),
    steps: [
      step("The same slip keeps failing", "A mesma comanda continua falhando", "The cook cannot interpret a damaged order slip even after the allowed checks. Repeating the same attempt does not repair it.", "A cozinha não entende uma comanda danificada mesmo após as conferências permitidas. Repetir a tentativa não a conserta.", "kitchen"),
      step("Set the exception aside", "Separe a exceção", "The attendant places the slip and its failure note in a labeled stockroom tray. Other readable slips continue through preparation.", "O atendente coloca a comanda e a anotação da falha numa bandeja identificada do estoque. As demais seguem para preparo.", "stock"),
      step("Repair before resubmitting", "Corrija antes de reenviar", "The manager clarifies the order, checks whether #42 was already served and sends a corrected slip back. Moving a slip alone solves nothing.", "A gerência esclarece o pedido, confere se #42 já foi entregue e reenvia a comanda corrigida. Apenas separar não resolve.", "terminal"),
    ],
  },
  "components/stream-processing": {
    slug: "components/stream-processing", path: "/componentes/stream-processing", mode: "events", station: "terminal",
    title: text("Stream Processing", "Processamento de Fluxos"),
    improvement: text("Count orders in marked lunch windows while allowing late slips to revise the right count.", "Conte pedidos em janelas do almoço permitindo que comandas atrasadas revisem a contagem correta."),
    steps: [
      step("Stamp the order's time", "Carimbe o horário do pedido", "The cashier writes the time of acceptance on every slip, so arrival at the manager's desk is not mistaken for order time.", "O caixa anota o horário de aceitação em cada comanda para não confundir chegada à gerência com horário do pedido.", "counter"),
      step("Count each lunch window", "Conte cada janela do almoço", "The manager sorts slips into marked five-minute trays and writes each tray's order count in the ledger.", "A gerência separa comandas em bandejas de cinco minutos e anota a contagem de cada uma no livro.", "terminal"),
      step("Apply the late-slip rule", "Aplique a regra de atraso", "A late 12:30 slip reaches the archive. Staff revise its window only if the written lateness policy still permits it.", "Uma comanda atrasada das 12:30 chega ao arquivo. A equipe só revisa sua janela se a política escrita ainda permitir.", "stock"),
    ],
  },
  "consistency-strategies/crdts": {
    slug: "consistency-strategies/crdts", path: "/estrategias-de-consistencia/crdts", mode: "replication", station: "branch",
    title: text("CRDTs (Conflict-Free Replicated Data Types)", "CRDTs (Tipos de Dados Replicados Sem Conflito)"),
    improvement: text("Merge branch tallies of completed orders without counting the same branch report twice or treating the tally as stock.", "Combine contagens de pedidos concluídos sem somar duas vezes o mesmo relatório nem tratá-lo como estoque."),
    steps: [
      step("Each branch owns a tally column", "Cada filial controla sua coluna", "Branch A has recorded three completed orders and branch B four. Each branch only increases its own column in its copy of the daily tally.", "A filial A registrou três pedidos concluídos e B quatro. Cada filial só aumenta sua própria coluna na cópia da contagem diária.", "branch"),
      step("Keep the largest per-branch count", "Guarde o maior valor de cada filial", "The manager merges the sheets by keeping each column's maximum, producing [3,4]. Receiving the same sheet again does not turn seven orders into fourteen.", "A gerência combina as folhas pelo maior valor de cada coluna, produzindo [3,4]. Receber a mesma folha novamente não transforma sete pedidos em quatorze.", "terminal"),
      step("Do not use it as a stock lock", "Não use a contagem como trava de estoque", "The stockkeeper sees seven completed orders, not permission to sell the last bun twice. This growing tally does not model arbitrary refunds or enforce reservation limits.", "O estoque vê sete pedidos concluídos, não uma autorização para vender o último pão duas vezes. A contagem crescente não modela qualquer estorno nem protege limites de reserva.", "stock"),
    ],
  },
  "consistency-strategies/gossip": {
    slug: "consistency-strategies/gossip", path: "/estrategias-de-consistencia/gossip", mode: "replication", station: "branch",
    title: text("Gossip & Anti-Entropy Protocols", "Protocolos de Gossip e Antientropia"),
    improvement: text("Pass recipe copies between neighboring supervisors and compare retained pages to repair a missed update.", "Passe receitas entre responsáveis vizinhos e compare páginas guardadas para reparar uma atualização esquecida."),
    steps: [
      step("Tell one colleague first", "Avise primeiro um colega", "The main cook hands recipe v2 to one branch supervisor. The cook does not have to visit every branch in the same round.", "O cozinheiro principal entrega a receita v2 a um responsável de filial. Ele não precisa visitar todas as filiais na mesma rodada.", "branch"),
      step("Colleagues pass it onward", "Os colegas passam adiante", "Each supervisor periodically chooses another colleague and shares the recipe version held locally. Repeated exchanges spread the copy beyond the first recipient.", "Cada responsável escolhe periodicamente outro colega e compartilha a versão que possui. Trocas repetidas espalham a cópia além do primeiro destinatário.", "branch"),
      step("Compare and repair missing pages", "Compare e reponha páginas ausentes", "The manager compares retained recipe pages and supplies an update one branch missed. These exchanges repair differences over time; they do not mean all branches agreed simultaneously.", "A gerência compara páginas guardadas e repõe a atualização esquecida por uma filial. As trocas corrigem diferenças com o tempo; não significam acordo simultâneo entre todas.", "terminal"),
    ],
  },
  "consistency-strategies/distributed-locks": {
    slug: "consistency-strategies/distributed-locks", path: "/estrategias-de-consistencia/distributed-locks", mode: "consensus", station: "stock",
    title: text("Distributed Locks, Leases & Fencing Tokens", "Bloqueios Distribuídos, Concessões Temporárias e Tokens de Proteção"),
    improvement: text("Issue numbered, expiring stock keys and make the stockkeeper reject an older key after a new owner takes over.", "Entregue chaves de estoque numeradas e temporárias e faça o estoquista rejeitar a antiga após trocar o responsável."),
    steps: [
      step("Issue key 18 for a limited time", "Entregue a chave 18 por tempo limitado", "The manager gives a cook key 18 and records its expiry. Its number identifies this ownership period, not just permission to open a cupboard forever.", "A gerência entrega a chave 18 a um cozinheiro e registra a validade. O número identifica esse período de posse, não uma permissão eterna para abrir o armário.", "counter"),
      step("A new owner receives 19", "Outro responsável recebe 19", "The first cook is delayed beyond the expiry. The manager gives the next owner key 19, and the stockkeeper records 19 as the current authority.", "O primeiro cozinheiro se atrasa além da validade. A gerência entrega a chave 19 ao próximo, e o estoquista registra 19 como autorização atual.", "stock"),
      step("Reject the returning old key", "Recuse a chave antiga que voltou", "The delayed cook returns with 18, but the stockkeeper checks the current number and refuses its stock change. Expiry alone would not stop an old holder from trying.", "O cozinheiro atrasado volta com 18, mas o estoquista confere o número atual e recusa a alteração. Só a validade vencida não impediria a tentativa de um antigo responsável.", "stock"),
    ],
  },
  "design-principles/event-sourcing": {
    slug: "design-principles/event-sourcing", path: "/principios-design/event-sourcing", mode: "events", station: "stock",
    title: text("Event Sourcing", "Event Sourcing"),
    improvement: text("Keep an append-only order diary and rebuild the pickup sheet by reading it, without cooking or charging again.", "Mantenha um diário de pedidos por acréscimo e reconstrua a folha da retirada sem cozinhar nem cobrar novamente."),
    steps: [
      step("Add facts to the diary", "Acrescente fatos ao diário", "The cashier writes that #42 was accepted and paid, and the cook adds that it was prepared. New facts add lines instead of erasing earlier facts.", "O caixa escreve que #42 foi aceito e pago; o cozinheiro acrescenta que ficou pronto. Novos fatos ganham linhas, sem apagar os anteriores.", "stock"),
      step("Rebuild the pickup sheet", "Reconstrua a folha da retirada", "A runner reads the retained lines for #42 in order and rebuilds its current pickup status. The sheet can be recreated from the diary.", "Um ajudante lê na ordem as linhas guardadas de #42 e reconstrói seu estado na retirada. A folha pode ser refeita a partir do diário.", "pickup"),
      step("Correct without replaying the meal", "Corrija sem repetir a refeição", "The manager appends a correction or cancellation rather than rewriting history. Rebuilding the sheet reads facts; it must not charge again or put another burger on the grill.", "A gerência acrescenta correção ou cancelamento em vez de reescrever o histórico. Reconstruir a folha é ler fatos; não é cobrar novamente nem colocar outro hambúrguer na chapa.", "terminal"),
    ],
  },
  "design-principles/outbox": {
    slug: "design-principles/outbox", path: "/principios-design/outbox", mode: "events", station: "stock",
    title: text("Transactional Outbox", "Caixa de Saída Transacional (Outbox)"),
    improvement: text("Record the order and its pending kitchen notice together, then let a runner deliver the notice after confirmation.", "Registre o pedido e seu aviso pendente à cozinha juntos e só envie o aviso após confirmar o lançamento."),
    steps: [
      step("Keep order and notice together", "Mantenha pedido e aviso juntos", "One confirmed ledger entry for #42 contains both the accepted order and a pending kitchen-notice stub. The runner cannot take an unconfirmed stub.", "Um lançamento confirmado de #42 reúne o pedido aceito e o canhoto pendente de aviso à cozinha. O ajudante não pode levar um canhoto ainda não confirmado.", "stock"),
      step("Deliver the confirmed stub", "Entregue o canhoto confirmado", "After the entry is stamped, the runner takes the pending stub to the cook. The cashier did not need to finish that handoff while accepting payment.", "Após o carimbo do lançamento, o ajudante leva o canhoto pendente ao cozinheiro. O caixa não precisou concluir essa entrega enquanto aceitava o pagamento.", "kitchen"),
      step("Recognize a repeated handoff", "Reconheça uma entrega repetida", "If the runner forgets to mark the stub delivered, #42 can arrive again. The cook checks the recorded order number instead of treating the repeated notice as a new job.", "Se o ajudante esquecer de marcar o envio, #42 pode chegar novamente. O cozinheiro confere o número registrado, em vez de tratar o aviso repetido como outro preparo.", "kitchen"),
    ],
  },
  "design-principles/bulkhead": {
    slug: "design-principles/bulkhead", path: "/principios-design/bulkhead", mode: "queue", station: "kitchen",
    title: text("The Bulkhead Pattern", "O Padrão Bulkhead"),
    improvement: text("Reserve separate staff for normal ordering so lengthy recipe consultations cannot occupy every cashier.", "Reserve equipe para pedidos comuns para consultas demoradas de receitas não ocuparem todos os caixas."),
    steps: [
      step("Consultations occupy everyone", "As consultas ocupam toda a equipe", "Several customers request long recipe consultations at the manager's desk. When every cashier helps there, even customers ordering the classic burger cannot place a ticket.", "Vários clientes pedem consultas demoradas na mesa de receitas. Quando todos os caixas ajudam ali, até quem quer o hambúrguer clássico fica sem conseguir pedir.", "terminal"),
      step("Reserve a cashier role", "Reserve o papel do caixa", "The manager assigns separate staff badges: some handle consultations, while a cashier stays dedicated to normal orders. Each role has its own limited capacity.", "A gerência separa os crachás: parte da equipe cuida das consultas e um caixa fica dedicado aos pedidos comuns. Cada função tem capacidade limitada própria.", "counter"),
      step("Keep classic orders moving", "Mantenha os pedidos comuns andando", "The consultation queue may remain full, but #42 still reaches the kitchen through its reserved cashier. Consultation overflow waits or is refused within that queue.", "A fila de consultas pode continuar cheia, mas #42 chega à cozinha pelo caixa reservado. O excesso de consultas espera ou é recusado naquela fila.", "kitchen"),
    ],
  },
  "design-principles/blue-green": {
    slug: "design-principles/blue-green", path: "/principios-design/blue-green", mode: "routing", station: "kitchen",
    title: text("Blue-Green Deployment", "Implantação Azul-Verde"),
    improvement: text("Prepare a complete second cooking area, check it, then redirect new tickets while old tickets finish where they started.", "Prepare uma segunda área completa, confira seu funcionamento e redirecione novas comandas enquanto as antigas terminam onde começaram."),
    steps: [
      step("Keep the current kitchen serving", "Mantenha a cozinha atual atendendo", "The current kitchen prepares #42 using v1 while a separate branch is equipped for the candidate routine. Existing customers keep their working path.", "A cozinha atual prepara #42 com v1 enquanto uma filial separada recebe a rotina candidata. Os clientes existentes continuam pelo caminho que funciona.", "kitchen"),
      step("Check the prepared alternative", "Confira a alternativa preparada", "The manager inspects the branch recipe v2, ingredients and a sample order. Its slips must remain compatible with the shared order ledger before the switch.", "A gerência confere receita v2, ingredientes e um pedido de exemplo na filial. As comandas precisam continuar compatíveis com o livro compartilhado antes da troca.", "branch"),
      step("Redirect only new tickets", "Redirecione apenas novas comandas", "The cashier sends new #43 to the prepared branch. #42 finishes in the original kitchen; sending new work back also requires compatible records and care with orders already cooking.", "O caixa envia a nova #43 à filial pronta. #42 termina na cozinha original; devolver novos pedidos também exige registros compatíveis e cuidado com preparos em andamento.", "branch"),
    ],
  },
  "design-principles/feature-flags": {
    slug: "design-principles/feature-flags", path: "/principios-design/feature-flags", mode: "routing", station: "counter",
    title: text("Feature Flags", "Chaves de Funcionalidade (Feature Flags)"),
    improvement: text("Prepare a new topping recipe before selectively offering it to customers under a written eligibility rule.", "Prepare a receita do novo adicional antes de oferecê-lo seletivamente por uma regra escrita de elegibilidade."),
    steps: [
      step("Prepare without offering yet", "Prepare sem oferecer ainda", "The cook receives the new topping recipe v2, but the cashier's checklist still keeps the offer off. Having the recipe ready is separate from offering it.", "O cozinheiro recebe a receita v2 do adicional, mas a lista do caixa ainda mantém a oferta desligada. Ter a receita pronta é diferente de oferecê-la.", "kitchen"),
      step("Check a defined customer group", "Confira um grupo de clientes definido", "The cashier offers the topping to customers with loyalty badge A according to the written rule. Other customers keep the existing menu and preparation.", "O caixa oferece o adicional a clientes com crachá de fidelidade A, conforme a regra escrita. Os demais continuam com o cardápio e o preparo existentes.", "counter"),
      step("Review and retire the rule", "Revise e encerre a regra", "The manager checks feedback and may stop the offer for new orders without replacing the kitchen. After a stable rollout, staff remove the temporary eligibility checklist.", "A gerência confere o retorno e pode suspender a oferta em novos pedidos sem trocar a cozinha. Após estabilizar, a equipe remove a lista temporária de elegibilidade.", "terminal"),
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
