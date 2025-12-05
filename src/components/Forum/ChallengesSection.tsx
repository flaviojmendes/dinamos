import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getChallenges, Challenge } from '../../services/challengesService';

// Difficulty badge colors
function getDifficultyStyles(difficulty: string) {
  const normalizedDifficulty = difficulty.toLowerCase();
  
  if (normalizedDifficulty.includes('fácil') || normalizedDifficulty.includes('easy')) {
    return {
      bg: 'rgba(34, 197, 94, 0.15)',
      text: '#22c55e',
      border: 'rgba(34, 197, 94, 0.3)',
    };
  }
  if (normalizedDifficulty.includes('médio') || normalizedDifficulty.includes('medium')) {
    return {
      bg: 'rgba(251, 191, 36, 0.15)',
      text: '#fbbf24',
      border: 'rgba(251, 191, 36, 0.3)',
    };
  }
  if (normalizedDifficulty.includes('difícil') || normalizedDifficulty.includes('hard')) {
    return {
      bg: 'rgba(239, 68, 68, 0.15)',
      text: '#ef4444',
      border: 'rgba(239, 68, 68, 0.3)',
    };
  }
  
  return {
    bg: 'rgba(148, 163, 184, 0.15)',
    text: '#94a3b8',
    border: 'rgba(148, 163, 184, 0.3)',
  };
}

// Category badge component
function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
      {category}
    </span>
  );
}

// Difficulty badge component
function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const styles = getDifficultyStyles(difficulty);
  
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium border"
      style={{
        backgroundColor: styles.bg,
        color: styles.text,
        borderColor: styles.border,
      }}
    >
      {difficulty}
    </span>
  );
}

// Challenge card component
function ChallengeCard({ challenge, onClick }: { challenge: Challenge; onClick: () => void }) {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-700/50 hover:border-brand-500/50 transition-all cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-purple-500/0 group-hover:from-brand-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
      
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={challenge.difficulty} />
            <CategoryBadge category={challenge.category} />
          </div>
          {challenge.attempts_count !== undefined && challenge.attempts_count > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{challenge.attempts_count} {challenge.attempts_count === 1 ? t('challenges.attempt') : t('challenges.attempts')}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-slate-100 group-hover:text-brand-400 transition-colors mb-1">
          {challenge.title}
        </h3>
        
        {challenge.subtitle && (
          <p className="text-sm text-slate-500 mb-2">{challenge.subtitle}</p>
        )}
        
        <p className="text-slate-400 text-sm line-clamp-2 mb-4">
          {challenge.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-400 text-sm font-medium group-hover:text-brand-300 transition-colors">
            <span>{t('challenges.start_challenge')}</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          
          {challenge.video_solution_url && (
            <div className="flex items-center gap-1 text-xs text-purple-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t('challenges.has_video')}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Main challenges section component
export default function ChallengesSection() {
  const { t } = useTranslation();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadChallenges() {
      try {
        setLoading(true);
        const data = await getChallenges();
        // Sort by order
        const sortedChallenges = data.challenges.sort((a, b) => a.order - b.order);
        setChallenges(sortedChallenges);
      } catch (err) {
        console.error('Failed to load challenges:', err);
        setError(err instanceof Error ? err.message : 'Failed to load challenges');
      } finally {
        setLoading(false);
      }
    }

    loadChallenges();
  }, []);

  const handleChallengeClick = (challenge: Challenge) => {
    // Redirect to the lab with the challenge ID
    window.open(`https://lab.dinamos.net`, '_blank');
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="text-center py-8">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (challenges.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-brand-500/20 to-purple-500/20 rounded-lg">
              <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              {t('challenges.title')}
            </h2>
          </div>
          <p className="text-slate-400 text-sm">{t('challenges.subtitle')}</p>
        </div>
        
        <a
          href="https://lab.dinamos.net"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700 hover:border-slate-600"
        >
          <span>{t('challenges.view_all')}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ChallengeCard
              challenge={challenge}
              onClick={() => handleChallengeClick(challenge)}
            />
          </motion.div>
        ))}
      </div>

      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: challenges.length * 0.05 + 0.1 }}
        className="mt-6 p-4 bg-gradient-to-r from-brand-500/10 to-purple-500/10 rounded-xl border border-brand-500/20"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/20 rounded-lg">
              <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-200 font-medium">{t('challenges.cta_title')}</p>
              <p className="text-slate-400 text-sm">{t('challenges.cta_description')}</p>
            </div>
          </div>
          <a
            href="https://lab.dinamos.net"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            <span>{t('challenges.go_to_lab')}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

