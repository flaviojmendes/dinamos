import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import { maxBodyBytes, rateLimit } from '../guardrails.js';

describe('guardrails middleware', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('rateLimit returns 429 after max requests in the window', async () => {
    const app = new Hono();
    app.use('/hit', rateLimit({ windowMs: 60_000, max: 2, keyPrefix: 'test' }));
    app.get('/hit', (c) => c.json({ ok: true }));

    expect((await app.request('/hit', { headers: { 'x-real-ip': '1.2.3.4' } })).status).toBe(200);
    expect((await app.request('/hit', { headers: { 'x-real-ip': '1.2.3.4' } })).status).toBe(200);
    expect((await app.request('/hit', { headers: { 'x-real-ip': '1.2.3.4' } })).status).toBe(429);
  });

  it('maxBodyBytes rejects oversized Content-Length', async () => {
    const app = new Hono();
    app.use('/post', maxBodyBytes(100));
    app.post('/post', (c) => c.json({ ok: true }));

    const res = await app.request('/post', {
      method: 'POST',
      headers: { 'Content-Length': '500' },
      body: '{}',
    });
    expect(res.status).toBe(413);
  });
});

describe('stableHash', () => {
  it('produces stable hashes for equivalent object key order', async () => {
    const { stableHash } = await import(
      '../../../src/components/SystemEditor/engine/stableHash.ts'
    );
    expect(stableHash({ a: 1, b: 2 })).toBe(stableHash({ b: 2, a: 1 }));
    expect(stableHash(null)).toBe(stableHash(undefined));
  });
});
