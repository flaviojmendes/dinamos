// Shared client types for the editor game mode. Mirrors the JSON returned by
// the /api/game endpoints (snake_case from the backend).

import { NodeConfig, EdgeSpec } from '../engine/types';
import { LoadProfileType, ChaosEvent } from '../engine/scenarios';
import { ScoringConfig } from '../engine/scoring';

export type GameStatus = 'lobby' | 'running' | 'paused' | 'ended';

export interface GameArchitecture {
  nodes: { id: string; position: { x: number; y: number }; config: NodeConfig }[];
  edges: EdgeSpec[];
}

export interface GameLoadProfile {
  type: LoadProfileType;
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
  architecture: GameArchitecture;
  score: number;
  score_breakdown?: unknown;
  metrics?: GoldenSignals;
}

/** One player's live state for the admin spectator view. */
export interface SpectatorPlayer {
  rank: number;
  user_id: string;
  nickname: string | null;
  avatar_image: string | null;
  score: number;
  score_breakdown: unknown;
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
