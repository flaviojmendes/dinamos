import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import type { LeaderboardEntry, UserRanking } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { Trophy, Crown, Coins, Brain, Target, Sparkles, TrendingUp } from 'lucide-react'
import { TacticalButton } from '../components/tactical'

function Leaderboard() {
  const { appUser } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [myRanking, setMyRanking] = useState<UserRanking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard()
    fetchMyRanking()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await api.get<{ leaderboard: LeaderboardEntry[] }>('/api/leaderboard?limit=50')
      setLeaderboard(response.data.leaderboard)
    } catch (error) {
      console.error('Erro ao buscar ranking:', error)
      setError('Não foi possível carregar o ranking.')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyRanking = async () => {
    try {
      const response = await api.get<UserRanking>('/api/leaderboard/me')
      setMyRanking(response.data)
    } catch (error) {
      console.error('Erro ao buscar sua posição:', error)
    }
  }

  const restOfLeaderboard = leaderboard.slice(3)

  // Get top 3 by rank explicitly
  const firstPlace = leaderboard.find(e => e.rank === 1)
  const secondPlace = leaderboard.find(e => e.rank === 2)
  const thirdPlace = leaderboard.find(e => e.rank === 3)
  const hasTop3 = firstPlace || secondPlace || thirdPlace

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-grid bg-canvas-paper dark:bg-canvas-dark transition-colors duration-200">
        {/* Hero Section with animated background */}
        <div className="relative border-b border-slate-200 dark:border-tactical-border bg-slate-50 dark:bg-tactical-bg overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-signal-amber/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-signal-cyan/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="h-10 w-10 text-signal-amber" />
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-tactical-text">
                    Ranking global
                  </h1>
                </div>
                <p className="mt-2 text-lg text-slate-600 dark:text-tactical-dim flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-600 dark:text-signal-cyan" />
                  Classificação baseada em performance nos quizzes e DinaCoins
                </p>
              </div>

              {/* User's Position Card */}
              {myRanking && myRanking.rank && (
                <div className="tactical-panel rounded-xl dark:rounded-none p-4">
                  <div className="label-mono mb-2 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Sua Posição
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-lg dark:rounded-none border border-signal-amber/40 bg-signal-amber/10 text-signal-amber font-mono font-bold text-2xl tabular-nums">
                      #{myRanking.rank}
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm text-slate-600 dark:text-tactical-dim font-mono tabular-nums">
                        Score: <span className="font-bold text-brand-600 dark:text-signal-green">{myRanking.ranking_score}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs font-mono tabular-nums text-slate-500 dark:text-tactical-dim">
                        <span className="flex items-center gap-1">
                          <Brain className="h-3.5 w-3.5 text-signal-green" />
                          {myRanking.avg_quiz_score}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Coins className="h-3.5 w-3.5 text-signal-amber" />
                          {myRanking.coins}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-brand-600 dark:border-signal-green border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center p-12 border border-dashed border-signal-red/40 rounded-xl dark:rounded-none bg-signal-red/5">
              <div className="text-signal-red text-4xl mb-4">⚠️</div>
              <h2 className="font-sans text-xl font-bold text-slate-900 dark:text-tactical-text mb-2">Erro ao carregar</h2>
              <p className="text-slate-600 dark:text-tactical-dim mb-6">{error}</p>
              <TacticalButton variant="primary" onClick={fetchLeaderboard} className="dark:rounded-none">
                Tentar Novamente
              </TacticalButton>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="font-sans text-xl font-bold text-slate-900 dark:text-tactical-text mb-2">
                Nenhum participante ainda
              </h3>
              <p className="text-slate-600 dark:text-tactical-dim">
                Complete quizzes e ganhe DinaCoins para aparecer no ranking!
              </p>
            </div>
          ) : (
            <>
              {/* Podium Section - Top 3 */}
              {hasTop3 && (
                <div className="mb-12">
                  {/* Podium Container - aligned at bottom */}
                  <div className="flex items-end justify-center gap-2 sm:gap-4">
                    {/* 2nd Place - Left */}
                    {secondPlace && (
                      <div className="flex flex-col items-center">
                        <div className="flex flex-col items-center mb-3">
                          <div className="relative">
                            {secondPlace.avatar_image ? (
                              <img 
                                src={secondPlace.avatar_image} 
                                alt={secondPlace.nickname || 'User'} 
                                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-4 border-slate-300 shadow-xl"
                              />
                            ) : (
                              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center border-4 border-slate-300 shadow-xl bg-gradient-to-br from-slate-300 to-slate-400">
                                <span className="font-bold text-white text-lg sm:text-xl">
                                  {(secondPlace.nickname || '?').charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 text-center">
                            <div className="font-sans font-bold text-slate-900 dark:text-white truncate max-w-[100px] sm:max-w-[120px] text-sm sm:text-base">
                              {secondPlace.nickname || 'Anônimo'}
                            </div>
                            <div className="font-mono font-bold tabular-nums text-brand-600 dark:text-signal-green mt-0.5 text-xs">
                              {secondPlace.ranking_score} pts
                            </div>
                            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-0.5 text-xs font-mono tabular-nums text-slate-500 dark:text-tactical-dim">
                              <span className="flex items-center gap-0.5">
                                <Brain className="h-3 w-3 text-signal-green" />
                                {secondPlace.avg_quiz_score}%
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Coins className="h-3 w-3 text-signal-amber" />
                                {secondPlace.coins}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-24 sm:w-28 h-20 bg-gradient-to-t from-slate-300 to-slate-400 rounded-t-lg shadow-lg flex items-center justify-center relative">
                          <span className="text-white/30 text-4xl sm:text-5xl font-bold">2</span>
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold shadow-lg bg-slate-300 text-slate-800">
                            #2
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 1st Place - Center */}
                    {firstPlace && (
                      <div className="flex flex-col items-center">
                        <div className="flex flex-col items-center mb-3">
                          <div className="mb-1 animate-bounce">
                            <Crown className="h-7 w-7 sm:h-8 sm:w-8 text-signal-amber" />
                          </div>
                          <div className="relative">
                            {firstPlace.avatar_image ? (
                              <img 
                                src={firstPlace.avatar_image} 
                                alt={firstPlace.nickname || 'User'} 
                                className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-4 border-signal-amber"
                              />
                            ) : (
                              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full flex items-center justify-center border-4 border-signal-amber bg-signal-amber/20">
                                <span className="font-bold text-white text-xl sm:text-2xl">
                                  {(firstPlace.nickname || '?').charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 text-center">
                            <div className="font-sans font-bold text-slate-900 dark:text-white truncate max-w-[100px] sm:max-w-[120px] text-base sm:text-lg">
                              {firstPlace.nickname || 'Anônimo'}
                            </div>
                            <div className="font-mono font-bold tabular-nums text-signal-amber mt-0.5 text-sm">
                              {firstPlace.ranking_score} pts
                            </div>
                            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-0.5 text-xs font-mono tabular-nums text-slate-500 dark:text-tactical-dim">
                              <span className="flex items-center gap-0.5">
                                <Brain className="h-3 w-3 text-signal-green" />
                                {firstPlace.avg_quiz_score}%
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Coins className="h-3 w-3 text-signal-amber" />
                                {firstPlace.coins}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-24 sm:w-28 h-28 bg-signal-amber/80 dark:bg-signal-amber/40 dark:rounded-none border border-signal-amber/50 flex items-center justify-center relative">
                          <span className="text-white/30 text-4xl sm:text-5xl font-mono font-bold tabular-nums">1</span>
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-sans font-bold rounded-full border border-signal-amber/40 bg-signal-amber/20 text-signal-amber dark:rounded-none">
                            #1
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3rd Place - Right */}
                    {thirdPlace && (
                      <div className="flex flex-col items-center">
                        <div className="flex flex-col items-center mb-3">
                          <div className="relative">
                            {thirdPlace.avatar_image ? (
                              <img 
                                src={thirdPlace.avatar_image} 
                                alt={thirdPlace.nickname || 'User'} 
                                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-4 border-amber-600 shadow-xl"
                              />
                            ) : (
                              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center border-4 border-amber-600 shadow-xl bg-gradient-to-br from-amber-500 to-orange-500">
                                <span className="font-bold text-white text-lg sm:text-xl">
                                  {(thirdPlace.nickname || '?').charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 text-center">
                            <div className="font-sans font-bold text-slate-900 dark:text-white truncate max-w-[100px] sm:max-w-[120px] text-sm sm:text-base">
                              {thirdPlace.nickname || 'Anônimo'}
                            </div>
                            <div className="font-mono font-bold tabular-nums text-brand-600 dark:text-signal-green mt-0.5 text-xs">
                              {thirdPlace.ranking_score} pts
                            </div>
                            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-0.5 text-xs font-mono tabular-nums text-slate-500 dark:text-tactical-dim">
                              <span className="flex items-center gap-0.5">
                                <Brain className="h-3 w-3 text-signal-green" />
                                {thirdPlace.avg_quiz_score}%
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Coins className="h-3 w-3 text-signal-amber" />
                                {thirdPlace.coins}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-24 sm:w-28 h-16 bg-gradient-to-t from-amber-500 to-orange-500 rounded-t-lg shadow-lg flex items-center justify-center relative">
                          <span className="text-white/30 text-4xl sm:text-5xl font-bold">3</span>
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold shadow-lg bg-amber-600 text-white">
                            #3
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Score Formula Explanation */}
              <div className="mb-8 p-4 tactical-panel rounded-xl dark:rounded-none border-signal-cyan/20">
                <div className="flex items-center gap-2 label-mono text-brand-600 dark:text-signal-cyan mb-2">
                  <Target className="h-4 w-4" />
                  Como o ranking é calculado
                </div>
                <p className="text-sm text-slate-600 dark:text-tactical-dim">
                  <span className="font-semibold">Score</span> = (Média Quizzes × 50%) + (DinaCoins × 50%)
                  <span className="block mt-1 text-xs opacity-75">
                    A média considera sua melhor pontuação em cada quiz. DinaCoins são normalizados relativamente ao maior saldo.
                  </span>
                </p>
              </div>

              {/* Rest of Leaderboard */}
              {restOfLeaderboard.length > 0 && (
                <div className="tactical-panel rounded-xl dark:rounded-none overflow-hidden">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 dark:bg-tactical-surface border-b border-slate-200 dark:border-tactical-border label-mono sticky top-0 z-10">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5 sm:col-span-4">Usuário</div>
                    <div className="col-span-2 text-center hidden sm:block">Quizzes</div>
                    <div className="col-span-2 text-center">Média</div>
                    <div className="col-span-2 text-center">Coins</div>
                    <div className="col-span-2 sm:col-span-1 text-right">Score</div>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-slate-100 dark:divide-tactical-border">
                    {restOfLeaderboard.map((entry) => {
                      const isCurrentUser = entry.user_id === appUser?.id
                      
                      return (
                        <div 
                          key={entry.user_id} 
                          className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-slate-50 dark:hover:bg-tactical-raised ${
                            isCurrentUser ? 'bg-brand-50 dark:bg-signal-green/5 border-l-4 border-brand-600 dark:border-signal-green' : ''
                          }`}
                        >
                          {/* Rank */}
                          <div className="col-span-1">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg dark:rounded-none text-sm font-mono font-bold tabular-nums border ${
                              entry.rank <= 10 
                                ? 'border-signal-green/40 bg-signal-green/10 text-signal-green' 
                                : 'border-slate-200 dark:border-tactical-line bg-slate-100 dark:bg-tactical-raised text-slate-600 dark:text-tactical-dim'
                            }`}>
                              {entry.rank}
                            </span>
                          </div>

                          {/* User */}
                          <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                            {entry.avatar_image ? (
                              <img 
                                src={entry.avatar_image} 
                                alt={entry.nickname || 'User'} 
                                className="h-10 w-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center border-2 border-slate-200 dark:border-slate-600">
                                <span className="text-sm font-bold text-white">
                                  {(entry.nickname || '?').charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className={`font-sans font-medium truncate ${isCurrentUser ? 'text-brand-600 dark:text-signal-green' : 'text-slate-900 dark:text-tactical-text'}`}>
                              {entry.nickname || 'Anônimo'}
                              {isCurrentUser && <span className="ml-1 text-xs">(você)</span>}
                            </span>
                          </div>

                          {/* Quizzes Completed */}
                          <div className="col-span-2 text-center hidden sm:block">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {entry.quizzes_completed}
                            </span>
                          </div>

                          {/* Quiz Average */}
                          <div className="col-span-2 text-center">
                            <span className={`inline-flex items-center gap-1 text-sm font-mono tabular-nums font-medium ${
                              entry.avg_quiz_score >= 80 
                                ? 'text-signal-green' 
                                : entry.avg_quiz_score >= 60 
                                  ? 'text-signal-amber' 
                                  : 'text-slate-600 dark:text-tactical-dim'
                            }`}>
                              <Brain className="h-3.5 w-3.5" />
                              {entry.avg_quiz_score}%
                            </span>
                          </div>

                          {/* Coins */}
                          <div className="col-span-2 text-center">
                            <span className="inline-flex items-center gap-1 text-sm font-mono tabular-nums font-medium text-signal-amber">
                              <Coins className="h-3.5 w-3.5" />
                              {entry.coins}
                            </span>
                          </div>

                          {/* Score */}
                          <div className="col-span-2 sm:col-span-1 text-right">
                            <span className="font-mono font-bold tabular-nums text-brand-600 dark:text-signal-green">
                              {entry.ranking_score}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}

export default Leaderboard

