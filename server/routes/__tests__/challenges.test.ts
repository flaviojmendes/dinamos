import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

const mockDb = createDbMock();
const openai = { getOpenAI: vi.fn(() => null) };
vi.mock('../../db/client', () => ({ db: mockDb.db }));
vi.mock('../../lib/openai', () => openai);
vi.mock('../../lib/firebaseAdmin', () => ({
  verifyIdToken: vi.fn(async () => ({ uid: 'u1', email: 'u1@example.com' })),
}));

let app: Hono;
beforeAll(async () => {
  app = (await import('../../app')).default as unknown as Hono;
});

const AUTH = { Authorization: 'Bearer t', 'Content-Type': 'application/json' };
const challenge = {
  id: 'c1',
  title: 'Design X',
  subtitle: 's',
  description: 'd',
  difficulty: 'easy',
  category: 'cat',
  order: 1,
  evaluationPrompt: 'p',
  initialRequirements: 'r',
  videoSolutionUrl: null,
  videoSolutionReleaseDate: null,
};

beforeEach(() => {
  mockDb.reset();
  openai.getOpenAI.mockReturnValue(null);
});

describe('challenges routes', () => {
  it('401 without token', async () => {
    expect((await app.request('/api/challenges')).status).toBe(401);
  });

  it('GET /api/challenges lists with attempt counts', async () => {
    mockDb.setResults([
      [challenge], // challenges
      [{ challengeId: 'c1', count: 2 }], // counts
    ]);
    const res = await app.request('/api/challenges', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.challenges[0].attempts_count).toBe(2);
  });

  it('GET /api/challenges/:id returns one', async () => {
    mockDb.setResults([[challenge]]);
    const res = await app.request('/api/challenges/c1', { headers: AUTH });
    expect((await res.json() as any).id).toBe('c1');
  });

  it('GET /api/challenges/:id 404', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/challenges/c1', { headers: AUTH });
    expect(res.status).toBe(404);
  });

  it('POST /api/transcribe-audio returns mock without OpenAI', async () => {
    const res = await app.request('/api/transcribe-audio', { method: 'POST', headers: AUTH });
    const body = await res.json() as any;
    expect(body.transcription).toMatch(/mock/i);
  });

  it('POST /api/feedback 404 when challenge missing', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/feedback', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ challengeId: 'c1', textProposal: 'x', diagram: {} }),
    });
    expect(res.status).toBe(404);
  });

  it('POST /api/feedback uses the mock analyzer and saves the solution', async () => {
    mockDb.setResults([
      [challenge], // challenge lookup
      undefined, // insert solution
    ]);
    const res = await app.request('/api/feedback', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({
        challengeId: 'c1',
        textProposal: 'My proposal mentions cache and load balancer and database.',
        diagram: { nodes: [{ id: 1 }], edges: [] },
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(Array.isArray(body.strengths)).toBe(true);
    expect(Array.isArray(body.suggestions)).toBe(true);
  });

  it('POST /api/challenges/:id/progress creates a draft', async () => {
    mockDb.setResults([
      [{ id: 'c1' }], // challenge exists
      [], // no existing draft
      [{ id: 1, challengeId: 'c1', userId: 'u1', status: 'draft', createdAt: null, updatedAt: null }], // inserted
    ]);
    const res = await app.request('/api/challenges/c1/progress', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ step0: 'a', diagram: { x: 1 } }),
    });
    const body = await res.json() as any;
    expect(body.success).toBe(true);
  });

  it('POST /api/challenges/:id/progress updates existing draft', async () => {
    mockDb.setResults([
      [{ id: 'c1' }], // challenge exists
      [{ id: 7 }], // existing draft
      [{ id: 7, challengeId: 'c1', userId: 'u1', status: 'draft', createdAt: null, updatedAt: null }], // updated
    ]);
    const res = await app.request('/api/challenges/c1/progress', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ step1: 'b' }),
    });
    expect((await res.json() as any).success).toBe(true);
  });

  it('POST /api/challenges/:id/progress 404 when challenge missing', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/challenges/c1/progress', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(404);
  });

  it('GET /api/challenges/:id/progress reports an existing draft', async () => {
    mockDb.setResults([[{ id: 7, challengeId: 'c1', userId: 'u1', status: 'draft' }]]);
    const res = await app.request('/api/challenges/c1/progress', { headers: AUTH });
    expect((await res.json() as any).hasProgress).toBe(true);
  });

  it('GET /api/challenges/:id/progress reports no draft', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/challenges/c1/progress', { headers: AUTH });
    expect((await res.json() as any).hasProgress).toBe(false);
  });

  it('DELETE /api/challenges/:id/progress resets when present', async () => {
    mockDb.setResults([[{ id: 7 }]]);
    const res = await app.request('/api/challenges/c1/progress', { method: 'DELETE', headers: AUTH });
    expect((await res.json() as any).success).toBe(true);
  });

  it('DELETE /api/challenges/:id/progress reports none', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/challenges/c1/progress', { method: 'DELETE', headers: AUTH });
    expect((await res.json() as any).success).toBe(false);
  });

  it('GET /api/challenges/:id/solutions lists submitted solutions', async () => {
    mockDb.setResults([[{ id: 1, challengeId: 'c1', userId: 'u1', status: 'submitted', createdAt: null, updatedAt: null }]]);
    const res = await app.request('/api/challenges/c1/solutions', { headers: AUTH });
    expect((await res.json() as any).solutions).toHaveLength(1);
  });
});
