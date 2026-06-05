import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../utils/api'
import type { Quiz, QuizAttempt, QuizAnswer } from '../../types'
import { TacticalButton } from '../../components/tactical'

interface QuizState {
  currentQuestionIndex: number
  answers: QuizAnswer[]
  startTime: number
  questionStartTime: number
}

function QuizTake() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  const [quizState, setQuizState] = useState<QuizState | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showingResult, setShowingResult] = useState(false)
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchQuiz()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [id])

  // Timer effect
  useEffect(() => {
    if (!quiz || !quizState || showingResult) return

    setTimeLeft(quiz.time_limit_seconds)
    setSelectedOption(null)

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [quizState?.currentQuestionIndex, quiz, showingResult])

  const fetchQuiz = async () => {
    try {
      setLoading(true)
      const response = await api.get<Quiz>(`/api/quizzes/${id}`)
      setQuiz(response.data)
      
      // Initialize quiz state
      setQuizState({
        currentQuestionIndex: 0,
        answers: [],
        startTime: Date.now(),
        questionStartTime: Date.now()
      })
    } catch (error: any) {
      console.error('Erro ao buscar quiz:', error)
      if (error.response?.status === 404) {
        setError('Quiz não encontrado')
      } else {
        setError('Não foi possível carregar o quiz')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTimeUp = useCallback(() => {
    if (!quiz || !quizState) return
    
    const currentQuestion = quiz.questions?.[quizState.currentQuestionIndex]
    if (!currentQuestion) return

    const timeTaken = Math.floor((Date.now() - quizState.questionStartTime) / 1000)
    
    // Record answer as null (timed out)
    const newAnswer: QuizAnswer = {
      question_id: currentQuestion.id,
      selected_option_id: null,
      time_taken_seconds: timeTaken
    }

    moveToNextQuestion(newAnswer)
  }, [quiz, quizState])

  const handleSelectOption = (optionId: number) => {
    if (selectedOption !== null) return // Already selected
    setSelectedOption(optionId)
    
    if (timerRef.current) clearInterval(timerRef.current)

    if (!quiz || !quizState) return
    
    const currentQuestion = quiz.questions?.[quizState.currentQuestionIndex]
    if (!currentQuestion) return

    const timeTaken = Math.floor((Date.now() - quizState.questionStartTime) / 1000)
    
    const newAnswer: QuizAnswer = {
      question_id: currentQuestion.id,
      selected_option_id: optionId,
      time_taken_seconds: timeTaken
    }

    // Small delay before moving to next question
    setTimeout(() => {
      moveToNextQuestion(newAnswer)
    }, 500)
  }

  const moveToNextQuestion = (answer: QuizAnswer) => {
    if (!quiz || !quizState) return

    const newAnswers = [...quizState.answers, answer]
    const nextIndex = quizState.currentQuestionIndex + 1

    if (nextIndex >= (quiz.questions?.length || 0)) {
      // Quiz finished - submit
      submitQuiz(newAnswers)
    } else {
      // Move to next question
      setQuizState({
        ...quizState,
        currentQuestionIndex: nextIndex,
        answers: newAnswers,
        questionStartTime: Date.now()
      })
      setSelectedOption(null)
    }
  }

  const submitQuiz = async (answers: QuizAnswer[]) => {
    if (!quiz) return

    setSubmitting(true)
    try {
      const response = await api.post<QuizAttempt>(`/api/quizzes/${quiz.id}/attempt`, {
        answers
      })
      setAttempt(response.data)
      setShowingResult(true)
    } catch (error) {
      console.error('Erro ao submeter quiz:', error)
      setError('Não foi possível enviar suas respostas')
    } finally {
      setSubmitting(false)
    }
  }

  const getTimerColor = () => {
    if (!quiz) return 'text-brand-600 dark:text-signal-cyan'
    const percentage = (timeLeft / quiz.time_limit_seconds) * 100
    if (percentage > 50) return 'text-signal-green'
    if (percentage > 25) return 'text-signal-amber'
    return 'text-signal-red'
  }

  const getTimerBgColor = () => {
    if (!quiz) return 'border-slate-200 dark:border-tactical-line bg-slate-100 dark:bg-tactical-raised'
    const percentage = (timeLeft / quiz.time_limit_seconds) * 100
    if (percentage > 50) return 'border-signal-green/40 bg-signal-green/10'
    if (percentage > 25) return 'border-signal-amber/40 bg-signal-amber/10'
    return 'border-signal-red/40 bg-signal-red/10'
  }

  const getScoreHeaderClass = (percentage: number) => {
    if (percentage >= 70) return 'bg-tactical-raised border-b border-signal-green/40'
    if (percentage >= 40) return 'bg-tactical-raised border-b border-signal-amber/40'
    return 'bg-tactical-raised border-b border-signal-red/40'
  }

  const getScoreTextClass = (percentage: number) => {
    if (percentage >= 70) return 'text-signal-green'
    if (percentage >= 40) return 'text-signal-amber'
    return 'text-signal-red'
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 dark:border-signal-green"></div>
        </div>
      </>
    )
  }

  if (error || !quiz || !quiz.questions) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex items-center justify-center">
          <div className="text-center p-8 tactical-panel max-w-md dark:rounded-none">
            <div className="text-signal-red text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-tactical-text mb-2">
              {error || 'Quiz não encontrado'}
            </h2>
            <TacticalButton variant="primary" onClick={() => navigate('/quizzes')} className="mt-4">
              Voltar para Quizzes
            </TacticalButton>
          </div>
        </div>
      </>
    )
  }

  // Show results
  if (showingResult && attempt) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark py-12 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Score Card */}
            <div className="tactical-panel overflow-hidden mb-8 dark:rounded-none">
              <div className={`p-8 text-center ${getScoreHeaderClass(attempt.percentage)}`}>
                <div className="text-6xl mb-4">
                  {attempt.percentage >= 70 ? '🎉' : attempt.percentage >= 40 ? '👍' : '💪'}
                </div>
                <h1 className={`text-4xl font-bold font-mono tabular-nums mb-2 ${getScoreTextClass(attempt.percentage)}`}>
                  {attempt.percentage}%
                </h1>
                <p className="text-slate-600 dark:text-tactical-dim text-lg font-mono tabular-nums">
                  {attempt.score} de {attempt.total_questions} corretas
                </p>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-tactical-text mb-4">
                  {quiz.title}
                </h2>
                <p className="text-slate-600 dark:text-tactical-dim mb-6">
                  {attempt.percentage >= 70 ? 'Excelente trabalho! Você domina esse assunto.' :
                   attempt.percentage >= 40 ? 'Bom trabalho! Continue estudando para melhorar.' :
                   'Continue praticando! Revise o material e tente novamente.'}
                </p>

                <div className="flex gap-4">
                  <TacticalButton variant="secondary" onClick={() => navigate('/quizzes')} className="flex-1">
                    Ver Outros Quizzes
                  </TacticalButton>
                  <TacticalButton
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      setShowingResult(false)
                      setAttempt(null)
                      setQuizState({
                        currentQuestionIndex: 0,
                        answers: [],
                        startTime: Date.now(),
                        questionStartTime: Date.now()
                      })
                    }}
                  >
                    Refazer Quiz
                  </TacticalButton>
                </div>
              </div>
            </div>

            {/* Answers Review */}
            <div className="tactical-panel p-6 dark:rounded-none">
              <h3 className="text-lg font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-tactical-text mb-6 flex items-center gap-2 before:content-[''] before:h-5 before:w-1 before:bg-signal-amber">
                Revisão das Respostas
              </h3>

              <div className="space-y-6">
                {attempt.quiz?.questions?.map((question, index) => {
                  const answer = attempt.answers[index]
                  const correctOption = question.options.find(o => o.is_correct)
                  const isCorrect = answer?.is_correct

                  return (
                    <div key={question.id} className="border-b border-slate-100 dark:border-tactical-border pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3 mb-3">
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                          isCorrect 
                            ? 'border border-signal-green/40 bg-signal-green/10 text-signal-green' 
                            : 'border border-signal-red/40 bg-signal-red/10 text-signal-red'
                        }`}>
                          {isCorrect ? '✓' : '✗'}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-tactical-text">
                            {question.question_text}
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-signal-green mt-2">
                              <span className="font-mono uppercase tracking-wider text-xs">Resposta correta:</span> {correctOption?.option_text}
                            </p>
                          )}
                          {question.explanation && (
                            <p className="text-sm text-slate-500 dark:text-tactical-dim mt-2 italic">
                              💡 {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Quiz in progress
  const currentQuestion = quiz.questions[quizState?.currentQuestionIndex || 0]
  const progress = ((quizState?.currentQuestionIndex || 0) / quiz.questions.length) * 100

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-tactical-text">
                {quiz.title}
              </h1>
              <span className="text-sm font-mono tabular-nums text-slate-500 dark:text-tactical-label">
                {(quizState?.currentQuestionIndex || 0) + 1}/{quiz.questions.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-slate-200 dark:bg-tactical-raised overflow-hidden">
              <div 
                className="h-full bg-signal-green transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex justify-center mb-8">
            <div className={`px-6 py-3 border font-mono tabular-nums text-2xl font-bold flex items-center gap-2 transition-colors dark:rounded-none ${getTimerBgColor()} ${getTimerColor()}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {timeLeft}s
            </div>
          </div>

          {/* Question Card */}
          <div className="tactical-panel p-8 mb-6 dark:rounded-none">
            <p className="text-xl font-medium text-slate-900 dark:text-tactical-text mb-8 text-center">
              {currentQuestion.question_text}
            </p>

            {/* Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === option.id
                const optionLabel = String.fromCharCode(65 + index) // A, B, C, D

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    disabled={selectedOption !== null || submitting}
                    className={`w-full p-4 border-2 text-left transition-all duration-200 flex items-center gap-4 dark:rounded-none ${
                      isSelected
                        ? 'border-signal-green bg-signal-green/10 dark:bg-signal-green/10'
                        : 'border-slate-200 dark:border-tactical-border hover:border-signal-green/50 bg-white dark:bg-tactical-surface'
                    } ${selectedOption !== null && !isSelected ? 'opacity-50' : ''}`}
                  >
                    <span className={`flex-shrink-0 w-10 h-10 flex items-center justify-center font-bold text-lg font-mono dark:rounded-none ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-black'
                        : 'bg-slate-100 dark:bg-tactical-raised text-slate-600 dark:text-tactical-dim'
                    }`}>
                      {optionLabel}
                    </span>
                    <span className={`text-lg ${isSelected ? 'text-slate-900 dark:text-tactical-text font-medium' : 'text-slate-700 dark:text-tactical-dim'}`}>
                      {option.option_text}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submitting indicator */}
          {submitting && (
            <div className="flex items-center justify-center gap-3 text-slate-600 dark:text-tactical-dim font-mono uppercase tracking-wider text-xs">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-600 dark:border-signal-green"></div>
              Enviando respostas...
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default QuizTake

