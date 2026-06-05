import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './api/db/schema.ts',
  out: './api/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  // The production database already exists (migrated from the FastAPI backend),
  // so prefer `db:push` / introspection over generating fresh migrations.
  verbose: true,
  strict: true,
});
