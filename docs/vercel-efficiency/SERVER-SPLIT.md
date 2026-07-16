# Serverless function split — decision record

Phase 5 of the Vercel efficiency roadmap asked whether to split AI/speech routes into a separate Vercel function. **Decision: keep a single consolidated API function** and defer splitting until production telemetry shows material cold-start or memory pressure on CRUD paths.

## Baseline evidence (2026-07-16)

| Signal | Source | Finding |
|--------|--------|---------|
| Bundle entry | `benchmarks/bundle-baseline.json` | Single Hono app; heaviest lazy chunks are frontend routes (forum editor, game editor), not the API entry |
| Game traffic | `benchmarks/game-request-baseline.json` | Pre-optimization **54 req/min/player**; post Phase 1 **51 req/min** active round (polling + coordinated leaderboard) |
| Vercel p50/p95 cold start | `benchmarks/baseline-summary.json` | **Unavailable** — no dashboard export configured |
| Production CPU/memory by path | Vercel Observability | **Unavailable** — manual export deferred |

Without path-level cold-start or memory deltas, splitting would be speculative and would **double function surface area** (two cold-start pools, two deploy traces, duplicated shared deps).

## Mitigations applied instead of splitting

| Dependency | Strategy | Where |
|------------|----------|-------|
| Firebase Admin | Lazy init + dynamic import in auth middleware | `server/lib/firebaseAdmin.ts`, `server/middleware/auth.ts` |
| Gemini (`@google/genai`) | Dynamic import on first AI call | `server/lib/google.ts` → `getGoogleAIAsync()` |
| Challenge generation | Route-level dynamic import | `server/routes/challenges.ts` |
| AI feedback | Route-level dynamic import | `server/routes/challenges.ts` → `feedback.js` |
| Speech-to-Text | Route-level dynamic import + lazy `google-auth-library` | `server/routes/challenges.ts` → `speech.js` |
| Email (Resend) | Dynamic import on send | `server/lib/email.ts`, `server/routes/forum.ts`, `server/routes/admin.ts` |

CRUD routes (`content`, `progress`, `game` polling, `forum` reads) no longer eagerly load Resend or Gemini at module evaluation time.

## When to revisit splitting

Re-evaluate if **any** of the following hold for a representative production week:

1. p95 cold start on `GET /api/content` or `GET /api/game/:code` exceeds **2×** p95 on `POST /api/feedback` (suggesting heavy deps pollute the shared bundle init path despite lazy loading).
2. Function memory routinely approaches the **1024 MB** Hobby ceiling on lightweight routes.
3. Gemini or Speech requests regularly approach the **60 s** cap and block unrelated traffic on the same instance (unlikely on Node serverless without shared in-process queue).

Preferred escalation order before splitting:

1. Confirm lazy imports are not undermined by static imports elsewhere in the graph.
2. Consider `202 Accepted` async jobs for transcription (requires durable queue — intentionally deferred).
3. Only then add a second function for `/api/feedback`, `/api/transcribe-audio`, and `/api/challenges/generate`.

## Explicitly deferred

- Separate Vercel function for AI/speech (no telemetry justification yet)
- Async job queue for long-running provider calls
- Edge runtime migration (Firebase Admin requires Node)
