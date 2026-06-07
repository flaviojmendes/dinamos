import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'
import type { Quiz, QuizStats } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import { Tag, TacticalButton } from '../../components/tactical'

function QuizList() {
  const { isSubscribed } = useAuth()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [themes, setThemes] = useState<string[]>([])
  const [selectedTheme, setSelectedTheme] = useState<string>('')
  const [stats, setStats] = useState<QuizStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchQuizzes()
    fetchThemes()
    fetchStats()
  }, [])

  useEffect(() => {
    fetchQuizzes()
  }, [selectedTheme])

  const fetchQuizzes = async () => {
    try {
      setLoading(true)
      const params = selectedTheme ? { theme: selectedTheme } : {}
      const response = await api.get<{ quizzes: Quiz[] }>('/api/quizzes', { params })
      setQuizzes(response.data.quizzes)
    } catch (error) {
      console.error('Erro ao buscar quizzes:', error)
      setError('Não foi possível carregar os quizzes.')
    } finally {
      setLoading(false)
    }
  }

  const fetchThemes = async () => {
    try {
      const response = await api.get<{ themes: string[] }>('/api/quizzes/themes')
      setThemes(response.data.themes)
    } catch (error) {
      console.error('Erro ao buscar temas:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get<QuizStats>('/api/user/quiz-stats')
      setStats(response.data)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    }
  }

  const getScoreColor = (percentage: number | null | undefined) => {
    if (percentage === null || percentage === undefined) return 'text-slate-400 dark:text-tactical-label'
    if (percentage >= 70) return 'text-signal-green'
    if (percentage >= 40) return 'text-signal-amber'
    return 'text-signal-red'
  }

  const getScoreBg = (percentage: number | null | undefined) => {
    if (percentage === null || percentage === undefined) return 'border-slate-200 dark:border-tactical-line bg-slate-100 dark:bg-tactical-raised'
    if (percentage >= 70) return 'border-signal-green/40 bg-signal-green/10'
    if (percentage >= 40) return 'border-signal-amber/40 bg-signal-amber/10'
    return 'border-signal-red/40 bg-signal-red/10'
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark transition-colors duration-200">
        {/* Hero Section */}
        <div className="border-b border-slate-200 dark:border-tactical-border bg-white/50 dark:bg-tactical-surface/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text">
                  🧠 Quizzes
                </h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-tactical-dim">
                  Teste seus conhecimentos em System Design com quizzes cronometrados
                </p>
              </div>

              {/* User Stats Card */}
              {stats && stats.total_attempts > 0 && (
                <div className="tactical-panel p-4 dark:rounded-none">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono tabular-nums text-brand-600 dark:text-signal-cyan">
                        {stats.quizzes_completed}
                      </div>
                      <div className="text-xs font-medium text-slate-500 dark:text-tactical-label">
                        Quizzes
                      </div>
                    </div>
                    <div className="h-10 w-px bg-slate-200 dark:bg-tactical-border"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono tabular-nums text-signal-green">
                        {stats.average_percentage}%
                      </div>
                      <div className="text-xs font-medium text-slate-500 dark:text-tactical-label">
                        Média
                      </div>
                    </div>
                    <div className="h-10 w-px bg-slate-200 dark:bg-tactical-border"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold font-mono tabular-nums text-signal-amber">
                        {stats.total_correct_answers}
                      </div>
                      <div className="text-xs font-medium text-slate-500 dark:text-tactical-label">
                        Acertos
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Theme Filter */}
          {themes.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTheme('')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border dark:rounded-none ${
                  selectedTheme === ''
                    ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                    : 'bg-white dark:bg-tactical-surface text-slate-700 dark:text-tactical-dim border-slate-200 dark:border-tactical-line hover:border-emerald-300'
                }`}
              >
                Todos
              </button>
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border dark:rounded-none ${
                    selectedTheme === theme
                      ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                      : 'bg-white dark:bg-tactical-surface text-slate-700 dark:text-tactical-dim border-slate-200 dark:border-tactical-line hover:border-emerald-300'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 dark:border-signal-green"></div>
            </div>
          ) : error ? (
            <div className="text-center p-12 border-2 border-dashed border-signal-red/40 dark:border-signal-red/30 bg-signal-red/5 dark:bg-signal-red/10 dark:rounded-none">
              <div className="text-signal-red text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-tactical-text mb-2">Erro ao carregar</h2>
              <p className="text-slate-600 dark:text-tactical-dim mb-6">{error}</p>
              <TacticalButton variant="primary" onClick={fetchQuizzes}>
                Tentar Novamente
              </TacticalButton>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-tactical-text mb-2">
                Nenhum quiz disponível
              </h3>
              <p className="text-slate-600 dark:text-tactical-dim">
                Em breve teremos quizzes para você praticar!
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Paywall for non-subscribed users */}
              {!isSubscribed && (
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/80 to-white dark:from-tactical-bg/30 dark:via-tactical-bg/80 dark:to-tactical-bg backdrop-blur-[2px]"></div>
                  <div className="relative z-10 text-center p-8 max-w-md">
                    <div className="tactical-panel p-8 dark:rounded-none">
                      <div className="w-16 h-16 mx-auto mb-6 border border-signal-cyan/40 bg-signal-cyan/10 rounded-full flex items-center justify-center">
                        <span className="text-3xl">🧠</span>
                      </div>
                      <h3 className="text-2xl font-bold font-sans text-slate-900 dark:text-tactical-text mb-3">
                        Acesso restrito
                      </h3>
                      <p className="text-slate-600 dark:text-tactical-dim mb-6">
                        Este conteúdo não está disponível no momento. Entre em contato com o administrador para obter acesso.
                      </p>
                      <Link
                        to="/subscription-required"
                        className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 font-sans font-medium rounded-lg transition-colors bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-200 dark:rounded-none"
                      >
                        Mais Informações
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${!isSubscribed ? 'pointer-events-none select-none' : ''}`}>
                {quizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    to={`/quizzes/${quiz.id}`}
                    className="group tactical-panel overflow-hidden dark:rounded-none hover:border-slate-400 dark:hover:border-signal-green/40 transition-colors duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Tag color="cyan">{quiz.theme}</Tag>
                        {quiz.user_best_percentage !== null && quiz.user_best_percentage !== undefined && (
                          <div className={`px-3 py-1 rounded-full text-xs font-mono tabular-nums font-semibold ${getScoreBg(quiz.user_best_percentage)} ${getScoreColor(quiz.user_best_percentage)}`}>
                            {quiz.user_best_percentage}%
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-bold font-sans text-slate-900 dark:text-tactical-text group-hover:text-brand-600 dark:group-hover:text-signal-green transition-colors mb-2">
                        {quiz.title}
                      </h3>

                      {quiz.description && (
                        <p className="text-slate-600 dark:text-tactical-dim text-sm line-clamp-2 mb-4">
                          {quiz.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-tactical-label">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {quiz.question_count} questões
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {quiz.time_limit_seconds}s/questão
                        </div>
                      </div>

                      {quiz.user_attempts_count !== undefined && quiz.user_attempts_count > 0 && (
                        <div className="mt-3 text-xs text-slate-400">
                          {quiz.user_attempts_count} tentativa{quiz.user_attempts_count > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    <div className="px-6 py-4 bg-slate-50 dark:bg-tactical-raised border-t border-slate-100 dark:border-tactical-border flex items-center justify-between group-hover:bg-signal-green/5 transition-colors">
                      <span className="text-xs font-medium text-slate-500 dark:text-tactical-label">
                        {quiz.user_best_percentage !== null ? 'Refazer quiz' : 'Iniciar quiz'}
                      </span>
                      <span className="text-brand-600 dark:text-signal-green transform group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default QuizList

