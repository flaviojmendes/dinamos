import { getRequestListener } from '@hono/node-server';
import app from './app.js';

// Run on the Node.js runtime (firebase-admin requires Node APIs).
export const config = {
  runtime: 'nodejs',
  // Hobby plan max; covers the AI feedback route (GPT-4o-mini).
  maxDuration: 60,
};

// Single Hono function for the whole API. vercel.json rewrites every /api/*
// request (any depth) here, and the function still sees the original URL, so
// Hono routes it. We previously used a `[[...route]]` catch-all filename, but
// Vercel only matched a single path segment after /api (so nested routes like
// /api/users/me returned a platform 404 without ever invoking the function).
//
// hono/vercel's `handle` is the Edge adapter — it calls `app.fetch(request)`
// with a Web Request. On Vercel's Node.js runtime the function instead receives
// Node's (req, res), so we use @hono/node-server's request listener, which
// builds a Web Request from the Node request, runs the Hono app, and writes the
// Response back to the Node response.
export default getRequestListener(app.fetch);
