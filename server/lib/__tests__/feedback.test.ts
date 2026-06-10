import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';

const openai = { getOpenAI: vi.fn(() => null as any), OPENAI_MODEL: 'gpt-test' };
vi.mock('../openai', () => openai);

let analyzeTextProposal: typeof import('../feedback').analyzeTextProposal;
let analyzeDiagram: typeof import('../feedback').analyzeDiagram;
let describeDiagram: typeof import('../feedback').describeDiagram;
let evaluateWithOpenAI: typeof import('../feedback').evaluateWithOpenAI;

beforeAll(async () => {
  const mod = await import('../feedback');
  analyzeTextProposal = mod.analyzeTextProposal;
  analyzeDiagram = mod.analyzeDiagram;
  describeDiagram = mod.describeDiagram;
  evaluateWithOpenAI = mod.evaluateWithOpenAI;
});

beforeEach(() => openai.getOpenAI.mockReset().mockReturnValue(null));

describe('analyzeTextProposal', () => {
  it('rewards a complete proposal', () => {
    const [strengths, suggestions] = analyzeTextProposal(
      'Using redis cache, replication, uuid, load balancer, sharding, dynamodb and monitoring metrics.'
    );
    expect(strengths.length).toBeGreaterThan(4);
    expect(suggestions.length).toBe(0);
  });

  it('suggests improvements for an empty proposal', () => {
    const [strengths, suggestions] = analyzeTextProposal('');
    expect(strengths.length).toBe(0);
    expect(suggestions.length).toBeGreaterThan(0);
  });

  it('recognizes a relational database mention', () => {
    const [strengths] = analyzeTextProposal('I will use postgres for storage');
    expect(strengths.some((s) => s.includes('banco de dados'))).toBe(true);
  });
});

describe('analyzeDiagram', () => {
  it('flags an empty diagram', () => {
    const [strengths, suggestions] = analyzeDiagram({ elements: [] });
    expect(strengths).toEqual([]);
    expect(suggestions[0]).toMatch(/vazio/);
  });

  it('rewards a rich diagram', () => {
    const elements = [
      { type: 'rectangle', text: 'API server backend' },
      { type: 'rectangle', text: 'Postgres database' },
      { type: 'ellipse', text: 'Redis cache' },
      { type: 'diamond', text: 'Load balancer' },
      { type: 'rectangle', text: 'Client browser' },
      { type: 'arrow' },
    ];
    const [strengths, suggestions] = analyzeDiagram({ elements });
    expect(strengths.length).toBeGreaterThan(4);
    expect(suggestions.length).toBe(0);
  });

  it('suggests connections and more components for a sparse diagram', () => {
    const [, suggestions] = analyzeDiagram({ elements: [{ type: 'rectangle', text: 'thing' }] });
    expect(suggestions.some((s) => s.includes('setas'))).toBe(true);
  });
});

describe('describeDiagram', () => {
  it('returns a placeholder when empty', () => {
    expect(describeDiagram({ elements: [] })).toMatch(/Nenhum/);
  });

  it('summarizes shapes, arrows and texts', () => {
    const out = describeDiagram({
      elements: [
        { type: 'rectangle', text: 'API' },
        { type: 'ellipse' },
        { type: 'arrow' },
        { type: 'text', text: 'note' },
      ],
    });
    expect(out).toMatch(/Componentes\/Formas/);
    expect(out).toMatch(/Conexões\/Setas/);
    expect(out).toMatch(/Textos adicionais/);
  });
});

describe('evaluateWithOpenAI', () => {
  it('returns [null, null] without a client', async () => {
    openai.getOpenAI.mockReturnValue(null);
    expect(await evaluateWithOpenAI({ title: 'X' }, 'p', { elements: [] })).toEqual([null, null]);
  });

  it('parses an OpenAI JSON response (with evaluation_prompt)', async () => {
    const create = vi.fn(async () => ({
      choices: [{ message: { content: JSON.stringify({ strengths: ['s1'], suggestions: ['x1'] }) } }],
    }));
    openai.getOpenAI.mockReturnValue({ chat: { completions: { create } } } as any);
    const [strengths, suggestions] = await evaluateWithOpenAI(
      { title: 'X', evaluation_prompt: 'Evaluate this', description: 'd' },
      'proposal',
      { elements: [{ type: 'rectangle', text: 'API' }] },
      'audio transcription'
    );
    expect(strengths).toEqual(['s1']);
    expect(suggestions).toEqual(['x1']);
  });

  it('defaults strengths when the response has none', async () => {
    const create = vi.fn(async () => ({
      choices: [{ message: { content: JSON.stringify({ suggestions: [] }) } }],
    }));
    openai.getOpenAI.mockReturnValue({ chat: { completions: { create } } } as any);
    const [strengths] = await evaluateWithOpenAI({ title: 'X' }, 'p', { elements: [] });
    expect(strengths?.[0]).toMatch(/praticando/);
  });

  it('returns [null, null] on an OpenAI error', async () => {
    const create = vi.fn(async () => {
      throw new Error('boom');
    });
    openai.getOpenAI.mockReturnValue({ chat: { completions: { create } } } as any);
    expect(await evaluateWithOpenAI({ title: 'X' }, 'p', { elements: [] })).toEqual([null, null]);
  });
});
