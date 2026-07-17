# Arena authoritative scoring rollout

Staged rollout for server-authoritative Arena scoring, lifecycle, and integrity controls. No secrets are required for local verification or canary configuration.

## Default behavior (production-safe)

| Variable | Default | Meaning |
|----------|---------|---------|
| `ARENA_AUTHORITATIVE_SCORING` | **on** (`!== 'false'`) | Server recomputes verified scores; leaderboard uses verified totals |
| `ARENA_TRUST_CLIENT_SCORES` | **off** | Legacy client-authoritative path disabled |
| `ARENA_TELEMETRY` | on in production, off in tests | Structured JSON logs (`domain: "arena"`) |
| `ARENA_CANARY_HOST_IDS` | empty | Full rollout — any host may create matches |

The insecure compatibility path requires **both**:

```bash
ARENA_AUTHORITATIVE_SCORING=false
ARENA_TRUST_CLIENT_SCORES=true
```

Use only for emergency rollback. Roll forward by unsetting these variables (or setting authoritative back to default).

## Canary rollout (no secrets)

Restrict new authoritative matches to internal hosts:

```bash
# Comma-separated Firebase UIDs — no API keys needed
ARENA_CANARY_HOST_IDS=uid-host-a,uid-host-b
```

Non-canary hosts receive `403` on `POST /api/games/host`. Existing matches continue under stored lifecycle state.

### Suggested phases

1. **Schema** — deploy `0028_arena_integrity.sql`, `0029_adjacent_hardening.sql`, `0030_arena_progression.sql` via `applyContentSeed` (automatic on Vercel when `DATABASE_URL` is set).
2. **Code + canary** — deploy application with `ARENA_CANARY_HOST_IDS` set to internal hosts.
3. **Monitor** — Vercel logs / log drain: filter `"domain":"arena"` for:
   - `recompute_duration` p95
   - `client_drift` rate
   - `rejected_write` spikes
   - `sync_failure`
4. **Expand** — clear `ARENA_CANARY_HOST_IDS` for full rollout.
5. **Remove rollback path** — never enable `ARENA_TRUST_CLIENT_SCORES` in production after stabilization.

## Rollback

1. Set `ARENA_AUTHORITATIVE_SCORING=false` and `ARENA_TRUST_CLIENT_SCORES=true` on Vercel (temporary).
2. Do **not** revert additive schema migrations.
3. Re-enable authoritative scoring when root cause is fixed.

## Verification checklist

```bash
npm run typecheck
npm test
npm run test:coverage
npm run vercel-build
npm run baseline:bundle-budget
npm run baseline:scoring-budget
npm run baseline:game-rate
```

Optional browser smoke (requires Chromium; run in a normal terminal — not Cursor's sandboxed agent shell):

```bash
npm run test:e2e:install   # arm64-safe Chromium into .playwright-browsers/
./scripts/run-e2e.sh         # build (if needed) + playwright test
# or: npm run test:e2e
```

CI runs `npx playwright install chromium --with-deps` then `npm run test:e2e` with `CI=true` (bundled Linux Chromium).

## Telemetry event types

| `type` | Purpose |
|--------|---------|
| `score_composition` | Throughput, availability, latency/cost penalties, streak, non-compliant time |
| `client_drift` | Client vs verified score delta |
| `rejected_write` | Guard rejections (phase, capacity, kick, etc.) |
| `recompute_duration` | Server recompute wall time |
| `sync_failure` | Lifecycle/progression persistence errors |
| `lifecycle_transition` | Phase changes (auto or host) |
| `late_join` | Mid-round join with eligibility offset |

## Arena progression (separate from quiz/coins)

Migration `0030_arena_progression.sql` adds `arena_matches_played`, `arena_wins`, `arena_podiums` on `users`. Updated idempotently when a match reaches `phase=ended`. Exposed at:

- `GET /api/leaderboard/arena`
- `GET /api/leaderboard/arena/me`

The existing quiz/coins formula in `GET /api/leaderboard` is unchanged.
