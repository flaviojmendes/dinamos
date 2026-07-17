import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { apiClient } from '../../../app/utils/api';
import { trackArenaLifecycle, trackArenaScoreDrift, trackArenaSyncFailure } from '../../../utils/analytics';
import { stableHash } from '../engine/stableHash';
import {
  errorDetail,
  isRetryableHttpError,
  MAX_SYNC_RETRIES,
  retryDelayMs,
} from './syncRetry';
import { GameState, LeaderboardEntry, ScoreSubmission } from './types';

export type JoinStatus = 'idle' | 'joining' | 'joined' | 'denied' | 'error';
export type SyncStatus = 'idle' | 'syncing' | 'ok' | 'stale' | 'error' | 'offline';

interface GameContextValue {
  code: string;
  state: GameState | null;
  leaderboard: LeaderboardEntry[];
  /** True when leaderboard scores come from server recomputation. */
  leaderboardVerified: boolean;
  loading: boolean;
  notFound: boolean;
  joinDenied: boolean;
  joinStatus: JoinStatus;
  syncStatus: SyncStatus;
  error: string | null;
  leaderboardError: string | null;
  scoreSyncError: string | null;
  isOffline: boolean;
  /** server_time - Date.now() in ms, used to align the local sim clock. */
  serverOffsetMs: number;
  join: () => Promise<void>;
  submitScore: (submission: ScoreSubmission) => Promise<void>;
  refresh: () => Promise<void>;
  retryJoin: () => Promise<void>;
  retrySync: () => Promise<void>;
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

function submissionKey(sub: ScoreSubmission): string {
  const archPart = sub.architecture ? stableHash(sub.architecture) : 'no-arch';
  return `${sub.round_index ?? 'build'}:${Math.round(sub.score ?? 0)}:${Math.round(sub.round_score ?? 0)}:${archPart}`;
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
  const [leaderboardVerified, setLeaderboardVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [joinDenied, setJoinDenied] = useState(false);
  const [joinStatus, setJoinStatus] = useState<JoinStatus>('idle');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  const [scoreSyncError, setScoreSyncError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false,
  );
  const [serverOffsetMs, setServerOffsetMs] = useState(0);

  const archHashRef = useRef<string | undefined>();
  const startingArchHashRef = useRef<string | undefined>();
  const pollCountRef = useRef(0);
  const joinAttemptRef = useRef(0);
  const syncAttemptRef = useRef(0);
  const joinInFlightRef = useRef<Promise<void> | null>(null);
  const pendingSubmitsRef = useRef<Map<string, Promise<void>>>(new Map());
  const lastSuccessfulSyncRef = useRef<number>(Date.now());
  const lastPhaseRef = useRef<string | null>(null);

  const applyState = useCallback((data: GameState) => {
    if (data.phase && data.phase !== lastPhaseRef.current) {
      if (lastPhaseRef.current) {
        trackArenaLifecycle(`${lastPhaseRef.current}->${data.phase}`);
      }
      lastPhaseRef.current = data.phase;
    }
    if (
      data.my_provisional_score != null &&
      data.scores_verified &&
      data.my_score != null &&
      Math.abs(data.my_provisional_score - data.my_score) > 2
    ) {
      trackArenaScoreDrift(data.current_round, data.my_provisional_score - data.my_score);
    }
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
    setSyncStatus('ok');
    syncAttemptRef.current = 0;
    lastSuccessfulSyncRef.current = Date.now();
    if (data.server_time) {
      setServerOffsetMs(new Date(data.server_time).getTime() - Date.now());
    }
    if (data.joined) setJoinStatus('joined');
  }, []);

  const refresh = useCallback(async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
      setSyncStatus('offline');
      return;
    }
    setIsOffline(false);
    setSyncStatus('syncing');
    try {
      const params = new URLSearchParams();
      if (archHashRef.current) params.set('arch_hash', archHashRef.current);
      if (startingArchHashRef.current) {
        params.set('starting_arch_hash', startingArchHashRef.current);
      }
      const qs = params.toString();
      const res = await apiClient.get(`/api/game/${code}${qs ? `?${qs}` : ''}`);
      applyState(res.data as GameState);
    } catch (err: unknown) {
      if ((err as { response?: { status?: number } })?.response?.status === 404) {
        setNotFound(true);
        setSyncStatus('error');
      } else if (isRetryableHttpError(err)) {
        const attempt = syncAttemptRef.current;
        if (attempt < MAX_SYNC_RETRIES) {
          syncAttemptRef.current += 1;
          const delay = retryDelayMs(attempt);
          setSyncStatus('stale');
          setError(errorDetail(err, 'Failed to load match'));
          await new Promise((r) => setTimeout(r, delay));
          return refresh();
        }
        setSyncStatus('error');
        setError(errorDetail(err, 'Failed to load match'));
        trackArenaSyncFailure('poll', errorDetail(err, 'Failed to load match'));
      } else {
        setSyncStatus('error');
        setError(errorDetail(err, 'Failed to load match'));
        trackArenaSyncFailure('poll', errorDetail(err, 'Failed to load match'));
      }
    } finally {
      setLoading(false);
    }
  }, [code, applyState]);

  const join = useCallback(async () => {
    if (joinInFlightRef.current) return joinInFlightRef.current;
    const run = (async () => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setIsOffline(true);
        setJoinStatus('error');
        setError('You appear to be offline. Check your connection and try again.');
        return;
      }
      setIsOffline(false);
      setJoinStatus('joining');
      setError(null);
      try {
        const res = await apiClient.post(`/api/game/${code}/join`, {
          key: joinKey ?? undefined,
        });
        joinAttemptRef.current = 0;
        setJoinDenied(false);
        setJoinStatus('joined');
        applyState(res.data as GameState);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 403) {
          setJoinDenied(true);
          setJoinStatus('denied');
        } else if (isRetryableHttpError(err)) {
          const attempt = joinAttemptRef.current;
          if (attempt < MAX_SYNC_RETRIES) {
            joinAttemptRef.current += 1;
            setJoinStatus('joining');
            setError(errorDetail(err, 'Failed to join match'));
            await new Promise((r) => setTimeout(r, retryDelayMs(attempt)));
            joinInFlightRef.current = null;
            return join();
          }
          setJoinStatus('error');
          setError(errorDetail(err, 'Failed to join match'));
        } else {
          setJoinStatus('error');
          setError(errorDetail(err, 'Failed to join match'));
        }
      }
    })();
    joinInFlightRef.current = run;
    try {
      await run;
    } finally {
      joinInFlightRef.current = null;
    }
  }, [code, joinKey, applyState]);

  const retryJoin = useCallback(async () => {
    joinAttemptRef.current = 0;
    setJoinDenied(false);
    setJoinStatus('idle');
    await join();
  }, [join]);

  const submitScore = useCallback(
    async (submission: ScoreSubmission) => {
      const key = submissionKey(submission);
      const pending = pendingSubmitsRef.current.get(key);
      if (pending) return pending;

      const run = (async () => {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          setIsOffline(true);
          setScoreSyncError('Score sync paused while offline.');
          throw new Error('offline');
        }
        setIsOffline(false);
        let attempt = 0;
        while (attempt <= MAX_SYNC_RETRIES) {
          try {
            await apiClient.put(`/api/game/${code}/architecture`, submission);
            setScoreSyncError(null);
            return;
          } catch (err: unknown) {
            if (!isRetryableHttpError(err)) {
              setScoreSyncError(errorDetail(err, 'Score could not be saved'));
              trackArenaSyncFailure('score_submit', errorDetail(err, 'Score could not be saved'));
              throw err;
            }
            if (attempt >= MAX_SYNC_RETRIES) {
              setScoreSyncError(errorDetail(err, 'Score sync failed'));
              trackArenaSyncFailure('score_submit', errorDetail(err, 'Score sync failed'));
              throw err;
            }
            attempt += 1;
            await new Promise((r) => setTimeout(r, retryDelayMs(attempt - 1)));
          }
        }
      })();

      pendingSubmitsRef.current.set(key, run);
      try {
        await run;
      } finally {
        pendingSubmitsRef.current.delete(key);
      }
    },
    [code],
  );

  const fetchLeaderboard = useCallback(async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setLeaderboardError('Leaderboard unavailable while offline.');
      return;
    }
    try {
      const res = await apiClient.get(`/api/game/${code}/leaderboard`);
      setLeaderboard((res.data?.leaderboard ?? []) as LeaderboardEntry[]);
      setLeaderboardVerified(!!res.data?.scores_verified);
      setLeaderboardError(null);
    } catch (err: unknown) {
      setLeaderboardError(errorDetail(err, 'Failed to load leaderboard'));
    }
  }, [code]);

  const retrySync = useCallback(async () => {
    syncAttemptRef.current = 0;
    setError(null);
    setLeaderboardError(null);
    setScoreSyncError(null);
    await Promise.all([refresh(), fetchLeaderboard()]);
  }, [refresh, fetchLeaderboard]);

  // Initial load.
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto-join once the match is known and not finished.
  useEffect(() => {
    if (
      state &&
      !state.joined &&
      joinStatus !== 'joining' &&
      joinStatus !== 'joined' &&
      joinStatus !== 'denied' &&
      state.status !== 'ended'
    ) {
      join();
    }
  }, [state, join, joinStatus]);

  // Mark stale sync when control state has not refreshed recently during live play.
  useEffect(() => {
    if (!state || state.phase !== 'round' || state.status !== 'running') return;
    const id = setInterval(() => {
      if (Date.now() - lastSuccessfulSyncRef.current > ACTIVE_POLL_MS * 3) {
        setSyncStatus((cur) => (cur === 'ok' ? 'stale' : cur));
      }
    }, ACTIVE_POLL_MS);
    return () => clearInterval(id);
  }, [state?.phase, state?.status, state]);

  // Online/offline awareness.
  useEffect(() => {
    const onOnline = () => {
      setIsOffline(false);
      refresh();
      fetchLeaderboard();
    };
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [refresh, fetchLeaderboard]);

  // Refresh immediately when the tab returns; keep polling while hidden so
  // preview catch-up has fresh lifecycle timing on visibilitychange.
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

  // Adaptive polling for control state + leaderboard (runs even when hidden).
  useEffect(() => {
    if (notFound) return;

    let id: ReturnType<typeof setInterval> | undefined;
    const tick = () => {
      refresh();
      pollCountRef.current += 1;
      const lbEvery = state?.phase === 'round' && state?.status === 'running' ? 2 : 3;
      if (pollCountRef.current % lbEvery === 0) fetchLeaderboard();
    };

    const schedule = () => {
      if (id) clearInterval(id);
      const ms = pollIntervalMs(state);
      if (ms <= 0) return;
      id = setInterval(tick, ms);
    };

    schedule();
    return () => {
      if (id) clearInterval(id);
    };
  }, [refresh, fetchLeaderboard, notFound, state?.phase, state?.status, state]);

  const value: GameContextValue = {
    code,
    state,
    leaderboard,
    leaderboardVerified,
    loading,
    notFound,
    joinDenied,
    joinStatus,
    syncStatus,
    error,
    leaderboardError,
    scoreSyncError,
    isOffline,
    serverOffsetMs,
    join,
    submitScore,
    refresh,
    retryJoin,
    retrySync,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
