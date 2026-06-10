import { describe, it, expect, beforeEach, vi } from 'vitest';

const initializeApp = vi.fn(() => ({ name: 'app' }));
const getApps = vi.fn(() => [] as unknown[]);
const cert = vi.fn((sa: unknown) => ({ sa }));
const verifyIdToken = vi.fn();
const getAuth = vi.fn(() => ({ verifyIdToken }));

vi.mock('firebase-admin/app', () => ({ initializeApp, getApps, cert }));
vi.mock('firebase-admin/auth', () => ({ getAuth }));

beforeEach(() => {
  vi.resetModules();
  initializeApp.mockClear();
  getApps.mockReset().mockReturnValue([]);
  cert.mockClear();
  verifyIdToken.mockReset();
  getAuth.mockClear();
  delete process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  delete process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
});

describe('getFirebaseApp', () => {
  it('returns null when no credentials are configured', async () => {
    const mod = await import('../firebaseAdmin');
    expect(mod.getFirebaseApp()).toBeNull();
  });

  it('reuses an already-initialized app', async () => {
    getApps.mockReturnValue([{ name: 'existing' }]);
    const mod = await import('../firebaseAdmin');
    expect(mod.getFirebaseApp()).toEqual({ name: 'existing' });
  });

  it('initializes from a base64 service account', async () => {
    process.env.FIREBASE_SERVICE_ACCOUNT_B64 = Buffer.from(JSON.stringify({ project_id: 'p' })).toString('base64');
    const mod = await import('../firebaseAdmin');
    expect(mod.getFirebaseApp()).not.toBeNull();
    expect(initializeApp).toHaveBeenCalledOnce();
  });

  it('initializes from a raw JSON service account', async () => {
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON = JSON.stringify({ project_id: 'p' });
    const mod = await import('../firebaseAdmin');
    expect(mod.getFirebaseApp()).not.toBeNull();
  });

  it('returns null on malformed credentials', async () => {
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON = '{not-json';
    const mod = await import('../firebaseAdmin');
    expect(mod.getFirebaseApp()).toBeNull();
  });
});

describe('verifyIdToken', () => {
  it('throws when the SDK is not initialized', async () => {
    const mod = await import('../firebaseAdmin');
    await expect(mod.verifyIdToken('token')).rejects.toThrow(/not initialized/);
  });

  it('returns a decoded user when the token is valid', async () => {
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON = JSON.stringify({ project_id: 'p' });
    verifyIdToken.mockResolvedValue({ uid: 'u1', email: 'u1@x.com', picture: 'pic', name: 'Uno' });
    const mod = await import('../firebaseAdmin');
    const decoded = await mod.verifyIdToken('token');
    expect(decoded).toEqual({ uid: 'u1', email: 'u1@x.com', picture: 'pic', name: 'Uno' });
  });

  it('falls back to a synthetic email when missing', async () => {
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON = JSON.stringify({ project_id: 'p' });
    verifyIdToken.mockResolvedValue({ uid: 'u2' });
    const mod = await import('../firebaseAdmin');
    const decoded = await mod.verifyIdToken('token');
    expect(decoded.email).toBe('u2@email.com');
  });
});
