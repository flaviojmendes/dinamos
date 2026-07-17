import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { maxBodyBytes, rateLimit } from '../guardrails.js';
import { resetMemoryRateLimitBuckets } from '../../lib/rateLimitStore.js';

describe('guardrails middleware', () => {
  beforeEach(() => {
    resetMemoryRateLimitBuckets();
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

  it('maxBodyBytes rejects streamed bodies without Content-Length', async () => {
    const app = new Hono();
    app.use('/post', maxBodyBytes(10));
    app.post('/post', (c) => c.json({ ok: true }));

    const res = await app.request('/post', {
      method: 'POST',
      body: '012345678901',
    });
    expect(res.status).toBe(413);
  });

  it('maxBodyBytes preserves parsed JSON for downstream handlers', async () => {
    const app = new Hono();
    app.use('/post', maxBodyBytes(100));
    app.post('/post', async (c) => c.json(await c.req.json()));

    const res = await app.request('/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
