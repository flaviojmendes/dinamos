import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { trackEvent } from '../../utils/analytics';
import Countdown from '../Countdown/Countdown';
import { Typography, LanguageSwitcher, CouponModal, Footer } from '../Common';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { getTopics, ForumTopic } from '../../services/forumService';
import ChallengesSection from '../Forum/ChallengesSection';
import { Panel, Tag, TacticalButton } from '../tactical';

// Category badge accent colors for forum topics (tactical signal palette).
const categoryColors: Record<string, string> = {
  'Dúvida': 'text-signal-cyan',
  'Brainstorm': 'text-signal-green',
  'Ajuda': 'text-signal-amber',
};

// Format relative time for forum topics
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  return date.toLocaleDateString();
}

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const { user, isSubscribed } = useAuth();
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [latestTopics, setLatestTopics] = useState<ForumTopic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);

  // Fetch latest forum topics for logged-in users (subscribed or not)
  useEffect(() => {
    async function fetchLatestTopics() {
      if (!user) return;
      
      setLoadingTopics(true);
      try {
        const data = await getTopics({ sort: 'recent', limit: 5 });
        setLatestTopics(data.topics);
      } catch (err) {
        console.error('Failed to fetch forum topics:', err);
      } finally {
        setLoadingTopics(false);
      }
    }
    
    fetchLatestTopics();
  }, [user]);
  
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark text-slate-900 dark:text-slate-100">
        {/* Header - Only show for logged-out users */}
        {!user && (
          <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center">
                  <img src="/logo.png" alt="Logo" className="h-10" />
                </Link>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                </div>
              </div>
            </div>
          </header>
        )}
  
        {/* Hero Section */}
        <div className={`relative overflow-hidden ${!user ? 'pt-20' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent dark:from-signal-green/5" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 dark:border-tactical-border dark:bg-tactical-surface">
                <span className="font-sans text-[11px] text-slate-600 dark:text-tactical-dim">Distributed systems learning platform</span>
              </div>
              <Typography 
                variant="h1" 
                className="mb-6 font-sans tracking-tight text-slate-900 dark:text-tactical-text"
              >
                {t('landing.hero_title')}
              </Typography>
              <Typography 
                variant="p" 
                className="text-xl md:text-2xl text-slate-600 dark:text-tactical-dim mb-8 max-w-3xl mx-auto"
              >
                {t('landing.hero_subtitle')}
              </Typography>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/intro"
                  onClick={() => trackEvent('User', 'Clicked on Start Now Button')}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-200 text-white dark:text-black px-8 py-3 text-lg font-sans font-medium transition-colors"
                >
                  <span>{t('common.start_now')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/intro"
                  className="inline-flex items-center gap-2 rounded-lg bg-transparent border border-slate-300 dark:border-tactical-line hover:border-slate-900 dark:hover:border-signal-green text-slate-900 dark:text-tactical-text px-8 py-3 text-lg font-sans font-medium transition-colors"
                >
                  <span>{t('common.view_content')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

      {/* Free Editor Promo Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
        <div className="tactical-panel rounded-lg border-signal-green/40 p-6 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-emerald-600 dark:text-signal-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h3m4 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-sans font-semibold text-emerald-700 dark:text-signal-green">{t('common.free_editor')}</span>
            <Tag color="green">{t('landing.free_badge')}</Tag>
          </div>
          <div className="font-sans text-slate-600 dark:text-tactical-dim mb-4">
            {t('common.access_free_editor')}
          </div>
          <Link to="/editor">
            <TacticalButton variant="primary" size="lg">
              {t('common.access_free_editor')}
            </TacticalButton>
          </Link>
        </div>
      </div>

      {/* Latest Forum Topics - For all logged-in users */}
      {user && latestTopics.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 dark:border-signal-green/40 dark:bg-signal-green/5">
                  <svg className="w-5 h-5 text-signal-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-sans text-xl font-bold text-slate-900 dark:text-tactical-text">{t('landing.forum_section.title')}</h2>
                  <p className="font-sans text-sm text-slate-500 dark:text-tactical-dim">{t('landing.forum_section.subtitle')}</p>
                </div>
              </div>
              <Link
                to="/forum"
                className="flex items-center gap-1 font-sans text-brand-600 hover:opacity-80 text-sm transition-opacity dark:text-signal-green"
              >
                {t('landing.forum_section.view_all')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestTopics.slice(0, 3).map((topic, index) => {
                const categoryColor = categoryColors[topic.category] || 'text-slate-400 dark:text-tactical-label';
                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to="/forum"
                      className="block tactical-panel p-4 hover:border-signal-green/50 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        {topic.author.avatar_image ? (
                          <img
                            src={topic.author.avatar_image}
                            alt={topic.author.nickname}
                            className="w-8 h-8 object-cover border"
                            style={{ borderColor: topic.author.role_color }}
                          />
                        ) : (
                          <div
                            className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-sans font-semibold"
                            style={{ backgroundColor: topic.author.role_color }}
                          >
                            {topic.author.nickname.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-sans ${categoryColor}`}>
                              {topic.category}
                            </span>
                            <span className="font-sans text-slate-400 dark:text-tactical-label text-xs tabular-nums">
                              {formatRelativeTime(topic.created_at)}
                            </span>
                          </div>
                          <h3 className="font-sans font-medium text-slate-900 dark:text-tactical-text truncate group-hover:text-brand-600 dark:group-hover:text-signal-green transition-colors">
                            {topic.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-xs font-sans">
                            <span className="text-slate-500 dark:text-tactical-dim">
                              {topic.author.nickname}
                            </span>
                            <span className="text-slate-300 dark:text-tactical-label">•</span>
                            <span className="flex items-center gap-1 text-slate-400 dark:text-tactical-label">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                              {topic.upvotes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            
            {latestTopics.length > 3 && (
              <div className="mt-4 text-center">
                <Link to="/forum">
                  <TacticalButton variant="secondary">
                    {t('landing.forum_section.see_more').replace('{{count}}', (latestTopics.length - 3).toString())}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </TacticalButton>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Challenges Section - For logged-in users */}
      {user && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ChallengesSection />
        </div>
      )}

      {/* Key Features Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <Typography 
            variant="h2" 
            className="mb-6 font-sans tracking-tight text-slate-900 dark:text-tactical-text"
          >
            {t('landing.features_title')}
          </Typography>
          <Typography 
            variant="p" 
            className="text-xl text-slate-600 dark:text-slate-400"
          >
            {t('landing.features_subtitle')}
          </Typography>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Fundamentals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group tactical-panel p-6 hover:border-signal-cyan/50 transition-colors"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 border border-signal-cyan/40 bg-signal-cyan/5 group-hover:bg-signal-cyan/10 transition-colors">
              <svg className="w-6 h-6 text-signal-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <Typography variant="h3" className="mb-3 font-sans text-brand-600 dark:text-signal-cyan">
              {t('landing.fundamentals_title')}
            </Typography>
            <ul className="space-y-2 font-sans text-sm text-slate-600 dark:text-tactical-dim">
              {[1, 2, 3, 4].map((n) => (
                <li key={n} className="flex items-center gap-2">
                  <span className="text-signal-cyan">▸</span>
                  {t(`landing.fundamentals_item${n}`)}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Interactive Learning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="group tactical-panel p-6 hover:border-signal-green/50 transition-colors"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 border border-signal-green/40 bg-signal-green/5 group-hover:bg-signal-green/10 transition-colors">
              <svg className="w-6 h-6 text-signal-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <Typography variant="h3" className="mb-3 font-sans text-emerald-700 dark:text-signal-green">
              {t('landing.simulators_title')}
            </Typography>
            <ul className="space-y-2 font-sans text-sm text-slate-600 dark:text-tactical-dim">
              {[1, 2, 3, 4].map((n) => (
                <li key={n} className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-signal-green">▸</span>
                  {t(`landing.simulators_item${n}`)}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Real Cases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="group tactical-panel p-6 hover:border-signal-red/50 transition-colors"
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 border border-signal-red/40 bg-signal-red/5 group-hover:bg-signal-red/10 transition-colors">
              <svg className="w-6 h-6 text-signal-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <Typography variant="h3" className="mb-3 font-sans text-slate-800 dark:text-signal-red">
              {t('landing.real_cases_title')}
            </Typography>
            <ul className="space-y-2 font-sans text-sm text-slate-600 dark:text-tactical-dim">
              {[1, 2, 3, 4].map((n) => (
                <li key={n} className="flex items-center gap-2">
                  <span className="text-signal-red">▸</span>
                  {t(`landing.real_cases_item${n}`)}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Learning Roadmap Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <Typography 
            variant="h2" 
            className="mb-6 font-sans tracking-tight text-slate-900 dark:text-tactical-text"
          >
            {t('landing.journey_title')}
          </Typography>
          <Typography 
            variant="p" 
            className="text-xl text-slate-500 dark:text-slate-400"
          >
            {t('landing.journey_subtitle')}
          </Typography>
        </motion.div>

        <div className="relative">
          {/* Connecting Lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-tactical-border transform -translate-x-1/2 hidden lg:block" />
          
          {/* Journey Steps */}
          <div className="space-y-12">
            {/* Fundamentos */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            >
              <div className="lg:text-right order-2 lg:order-1">
                <h3 className="font-sans text-2xl font-bold text-brand-600 dark:text-signal-cyan mb-4">{t('landing.journey_fundamentals_title')}</h3>
                <ul className="space-y-3 font-sans text-sm">
                  {[1, 2, 3].map((n) => (
                    <li key={n} className="flex items-center gap-2 lg:flex-row-reverse">
                      <span className="text-slate-600 dark:text-tactical-dim">{t(`landing.journey_fundamentals_item${n}`)}</span>
                      <span className="text-signal-cyan">▸</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative order-1 lg:order-2">
                <div className="lg:pl-8">
                  <div className="tactical-panel border-l-2 border-l-signal-cyan p-6">
                    <div className="absolute left-0 top-1/2 w-8 h-px bg-signal-cyan hidden lg:block transform -translate-y-1/2" />
                    <div className="absolute left-0 top-1/2 w-2.5 h-2.5 bg-signal-cyan hidden lg:block transform -translate-x-1/2 -translate-y-1/2" />
                    <svg className="w-12 h-12 text-signal-cyan mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim">{t('landing.journey_fundamentals_description')}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Princípios de Design */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            >
              <div className="relative">
                <div className="lg:pr-8">
                  <div className="tactical-panel border-r-2 border-r-signal-green p-6">
                    <div className="absolute right-0 top-1/2 w-8 h-px bg-signal-green hidden lg:block transform -translate-y-1/2" />
                    <div className="absolute right-0 top-1/2 w-2.5 h-2.5 bg-signal-green hidden lg:block transform translate-x-1/2 -translate-y-1/2" />
                    <svg className="w-12 h-12 text-signal-green mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim">{t('landing.journey_design_principles_description')}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-sans text-2xl font-bold text-emerald-700 dark:text-signal-green mb-4">{t('landing.journey_design_principles_title')}</h3>
                <ul className="space-y-3 font-sans text-sm">
                  {[1, 2, 3].map((n) => (
                    <li key={n} className="flex items-center gap-2">
                      <span className="text-signal-green">▸</span>
                      <span className="text-slate-600 dark:text-tactical-dim">{t(`landing.journey_design_principles_item${n}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Tópicos Avançados */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            >
              <div className="lg:text-right order-2 lg:order-1">
                <h3 className="font-sans text-2xl font-bold text-amber-700 dark:text-signal-amber mb-4">{t('landing.journey_advanced_topics_title')}</h3>
                <ul className="space-y-3 font-sans text-sm">
                  {[1, 2, 3].map((n) => (
                    <li key={n} className="flex items-center gap-2 lg:flex-row-reverse">
                      <span className="text-slate-600 dark:text-tactical-dim">{t(`landing.journey_advanced_topics_item${n}`)}</span>
                      <span className="text-signal-amber">▸</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative order-1 lg:order-2">
                <div className="lg:pl-8">
                  <div className="tactical-panel border-l-2 border-l-signal-amber p-6">
                    <div className="absolute left-0 top-1/2 w-8 h-px bg-signal-amber hidden lg:block transform -translate-y-1/2" />
                    <div className="absolute left-0 top-1/2 w-2.5 h-2.5 bg-signal-amber hidden lg:block transform -translate-x-1/2 -translate-y-1/2" />
                    <svg className="w-12 h-12 text-signal-amber mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim">{t('landing.journey_advanced_topics_description')}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Casos Reais */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            >
              <div className="relative">
                <div className="lg:pr-8">
                  <div className="tactical-panel border-r-2 border-r-signal-red p-6">
                    <div className="absolute right-0 top-1/2 w-8 h-px bg-signal-red hidden lg:block transform -translate-y-1/2" />
                    <div className="absolute right-0 top-1/2 w-2.5 h-2.5 bg-signal-red hidden lg:block transform translate-x-1/2 -translate-y-1/2" />
                    <svg className="w-12 h-12 text-signal-red mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim">{t('landing.journey_real_cases_description')}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-sans text-2xl font-bold text-slate-800 dark:text-signal-red mb-4">{t('landing.journey_real_cases_title')}</h3>
                <ul className="space-y-3 font-sans text-sm">
                  {[1, 2, 3].map((n) => (
                    <li key={n} className="flex items-center gap-2">
                      <span className="text-signal-red">▸</span>
                      <span className="text-slate-600 dark:text-tactical-dim">{t(`landing.journey_real_cases_item${n}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Simulator Showcase Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <Typography 
            variant="h2" 
            className="mb-6 font-sans tracking-tight text-slate-900 dark:text-tactical-text"
          >
            {t('landing.simulators_title')}
          </Typography>
          <Typography 
            variant="p" 
            className="text-xl text-slate-500 dark:text-slate-400"
          >
            {t('landing.simulators_subtitle')}
          </Typography>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group tactical-panel p-6 hover:border-signal-cyan/50 transition-colors"
          >
            <div className="relative aspect-video mb-4 overflow-hidden border border-slate-200 dark:border-tactical-border">
              <img 
                src="/cache.gif" 
                alt="Cache Simulator" 
                className="w-full h-full object-cover"
              />
            </div>
            <Typography variant="h3" className="mb-2 font-sans text-brand-600 dark:text-signal-cyan">
              {t('landing.simulators_item1')}
            </Typography>
            <Typography variant="p" className="text-slate-600 dark:text-slate-300">
              {t('landing.simulators_item1_description')}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="group tactical-panel p-6 hover:border-signal-green/50 transition-colors"
          >
            <div className="relative aspect-video mb-4 overflow-hidden border border-slate-200 dark:border-tactical-border">
              <img 
                src="/circuit.gif" 
                alt="Circuit Breaker Simulator" 
                className="w-full h-full object-cover"
              />
            </div>
            <Typography variant="h3" className="mb-2 font-sans text-emerald-700 dark:text-signal-green">
              {t('landing.simulators_item2')}
            </Typography>
            <Typography variant="p" className="text-slate-600 dark:text-slate-300">
              {t('landing.simulators_item2_description')}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="group tactical-panel p-6 hover:border-signal-amber/50 transition-colors"
          >
            <div className="relative aspect-video mb-4 overflow-hidden border border-slate-200 dark:border-tactical-border">
              <img 
                src="/loadbalancer.gif" 
                alt="Load Balancer Simulator" 
                className="w-full h-full object-cover"
              />
            </div>
            <Typography variant="h3" className="mb-2 font-sans text-amber-700 dark:text-signal-amber">
              {t('landing.simulators_item3')}
            </Typography>
            <Typography variant="p" className="text-slate-600 dark:text-slate-300">
              {t('landing.simulators_item3_description')}
            </Typography>
          </motion.div>
        </div>
      </div>

      {/* About Me Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <Typography 
            variant="h2" 
            className="mb-6 font-sans tracking-tight text-slate-900 dark:text-tactical-text"
          >
            {t('landing.teacher_title')}
          </Typography>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="tactical-panel p-6"
            >
              <h3 className="font-sans text-xl font-bold mb-4 text-brand-600 dark:text-signal-cyan">{t('landing.teacher_experience_title')}</h3>
              <ul className="space-y-3 font-sans text-sm">
                <li className="flex items-start gap-3 text-slate-600 dark:text-tactical-dim">
                  <svg className="w-5 h-5 text-signal-cyan mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{t('landing.teacher_experience_item1')}</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600 dark:text-tactical-dim">
                  <svg className="w-5 h-5 text-signal-cyan mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{t('landing.teacher_experience_item2')}</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600 dark:text-tactical-dim">
                  <svg className="w-5 h-5 text-signal-cyan mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>{t('landing.teacher_experience_item3')}</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="tactical-panel p-6"
            >
              <h3 className="font-sans text-xl font-bold mb-4 text-emerald-700 dark:text-signal-green">{t('landing.teacher_specialties_title')}</h3>
              <ul className="space-y-3 font-sans text-sm">
                <li className="flex items-start gap-3 text-slate-600 dark:text-tactical-dim">
                  <svg className="w-5 h-5 text-signal-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>{t('landing.teacher_specialties_item1')}</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600 dark:text-tactical-dim">
                  <svg className="w-5 h-5 text-signal-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{t('landing.teacher_specialties_item2')}</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600 dark:text-tactical-dim">
                  <svg className="w-5 h-5 text-signal-green mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>{t('landing.teacher_specialties_item3')}</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="tactical-panel p-8"
          >
            <div className="space-y-6">
              <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim leading-relaxed">
                {t('landing.teacher_about_me_text1')}
              </p>
              <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim leading-relaxed">
                {t('landing.teacher_about_me_text2')}
              </p>
              <p className="font-sans text-sm text-slate-600 dark:text-tactical-dim leading-relaxed">
                {t('landing.teacher_about_me_text3')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Free Access Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-2 mb-6 dark:border-signal-green/40 dark:bg-signal-green/5 dark:text-signal-green">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-sans font-semibold">{t('landing.free_badge')}</span>
          </div>
          <Typography 
            variant="h2" 
            className="mb-6 font-sans tracking-tight text-emerald-700 dark:text-signal-green"
          >
            {t('landing.free_title')}
          </Typography>
          <Typography 
            variant="p" 
            className="text-xl text-slate-500 dark:text-slate-400"
          >
            {t('landing.free_subtitle')}
          </Typography>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Free Access Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="tactical-panel p-8 border-signal-green/40 hover:border-signal-green transition-colors relative overflow-hidden"
          >
            <div className="absolute top-0 right-0">
              <span className="rounded-bl-lg bg-emerald-500 text-white text-xs font-sans font-semibold px-4 py-2">
                100% {t('landing.free_badge')}
              </span>
            </div>

            <div className="text-center py-8">
              <div className="text-6xl font-mono font-bold text-slate-900 dark:text-tactical-text mb-4">
                {t('landing.free_price')}
              </div>
              <p className="font-sans text-lg text-slate-600 dark:text-tactical-dim mb-8">
                {t('landing.free_description')}
              </p>
              <Link
                to="/intro"
                onClick={() => trackEvent('User', 'Clicked on Free Access Button')}
                className="inline-block rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 font-sans font-medium transition-colors text-lg dark:bg-signal-green dark:hover:opacity-90 dark:text-black"
              >
                {t('common.start_now')}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="tactical-panel p-6">
              <h4 className="font-sans text-lg font-semibold mb-4 text-brand-600 dark:text-signal-cyan flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {t('landing.what_you_receive_title')}
              </h4>
              <ul className="space-y-3 font-sans text-sm">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n} className="flex items-start gap-3 text-slate-600 dark:text-tactical-dim">
                    <svg className="w-5 h-5 text-signal-green mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t(`landing.what_you_receive_item${n}`)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tactical-panel p-6">
              <h4 className="font-sans text-lg font-semibold mb-4 text-amber-700 dark:text-signal-amber flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('landing.differentials_title')}
              </h4>
              <ul className="space-y-3 font-sans text-sm">
                {[1, 2, 3, 4].map((n) => (
                  <li key={n} className="flex items-start gap-3 text-slate-600 dark:text-tactical-dim">
                    <svg className="w-5 h-5 text-signal-green mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t(`landing.differentials_item${n}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="tactical-panel rounded-lg border-emerald-200 p-8 text-center relative overflow-hidden dark:border-signal-green/40"
        >
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-2 mb-4 dark:border-signal-green/40 dark:bg-signal-green/5 dark:text-signal-green">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-sans font-semibold">100% {t('landing.free_badge')}</span>
            </div>
            <h2 className="font-sans tracking-tight text-3xl font-bold mb-4 text-slate-900 dark:text-tactical-text">{t('landing.cta_free_title')}</h2>
            <p className="font-sans text-xl mb-8 text-slate-600 dark:text-tactical-dim">
              {t('landing.cta_free_subtitle')}
            </p>
            <Link
              to="/intro"
              onClick={() => trackEvent('User', 'Clicked on Final CTA - Free')}
              className="inline-block rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg font-sans font-medium transition-colors dark:bg-signal-green dark:hover:opacity-90 dark:text-black"
            >
              {t('common.start_now')}
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
} 
