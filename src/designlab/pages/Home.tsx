import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import type { Challenge } from '../types'
import api from '../utils/api'
import { Typewriter } from '../components/Typewriter'
import { formatDate } from '../utils/dateUtils'
import { trackChallengeView } from '../utils/analytics'
import { useAuth } from '../contexts/AuthContext'
import Onboarding from '../components/Onboarding'
import { Tag, TacticalButton } from '../components/tactical'

function Home() {
  const { isSubscribed, appUser, refreshUserProfile } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchChallenges()
  }, [])

  // Show onboarding for first-time users
  useEffect(() => {
    if (appUser && !appUser.onboarding_completed) {
      setShowOnboarding(true)
    }
  }, [appUser])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    refreshUserProfile()
  }

  const fetchChallenges = async () => {
    try {
      const response = await api.get<{ challenges: Challenge[] }>('/api/challenges')
      setChallenges(response.data.challenges)
    } catch (error) {
      console.error('Erro ao buscar desafios:', error)
      setError('Não foi possível carregar os desafios. Por favor, tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case 'fácil':
        return 'border border-signal-green/40 text-signal-green bg-signal-green/10 font-mono uppercase tracking-wider'
      case 'médio':
        return 'border border-signal-amber/40 text-signal-amber bg-signal-amber/10 font-mono uppercase tracking-wider'
      case 'difícil':
        return 'border border-signal-red/40 text-signal-red bg-signal-red/10 font-mono uppercase tracking-wider'
      default:
        return 'border border-slate-300 dark:border-tactical-line text-slate-600 dark:text-tactical-dim bg-slate-100 dark:bg-tactical-raised font-mono uppercase tracking-wider'
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">

      {/* Onboarding Modal */}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-2xl font-bold uppercase tracking-wider text-slate-900 dark:text-tactical-text md:text-3xl">
            Design Lab
          </h1>
          <Tag color="green">100% Gratuito</Tag>
        </div>
        <p className="mt-2 max-w-3xl font-mono text-sm text-slate-500 dark:text-tactical-dim md:text-base">
          Pratique System Design{' '}
          <span className="text-brand-600 dark:text-signal-green">
            <Typewriter text="como um expert" speed={100} delay={300} />
          </span>
          {' — '}ambiente virtual para arquitetar sistemas distribuídos.
        </p>
      </div>

      <main>
        <div id="onboarding-challenges" className="flex items-end justify-between mb-8 border-b border-slate-200 dark:border-tactical-border pb-4">
          <div>
            <h2 className="flex items-center gap-3 font-mono uppercase tracking-wider text-2xl font-bold text-slate-900 dark:text-tactical-text before:content-[''] before:h-6 before:w-1 before:bg-signal-amber before:shrink-0">
              Desafios Disponíveis
            </h2>
            <p className="text-slate-500 dark:text-tactical-label mt-1 text-sm">
              Selecione um problema para começar a arquitetar
            </p>
          </div>
          
          {/* Future filters could go here */}
          <div className="hidden md:block text-xs font-mono text-slate-400">
            {challenges.length} desafios encontrados
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 dark:border-signal-green"></div>
          </div>
        ) : error ? (
          <div className="text-center p-12 border-2 border-dashed border-red-200 dark:border-red-900 rounded-xl bg-red-50 dark:bg-red-900/10">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-tactical-text mb-2">Erro ao carregar</h2>
            <p className="text-slate-600 dark:text-tactical-dim mb-6">{error}</p>
            <TacticalButton variant="primary" onClick={fetchChallenges} className="dark:rounded-none">
              Tentar Novamente
            </TacticalButton>
          </div>
        ) : (
          <div className="relative">
            {/* Paywall overlay for non-subscribed users */}
            {!isSubscribed && (
              <div className="absolute inset-0 z-30 flex items-center justify-center">
                <div className="absolute inset-0 bg-white/70 dark:bg-tactical-bg/70 backdrop-blur-[2px]"></div>
                <div className="relative z-10 text-center p-8 max-w-md">
                  <div className="tactical-panel dark:rounded-none card-shadow dark:shadow-none p-8">
                    <div className="w-16 h-16 mx-auto mb-6 bg-slate-900 dark:bg-tactical-raised text-white dark:text-signal-green border dark:border-tactical-border flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-tactical-text mb-3">
                      Acesso Restrito
                    </h3>
                    <p className="text-slate-600 dark:text-tactical-dim mb-6">
                      Este conteúdo não está disponível no momento. Entre em contato com o administrador para obter acesso.
                    </p>
                    <Link
                      to="/subscription-required"
                      className="inline-flex items-center justify-center w-full font-mono uppercase tracking-wider font-medium bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-black dark:hover:bg-slate-200 px-6 py-3 dark:rounded-none transition-colors"
                    >
                      Mais Informações
                      <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${!isSubscribed ? 'pointer-events-none select-none' : ''}`}>
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="group relative"
              >
                {challenge.video_solution_release_date && (
                  <div className="absolute -top-3 -right-3 z-20 transform rotate-3 group-hover:rotate-0 transition-transform duration-300 pointer-events-none">
                    <span className="border-2 border-signal-cyan/40 text-signal-cyan bg-signal-cyan/10 text-xs font-mono uppercase tracking-wider px-3 py-1 border-white dark:border-tactical-bg">
                      🎥 Solução: {formatDate(challenge.video_solution_release_date)}
                    </span>
                  </div>
                )}
                
                <div
                  onClick={() => {
                    trackChallengeView(challenge.id, challenge.title)
                    navigate(`/challenge/${challenge.id}`)
                  }}
                  className="cursor-pointer tactical-panel dark:rounded-none card-shadow dark:shadow-none overflow-hidden hover:border-brand-400 dark:group-hover:border-signal-green transition-all duration-300 flex flex-col h-full group-hover:card-shadow"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-tactical-text group-hover:text-brand-600 dark:group-hover:text-signal-green transition-colors">
                        {challenge.title}
                      </h3>
                      {challenge.attempts_count !== undefined && challenge.attempts_count > 0 && (
                        <span className="border border-signal-cyan/40 text-signal-cyan bg-signal-cyan/10 text-xs font-mono uppercase tracking-wider px-2.5 py-0.5 ml-2 whitespace-nowrap">
                          {challenge.attempts_count} tentativa{challenge.attempts_count > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs ${getDifficultyColor(
                        challenge.difficulty
                      )}`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs border border-slate-300 dark:border-tactical-line text-slate-600 dark:text-tactical-dim bg-slate-100 dark:bg-tactical-raised font-mono uppercase tracking-wider">
                      {challenge.category}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-tactical-dim text-sm line-clamp-3 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>
                
                <div className="px-6 py-4 bg-slate-50 dark:bg-tactical-raised border-t border-slate-100 dark:border-tactical-border flex items-center justify-between group-hover:bg-slate-100 dark:group-hover:bg-tactical-surface transition-colors">
                   <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-tactical-label">Iniciar projeto</span>
                   <span className="text-brand-600 dark:text-signal-green transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
            ))}
          </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default Home
