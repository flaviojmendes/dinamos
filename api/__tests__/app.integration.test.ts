import { describe, it, expect } from 'vitest';
import app from '../app';

describe('Hono app (integration)', () => {
  it('GET /api returns the running banner', async () => {
    const res = await app.request('/api');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: 'Dinamos API', status: 'running' });
  });

  it('GET /api/health returns ok', async () => {
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });

  it('returns the FastAPI-compatible 404 shape for unknown routes', async () => {
    const res = await app.request('/api/this-route-does-not-exist');
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ detail: 'Not Found' });
  });

  it('rejects protected routes without a token (auth wired up end-to-end)', async () => {
    const res = await app.request('/api/leaderboard');
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty('detail');
  });

  it('answers CORS preflight requests', async () => {
    const res = await app.request('/api/health', {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://localhost:5173',
        'Access-Control-Request-Method': 'GET',
      },
    });
    // Hono's cors() short-circuits OPTIONS with a 204 and the allow-methods header.
    expect([200, 204]).toContain(res.status);
    expect(res.headers.get('access-control-allow-methods')).toContain('GET');
  });
});
