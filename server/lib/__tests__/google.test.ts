import { describe, it, expect, beforeEach, vi } from 'vitest';

const GoogleGenAICtor = vi.fn().mockImplementation((opts: unknown) => ({ opts }));
vi.mock('@google/genai', () => ({ GoogleGenAI: GoogleGenAICtor }));

beforeEach(() => {
  vi.resetModules();
  GoogleGenAICtor.mockClear();
  delete process.env.USE_MOCK_FEEDBACK;
  delete process.env.GEMINI_API_KEY;
  delete process.env.GOOGLE_API_KEY;
});

describe('getGoogleAI', () => {
  it('returns null when no API key is set', async () => {
    const { getGoogleAI } = await import('../google');
    expect(getGoogleAI()).toBeNull();
  });

  it('returns null when mock feedback is forced', async () => {
    process.env.USE_MOCK_FEEDBACK = 'true';
    process.env.GEMINI_API_KEY = 'g-test';
    const { getGoogleAI } = await import('../google');
    expect(getGoogleAI()).toBeNull();
  });

  it('accepts GOOGLE_API_KEY as a fallback', async () => {
    process.env.GOOGLE_API_KEY = 'g-test';
    const { getGoogleAI } = await import('../google');
    expect(getGoogleAI()).not.toBeNull();
  });

  it('constructs and caches a client when a key is present', async () => {
    process.env.GEMINI_API_KEY = 'g-test';
    const { getGoogleAI } = await import('../google');
    const first = getGoogleAI();
    const second = getGoogleAI();
    expect(first).not.toBeNull();
    expect(first).toBe(second);
    expect(GoogleGenAICtor).toHaveBeenCalledTimes(1);
  });
});

describe('geminiText', () => {
  it('reads the text getter', async () => {
    const { geminiText } = await import('../google');
    expect(geminiText({ text: 'hello' })).toBe('hello');
  });

  it('supports text as a method', async () => {
    const { geminiText } = await import('../google');
    expect(geminiText({ text: () => 'hi' })).toBe('hi');
  });

  it('falls back to candidate parts', async () => {
    const { geminiText } = await import('../google');
    const res = { candidates: [{ content: { parts: [{ text: 'a' }, { text: 'b' }] } }] };
    expect(geminiText(res)).toBe('ab');
  });
});
