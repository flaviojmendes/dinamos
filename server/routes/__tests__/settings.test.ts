import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import type { Hono } from 'hono';
import { appSettings } from '../../db/schema.js';

type StoredRow = { key: string; value: string | null; updatedAt?: Date | null };
const persisted = new Map<string, StoredRow>();
const selected: { fields: unknown; table?: unknown; condition?: SQL; limit?: number }[] = [];
const writes: { table: unknown; values: StoredRow; target: unknown; set: Partial<StoredRow> }[] = [];
let readFailure = false;
let writeFailure = false;
const dialect = new PgDialect();

// Keep shared state separate from route instances so a second request observes
// persisted data rather than a configuration value retained by a warm process.
const mockDb = {
  select: vi.fn((fields: unknown) => {
    const query: typeof selected[number] = { fields };
    selected.push(query);
    return {
      from: (table: unknown) => {
        query.table = table;
        return {
          where: (condition: SQL) => {
            query.condition = condition;
            return {
              limit: async (limit: number) => {
                query.limit = limit;
                if (readFailure) throw new Error('Database unavailable');
                const key = dialect.sqlToQuery(condition).params[0];
                const row = persisted.get(String(key));
                return row ? [{ value: row.value }] : [];
              },
            };
          },
        };
      },
    };
  }),
  insert: vi.fn((table: unknown) => ({
    values: (values: StoredRow) => ({
      onConflictDoUpdate: async ({ target, set }: { target: unknown; set: Partial<StoredRow> }) => {
        writes.push({ table, values, target, set });
        if (writeFailure) throw new Error('Database unavailable');
        const previous = persisted.get(values.key);
        persisted.set(values.key, previous ? { ...previous, ...set } : { ...values });
      },
    }),
  })),
};
const repo = { getUserContext: vi.fn() };
const firebase = { verifyIdToken: vi.fn() };
vi.mock('../../db/client.js', () => ({ db: mockDb }));
vi.mock('../../db/repo.js', () => repo);
vi.mock('../../lib/firebaseAdmin.js', () => firebase);

let app: Hono;
const AUTH = { Authorization: 'Bearer test-token', 'Content-Type': 'application/json' };
const adminContext = { user: { role: 'Admin' }, role: { name: 'Admin' }, permissionCodes: [] };

beforeAll(async () => {
  app = (await import('../../app.js')).default as unknown as Hono;
});

beforeEach(() => {
  persisted.clear();
  selected.length = 0;
  writes.length = 0;
  readFailure = false;
  writeFailure = false;
  mockDb.select.mockClear();
  mockDb.insert.mockClear();
  repo.getUserContext.mockReset().mockResolvedValue(adminContext);
  firebase.verifyIdToken.mockReset().mockResolvedValue({ uid: 'admin', email: 'admin@example.com' });
});

async function request(path: string, init?: RequestInit) {
  const response = await app.request(path, init);
  expect(response.headers.get('cache-control')).toBe('no-store');
  return response;
}

function putBody(body: unknown, headers = AUTH) {
  return request('/api/admin/settings', { method: 'PUT', headers, body: JSON.stringify(body) });
}

describe('public app settings', () => {
  it('keeps public and admin preflight responses uncached too', async () => {
    for (const path of ['/api/settings/public', '/api/admin/settings']) {
      const response = await request(path, {
        method: 'OPTIONS',
        headers: { Origin: 'https://example.com', 'Access-Control-Request-Method': 'GET' },
      });
      expect(response.status).toBe(204);
    }
    expect(selected).toHaveLength(0);
  });

  it('defaults to enabled without a row and requires no authentication', async () => {
    const response = await request('/api/settings/public');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ dioramas_enabled: true });
    expect(firebase.verifyIdToken).not.toHaveBeenCalled();
    expect(repo.getUserContext).not.toHaveBeenCalled();
    expect(writes).toHaveLength(0);
  });

  it.each(['true', 'false'])('reads the persisted %s value on every request', async (value) => {
    persisted.set('dioramas_enabled', { key: 'dioramas_enabled', value });
    const response = await request('/api/settings/public');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ dioramas_enabled: value === 'true' });
    persisted.set('dioramas_enabled', { key: 'dioramas_enabled', value: value === 'true' ? 'false' : 'true' });
    const next = await request('/api/settings/public');
    expect(await next.json()).toEqual({ dioramas_enabled: value !== 'true' });
    expect(selected).toHaveLength(2);
  });

  it('queries only the allowlisted key and never exposes other app settings', async () => {
    persisted.set('private_config', { key: 'private_config', value: 'not-public' });
    persisted.set('dioramas_enabled', { key: 'dioramas_enabled', value: 'false' });
    const response = await request('/api/settings/public?key=private_config');
    expect(await response.json()).toEqual({ dioramas_enabled: false });
    expect(selected).toHaveLength(1);
    expect(selected[0].fields).toEqual({ value: appSettings.value });
    expect(selected[0].table).toBe(appSettings);
    expect(dialect.sqlToQuery(selected[0].condition!).params).toEqual(['dioramas_enabled']);
    expect(selected[0].limit).toBe(1);
  });

  it.each([null, '', 'TRUE', 'invalid'])('reports invalid stored data (%s) instead of inventing a toggle value', async (value) => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    persisted.set('dioramas_enabled', { key: 'dioramas_enabled', value });
    const response = await request('/api/settings/public');
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ detail: 'Internal Server Error' });
    log.mockRestore();
  });

  it('reports a read failure instead of returning the default', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    readFailure = true;
    const response = await request('/api/settings/public');
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ detail: 'Internal Server Error' });
    log.mockRestore();
  });
});

describe('admin app settings', () => {
  it.each(['GET', 'PUT'])('requires authentication for %s', async (method) => {
    const response = await request('/api/admin/settings', { method });
    expect(response.status).toBe(401);
    expect(selected).toHaveLength(0);
    expect(writes).toHaveLength(0);
  });

  it.each(['GET', 'PUT'])('rejects a non-admin %s without accessing settings', async (method) => {
    repo.getUserContext.mockResolvedValue({ user: { role: 'Estudante' }, role: { name: 'Estudante' }, permissionCodes: [] });
    const response = await request('/api/admin/settings', { method, headers: AUTH });
    expect(response.status).toBe(403);
    expect(selected).toHaveLength(0);
    expect(writes).toHaveLength(0);
  });

  it('rejects an invalid bearer token', async () => {
    firebase.verifyIdToken.mockRejectedValue(new Error('Expired'));
    const response = await request('/api/admin/settings', { headers: AUTH });
    expect(response.status).toBe(401);
    expect(selected).toHaveLength(0);
  });

  it('reads the same default and persisted values as the public endpoint', async () => {
    const initial = await request('/api/admin/settings', { headers: AUTH });
    expect(initial.status).toBe(200);
    expect(await initial.json()).toEqual({ dioramas_enabled: true });
    persisted.set('dioramas_enabled', { key: 'dioramas_enabled', value: 'false' });
    const stored = await request('/api/admin/settings', { headers: AUTH });
    expect(await stored.json()).toEqual({ dioramas_enabled: false });
    // This router runs the existing guards exactly once per request.
    expect(firebase.verifyIdToken).toHaveBeenCalledTimes(2);
    expect(repo.getUserContext).toHaveBeenCalledTimes(2);
  });

  it('persists disabling and re-enabling with a targeted upsert and updated timestamp', async () => {
    persisted.set('private_config', { key: 'private_config', value: 'untouched' });
    for (const enabled of [false, true]) {
      const response = await putBody({ dioramas_enabled: enabled });
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ dioramas_enabled: enabled });
      const stored = persisted.get('dioramas_enabled')!;
      expect(stored.value).toBe(enabled ? 'true' : 'false');
      expect(stored.updatedAt).toBeInstanceOf(Date);
      const write = writes.at(-1)!;
      expect(write.table).toBe(appSettings);
      expect(write.target).toBe(appSettings.key);
      expect(write.values).toEqual({ key: 'dioramas_enabled', value: stored.value, updatedAt: stored.updatedAt });
      expect(write.set).toEqual({ value: stored.value, updatedAt: stored.updatedAt });
      const publicRead = await request('/api/settings/public');
      expect(await publicRead.json()).toEqual({ dioramas_enabled: enabled });
    }
    expect(persisted.get('private_config')?.value).toBe('untouched');
    expect(writes).toHaveLength(2);
  });

  it.each([{}, { dioramas_enabled: 'false' }, { dioramas_enabled: 0 }, { dioramas_enabled: null }, { dioramas_enabled: false, private_config: true }, [], null, true])('rejects a non-strict payload %j without writing', async (body) => {
    const response = await putBody(body);
    expect(response.status).toBe(400);
    expect(writes).toHaveLength(0);
  });

  it('rejects malformed JSON without writing', async () => {
    const response = await request('/api/admin/settings', { method: 'PUT', headers: AUTH, body: '{' });
    expect(response.status).toBe(400);
    expect(writes).toHaveLength(0);
  });

  it('does not acknowledge a failed write as successful or change the stored value', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    persisted.set('dioramas_enabled', { key: 'dioramas_enabled', value: 'true' });
    writeFailure = true;
    const response = await putBody({ dioramas_enabled: false });
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ detail: 'Internal Server Error' });
    expect(persisted.get('dioramas_enabled')?.value).toBe('true');
    log.mockRestore();
  });

  it('returns read errors on the admin endpoint as errors too', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    readFailure = true;
    const response = await request('/api/admin/settings', { headers: AUTH });
    expect(response.status).toBe(500);
    log.mockRestore();
  });
});
