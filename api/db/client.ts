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
 *
 * Local development can point DATABASE_URL at a plain local Postgres
 * (e.g. localhost) which does not speak TLS, so SSL is disabled for local
 * hosts. An explicit `sslmode=disable` in the URL also turns it off.
 */
const isLocalHost = /@(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)(:|\/)/.test(
  databaseUrl ?? ''
);
const sslDisabled = /[?&]sslmode=disable/.test(databaseUrl ?? '');
const useSsl = !isLocalHost && !sslDisabled;

const client = postgres(databaseUrl ?? '', {
  prepare: false,
  max: 1,
  ssl: useSsl ? 'require' : false,
});

export const db = drizzle(client, { schema });

export type Database = typeof db;
export { schema };
