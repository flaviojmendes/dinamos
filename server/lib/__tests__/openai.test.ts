import { describe, it, expect, beforeEach, vi } from 'vitest';

const OpenAICtor = vi.fn().mockImplementation((opts: unknown) => ({ opts }));
vi.mock('openai', () => ({ default: OpenAICtor }));

beforeEach(() => {
  vi.resetModules();
  OpenAICtor.mockClear();
  delete process.env.USE_MOCK_FEEDBACK;
  delete process.env.OPENAI_API_KEY;
});

describe('getOpenAI', () => {
  it('returns null when no API key is set', async () => {
    const { getOpenAI } = await import('../openai');
    expect(getOpenAI()).toBeNull();
  });

  it('returns null when mock feedback is forced', async () => {
    process.env.USE_MOCK_FEEDBACK = 'true';
    process.env.OPENAI_API_KEY = 'sk-test';
    const { getOpenAI } = await import('../openai');
    expect(getOpenAI()).toBeNull();
  });

  it('constructs and caches a client when a key is present', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    const { getOpenAI } = await import('../openai');
    const first = getOpenAI();
    const second = getOpenAI();
    expect(first).not.toBeNull();
    expect(first).toBe(second);
    expect(OpenAICtor).toHaveBeenCalledTimes(1);
  });
});
