import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { apiClient } from '../../../app/utils/api';
import { stableHash } from '../engine/stableHash';
import { GameState, LeaderboardEntry, ScoreSubmission } from './types';

interface GameContextValue {
  code: string;
  state: GameState | null;
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  notFound: boolean;
  /** Join rejected: the match is invite-only and no valid key was provided. */
  joinDenied: boolean;
  error: string | null;
  /** server_time - Date.now() in ms, used to align the local sim clock. */
  serverOffsetMs: number;
  join: () => Promise<void>;
  submitScore: (submission: ScoreSubmission) => Promise<void>;
  refresh: () => Promise<void>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function useGameContext(): GameContextValue | null {
  return useContext(GameContext);
}

const ACTIVE_POLL_MS = 2500;
const WAITING_POLL_MS = 10000;
const LOBBY_POLL_MS = 12000;

function pollIntervalMs(state: GameState | null): number {
  if (!state || state.status === 'ended') return 0;
  if (state.phase === 'round' && state.status === 'running') return ACTIVE_POLL_MS;
  if (state.phase === 'interval' || state.status === 'paused') return WAITING_POLL_MS;
  return LOBBY_POLL_MS;
}

function mergeThinState(prev: GameState | null, data: GameState): GameState {
  const merged = { ...data };
  if (data.my_architecture_unchanged && prev?.my_architecture) {
    merged.my_architecture = prev.my_architecture;
  }
  if (data.starting_architecture_unchanged && prev?.starting_architecture) {
    merged.starting_architecture = prev.starting_architecture;
  }
  if (!merged.load_profile && prev?.load_profile) merged.load_profile = prev.load_profile;
  if (!merged.scoring_config && prev?.scoring_config) {
    merged.scoring_config = prev.scoring_config;
  }
  return merged;
}

export function GameProvider({
  code,
  joinKey,
  children,
}: {
  code: string;
  /** Invite key from the share link; required to join private matches. */
  joinKey?: string | null;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<GameState | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [joinDenied, setJoinDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverOffsetMs, setServerOffsetMs] = useState(0);

  const joinedRef = useRef(false);
  const archHashRef = useRef<string | undefined>();
  const startingArchHashRef = useRef<string | undefined>();
  const pollCountRef = useRef(0);

  const applyState = useCallback((data: GameState) => {
    setState((prev) => {
      const merged = mergeThinState(prev, data);
      if (data.arch_hash) archHashRef.current = data.arch_hash;
      else if (merged.my_architecture) {
        archHashRef.current = stableHash(merged.my_architecture);
      }
      if (data.starting_arch_hash) startingArchHashRef.current = data.starting_arch_hash;
      else if (merged.starting_architecture) {
        startingArchHashRef.current = stableHash(merged.starting_architecture);
      }
      return merged;
    });
    setNotFound(false);
    setError(null);
    if (data.server_time) {
      setServerOffsetMs(new Date(data.server_time).getTime() - Date.now());
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (archHashRef.current) params.set('arch_hash', archHashRef.current);
      if (startingArchHashRef.current) {
        params.set('starting_arch_hash', startingArchHashRef.current);
      }
      const qs = params.toString();
      const res = await apiClient.get(`/api/game/${code}${qs ? `?${qs}` : ''}`);
      applyState(res.data as GameState);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(err?.response?.data?.detail ?? 'Failed to load match');
      }
    } finally {
      setLoading(false);
    }
  }, [code, applyState]);

  const join = useCallback(async () => {
    try {
      const res = await apiClient.post(`/api/game/${code}/join`, {
        key: joinKey ?? undefined,
      });
      joinedRef.current = true;
      setJoinDenied(false);
      applyState(res.data as GameState);
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setJoinDenied(true);
      } else {
        setError(err?.response?.data?.detail ?? 'Failed to join match');
      }
    }
  }, [code, joinKey, applyState]);

  const submitScore = useCallback(
    async (submission: ScoreSubmission) => {
      try {
        await apiClient.put(`/api/game/${code}/architecture`, submission);
      } catch {
        /* transient; the next periodic submit will retry */
      }
    },
    [code]
  );

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await apiClient.get(`/api/game/${code}/leaderboard`);
      setLeaderboard((res.data?.leaderboard ?? []) as LeaderboardEntry[]);
    } catch {
      /* ignore transient leaderboard errors */
    }
  }, [code]);

  // Initial load.
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto-join once the match is known and not finished.
  useEffect(() => {
    if (state && !state.joined && !joinedRef.current && state.status !== 'ended') {
      joinedRef.current = true;
      join();
    }
  }, [state, join]);

  // Pause polling when the tab is hidden; refresh immediately when it returns.
  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden && !notFound) {
        refresh();
        fetchLeaderboard();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [refresh, fetchLeaderboard, notFound]);

  // Adaptive, visibility-aware polling for control state + leaderboard.
  useEffect(() => {
    if (notFound) return;

    let id: ReturnType<typeof setInterval> | undefined;
    const tick = () => {
      if (document.hidden) return;
      refresh();
      pollCountRef.current += 1;
      const lbEvery = state?.phase === 'round' && state?.status === 'running' ? 2 : 3;
      if (pollCountRef.current % lbEvery === 0) fetchLeaderboard();
    };

    const schedule = () => {
      if (id) clearInterval(id);
      if (document.hidden) return;
      const ms = pollIntervalMs(state);
      if (ms <= 0) return;
      id = setInterval(tick, ms);
    };

    schedule();
    const onVisibility = () => schedule();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (id) clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refresh, fetchLeaderboard, notFound, state?.phase, state?.status, state]);

  const value: GameContextValue = {
    code,
    state,
    leaderboard,
    loading,
    notFound,
    joinDenied,
    error,
    serverOffsetMs,
    join,
    submitScore,
    refresh,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
