import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Boxes,
  Gauge,
  Globe,
  ShieldCheck,
  Network,
  DatabaseZap,
  Activity,
  GitBranch,
  ChevronDown,
  Cpu,
  Layers,
  Beaker,
  Sparkles,
  Check,
} from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { LanguageSwitcher, Footer } from '../Common';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import Reveal from './landing/Reveal';
import CountUp from './landing/CountUp';
import LiveSystemPanel from './landing/LiveSystemPanel';
import SystemTopology from './landing/SystemTopology';

const REPO_URL = 'https://github.com/flaviojmendes/dinamos';

// Brand mark for the Google OAuth button.
function GoogleMark({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
    </svg>
  );
}

// Brand mark for the GitHub OAuth button.
function GithubMark({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// Reusable section heading with optional accent kicker. Centered, mono display.
function SectionHeading({
  kicker,
  kickerColor = 'text-emerald-600 dark:text-signal-green',
  title,
  subtitle,
}: {
  kicker?: string;
  kickerColor?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {kicker && (
        <div className={`mb-4 inline-flex items-center gap-2 ${kickerColor}`}>
          <span className="h-px w-6 bg-current opacity-60" aria-hidden="true" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]">{kicker}</span>
          <span className="h-px w-6 bg-current opacity-60" aria-hidden="true" />
        </div>
      )}
      <h2 className="text-balance font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-tactical-text sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-pretty font-sans text-lg leading-relaxed text-slate-600 dark:text-tactical-dim">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const reduce = useReducedMotion();
  const [signingIn, setSigningIn] = useState<null | 'google' | 'github'>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Top page-scroll progress bar.
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // Scroll-fill spine for the learning-journey timeline.
  const journeyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: journeyProgress } = useScroll({
    target: journeyRef,
    offset: ['start 75%', 'end 55%'],
  });
  const spineScale = useSpring(journeyProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });

  const handleSignIn = async (provider: 'google' | 'github') => {
    if (signingIn) return;
    setAuthError(null);
    setSigningIn(provider);
    try {
      trackEvent('User', `Landing sign in with ${provider}`);
      if (provider === 'google') await signInWithGoogle();
      else await signInWithGithub();
    } catch {
      setAuthError(t(provider === 'google' ? 'auth.error_google' : 'auth.error_github'));
    } finally {
      setSigningIn(null);
    }
  };

  const SignInButtons = ({ compact = false }: { compact?: boolean }) => (
    <div className="flex flex-col gap-2.5">
      <button
        onClick={() => handleSignIn('google')}
        disabled={signingIn !== null}
        className="group/btn w-full inline-flex items-center justify-center gap-3 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-black py-3 px-4 font-sans text-sm font-semibold hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {signingIn === 'google' ? (
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <GoogleMark />
        )}
        {t('auth.login_google')}
      </button>
      <button
        onClick={() => handleSignIn('github')}
        disabled={signingIn !== null}
        className="w-full inline-flex items-center justify-center gap-3 rounded-lg bg-transparent border border-slate-300 dark:border-tactical-line text-slate-900 dark:text-tactical-text py-3 px-4 font-sans text-sm font-semibold hover:border-slate-900 dark:hover:border-signal-green hover:bg-slate-100 dark:hover:bg-tactical-raised transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {signingIn === 'github' ? (
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <GithubMark />
        )}
        {t('auth.login_github')}
      </button>
      {!compact && (
        <p className="mt-1 font-sans text-[11px] text-slate-400 dark:text-tactical-label">
          {t('landing.hero_trust')}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark text-slate-900 dark:text-slate-100">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-emerald-500 dark:bg-signal-green"
        style={{ scaleX: progressScale }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-tactical-bg/85 backdrop-blur-xl border-b border-slate-200 dark:border-tactical-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Dinamos" className="h-10" />
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher />
              <a
                href="#signin"
                onClick={() => trackEvent('User', 'Header Sign In click')}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-signal-green hover:bg-slate-700 dark:hover:opacity-90 text-white dark:text-black px-4 py-2 text-sm font-sans font-semibold transition-colors cursor-pointer"
              >
                {t('landing.header_signin')}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-grid" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-transparent dark:from-signal-green/10 dark:via-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl dark:bg-signal-green/10"
          aria-hidden="true"
        />
        {/* floating packets */}
        {!reduce && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {[
              { left: '12%', dur: 7, delay: 0, color: 'bg-signal-cyan/40' },
              { left: '38%', dur: 9, delay: 1.5, color: 'bg-signal-green/40' },
              { left: '67%', dur: 8, delay: 0.8, color: 'bg-signal-amber/40' },
              { left: '85%', dur: 10, delay: 2.2, color: 'bg-signal-cyan/30' },
            ].map((p, i) => (
              <motion.span
                key={i}
                className={`absolute h-1.5 w-1.5 rounded-full ${p.color}`}
                style={{ left: p.left, top: '-5%' }}
                animate={{ y: ['0vh', '110vh'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
              />
            ))}
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 lg:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Left: message + sign in */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 dark:border-signal-green/30 dark:bg-signal-green/5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-signal-green opacity-75 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600 dark:bg-signal-green" />
                </span>
                <span className="font-sans text-[11px] font-medium text-slate-600 dark:text-signal-green">
                  {t('landing.hero_eyebrow')}
                </span>
              </div>

              <h1 className="text-balance font-mono text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 dark:text-tactical-text sm:text-5xl lg:text-[3.4rem]">
                {t('landing.hero_title')}
              </h1>
              <p className="mt-5 mb-8 max-w-xl text-pretty font-sans text-lg leading-relaxed text-slate-600 dark:text-tactical-dim md:text-xl">
                {t('landing.hero_subtitle')}
              </p>

              <div id="signin" className="tactical-panel p-5 max-w-md scroll-mt-24">
                <p className="font-sans text-sm font-semibold text-slate-900 dark:text-tactical-text">
                  {t('landing.signin_title')}
                </p>
                <p className="mt-1 mb-4 font-sans text-sm text-slate-500 dark:text-tactical-dim">
                  {t('landing.signin_subtitle')}
                </p>

                {authError && (
                  <div className="mb-3 rounded-lg border border-signal-red/50 bg-signal-red/10 px-3 py-2 font-sans text-xs text-signal-red">
                    {authError}
                  </div>
                )}

                <SignInButtons />

                <Link
                  to="/intro"
                  onClick={() => trackEvent('User', 'Clicked on Explore Content (hero)')}
                  className="mt-3 inline-flex items-center gap-1.5 font-sans text-sm text-slate-500 hover:text-slate-900 dark:text-tactical-dim dark:hover:text-signal-green transition-colors cursor-pointer"
                >
                  {t('landing.hero_explore')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Right: live system console */}
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <LiveSystemPanel />
              <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-signal-green/30 dark:bg-tactical-surface">
                <Gauge className="w-4 h-4 text-emerald-600 dark:text-signal-green" />
                <span className="font-mono text-xs text-slate-700 dark:text-tactical-text">
                  {t('landing.hero_uptime')}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Scroll hint */}
          <div className="mt-16 flex justify-center">
            <motion.div
              className="flex flex-col items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-tactical-label"
              animate={reduce ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              {t('landing.scroll_hint')}
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================ STATS ============================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Reveal
          className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 dark:border-tactical-border dark:bg-tactical-border"
        >
          {[
            { Icon: Boxes, value: t('landing.stat_simulators_value'), label: t('landing.stat_simulators_label'), color: 'text-signal-cyan' },
            { Icon: Globe, value: t('landing.stat_cases_value'), label: t('landing.stat_cases_label'), color: 'text-signal-amber' },
            { Icon: Gauge, value: t('landing.stat_scale_value'), label: t('landing.stat_scale_label'), color: 'text-emerald-600 dark:text-signal-green' },
            { Icon: ShieldCheck, value: t('landing.stat_price_value'), label: t('landing.stat_price_label'), color: 'text-emerald-600 dark:text-signal-green' },
          ].map(({ Icon, value, label, color }, i) => (
            <div key={i} className="bg-white dark:bg-tactical-surface px-5 py-6">
              <Icon className={`w-5 h-5 mb-3 ${color}`} />
              <div className="font-mono text-3xl font-bold text-slate-900 dark:text-tactical-text tabular-nums">
                <CountUp value={value} />
              </div>
              <div className="mt-1 font-sans text-xs text-slate-500 dark:text-tactical-dim">{label}</div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ===================== TOPOLOGY SHOWCASE ===================== */}
      <section className="relative overflow-hidden border-y border-slate-200 bg-white/60 dark:border-tactical-border dark:bg-tactical-surface/30">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Reveal>
            <SectionHeading
              kicker={t('landing.topology_label')}
              kickerColor="text-signal-cyan"
              title={t('landing.topology_title')}
              subtitle={t('landing.topology_subtitle')}
            />
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <div className="tactical-panel scanline overflow-hidden p-4 sm:p-8">
              <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-tactical-border">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-signal-cyan" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-tactical-label">
                    topology.live
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 dark:text-signal-green">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-signal-green" />
                  routing
                </span>
              </div>
              <SystemTopology
                copy={{
                  nodeClient: t('landing.topology_node_client'),
                  nodeLb: t('landing.topology_node_lb'),
                  nodeCache: t('landing.topology_node_cache'),
                  nodeDb: t('landing.topology_node_db'),
                }}
              />
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: GitBranch, color: 'text-signal-green', border: 'hover:border-signal-green/50', title: t('landing.topology_card1_title'), text: t('landing.topology_card1_text') },
              { Icon: DatabaseZap, color: 'text-signal-amber', border: 'hover:border-signal-amber/50', title: t('landing.topology_card2_title'), text: t('landing.topology_card2_text') },
              { Icon: Activity, color: 'text-signal-red', border: 'hover:border-signal-red/50', title: t('landing.topology_card3_title'), text: t('landing.topology_card3_text') },
              { Icon: Layers, color: 'text-signal-cyan', border: 'hover:border-signal-cyan/50', title: t('landing.topology_card4_title'), text: t('landing.topology_card4_text') },
            ].map(({ Icon, color, border, title, text }, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className={`tactical-panel h-full p-5 transition-colors ${border}`}>
                  <Icon className={`mb-3 h-5 w-5 ${color}`} />
                  <h3 className="mb-1.5 font-sans text-base font-semibold text-slate-900 dark:text-tactical-text">{title}</h3>
                  <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Reveal>
          <SectionHeading
            kicker={t('landing.features_label')}
            title={t('landing.features_title')}
            subtitle={t('landing.features_subtitle')}
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { Icon: Cpu, accent: 'text-brand-600 dark:text-signal-cyan', border: 'hover:border-signal-cyan/50', tile: 'border-signal-cyan/40 bg-signal-cyan/5 group-hover:bg-signal-cyan/10', bullet: 'text-signal-cyan', title: t('landing.fundamentals_title'), prefix: 'fundamentals' },
            { Icon: Beaker, accent: 'text-emerald-700 dark:text-signal-green', border: 'hover:border-signal-green/50', tile: 'border-signal-green/40 bg-signal-green/5 group-hover:bg-signal-green/10', bullet: 'text-emerald-600 dark:text-signal-green', title: t('landing.simulators_title'), prefix: 'simulators' },
            { Icon: Globe, accent: 'text-slate-800 dark:text-signal-red', border: 'hover:border-signal-red/50', tile: 'border-signal-red/40 bg-signal-red/5 group-hover:bg-signal-red/10', bullet: 'text-signal-red', title: t('landing.real_cases_title'), prefix: 'real_cases' },
          ].map(({ Icon, accent, border, tile, bullet, title, prefix }, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className={`group tactical-panel h-full p-6 transition-colors ${border}`}>
                <div className={`mb-4 flex h-12 w-12 items-center justify-center border ${tile} transition-colors`}>
                  <Icon className={`h-6 w-6 ${accent}`} />
                </div>
                <h3 className={`mb-3 font-mono text-xl font-semibold tracking-tight ${accent}`}>{title}</h3>
                <ul className="space-y-2 font-sans text-sm text-slate-600 dark:text-tactical-dim">
                  {[1, 2, 3, 4].map((n) => (
                    <li key={n} className="flex items-center gap-2">
                      <span className={bullet}>▸</span>
                      {t(`landing.${prefix}_item${n}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== SIMULATOR SHOWCASE ===================== */}
      <section className="relative border-y border-slate-200 bg-white/60 dark:border-tactical-border dark:bg-tactical-surface/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Reveal>
            <SectionHeading
              kicker={t('landing.showcase_label')}
              kickerColor="text-signal-amber"
              title={t('landing.simulators_title')}
              subtitle={t('landing.simulators_subtitle')}
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { src: '/cache.gif', accent: 'text-brand-600 dark:text-signal-cyan', border: 'hover:border-signal-cyan/50', title: t('landing.simulators_item1'), desc: t('landing.simulators_item1_description') },
              { src: '/circuit.gif', accent: 'text-emerald-700 dark:text-signal-green', border: 'hover:border-signal-green/50', title: t('landing.simulators_item2'), desc: t('landing.simulators_item2_description') },
              { src: '/loadbalancer.gif', accent: 'text-amber-700 dark:text-signal-amber', border: 'hover:border-signal-amber/50', title: t('landing.simulators_item3'), desc: t('landing.simulators_item3_description') },
            ].map(({ src, accent, border, title, desc }, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={reduce ? undefined : { y: -6 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`group tactical-panel h-full overflow-hidden p-3 transition-colors ${border}`}
                >
                  <div className="relative mb-4 aspect-video overflow-hidden rounded-lg border border-slate-200 dark:border-tactical-border">
                    <img
                      src={src}
                      alt={title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
                  </div>
                  <div className="px-3 pb-2">
                    <h3 className={`mb-2 font-mono text-lg font-semibold tracking-tight ${accent}`}>{title}</h3>
                    <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">{desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== LEARNING JOURNEY ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Reveal>
          <SectionHeading
            kicker={t('landing.journey_label')}
            title={t('landing.journey_title')}
            subtitle={t('landing.journey_subtitle')}
          />
        </Reveal>

        <div ref={journeyRef} className="relative mt-14">
          {/* spine track + scroll-driven fill */}
          <div className="absolute left-[19px] top-0 bottom-0 hidden w-px bg-slate-200 dark:bg-tactical-border lg:left-1/2 lg:block lg:-translate-x-1/2" aria-hidden="true" />
          <motion.div
            className="absolute left-[19px] top-0 hidden w-px origin-top bg-emerald-500 dark:bg-signal-green lg:left-1/2 lg:block lg:-translate-x-1/2"
            style={{ scaleY: spineScale, height: '100%' }}
            aria-hidden="true"
          />

          <div className="space-y-10 lg:space-y-16">
            {[
              { prefix: 'fundamentals', color: 'signal-cyan', accent: 'text-brand-600 dark:text-signal-cyan', dot: 'bg-signal-cyan', Icon: Layers },
              { prefix: 'design_principles', color: 'signal-green', accent: 'text-emerald-700 dark:text-signal-green', dot: 'bg-signal-green', Icon: GitBranch },
              { prefix: 'advanced_topics', color: 'signal-amber', accent: 'text-amber-700 dark:text-signal-amber', dot: 'bg-signal-amber', Icon: Cpu },
              { prefix: 'real_cases', color: 'signal-red', accent: 'text-slate-800 dark:text-signal-red', dot: 'bg-signal-red', Icon: Globe },
            ].map((step, idx) => {
              const isRight = idx % 2 === 1;
              return (
                <Reveal key={step.prefix} from={isRight ? 'left' : 'right'} repeat>
                  <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12">
                    {/* step number marker */}
                    <div className="absolute left-0 top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white font-mono text-sm font-bold text-slate-900 dark:border-tactical-border dark:bg-tactical-surface dark:text-tactical-text lg:left-1/2 lg:-translate-x-1/2">
                      {String(idx + 1).padStart(2, '0')}
                      <span className={`absolute inset-0 -z-10 rounded-full ${step.dot} opacity-20 blur-[6px]`} aria-hidden="true" />
                    </div>

                    {/* content card */}
                    <div className={`pl-16 lg:pl-0 ${isRight ? 'lg:order-2 lg:pl-12' : 'lg:order-1 lg:pr-12 lg:text-right'}`}>
                      <h3 className={`mb-3 font-mono text-2xl font-bold tracking-tight ${step.accent}`}>
                        {t(`landing.journey_${step.prefix}_title`)}
                      </h3>
                      <ul className="space-y-2 font-sans text-sm">
                        {[1, 2, 3].map((n) => (
                          <li
                            key={n}
                            className={`flex items-center gap-2 ${isRight ? '' : 'lg:flex-row-reverse'}`}
                          >
                            <span className={step.accent}>▸</span>
                            <span className="text-slate-600 dark:text-tactical-dim">
                              {t(`landing.journey_${step.prefix}_item${n}`)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* illustration panel */}
                    <div className={`pl-16 lg:pl-0 ${isRight ? 'lg:order-1 lg:pr-12' : 'lg:order-2 lg:pl-12'}`}>
                      <div className="tactical-panel p-6">
                        <step.Icon className={`mb-4 h-10 w-10 ${step.accent}`} />
                        <p className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
                          {t(`landing.journey_${step.prefix}_description`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== TEACHER ===================== */}
      <section className="relative border-y border-slate-200 bg-white/60 dark:border-tactical-border dark:bg-tactical-surface/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Reveal>
            <SectionHeading title={t('landing.teacher_title')} />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <Reveal from="right">
                <div className="tactical-panel p-6">
                  <h3 className="mb-4 font-mono text-xl font-bold text-brand-600 dark:text-signal-cyan">
                    {t('landing.teacher_experience_title')}
                  </h3>
                  <ul className="space-y-3 font-sans text-sm">
                    {[1, 2, 3].map((n) => (
                      <li key={n} className="flex items-start gap-3 text-slate-600 dark:text-tactical-dim">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-signal-cyan" />
                        <span>{t(`landing.teacher_experience_item${n}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal from="right" delay={0.1}>
                <div className="tactical-panel p-6">
                  <h3 className="mb-4 font-mono text-xl font-bold text-emerald-700 dark:text-signal-green">
                    {t('landing.teacher_specialties_title')}
                  </h3>
                  <ul className="space-y-3 font-sans text-sm">
                    {[1, 2, 3].map((n) => (
                      <li key={n} className="flex items-start gap-3 text-slate-600 dark:text-tactical-dim">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-signal-green" />
                        <span>{t(`landing.teacher_specialties_item${n}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal from="left" delay={0.1}>
              <div className="tactical-panel relative overflow-hidden p-8">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-signal-green/10 blur-2xl" aria-hidden="true" />
                <div className="relative space-y-6">
                  {[1, 2, 3].map((n) => (
                    <p key={n} className="font-sans text-sm leading-relaxed text-slate-600 dark:text-tactical-dim">
                      {t(`landing.teacher_about_me_text${n}`)}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== FREE / PRICING ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700 dark:border-signal-green/40 dark:bg-signal-green/5 dark:text-signal-green">
              <Sparkles className="h-4 w-4" />
              <span className="font-sans font-semibold">{t('landing.free_badge')}</span>
            </div>
            <h2 className="font-mono text-3xl font-bold tracking-tight text-emerald-700 dark:text-signal-green sm:text-4xl">
              {t('landing.free_title')}
            </h2>
            <p className="mt-4 font-sans text-lg leading-relaxed text-slate-600 dark:text-tactical-dim">
              {t('landing.free_subtitle')}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <Reveal from="right">
            <div className="tactical-panel relative overflow-hidden border-signal-green/40 p-8 transition-colors hover:border-signal-green">
              <div className="absolute right-0 top-0">
                <span className="rounded-bl-lg bg-emerald-500 px-4 py-2 font-sans text-xs font-semibold text-white dark:bg-signal-green dark:text-black">
                  100% {t('landing.free_badge')}
                </span>
              </div>
              <div className="py-8 text-center">
                <div className="mb-4 font-mono text-6xl font-bold text-slate-900 dark:text-tactical-text">
                  {t('landing.free_price')}
                </div>
                <p className="mx-auto mb-8 max-w-sm font-sans text-base text-slate-600 dark:text-tactical-dim">
                  {t('landing.free_description')}
                </p>
                <Link
                  to="/intro"
                  onClick={() => trackEvent('User', 'Clicked on Free Access Button')}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-3 font-sans text-lg font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-signal-green dark:text-black dark:hover:opacity-90"
                >
                  {t('common.start_now')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal from="left" delay={0.1} className="space-y-6">
            <div className="tactical-panel p-6">
              <h4 className="mb-4 flex items-center gap-2 font-mono text-lg font-semibold text-brand-600 dark:text-signal-cyan">
                <Check className="h-5 w-5" />
                {t('landing.what_you_receive_title')}
              </h4>
              <ul className="space-y-3 font-sans text-sm">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n} className="flex items-start gap-3 text-slate-600 dark:text-tactical-dim">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-signal-green" />
                    <span>{t(`landing.what_you_receive_item${n}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="tactical-panel p-6">
              <h4 className="mb-4 flex items-center gap-2 font-mono text-lg font-semibold text-amber-700 dark:text-signal-amber">
                <Sparkles className="h-5 w-5" />
                {t('landing.differentials_title')}
              </h4>
              <ul className="space-y-3 font-sans text-sm">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n} className="flex items-start gap-3 text-slate-600 dark:text-tactical-dim">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-signal-green" />
                    <span>{t(`landing.differentials_item${n}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== OPEN SOURCE ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <Reveal>
          <div className="tactical-panel relative overflow-hidden p-6 transition-colors hover:border-signal-cyan/50 sm:p-8">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-signal-cyan/10 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-signal-cyan/40 bg-signal-cyan/5 text-brand-600 dark:text-signal-cyan">
                  <GithubMark className="h-6 w-6" />
                </div>
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 text-brand-600 dark:text-signal-cyan">
                    <span className="h-px w-6 bg-current opacity-60" aria-hidden="true" />
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]">
                      {t('landing.open_source_label')}
                    </span>
                  </div>
                  <h2 className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-tactical-text sm:text-3xl">
                    {t('landing.open_source_title')}
                  </h2>
                  <p className="mt-3 max-w-xl text-pretty font-sans text-base leading-relaxed text-slate-600 dark:text-tactical-dim">
                    {t('landing.open_source_subtitle')}
                  </p>
                  <code className="mt-4 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-500 dark:border-tactical-border dark:bg-tactical-bg dark:text-tactical-label">
                    <span className="text-signal-cyan" aria-hidden="true">$</span>
                    github.com/flaviojmendes/dinamos
                  </code>
                </div>
              </div>

              <div className="flex w-full flex-col items-stretch gap-2.5 sm:w-auto sm:flex-shrink-0">
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('User', 'Clicked on Open Source Repo (landing)')}
                  className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-slate-900 px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-black dark:hover:bg-slate-200"
                >
                  <GithubMark className="h-5 w-5" />
                  {t('landing.open_source_cta')}
                </a>
                <span className="inline-flex items-center justify-center gap-1.5 font-mono text-[11px] text-slate-400 dark:text-tactical-label">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-signal-green" aria-hidden="true" />
                  {t('landing.open_source_contribute')}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Reveal>
          <div className="tactical-panel scanline relative overflow-hidden border-emerald-200 p-8 text-center dark:border-signal-green/40 sm:p-12">
            <div className="absolute inset-0 bg-grid opacity-50" aria-hidden="true" />
            <div className="pointer-events-none absolute -top-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-3xl dark:bg-signal-green/15" aria-hidden="true" />
            <div className="relative mx-auto max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700 dark:border-signal-green/40 dark:bg-signal-green/5 dark:text-signal-green">
                <Check className="h-4 w-4" />
                <span className="font-sans font-semibold">100% {t('landing.free_badge')}</span>
              </div>
              <h2 className="mb-4 font-mono text-3xl font-bold tracking-tight text-slate-900 dark:text-tactical-text">
                {t('landing.cta_free_title')}
              </h2>
              <p className="mb-8 font-sans text-lg text-slate-600 dark:text-tactical-dim">
                {t('landing.cta_free_subtitle')}
              </p>

              {authError && (
                <div className="mx-auto mb-4 max-w-sm rounded-lg border border-signal-red/50 bg-signal-red/10 px-3 py-2 font-sans text-xs text-signal-red">
                  {authError}
                </div>
              )}
              <div className="mx-auto max-w-sm">
                <SignInButtons compact />
              </div>
              <Link
                to="/intro"
                onClick={() => trackEvent('User', 'Clicked on Final CTA - Free')}
                className="mt-4 inline-flex items-center gap-1.5 font-sans text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-tactical-dim dark:hover:text-signal-green"
              >
                {t('landing.hero_explore')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
