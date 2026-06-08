import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiClient } from '../utils/api'
import { TacticalButton } from './tactical'

interface OnboardingProps {
  onComplete: () => void
}

interface OnboardingStep {
  id: string
  targetId: string | null // Element ID to highlight, null for welcome/end screens
  title: string
  description: string
  icon: React.ReactNode
  gradient: string
  position: 'center' | 'bottom' | 'top' // Where to show the tooltip relative to viewport
  features?: string[]
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    targetId: null,
    title: 'Bem-vindo ao Design Lab! 🚀',
    description: 'Vamos fazer um tour rápido pelas principais funcionalidades da plataforma.',
    gradient: 'from-violet-600 via-purple-600 to-indigo-700',
    position: 'center',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" className="animate-spin" style={{ animationDuration: '20s' }} />
        <circle cx="32" cy="32" r="18" fill="currentColor" fillOpacity="0.1" />
        <path d="M24 28L32 20L40 28M32 20V44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    features: [
      'Pratique System Design com desafios reais',
      'Participe de uma comunidade ativa',
      'Teste seus conhecimentos com quizzes'
    ]
  },
  {
    id: 'challenges',
    targetId: 'onboarding-challenges',
    title: '🎯 Desafios de System Design',
    description: 'Aqui você encontra problemas reais de arquitetura para resolver. Selecione um desafio, projete sua solução usando a lousa virtual e receba feedback detalhado com IA.',
    gradient: 'from-sky-500 via-cyan-500 to-teal-500',
    position: 'bottom',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="12" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="26" y="12" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="17" y="26" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M15 22V24H24V26" stroke="currentColor" strokeWidth="2" />
        <path d="M33 22V24H24V26" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    features: [
      'Lousa virtual para diagramas',
      'Avaliação com inteligência artificial',
      'Múltiplas tentativas permitidas'
    ]
  },
  {
    id: 'forum',
    targetId: 'onboarding-forum',
    title: '💬 Fórum & Gamificação',
    description: 'Conecte-se com a comunidade! Crie tópicos, tire dúvidas e compartilhe conhecimento. Você ganha tokens por cada contribuição e pode subir no ranking.',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    position: 'bottom',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <path d="M12 16C12 13.791 13.791 12 16 12H32C34.209 12 36 13.791 36 16V28C36 30.209 34.209 32 32 32H26L20 38V32H16C13.791 32 12 30.209 12 28V16Z" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="22" r="2" fill="currentColor" />
        <circle cx="28" cy="22" r="2" fill="currentColor" />
        <circle cx="36" cy="12" r="6" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
        <text x="36" y="15" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold">🪙</text>
      </svg>
    ),
    features: [
      'Ganhe tokens participando',
      'Sistema de votos e reputação',
      'Diagramas inline nas respostas'
    ]
  },
  {
    id: 'quizzes',
    targetId: 'onboarding-quizzes',
    title: '🧠 Quizzes Interativos',
    description: 'Teste e reforce seus conhecimentos em System Design com quizzes cronometrados. Compare seu desempenho no ranking e acompanhe sua evolução.',
    gradient: 'from-emerald-500 via-green-500 to-lime-500',
    position: 'bottom',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <rect x="10" y="10" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M18 24L22 28L30 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
      </svg>
    ),
    features: [
      'Questões por tema',
      'Ranking e leaderboard',
      'Acompanhe seu progresso'
    ]
  },
  {
    id: 'workflow',
    targetId: 'onboarding-workflow',
    title: '📋 Fluxo de Trabalho',
    description: 'Cada desafio segue um fluxo estruturado: análise de requisitos, design da arquitetura e feedback automático. É assim que você evolui!',
    gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
    position: 'top',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
        <circle cx="12" cy="24" r="6" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2" />
        <circle cx="36" cy="24" r="6" stroke="currentColor" strokeWidth="2" />
        <path d="M18 24H18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 24H30.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    features: [
      'Requisitos → Design → Feedback',
      'Aprenda fazendo',
      'Melhore a cada iteração'
    ]
  },
  {
    id: 'ready',
    targetId: null,
    title: 'Tudo pronto! 🎉',
    description: 'Agora você conhece as principais funcionalidades. Comece explorando um desafio ou navegue pelo fórum para conhecer a comunidade.',
    gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
    position: 'center',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="24" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <path d="M22 32L28 38L42 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 50V56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 32H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 32H56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    features: [
      'Explore os desafios disponíveis',
      'Participe das discussões no fórum',
      'Teste-se nos quizzes'
    ]
  }
]

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)

  const step = onboardingSteps[currentStep]
  const isLastStep = currentStep === onboardingSteps.length - 1
  const isFirstStep = currentStep === 0
  const isCenterStep = step.targetId === null

  // Scroll to and highlight target element
  const scrollToTarget = useCallback(() => {
    if (step.targetId) {
      const element = document.getElementById(step.targetId)
      if (element) {
        // Scroll element into view with offset
        const yOffset = -100
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
        
        // Update highlight position after scroll
        setTimeout(() => {
          const rect = element.getBoundingClientRect()
          setHighlightRect(rect)
        }, 400)
      }
    } else {
      setHighlightRect(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [step.targetId])

  useEffect(() => {
    scrollToTarget()
    
    // Update highlight on resize
    const handleResize = () => {
      if (step.targetId) {
        const element = document.getElementById(step.targetId)
        if (element) {
          setHighlightRect(element.getBoundingClientRect())
        }
      }
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize)
    }
  }, [currentStep, scrollToTarget, step.targetId])

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = async () => {
    await saveOnboardingComplete()
    setIsExiting(true)
    setTimeout(onComplete, 300)
  }

  const handleComplete = async () => {
    await saveOnboardingComplete()
    setIsExiting(true)
    setTimeout(onComplete, 300)
  }

  const saveOnboardingComplete = async () => {
    try {
      await apiClient.put('/api/users/me/onboarding-complete')
    } catch (error) {
      console.error('Error saving onboarding status:', error)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext()
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        handlePrevious()
      } else if (e.key === 'Escape') {
        handleSkip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] pointer-events-none"
        >
          {/* Dark overlay with cutout for highlighted element */}
          <div className="absolute inset-0 pointer-events-auto">
            {isCenterStep ? (
              // Full dark overlay for center modals
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleSkip} />
            ) : (
              // SVG mask with cutout for highlighted element
              <svg className="absolute inset-0 w-full h-full" onClick={handleSkip}>
                <defs>
                  <mask id="spotlight-mask">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    {highlightRect && (
                      <rect
                        x={highlightRect.left - 12}
                        y={highlightRect.top - 12}
                        width={highlightRect.width + 24}
                        height={highlightRect.height + 24}
                        rx="16"
                        fill="black"
                      />
                    )}
                  </mask>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="rgba(15, 23, 42, 0.85)"
                  mask="url(#spotlight-mask)"
                />
              </svg>
            )}
            
            {/* Highlight border around target element */}
            {highlightRect && !isCenterStep && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute rounded-2xl pointer-events-none"
                style={{
                  left: highlightRect.left - 12,
                  top: highlightRect.top - 12,
                  width: highlightRect.width + 24,
                  height: highlightRect.height + 24,
                }}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${step.gradient} opacity-30 animate-pulse`} />
                <div className="absolute inset-0 rounded-2xl border-2 border-signal-green/50 dark:border-signal-green" />
              </motion.div>
            )}
          </div>

          {/* Tooltip/Card */}
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`pointer-events-auto absolute ${
              isCenterStep
                ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4'
                : step.position === 'bottom'
                ? 'left-1/2 -translate-x-1/2 w-full max-w-md mx-4'
                : 'left-1/2 -translate-x-1/2 w-full max-w-md mx-4'
            }`}
            style={
              !isCenterStep && highlightRect
                ? {
                    top:
                      step.position === 'bottom'
                        ? highlightRect.bottom + 24
                        : highlightRect.top - 24,
                    transform:
                      step.position === 'bottom'
                        ? 'translateX(-50%)'
                        : 'translateX(-50%) translateY(-100%)',
                  }
                : {}
            }
          >
            <div className="absolute -inset-1 bg-signal-amber/20 dark:bg-signal-green/10 rounded-xl blur-lg" />
            
            <div className="relative tactical-panel overflow-hidden bg-white dark:bg-tactical-surface border-slate-200 dark:border-tactical-border">
              <div className="h-1 bg-signal-amber dark:bg-signal-green" />
              
              {/* Content */}
              <div className="p-6">
                {/* Icon and Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-slate-700 dark:text-tactical-dim opacity-90 flex-shrink-0">
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-sans text-xl font-bold text-slate-900 dark:text-tactical-text mb-2">
                      {step.title}
                    </h2>
                    <p className="text-slate-600 dark:text-tactical-dim text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                {step.features && (
                  <div className="grid gap-2 mb-5 pl-16">
                    {step.features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="flex items-center gap-2 text-slate-700 dark:text-tactical-dim text-sm"
                      >
                        <div className="w-5 h-5 rounded-full border border-signal-green/40 bg-signal-green/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-signal-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Progress dots */}
                <div className="flex justify-center gap-1.5 mb-4">
                  {onboardingSteps.map((s, index) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentStep(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? 'bg-signal-green w-6'
                          : index < currentStep
                          ? 'bg-slate-400 dark:bg-tactical-dim w-2'
                          : 'bg-slate-200 dark:bg-tactical-line w-2'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <TacticalButton variant="ghost" size="sm" onClick={handleSkip} className="">
                    Pular
                  </TacticalButton>

                  <div className="flex gap-2">
                    {!isFirstStep && (
                      <TacticalButton variant="secondary" size="sm" onClick={handlePrevious} className="">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Anterior
                      </TacticalButton>
                    )}

                    <TacticalButton variant="primary" size="sm" onClick={handleNext} className="">
                      {isLastStep ? 'Começar!' : 'Próximo'}
                      {!isLastStep ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                    </TacticalButton>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="font-sans text-xs text-slate-500 dark:text-tactical-label">
                    {currentStep + 1} de {onboardingSteps.length} • Use ← → para navegar
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
