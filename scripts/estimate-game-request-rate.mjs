#!/usr/bin/env node
/**
 * Static estimate of per-player game API request rates from polling intervals
 * in GameContext.tsx and SystemEditorV2.tsx. Writes benchmarks/game-request-baseline.json.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, 'benchmarks');
const OUT_FILE = join(OUT_DIR, 'game-request-baseline.json');

function readFile(path) {
  return readFileSync(path, 'utf8');
}

function extractConst(file, name) {
  const src = readFile(file);
  const m = src.match(new RegExp(`const\\s+${name}\\s*=\\s*(\\d+)`));
  if (!m) throw new Error(`Could not find const ${name} in ${file}`);
  return Number(m[1]);
}

function perMinute(ms) {
  return ms > 0 ? 60_000 / ms : 0;
}

function round(n) {
  return Math.round(n * 100) / 100;
}

function main() {
  const gameContext = join(ROOT, 'src/components/SystemEditor/game/GameContext.tsx');
  const editor = join(ROOT, 'src/components/SystemEditor/SystemEditorV2.tsx');
  const spectator = join(ROOT, 'src/components/SystemEditor/game/AdminSpectator.tsx');

  const ACTIVE_POLL_MS = extractConst(gameContext, 'ACTIVE_POLL_MS');
  const WAITING_POLL_MS = extractConst(gameContext, 'WAITING_POLL_MS');
  const LOBBY_POLL_MS = extractConst(gameContext, 'LOBBY_POLL_MS');
  const SPECTATOR_POLL_MS = extractConst(spectator, 'POLL_MS');

  const editorSrc = readFile(editor);
  const roundSubmitMs = editorSrc.includes('setInterval(submit, 4000)') ? 4000 : null;
  const buildSubmitDebounced = editorSrc.includes('lastSubmittedArchHashRef') &&
    !editorSrc.match(/setInterval\([^,]+,\s*5000\)/);

  const stateActive = round(perMinute(ACTIVE_POLL_MS));
  const stateWaiting = round(perMinute(WAITING_POLL_MS));
  const stateLobby = round(perMinute(LOBBY_POLL_MS));
  const lbDuringRound = round(stateActive / 2);
  const lbDuringWaiting = round(stateWaiting / 3);
  const lbDuringLobby = round(stateLobby / 3);
  const roundArchSubmit = roundSubmitMs ? round(perMinute(roundSubmitMs)) : 0;

  const endpoints = {
    statePollActive: {
      endpoint: 'GET /api/game/:code',
      intervalMs: ACTIVE_POLL_MS,
      perMinute: stateActive,
      phase: 'round (running)',
      source: 'GameContext.tsx ACTIVE_POLL_MS',
    },
    statePollWaiting: {
      endpoint: 'GET /api/game/:code',
      intervalMs: WAITING_POLL_MS,
      perMinute: stateWaiting,
      phase: 'interval|paused',
      source: 'GameContext.tsx WAITING_POLL_MS',
    },
    statePollLobby: {
      endpoint: 'GET /api/game/:code',
      intervalMs: LOBBY_POLL_MS,
      perMinute: stateLobby,
      phase: 'lobby',
      source: 'GameContext.tsx LOBBY_POLL_MS',
    },
    leaderboardPollActive: {
      endpoint: 'GET /api/game/:code/leaderboard',
      intervalMs: ACTIVE_POLL_MS * 2,
      perMinute: lbDuringRound,
      phase: 'round (every 2 state ticks)',
      source: 'GameContext.tsx coordinated polling',
    },
    leaderboardPollWaiting: {
      endpoint: 'GET /api/game/:code/leaderboard',
      intervalMs: WAITING_POLL_MS * 3,
      perMinute: lbDuringWaiting,
      phase: 'interval|paused (every 3 state ticks)',
      source: 'GameContext.tsx coordinated polling',
    },
    leaderboardPollLobby: {
      endpoint: 'GET /api/game/:code/leaderboard',
      intervalMs: LOBBY_POLL_MS * 3,
      perMinute: lbDuringLobby,
      phase: 'lobby (every 3 state ticks)',
      source: 'GameContext.tsx coordinated polling',
    },
    roundArchitectureSubmit: {
      endpoint: 'PUT /api/game/:code/architecture',
      intervalMs: roundSubmitMs,
      perMinute: roundArchSubmit,
      phase: 'round (score every 4s; architecture only when hash changes)',
      source: 'SystemEditorV2.tsx setInterval(submit, 4000)',
    },
    buildArchitectureSubmit: {
      endpoint: 'PUT /api/game/:code/architecture',
      intervalMs: null,
      perMinute: 0,
      phase: 'lobby|interval (debounced 1500ms, hash-gated only)',
      source: buildSubmitDebounced
        ? 'SystemEditorV2.tsx debounced hash-gated submit'
        : 'legacy 5000ms interval',
      note: 'Event-driven; steady-state near zero when the canvas is idle',
    },
    spectatorPlayersPoll: {
      endpoint: 'GET /api/games/host/:code/players (admin spectator)',
      intervalMs: SPECTATOR_POLL_MS,
      perMinute: round(perMinute(SPECTATOR_POLL_MS)),
      source: 'AdminSpectator.tsx POLL_MS',
      note: 'Host/spectator only, not counted in per-player rate',
    },
  };

  const activeRoundPerPlayer = round(
    stateActive + lbDuringRound + roundArchSubmit
  );
  const lobbyPerPlayer = round(stateLobby + lbDuringLobby);
  const intervalPerPlayer = round(stateWaiting + lbDuringWaiting);

  const scenarios = {
    activeRoundPerPlayer: {
      description: 'Player in live round (adaptive state + coordinated leaderboard + score submit)',
      endpoints: ['statePollActive', 'leaderboardPollActive', 'roundArchitectureSubmit'],
      requestsPerMinute: activeRoundPerPlayer,
      notes: [
        'Tab hidden pauses all polling until visibility returns',
        'Architecture bytes omitted from GET when arch_hash matches; PUT still fires for scores',
      ],
    },
    lobbyPerPlayer: {
      description: 'Player in lobby (slow poll, hash-gated architecture writes)',
      endpoints: ['statePollLobby', 'leaderboardPollLobby', 'buildArchitectureSubmit'],
      requestsPerMinute: lobbyPerPlayer,
    },
    intervalPerPlayer: {
      description: 'Player in build interval',
      endpoints: ['statePollWaiting', 'leaderboardPollWaiting', 'buildArchitectureSubmit'],
      requestsPerMinute: intervalPerPlayer,
    },
    tenPlayersActiveRound: {
      description: '10 concurrent players in active round (aggregate server load)',
      requestsPerMinute: round(10 * activeRoundPerPlayer),
    },
  };

  const report = {
    capturedAt: new Date().toISOString(),
    method: 'static analysis of client polling intervals (not measured from production traffic)',
    optimizations: [
      'Adaptive poll intervals by phase (2.5s active / 10s waiting / 12s lobby)',
      'Leaderboard piggybacks on state poll (every 2–3 ticks)',
      'document.hidden pauses polling; immediate refresh on return',
      'Architecture GET/PUT gated by stableHash; lobby/interval writes debounced',
      'Thin game payloads omit unchanged architecture blobs and lobby-only config',
    ],
    endpoints,
    scenarios,
    roadmapTarget: {
      maxRequestsPerMinutePerPlayer: 12,
      preOptimizationActiveRoundPerPlayer: 54,
      postOptimizationActiveRoundPerPlayer: activeRoundPerPlayer,
      postOptimizationLobbyPerPlayer: lobbyPerPlayer,
    },
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, `${JSON.stringify(report, null, 2)}\n`);

  console.log('=== Game request-rate estimate (post Phase 1) ===');
  console.log(`Active round per player: ${activeRoundPerPlayer} req/min (was 54/min)`);
  console.log(`  GET state: ${stateActive}/min (${ACTIVE_POLL_MS}ms)`);
  console.log(`  GET leaderboard: ${lbDuringRound}/min (every 2 state ticks)`);
  console.log(`  PUT architecture/score: ${roundArchSubmit}/min (${roundSubmitMs}ms)`);
  console.log(`Lobby per player: ${lobbyPerPlayer} req/min (was 51/min)`);
  console.log(`Interval per player: ${intervalPerPlayer} req/min`);
  console.log(`10 players active round (aggregate): ${scenarios.tenPlayersActiveRound.requestsPerMinute} req/min`);
  console.log(`\nWrote ${OUT_FILE}`);
}

main();
