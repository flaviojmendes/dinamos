import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { createDbMock } from '../../__tests__/_helpers/dbMock';
import type { Hono } from 'hono';

const mockDb = createDbMock();
const repo = {
  awardTokens: vi.fn(async () => 0),
  getUserBatchAuthors: vi.fn(async () => new Map()),
  getUserContext: vi.fn(),
  getUserRow: vi.fn(),
};
const email = {
  sendForumReplyNotification: vi.fn(async () => undefined),
  sendMessageReplyNotification: vi.fn(async () => undefined),
};
vi.mock('../../db/client', () => ({ db: mockDb.db }));
vi.mock('../../db/repo', () => repo);
vi.mock('../../lib/email', () => email);
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
const ctx = {
  user: { id: 'u1', nickname: 'Uno', avatarImage: null, role: 'Estudante' },
  role: { color: '#abc' },
  permissionCodes: [],
};

beforeEach(() => {
  mockDb.reset();
  repo.awardTokens.mockReset().mockResolvedValue(0);
  repo.getUserBatchAuthors.mockReset().mockResolvedValue(
    new Map([['u1', { user: { nickname: 'Uno', avatarImage: null, role: 'Estudante' }, role: { color: '#abc' } }]])
  );
  repo.getUserContext.mockReset().mockResolvedValue(ctx);
  repo.getUserRow.mockReset().mockImplementation(async (id: string) => ({
    id,
    nickname: 'N' + id,
    avatarImage: null,
    role: 'Estudante',
    email: `${id}@x.com`,
  }));
});

describe('forum routes', () => {
  it('401 without token', async () => {
    expect((await app.request('/api/forum/categories')).status).toBe(401);
  });

  it('GET categories', async () => {
    mockDb.setResults([[{ id: 1, name: 'General', color: '#fff', description: 'd', order: 1 }]]);
    const res = await app.request('/api/forum/categories', { headers: AUTH });
    expect((await res.json() as any).categories).toHaveLength(1);
  });

  it('GET topics (recent) with comment counts', async () => {
    mockDb.setResults([
      [{ id: 1, title: 'T', content: 'c', userId: 'u1', category: 'General', upvotes: 0, createdAt: new Date(), updatedAt: new Date() }],
      [{ topicId: 1, count: 3 }],
    ]);
    const res = await app.request('/api/forum/topics', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.topics[0].comment_count).toBe(3);
  });

  it('GET topics with top sort and category filter', async () => {
    mockDb.setResults([[], ]);
    const res = await app.request('/api/forum/topics?sort=top&category=General', { headers: AUTH });
    expect((await res.json() as any).topics).toEqual([]);
  });

  it('GET topics with active sort', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/forum/topics?sort=active', { headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('POST topic 400 invalid category', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/forum/topics', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ title: 'T', content: 'c', category: 'Nope' }),
    });
    expect(res.status).toBe(400);
  });

  it('POST topic creates and awards tokens', async () => {
    mockDb.setResults([
      [{ id: 1, name: 'General' }], // category
      [{ id: 5, title: 'T', content: 'c', userId: 'u1', category: 'General', createdAt: new Date(), updatedAt: new Date() }], // inserted
    ]);
    const res = await app.request('/api/forum/topics', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ title: 'T', content: 'c', category: 'General' }),
    });
    expect(res.status).toBe(201);
    expect(repo.awardTokens).toHaveBeenCalled();
  });

  it('GET topic + messages with pagination metadata', async () => {
    mockDb.setResults([
      [{ id: 1, title: 'T', content: 'c', userId: 'u1', category: 'General', upvotes: 0, createdAt: new Date(), updatedAt: new Date() }],
      [{ count: 1 }],
      [{ id: 10, topicId: 1, parentId: null, userId: 'u1', content: 'hi', upvotes: 0, createdAt: new Date(), updatedAt: new Date() }],
    ]);
    const res = await app.request('/api/forum/topics/1?sort_messages=top', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.messages).toHaveLength(1);
    expect(body.msg_total).toBe(1);
    expect(body.msg_limit).toBe(100);
  });

  it('GET topic 404', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/forum/topics/1', { headers: AUTH });
    expect(res.status).toBe(404);
  });

  it('POST message (simple reply on own topic)', async () => {
    mockDb.setResults([
      [{ id: 1, title: 'T', userId: 'u1', createdAt: new Date() }], // topic
      [{ id: 20, topicId: 1, parentId: null, userId: 'u1', content: 'r', upvotes: 0, createdAt: new Date(), updatedAt: new Date() }], // inserted
      undefined, // update topic
    ]);
    const res = await app.request('/api/forum/topics/1/messages', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ content: 'reply' }),
    });
    expect(res.status).toBe(201);
  });

  it('POST message 404 when topic missing', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/forum/topics/1/messages', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ content: 'reply' }),
    });
    expect(res.status).toBe(404);
  });

  it('POST message 400 when parent not found', async () => {
    mockDb.setResults([
      [{ id: 1, title: 'T', userId: 'u1', createdAt: new Date() }], // topic
      [], // parent lookup
    ]);
    const res = await app.request('/api/forum/topics/1/messages', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ content: 'reply', parent_id: 99 }),
    });
    expect(res.status).toBe(400);
  });

  it('PUT topic updates when owner', async () => {
    mockDb.setResults([
      [{ id: 1, userId: 'u1' }], // lookup
      [{ id: 1, title: 'New', content: 'c', userId: 'u1', createdAt: new Date(), updatedAt: new Date() }], // updated
    ]);
    const res = await app.request('/api/forum/topics/1', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ title: 'New' }),
    });
    expect((await res.json() as any).topic.title).toBe('New');
  });

  it('PUT topic 403 when not owner', async () => {
    mockDb.setResults([[{ id: 1, userId: 'other' }]]);
    const res = await app.request('/api/forum/topics/1', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ title: 'New' }),
    });
    expect(res.status).toBe(403);
  });

  it('PUT topic 404', async () => {
    mockDb.setResults([[]]);
    const res = await app.request('/api/forum/topics/1', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ title: 'New' }),
    });
    expect(res.status).toBe(404);
  });

  it('DELETE topic when owner (cleans up messages and votes)', async () => {
    mockDb.setResults([
      [{ id: 1, userId: 'u1' }], // lookup
      [{ id: 10 }], // message ids
      undefined, // delete messages
      undefined, // delete votes by topic
      undefined, // delete votes by message ids
      undefined, // delete topic
    ]);
    const res = await app.request('/api/forum/topics/1', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('DELETE topic 403 without permission', async () => {
    mockDb.setResults([[{ id: 1, userId: 'other' }]]);
    repo.getUserContext.mockResolvedValue({ ...ctx, permissionCodes: [] });
    const res = await app.request('/api/forum/topics/1', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(403);
  });

  it('PUT message updates when owner', async () => {
    mockDb.setResults([
      [{ id: 10, userId: 'u1' }], // lookup
      [{ id: 10, topicId: 1, parentId: null, userId: 'u1', content: 'edited', upvotes: 0, createdAt: new Date(), updatedAt: new Date() }], // updated
    ]);
    const res = await app.request('/api/forum/messages/10', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ content: 'edited', diagram: { x: 1 } }),
    });
    expect((await res.json() as any).message.content).toBe('edited');
  });

  it('PUT message 403 when not owner', async () => {
    mockDb.setResults([[{ id: 10, userId: 'other' }]]);
    const res = await app.request('/api/forum/messages/10', {
      method: 'PUT',
      headers: AUTH,
      body: JSON.stringify({ content: 'edited' }),
    });
    expect(res.status).toBe(403);
  });

  it('DELETE message when owner', async () => {
    mockDb.setResults([
      [{ id: 10, userId: 'u1' }], // lookup
      undefined, // delete votes
      undefined, // delete message
    ]);
    const res = await app.request('/api/forum/messages/10', { method: 'DELETE', headers: AUTH });
    expect(res.status).toBe(200);
  });

  it('POST vote 400 with neither id', async () => {
    const res = await app.request('/api/forum/vote', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it('POST vote adds an upvote on a topic', async () => {
    mockDb.setResults([
      [{ id: 1, userId: 'u1', upvotes: 0, createdAt: new Date() }], // target topic
      [], // existing vote
      undefined, // insert vote
      [{ upvotes: 1 }], // atomic update returning
    ]);
    const res = await app.request('/api/forum/vote', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ topic_id: 1 }),
    });
    const body = await res.json() as any;
    expect(body.has_voted).toBe(true);
    expect(body.upvotes).toBe(1);
  });

  it('POST vote removes an existing upvote', async () => {
    mockDb.setResults([
      [{ id: 1, userId: 'u1', upvotes: 5, createdAt: new Date() }], // target
      [{ id: 99 }], // existing vote
      undefined, // delete vote
      [{ upvotes: 4 }], // atomic update returning
    ]);
    const res = await app.request('/api/forum/vote', {
      method: 'POST',
      headers: AUTH,
      body: JSON.stringify({ message_id: 1 }),
    });
    const body = await res.json() as any;
    expect(body.has_voted).toBe(false);
    expect(body.upvotes).toBe(4);
  });

  it('GET user votes filters by provided ids', async () => {
    mockDb.setResults([
      [
        { topicId: 1, messageId: null, userId: 'u1' },
        { topicId: null, messageId: 2, userId: 'u1' },
      ],
    ]);
    const res = await app.request('/api/forum/user/votes?topic_ids=1,2&message_ids=2', { headers: AUTH });
    const body = await res.json() as any;
    expect(body.topics).toContain(1);
    expect(body.messages).toContain(2);
  });
});
