import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { apiClient } from '../../../app/utils/api';
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

const STATE_POLL_MS = 2500;
const LEADERBOARD_POLL_MS = 4000;

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

  const applyState = useCallback((data: GameState) => {
    setState(data);
    setNotFound(false);
    setError(null);
    if (data.server_time) {
      setServerOffsetMs(new Date(data.server_time).getTime() - Date.now());
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await apiClient.get(`/api/game/${code}`);
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

  // Poll control state.
  useEffect(() => {
    if (notFound) return;
    const id = setInterval(refresh, STATE_POLL_MS);
    return () => clearInterval(id);
  }, [refresh, notFound]);

  // Poll leaderboard.
  useEffect(() => {
    if (notFound) return;
    fetchLeaderboard();
    const id = setInterval(fetchLeaderboard, LEADERBOARD_POLL_MS);
    return () => clearInterval(id);
  }, [fetchLeaderboard, notFound]);

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
