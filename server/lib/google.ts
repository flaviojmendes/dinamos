import type { GoogleGenAI } from '@google/genai';

const GOOGLE_API_KEY = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? '';
export const GOOGLE_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
export const USE_MOCK_FEEDBACK =
  (process.env.USE_MOCK_FEEDBACK ?? 'false').toLowerCase() === 'true';

let client: GoogleGenAI | null = null;
let loadPromise: Promise<GoogleGenAI | null> | null = null;

/** Lazy-load Gemini so CRUD routes do not pay the SDK cost at cold start. */
export async function getGoogleAIAsync(): Promise<GoogleGenAI | null> {
  if (USE_MOCK_FEEDBACK) return null;
  if (!GOOGLE_API_KEY) return null;
  if (client) return client;
  if (!loadPromise) {
    loadPromise = import('@google/genai').then(({ GoogleGenAI }) => {
      client = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
      return client;
    });
  }
  return loadPromise;
}

/** Returns the client only after getGoogleAIAsync has resolved once. */
export function getGoogleAI(): GoogleGenAI | null {
  if (USE_MOCK_FEEDBACK || !GOOGLE_API_KEY) return null;
  return client;
}

// `generateContent` exposes the answer as a `.text` getter, but tests and future
// SDK versions may surface it as a method or only via candidate parts. Normalize.
export function geminiText(response: any): string {
  const t = response?.text;
  if (typeof t === 'function') return String(t.call(response) ?? '');
  if (typeof t === 'string') return t;
  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p: any) => p?.text ?? '').join('');
}
