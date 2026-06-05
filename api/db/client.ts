import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  // Avoid throwing at import time (keeps serverless cold-start logs clean);
  // the first query will surface a clear connection error instead.
  console.warn('[db] DATABASE_URL is not set');
}

/**
 * Supabase Postgres via the transaction pooler (port 6543, PgBouncer in
 * transaction mode) — the right fit for stateless Vercel functions.
 *
 * - `prepare: false` is REQUIRED: the transaction pooler does not support
 *   prepared statements.
 * - `max: 1` keeps each warm function instance to a single connection.
 * - `ssl: 'require'` matches Supabase's TLS requirement.
 */
const client = postgres(databaseUrl ?? '', {
  prepare: false,
  max: 1,
  ssl: 'require',
});

export const db = drizzle(client, { schema });

export type Database = typeof db;
export { schema };
