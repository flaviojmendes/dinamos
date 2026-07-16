import { getGoogleAIAsync, GOOGLE_MODEL, geminiText } from './google.js';

// Questionnaire answers collected in the Design Lab "tailored problem" modal.
export interface GenerationContext {
  roleDescription: string;
  seniority: string;
  targetCompany: string;
  difficulty: string;
}

// Shape returned to the caller: matches the columns of the `challenges` table
// (snake_case where the route inserts them).
export interface GeneratedChallenge {
  title: string;
  subtitle: string;
  description: string;
  difficulty: string;
  category: string;
  initial_requirements: string;
  evaluation_prompt: string;
}

// The app only renders three difficulty levels (see Home.getDifficultyColor).
const DIFFICULTIES = ['Fácil', 'Médio', 'Difícil'];

export function normalizeDifficulty(value: string | undefined | null): string {
  const v = (value ?? '').trim().toLowerCase();
  if (v.startsWith('fác') || v.startsWith('fac') || v === 'easy') return 'Fácil';
  if (v.startsWith('dif') || v === 'hard') return 'Difícil';
  return 'Médio';
}

function contextBlock(ctx: GenerationContext): string {
  const company = ctx.targetCompany?.trim()
    ? ctx.targetCompany.trim()
    : 'uma empresa de tecnologia de referência';
  return [
    `- Vaga/Cargo pretendido: ${ctx.roleDescription.trim()}`,
    `- Senioridade: ${ctx.seniority.trim()}`,
    `- Empresa-alvo: ${company}`,
    `- Dificuldade desejada: ${normalizeDifficulty(ctx.difficulty)}`,
  ].join('\n');
}

const SYSTEM_INSTRUCTION =
  'Você é um entrevistador sênior de System Design que cria problemas de ' +
  'projeto de sistemas distribuídos sob medida para candidatos, calibrados ' +
  'pela senioridade da vaga, pela empresa-alvo e pela dificuldade pedida. ' +
  'Responde sempre em português do Brasil e exclusivamente no formato JSON solicitado.';

function buildPrompt(ctx: GenerationContext): string {
  return `Crie UM problema de System Design (projeto de sistema distribuído) sob medida para o candidato descrito abaixo. O problema deve ser realista para uma entrevista da empresa-alvo e adequado à senioridade informada.

**PERFIL DO CANDIDATO / VAGA:**
${contextBlock(ctx)}

DIRETRIZES:
- O enunciado deve parecer uma pergunta real de entrevista de System Design (ex.: "Projete o feed de notícias do X", "Projete o sistema de matchmaking do Y").
- Calibre o escopo pela senioridade: júnior/pleno = sistema mais focado; sênior/staff = escala maior, trade-offs e requisitos não funcionais mais exigentes.
- Se a empresa-alvo for conhecida, ancore o domínio do problema no negócio dela, sem copiar exatamente um sistema existente.
- "description" deve conter o contexto e a pergunta central (2 a 4 parágrafos curtos), em português do Brasil.
- "initial_requirements" deve listar os requisitos FUNCIONAIS principais, um por linha, começando cada linha com "- ". Serão pré-preenchidos para o candidato.
- "evaluation_prompt" é a rubrica que outro avaliador de IA usará para dar feedback: descreva o que uma boa solução deve cobrir (requisitos funcionais e não funcionais, escala estimada, modelagem de dados, componentes esperados, trade-offs e gargalos), tudo específico para ESTE problema e esta senioridade/empresa.
- "category" deve ser um rótulo curto de domínio (ex.: "Redes Sociais", "Streaming", "Fintech", "Mensageria").
- "subtitle" é uma frase curta (máx. ~90 caracteres) resumindo o problema.

Responda estritamente no formato JSON abaixo (e nada além do JSON):

{
  "title": "Título curto do problema",
  "subtitle": "Resumo em uma frase",
  "description": "Contexto + pergunta central em pt-BR",
  "category": "Domínio curto",
  "initial_requirements": "- Requisito funcional 1\\n- Requisito funcional 2\\n- ...",
  "evaluation_prompt": "Rubrica de avaliação específica para este problema"
}

Retorne apenas o JSON, sem qualquer texto antes ou depois.`;
}

// Deterministic fallback used when the AI is unavailable (no key / mock mode /
// error). Keeps the feature working end-to-end without an LLM.
function mockChallenge(ctx: GenerationContext): GeneratedChallenge {
  const difficulty = normalizeDifficulty(ctx.difficulty);
  const company = ctx.targetCompany?.trim() || 'uma empresa de tecnologia';
  const role = ctx.roleDescription.trim() || 'Engenheiro(a) de Software';
  return {
    title: `Projete um sistema para ${company}`,
    subtitle: `Desafio de System Design tailored para ${ctx.seniority}`,
    description:
      `Você está em uma entrevista de System Design para a vaga de ${role} (${ctx.seniority}) ` +
      `em ${company}.\n\n` +
      `Projete um sistema distribuído escalável que atenda ao caso de uso central do produto. ` +
      `Comece pelos requisitos funcionais e não funcionais, estime a escala (usuários ativos, ` +
      `QPS de leitura/escrita, volume de dados) e então descreva a arquitetura de alto nível, ` +
      `a modelagem de dados e os principais trade-offs.\n\n` +
      `(Este é um problema gerado localmente sem IA — configure a GEMINI_API_KEY para problemas ` +
      `totalmente personalizados.)`,
    difficulty,
    category: 'Personalizado',
    initial_requirements:
      '- Defina os principais casos de uso do sistema\n' +
      '- Suporte a leitura e escrita em escala\n' +
      '- Garanta disponibilidade e baixa latência\n' +
      '- Considere consistência, cache e particionamento',
    evaluation_prompt:
      `Avalie a solução para a vaga de ${role} (${ctx.seniority}) em ${company}. ` +
      `Verifique se o candidato cobriu requisitos funcionais e não funcionais, estimativa de escala, ` +
      `modelagem de dados, componentes de arquitetura (load balancer, cache, banco de dados, filas), ` +
      `escalabilidade/particionamento, disponibilidade e identificação de gargalos/SPOFs. ` +
      `Calibre a exigência para a senioridade "${ctx.seniority}".`,
  };
}

export async function generateChallenge(
  ctx: GenerationContext
): Promise<GeneratedChallenge> {
  const client = await getGoogleAIAsync();
  if (!client) return mockChallenge(ctx);

  try {
    const response = await client.models.generateContent({
      model: GOOGLE_MODEL,
      contents: buildPrompt(ctx),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9,
        maxOutputTokens: 2000,
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingBudget: 512 },
        abortSignal: AbortSignal.timeout(50_000),
      },
    });
    const content = geminiText(response) || '{}';
    const data = JSON.parse(content);

    const title = String(data.title ?? '').trim();
    const description = String(data.description ?? '').trim();
    if (!title || !description) return mockChallenge(ctx);

    return {
      title: title.slice(0, 255),
      subtitle: String(data.subtitle ?? '').trim(),
      description,
      // Respect the difficulty the user asked for; ignore any AI drift.
      difficulty: normalizeDifficulty(ctx.difficulty),
      category: String(data.category ?? 'Personalizado').trim().slice(0, 100) || 'Personalizado',
      initial_requirements: String(data.initial_requirements ?? '').trim(),
      evaluation_prompt: String(data.evaluation_prompt ?? '').trim(),
    };
  } catch (e) {
    console.error('[challengeGen] Google AI error:', e);
    return mockChallenge(ctx);
  }
}

export { DIFFICULTIES };
