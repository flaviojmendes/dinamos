// Local development server for the Hono API.
//
// In production the API runs as a Vercel serverless function (api/[[...route]].ts).
// Locally there is no Vercel runtime, so this lightweight Node server serves the
// same Hono app on a port the Vite dev proxy can target.
//
// Usage:
//   npm run dev:api                  # serves the API on http://localhost:8787
//   API_PROXY_TARGET=http://localhost:8787 npm run dev   # point Vite at it
//
// Environment variables (DATABASE_URL, FIREBASE_SERVICE_ACCOUNT_B64, etc.) are
// loaded from .env via Node's --env-file flag in the npm script.

import { serve } from '@hono/node-server';
import app from './app.js';

const port = Number(process.env.API_PORT ?? 8787);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`[api] local dev server running at http://localhost:${info.port}`);
});
