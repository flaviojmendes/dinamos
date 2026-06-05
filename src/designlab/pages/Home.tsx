import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import type { Challenge, ForumTopic, Quiz } from '../types'
import api, { apiClient } from '../utils/api'
import { Typewriter } from '../components/Typewriter'
import { formatDate } from '../utils/dateUtils'
import { trackChallengeView, trackNavigation } from '../utils/analytics'
import { useAuth } from '../contexts/AuthContext'
import Onboarding from '../components/Onboarding'
import { Tag, TacticalButton } from '../components/tactical'

function Home() {
  const { isSubscribed, appUser, refreshUserProfile } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [recentTopics, setRecentTopics] = useState<ForumTopic[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingTopics, setLoadingTopics] = useState(true)
  const [loadingQuizzes, setLoadingQuizzes] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchChallenges()
    fetchRecentTopics()
    fetchQuizzes()
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

  const fetchRecentTopics = async () => {
    try {
      const response = await apiClient.get('/api/forum/topics', {
        params: { sort: 'active', limit: 3 }
      })
      setRecentTopics(response.data.topics)
    } catch (error) {
      console.error('Erro ao buscar tópicos recentes:', error)
    } finally {
      setLoadingTopics(false)
    }
  }

  const fetchQuizzes = async () => {
    try {
      const response = await apiClient.get('/api/quizzes', {
        params: { limit: 3 }
      })
      setQuizzes(response.data.quizzes || [])
    } catch (error) {
      console.error('Erro ao buscar quizzes:', error)
    } finally {
      setLoadingQuizzes(false)
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Dúvida': return 'border border-signal-amber/40 text-signal-amber bg-signal-amber/10 font-mono uppercase tracking-wider'
      case 'Brainstorm': return 'border border-signal-green/40 text-signal-green bg-signal-green/10 font-mono uppercase tracking-wider'
      case 'Ajuda': return 'border border-signal-red/40 text-signal-red bg-signal-red/10 font-mono uppercase tracking-wider'
      default: return 'border border-slate-300 dark:border-tactical-line text-slate-600 dark:text-tactical-dim bg-slate-100 dark:bg-tactical-raised font-mono uppercase tracking-wider'
    }
  }

  return (
    <div className="min-h-screen bg-grid bg-canvas-paper dark:bg-canvas-dark transition-colors duration-200">
      
      {/* Onboarding Modal */}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}

      {/* Hero Section */}
      <div className="border-b border-slate-200 dark:border-tactical-border bg-white/50 dark:bg-tactical-surface/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 dark:opacity-20 pointer-events-none hidden lg:block transform rotate-12">
          <svg width="300" height="200" viewBox="0 0 300 200" fill="none" stroke="currentColor" className="text-slate-900 dark:text-tactical-text">
             <path d="M50,50 C100,20 150,80 200,50" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
             <rect x="220" y="30" width="60" height="40" rx="2" strokeWidth="3" />
             <circle cx="30" cy="50" r="20" strokeWidth="3" />
             <path d="M50,50 L220,50" strokeWidth="2" strokeDasharray="8 4" />
             <path d="M250,70 L250,120" strokeWidth="2" />
             <rect x="200" y="120" width="100" height="60" rx="4" strokeWidth="3" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28 text-center">
          <h1 className="text-5xl md:text-7xl font-mono font-bold text-slate-900 dark:text-tactical-text mb-8 tracking-tight flex flex-col items-center gap-4">
            <span>Pratique System Design</span>
            <span className="text-brand-600 dark:text-signal-green relative inline-block">
              <Typewriter 
                text="Como um Expert" 
                speed={100} 
                delay={300}
                className="relative z-10"
              />
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-signal-amber" aria-hidden />
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-tactical-dim max-w-3xl mx-auto leading-relaxed">
            O Dinamos Design Lab é um ambiente virtual para praticar System Design e arquitetar sistemas.
          </p>
          
          <div className="mt-8">
            <Tag color="green">100% GRATUITO</Tag>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* Wiki Section */}
        <div className="mt-16 border-t border-slate-200 dark:border-tactical-border pt-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="flex items-center gap-3 font-mono uppercase tracking-wider text-2xl font-bold text-slate-900 dark:text-tactical-text before:content-[''] before:h-6 before:w-1 before:bg-signal-amber before:shrink-0">
                <span className="text-2xl normal-case tracking-normal" aria-hidden>📚</span>
                Wiki de Sistemas Distribuídos
              </h2>
              <p className="text-slate-500 dark:text-tactical-label mt-1 text-sm">
                Explore conceitos fundamentais e simuladores interativos
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Fundamentos Sólidos */}
            <div className="tactical-panel dark:rounded-none card-shadow dark:shadow-none overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-tactical-border bg-slate-900 dark:bg-tactical-raised">
                <h3 className="text-lg font-mono uppercase tracking-wider font-bold text-white dark:text-signal-green flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Fundamentos Sólidos
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { title: 'Sistemas Distribuídos 101', icon: '🌐' },
                  { title: 'System Design 101', icon: '🏗️' },
                  { title: 'Componentes Básicos', icon: '🧩' },
                  { title: 'Arquiteturas Modernas', icon: '🚀' }
                ].map((item, i) => (
                  <a
                    key={i}
                    href="https://wiki.dinamos.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white dark:bg-tactical-surface border border-slate-200 dark:border-tactical-border hover:border-brand-400 dark:hover:border-signal-green transition-all group dark:rounded-none"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium text-slate-700 dark:text-tactical-dim group-hover:text-brand-600 dark:group-hover:text-signal-green transition-colors">
                      {item.title}
                    </span>
                    <svg className="w-4 h-4 ml-auto text-slate-400 group-hover:text-brand-600 dark:group-hover:text-signal-green group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Simuladores Interativos */}
            <div className="tactical-panel dark:rounded-none card-shadow dark:shadow-none overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-tactical-border bg-slate-900 dark:bg-tactical-raised">
                <h3 className="text-lg font-mono uppercase tracking-wider font-bold text-white dark:text-signal-cyan flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Aprenda com Simuladores Interativos
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { title: 'Cache Simulator', icon: '💾' },
                  { title: 'Circuit Breaker', icon: '⚡' },
                  { title: 'Load Balancer', icon: '⚖️' },
                  { title: 'Segurança e Proteção', icon: '🔒' }
                ].map((item, i) => (
                  <a
                    key={i}
                    href="https://wiki.dinamos.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white dark:bg-tactical-surface border border-slate-200 dark:border-tactical-border hover:border-brand-400 dark:hover:border-signal-cyan transition-all group dark:rounded-none"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium text-slate-700 dark:text-tactical-dim group-hover:text-brand-600 dark:group-hover:text-signal-cyan transition-colors">
                      {item.title}
                    </span>
                    <span className="ml-auto px-2 py-0.5 text-xs font-mono uppercase tracking-wider border border-signal-cyan/40 text-signal-cyan bg-signal-cyan/10">
                      Interativo
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Latest Forum Topics */}
        <div id="onboarding-forum" className="mt-16 border-t border-slate-200 dark:border-tactical-border pt-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="flex items-center gap-3 font-mono uppercase tracking-wider text-2xl font-bold text-slate-900 dark:text-tactical-text before:content-[''] before:h-6 before:w-1 before:bg-signal-amber before:shrink-0">
                Últimas Discussões
              </h2>
              <p className="text-slate-500 dark:text-tactical-label mt-1 text-sm">
                Participe das conversas mais recentes da comunidade
              </p>
            </div>
            <Link 
              to="/forum" 
              onClick={() => trackNavigation('forum')}
              className="text-sm font-mono uppercase tracking-wider font-medium text-brand-600 dark:text-signal-cyan hover:text-brand-700 dark:hover:text-signal-green"
            >
              Ver todas →
            </Link>
          </div>

          {loadingTopics ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 dark:border-signal-green"></div>
            </div>
          ) : recentTopics.length === 0 ? (
            <div className="text-center py-8 tactical-panel dark:rounded-none card-shadow dark:shadow-none">
              <p className="text-slate-500 dark:text-tactical-label">Nenhuma discussão recente encontrada.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {recentTopics.map((topic) => (
                <Link 
                  key={topic.id} 
                  to={`/forum/topic/${topic.id}`}
                  className="block tactical-panel dark:rounded-none card-shadow dark:shadow-none p-6 hover:border-brand-400 dark:hover:border-signal-green transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs ${getCategoryColor(topic.category)}`}>
                          {topic.category}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-tactical-label font-mono">
                          {formatDate(topic.created_at)}
                        </span>
                      </div>
                      <h3 className="text-lg font-mono uppercase tracking-wider font-semibold text-slate-900 dark:text-tactical-text mb-1">
                        {topic.title}
                      </h3>
                      <p className="text-slate-600 dark:text-tactical-dim text-sm line-clamp-1">
                        {topic.content.replace(/[#*`]/g, '')}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-slate-500 dark:text-tactical-label">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {topic.comment_count ?? 0} {(topic.comment_count ?? 0) === 1 ? 'comentário' : 'comentários'}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-mono uppercase tracking-wider font-medium text-slate-900 dark:text-tactical-text">
                          {topic.author?.nickname || 'Desconhecido'}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-tactical-label font-mono uppercase tracking-wider">
                          Autor
                        </div>
                      </div>
                      {topic.author?.avatar_image ? (
                        <img 
                          src={topic.author.avatar_image} 
                          alt="" 
                          className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-tactical-border"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-tactical-raised flex items-center justify-center">
                          <span className="text-sm font-medium text-slate-500 dark:text-tactical-label">
                            {(topic.author?.nickname || '?').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quizzes Section */}
        <div id="onboarding-quizzes" className="mt-16 border-t border-slate-200 dark:border-tactical-border pt-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="flex items-center gap-3 font-mono uppercase tracking-wider text-2xl font-bold text-slate-900 dark:text-tactical-text before:content-[''] before:h-6 before:w-1 before:bg-signal-amber before:shrink-0">
                <span className="text-2xl normal-case tracking-normal" aria-hidden>🧠</span>
                Quizzes
              </h2>
              <p className="text-slate-500 dark:text-tactical-label mt-1 text-sm">
                Teste seus conhecimentos em System Design
              </p>
            </div>
            <Link 
              to="/quizzes" 
              onClick={() => trackNavigation('quizzes')}
              className="text-sm font-mono uppercase tracking-wider font-medium text-brand-600 dark:text-signal-cyan hover:text-brand-700 dark:hover:text-signal-green"
            >
              Ver todos →
            </Link>
          </div>

          {loadingQuizzes ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 dark:border-signal-green"></div>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-8 tactical-panel dark:rounded-none card-shadow dark:shadow-none">
              <p className="text-slate-500 dark:text-tactical-label">Nenhum quiz disponível no momento.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {quizzes.map((quiz) => (
                <Link 
                  key={quiz.id} 
                  to={`/quizzes/${quiz.id}`}
                  className="group block tactical-panel dark:rounded-none card-shadow dark:shadow-none p-6 hover:border-brand-400 dark:hover:border-signal-green transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider border border-signal-cyan/40 text-signal-cyan bg-signal-cyan/10">
                      {quiz.theme}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-tactical-label font-mono">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {quiz.time_limit_seconds}s/questão
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-mono uppercase tracking-wider font-semibold text-slate-900 dark:text-tactical-text mb-2 group-hover:text-brand-600 dark:group-hover:text-signal-green transition-colors">
                    {quiz.title}
                  </h3>
                  
                  {quiz.description && (
                    <p className="text-slate-600 dark:text-tactical-dim text-sm line-clamp-2 mb-4">
                      {quiz.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-tactical-border">
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-tactical-label font-mono">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {quiz.question_count} questões
                    </div>
                    
                    {quiz.user_best_percentage !== null && quiz.user_best_percentage !== undefined ? (
                      <div className={`text-xs font-mono uppercase tracking-wider px-2 py-1 border ${
                        quiz.user_best_percentage >= 70 
                          ? 'border-signal-green/40 text-signal-green bg-signal-green/10' 
                          : quiz.user_best_percentage >= 40 
                            ? 'border-signal-amber/40 text-signal-amber bg-signal-amber/10'
                            : 'border-signal-red/40 text-signal-red bg-signal-red/10'
                      }`}>
                        Melhor: {quiz.user_best_percentage}%
                      </div>
                    ) : (
                      <span className="text-xs text-brand-600 dark:text-signal-green font-mono uppercase tracking-wider font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Iniciar quiz <span>→</span>
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* How it Works - Technical Flow Style */}
        <div id="onboarding-workflow" className="mt-24 border-t border-slate-200 dark:border-tactical-border pt-16">
          <div className="text-center mb-16">
            <h3 className="flex items-center justify-center gap-3 font-mono uppercase tracking-wider text-2xl font-bold text-slate-900 dark:text-tactical-text before:content-[''] before:h-6 before:w-1 before:bg-signal-amber before:shrink-0">
              Fluxo de Trabalho
            </h3>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-tactical-line -translate-y-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {[
                { 
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  ),
                  title: 'Análise de Requisitos', 
                  desc: 'Examine as restrições e objetivos do sistema proposto.' 
                },
                { 
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  ),
                  title: 'Arquitetura & Design', 
                  desc: 'Use a lousa virtual para desenhar componentes e fluxos.' 
                },
                { 
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'Feedback Sistêmico', 
                  desc: 'Receba análise automática da sua solução.' 
                }
              ].map((step, i) => (
                <div key={i} className="tactical-panel dark:rounded-none card-shadow dark:shadow-none p-6 text-center">
                  <div className="w-12 h-12 mx-auto bg-slate-900 dark:bg-tactical-raised text-white dark:text-signal-green border dark:border-tactical-border flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h4 className="font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-tactical-text mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-tactical-dim">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
