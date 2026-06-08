import { getOpenAI, OPENAI_MODEL } from './openai.js';

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

export function describeDiagram(diagram: Diagram): string {
  const elements = diagram?.elements ?? [];
  if (elements.length === 0) return 'Nenhum diagrama foi fornecido.';
  const shapes: string[] = [];
  const arrows: string[] = [];
  const texts: string[] = [];
  for (const el of elements) {
    const type = el?.type ?? '';
    const text = el?.text ?? '';
    if (['rectangle', 'ellipse', 'diamond'].includes(type)) {
      shapes.push(
        text
          ? `- ${type.charAt(0).toUpperCase() + type.slice(1)}: ${text}`
          : `- ${type.charAt(0).toUpperCase() + type.slice(1)} (sem rótulo)`
      );
    } else if (type === 'arrow') {
      arrows.push('- Seta/Conexão');
    } else if (type === 'text' && text) {
      texts.push(`- Texto: ${text}`);
    }
  }
  let d = `Diagrama do Excalidraw com ${elements.length} elementos:\n\n`;
  if (shapes.length) d += `Componentes/Formas (${shapes.length}):\n${shapes.join('\n')}\n\n`;
  if (arrows.length) d += `Conexões/Setas (${arrows.length}):\n${arrows.join('\n')}\n\n`;
  if (texts.length) d += `Textos adicionais (${texts.length}):\n${texts.join('\n')}\n\n`;
  if (!shapes.length && !arrows.length)
    d += 'Nota: O diagrama parece estar vazio ou contém apenas elementos de texto.';
  return d.trim();
}

function createOpenAIPrompt(
  challenge: any,
  textProposal: string,
  diagramDescription: string,
  audioTranscription?: string | null
): string {
  const audioSection = audioTranscription
    ? `\n---\n\n**EXPLICAÇÃO EM ÁUDIO DO ESTUDANTE (Transcrito):**\n\n${audioTranscription}\n\n---\n`
    : '';

  if (challenge.evaluation_prompt) {
    let prompt = `${challenge.evaluation_prompt}\n\n---\n\n**PROPOSTA DO ESTUDANTE (Texto):**\n\n${textProposal}\n\n---\n\n**DIAGRAMA DO ESTUDANTE:**\n\n${diagramDescription}\n${audioSection}`;
    prompt += `\n---\n\nForneça o feedback estruturado no formato JSON abaixo:\n\n{\n  "strengths": [\n    "✅ Pontos fortes específicos e explícitos observados na proposta ou diagrama (3–7 itens)",\n    "Elogie apenas decisões técnicas concretas descritas claramente"\n  ],\n  "suggestions": [\n    "💡 ou ⚠️ Sugestões de melhoria claras (2–5 itens)",\n    "Aponte ausências objetivas, inconsistências entre texto e diagrama, ou falta de detalhes críticos"\n  ]\n}\n\nRetorne apenas o JSON, sem qualquer texto adicional antes ou depois.`;
    return prompt;
  }
  return `Você é um especialista em System Design e está avaliando a solução de um estudante para o seguinte desafio:\n\n**DESAFIO: ${challenge.title}**\n\n${challenge.description ?? ''}\n\n---\n\n**PROPOSTA DO ESTUDANTE (Texto):**\n\n${textProposal}\n\n---\n\n**DIAGRAMA DO ESTUDANTE:**\n\n${diagramDescription}\n${audioSection}\n---\n\nAvalie a solução considerando:\n- Clareza de comunicação\n- Coerência arquitetural\n- Escalabilidade e performance\n- Completude da solução\n\nForneça o feedback estruturado no formato JSON abaixo:\n\n{\n  "strengths": [\n    "✅ Pontos fortes (3–7 itens)"\n  ],\n  "suggestions": [\n    "💡 Sugestões de melhoria (2–5 itens)"\n  ]\n}\n\nRetorne apenas o JSON, sem qualquer texto adicional antes ou depois.`;
}

export async function evaluateWithOpenAI(
  challenge: any,
  textProposal: string,
  diagram: Diagram,
  audioTranscription?: string | null
): Promise<[string[], string[]] | [null, null]> {
  const client = getOpenAI();
  if (!client) return [null, null];
  try {
    const diagramDescription = describeDiagram(diagram);
    const prompt = createOpenAIPrompt(
      challenge,
      textProposal,
      diagramDescription,
      audioTranscription
    );
    const response = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'Você é um especialista em System Design que fornece feedback construtivo e técnico para estudantes.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });
    const content = response.choices[0]?.message?.content ?? '{}';
    const data = JSON.parse(content);
    let strengths: string[] = data.strengths ?? [];
    const suggestions: string[] = data.suggestions ?? [];
    if (!strengths.length)
      strengths = ['Continue praticando! Todo design tem um ponto de partida.'];
    return [strengths, suggestions];
  } catch (e) {
    console.error('[feedback] OpenAI error:', e);
    return [null, null];
  }
}
