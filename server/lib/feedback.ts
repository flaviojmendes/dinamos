import { getGoogleAI, GOOGLE_MODEL, geminiText } from './google.js';

type Diagram = { elements?: any[]; [k: string]: any };

export function analyzeTextProposal(text: string): [string[], string[]] {
  const t = (text || '').toLowerCase();
  const strengths: string[] = [];
  const suggestions: string[] = [];

  if (t.includes('cache') || t.includes('redis') || t.includes('memcached'))
    strengths.push('✅ Ótimo! Você considerou cache para melhorar performance');
  else
    suggestions.push(
      '💡 Considere adicionar cache (Redis/Memcached) para reduzir latência nas leituras'
    );

  if (t.includes('replication') || t.includes('replicação') || t.includes('replica'))
    strengths.push('✅ Excelente! Você pensou em replicação para durabilidade dos dados');
  else suggestions.push('💡 Adicione replicação de banco de dados para garantir durabilidade');

  if (t.includes('unique id') || t.includes('uuid') || t.includes('hash') || t.includes('base62'))
    strengths.push('✅ Muito bem! Você abordou a geração de IDs únicos');
  else
    suggestions.push(
      '⚠️ Importante: Explique como você vai gerar chaves únicas para as URLs curtas'
    );

  if (t.includes('load balancer') || t.includes('balanceador'))
    strengths.push('✅ Ótimo! Load balancer ajuda na distribuição de tráfego');
  else suggestions.push('💡 Considere adicionar load balancer para distribuir o tráfego');

  if (t.includes('escala') || t.includes('scale') || t.includes('sharding') || t.includes('partition'))
    strengths.push('✅ Muito bem! Você considerou escalabilidade do sistema');
  else
    suggestions.push(
      '💡 Pense em estratégias de particionamento/sharding para escalar o banco de dados'
    );

  if (t.includes('nosql') || t.includes('cassandra') || t.includes('dynamodb') || t.includes('mongodb'))
    strengths.push('✅ Boa escolha considerar NoSQL para este tipo de sistema');
  else if (t.includes('postgres') || t.includes('mysql') || t.includes('sql'))
    strengths.push('✅ Você considerou um banco de dados para persistência');
  else suggestions.push('💡 Especifique qual tipo de banco de dados você usaria');

  if (t.includes('monitor') || t.includes('metric') || t.includes('métrica') || t.includes('analytics'))
    strengths.push('✅ Excelente! Métricas e monitoramento são essenciais');

  return [strengths, suggestions];
}

export function analyzeDiagram(diagram: Diagram): [string[], string[]] {
  const strengths: string[] = [];
  const suggestions: string[] = [];
  const elements = diagram?.elements ?? [];
  if (elements.length === 0) {
    suggestions.push('⚠️ O diagrama está vazio. Adicione componentes do sistema');
    return [strengths, suggestions];
  }
  const texts: string[] = [];
  let shapes = 0;
  let arrows = 0;
  for (const el of elements) {
    const type = el?.type ?? '';
    if (['rectangle', 'ellipse', 'diamond'].includes(type)) shapes++;
    if (type === 'arrow') arrows++;
    if (el?.text) texts.push(String(el.text).toLowerCase());
  }
  const all = texts.join(' ');
  const has = (kws: string[]) => kws.some((k) => all.includes(k));
  const hasDb = has(['database', 'db', 'banco', 'postgres', 'mysql', 'mongodb', 'cassandra']);
  const hasCache = has(['cache', 'redis', 'memcached']);
  const hasLb = has(['load', 'balancer', 'balanceador', 'lb']);
  const hasServer = has(['server', 'api', 'service', 'servidor', 'backend']);
  const hasClient = has(['client', 'user', 'browser', 'usuário', 'frontend']);

  if (hasDb) strengths.push('✅ Diagrama inclui componente de banco de dados');
  else suggestions.push('💡 Adicione um componente de banco de dados ao diagrama');
  if (hasCache) strengths.push('✅ Diagrama inclui camada de cache');
  if (hasLb) strengths.push('✅ Diagrama inclui load balancer');
  if (hasServer) strengths.push('✅ Diagrama inclui servidores/API');
  else suggestions.push('💡 Adicione servidores de aplicação ao diagrama');
  if (hasClient) strengths.push('✅ Diagrama mostra o cliente/usuário');
  if (arrows === 0)
    suggestions.push('💡 Conecte os componentes com setas para mostrar o fluxo de dados');
  else strengths.push('✅ Componentes estão conectados mostrando o fluxo');
  if (shapes >= 5) strengths.push('✅ Diagrama detalhado com múltiplos componentes');
  else if (shapes < 3)
    suggestions.push(
      '💡 Considere adicionar mais componentes ao seu design (cache, load balancer, etc)'
    );
  return [strengths, suggestions];
}

// The challenge canvas ships with a fixed template: five locked "section" frames
// (left column = written answers, right side = the high-level design area) plus
// their title labels. These ids/geometry let us strip the scaffolding so the AI
// only evaluates what the student actually drew, and so we can report which
// section each component lives in.
const SCAFFOLD_SECTIONS: { id: string; name: string; x: number; y: number; w: number; h: number }[] =
  [
    { id: 'usbb1RGX7SaQAxmSG9Eo4', name: 'Requisitos Funcionais', x: 100, y: 100, w: 753.5, h: 320.49 },
    { id: 'kS55bXRtcNp14pgZaNO6M', name: 'Requisitos Não Funcionais', x: 106, y: 432, w: 743.8, h: 343.18 },
    { id: 'g_Xz9x-jQxvvAuTPtrsCa', name: 'Entidades', x: 105, y: 796, w: 742.77, h: 314.42 },
    { id: 'DOoXdK6_BNpos0Zg8IN9z', name: 'APIs', x: 102, y: 1135, w: 742.77, h: 307.93 },
    { id: 'NNmR1YqI_ZU41pRL18ZfC', name: 'Design High-Level', x: 880, y: 102, w: 1684.02, h: 1338.21 },
  ];
const SCAFFOLD_TITLE_IDS = new Set([
  'VxetQ6aWHPIE4oGCBv4dl',
  'u_nqjD4SwnDXpZ5tYT1CV',
  '63pt1YnaO9KSjbLVLfIP1',
  'MhjCZ6TObYCOM4YssQWVt',
  'SBoAJfGlruRXf3zCKPIMA',
]);
const SCAFFOLD_IDS = new Set<string>([
  ...SCAFFOLD_SECTIONS.map((s) => s.id),
  ...SCAFFOLD_TITLE_IDS,
]);

const SHAPE_TYPES = ['rectangle', 'ellipse', 'diamond', 'image', 'frame'];
const CONNECTOR_TYPES = ['arrow', 'line'];

function typeName(type: string): string {
  switch (type) {
    case 'rectangle':
      return 'Retângulo';
    case 'ellipse':
      return 'Elipse';
    case 'diamond':
      return 'Losango';
    case 'image':
      return 'Imagem';
    case 'frame':
      return 'Frame';
    case 'arrow':
      return 'Seta';
    case 'line':
      return 'Linha';
    default:
      return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Elemento';
  }
}

function centerOf(el: any): { x: number; y: number } {
  const x = Number(el?.x ?? 0);
  const y = Number(el?.y ?? 0);
  const w = Number(el?.width ?? 0);
  const h = Number(el?.height ?? 0);
  return { x: x + w / 2, y: y + h / 2 };
}

function sectionAt(x: number, y: number): string | null {
  // Prefer the most specific (smallest) matching section so a component inside
  // a nested box isn't mislabeled by a larger overlapping frame.
  let match: { name: string; area: number } | null = null;
  for (const s of SCAFFOLD_SECTIONS) {
    if (x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h) {
      const area = s.w * s.h;
      if (!match || area < match.area) match = { name: s.name, area };
    }
  }
  return match?.name ?? null;
}

// In Excalidraw a shape's label is a separate text element pointing back via
// `containerId`. Resolve those so a labeled box reads as its label, not "sem rótulo".
function buildLabelMap(elements: any[]): Map<string, string> {
  const labels = new Map<string, string>();
  for (const el of elements) {
    if (el?.type === 'text' && el?.containerId) {
      const t = String(el.originalText ?? el.text ?? '').trim();
      if (t) labels.set(String(el.containerId), t);
    }
  }
  return labels;
}

function labelOf(el: any, labelMap: Map<string, string>): string {
  const own = String(el?.originalText ?? el?.text ?? '').trim();
  if (own) return own;
  return (labelMap.get(String(el?.id)) ?? '').trim();
}

function arrowEndpoints(el: any): { start: { x: number; y: number } | null; end: { x: number; y: number } | null } {
  const x = Number(el?.x);
  const y = Number(el?.y);
  const pts = Array.isArray(el?.points) ? el.points : null;
  if (!Number.isFinite(x) || !Number.isFinite(y) || !pts || pts.length < 1)
    return { start: null, end: null };
  const first = pts[0] ?? [0, 0];
  const last = pts[pts.length - 1] ?? [0, 0];
  return {
    start: { x: x + Number(first[0] ?? 0), y: y + Number(first[1] ?? 0) },
    end: { x: x + Number(last[0] ?? 0), y: y + Number(last[1] ?? 0) },
  };
}

function endpointName(
  boundId: string | undefined,
  fallback: { x: number; y: number } | null,
  components: any[],
  byId: Map<string, any>,
  labelMap: Map<string, string>
): string {
  if (boundId && byId.has(boundId)) {
    const el = byId.get(boundId);
    return labelOf(el, labelMap) || `${typeName(el?.type ?? '')} sem rótulo`;
  }
  // No explicit binding: snap the arrow tip to the nearest component center.
  if (fallback) {
    let best: any = null;
    let bestD = Infinity;
    for (const c of components) {
      const ctr = centerOf(c);
      const d = (ctr.x - fallback.x) ** 2 + (ctr.y - fallback.y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
    if (best && bestD <= 260 * 260)
      return labelOf(best, labelMap) || `${typeName(best?.type ?? '')} sem rótulo`;
  }
  return '?';
}

export function describeDiagram(diagram: Diagram): string {
  const elements = (diagram?.elements ?? []).filter((e: any) => e && !e.isDeleted);
  if (elements.length === 0) return 'Nenhum diagrama foi fornecido.';

  const byId = new Map<string, any>(elements.map((e: any) => [String(e?.id), e]));
  const labelMap = buildLabelMap(elements);

  const components: any[] = [];
  const connectors: any[] = [];
  const notes: { text: string; section: string | null }[] = [];

  for (const el of elements) {
    const type = el?.type ?? '';
    const id = String(el?.id ?? '');
    if (SCAFFOLD_IDS.has(id)) continue; // drop the fixed template frames + titles
    if (type === 'text') {
      if (el?.containerId) continue; // already attached to its shape as a label
      const t = String(el.originalText ?? el.text ?? '').trim();
      if (t) {
        const c = centerOf(el);
        notes.push({ text: t, section: sectionAt(c.x, c.y) });
      }
      continue;
    }
    if (SHAPE_TYPES.includes(type)) components.push(el);
    else if (CONNECTOR_TYPES.includes(type)) connectors.push(el);
  }

  // Components, grouped by the section they sit in (architecture lives in
  // "Design High-Level"; the others mostly hold the written answers).
  const compLines: string[] = [];
  for (const el of components) {
    const c = centerOf(el);
    const section = sectionAt(c.x, c.y);
    const label = labelOf(el, labelMap) || '(sem rótulo)';
    const where = section ? ` [seção: ${section}]` : '';
    compLines.push(`- ${typeName(el?.type ?? '')}: ${label}${where}`);
  }

  // Connections as real edges: A → B, resolved via bindings or spatial snapping.
  const connLines: string[] = [];
  for (const arr of connectors) {
    const sId = arr?.startBinding?.elementId as string | undefined;
    const eId = arr?.endBinding?.elementId as string | undefined;
    const { start, end } = arrowEndpoints(arr);
    const from = endpointName(sId, start, components, byId, labelMap);
    const to = endpointName(eId, end, components, byId, labelMap);
    const mark = arr?.type === 'line' ? '—' : '→';
    if (from === '?' && to === '?')
      connLines.push(`- ${typeName(arr?.type ?? '')} (origem/destino não identificados)`);
    else connLines.push(`- ${from} ${mark} ${to}`);
  }

  const noteLines = notes.map((n) => {
    const text = n.text.length > 280 ? `${n.text.slice(0, 277)}…` : n.text;
    const where = n.section ? ` [${n.section}]` : '';
    return `- ${text.replace(/\s+/g, ' ').trim()}${where}`;
  });

  let d = `Diagrama com ${components.length} componente(s) e ${connectors.length} conexão(ões) (excluindo a moldura do template).\n\n`;
  if (compLines.length)
    d += `Componentes/Formas (${compLines.length}):\n${compLines.join('\n')}\n\n`;
  if (connLines.length)
    d += `Conexões/Setas (${connLines.length}):\n${connLines.join('\n')}\n\n`;
  if (noteLines.length) d += `Textos adicionais (${noteLines.length}):\n${noteLines.join('\n')}\n\n`;
  if (!compLines.length && !connLines.length)
    d +=
      'Nota: O diagrama não contém componentes nem conexões desenhados pelo estudante (apenas a moldura do template ou textos soltos).\n\n';
  if (compLines.length && !connLines.length)
    d +=
      'Nota: Há componentes, mas nenhuma seta conectando-os — o fluxo de dados entre os componentes não foi definido.\n\n';
  return d.trim();
}

const GROUNDING_RULES = `REGRAS DE AVALIAÇÃO (siga rigorosamente):
- Avalie SOMENTE o que está realmente presente na proposta de texto e no diagrama acima. NUNCA invente componentes, conexões ou decisões que o estudante não mencionou.
- O bloco "DIAGRAMA DO ESTUDANTE" já foi convertido em uma lista fiel de componentes e conexões (setas no formato "A → B"). Trate essa topologia como a verdade: não suponha conexões que não estejam listadas, nem ignore as que estão.
- Cruze o texto com o diagrama. Aponte explicitamente quando algo é citado no texto mas não aparece no diagrama, ou aparece no diagrama mas não é explicado no texto.
- Cite os nomes reais dos componentes/itens do estudante. Evite elogios e conselhos genéricos que serviriam para qualquer solução.
- Avalie a solução contra os requisitos DESTE desafio (funcionais, não funcionais e escala), e não contra um sistema genérico.
- Se a proposta ou o diagrama estiverem vazios, triviais ou muito incompletos, diga isso de forma direta em vez de elogiar. Não force 3 pontos fortes quando não existem.
- Analise, quando aplicável: cobertura dos requisitos, coerência e correção arquitetural, sentido do fluxo de dados (as setas fazem sentido?), escalabilidade e performance, confiabilidade/disponibilidade, modelagem e armazenamento de dados, e gargalos ou pontos únicos de falha (SPOF).
- Responda em português do Brasil, de forma técnica, específica e construtiva.`;

const OUTPUT_FORMAT = `Forneça o feedback estritamente no formato JSON abaixo (e nada além do JSON):

{
  "strengths": [
    "✅ Pontos fortes concretos observados na proposta/diagrama, citando os elementos REAIS do estudante (0–7 itens; deixe vazio se realmente não houver)"
  ],
  "suggestions": [
    "💡 ou ⚠️ Melhorias específicas e acionáveis: ausências, inconsistências entre texto e diagrama, conexões faltantes, riscos de escala/disponibilidade (2–6 itens)"
  ]
}

Retorne apenas o JSON, sem qualquer texto antes ou depois.`;

function buildSubmissionBlock(
  textProposal: string,
  diagramDescription: string,
  audioTranscription?: string | null
): string {
  const audioSection = audioTranscription
    ? `\n\n---\n\n**EXPLICAÇÃO EM ÁUDIO DO ESTUDANTE (transcrição):**\n\n${audioTranscription.trim()}`
    : '';
  const text = (textProposal ?? '').trim() || '(o estudante não escreveu nenhum texto)';
  return `**PROPOSTA DO ESTUDANTE (texto):**\n\n${text}\n\n---\n\n**DIAGRAMA DO ESTUDANTE (componentes e conexões extraídos):**\n\n${diagramDescription}${audioSection}`;
}

const SYSTEM_INSTRUCTION =
  'Você é um entrevistador sênior de System Design. Dá feedback técnico, preciso e construtivo, baseado ESTRITAMENTE no que o estudante apresentou, sem inventar informações ou supor componentes/conexões inexistentes. Responde sempre em português do Brasil e exclusivamente no formato JSON solicitado.';

function createAIPrompt(
  challenge: any,
  textProposal: string,
  diagramDescription: string,
  audioTranscription?: string | null
): string {
  const submission = buildSubmissionBlock(textProposal, diagramDescription, audioTranscription);

  // Admin-authored prompt per challenge takes precedence as the evaluation rubric.
  if (challenge.evaluation_prompt) {
    return `${challenge.evaluation_prompt}\n\n---\n\n${submission}\n\n---\n\n${GROUNDING_RULES}\n\n---\n\n${OUTPUT_FORMAT}`;
  }

  const requirements = challenge.initial_requirements
    ? `\n\n**Requisitos iniciais do desafio:**\n${challenge.initial_requirements}`
    : '';
  const context =
    `Você é um entrevistador sênior, especialista em System Design, avaliando a solução de um estudante para o desafio abaixo.\n\n` +
    `**DESAFIO: ${challenge.title}**\n\n${challenge.description ?? ''}${requirements}`;

  return `${context}\n\n---\n\n${submission}\n\n---\n\n${GROUNDING_RULES}\n\n---\n\n${OUTPUT_FORMAT}`;
}

export async function evaluateWithAI(
  challenge: any,
  textProposal: string,
  diagram: Diagram,
  audioTranscription?: string | null
): Promise<[string[], string[]] | [null, null]> {
  const client = getGoogleAI();
  if (!client) return [null, null];
  try {
    const diagramDescription = describeDiagram(diagram);
    const prompt = createAIPrompt(challenge, textProposal, diagramDescription, audioTranscription);
    const response = await client.models.generateContent({
      model: GOOGLE_MODEL,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
        maxOutputTokens: 1800,
        responseMimeType: 'application/json',
        // Cap reasoning so a complex diagram can't make the request exceed the
        // serverless timeout; fall back to the mock analyzer if it still does.
        thinkingConfig: { thinkingBudget: 512 },
        abortSignal: AbortSignal.timeout(50_000),
      },
    });
    const content = geminiText(response) || '{}';
    const data = JSON.parse(content);
    let strengths: string[] = data.strengths ?? [];
    const suggestions: string[] = data.suggestions ?? [];
    if (!strengths.length)
      strengths = ['Continue praticando! Todo design tem um ponto de partida.'];
    return [strengths, suggestions];
  } catch (e) {
    console.error('[feedback] Google AI error:', e);
    return [null, null];
  }
}
