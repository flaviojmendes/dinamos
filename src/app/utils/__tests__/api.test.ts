// @vitest-environment jsdom
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';

const reqUse = vi.fn();
const resUse = vi.fn();
const instance = {
  interceptors: {
    request: { use: reqUse },
    response: { use: resUse },
  },
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};
vi.mock('axios', () => ({ default: { create: vi.fn(() => instance) } }));

const h = vi.hoisted(() => ({
  getIdToken: vi.fn(),
  authState: { currentUser: null as { getIdToken: () => Promise<string> } | null },
}));
const getIdToken = h.getIdToken;
const authState = h.authState;
vi.mock('../../config/firebase', () => ({ auth: h.authState }));

let mod: typeof import('../api');
beforeAll(async () => {
  mod = await import('../api');
});

beforeEach(() => {
  getIdToken.mockReset().mockResolvedValue('tok');
  authState.currentUser = null;
  instance.get.mockReset();
  instance.post.mockReset();
  instance.put.mockReset();
  instance.delete.mockReset();
});

describe('apiClient helpers', () => {
  it('delegate to the axios instance', () => {
    mod.apiClient.get('/u');
    mod.apiClient.post('/u', { a: 1 });
    mod.apiClient.put('/u', { a: 1 });
    mod.apiClient.delete('/u');
    expect(instance.get).toHaveBeenCalledWith('/u', undefined);
    expect(instance.post).toHaveBeenCalled();
    expect(instance.put).toHaveBeenCalled();
    expect(instance.delete).toHaveBeenCalled();
  });
});

describe('request interceptor', () => {
  const onFulfilled = () => reqUse.mock.calls[0][0];
  const onRejected = () => reqUse.mock.calls[0][1];

  it('adds the bearer token when a user is signed in', async () => {
    authState.currentUser = { getIdToken };
    const config = { headers: {} as Record<string, string> };
    const out = await onFulfilled()(config);
    expect(out.headers.Authorization).toBe('Bearer tok');
  });

  it('continues without a token if getIdToken throws', async () => {
    authState.currentUser = { getIdToken };
    getIdToken.mockRejectedValue(new Error('nope'));
    const config = { headers: {} as Record<string, string> };
    const out = await onFulfilled()(config);
    expect(out.headers.Authorization).toBeUndefined();
  });

  it('passes the config through when no user', async () => {
    const config = { headers: {} };
    expect(await onFulfilled()(config)).toBe(config);
  });

  it('rejects on a request error', async () => {
    await expect(onRejected()(new Error('boom'))).rejects.toThrow('boom');
  });
});

describe('response interceptor', () => {
  const onFulfilled = () => resUse.mock.calls[0][0];
  const onRejected = () => resUse.mock.calls[0][1];

  it('returns the response unchanged', () => {
    const res = { data: 1 };
    expect(onFulfilled()(res)).toBe(res);
  });

  it('redirects to /login on a 401', async () => {
    const loc = { href: '' };
    Object.defineProperty(window, 'location', { value: loc, writable: true, configurable: true });
    const err = { response: { status: 401 } };
    await expect(onRejected()(err)).rejects.toBe(err);
    expect(loc.href).toContain('/login');
  });

  it('rejects other errors without redirecting', async () => {
    const err = { response: { status: 500 } };
    await expect(onRejected()(err)).rejects.toBe(err);
  });
});
