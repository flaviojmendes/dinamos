import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
export const USE_MOCK_FEEDBACK =
  (process.env.USE_MOCK_FEEDBACK ?? 'false').toLowerCase() === 'true';

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI | null {
  if (USE_MOCK_FEEDBACK) return null;
  if (!OPENAI_API_KEY) return null;
  if (!client) {
    client = new OpenAI({ apiKey: OPENAI_API_KEY });
  }
  return client;
}
