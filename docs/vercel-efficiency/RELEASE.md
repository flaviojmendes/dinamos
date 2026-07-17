# Vercel frontend release — static CDN content & database CMS

The Vercel **frontend build no longer touches Postgres**. Production deploys run `tsc && vite build` only (`npm run vercel-build`). Lesson navigation and bodies are served from versioned static JSON under `public/content/` on Vercel’s built-in CDN. PostgreSQL remains the admin/CMS source of truth; published snapshots are exported manually and committed to Git.

## Architecture overview

```text
Admin CMS (DB)  →  authors edit drafts / published rows in Postgres
Publish workflow → one bounded DB read → commit public/content/** → push main
Vercel deploy   → DB-free build → CDN serves manifest + body JSON
Browser         → CDN-first reads; API fallback only when CDN/schema fails
```

Private data (user progress, views, annotations, games, admin operations) stays on authenticated API routes and the database.

## Author → publish → deploy workflow

### 1. Edit content in the CMS (database)

Authors use the admin content UI. Changes land in `content_modules` and `content_pages` in Postgres. **Edits are not public until a snapshot is published.**

Admins can click **Reload** in the app to preview DB state via the content API before the next CDN publish. Normal app bootstrap remains CDN-first.

### 2. Publish static snapshot (manual GitHub Action)

**Workflow:** Actions → **Publish static content to CDN** → Run workflow (`workflow_dispatch`).

**Required repository secret:** `DATABASE_URL` (production Postgres connection string).

**Environment:** `production` — configure [GitHub environment protection rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) so publishes require reviewer approval before the job runs.

**What it does:**

1. Checks out `main`
2. Runs `npm run content:export-static` (reads published modules/pages only)
3. Validates the snapshot (schema, hash paths, no secret leakage)
4. Runs exporter tests and a DB-free `vercel-build`
5. Commits **only** `public/content/**` and pushes to `main`
6. Vercel deploys automatically from the push (no DB access in build)

**Concurrency:** `publish-static-content` — overlapping publishes are serialized.

**Local export (development / dry run):**

```bash
# Requires DATABASE_URL in .env or the environment; fails if unset
npm run content:export-static
node .github/scripts/validatePublishedContent.mjs
node .github/scripts/smokeStaticContent.mjs
```

Do not commit credentials. The exporter and validators reject connection strings and common secret patterns in generated JSON.

### 3. Vercel deployment

Every push to `main` triggers the normal Vercel deployment. The build path is DB-free:

```bash
DATABASE_URL= npm run vercel-build
```

Committed files under `public/content/` ship with the deployment and are served as static assets.

## Public content caveat

Published lesson files are **publicly readable by URL** (manifest + per-language body JSON). Anyone with the URL can fetch lesson markdown. This is intentional for CDN delivery.

Do **not** put credentials, private user data, or unreleased draft content in published rows. Unpublished (`published = false`) pages are excluded from export.

## Database recovery (not CDN publish)

**Workflow:** Actions → **Restore content seed (recovery)** → enable **confirm_recovery** → Run workflow.

This re-applies idempotent content seed SQL and post-seed fixups via `npm run release:content`. It does **not** publish CMS edits to the CDN.

Use recovery when:

- A fresh database needs baseline schema + seed content
- Seed/fixup SQL changed and must be re-applied
- Production content tables were lost or corrupted

**Do not confuse recovery with publishing.** Recovery writes to Postgres; publishing reads Postgres and commits static files.

For Drizzle schema changes, apply reviewed migrations separately (`npm run db:migrate` or your approved migration path). **`db:push` is not used in production workflows.**

## Cache behavior

Configured in [`vercel.json`](../../vercel.json):

| Asset | Cache-Control |
|-------|---------------|
| `/content/manifest.json` | `public, max-age=300, s-maxage=300, stale-while-revalidate=60` |
| `/content/<hash>/pages/*.json` | `public, max-age=31536000, immutable` |
| SPA shell / non-versioned routes | `public, max-age=0, must-revalidate` |

Hash-versioned body files are immutable; clients load the current hash from the manifest. The previous content hash is retained on publish so short-lived stale manifests do not 404.

API fallback routes keep `no-store` caching on 404 responses. The fallback index query computes `hasEn`/`hasPt` in SQL **without** selecting lesson body columns, reducing egress when CDN delivery fails.

## Emergency rollback: force API delivery

If CDN delivery misbehaves in production, set a Vercel environment variable:

```text
VITE_FORCE_CONTENT_API=true
```

Redeploy. The client skips manifest/body CDN reads and uses `/api/modules`, `/api/content`, and `/api/content/body` exclusively. Remove the variable and redeploy to return to CDN-first delivery once the snapshot or cache issue is resolved.

Admin **Reload** also forces API reads for the current session without a redeploy.

## Branch protection

Recommended `main` branch rules:

- Require pull request reviews before merge (application code changes)
- Require status checks (CI) to pass
- Restrict who can push directly to `main`

The publish workflow commits directly to `main` using `github-actions[bot]`. Either:

- Allow the GitHub Actions bot to bypass “require pull requests” for automated content commits, **or**
- Change the publish workflow to open a PR instead of pushing (not implemented today)

Protect the `DATABASE_URL` secret and the `production` environment approval list. Do **not** attach `DATABASE_URL` to PR CI.

## CI verification

PR CI (`.github/workflows/ci.yml`) runs DB-free:

```bash
npm run typecheck
npm run vercel-build          # DATABASE_URL unset
npm run baseline:bundle-budget
npm run test:coverage
```

Workflow contract checks:

```bash
node .github/scripts/validateWorkflows.mjs
```

## Verify locally

```bash
# Build must not touch the database
DATABASE_URL= npm run vercel-build

# Full test suite
npm run test

# Exporter tests (DB-free)
npm run test -- server/scripts/staticContent/__tests__/exportStaticContent.test.ts

# Snapshot validators
node .github/scripts/validatePublishedContent.mjs
node .github/scripts/smokeStaticContent.mjs

# Export from configured .env (reads DB once, writes public/content)
npm run content:export-static
```

## Troubleshooting

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| Navigation lists a lesson but body shows “Content not found” | Stale manifest, missing body file, or CDN 404 | Run publish workflow; confirm `distributed-challenges` (and other nested slugs) in manifest; check body URLs use hash filenames, not slug paths |
| CMS shows new content but site does not | Snapshot not published | Run **Publish static content to CDN** |
| Old content after publish | Browser/CDN cache | Manifest revalidates every 5 minutes; hard refresh; body files are hash-versioned and update immediately when manifest changes |
| Need instant API-only delivery | CDN incident or bad snapshot | Set `VITE_FORCE_CONTENT_API=true` and redeploy |

## Expected database egress reduction

**Before (API-only path):** every visitor session triggered Postgres reads for the content index and per-lesson bodies. Fallback index queries previously selected full body columns for all pages on cache miss — transferring the entire lesson corpus repeatedly.

**After (CDN-first path):**

- Normal lesson reads: **zero** Postgres queries and **zero** content API invocations
- Publish: **one** bounded snapshot read per manual publication (~all published pages + bodies, currently ~1.3 MB / 245 JSON files for 122 pages × 2 locales)
- Residual DB traffic: admin CMS, user progress, views, games, and API fallback only

Routine content egress drops from “every page view × full corpus transfer potential” to “one snapshot read per intentional publish.”
