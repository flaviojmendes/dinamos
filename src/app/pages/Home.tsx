import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Challenge } from '../types'
import api from '../utils/api'
import { Typewriter } from '../components/Typewriter'
import { formatDate } from '../utils/dateUtils'
import { trackChallengeView } from '../utils/analytics'
import { useAuth } from '../contexts/AuthContext'
import Onboarding from '../components/Onboarding'
import { Tag, TacticalButton } from '../../components/tactical'

function Home() {
  const { appUser, refreshUserProfile } = useAuth()
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
        return 'text-emerald-700 bg-emerald-50 dark:text-signal-green dark:bg-signal-green/10 font-sans font-medium'
      case 'médio':
        return 'text-amber-700 bg-amber-50 dark:text-signal-amber dark:bg-signal-amber/10 font-sans font-medium'
      case 'difícil':
        return 'text-red-700 bg-red-50 dark:text-signal-red dark:bg-signal-red/10 font-sans font-medium'
      default:
        return 'text-slate-600 bg-slate-100 dark:text-tactical-dim dark:bg-tactical-raised font-sans font-medium'
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">

      {/* Onboarding Modal */}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-tactical-text md:text-3xl">
            Design Lab
          </h1>
          <Tag color="green">100% Gratuito</Tag>
        </div>
        <p className="mt-2 max-w-3xl font-sans text-sm text-slate-500 dark:text-tactical-dim md:text-base">
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
            <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900 dark:text-tactical-text">
              Desafios Disponíveis
            </h2>
            <p className="text-slate-500 dark:text-tactical-label mt-1 text-sm">
              Selecione um problema para começar a arquitetar
            </p>
          </div>
          
          {/* Future filters could go here */}
          <div className="hidden md:block text-xs font-sans text-slate-400">
            {challenges.length} desafios encontrados
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 dark:border-signal-green"></div>
          </div>
        ) : error ? (
          <div className="text-center p-12 border border-red-200 dark:border-red-900 rounded-xl bg-red-50 dark:bg-red-900/10">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-sans font-bold text-slate-900 dark:text-tactical-text mb-2">Erro ao carregar</h2>
            <p className="text-slate-600 dark:text-tactical-dim mb-6">{error}</p>
            <TacticalButton variant="primary" onClick={fetchChallenges} className="">
              Tentar Novamente
            </TacticalButton>
          </div>
        ) : (
          <div className="relative">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="group relative"
              >
                {challenge.video_solution_release_date && (
                  <div className="absolute -top-3 -right-3 z-20 pointer-events-none">
                    <span className="rounded-full text-cyan-700 bg-cyan-50 dark:text-signal-cyan dark:bg-signal-cyan/10 text-xs font-sans font-medium px-3 py-1 dark:rounded-sm">
                      🎥 Solução: {formatDate(challenge.video_solution_release_date)}
                    </span>
                  </div>
                )}
                
                <div
                  onClick={() => {
                    trackChallengeView(challenge.id, challenge.title)
                    navigate(`/challenge/${challenge.id}`)
                  }}
                  className="cursor-pointer tactical-panel card-shadow dark:shadow-none overflow-hidden hover:border-brand-400 dark:group-hover:border-signal-green transition-all duration-300 flex flex-col h-full group-hover:card-shadow"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold font-sans tracking-tight text-slate-900 dark:text-tactical-text group-hover:text-brand-600 dark:group-hover:text-signal-green transition-colors">
                        {challenge.title}
                      </h3>
                      {challenge.attempts_count !== undefined && challenge.attempts_count > 0 && (
                        <span className="rounded-full text-cyan-700 bg-cyan-50 dark:text-signal-cyan dark:bg-signal-cyan/10 text-xs font-sans font-medium px-2.5 py-0.5 ml-2 whitespace-nowrap dark:rounded-sm">
                          {challenge.attempts_count} tentativa{challenge.attempts_count > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span
                      className={`rounded-full dark:rounded-sm px-2.5 py-0.5 text-xs ${getDifficultyColor(
                        challenge.difficulty
                      )}`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="rounded-full dark:rounded-sm px-2.5 py-0.5 text-xs text-slate-600 dark:text-tactical-dim bg-slate-100 dark:bg-tactical-raised font-sans font-medium">
                      {challenge.category}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-tactical-dim text-sm line-clamp-3 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>
                
                <div className="px-6 py-4 bg-slate-50 dark:bg-tactical-raised border-t border-slate-100 dark:border-tactical-border flex items-center justify-between group-hover:bg-slate-100 dark:group-hover:bg-tactical-surface transition-colors">
                   <span className="text-xs font-sans font-medium text-slate-500 dark:text-tactical-label">Iniciar projeto</span>
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
