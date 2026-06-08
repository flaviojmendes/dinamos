import { handle } from 'hono/vercel';
import app from './app.js';

// Run on the Node.js runtime (firebase-admin + stripe require Node APIs).
export const config = {
  runtime: 'nodejs',
  // Hobby plan max; covers the AI feedback route (GPT-4o-mini).
  maxDuration: 60,
};

export default handle(app);
