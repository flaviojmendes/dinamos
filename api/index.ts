import { getRequestListener } from '@hono/node-server';
// The Hono app and all its route/lib/db modules live in /server (outside /api)
// so Vercel doesn't turn each file into its own Serverless Function. Only this
// entry file under /api is deployed as a function; the rest is bundled in via
// import tracing. vercel.json rewrites every /api/* request here.
import app from '../server/app.js';

// Run on the Node.js runtime (firebase-admin requires Node APIs).
export const config = {
  runtime: 'nodejs',
  // Hobby plan max; covers the Gemini feedback + audio transcription routes.
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
