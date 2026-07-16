import type { GoogleAuth } from 'google-auth-library';

// Google Cloud Speech-to-Text (dedicated ASR). We reuse the Firebase service
// account (a Firebase project is also a GCP project), so no extra credentials
// are needed — just enable the "Cloud Speech-to-Text API" in the same project.

type ServiceAccount = {
  client_email?: string;
  private_key?: string;
  project_id?: string;
  [k: string]: unknown;
};

function loadServiceAccount(): ServiceAccount | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  try {
    if (b64) return JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'));
    if (rawJson) return JSON.parse(rawJson);
  } catch (e) {
    console.error('[speech] failed to parse service account:', e);
  }
  return null;
}

export function isSpeechConfigured(): boolean {
  const sa = loadServiceAccount();
  return Boolean(sa?.client_email && sa?.private_key);
}

let auth: GoogleAuth | null = null;
let authPromise: Promise<GoogleAuth | null> | null = null;
let projectId = '';

async function getAuth(): Promise<GoogleAuth | null> {
  if (auth) return auth;
  if (!authPromise) {
    authPromise = (async () => {
      const sa = loadServiceAccount();
      if (!sa?.client_email || !sa?.private_key) return null;
      projectId = sa.project_id ?? '';
      const { GoogleAuth: GoogleAuthClient } = await import('google-auth-library');
      auth = new GoogleAuthClient({
        credentials: { client_email: sa.client_email, private_key: sa.private_key },
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
      return auth;
    })();
  }
  return authPromise;
}

// Boost recognition of system-design jargon (mostly English terms spoken inside
// Portuguese sentences). Speech adaptation only *biases* — it never invents text.
const SPEECH_PHRASES = [
  'load balancer', 'cache', 'Redis', 'Memcached', 'sharding', 'partitioning',
  'rate limiting', 'API', 'API Gateway', 'consistent hashing', 'hash', 'base62',
  'read replica', 'replicação', 'message queue', 'Kafka', 'CDN', 'proxy reverso',
  'microserviços', 'escalabilidade', 'throughput', 'latência', 'NoSQL', 'SQL',
  'banco de dados', 'cliente servidor', 'arquitetura', 'UUID', 'webhook',
];

function encodingFor(mimeType: string): { encoding: string; sampleRateHertz?: number } {
  const m = (mimeType || '').toLowerCase();
  if (m.includes('ogg')) return { encoding: 'OGG_OPUS', sampleRateHertz: 48000 };
  if (m.includes('wav') || m.includes('x-wav')) return { encoding: 'LINEAR16' };
  // Browser MediaRecorder default is WebM/Opus at 48kHz.
  return { encoding: 'WEBM_OPUS', sampleRateHertz: 48000 };
}

/**
 * Transcribe short (<= ~60s) inline audio with Cloud Speech-to-Text.
 * Returns the transcript, or null when not configured so the caller can fall back.
 */
export async function transcribeSpeech(
  base64Audio: string,
  mimeType: string
): Promise<string | null> {
  const a = await getAuth();
  if (!a) return null;

  const client = await a.getClient();
  const tokenResp = await client.getAccessToken();
  const token = typeof tokenResp === 'string' ? tokenResp : tokenResp?.token;
  if (!token) throw new Error('Could not obtain Google Cloud access token');

  const { encoding, sampleRateHertz } = encodingFor(mimeType);
  const requestBody = {
    config: {
      encoding,
      ...(sampleRateHertz ? { sampleRateHertz } : {}),
      languageCode: 'pt-BR',
      enableAutomaticPunctuation: true,
      model: 'latest_long',
      audioChannelCount: 1,
      speechContexts: [{ phrases: SPEECH_PHRASES, boost: 15 }],
    },
    audio: { content: base64Audio },
  };

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  if (projectId) headers['x-goog-user-project'] = projectId;

  const res = await fetch('https://speech.googleapis.com/v1/speech:recognize', {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(45_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Speech-to-Text ${res.status}: ${detail.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    results?: { alternatives?: { transcript?: string }[] }[];
  };
  const transcript = (data.results ?? [])
    .map((r) => r.alternatives?.[0]?.transcript ?? '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return transcript;
}
