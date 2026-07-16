# Vercel frontend release — content & schema

The Vercel **frontend build no longer mutates Postgres**. Builds run `tsc && vite build` only (`npm run vercel-build`).

Apply database schema and CMS content **outside** the static build, with credentials and explicit approval.

## When to run migrations

Run before or immediately after a deploy when any of these changed:

- Drizzle schema / SQL migrations under `server/db/migrations/`
- Generated content seed (`server/db/migrations/0008_seed_content.sql`) or module seed scripts
- First deploy to a fresh preview database

## Safe release commands

All commands are **idempotent** (safe to re-run). They require `DATABASE_URL` in the environment (never commit credentials).

```bash
# 1) Schema (Drizzle push — dev/staging) OR apply base SQL via the content script
npm run db:push

# 2) Content + guarded post-seed fixups (production path used previously in vercel-build)
npm run release:content
```

`release:content` runs `server/scripts/applyContentSeed.ts`, which:

- Skips cleanly when `DATABASE_URL` is unset (exit 0)
- Ensures base schema + content tables exist
- Applies the content seed only when the seed file hash changes
- Runs cheap, idempotent post-seed SQL fixups every time

### CI / GitHub Actions

CI builds with `npm run vercel-build` **without** `DATABASE_URL` — no DB access during PR checks.

For production content updates, run `npm run release:content` from a trusted environment (local with prod URL, or a manual workflow) **after** the Vercel deploy succeeds.

## Manual GitHub Actions workflow

The repository includes [`.github/workflows/release-content.yml`](../../.github/workflows/release-content.yml), triggered only via **Actions → Release content & schema → Run workflow** (`workflow_dispatch`).

**Required repository secret:** `DATABASE_URL` (production Postgres connection string).

**Default behavior:** runs `npm run release:content` (idempotent schema ensure + content seed + fixups).

**Optional input:** enable **Run Drizzle schema push** to run `npm run db:push` before content (use when Drizzle schema changed; leave off for content-only updates).

The workflow uses a concurrency guard (`release-content`) so two migration runs cannot overlap. PR CI (`.github/workflows/ci.yml`) remains DB-free — do **not** attach `DATABASE_URL` to it.

## Verify

```bash
# Build must not touch the database
DATABASE_URL= npm run vercel-build

# Content apply (when DATABASE_URL is set)
npm run release:content
```
