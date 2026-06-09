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

import { getChallenges, getChallenge } from '../challengesService';

beforeEach(() => {
  getIdToken.mockReset();
  authState.currentUser = { getIdToken };
  getIdToken.mockResolvedValue('test-token');
  vi.stubGlobal('fetch', vi.fn());
});

function mockFetch(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => body,
  });
}

describe('getChallenges', () => {
  it('sends the bearer token and returns parsed challenges', async () => {
    mockFetch({ challenges: [{ id: 'c1', title: 'T' }] });
    const result = await getChallenges();
    expect(result.challenges).toHaveLength(1);

    const [url, opts] = (fetch as any).mock.calls[0];
    expect(url).toContain('/api/challenges');
    expect(opts.headers.Authorization).toBe('Bearer test-token');
  });

  it('throws when the user is not authenticated', async () => {
    authState.currentUser = null;
    await expect(getChallenges()).rejects.toThrow(/not authenticated/i);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('throws on a non-ok response', async () => {
    mockFetch({}, { ok: false, status: 500 });
    await expect(getChallenges()).rejects.toThrow(/500/);
  });
});

describe('getChallenge', () => {
  it('returns a single challenge by id', async () => {
    mockFetch({ id: 'c1', title: 'One' });
    const result = await getChallenge('c1');
    expect(result.id).toBe('c1');
    expect((fetch as any).mock.calls[0][0]).toContain('/api/challenges/c1');
  });

  it('maps a 404 to a friendly "not found" error', async () => {
    mockFetch({}, { ok: false, status: 404 });
    await expect(getChallenge('missing')).rejects.toThrow(/not found/i);
  });
});
