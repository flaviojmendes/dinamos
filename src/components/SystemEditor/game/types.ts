// Shared client types for the editor game mode. Mirrors the JSON returned by
// the /api/game endpoints (snake_case from the backend).

import { NodeConfig, EdgeSpec } from '../engine/types';
import { LoadProfileType, ChaosEvent } from '../engine/scenarios';
import { ScoringConfig } from '../engine/scoring';

export type GameStatus = 'lobby' | 'running' | 'paused' | 'ended';

/** Round lifecycle: build during 'interval', frozen+scoring during 'round'. */
export type GamePhase = 'lobby' | 'interval' | 'round' | 'ended';

export interface GameArchitecture {
  nodes: { id: string; position: { x: number; y: number }; config: NodeConfig }[];
  edges: EdgeSpec[];
}

export interface GameLoadProfile {
  type: LoadProfileType;
  /** Admin-set traffic intensity multiplier applied on top of the profile. */
  multiplier?: number;
}

/** Per-round configuration set by the admin. */
export interface RoundConfig {
  name?: string;
  /** Build window (seconds) before this round goes live. */
  intervalSec: number;
  /** Live round length in seconds. */
  durationSec: number;
  loadProfile: GameLoadProfile;
  chaosEvents: ChaosEvent[];
  scoringConfig: ScoringConfig;
  /** Multiplier applied to this round's score in the weighted aggregate. */
  weight: number;
}

/** One player's result for a single round. */
export interface RoundScore {
  score: number;
  breakdown?: unknown;
  metrics?: GoldenSignals | null;
}

/** Non-sensitive round metadata broadcast to players and the audience. */
export interface PublicRound {
  name: string | null;
  story: string | null;
  interval_sec: number;
  duration_sec: number;
  weight: number;
}

/** Player-facing control state (GET /api/game/:code). */
export interface GameState {
  code: string;
  name: string | null;
  status: GameStatus;
  seed: number;
  starts_at: string | null;
  started_at: string | null;
  ends_at: string | null;
  duration_sec: number | null;
  server_time: string;
  load_profile: GameLoadProfile;
  chaos_events: ChaosEvent[];
  locked_node_ids: string[];
  allow_delete_starting: boolean;
  scoring_config: ScoringConfig;
  budget: unknown;
  announcement: string | null;
  announcement_at: string | null;
  starting_architecture: GameArchitecture | null;
  player_count: number;
  joined: boolean;
  my_architecture: GameArchitecture | null;
  my_score: number;
  /** Present when the server omitted my_architecture because it is unchanged. */
  my_architecture_unchanged?: boolean;
  arch_hash?: string;
  starting_arch_hash?: string;
  starting_architecture_unchanged?: boolean;
  // Whether anyone with the code can join (false = invite-link only).
  join_open?: boolean;
  // Round state.
  phase: GamePhase;
  current_round: number;
  total_rounds: number;
  rounds_public: PublicRound[];
  round_started_at: string | null;
  round_ends_at: string | null;
  my_round_scores: Record<string, RoundScore>;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  nickname: string | null;
  avatar_image: string | null;
  score: number;
  score_breakdown: unknown;
  last_submitted_at: string | null;
}

/** The "golden signals" snapshot from a player's live simulation. */
export interface GoldenSignals {
  /** Successfully served requests per second (traffic). */
  throughput: number;
  /** Offered load per second. */
  offered_load: number;
  /** Fraction of requests failing [0..1] (errors). */
  error_rate: number;
  /** End-to-end latency percentiles (ms). */
  p50: number;
  p95: number;
  p99: number;
  /** Highest node utilization across the system [0..1+] (saturation). */
  saturation: number;
  /** Estimated spend (USD/hour). */
  cost_per_hour: number;
}

export interface ScoreSubmission {
  architecture?: GameArchitecture;
  score: number;
  score_breakdown?: unknown;
  metrics?: GoldenSignals;
  // Round-based submission: the per-round score recorded under round_index.
  round_index?: number;
  round_score?: number;
  round_breakdown?: unknown;
}

/** One player's live state for the admin spectator / audience stage views. */
export interface SpectatorPlayer {
  rank: number;
  user_id: string;
  nickname: string | null;
  avatar_image: string | null;
  score: number;
  score_breakdown: unknown;
  round_scores?: Record<string, RoundScore>;
  metrics: GoldenSignals | null;
  architecture: GameArchitecture | null;
  node_count: number;
  edge_count: number;
  joined_at: string | null;
  last_submitted_at: string | null;
}

export interface SpectatorResponse {
  server_time: string;
  players: SpectatorPlayer[];
}

/** GET /api/game/:code/spectate — everything the audience stage screen needs. */
export interface StageState {
  code: string;
  name: string | null;
  status: GameStatus;
  phase: GamePhase;
  current_round: number;
  total_rounds: number;
  rounds_public: PublicRound[];
  starts_at: string | null;
  round_started_at: string | null;
  round_ends_at: string | null;
  load_profile: GameLoadProfile;
  announcement: string | null;
  announcement_at: string | null;
  player_count: number;
  server_time: string;
  players: SpectatorPlayer[];
}
