import type { LocalizedText } from './learningModel';

/** Each lesson is staged in a themed burger-restaurant diorama. */
export type KitId = 'line' | 'rail' | 'grills' | 'host' | 'network' | 'pantry' | 'vault' | 'cache' | 'security' | 'office' | 'delivery' | 'library' | 'backup';
export type KitFlag =
  | 'bell' | 'buzzer' | 'timer' | 'form' | 'toggle'
  | 'diary' | 'trays' | 'gate' | 'pause' | 'exceptions' | 'stub'
  | 'big' | 'roster' | 'host'
  | 'directory' | 'arrows'
  | 'clock' | 'scooter'
  | 'ring' | 'catalog' | 'bits' | 'boxes' | 'pages' | 'batches' | 'profiles'
  | 'item' | 'hooks' | 'tally' | 'decision'
  | 'ttl' | 'readers' | 'price'
  | 'intruder' | 'seal' | 'schedule' | 'logbook'
  | 'alarm' | 'trace' | 'budget' | 'log'
  | 'breaker' | 'map'
  | 'stream' | 'guard' | 'notes' | 'classics' | 'margin'
  | 'utilities' | 'copy' | 'drill';
export type UnitMark = 'yes' | 'no' | 'wait';
export interface DioramaUnit {
  tag?: string | LocalizedText;
  mark?: UnitMark;
  /** Out of service: cone, tape and a closed sign. */
  down?: boolean;
  /** Not built or not staffed in this moment. */
  hidden?: boolean;
  /** Being opened or installed during this step. */
  fresh?: boolean;
  /** Receives the attention of this step. */
  lit?: boolean;
}
export type UnitSpec = DioramaUnit | LocalizedText | string | null;
export interface DioramaSet {
  units?: UnitSpec[];
  /** Number of units on display; the rest are empty bays. */
  count?: number;
  flags?: KitFlag[];
  /** Kit-defined proportions, such as chart bars or marked boxes. */
  values?: number[];
  /** Kit-defined 0–1 dial: breaker lever, quota gate, error budget, offer switch. */
  gauge?: number;
  board?: LocalizedText;
}
export interface LessonDiorama {
  kit: KitId;
  board: LocalizedText;
  /** Which branch unit represents “the branch” in the narration. */
  branch?: number;
  steps: readonly [DioramaSet, DioramaSet, DioramaSet];
}
export interface KitInfo {
  title: LocalizedText;
  units: number;
  unitNames: readonly LocalizedText[];
  flags: readonly KitFlag[];
  defaultCount?: number;
}

const txt = (pt: string, en: string): LocalizedText => ({ pt, en });

export const kits: Record<KitId, KitInfo> = {
  line: { title: txt('Linha de atendimento', 'Service line'), units: 3, unitNames: [txt('Caixa', 'Register'), txt('Chapa', 'Grill'), txt('Retirada', 'Pickup')], flags: ['bell', 'buzzer', 'timer', 'form', 'toggle'] },
  rail: { title: txt('Régua de comandas', 'Ticket rail'), units: 3, defaultCount: 2, unitNames: [txt('Posto 1', 'Station 1'), txt('Posto 2', 'Station 2'), txt('Posto 3', 'Station 3')], flags: ['diary', 'trays', 'gate', 'pause', 'exceptions', 'stub', 'bell'] },
  grills: { title: txt('Cozinha em expansão', 'Growing kitchen'), units: 4, defaultCount: 2, unitNames: [txt('Chapa 1', 'Grill 1'), txt('Chapa 2', 'Grill 2'), txt('Chapa 3', 'Grill 3'), txt('Chapa 4', 'Grill 4')], flags: ['big', 'roster', 'host'] },
  host: { title: txt('Recepção e encaminhamento', 'Host stand and routing'), units: 3, unitNames: [txt('Balcão', 'Counter'), txt('Cozinha', 'Kitchen'), txt('Filial', 'Branch')], flags: ['directory', 'arrows'] },
  network: { title: txt('Rede de filiais', 'Branch network'), units: 4, unitNames: [txt('Matriz', 'Main restaurant'), txt('Filial A', 'Branch A'), txt('Filial B', 'Branch B'), txt('Filial C', 'Branch C')], flags: ['clock', 'scooter'] },
  pantry: { title: txt('Arquivo e estoque', 'Records and stockroom'), units: 3, unitNames: [txt('Estante 1', 'Shelf 1'), txt('Estante 2', 'Shelf 2'), txt('Estante 3', 'Shelf 3')], flags: ['ring', 'catalog', 'bits', 'boxes', 'pages', 'batches', 'profiles'] },
  vault: { title: txt('Chaves e reservas', 'Keys and reservations'), units: 2, unitNames: [txt('Cozinheiro A', 'Cook A'), txt('Cozinheiro B', 'Cook B')], flags: ['item', 'hooks', 'tally', 'decision'] },
  cache: { title: txt('Cardápio de consulta', 'Lookup menu'), units: 2, unitNames: [txt('Cópia do balcão', 'Counter copy'), txt('Cópia da retirada', 'Pickup copy')], flags: ['ttl', 'readers', 'price'] },
  security: { title: txt('Porta do estoque', 'Stockroom door'), units: 3, unitNames: [txt('Recepção', 'Front desk'), txt('Porta do estoque', 'Stockroom door'), txt('Gerência', 'Manager')], flags: ['intruder', 'seal', 'schedule', 'logbook'] },
  office: { title: txt('Sala da gerência', 'Manager’s office'), units: 4, unitNames: [txt('Faixa 1', 'Band 1'), txt('Faixa 2', 'Band 2'), txt('Faixa 3', 'Band 3'), txt('Faixa 4', 'Band 4')], flags: ['alarm', 'trace', 'budget', 'log'] },
  delivery: { title: txt('Expedição', 'Dispatch'), units: 3, unitNames: [txt('Entregador 1', 'Courier 1'), txt('Entregador 2', 'Courier 2'), txt('Entregador 3', 'Courier 3')], flags: ['breaker', 'map'] },
  library: { title: txt('Mesa de receitas', 'Recipe desk'), units: 3, defaultCount: 2, unitNames: [txt('Orientador 1', 'Advisor 1'), txt('Orientador 2', 'Advisor 2'), txt('Orientador 3', 'Advisor 3')], flags: ['catalog', 'stream', 'guard', 'notes', 'classics', 'margin'] },
  backup: { title: txt('Cozinha reserva', 'Backup kitchen'), units: 2, unitNames: [txt('Cozinha A', 'Kitchen A'), txt('Cozinha B', 'Kitchen B')], flags: ['utilities', 'copy', 'drill'] },
};

type Step = DioramaSet;
const d = (kit: KitId, pt: string, en: string, steps: [Step, Step, Step], extra: Partial<LessonDiorama> = {}): LessonDiorama => ({ kit, board: txt(pt, en), steps, ...extra });
const wait: DioramaUnit = { mark: 'wait' };
const yes: DioramaUnit = { mark: 'yes' };
const no: DioramaUnit = { mark: 'no' };
const down: DioramaUnit = { down: true };
const lit: DioramaUnit = { lit: true };
const fresh: DioramaUnit = { fresh: true };
const off: DioramaUnit = { hidden: true };
const tag = (value: string | LocalizedText, more: DioramaUnit = {}): DioramaUnit => ({ tag: value, ...more });

// Authored together with each lesson's narration in learningModel.ts.
export const lessonDioramas: Record<string, LessonDiorama> = {
  "intro": d('line', 'Comanda #42: do caixa à retirada', 'Ticket #42: register to pickup', [{ units: [tag('#42')] }, { units: [null, tag('#42')] }, { units: [null, null, tag('#42', yes)], flags: ['bell'] }]),
  "distributed-systems-101": d('network', 'Cada estação com seu livro', 'Each station keeps its own book', [{ units: [tag(txt('livro do caixa', 'register book'))] }, { units: [tag('#42')] }, { units: [tag('#42'), null, wait] }]),
  "system-design-101": d('line', 'Espera aceitável: 5 min', 'Acceptable wait: 5 min', [{ units: [tag(txt('cobrar', 'charge'))] }, { units: [tag(txt('cobrar', 'charge')), tag(txt('preparar', 'cook')), tag(txt('entregar', 'hand over'))] }, { units: [null, tag(txt('gargalo', 'bottleneck'), wait)], flags: ['timer'] }]),
  "theoretical-foundations/index": d('network', 'Cardápio v2 a caminho', 'Menu v2 on its way', [{ units: ['v2', 'v1', 'v1', 'v1'] }, { units: ['v2', 'v1', tag('v1', wait), 'v1'] }, { units: ['v2', 'v1', 'v1', 'v1'], board: txt('Esperar ou usar a cópia local?', 'Wait, or use the local copy?') }]),
  "theoretical-foundations/cap-theorem": d('network', 'Passagem fechada: esperar ou responder?', 'Passage closed: wait or answer?', [{ units: [tag(txt('pães: 1', 'buns: 1')), null, tag(txt('pães: 2', 'buns: 2'))] }, { units: [tag(txt('pães: 1', 'buns: 1'), wait), null, tag(txt('pães: 2', 'buns: 2'))] }, { units: [tag(txt('pães: 1', 'buns: 1')), null, tag(txt('pães: 2', 'buns: 2'), lit)] }]),
  "theoretical-foundations/consistency-models": d('network', 'Qual revisão cada cliente vê?', 'Which revision does each customer see?', [{ units: ['v2', 'v1', 'v1', 'v1'] }, { units: ['v2', 'v1', tag('v1', lit), 'v1'] }, { units: ['v2', 'v2', 'v1', 'v1'] }]),
  "theoretical-foundations/distributed-challenges": d('network', 'Silêncio não é resposta', 'Silence is not an answer', [{ units: [tag('#42', wait)] }, { units: [tag('#41')] }, { units: [tag('#42', yes)] }]),
  "theoretical-foundations/network-partitions": d('network', 'Filial isolada, livros separados', 'Isolated branch, separate books', [{ units: ['v1', 'v1', 'v1', 'v1'] }, { units: [tag('#42'), 'v1', 'v1', 'v1'] }, { units: ['v2', 'v2', 'v2', 'v2'] }]),
  "components/index": d('line', 'Comanda, régua e livro', 'Ticket, rail and book', [{ units: [tag('#42')] }, { units: [null, tag('#42')] }, { units: [tag(txt('arquivado', 'filed'))] }]),
  "theoretical-foundations/pacelc": d('network', 'Confirmar custa tempo, mesmo sem falhas', 'Confirming costs time, even without failures', [{ units: ['v2', 'v1', 'v1', 'v1'] }, { units: ['v2', 'v1', tag('v2', wait), 'v1'] }, { units: ['v2', 'v1', 'v2', 'v1'], flags: ['clock'] }]),
  "components/database": d('pantry', 'Livro de pedidos durável', 'Durable order book', [{ flags: ['pages'] }, { flags: ['pages'], units: [tag('#42', yes)] }, { flags: ['pages'], units: [tag('#42', lit)] }]),
  "theoretical-foundations/flp-impossibility": d('network', 'Silêncio: lento ou ausente?', 'Silence: slow or gone?', [{ units: ['v2', tag('v2', wait), tag('v2', wait), tag('v2', wait)] }, { units: ['v2', tag('v2', yes), tag('v2', wait), tag('v2', yes)] }, { units: ['v2', tag('v2', yes), tag('v2', wait), tag('v2', yes)], flags: ['clock'] }]),
  "components/cache": d('cache', 'Cópia do cardápio perto do cliente', 'A menu copy close to the customer', [{ units: ['v1', down] }, { units: ['v1', 'v1'], flags: ['readers'] }, { units: [tag('v1', no), 'v2'], flags: ['price'] }]),
  "theoretical-foundations/fallacies": d('delivery', 'A entrega nunca é instantânea', 'Delivery is never instant', [{ units: [null, null, null] }, { units: [tag('#42', wait), off, off] }, { units: [null, null, null], flags: ['map'] }]),
  "components/load-balancer": d('grills', 'Uma entrada, várias chapas', 'One entrance, several grills', [{ count: 3, flags: ['host'] }, { count: 3, flags: ['host'], units: [null, tag('#42', lit)] }, { count: 3, flags: ['host'], units: [null, down] }]),
  "components/message-queue": d('rail', 'Régua de comandas', 'The ticket rail', [{ count: 1 }, { count: 2, units: [lit] }, { count: 2, flags: ['bell'] }]),
  "components/cdn": d('network', 'Livreto de fotos no bairro', 'Photo booklet in the neighborhood', [{ units: ['v1', off, 'v1', off] }, { units: ['v1', off, tag('v1', lit), off] }, { units: ['v2', off, tag('v1', no), off] }]),
  "components/api-gateway": d('host', 'Uma entrada confere e encaminha', 'One entrance checks and routes', [{}, { flags: ['arrows'] }, { flags: ['arrows'], units: [null, lit] }]),
  "components/firewall": d('security', 'Só passa quem está na lista', 'Only listed staff get through', [{ units: [tag('A')] }, { units: [null, no], flags: ['intruder'] }, { units: [yes, null, yes] }]),
  "components/polling-webhooks": d('line', 'Perguntar de novo ou ser avisado?', 'Ask again, or get notified?', [{ units: [null, tag('#42'), wait] }, { units: [null, tag('#42', yes)], flags: ['bell', 'buzzer'] }, { units: [null, null, tag('#42')], flags: ['buzzer'] }]),
  "components/vector-database": d('pantry', 'Fichas por perfil de sabor', 'Cards by flavor profile', [{ flags: ['profiles'] }, { flags: ['profiles'], units: [null, lit] }, { flags: ['profiles'] }]),
  "components/model-gateway": d('library', 'Um balcão escolhe o orientador', 'One desk picks the advisor', [{ count: 3 }, { count: 3, units: [yes, wait, down] }, { count: 3, units: [null, lit, down] }]),
  "components/kafka-streaming": d('rail', 'Diário com marcadores', 'A diary with bookmarks', [{ flags: ['diary'] }, { flags: ['diary'], count: 2 }, { flags: ['diary'] }]),
  "components/dns": d('host', 'Guia de endereços das filiais', 'Branch address guide', [{ flags: ['directory'] }, { flags: ['directory'], units: [null, null, tag('B', lit)] }, { flags: ['directory'], units: [null, null, tag('5:00')] }]),
  "components/reverse-proxy": d('host', 'Tudo passa pela entrada', 'Everything goes through the entrance', [{}, { flags: ['arrows'], units: [lit] }, { flags: ['arrows'] }]),
  "components/service-discovery": d('grills', 'Lista de quem está no turno', 'Who is on shift', [{ count: 3, flags: ['roster'], units: [null, fresh] }, { count: 3, flags: ['roster'] }, { count: 3, flags: ['roster'], units: [null, off] }]),
  "components/service-mesh": d('security', 'Crachás nas duas pontas', 'Badges at both ends', [{}, { units: [yes, yes] }, { units: [yes, yes], flags: ['logbook'] }]),
  "components/kubernetes": d('grills', 'Plano: 3 chapas prontas', 'Plan: 3 grills ready', [{ count: 1 }, { count: 3, units: [null, fresh, fresh] }, { count: 3, units: [null, fresh] }]),
  "design-principles/index": d('line', 'Cada posto conhece sua tarefa', 'Each post knows its job', [{ units: [tag('#42')] }, { units: [null, tag('#42')] }, { units: [yes, yes, wait] }]),
  "design-principles/event-driven": d('rail', 'A comanda carimbada é um fato', 'A stamped ticket is a fact', [{ count: 2 }, { count: 2, units: [lit] }, { count: 2 }]),
  "design-principles/coupling": d('line', 'Comanda v1: campos combinados', 'Ticket v1: agreed fields', [{ units: [tag(txt('código B3', 'code B3')), no] }, { units: ['v1'], flags: ['form'] }, { units: ['v1', tag('v1', yes)], flags: ['form'] }]),
  "design-principles/orchestration-vs-choreography": d('line', 'Quem conduz o pedido #42?', 'Who drives order #42?', [{ units: [wait, wait, wait] }, { units: [yes, lit] }, { units: [yes, yes, yes] }]),
  "design-principles/canary-deployment": d('grills', '1 em cada 10 comandas para v2', '1 in 10 tickets to v2', [{ count: 2, units: ['v1', 'v2'] }, { count: 2, units: ['v1', tag('v2', lit)] }, { count: 2, units: ['v1', tag('v2', yes)] }]),
  "design-principles/cqrs": d('pantry', 'Livro oficial e folha de consulta', 'Official book and lookup sheet', [{ units: [tag(txt('oficial', 'official'), yes)] }, { units: [tag(txt('oficial', 'official')), tag(txt('consulta', 'lookup'), lit)] }, { units: [tag(txt('oficial', 'official')), tag('v1', wait)] }]),
  "design-principles/rate-limiting": d('rail', 'Cota: 2 comandas por minuto', 'Quota: 2 tickets per minute', [{ flags: ['gate'], gauge: 0 }, { flags: ['gate'], gauge: 0 }, { flags: ['gate'], gauge: 1 }]),
  "design-principles/backpressure": d('rail', 'Régua cheia: pausa no caixa', 'Rail full: pause at the register', [{}, { flags: ['pause'] }, {}]),
  "design-principles/fault-tolerance": d('backup', 'Equipe de reserva pronta', 'A ready backup crew', [{ units: ['v1', 'v1'] }, { units: [down, 'v1'] }, { units: [down, tag('#42', lit)] }]),
  "design-principles/retries": d('line', 'Esperar, variar e reenviar #42', 'Wait, vary, resend #42', [{ units: [wait, tag('#42')] }, { units: [wait], flags: ['timer'] }, { units: [null, tag('#42', yes)] }]),
  "design-principles/circuit-breaker": d('delivery', 'Disjuntor de entregas', 'The delivery breaker', [{ flags: ['breaker'], gauge: 0, units: [no, no, wait] }, { flags: ['breaker'], gauge: 1, units: [down, down, down] }, { flags: ['breaker'], gauge: .5, units: [tag('#43', lit), down, down] }]),
  "design-principles/timeout": d('line', 'Prazo de 2 minutos', 'A 2-minute deadline', [{ flags: ['timer'], units: [null, tag('#42')] }, { flags: ['timer'], units: [wait, tag('#42')] }, { flags: ['timer'], units: [null, tag('#42', yes)] }]),
  "design-principles/fallback": d('library', 'Plano B: os clássicos', 'Plan B: the classics', [{ count: 1, units: [lit] }, { count: 1, units: [down] }, { count: 1, units: [down], flags: ['classics'] }]),
  "design-principles/scalability": d('grills', 'Amplie o gargalo de verdade', 'Grow the real bottleneck', [{ count: 1 }, { count: 1, units: [tag('6/6', wait)] }, { count: 2, units: [null, fresh] }]),
  "design-principles/horizontal-scaling": d('grills', 'Mais chapas iguais', 'More identical grills', [{ count: 2, units: ['v1', tag('v1', { fresh: true })] }, { count: 2, units: [tag('#41'), tag('#42', lit)] }, { count: 2 }]),
  "design-principles/vertical-scaling": d('grills', 'Uma chapa maior no mesmo posto', 'A bigger grill in the same spot', [{ count: 1 }, { count: 1, flags: ['big'], units: [fresh] }, { count: 1, flags: ['big'], units: [wait] }]),
  "design-principles/data-consistency": d('network', 'Duas folhas, um único pão', 'Two sheets, one bun', [{ units: [tag(txt('1 pão', '1 bun')), null, tag(txt('1 pão', '1 bun'))] }, { units: [tag(txt('reservado #42', 'held #42'), yes), null, tag(txt('1 pão', '1 bun'))] }, { units: [tag(txt('0 pão', '0 buns')), null, tag(txt('0 pão', '0 buns'))] }]),
  "design-principles/latency": d('line', 'O cliente sente o caminho inteiro', 'The customer feels the whole trip', [{ units: [tag('0:00')] }, { units: [null, tag(txt('6 antes', '6 ahead'), wait)] }, { units: [null, null, tag('6:00')], flags: ['timer'] }]),
  "design-principles/failover": d('backup', 'O balcão de reserva assume', 'The backup counter takes over', [{ units: [down, 'v1'] }, { units: [down, tag('v2', lit)] }, { units: [down, tag('#43', lit)] }]),
  "design-principles/availability": d('backup', 'Promessa: 12h–22h', 'Promise: noon to 10 pm', [{ units: [yes, yes] }, { units: [down, lit] }, { units: [down, yes] }]),
  "design-principles/replication": d('network', 'Receita v2 em cada filial', 'Recipe v2 at every branch', [{ units: ['v2', 'v1', 'v1', 'v1'] }, { units: ['v2', 'v1', tag('v1', wait), 'v1'] }, { units: ['v2', 'v2', tag('v2', yes), 'v2'] }]),
  "design-principles/availability-zones": d('backup', 'Prédios com energia própria', 'Buildings with their own power', [{ flags: ['utilities'] }, { flags: ['utilities'], units: ['v2', 'v2'] }, { flags: ['utilities'], units: [down, lit] }]),
  "consistency-strategies/index": d('vault', 'Uma chave para a última porção', 'One key for the last portion', [{ flags: ['item'], units: ['1', '1'] }, { flags: ['item', 'hooks'], units: [tag('#42', yes), wait] }, { flags: ['item'], units: ['0', '0'] }]),
  "consistency-strategies/consensus": d('network', '2 de 3 aprovam a receita v2', '2 of 3 approve recipe v2', [{ units: ['v2', tag('v2', wait), tag('v2', wait), tag('v2', wait)] }, { units: ['v2', tag('v2', yes), tag('v2', yes), tag('v2', wait)] }, { units: [tag('v2', yes), tag('v2', yes), tag('v2', yes), tag('v2', wait)] }]),
  "consistency-strategies/lamport-timestamps": d('line', 'Carimbos lógicos, não horas', 'Logical stamps, not hours', [{ units: ['5', '8'] }, { units: ['5', tag('8', lit)] }, { units: ['5', tag('9', yes)] }]),
  "consistency-strategies/two-phase-commit": d('vault', 'Preparar, depois decidir', 'Prepare, then decide', [{ flags: ['decision'], units: [yes, yes] }, { flags: ['decision'], units: [yes, yes] }, { flags: ['decision'], units: [yes, wait] }]),
  "consistency-strategies/synchronization": d('vault', 'Uma fatia de queijo, dois cozinheiros', 'One cheese slice, two cooks', [{ flags: ['item'], units: ['1', '1'] }, { flags: ['item', 'hooks'], units: [tag('#42', yes), wait] }, { flags: ['hooks'], units: ['0', '0'] }]),
  "consistency-strategies/synchronization-fundamentals": d('vault', 'Ler e escrever com a mesma chave', 'Read and write under one key', [{ flags: ['tally'], units: [tag('10 → 11'), tag('10 → 11')] }, { flags: ['tally', 'hooks'], units: [tag('A', yes), wait] }, { flags: ['tally'], units: [tag('A'), tag('B', no)] }]),
  "consistency-strategies/synchronization-deadlocks": d('vault', 'Geladeira antes da despensa', 'Fridge before pantry', [{ units: [tag(txt('geladeira', 'fridge')), tag(txt('despensa', 'pantry'))] }, { units: [tag(txt('geladeira', 'fridge'), wait), tag(txt('despensa', 'pantry'), wait)] }, { flags: ['hooks'], units: [tag(txt('geladeira', 'fridge'), yes), off] }]),
  "consistency-strategies/saga": d('delivery', 'Cada etapa tem sua compensação', 'Every step has its compensation', [{ units: [null, null, null] }, { units: [no, no, no] }, { units: [down, down, down] }]),
  "consistency-strategies/delivery-semantics": d('line', 'No máximo ou pelo menos uma vez?', 'At most, or at least once?', [{ units: [wait, tag('#42')] }, { units: [tag('#42'), tag('#42')] }, { units: [null, tag('#42', yes)] }]),
  "consistency-strategies/vector-clocks": d('network', 'Revisões concorrentes', 'Concurrent revisions', [{ units: ['[1,0]', '[2,0]', '[1,1]', off] }, { units: ['[1,0]', '[2,0]', tag('[1,1]', lit), off] }, { units: [tag('[3,1]', yes), '[2,0]', '[1,1]', off] }]),
  "security/index": d('security', 'Identidade, permissão e sigilo', 'Identity, permission and secrecy', [{ units: [yes] }, { units: [yes, tag(txt('só gerência', 'manager only'))] }, { units: [yes, null, null], flags: ['seal'] }]),
  "security/authentication": d('security', 'Crachá conferido na escala', 'Badge checked against the roster', [{ units: [wait], flags: ['schedule'] }, { units: [wait, null, yes], flags: ['schedule'] }, { units: [yes, null, yes], flags: ['schedule'] }]),
  "security/authorization": d('security', 'Preparar sim, mudar preço não', 'Cook yes, change prices no', [{ units: [yes] }, { units: [yes, null, tag(txt('preços', 'prices'), no)] }, { units: [yes, null, tag('#42', yes)] }]),
  "security/cryptography": d('security', 'Lacre e chave guardados à parte', 'Seal and key kept apart', [{ flags: ['seal'], units: [null, tag(txt('trancado', 'locked'))] }, { flags: ['seal'], units: [null, null, yes] }, { flags: ['logbook'] }]),
  "security/tokens": d('security', 'Crachá válido até 18:00', 'Badge valid until 18:00', [{ units: [tag('18:00')] }, { units: [tag('18:00'), null, yes] }, { units: [tag('18:00', yes), null, yes] }]),
  "security/ssl-tls": d('security', 'Confira o destino, depois lacre', 'Verify the recipient, then seal', [{ units: [yes] }, { units: [yes, null, yes] }, { units: [yes, null, yes], flags: ['seal'] }]),
  "security/common-attacks": d('security', 'Um papel não é uma ordem', 'A note is not an order', [{ flags: ['intruder'] }, { flags: ['intruder'], units: [null, no] }, { flags: ['logbook'], units: [null, no] }]),
  "security/prompt-injection": d('library', 'Nota do fornecedor não dá ordens', 'Supplier notes give no orders', [{ flags: ['margin'] }, { flags: ['margin', 'guard'], units: [lit] }, { flags: ['guard'], units: [yes] }]),
  "monitoring/index": d('office', 'Registros da cozinha até o cliente', 'Records from kitchen to customer', [{ values: [.35, .55, .8, .45], flags: ['log'] }, { values: [.35, .55, .8, .45], units: [null, null, lit] }, { values: [.3, .4, .35, .25] }]),
  "monitoring/metrics": d('office', 'Chegadas, fila e faixas de espera', 'Arrivals, queue and wait bands', [{ values: [.25, .4, .55, .7] }, { values: [.75, .5, .25, .1], units: ['0–2', '2–5', '5–10', '10+'] }, { values: [.75, .5, .25, .1], units: ['A', 'B', 'C', 'D'] }]),
  "monitoring/logs": d('office', 'O mesmo número em cada registro', 'The same number in every record', [{ flags: ['log'], values: [.3, .3, .3, .3] }, { flags: ['log', 'trace'], values: [.3, .3, .3, .3] }, { flags: ['log'], values: [.3, .3, .3, .3] }]),
  "monitoring/alerts": d('office', 'Alerta só para atraso persistente', 'Alert only on persistent delay', [{ values: [.4, .82, .88, .9], units: [null, lit, lit, lit] }, { values: [.4, .82, .88, .9], flags: ['alarm'] }, { values: [.4, .35, .3, .28] }]),
  "monitoring/performance": d('office', 'Mesma carga, antes e depois', 'Same load, before and after', [{ values: [.5, .7, .85, .6] }, { values: [.5, .7, .85, .6], units: [null, null, lit] }, { values: [.45, .5, .55, .4] }]),
  "monitoring/health-checks": d('grills', 'Responder não é estar pronto', 'Responding is not being ready', [{ count: 3, flags: ['roster'], units: [yes, wait, yes] }, { count: 3, flags: ['roster'], units: [yes, no, yes] }, { count: 3, flags: ['roster'], units: [yes, tag(txt('abrindo', 'opening'), { fresh: true, mark: 'wait' }), yes] }]),
  "monitoring/llm-observability": d('office', 'Rapidez e qualidade, medidas à parte', 'Speed and quality, measured apart', [{ flags: ['log'], values: [.3, .5, .4, .2] }, { values: [.3, .5, .4, .2], units: [txt('1ª frase', '1st line'), txt('completa', 'complete'), txt('precisão', 'accuracy'), txt('custo', 'cost')] }, { flags: ['log'], values: [.3, .5, .4, .2] }]),
  "monitoring/distributed-tracing": d('office', 'Linha do tempo do pedido #42', 'Order #42 timeline', [{ flags: ['trace'], values: [.2, .2, .2, .2] }, { flags: ['trace'], values: [.3, .6, .2, .2] }, { flags: ['trace'], values: [.3, .6, .25, .2], units: [null, lit] }]),
  "monitoring/slo-sli-sla": d('office', 'Meta: 95 de 100 no prazo', 'Target: 95 of 100 on time', [{ flags: ['budget'], gauge: 1, values: [.95, .95, .95, .95] }, { flags: ['budget'], gauge: 1, values: [.95, .95, .95, .95] }, { flags: ['budget'], gauge: .2, values: [.95, .93, .9, .91] }]),
  "monitoring/chaos-engineering": d('backup', 'Exercício: pausar um posto', 'Drill: pause one station', [{ flags: ['drill'] }, { flags: ['drill'], units: [down, lit] }, { flags: ['drill'], units: [yes, yes] }]),
  "monitoring/disaster-recovery": d('backup', 'Cópia datada longe do original', 'A dated copy away from the original', [{ flags: ['copy'] }, { flags: ['copy'], units: [down, tag('12:00', lit)] }, { flags: ['copy'], units: [down, tag('12:00', yes)] }]),
  "monitoring/multi-region": d('network', 'Uma filial perto do cliente', 'A branch near the customer', [{ units: ['v2', 'v2', tag('v2', lit), 'v2'] }, { units: ['v2', 'v1', 'v1', 'v1'] }, { units: ['v2', 'v2', down, 'v2'] }]),
  "ai-systems/index": d('library', 'Orientar com o livro aprovado', 'Advise from the approved book', [{ count: 1 }, { count: 1, units: [lit] }, { count: 1, flags: ['guard'] }]),
  "ai-systems/llm-serving-fundamentals": d('library', 'Ler o contexto, depois escrever', 'Read context, then write', [{ count: 1, flags: ['notes'] }, { count: 1, flags: ['notes', 'stream'] }, { count: 1, flags: ['notes'], units: [wait] }]),
  "ai-systems/rag": d('library', 'Resposta com página citada', 'An answer with a cited page', [{ count: 1 }, { count: 1, flags: ['notes'] }, { count: 1, flags: ['notes', 'stream'] }]),
  "ai-systems/vector-search": d('library', 'Receitas parecidas, não iguais', 'Similar recipes, not identical', [{ count: 1, flags: ['catalog'] }, { count: 1, flags: ['catalog'] }, { count: 1, flags: ['catalog', 'guard'] }]),
  "ai-systems/llm-gateway": d('library', 'Um coordenador com limites', 'A coordinator with limits', [{ count: 3 }, { count: 3, units: [null, lit, down] }, { count: 3 }]),
  "ai-systems/gpu-autoscaling": d('library', 'Abrir outra mesa leva tempo', 'Opening another desk takes time', [{ count: 1, units: [wait] }, { count: 2, units: [wait, fresh] }, { count: 2, units: [null, tag(txt('fechando', 'closing'), wait)] }]),
  "ai-systems/agentic-systems": d('library', 'Propor não é executar', 'Proposing is not executing', [{ count: 1 }, { count: 1, flags: ['guard'] }, { count: 1, flags: ['guard'], units: [yes] }]),
  "data-storage/index": d('pantry', 'Cada registro no seu arquivo', 'Every record in its own file', [{ units: [txt('comandas', 'tickets'), txt('receitas', 'recipes'), txt('histórico', 'history')] }, { units: [tag(txt('comandas', 'tickets'), lit), txt('receitas', 'recipes'), txt('histórico', 'history')] }, { units: [txt('comandas', 'tickets'), txt('receitas', 'recipes'), txt('histórico', 'history')], flags: ['boxes'] }]),
  "data-storage/consistent-hashing": d('pantry', 'Anel de fichas numeradas', 'A ring of numbered cards', [{ flags: ['ring'], count: 2 }, { flags: ['ring'], count: 2, units: [null, lit] }, { flags: ['ring'], count: 3, units: [null, null, fresh] }]),
  "data-storage/sharding-partitioning": d('pantry', 'Um livro por unidade', 'One book per unit', [{ units: ['U1', 'U2', 'U3'] }, { units: ['U1', tag('U2', lit), 'U3'] }, { units: ['U1', 'U2', tag('U3', fresh)] }]),
  "data-storage/object-storage": d('pantry', 'Pacote completo com etiqueta', 'A complete labeled package', [{ flags: ['boxes'] }, { flags: ['boxes'], units: [null, tag('v2', lit)] }, { flags: ['boxes'], units: ['v1', 'v2'] }]),
  "data-storage/distributed-file-systems": d('pantry', 'Catálogo de seções e cópias', 'A catalog of sections and copies', [{ units: ['§1', '§2', '§3'] }, { units: [tag('§1', lit), tag('§2', lit), '§3'] }, { units: ['§1', tag('§2', down), '§3'] }]),
  "data-storage/search-inverted-index": d('pantry', 'Palavra → receitas', 'Word → recipes', [{ flags: ['catalog'] }, { flags: ['catalog'], units: [tag(txt('grelhado', 'grilled'))] }, { flags: ['catalog'], units: [tag(txt('grelhado', 'grilled'), yes)] }]),
  "real-cases/index": d('line', 'Promessas diferentes, regras diferentes', 'Different promises, different rules', [{ units: ['v2'] }, { units: [tag(txt('pode atrasar', 'may lag')), null, tag(txt('nunca 2x', 'never twice'))] }, { units: [null, lit] }]),
  "real-cases/youtube": d('network', 'Original guardado, cópias no bairro', 'Original kept, copies nearby', [{ units: [tag('v2', yes), off, off, off] }, { units: [tag('v2', wait), off, off, off] }, { units: ['v2', 'v2', 'v2', 'v2'] }]),
  "real-cases/spotify": d('cache', 'Catálogo estável, cópia próxima', 'Stable catalog, nearby copy', [{ units: [tag('#7'), down] }, { units: [tag('v2', lit), down], flags: ['readers'] }, { units: ['v2', down] }]),
  "real-cases/whatsapp": d('rail', 'Nota guardada até a entrega', 'A note held until delivered', [{ count: 1, units: [off], flags: ['diary'] }, { count: 1, units: [lit], flags: ['diary'] }, { count: 1, flags: ['diary'] }]),
  "real-cases/bitly": d('cache', 'Código curto 7 → registro', 'Short code 7 → record', [{ units: ['#7', down] }, { units: ['#7', tag('#7', lit)], flags: ['readers'] }, { units: ['#7', '#7'] }]),
  "real-cases/netflix": d('network', 'Fichas prontas antes do turno', 'Cards ready before the shift', [{ units: [tag('v2', yes), off, 'v1', off] }, { units: ['v2', off, tag('v2', lit), off] }, { units: ['v2', off, 'v2', off] }]),
  "real-cases/uber": d('delivery', 'Entregador próximo e disponível', 'A nearby, available courier', [{ flags: ['map'], units: ['12:30', '12:10', '12:30'] }, { flags: ['map'], units: [yes, no, yes] }, { flags: ['map'], units: [tag('#42', lit), null, null] }]),
  "real-cases/chatgpt": d('library', 'Resposta aos poucos, ação verificada', 'A gradual answer, a verified action', [{ count: 1, flags: ['notes'] }, { count: 1, flags: ['stream'] }, { count: 1, flags: ['guard'] }]),
  "real-cases/perplexity": d('library', 'Cada frase com sua fonte', 'Every claim with its source', [{ count: 1, flags: ['notes'] }, { count: 1, flags: ['notes', 'stream'] }, { count: 1, flags: ['notes'], units: [wait] }]),
  "real-cases/github-copilot": d('library', 'Sugestão revisada antes de usar', 'A suggestion reviewed before use', [{ count: 1, flags: ['notes'] }, { count: 1, flags: ['stream'] }, { count: 1, units: [wait] }]),
  "data-storage/storage-engines": d('pantry', 'Páginas ordenadas × lotes mesclados', 'Sorted pages vs merged batches', [{ flags: ['pages'] }, { flags: ['batches'] }, { flags: ['pages', 'batches'] }]),
  "data-storage/bloom-filters": d('pantry', 'Casa vazia: nem procure', 'Empty box: skip the search', [{ flags: ['bits'], values: [1, 3, 6] }, { flags: ['bits'], values: [1, 3, 6] }, { flags: ['bits'], values: [1, 3, 6], units: [lit] }]),
  "data-storage/replication-quorums": d('network', 'Gravar em 2, ler 2 de 3', 'Write to 2, read 2 of 3', [{ units: ['v2', tag('v2', wait), tag('v2', wait), tag('v1', wait)] }, { units: ['v2', tag('v2', yes), tag('v2', yes), 'v1'] }, { units: ['v2', tag('v2', lit), 'v2', 'v1'] }]),
  "data-storage/change-data-capture": d('pantry', 'Alterações numeradas, em ordem', 'Numbered changes, in order', [{ flags: ['pages'], units: [tag('#42', yes)] }, { flags: ['pages'], units: [tag(txt('última: 42', 'last: 42'))] }, { flags: ['pages'], units: [tag(txt('última: 42', 'last: 42'))] }]),
  "data-storage/oltp-olap": d('pantry', 'Caixa ágil, histórico à parte', 'A fast register, separate history', [{ units: [tag('#42', yes)] }, { flags: ['boxes'] }, { flags: ['boxes'], units: [null, null, lit] }]),
  "data-storage/time-series-databases": d('pantry', 'Amostras por horário', 'Samples by time', [{ units: ['12:00', '12:30', '13:00'] }, { flags: ['boxes'], units: ['12:00', tag('12:30', lit), '13:00'] }, { flags: ['boxes'], units: [txt('resumo', 'summary'), '12:30', '13:00'] }]),
  "components/api-styles": d('line', 'Consulta, contrato e campos', 'Lookup, contract and fields', [{ units: [tag('#42')] }, { units: [null, tag('#42')], flags: ['form'] }, { units: [null, tag(txt('2 campos', '2 fields'))] }]),
  "components/realtime-push": d('line', 'Avisar sem esperar pergunta', 'Notify without being asked', [{ flags: ['buzzer'] }, { flags: ['buzzer', 'bell'], units: [null, tag('#42', yes)] }, { flags: ['buzzer'], units: [null, null, wait] }]),
  "components/dead-letter-queue": d('rail', 'Bandeja de exceções', 'The exceptions tray', [{ count: 2, units: [tag('#42', no)] }, { count: 2, flags: ['exceptions'] }, { count: 2, flags: ['exceptions'], units: [tag('#42', yes)] }]),
  "components/stream-processing": d('rail', 'Janelas de cinco minutos', 'Five-minute windows', [{ flags: ['trays'] }, { flags: ['trays'] }, { flags: ['trays'] }]),
  "consistency-strategies/crdts": d('network', 'Cada filial na sua coluna', 'Each branch owns its column', [{ units: [null, '[3,0]', '[0,4]', off] }, { units: [tag('[3,4]', yes), '[3,0]', '[0,4]', off] }, { units: [tag('7'), '[3,0]', '[0,4]', off] }]),
  "consistency-strategies/gossip": d('network', 'Cada colega conta a outro', 'Each peer tells another', [{ units: ['v2', 'v1', tag('v2', lit), 'v1'] }, { units: ['v2', 'v2', 'v2', 'v1'] }, { units: ['v2', 'v2', 'v2', tag('v2', yes)] }]),
  "consistency-strategies/distributed-locks": d('vault', 'Vale a chave 19, não a 18', 'Key 19 is current, not 18', [{ flags: ['hooks'], units: ['18', off] }, { flags: ['hooks'], units: [tag('18', wait), '19'] }, { units: [tag('18', no), tag('19', yes)] }]),
  "design-principles/event-sourcing": d('rail', 'O diário só cresce', 'The diary only grows', [{ flags: ['diary'] }, { flags: ['diary'] }, { flags: ['diary'] }]),
  "design-principles/outbox": d('rail', 'Pedido e canhoto no mesmo lançamento', 'Order and stub in one entry', [{ flags: ['stub'] }, { flags: ['stub'], units: [lit] }, { flags: ['stub'], units: [tag('#42', yes)] }]),
  "design-principles/bulkhead": d('host', 'Um caixa reservado para pedidos comuns', 'A register reserved for regular orders', [{ units: [wait, wait, wait] }, { units: [tag(txt('reservado', 'reserved'), lit), wait, wait] }, { units: [tag(txt('reservado', 'reserved'), yes), wait, wait] }]),
  "design-principles/blue-green": d('backup', 'Só comandas novas mudam', 'Only new tickets switch', [{ units: [tag('v1', lit), 'v2'] }, { units: ['v1', tag('v2', yes)] }, { units: [tag('#42'), tag('#43', lit)] }]),
  "design-principles/feature-flags": d('line', 'Adicional pronto, oferta desligada', 'Topping ready, offer off', [{ flags: ['toggle'], gauge: 0, units: [null, 'v2'] }, { flags: ['toggle'], gauge: 1, units: [tag('A', lit), 'v2'] }, { flags: ['toggle'], gauge: 0, units: [null, 'v2'] }]),
};

export function getLessonDiorama(slug: string): LessonDiorama | undefined {
  return Object.prototype.hasOwnProperty.call(lessonDioramas, slug) ? lessonDioramas[slug] : undefined;
}

export function normalizeUnit(spec: UnitSpec | undefined): DioramaUnit {
  if (spec === null || spec === undefined) return {};
  if (typeof spec === 'string' || 'pt' in spec) return { tag: spec };
  return spec;
}

export function localize(value: string | LocalizedText | undefined, locale: 'pt' | 'en') {
  if (value === undefined) return '';
  return typeof value === 'string' ? value : value[locale];
}
