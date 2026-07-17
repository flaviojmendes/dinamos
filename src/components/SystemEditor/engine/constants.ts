// Pinned simulation parameters shared by the browser editor and Node-side
// authoritative scoring. Keep these identical everywhere the engine runs.

/** Simulated seconds per tick. */
export const SIM_DT_SECONDS = 1;

/** Monte-Carlo trace samples per tick for latency percentiles. */
export const SIM_TRACE_SAMPLES = 2000;

/** Target cadence for verified leaderboard recomputation during live rounds. */
export const SCORING_RECOMPUTE_CHECKPOINT_SEC = 15;

/** Default maximum players per match (overridable per session). */
export const DEFAULT_MAX_PLAYERS = 32;
