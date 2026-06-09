import { describe, it, expect, vi, beforeEach } from 'vitest';

const getIdToken = vi.fn();
const authState: { currentUser: { getIdToken: typeof getIdToken } | null } = {
  currentUser: { getIdToken },
};
vi.mock('../../config/firebase', () => ({
  get auth() {
    return authState;
  },
}));

import * as forum from '../forumService';

beforeEach(() => {
  getIdToken.mockReset().mockResolvedValue('test-token');
  authState.currentUser = { getIdToken };
  vi.stubGlobal('fetch', vi.fn());
});

function mockFetch(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => body,
  });
}

describe('getCategories', () => {
  it('returns categories with a bearer token', async () => {
    mockFetch({ categories: [{ id: 1 }] });
    const res = await forum.getCategories();
    expect(res.categories).toHaveLength(1);
    expect((fetch as any).mock.calls[0][1].headers.Authorization).toBe('Bearer test-token');
  });

  it('throws when unauthenticated', async () => {
    authState.currentUser = null;
    await expect(forum.getCategories()).rejects.toThrow(/not authenticated/i);
  });

  it('throws on non-ok', async () => {
    mockFetch({}, { ok: false, status: 500 });
    await expect(forum.getCategories()).rejects.toThrow(/500/);
  });
});

describe('getTopics', () => {
  it('builds the query string from params', async () => {
    mockFetch({ topics: [] });
    await forum.getTopics({ category: 'General', sort: 'popular', skip: 0, limit: 10 });
    const url = (fetch as any).mock.calls[0][0];
    expect(url).toContain('category=General');
    expect(url).toContain('sort=popular');
    expect(url).toContain('limit=10');
  });

  it('works with no params', async () => {
    mockFetch({ topics: [] });
    await forum.getTopics();
    expect((fetch as any).mock.calls[0][0]).toContain('/api/forum/topics');
  });
});

describe('getTopic', () => {
  it('fetches a topic with sort_messages', async () => {
    mockFetch({ topic: {}, messages: [] });
    await forum.getTopic(5, 'top');
    expect((fetch as any).mock.calls[0][0]).toContain('sort_messages=top');
  });
  it('maps 404 to not found', async () => {
    mockFetch({}, { ok: false, status: 404 });
    await expect(forum.getTopic(5)).rejects.toThrow(/not found/i);
  });
  it('throws on other errors', async () => {
    mockFetch({}, { ok: false, status: 500 });
    await expect(forum.getTopic(5)).rejects.toThrow(/500/);
  });
});

describe('createTopic', () => {
  it('posts a topic', async () => {
    mockFetch({ id: 1 });
    await forum.createTopic({ title: 'T', content: 'c', category: 'General' });
    expect((fetch as any).mock.calls[0][1].method).toBe('POST');
  });
  it('maps 400 to invalid category', async () => {
    mockFetch({}, { ok: false, status: 400 });
    await expect(forum.createTopic({ title: 'T', content: 'c', category: 'x' })).rejects.toThrow(/invalid category/i);
  });
  it('throws on other errors', async () => {
    mockFetch({}, { ok: false, status: 500 });
    await expect(forum.createTopic({ title: 'T', content: 'c', category: 'x' })).rejects.toThrow(/500/);
  });
});

describe('createMessage', () => {
  it('posts a reply', async () => {
    mockFetch({ id: 2 });
    await forum.createMessage(1, { content: 'hi', parent_id: 3 });
    expect((fetch as any).mock.calls[0][0]).toContain('/api/forum/topics/1/messages');
  });
  it('maps 404', async () => {
    mockFetch({}, { ok: false, status: 404 });
    await expect(forum.createMessage(1, { content: 'x' })).rejects.toThrow(/not found/i);
  });
  it('maps 400 with detail', async () => {
    mockFetch({ detail: 'too deep' }, { ok: false, status: 400 });
    await expect(forum.createMessage(1, { content: 'x' })).rejects.toThrow(/too deep/);
  });
  it('throws on other errors', async () => {
    mockFetch({}, { ok: false, status: 500 });
    await expect(forum.createMessage(1, { content: 'x' })).rejects.toThrow(/500/);
  });
});

describe('deleteTopic & deleteMessage', () => {
  it('deletes a topic', async () => {
    mockFetch({});
    await forum.deleteTopic(1);
    expect((fetch as any).mock.calls[0][1].method).toBe('DELETE');
  });
  it('deleteTopic maps 404 and 403', async () => {
    mockFetch({}, { ok: false, status: 404 });
    await expect(forum.deleteTopic(1)).rejects.toThrow(/not found/i);
    mockFetch({}, { ok: false, status: 403 });
    await expect(forum.deleteTopic(1)).rejects.toThrow(/not authorized/i);
  });
  it('deleteTopic throws on other errors', async () => {
    mockFetch({}, { ok: false, status: 500 });
    await expect(forum.deleteTopic(1)).rejects.toThrow(/500/);
  });
  it('deletes a message and maps errors', async () => {
    mockFetch({});
    await forum.deleteMessage(2);
    mockFetch({}, { ok: false, status: 404 });
    await expect(forum.deleteMessage(2)).rejects.toThrow(/not found/i);
    mockFetch({}, { ok: false, status: 403 });
    await expect(forum.deleteMessage(2)).rejects.toThrow(/not authorized/i);
    mockFetch({}, { ok: false, status: 500 });
    await expect(forum.deleteMessage(2)).rejects.toThrow(/500/);
  });
});

describe('vote & getUserVotes', () => {
  it('votes on a topic', async () => {
    mockFetch({ voted: true, upvotes: 1 });
    const res = await forum.vote({ topic_id: 1 });
    expect(res.upvotes).toBe(1);
  });
  it('vote maps 400', async () => {
    mockFetch({}, { ok: false, status: 400 });
    await expect(forum.vote({})).rejects.toThrow(/required/i);
  });
  it('vote throws on other errors', async () => {
    mockFetch({}, { ok: false, status: 500 });
    await expect(forum.vote({ topic_id: 1 })).rejects.toThrow(/500/);
  });
  it('getUserVotes builds the query', async () => {
    mockFetch({ topic_votes: [1], message_votes: [2] });
    await forum.getUserVotes({ topic_ids: [1, 2], message_ids: [2] });
    const url = (fetch as any).mock.calls[0][0];
    expect(url).toContain('topic_ids=1%2C2');
    expect(url).toContain('message_ids=2');
  });
  it('getUserVotes throws on non-ok', async () => {
    mockFetch({}, { ok: false, status: 500 });
    await expect(forum.getUserVotes()).rejects.toThrow(/500/);
  });
});
