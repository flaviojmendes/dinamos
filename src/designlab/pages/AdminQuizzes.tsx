import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { TacticalButton, StatusBadge } from '../components/tactical'

const inputClass =
  'w-full px-4 py-2 bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text placeholder:text-slate-400 dark:placeholder:text-tactical-label focus:ring-brand-500 dark:focus:ring-signal-green dark:rounded-none'
const labelClass = 'block label-mono text-slate-600 dark:text-tactical-dim mb-1'
import api from '../utils/api'
import type { Quiz } from '../types'
import { useAuth } from '../contexts/AuthContext'

interface QuizOptionForm {
  option_text: string
  is_correct: boolean
}

interface QuizQuestionForm {
  question_text: string
  explanation: string
  options: QuizOptionForm[]
}

interface QuizForm {
  title: string
  theme: string
  description: string
  time_limit_seconds: number
  is_published: boolean
  order: number
  questions: QuizQuestionForm[]
}

const emptyQuestion: QuizQuestionForm = {
  question_text: '',
  explanation: '',
  options: [
    { option_text: '', is_correct: true },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
  ]
}

const emptyQuiz: QuizForm = {
  title: '',
  theme: '',
  description: '',
  time_limit_seconds: 30,
  is_published: false,
  order: 0,
  questions: []
}

function AdminQuizzes() {
  const { appUser, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [quizForm, setQuizForm] = useState<QuizForm>(emptyQuiz)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState<'info' | 'questions'>('info')
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  // Check admin access
  useEffect(() => {
    if (!authLoading && appUser && !['Admin', 'Tutor'].includes(appUser.role || '')) {
      navigate('/home')
    }
  }, [appUser, authLoading, navigate])

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      setLoading(true)
      const response = await api.get<{ quizzes: Quiz[] }>('/api/admin/quizzes')
      setQuizzes(response.data.quizzes)
    } catch (error) {
      console.error('Erro ao buscar quizzes:', error)
      setError('Não foi possível carregar os quizzes')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingQuiz(null)
    setQuizForm(emptyQuiz)
    setCurrentStep('info')
    setShowModal(true)
  }

  const openEditModal = (quiz: Quiz) => {
    setEditingQuiz(quiz)
    setQuizForm({
      title: quiz.title,
      theme: quiz.theme,
      description: quiz.description || '',
      time_limit_seconds: quiz.time_limit_seconds,
      is_published: quiz.is_published,
      order: quiz.order,
      questions: quiz.questions?.map(q => ({
        question_text: q.question_text,
        explanation: q.explanation || '',
        options: q.options.map(o => ({
          option_text: o.option_text,
          is_correct: o.is_correct || false
        }))
      })) || []
    })
    setCurrentStep('info')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingQuiz(null)
    setQuizForm(emptyQuiz)
    setCurrentStep('info')
  }

  const handleSave = async () => {
    if (!quizForm.title || !quizForm.theme) {
      alert('Preencha título e tema')
      return
    }

    setSaving(true)
    try {
      if (editingQuiz) {
        // Update quiz info
        await api.put(`/api/admin/quizzes/${editingQuiz.id}`, {
          title: quizForm.title,
          theme: quizForm.theme,
          description: quizForm.description || null,
          time_limit_seconds: quizForm.time_limit_seconds,
          is_published: quizForm.is_published,
          order: quizForm.order
        })
      } else {
        // Create new quiz with questions
        await api.post('/api/admin/quizzes', {
          title: quizForm.title,
          theme: quizForm.theme,
          description: quizForm.description || null,
          time_limit_seconds: quizForm.time_limit_seconds,
          is_published: quizForm.is_published,
          order: quizForm.order,
          questions: quizForm.questions.length > 0 ? quizForm.questions : undefined
        })
      }
      
      await fetchQuizzes()
      closeModal()
    } catch (error: any) {
      console.error('Erro ao salvar quiz:', error)
      alert(error.response?.data?.detail || 'Erro ao salvar quiz')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (quizId: number) => {
    try {
      await api.delete(`/api/admin/quizzes/${quizId}`)
      await fetchQuizzes()
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Erro ao excluir quiz:', error)
      alert('Erro ao excluir quiz')
    }
  }

  const togglePublish = async (quiz: Quiz) => {
    try {
      await api.put(`/api/admin/quizzes/${quiz.id}`, {
        is_published: !quiz.is_published
      })
      await fetchQuizzes()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const addQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, { ...emptyQuestion, options: emptyQuestion.options.map(o => ({ ...o })) }]
    })
  }

  const removeQuestion = (index: number) => {
    const newQuestions = [...quizForm.questions]
    newQuestions.splice(index, 1)
    setQuizForm({ ...quizForm, questions: newQuestions })
  }

  const updateQuestion = (index: number, field: string, value: string) => {
    const newQuestions = [...quizForm.questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuizForm({ ...quizForm, questions: newQuestions })
  }

  const updateOption = (qIndex: number, oIndex: number, field: string, value: string | boolean) => {
    const newQuestions = [...quizForm.questions]
    const newOptions = [...newQuestions[qIndex].options]
    
    if (field === 'is_correct' && value === true) {
      // Only one correct answer per question
      newOptions.forEach((o, i) => {
        newOptions[i] = { ...o, is_correct: i === oIndex }
      })
    } else {
      newOptions[oIndex] = { ...newOptions[oIndex], [field]: value }
    }
    
    newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions }
    setQuizForm({ ...quizForm, questions: newQuestions })
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 dark:border-signal-green"></div>
        </div>
      </>
    )
  }

  if (!appUser || !['Admin', 'Tutor'].includes(appUser.role || '')) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-mono uppercase tracking-wider font-bold text-slate-900 dark:text-tactical-text flex items-center gap-3 before:content-[''] before:h-6 before:w-1 before:bg-signal-amber before:shrink-0">
                Gerenciar Quizzes
              </h1>
              <p className="text-slate-500 dark:text-tactical-label mt-1">
                Crie e gerencie quizzes para os alunos
              </p>
            </div>
            <TacticalButton variant="primary" onClick={openCreateModal} className="gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Quiz
            </TacticalButton>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 dark:border-signal-green"></div>
            </div>
          ) : error ? (
            <div className="text-center p-12 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-16 tactical-panel dark:rounded-none">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Nenhum quiz criado
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Crie seu primeiro quiz para os alunos
              </p>
              <TacticalButton variant="primary" onClick={openCreateModal}>
                Criar Quiz
              </TacticalButton>
            </div>
          ) : (
            <div className="tactical-panel overflow-hidden dark:rounded-none">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-tactical-surface">
                  <tr>
                    <th className="label-mono px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                      Quiz
                    </th>
                    <th className="label-mono px-6 py-3 text-left border-b border-slate-200 dark:border-tactical-border">
                      Tema
                    </th>
                    <th className="label-mono px-6 py-3 text-center border-b border-slate-200 dark:border-tactical-border">
                      Questões
                    </th>
                    <th className="label-mono px-6 py-3 text-center border-b border-slate-200 dark:border-tactical-border">
                      Tempo
                    </th>
                    <th className="label-mono px-6 py-3 text-center border-b border-slate-200 dark:border-tactical-border">
                      Status
                    </th>
                    <th className="label-mono px-6 py-3 text-right border-b border-slate-200 dark:border-tactical-border">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id} className="border-b border-slate-100 dark:border-tactical-border/60 hover:bg-slate-50 dark:hover:bg-tactical-raised">
                      <td className="px-6 py-4 font-mono text-slate-800 dark:text-tactical-text">
                        <div>
                          <div className="font-medium">
                            {quiz.title}
                          </div>
                          {quiz.description && (
                            <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">
                              {quiz.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider border border-signal-cyan/40 text-signal-cyan bg-signal-cyan/10 dark:rounded-none">
                          {quiz.theme}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono tabular-nums text-slate-600 dark:text-tactical-dim">
                        {quiz.question_count}
                      </td>
                      <td className="px-6 py-4 text-center font-mono tabular-nums text-slate-600 dark:text-tactical-dim">
                        {quiz.time_limit_seconds}s
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button type="button" onClick={() => togglePublish(quiz)} className="inline-block">
                          <StatusBadge
                            variant={quiz.is_published ? 'active' : 'pending'}
                            label={quiz.is_published ? 'PUBLICADO' : 'RASCUNHO'}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(quiz)}
                            className="p-2 text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400"
                            title="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {deleteConfirm === quiz.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(quiz.id)}
                                className="p-2 text-red-600 hover:text-red-700"
                                title="Confirmar"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="p-2 text-slate-500 hover:text-slate-700"
                                title="Cancelar"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(quiz.id)}
                              className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                              title="Excluir"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 bg-black/50" onClick={closeModal}></div>
            
            <div className="relative tactical-panel max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col dark:rounded-none">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-tactical-border flex items-center justify-between">
                <h2 className="font-mono uppercase tracking-wider text-xl font-bold text-slate-900 dark:text-tactical-text">
                  {editingQuiz ? 'Editar Quiz' : 'Novo Quiz'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Steps */}
              <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 flex gap-4">
                <button
                  onClick={() => setCurrentStep('info')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentStep === 'info'
                      ? 'border border-signal-cyan/40 text-signal-cyan bg-signal-cyan/10 font-mono uppercase tracking-wider text-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-tactical-dim font-mono uppercase tracking-wider text-xs'
                  }`}
                >
                  1. Informações
                </button>
                <button
                  onClick={() => setCurrentStep('questions')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentStep === 'questions'
                      ? 'border border-signal-cyan/40 text-signal-cyan bg-signal-cyan/10 font-mono uppercase tracking-wider text-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-tactical-dim font-mono uppercase tracking-wider text-xs'
                  }`}
                >
                  2. Questões ({quizForm.questions.length})
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {currentStep === 'info' ? (
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>
                        Título *
                      </label>
                      <input
                        type="text"
                        value={quizForm.title}
                        onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                        className={inputClass}
                        placeholder="Ex: Fundamentos de System Design"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Tema *
                      </label>
                      <input
                        type="text"
                        value={quizForm.theme}
                        onChange={(e) => setQuizForm({ ...quizForm, theme: e.target.value })}
                        className={inputClass}
                        placeholder="Ex: System Design, Databases, Networks"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Descrição
                      </label>
                      <textarea
                        value={quizForm.description}
                        onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                        rows={3}
                        className={inputClass}
                        placeholder="Uma breve descrição do quiz..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>
                          Tempo por questão (segundos)
                        </label>
                        <input
                          type="number"
                          value={quizForm.time_limit_seconds}
                          onChange={(e) => setQuizForm({ ...quizForm, time_limit_seconds: parseInt(e.target.value) || 30 })}
                          min={5}
                          max={300}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Ordem
                        </label>
                        <input
                          type="number"
                          value={quizForm.order}
                          onChange={(e) => setQuizForm({ ...quizForm, order: parseInt(e.target.value) || 0 })}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_published"
                        checked={quizForm.is_published}
                        onChange={(e) => setQuizForm({ ...quizForm, is_published: e.target.checked })}
                        className="w-4 h-4 accent-signal-green border-slate-300 dark:border-tactical-border dark:rounded-none"
                      />
                      <label htmlFor="is_published" className="text-sm text-slate-700 dark:text-slate-300">
                        Publicar quiz (visível para alunos)
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {quizForm.questions.map((question, qIndex) => (
                      <div key={qIndex} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-medium text-slate-900 dark:text-white">
                            Questão {qIndex + 1}
                          </span>
                          <button
                            onClick={() => removeQuestion(qIndex)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remover
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                              Pergunta *
                            </label>
                            <textarea
                              value={question.question_text}
                              onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                              placeholder="Digite a pergunta..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                              Explicação (opcional)
                            </label>
                            <input
                              type="text"
                              value={question.explanation}
                              onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                              placeholder="Explicação mostrada após responder..."
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
                              Alternativas (marque a correta)
                            </label>
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  checked={option.is_correct}
                                  onChange={() => updateOption(qIndex, oIndex, 'is_correct', true)}
                                  className="w-4 h-4 text-emerald-600"
                                />
                                <span className="text-sm font-medium text-slate-500 w-6">
                                  {String.fromCharCode(65 + oIndex)}
                                </span>
                                <input
                                  type="text"
                                  value={option.option_text}
                                  onChange={(e) => updateOption(qIndex, oIndex, 'option_text', e.target.value)}
                                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                                  placeholder={`Alternativa ${String.fromCharCode(65 + oIndex)}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addQuestion}
                      className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:border-sky-500 hover:text-sky-600 transition-colors"
                    >
                      + Adicionar Questão
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-200 dark:border-tactical-border flex justify-end gap-3">
                <TacticalButton variant="secondary" onClick={closeModal}>
                  Cancelar
                </TacticalButton>
                <TacticalButton variant="primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Quiz'}
                </TacticalButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminQuizzes

