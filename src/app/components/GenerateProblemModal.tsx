import { useState } from 'react'
import type { Challenge, GenerationContext } from '../types'
import api from '../utils/api'
import { TacticalButton } from '../../components/tactical'

interface GenerateProblemModalProps {
  onClose: () => void
  onGenerated: (challenge: Challenge) => void
}

const SENIORITY_OPTIONS = ['Estágio', 'Júnior', 'Pleno', 'Sênior', 'Staff / Principal']
const DIFFICULTY_OPTIONS = ['Fácil', 'Médio', 'Difícil']

const inputClass =
  'w-full rounded-lg border border-slate-300 dark:border-tactical-border bg-white dark:bg-tactical-raised px-3 py-2 text-sm text-slate-900 dark:text-tactical-text placeholder-slate-400 dark:placeholder-tactical-dim focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-signal-green focus:border-transparent'
const labelClass =
  'block text-sm font-sans font-medium text-slate-700 dark:text-tactical-label mb-1.5'

function GenerateProblemModal({ onClose, onGenerated }: GenerateProblemModalProps) {
  const [form, setForm] = useState<GenerationContext>({
    roleDescription: '',
    seniority: 'Pleno',
    targetCompany: '',
    difficulty: 'Médio',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (key: keyof GenerationContext, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    if (!form.roleDescription.trim()) {
      setError('Descreva a vaga ou o cargo que você está buscando.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const response = await api.post<Challenge>('/api/challenges/generate', form)
      onGenerated(response.data)
    } catch (err) {
      console.error('Erro ao gerar problema:', err)
      setError('Não foi possível gerar o problema. Tente novamente em instantes.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div
          className="fixed inset-0 bg-black/50"
          onClick={loading ? undefined : onClose}
        />

        <div className="relative tactical-panel max-w-lg w-full max-h-[90vh] overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-tactical-border flex items-start justify-between gap-4">
            <div>
              <h2 className="font-sans text-xl font-bold text-slate-900 dark:text-tactical-text">
                Gerar problema personalizado
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-tactical-dim">
                Conte sobre a vaga que você busca e a IA cria um desafio de System
                Design sob medida.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-40"
              aria-label="Fechar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label htmlFor="gp-role" className={labelClass}>
                Vaga / cargo que você está buscando <span className="text-signal-red">*</span>
              </label>
              <textarea
                id="gp-role"
                rows={3}
                className={inputClass}
                placeholder="Ex.: Engenheiro(a) de Backend focado em sistemas de alta escala e mensageria"
                value={form.roleDescription}
                onChange={(e) => update('roleDescription', e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="gp-seniority" className={labelClass}>
                Senioridade
              </label>
              <select
                id="gp-seniority"
                className={inputClass}
                value={form.seniority}
                onChange={(e) => update('seniority', e.target.value)}
              >
                {SENIORITY_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="gp-company" className={labelClass}>
                Empresa-alvo <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                id="gp-company"
                type="text"
                className={inputClass}
                placeholder="Ex.: Nubank, Google, iFood…"
                value={form.targetCompany}
                onChange={(e) => update('targetCompany', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="gp-difficulty" className={labelClass}>
                Dificuldade
              </label>
              <select
                id="gp-difficulty"
                className={inputClass}
                value={form.difficulty}
                onChange={(e) => update('difficulty', e.target.value)}
              >
                {DIFFICULTY_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 dark:border-signal-red/40 bg-red-50 dark:bg-signal-red/10 px-3 py-2 text-sm text-red-700 dark:text-signal-red">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <TacticalButton type="button" variant="ghost" onClick={onClose} disabled={loading}>
                Cancelar
              </TacticalButton>
              <TacticalButton type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                    Gerando…
                  </>
                ) : (
                  'Gerar problema'
                )}
              </TacticalButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GenerateProblemModal
