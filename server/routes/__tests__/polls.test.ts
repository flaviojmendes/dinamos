import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

const mockDb = createDbMock();
const repo = { getUserContext: vi.fn() };
vi.mock('../../db/client', () => ({ db: mockDb.db }));
vi.mock('../../db/repo', () => repo);
vi.mock('../../lib/firebaseAdmin', () => ({
  verifyIdToken: vi.fn(async () => ({ uid: 'u1', email: 'u1@example.com' })),
}));
vi.mock('../../lib/rateLimitStore.js', () => ({
  incrementRateLimitBucket: vi.fn(async () => ({ allowed: true, count: 1 })),
  resetMemoryRateLimitBuckets: vi.fn(),
}));

let app: Hono;
beforeAll(async () => {
  app = (await import('../../app')).default as unknown as Hono;
});

const AUTH = { Authorization: 'Bearer t', 'Content-Type': 'application/json' };
const poll = { id: 5, topicId: 1, question: 'Q', allowMultiple: false, isClosed: false, endsAt: null };
const options = [
  { id: 11, pollId: 5, text: 'A', order: 0, voteCount: 0 },
  { id: 12, pollId: 5, text: 'B', order: 1, voteCount: 0 },
];

beforeEach(() => {
  mockDb.reset();
  repo.getUserContext.mockReset();
  repo.getUserContext.mockResolvedValue({ user: {}, role: null, permissionCodes: [] });
});

describe('polls routes', () => {
  it('401 without token', async () => {
    expect((await app.request('/api/forum/topics/1/poll')).status).toBe(401);
  });

  it('POST creates a poll for the topic owner', async () => {
    mockDb.setResults([
      [{ id: 1, userId: 'u1' }], // topic
      [], // existing poll
      [poll], // inserted poll
      undefined, // insert options
      [poll], // load poll
      options, // load options
      [], // user votes
    ]);
    const res = await app.request('/api/forum/topics/1/poll', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ question: 'Q', options: ['A', 'B'] }),
    });
    expect(res.status).toBe(201);
  });

  it('POST 404 when topic missing', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/forum/topics/1/poll', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ question: 'Q', options: ['A', 'B'] }),
    });
    expect(res.status).toBe(404);
  });

  it('POST 403 when not the owner', async () => {
    mockDb.setResults([[{ id: 1, userId: 'other' }]]);
    const res = await app.request('/api/forum/topics/1/poll', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ question: 'Q', options: ['A', 'B'] }),
    });
    expect(res.status).toBe(403);
  });

  it('POST 400 with too few options', async () => {
    mockDb.setResults([[{ id: 1, userId: 'u1' }]]);
    const res = await app.request('/api/forum/topics/1/poll', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ question: 'Q', options: ['A'] }),
    });
    expect(res.status).toBe(400);
  });

  it('POST 400 when topic already has a poll', async () => {
    mockDb.setResults([[{ id: 1, userId: 'u1' }], [poll]]);
    const res = await app.request('/api/forum/topics/1/poll', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ question: 'Q', options: ['A', 'B'] }),
    });
    expect(res.status).toBe(400);
  });

  it('GET returns null when topic has no poll', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/forum/topics/1/poll', { headers: AUTH });
    expect(await res.json() as any).toBeNull();
  });

  it('GET returns the poll when present', async () => {
    mockDb.setResults([[poll], [poll], options, []]);
    const res = await app.request('/api/forum/topics/1/poll', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.id).toBe(5);
  });

  it('POST vote records a single vote', async () => {
    mockDb.setResults([
      [poll], // loadPoll pollRows
      options, // loadPoll options
      [options[0]], // valid options
      [], // current votes (transaction)
      undefined, // insert vote
      undefined, // atomic increment
      [poll], // reload pollRows
      options, // reload options
    ]);
    const res = await app.request('/api/forum/polls/5/vote', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ option_ids: [11] }),
    });
    expect(res.status).toBe(200);
  });

  it('POST vote 400 when poll missing', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/forum/polls/5/vote', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ option_ids: [11] }),
    });
    expect(res.status).toBe(400);
  });

  it('POST vote 400 when poll is closed', async () => {
    mockDb.setResults([[{ ...poll, isClosed: true }], options]);
    const res = await app.request('/api/forum/polls/5/vote', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ option_ids: [11] }),
    });
    expect(res.status).toBe(400);
  });

  it('POST vote 400 when selecting multiple in a single-choice poll', async () => {
    mockDb.setResults([[poll], options]);
    const res = await app.request('/api/forum/polls/5/vote', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ option_ids: [11, 12] }),
    });
    expect(res.status).toBe(400);
  });

  it('PUT close 404 when poll missing', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/forum/polls/5/close', { method: 'PUT', headers: AUTH });
    expect(res.status).toBe(404);
  });

  it('PUT close succeeds for the topic owner', async () => {
    mockDb.setResults([
      [poll], // poll lookup
      [{ id: 1, userId: 'u1' }], // canManagePoll topic
      undefined, // update isClosed
      [poll], // load poll
      options, // load options
      [], // user votes
    ]);
    const res = await app.request('/api/forum/polls/5/close', { method: 'PUT', headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('DELETE 403 when not authorized', async () => {
    mockDb.setResults([
      [poll], // poll lookup
      [{ id: 1, userId: 'other' }], // canManagePoll topic (not owner)
    ]);
    repo.getUserContext.mockResolvedValue({ user: {}, role: null, permissionCodes: [] });
    const res = await app.request('/api/forum/polls/5', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(403);
  });

  it('DELETE succeeds with delete_any_topic permission', async () => {
    mockDb.setResults([
      [poll], // poll lookup
      [{ id: 1, userId: 'other' }], // topic (not owner)
      undefined, // delete
    ]);
    repo.getUserContext.mockResolvedValue({ user: {}, role: null, permissionCodes: ['delete_any_topic'] });
    const res = await app.request('/api/forum/polls/5', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(200);
  });
});
