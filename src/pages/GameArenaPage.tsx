// The Arena: the landing page for the multiplayer game mode, designed to
// stand alone (a marketing domain can point straight at /arena). It renders
// without the app shell; the top bar carries the way back to dinamos.net.
// CTAs: host a match, watch a live match (stage), or join with a code.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Eye,
  Flame,
  Gamepad2,
  Hammer,
  Layers,
  Lock,
  MonitorPlay,
  Radio,
  Share2,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { apiClient } from '../app/utils/api';
import { MATCH_SCENARIOS } from '../components/SystemEditor/game/matchScenarios';

const POLL_MS = 5000;

interface LiveMatch {
  code: string;
  name: string | null;
  status: 'lobby' | 'running' | 'paused';
  phase: string;
  join_open?: boolean;
  current_round: number;
  total_rounds: number;
  player_count: number;
  starts_at: string | null;
  round_ends_at: string | null;
  created_at: string | null;
}

function fmtClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

function MatchCard({ m, serverNowMs }: { m: LiveMatch; serverNowMs: number }) {
  const { t } = useTranslation();
  const live = m.status === 'running' && m.phase === 'round';
  const chip = live
    ? { label: t('arena.live', { defaultValue: 'LIVE' }), cls: 'border-signal-green text-signal-green', icon: Radio, pulse: true }
    : m.status === 'lobby'
    ? { label: t('arena.lobby', { defaultValue: 'LOBBY' }), cls: 'border-signal-cyan text-signal-cyan', icon: Users, pulse: false }
    : { label: t('arena.building', { defaultValue: 'BUILD' }), cls: 'border-signal-amber text-signal-amber', icon: Hammer, pulse: false };
  const ChipIcon = chip.icon;
  const endsMs = m.round_ends_at ? new Date(m.round_ends_at).getTime() : null;
  const remaining = live && endsMs ? (endsMs - serverNowMs) / 1000 : null;
  const joinable = m.join_open !== false;

  return (
    <div className="tactical-panel p-4 flex flex-col gap-3 border border-tactical-border hover:border-signal-cyan/60 transition-colors">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border font-sans text-[10px] font-bold tracking-wide ${chip.cls}`}>
          <ChipIcon className={`w-3 h-3 ${chip.pulse ? 'animate-pulse motion-reduce:animate-none' : ''}`} />
          {chip.label}
        </span>
        <span className="ml-auto inline-flex items-center gap-1 font-sans text-xs text-tactical-dim">
          <Users className="w-3.5 h-3.5" /> {m.player_count}
        </span>
      </div>
      <div className="min-w-0">
        <div className="font-sans text-base font-bold text-tactical-text truncate">
          {m.name ?? t('arena.untitled', { defaultValue: 'Distributed Systems Match' })}
        </div>
        <div className="font-mono text-[11px] text-tactical-label">#{m.code}</div>
      </div>
      <div className="flex items-center gap-4 font-sans text-xs text-tactical-dim">
        {m.total_rounds > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            {t('arena.round_of', { defaultValue: 'Round {{n}}/{{total}}', n: Math.max(m.current_round, 0), total: m.total_rounds })}
          </span>
        )}
        {remaining !== null && (
          <span className="inline-flex items-center gap-1.5 font-mono tabular-nums text-signal-green">
            <Activity className="w-3.5 h-3.5" /> {fmtClock(remaining)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <Link
          to={`/editor/game/${m.code}/stage`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-tactical-border text-tactical-dim hover:border-signal-amber hover:text-signal-amber font-sans text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-amber"
        >
          <Eye className="w-3.5 h-3.5" /> {t('arena.watch', { defaultValue: 'Watch' })}
        </Link>
        {joinable ? (
          <Link
            to={`/editor/game/${m.code}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-signal-green text-signal-green hover:bg-signal-green/10 font-sans text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-green"
          >
            <Gamepad2 className="w-3.5 h-3.5" /> {t('arena.join', { defaultValue: 'Join' })}
          </Link>
        ) : (
          <span
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-tactical-border text-tactical-label font-sans text-xs font-medium cursor-default"
            title={t('arena.invite_only_hint', { defaultValue: 'The host shares the invite link directly with players.' })}
          >
            <Lock className="w-3.5 h-3.5" /> {t('arena.invite_only', { defaultValue: 'Invite only' })}
          </span>
        )}
      </div>
    </div>
  );
}

function MatchCardSkeleton() {
  return (
    <div className="tactical-panel p-4 border border-tactical-border animate-pulse motion-reduce:animate-none" aria-hidden>
      <div className="h-4 w-16 rounded-full bg-tactical-raised mb-4" />
      <div className="h-5 w-2/3 rounded bg-tactical-raised mb-2" />
      <div className="h-3 w-20 rounded bg-tactical-raised mb-5" />
      <div className="flex gap-2">
        <div className="h-8 flex-1 rounded-md bg-tactical-raised" />
        <div className="h-8 flex-1 rounded-md bg-tactical-raised" />
      </div>
    </div>
  );
}

export default function GameArenaPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [now, setNow] = useState(Date.now());
  const offsetRef = useRef(0);

  const fetchLive = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/games/live');
      setMatches((res.data?.matches ?? []) as LiveMatch[]);
      if (res.data?.server_time) {
        offsetRef.current = new Date(res.data.server_time).getTime() - Date.now();
      }
    } catch {
      /* the rail just stays empty on transient errors */
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchLive();
    const id = setInterval(fetchLive, POLL_MS);
    return () => clearInterval(id);
  }, [fetchLive]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const join = () => {
    const code = joinCode.trim().toUpperCase();
    if (code) navigate(`/editor/game/${code}`);
  };

  const serverNowMs = now + offsetRef.current;
  const liveCount = matches.filter((m) => m.status === 'running').length;
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: 'easeOut' as const, delay: reduceMotion ? 0 : delay },
  });

  const steps = [
    {
      icon: Share2,
      title: t('arena.step1_title', { defaultValue: 'Host & invite' }),
      body: t('arena.step1_body', { defaultValue: 'Pick a real-world scenario, create the match, and share one link. Players join from any browser; the audience gets a live stage screen.' }),
    },
    {
      icon: Boxes,
      title: t('arena.step2_title', { defaultValue: 'Build under fire' }),
      body: t('arena.step2_body', { defaultValue: 'Design your architecture in the build phase: load balancers, caches, queues, replicas. When the round locks, live traffic hits every player at once.' }),
    },
    {
      icon: Flame,
      title: t('arena.step3_title', { defaultValue: 'Survive chaos, score big' }),
      body: t('arena.step3_body', { defaultValue: 'Outages and slowdowns strike mid-round. Keep latency and errors inside the SLO to build a streak multiplier. Resilience beats raw spend.' }),
    },
  ];

  return (
    <div className="min-h-screen bg-tactical-bg text-tactical-text">
      {/* Top bar: identity + the way back to the main product. */}
      <header className="sticky top-0 z-40 border-b border-tactical-border bg-tactical-bg/95">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-3">
          <a
            href="https://dinamos.net"
            className="flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-cyan rounded-sm"
          >
            <img src="/logo.png" alt="Dinamos" className="h-8 w-auto" />
          </a>
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-signal-cyan border border-signal-cyan/40 rounded px-1.5 py-0.5">
            {t('arena.badge', { defaultValue: 'ARENA' })}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="https://dinamos.net"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-tactical-border text-tactical-dim hover:border-signal-cyan hover:text-signal-cyan font-sans text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-cyan"
            >
              {t('arena.cta_dinamos', { defaultValue: 'Learn on dinamos.net' })}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <Link
              to="/arena/host"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-signal-green text-signal-green hover:bg-signal-green/10 font-sans text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-green"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              {t('arena.cta_host', { defaultValue: 'Host a match' })}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(51 65 85 / 0.45) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-16 lg:pt-24 lg:pb-24">
          {liveCount > 0 && (
            <motion.div {...fadeUp(0)} className="mb-5">
              <a
                href="#live"
                className="inline-flex items-center gap-2 rounded-full border border-signal-green/50 px-3 py-1 font-sans text-xs text-signal-green hover:bg-signal-green/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-green"
              >
                <span className="w-2 h-2 rounded-full bg-signal-green animate-pulse motion-reduce:animate-none" />
                {t('arena.live_chip', { defaultValue: '{{count}} match live right now', count: liveCount })}
              </a>
            </motion.div>
          )}
          <motion.h1
            {...fadeUp(0.08)}
            className="font-sans text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-[1.05] mb-5 [text-wrap:balance]"
          >
            {t('arena.headline', { defaultValue: 'Build systems. Survive chaos.' })}{' '}
            <span className="text-signal-green">{t('arena.headline_accent', { defaultValue: 'Top the leaderboard.' })}</span>
          </motion.h1>
          <motion.p {...fadeUp(0.16)} className="font-sans text-base md:text-lg text-tactical-dim max-w-2xl leading-relaxed mb-8">
            {t('arena.subhead', {
              defaultValue:
                'A real-time multiplayer game where every player architects a distributed system against the same live traffic and the same failures. Black Friday rushes, datacenter outages, viral floods: in your browser, with friends, scored every second.',
            })}
          </motion.p>
          <motion.div {...fadeUp(0.24)} className="flex flex-wrap items-center gap-3">
            <Link
              to="/arena/host"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-signal-green/15 border border-signal-green text-signal-green hover:bg-signal-green/25 font-sans text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-green"
            >
              <Gamepad2 className="w-4 h-4" />
              {t('arena.cta_host', { defaultValue: 'Host a match' })}
            </Link>
            <a
              href="#live"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-tactical-border text-tactical-text hover:border-signal-amber hover:text-signal-amber font-sans text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-amber"
            >
              <MonitorPlay className="w-4 h-4" />
              {t('arena.cta_watch', { defaultValue: 'Watch live matches' })}
            </a>
            <div className="flex items-center gap-0 ml-0 md:ml-2">
              <label htmlFor="arena-join-code" className="sr-only">
                {t('arena.code_ph', { defaultValue: 'MATCH CODE' })}
              </label>
              <input
                id="arena-join-code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && join()}
                placeholder={t('arena.code_ph', { defaultValue: 'MATCH CODE' })}
                maxLength={8}
                className="w-36 bg-tactical-raised border border-tactical-border rounded-l-md px-3 py-3 font-mono text-sm text-tactical-text tracking-widest placeholder:text-tactical-label focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-cyan/70"
              />
              <button
                onClick={join}
                disabled={!joinCode.trim()}
                className="px-4 py-3 rounded-r-md border border-l-0 border-signal-cyan text-signal-cyan hover:bg-signal-cyan/10 font-sans text-sm font-medium transition-colors disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-cyan"
              >
                {t('arena.cta_join', { defaultValue: 'Join' })}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Live now */}
      <div id="live" className="max-w-6xl mx-auto px-6 py-12 scroll-mt-16">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2.5 h-2.5 rounded-full ${matches.length > 0 ? 'bg-signal-green animate-pulse motion-reduce:animate-none' : 'bg-tactical-line'}`} />
          <h2 className="font-sans text-xl font-bold tracking-tight">
            {t('arena.live_title', { defaultValue: 'Happening now' })}
          </h2>
        </div>
        <p className="font-sans text-sm text-tactical-dim mb-5">
          {t('arena.live_sub', { defaultValue: 'Open matches you can watch on the big screen or jump into.' })}
        </p>
        {!loaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MatchCardSkeleton />
            <MatchCardSkeleton />
            <MatchCardSkeleton />
          </div>
        ) : matches.length === 0 ? (
          <div className="border border-dashed border-tactical-border rounded-lg p-8 text-center">
            <Trophy className="w-8 h-8 text-tactical-label mx-auto mb-3" />
            <div className="font-sans text-sm text-tactical-dim mb-4">
              {t('arena.no_live', { defaultValue: 'No live matches right now. Be the one who starts the next game.' })}
            </div>
            <Link
              to="/arena/host"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-signal-green text-signal-green hover:bg-signal-green/10 font-sans text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-green"
            >
              <Gamepad2 className="w-4 h-4" /> {t('arena.cta_host', { defaultValue: 'Host a match' })}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((m) => (
              <MatchCard key={m.code} m={m} serverNowMs={serverNowMs} />
            ))}
          </div>
        )}
      </div>

      {/* How it works: a real sequence, rendered as one. */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="font-sans text-xl font-bold tracking-tight mb-5">
          {t('arena.how_title', { defaultValue: 'How a match works' })}
        </h2>
        <div className="tactical-panel divide-y divide-tactical-border">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-5 p-5 md:p-6">
              <div className="shrink-0 w-10 text-right">
                <span className="font-mono text-2xl font-bold text-signal-cyan/80 tabular-nums leading-none">{i + 1}</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <s.icon className="w-4 h-4 text-signal-cyan" />
                  <span className="font-sans text-base font-bold text-tactical-text">{s.title}</span>
                </div>
                <p className="font-sans text-sm text-tactical-dim leading-relaxed max-w-2xl">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario library: dense rows, engineer-native. */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="font-sans text-xl font-bold tracking-tight mb-1">
          {t('arena.scenarios_title', { defaultValue: 'Battle-tested scenarios' })}
        </h2>
        <p className="font-sans text-sm text-tactical-dim mb-5">
          {t('arena.scenarios_sub', { defaultValue: 'Every match replays a real operational incident: scripted traffic, scripted failures, tuned scoring.' })}
        </p>
        <div className="tactical-panel divide-y divide-tactical-border">
          {MATCH_SCENARIOS.map((s) => {
            const chaosCount = s.rounds.reduce((acc, r) => acc + r.chaosEvents.length, 0);
            const totalMin = Math.round(s.rounds.reduce((acc, r) => acc + r.durationSec + r.intervalSec, 0) / 60);
            return (
              <div key={s.id} className="p-5 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 hover:bg-tactical-raised/30 transition-colors">
                <div className="md:w-52 shrink-0 font-sans text-base font-bold text-tactical-text">{s.name}</div>
                <p className="flex-1 font-sans text-sm text-tactical-dim leading-relaxed">{s.description}</p>
                <div className="flex items-center gap-4 font-sans text-[11px] text-tactical-label shrink-0 md:justify-end">
                  <span className="inline-flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" /> {s.rounds.length} {t('arena.rounds', { defaultValue: 'rounds' })}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-signal-amber" /> {chaosCount} {t('arena.chaos_events', { defaultValue: 'chaos events' })}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono tabular-nums">~{totalMin} min</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing CTA */}
      <div className="max-w-6xl mx-auto px-6 pb-16 pt-4">
        <div className="tactical-panel border border-signal-green/40 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <div className="font-sans text-2xl font-bold tracking-tight mb-1">
              {t('arena.closing_title', { defaultValue: 'Your move, architect.' })}
            </div>
            <p className="font-sans text-sm text-tactical-dim max-w-xl">
              {t('arena.closing_sub', { defaultValue: 'Free, in the browser, no setup. Host a match for your team, your class, or your meetup, and put the audience screen on the projector.' })}
            </p>
          </div>
          <Link
            to="/arena/host"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-signal-green/15 border border-signal-green text-signal-green hover:bg-signal-green/25 font-sans text-sm font-bold transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-green"
          >
            {t('arena.cta_host', { defaultValue: 'Host a match' })}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Footer: route back to the learning platform. */}
      <footer className="border-t border-tactical-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center gap-3">
          <span className="font-sans text-xs text-tactical-dim">
            {t('arena.footer_tag', { defaultValue: 'The Arena runs on Dinamos, the free hands-on platform for distributed systems.' })}
          </span>
          <a
            href="https://dinamos.net"
            className="sm:ml-auto inline-flex items-center gap-1.5 font-sans text-xs font-medium text-signal-cyan hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-cyan"
          >
            {t('arena.footer_cta', { defaultValue: 'Explore the lessons on dinamos.net' })}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </footer>
    </div>
  );
}
