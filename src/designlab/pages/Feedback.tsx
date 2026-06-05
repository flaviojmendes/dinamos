import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import type { FeedbackData, Challenge } from '../types'
import { TacticalButton } from '../components/tactical'

interface LocationState {
  feedback: FeedbackData
  challenge: Challenge
}

function Feedback() {
  const location = useLocation()
  const navigate = useNavigate()
  const { feedback, challenge } = (location.state as LocationState) || {}

  useEffect(() => {
    // Redirecionar se não houver feedback
    if (!feedback) {
      navigate('/home')
    }
  }, [feedback, navigate])

  if (!feedback) {
    return null
  }

  return (
    <div className="min-h-screen bg-grid bg-canvas-paper dark:bg-canvas-dark transition-colors duration-200">
      <header className="bg-white dark:bg-tactical-surface border-b border-slate-200 dark:border-tactical-border card-shadow dark:shadow-none transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-tactical-text">
                Feedback da Solução
              </h1>
              <p className="text-slate-600 dark:text-tactical-dim mt-1">{challenge?.title}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="tactical-panel dark:rounded-none card-shadow dark:shadow-none p-8 mb-8 text-center transition-colors duration-200">
          <h2 className="text-3xl font-mono uppercase tracking-wider font-bold mb-2 text-brand-600 dark:text-signal-green">
            Análise Concluída!
          </h2>
          <p className="text-slate-600 dark:text-tactical-dim">
            Sua solução demonstra {feedback.strengths.length} pontos fortes
          </p>
        </div>

        {feedback.strengths.length > 0 && (
          <div className="tactical-panel dark:rounded-none card-shadow dark:shadow-none p-6 mb-6 transition-colors duration-200">
            <div className="flex items-center mb-4">
              <div className="border border-signal-green/40 bg-signal-green/10 p-2 mr-3 transition-colors duration-200">
                <svg
                  className="w-6 h-6 text-signal-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-tactical-text">
                Pontos Fortes
              </h3>
            </div>
            <ul className="space-y-3">
              {feedback.strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start p-3 border border-signal-green/40 bg-signal-green/10 transition-colors duration-200"
                >
                  <span className="text-signal-green mr-2 mt-0.5 font-mono">✓</span>
                  <span className="text-slate-700 dark:text-tactical-dim">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.suggestions.length > 0 && (
          <div className="tactical-panel dark:rounded-none card-shadow dark:shadow-none p-6 mb-6 transition-colors duration-200">
            <div className="flex items-center mb-4">
              <div className="border border-signal-cyan/40 bg-signal-cyan/10 p-2 mr-3 transition-colors duration-200">
                <svg
                  className="w-6 h-6 text-brand-600 dark:text-signal-cyan"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-tactical-text">
                Sugestões de Melhoria
              </h3>
            </div>
            <ul className="space-y-3">
              {feedback.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start p-3 border border-signal-cyan/40 bg-signal-cyan/10 transition-colors duration-200"
                >
                  <span className="text-brand-600 dark:text-signal-cyan mr-2 mt-0.5 font-mono">→</span>
                  <span className="text-slate-700 dark:text-tactical-dim">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-4">
          <TacticalButton
            variant="primary"
            size="lg"
            onClick={() => navigate(`/challenge/${challenge?.id}`)}
            className="flex-1 dark:rounded-none"
          >
            Tentar Novamente
          </TacticalButton>
          <TacticalButton
            variant="secondary"
            size="lg"
            onClick={() => navigate('/home')}
            className="flex-1 dark:rounded-none"
          >
            Voltar aos Desafios
          </TacticalButton>
        </div>

        <div className="mt-8 border border-signal-cyan/40 bg-signal-cyan/10 dark:bg-signal-cyan/5 p-6 transition-colors duration-200">
          <h3 className="text-lg font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-tactical-text mb-3">
            Dicas para Melhorar
          </h3>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-tactical-dim">
            <li>• Considere todos os requisitos não-funcionais (escalabilidade, disponibilidade, latência)</li>
            <li>• Pense em estratégias de cache para melhorar performance</li>
            <li>• Considere replicação e redundância para alta disponibilidade</li>
            <li>• Explique como você vai particionar/distribuir os dados</li>
            <li>• Inclua monitoramento e métricas no seu design</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default Feedback
