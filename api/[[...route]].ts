import { getRequestListener } from '@hono/node-server';
import app from './app.js';

// Run on the Node.js runtime (firebase-admin + stripe require Node APIs).
export const config = {
  runtime: 'nodejs',
  // Hobby plan max; covers the AI feedback route (GPT-4o-mini).
  maxDuration: 60,
};

// hono/vercel's `handle` is the Edge adapter — it calls `app.fetch(request)`
// with a Web Request. On Vercel's Node.js runtime the function instead receives
// Node's (req, res), so we use @hono/node-server's request listener, which
// builds a Web Request from the Node request, runs the Hono app, and writes the
// Response back to the Node response.
export default getRequestListener(app.fetch);
