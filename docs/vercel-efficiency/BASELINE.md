# Vercel efficiency — Phase 0 baseline

Reproducible **local** measurements for the [Vercel efficiency roadmap](https://github.com/flaviojmendes/dinamos). Production Vercel dashboard telemetry is recorded separately when account access is available.

## Captured baseline (2026-07-16, local)

Environment: Node v25.9.0, darwin arm64. Commit at capture time: current working tree.

### Bundle (production `npm run build`)

| Asset | Raw | Gzip | Brotli |
|-------|-----|------|--------|
| Entry JS (`index-yyK29ple.js`) | 1.17 MB | **357.3 KB** | 284.7 KB |
| Entry CSS (`index-CpQ7pTQL.css`) | 130.4 KB | 19.3 KB | 15.0 KB |
| Entry total (JS+CSS) | — | **376.6 KB** | 299.9 KB |

Route chunks (gzip, lazy-loaded):

| Route | Chunk | Gzip |
|-------|-------|------|
| Forum topic | `TopicView-*.js` | 356.1 KB |
| Game editor | `SystemEditorV2-*.js` | 157.4 KB |
| Game arena | `GameArenaPage-*.js` | 4.8 KB (chunk only; pulls deps) |
| Challenge / lesson | `Challenge-*.js` | 10.0 KB |

Roadmap target: main entry JS gzip **< 200 KB** (current **357.3 KB**).

### Game API request rate (static, active round)

| Endpoint | Interval | Rate |
|----------|----------|------|
| `GET /api/game/:code` | 2500 ms | 24/min |
| `GET /api/game/:code/leaderboard` | 4000 ms | 15/min |
| `PUT /api/game/:code/architecture` | 4000 ms | 15/min |
| **Total per player (active round)** | | **54/min** |

Lobby/interval: **51/min** (architecture submit every 5000 ms).  
10 players active round: **540 req/min** aggregate.

Roadmap target: **≤ 12 req/min/player** (current **54/min**).

### Build behavior

| Command | Duration | Notes |
|---------|----------|-------|
| `npm run build` (CI) | 45.2 s | `tsc && vite build` |
| `npm run vercel-build` (no `DATABASE_URL`) | 36.6 s | Skips DB seed; logs `[seed] DATABASE_URL is not set` |
| Vite bundle step | ~24–31 s | From build stdout |

`dist/`: 329 files, **19.5 MB** raw.

Landing simulator GIFs (`public/`): **2.20 MB** raw (`cache.gif` 604 KB, `circuit.gif` 580 KB, `loadbalancer.gif` 1.03 MB).  
Roadmap target: initial landing media **< 500 KB** (GIFs alone exceed target).

### Vercel production telemetry

**Not captured.** No Vercel API token or dashboard export configured. Required metrics: function invocations, active CPU, duration by path, transfer, production deploy build time (with `db:apply-content` + Postgres).

### Lighthouse (mobile)

**Not captured in this environment** — Lighthouse CLI failed with `Unable to connect to Chrome` (headless Chrome unavailable in the agent sandbox). Re-run locally:

```bash
npm run baseline:lighthouse -- --url https://dinamos.net
```

Protected routes (`/intro`, `/forum`, `/arena`) will score login redirects unless authenticated.

## Quick start

```bash
# Full local baseline (build + bundle + game rate + build timing)
npm run baseline

# Individual reports (after `npm run build`)
npm run baseline:bundle
npm run baseline:game-rate
npm run baseline:build

# Optional mobile Lighthouse (requires reachable app)
npm run preview   # terminal 1
BASELINE_URL=http://localhost:4173 npm run baseline:lighthouse
# or against production:
npm run baseline:lighthouse -- --url https://dinamos.net
```

Artifacts are written under `benchmarks/` (JSON, gitignored except this doc).

## What is measured locally

| Area | Script | Method |
|------|--------|--------|
| Entry + route JS/CSS gzip/Brotli | `scripts/report-bundle-baseline.mjs` | Post-build `dist/` analysis |
| Game API request rate | `scripts/estimate-game-request-rate.mjs` | Static polling intervals in source |
| Build behavior | `scripts/measure-build-baseline.mjs` | Times `build` vs `vercel-build` (no `DATABASE_URL`) |
| Landing static media | `measure-build-baseline.mjs` | Raw sizes of `public/*.gif` |
| Lighthouse (mobile) | `scripts/run-lighthouse-baseline.mjs` | Optional; needs `--url` |

## What requires Vercel dashboard access

Not captured automatically in CI or local runs:

- Function invocations, active CPU, duration (p50/p95)
- Edge/static transfer by path
- Production deploy build duration (with `db:apply-content` + DB)
- Hobby-tier quota headroom

When available, export metrics for a representative week into `benchmarks/vercel-telemetry.json` (manual; not committed if sensitive).

## Roadmap success targets (reference)

| Metric | Target | Baseline source |
|--------|--------|-----------------|
| Game API calls / player / min | ≤ 12 | `game-request-baseline.json` |
| Main entry JS gzip | < 200 KB | `bundle-baseline.json` |
| Landing initial media transfer | < 500 KB | `build-baseline.json` + Lighthouse |

Re-run `npm run baseline` after each roadmap phase and compare JSON artifacts.
