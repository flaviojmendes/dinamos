import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Excalidraw } from '@excalidraw/excalidraw'
import type { Challenge, SolutionSubmission, FeedbackData, Solution } from '../types'
import { excalidrawTemplate } from '../templates/excalidrawTemplate'
// Excalidraw 0.18 no longer exposes the legacy /types/types subpath; the zoom
// value is a branded number, modeled locally to avoid the version-specific path.
type NormalizedZoomValue = number & { _brand: 'normalizedZoom' }
import Stepper from '../components/Stepper'
import { TacticalButton } from '../components/tactical'
import AudioRecorder from '../components/AudioRecorder'
import api from '../utils/api'
import { trackChallengeView, trackChallengeStart, trackChallengeSubmit } from '../utils/analytics'

const WIZARD_STEPS = [
  { 
    id: 0, 
    title: 'Requisitos Funcionais', 
    sectionId: 'usbb1RGX7SaQAxmSG9Eo4',
    isEditable: false,
    prefilledContent: '' // Will be loaded from API
  },
  { id: 1, title: 'Requisitos Não Funcionais', sectionId: 'kS55bXRtcNp14pgZaNO6M', isEditable: true },
  { id: 2, title: 'Entidades', sectionId: 'g_Xz9x-jQxvvAuTPtrsCa', isEditable: true },
  { id: 3, title: 'APIs', sectionId: 'DOoXdK6_BNpos0Zg8IN9z', isEditable: true },
  { id: 4, title: 'Design High-Level', sectionId: 'NNmR1YqI_ZU41pRL18ZfC', isEditable: true },
]

interface StepContent {
  [key: number]: string
}

function Challenge() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [stepContents, setStepContents] = useState<StepContent>({})
  const [currentInput, setCurrentInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [audioTranscription, setAudioTranscription] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [historySolutions, setHistorySolutions] = useState<Solution[]>([])
  
  // Excalidraw state
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)
  const [diagramElements, setDiagramElements] = useState<any[]>(() => {
    console.log('Initializing diagram with', excalidrawTemplate.elements.length, 'template elements')
    return [...excalidrawTemplate.elements]
  })

  // Use ref to ensure prefilled content is only added once, even in StrictMode
  const prefilledContentAddedRef = useRef(false)
  const progressLoadedRef = useRef(false)
  
  // Ref to track if we should sync to Excalidraw
  const shouldSyncToExcalidrawRef = useRef(false)

  // We need a ref to access the latest challenge data inside the effect
  const challengeRef = useRef<Challenge | null>(null)
  
  // Ref to track if challenge start has been tracked
  const challengeStartTrackedRef = useRef(false)

  useEffect(() => {
    fetchChallenge()
  }, [id])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Add prefilled content when challenge loads - only once using ref
  useEffect(() => {
    if (!challenge || prefilledContentAddedRef.current) {
      return
    }

    console.log('Adding prefilled content from challenge data...')
    const prefilledSteps = WIZARD_STEPS.filter(step => step.id === 0) // Step 0 is functional requirements
    
    // Prepare new step contents
    const newStepContents: StepContent = {}
    const newElements: any[] = []
    
    prefilledSteps.forEach(step => {
      const content = challenge.initial_requirements || ''
      
      if (content) {
        newStepContents[step.id] = content
        
        // Create text element
        const section = excalidrawTemplate.elements.find((el: any) => el.id === step.sectionId) as any
        if (section) {
          const fontSize = 14
          const lineHeight = 1.25
          const textStartY = section.y + 50
          const lines = content.split('\n')
          const avgCharWidth = fontSize * 0.6
          const calculatedWidth = Math.min(
            Math.max(...lines.map(line => line.length * avgCharWidth)),
            section.width - 40
          )
          const calculatedHeight = lines.length * fontSize * lineHeight

          newElements.push({
            id: `text_prefilled_${step.id}`,
            type: 'text',
            x: section.x + 20,
            y: textStartY,
            width: calculatedWidth,
            height: calculatedHeight,
            angle: 0,
            strokeColor: '#1971c2',
            backgroundColor: 'transparent',
            fillStyle: 'solid',
            strokeWidth: 1,
            strokeStyle: 'solid',
            roughness: 0,
            opacity: 100,
            groupIds: [],
            frameId: null,
            roundness: null,
            seed: Math.floor(Math.random() * 1000000),
            version: 1,
            versionNonce: Math.floor(Math.random() * 1000000),
            isDeleted: false,
            boundElements: null,
            updated: Date.now(),
            link: null,
            locked: false,
            text: content,
            fontSize: fontSize,
            fontFamily: 1,
            textAlign: 'left',
            verticalAlign: 'top',
            containerId: null,
            originalText: content,
            autoResize: true,
            lineHeight: lineHeight,
            baseline: calculatedHeight - 4,
          })
        }
      }
    })
    
    // Update state once if we have new content
    if (Object.keys(newStepContents).length > 0) {
        setStepContents(prev => ({ ...prev, ...newStepContents }))
        if (newElements.length > 0) {
            shouldSyncToExcalidrawRef.current = true
            setDiagramElements(prev => [...prev, ...newElements])
        }
        
        // Mark as added using ref (persists across re-renders)
        prefilledContentAddedRef.current = true
        console.log('Prefilled content added:', newElements.length, 'elements')
    }
    
    // Load progress after challenge is loaded
    loadProgress()
  }, [challenge])

  const fetchChallenge = async () => {
    try {
      const response = await api.get<Challenge>(`/api/challenges/${id}`)
      const challengeData = response.data
      setChallenge(challengeData)
      challengeRef.current = challengeData
      // Track challenge view
      trackChallengeView(id || '', challengeData.title)
    } catch (error) {
      console.error('Erro ao buscar desafio:', error)
      setError('Erro ao carregar o desafio. Por favor, tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  const loadProgress = async () => {
    if (progressLoadedRef.current) {
      return
    }

    try {
      console.log('📂 Loading saved progress...')
      const response = await api.get(`/api/challenges/${id}/progress`)
      
      if (response.data.hasProgress && response.data.draft) {
        const draft = response.data.draft
        console.log('✅ Progress found, restoring...')
        
        // Restore step contents directly from individual fields
        const restoredStepContents: StepContent = {}
        
        if (draft.step_0_content) restoredStepContents[0] = draft.step_0_content
        if (draft.step_1_content) restoredStepContents[1] = draft.step_1_content
        if (draft.step_2_content) restoredStepContents[2] = draft.step_2_content
        if (draft.step_3_content) restoredStepContents[3] = draft.step_3_content
        
        setStepContents(prev => ({ ...prev, ...restoredStepContents }))
        console.log('📝 Restored step contents:', Object.keys(restoredStepContents).length, 'steps')
        
        // Restore diagram
        if (draft.diagram_data && draft.diagram_data.elements) {
          console.log('📊 Restoring diagram with', draft.diagram_data.elements.length, 'elements')
          shouldSyncToExcalidrawRef.current = true
          setDiagramElements(draft.diagram_data.elements)
        }
        
        // Restore audio transcription
        if (draft.audio_transcription) {
          setAudioTranscription(draft.audio_transcription)
        }
        
        // Find the last completed step
        const lastCompletedStep = Math.max(...Object.keys(restoredStepContents).map(Number))
        if (lastCompletedStep >= 0 && lastCompletedStep < WIZARD_STEPS.length - 1) {
          setCurrentStep(lastCompletedStep + 1)
        }
        
        setLastSaved(new Date(draft.updated_at))
        console.log('✅ Progress restored successfully')
      } else {
        console.log('ℹ️ No saved progress found')
      }
    } catch (error) {
      console.error('❌ Error loading progress:', error)
    } finally {
      progressLoadedRef.current = true
    }
  }

  const saveProgress = async () => {
    if (isSaving) return
    
    setIsSaving(true)
    try {
      console.log('💾 Saving progress...')
      
      // Get current diagram elements
      const elements = excalidrawAPI?.getSceneElements() || diagramElements
      
      // Send individual step contents (much cleaner!)
      const progressData = {
        step0: stepContents[0] || '',
        step1: stepContents[1] || '',
        step2: stepContents[2] || '',
        step3: stepContents[3] || '',
        diagram: {
          elements: elements,
          appState: excalidrawAPI?.getAppState(),
        },
        audioTranscription: audioTranscription || undefined,
      }
      
      await api.post(`/api/challenges/${id}/progress`, progressData)
      setLastSaved(new Date())
      console.log('✅ Progress saved successfully')
    } catch (error) {
      console.error('❌ Error saving progress:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const resetProgress = async () => {
    if (!window.confirm('Tem certeza que deseja reiniciar o desafio? Todo o seu progresso atual será perdido.')) {
      return
    }

    try {
      setIsSaving(true)
      console.log('🗑️ Resetting progress...')
      
      // Call API to delete progress
      await api.delete(`/api/challenges/${id}/progress`)
      
      // Reset local state
      setCurrentStep(0)
      setStepContents({})
      setCurrentInput('')
      setAudioTranscription('')
      setLastSaved(null)
      
      // Reset diagram to template + prefilled content
      console.log('Restoring template elements...')
      
      // Re-fetch prefilled content from challenge data
      const content = challenge?.initial_requirements || ''
      const newStepContents: StepContent = {}
      const newElements: any[] = [...excalidrawTemplate.elements]
      
      if (content) {
          newStepContents[0] = content
          
          // Re-create text element for prefilled content
          const sectionId = WIZARD_STEPS[0].sectionId
          const section = excalidrawTemplate.elements.find((el: any) => el.id === sectionId) as any
          
          if (section) {
            const fontSize = 14
            const lineHeight = 1.25
            const textStartY = section.y + 50
            const lines = content.split('\n')
            const avgCharWidth = fontSize * 0.6
            const calculatedWidth = Math.min(
              Math.max(...lines.map(line => line.length * avgCharWidth)),
              section.width - 40
            )
            const calculatedHeight = lines.length * fontSize * lineHeight
  
            newElements.push({
              id: `text_prefilled_0`,
              type: 'text',
              x: section.x + 20,
              y: textStartY,
              width: calculatedWidth,
              height: calculatedHeight,
              angle: 0,
              strokeColor: '#1971c2',
              backgroundColor: 'transparent',
              fillStyle: 'solid',
              strokeWidth: 1,
              strokeStyle: 'solid',
              roughness: 0,
              opacity: 100,
              groupIds: [],
              frameId: null,
              roundness: null,
              seed: Math.floor(Math.random() * 1000000),
              version: 1,
              versionNonce: Math.floor(Math.random() * 1000000),
              isDeleted: false,
              boundElements: null,
              updated: Date.now(),
              link: null,
              locked: false,
              text: content,
              fontSize: fontSize,
              fontFamily: 1,
              textAlign: 'left',
              verticalAlign: 'top',
              containerId: null,
              originalText: content,
              autoResize: true,
              lineHeight: lineHeight,
              baseline: calculatedHeight - 4,
            })
          }
          
          setStepContents(newStepContents)
      }
      
      setDiagramElements(newElements)
      shouldSyncToExcalidrawRef.current = true
      
      console.log('✅ Progress reset successfully')
    } catch (error) {
      console.error('❌ Error resetting progress:', error)
      alert('Erro ao reiniciar o progresso. Por favor, tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const response = await api.get<{ solutions: Solution[] }>(`/api/challenges/${id}/solutions`)
      setHistorySolutions(response.data.solutions)
      setShowHistory(true)
    } catch (error) {
      console.error('Error fetching history:', error)
      alert('Erro ao carregar histórico.')
    }
  }

  const addTextToSection = (sectionId: string, text: string) => {
    // Find the section rectangle
    const section = excalidrawTemplate.elements.find((el: any) => el.id === sectionId) as any
    
    if (!section) {
      console.error('Section not found:', sectionId)
      return
    }

    console.log('Adding text to section:', sectionId, 'Text:', text)

    const fontSize = 14
    const lineHeight = 1.25
    const maxWidth = section.width - 40
    
    // Position text below the title (title is at y + ~20-40, so start at y + 50)
    const textStartY = section.y + 50
    
    // Rough estimation of text dimensions
    const lines = text.split('\n')
    const avgCharWidth = fontSize * 0.6 // Approximate character width
    const calculatedWidth = Math.min(
      Math.max(...lines.map(line => line.length * avgCharWidth)),
      maxWidth
    )
    const calculatedHeight = lines.length * fontSize * lineHeight

    // Create a new text element inside the section (below the title)
    const newTextElement = {
      id: `text_${Date.now()}_${Math.random()}`,
      type: 'text',
      x: section.x + 20,
      y: textStartY,
      width: calculatedWidth,
      height: calculatedHeight,
      angle: 0,
      strokeColor: '#1971c2',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 1,
      strokeStyle: 'solid',
      roughness: 0,
      opacity: 100,
      groupIds: [],
      frameId: null,
      roundness: null,
      seed: Math.floor(Math.random() * 1000000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 1000000),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
      text: text,
      fontSize: fontSize,
      fontFamily: 1,
      textAlign: 'left',
      verticalAlign: 'top',
      containerId: null,
      originalText: text,
      autoResize: true,
      lineHeight: lineHeight,
      baseline: calculatedHeight - 4,
    }

    setDiagramElements((prev) => {
      const updated = [...prev, newTextElement]
      console.log('Updated diagram elements count:', updated.length)
      return updated
    })
    
    // Only set this to true after state update scheduled (though ref is immediate)
    shouldSyncToExcalidrawRef.current = true
  }

  const handleStepSubmit = async () => {
    const step = WIZARD_STEPS[currentStep]
    
    // For non-editable steps, just move to next
    if (!step.isEditable) {
      if (currentStep < WIZARD_STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1)
        // Save progress after moving to next step
        await saveProgress()
      }
      return
    }

    // For editable steps, validate and save
    if (!currentInput.trim() && currentStep < 4) {
      alert('Por favor, preencha o conteúdo antes de continuar.')
      return
    }

    // Save current step content
    if (currentStep < 4) {
      setStepContents((prev) => {
        const updatedContents = { ...prev, [currentStep]: currentInput }
        // Trigger save after state update
        setTimeout(() => saveProgress(), 100)
        return updatedContents
      })
      
      // Add text to the diagram
      addTextToSection(step.sectionId, currentInput)
      
      setCurrentInput('')
    }

    // Move to next step
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePreviousStep = async () => {
    if (currentStep > 0) {
      // Save current progress before going back
      await saveProgress()
      
      setCurrentStep((prev) => prev - 1)
      // Note: currentInput will be loaded by useEffect
    }
  }

  const handleFinalSubmit = async () => {
    // Get Excalidraw elements
    const elements = excalidrawAPI?.getSceneElements()
    
    if (!elements || elements.length === 0) {
      alert('Por favor, complete o diagrama antes de enviar.')
      return
    }

    setSubmitting(true)

    try {
      // Combine all step contents into text proposal
      const textProposal = WIZARD_STEPS.slice(0, 4)
        .map((step) => {
          const content = stepContents[step.id] || ''
          return `**${step.title}:**\n${content}`
        })
        .join('\n\n')

      const solution: SolutionSubmission = {
        challengeId: id || '',
        textProposal,
        diagram: {
          elements: elements,
          appState: excalidrawAPI?.getAppState(),
        },
        audioTranscription: audioTranscription || undefined,
      }

      // Track challenge submission
      trackChallengeSubmit(id || '', challenge?.title)

      const response = await api.post<FeedbackData>('/api/feedback', solution)
      
      // Navegar para página de feedback com os dados
      navigate('/feedback', { 
        state: { 
          feedback: response.data,
          challenge: challenge 
        } 
      })
    } catch (error) {
      console.error('Erro ao enviar solução:', error)
      alert('Erro ao enviar solução. Por favor, tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  // Update Excalidraw when elements change or when API becomes available
  useEffect(() => {
    if (excalidrawAPI && diagramElements.length > 0 && shouldSyncToExcalidrawRef.current) {
      console.log('Updating Excalidraw scene with', diagramElements.length, 'elements')
      try {
        excalidrawAPI.updateScene({
          elements: diagramElements,
        })
        // Force a refresh to ensure text is rendered
        excalidrawAPI.refresh()
        shouldSyncToExcalidrawRef.current = false
      } catch (error) {
        console.error('Error updating Excalidraw scene:', error)
      }
    }
  }, [diagramElements, excalidrawAPI])

  // Log when we reach the final step
  useEffect(() => {
    if (currentStep === 4) {
      console.log('Reached final step with', diagramElements.length, 'elements')
      console.log('Elements breakdown:')
      console.log('- Rectangles:', diagramElements.filter(el => el.type === 'rectangle').length)
      console.log('- Text elements:', diagramElements.filter(el => el.type === 'text').length)
      console.log('All elements:', diagramElements)
    }
  }, [currentStep, diagramElements.length])

  // Auto-save when diagram changes (on last step)
  useEffect(() => {
    if (currentStep === 4 && diagramElements.length > 0 && progressLoadedRef.current) {
      // Debounce: only save after user stops editing for 3 seconds
      const timeoutId = setTimeout(() => {
        console.log('📊 Auto-saving diagram changes...')
        saveProgress()
      }, 3000)

      return () => clearTimeout(timeoutId)
    }
  }, [diagramElements, currentStep])

  // Track challenge start when user moves to first editable step (step 1)
  useEffect(() => {
    if (currentStep === 1 && challenge && !challengeStartTrackedRef.current) {
      trackChallengeStart(id || '', challenge.title)
      challengeStartTrackedRef.current = true
    }
  }, [currentStep, challenge, id])

  // Load step content into input when navigating between steps
  useEffect(() => {
    const currentStepData = WIZARD_STEPS[currentStep]
    
    // For editable steps, load the saved content
    if (currentStepData && currentStepData.isEditable) {
      const savedContent = stepContents[currentStep] || ''
      setCurrentInput(savedContent)
      console.log(`📝 Loaded content for step ${currentStep}:`, savedContent ? 'has content' : 'empty')
    }
    // For non-editable steps, clear input
    else {
      setCurrentInput('')
    }
  }, [currentStep, stepContents])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-canvas-paper dark:bg-canvas-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 dark:border-signal-green"></div>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="flex justify-center items-center h-screen bg-canvas-paper dark:bg-canvas-dark px-4">
        <div className="text-center max-w-md tactical-panel rounded-xl card-shadow dark:shadow-none p-8">
          <div className="text-5xl mb-6">💻</div>
          <h2 className="text-2xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text mb-4">
            Por favor, use um computador
          </h2>
          <p className="text-slate-600 dark:text-tactical-dim mb-8 leading-relaxed">
            Para garantir a melhor experiência desenhando diagramas de arquitetura e escrevendo requisitos, este desafio deve ser realizado em um computador (desktop ou notebook).
          </p>
          <TacticalButton variant="primary" onClick={() => navigate('/design-lab')} className="w-full">
            Voltar para o início
          </TacticalButton>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-canvas-paper dark:bg-canvas-dark">
        <div className="text-center p-8 tactical-panel rounded-xl card-shadow dark:shadow-none">
          <div className="text-signal-red text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-sans font-bold text-slate-900 dark:text-tactical-text mb-2">Erro</h2>
          <p className="text-slate-600 dark:text-tactical-dim mb-6">{error}</p>
          <TacticalButton variant="primary" onClick={() => navigate('/design-lab')} className="">
            Voltar para o início
          </TacticalButton>
        </div>
      </div>
    )
  }

  const currentStepData = WIZARD_STEPS[currentStep]
  const isLastStep = currentStep === WIZARD_STEPS.length - 1

  // Get the dynamic content for the current step if available, otherwise use default from array
  const displayContent = currentStep === 0 && challenge?.initial_requirements 
    ? challenge.initial_requirements 
    : (currentStepData as any).prefilledContent

  return (
    <div className="min-h-screen bg-grid bg-canvas-paper dark:bg-canvas-dark transition-colors duration-200">
      {/* Header */}
      <header className="bg-white/80 dark:bg-tactical-surface/80 backdrop-blur-md border-b border-slate-200 dark:border-tactical-border sticky top-0 z-10 transition-colors duration-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigate('/design-lab')}
                      className="text-slate-600 dark:text-tactical-dim hover:text-slate-900 dark:hover:text-tactical-text transition-colors duration-200 font-sans text-sm"
                    >
                      ← Voltar
                    </button>
                    
                    {/* Save Status Indicator */}
                    <div className="flex items-center space-x-3 text-sm font-sans">
                      {isSaving ? (
                        <span className="text-brand-600 dark:text-signal-cyan flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Salvando...
                        </span>
                      ) : lastSaved ? (
                        <span className="text-slate-500 dark:text-tactical-label flex items-center">
                          <svg className="h-4 w-4 mr-2 text-signal-green" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          Salvo {new Date().getTime() - lastSaved.getTime() < 60000 
                            ? 'agora' 
                            : `há ${Math.floor((new Date().getTime() - lastSaved.getTime()) / 60000)} min`}
                        </span>
                      ) : null}
                      
                      {/* Manual Save Button - Always available, even on last step */}
                      <button
                        onClick={saveProgress}
                        disabled={isSaving}
                        className="px-3 py-1 text-xs font-sans rounded-lg border border-slate-300 dark:border-tactical-border hover:bg-slate-50 dark:hover:bg-tactical-raised text-slate-700 dark:text-tactical-text transition-colors duration-200 disabled:opacity-50"
                        title="Salvar progresso manualmente"
                      >
                        💾 Salvar
                      </button>

                      {/* Reset Button */}
                      <button
                        onClick={resetProgress}
                        disabled={isSaving}
                        className="px-3 py-1 text-xs font-sans rounded-lg border border-signal-red/50 hover:bg-signal-red/10 text-signal-red transition-colors duration-200 disabled:opacity-50"
                        title="Reiniciar desafio (apaga todo o progresso)"
                      >
                        🔄 Reiniciar
                      </button>

                      {/* History Button */}
                      <button
                        onClick={fetchHistory}
                        disabled={isSaving}
                        className="px-3 py-1 text-xs font-sans rounded-lg border border-signal-cyan/40 hover:bg-signal-cyan/10 text-brand-600 dark:text-signal-cyan transition-colors duration-200 disabled:opacity-50"
                        title="Ver histórico de tentativas"
                      >
                        📜 Histórico
                      </button>
                    </div>
                  </div>
            {isLastStep && (
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-700 dark:bg-white dark:text-black dark:hover:bg-slate-200 font-sans transition-colors duration-200 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Enviando...' : 'Enviar solução'}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stepper */}
        <div className="max-w-6xl mx-auto">
          <Stepper 
            steps={WIZARD_STEPS.map(s => s.title)} 
            currentStep={currentStep} 
          />
        </div>

        {/* Challenge Description - Collapsible */}
        <div className="max-w-6xl mx-auto mt-6">
          <details className="tactical-panel rounded-xl card-shadow dark:shadow-none transition-colors duration-200">
            <summary className="cursor-pointer p-4 font-sans font-semibold text-slate-900 dark:text-tactical-text hover:bg-slate-50 dark:hover:bg-tactical-raised transition-colors duration-200">
              📋 Descrição do desafio
            </summary>
            <div className="p-6 pt-2 border-t border-slate-200 dark:border-tactical-border">
              {/* Title and Subtitle */}
              <div className="mb-6">
                <h2 className="text-2xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text mb-2">
                  {challenge?.title}
                </h2>
                {challenge?.subtitle && (
                  <p className="text-base text-slate-600 dark:text-tactical-dim mb-4 leading-relaxed">
                    {challenge.subtitle}
                  </p>
                )}
                <div className="h-px bg-slate-200 dark:bg-tactical-line my-4"></div>
              </div>
              
              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-tactical-dim font-sans leading-relaxed">
                  {challenge?.description}
                </pre>
              </div>
            </div>
          </details>
        </div>

        {/* Progress Summary */}
        {currentStep < 4 && currentStep > 0 && (
          <div className="max-w-6xl mx-auto mt-6">
            <div className="border border-signal-cyan/40 bg-signal-cyan/10 rounded-lg p-4 transition-colors duration-200">
              <h3 className="text-sm font-sans font-bold text-slate-900 dark:text-tactical-text mb-2">
                ✓ Seções concluídas
              </h3>
              <ul className="text-xs text-slate-700 dark:text-tactical-dim space-y-1 font-sans">
                {WIZARD_STEPS.slice(0, currentStep).map((step) => (
                  <li key={step.id}>• {step.title}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Main Content - Full Width */}
        <div className="max-w-6xl mx-auto mt-6">
            <div className="tactical-panel rounded-xl card-shadow dark:shadow-none p-6 transition-colors duration-200">
              <h2 className="text-lg font-sans font-bold text-slate-900 dark:text-tactical-text mb-4">
                {currentStepData.title}
              </h2>
              
              {currentStep < 4 ? (
                <>
                  {!currentStepData.isEditable ? (
                    <>
                      <div className="border border-signal-cyan/40 bg-signal-cyan/10 rounded-lg p-4 mb-4 transition-colors duration-200">
                        <p className="text-sm text-slate-900 dark:text-tactical-text font-sans font-semibold mb-2">
                          ℹ️ Esta seção foi pré-preenchida automaticamente
                        </p>
                        <p className="text-xs text-slate-600 dark:text-tactical-dim">
                          O conteúdo abaixo já está incluído no diagrama e não pode ser editado.
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-tactical-raised border border-slate-300 dark:border-tactical-border rounded-lg p-4 mb-4 transition-colors duration-200">
                        <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-tactical-text font-mono">
                          {displayContent}
                        </pre>
                      </div>
                      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200 dark:border-tactical-border">
                        <button
                          onClick={handlePreviousStep}
                          disabled={currentStep === 0}
                          className="px-4 py-2 font-sans text-slate-600 dark:text-tactical-dim hover:text-slate-900 dark:hover:text-tactical-text disabled:text-slate-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                        >
                          ← Voltar
                        </button>
                        <button
                          onClick={handleStepSubmit}
                          className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-700 dark:bg-white dark:text-black dark:hover:bg-slate-200 font-sans transition-colors duration-200 font-medium"
                        >
                          Próximo →
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-slate-600 dark:text-tactical-dim mb-4 font-sans">
                        Descreva os {currentStepData.title.toLowerCase()} para sua solução:
                      </p>
                      <textarea
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder={`Digite os ${currentStepData.title.toLowerCase()} aqui...`}
                        className="w-full h-64 p-4 border border-slate-300 dark:border-tactical-border rounded-lg bg-white dark:bg-tactical-surface text-slate-900 dark:text-tactical-text placeholder-slate-400 dark:placeholder-tactical-label focus:ring-2 focus:ring-brand-500 dark:focus:ring-signal-green focus:border-transparent resize-none transition-colors duration-200 font-sans text-sm leading-relaxed"
                      />
                      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200 dark:border-tactical-border">
                        <button
                          onClick={handlePreviousStep}
                          disabled={currentStep === 0}
                          className="px-4 py-2 font-sans text-slate-600 dark:text-tactical-dim hover:text-slate-900 dark:hover:text-tactical-text disabled:text-slate-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                        >
                          ← Voltar
                        </button>
                        <button
                          onClick={handleStepSubmit}
                          className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-700 dark:bg-white dark:text-black dark:hover:bg-slate-200 font-sans transition-colors duration-200 font-medium"
                        >
                          {currentStep < 3 ? 'Próximo →' : 'Ir para design →'}
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="border border-signal-green/40 bg-signal-green/10 rounded-lg p-4 mb-4 transition-colors duration-200">
                    <p className="text-sm font-sans font-semibold text-slate-900 dark:text-tactical-text mb-2">
                      ✓ Seções preenchidas no diagrama:
                    </p>
                    <div className="text-xs text-slate-700 dark:text-tactical-dim space-y-1 font-sans">
                      {WIZARD_STEPS.slice(0, 4).map((step) => (
                        <div key={step.id}>• {step.title}</div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-tactical-label mt-2 font-mono tabular-nums border-t border-signal-green/40 pt-2">
                      Total de elementos: {diagramElements.length}
                    </p>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-tactical-dim mb-4 font-sans">
                    📐 Agora crie o diagrama de alto nível da sua solução:
                  </p>
                  <ul className="text-xs text-slate-500 dark:text-tactical-label space-y-1 mb-4 font-sans bg-slate-50 dark:bg-tactical-raised rounded-lg p-3 border border-slate-200 dark:border-tactical-border">
                    <li>✏️ Desenhe componentes dentro da área "Design High-Level"</li>
                    <li>➡️ Use setas para mostrar o fluxo de dados</li>
                    <li>📝 Adicione textos para rotular os componentes</li>
                    <li>🔍 Use zoom para ver melhor as seções preenchidas</li>
                  </ul>
                  
                  <div className="border border-slate-300 dark:border-tactical-border rounded-lg overflow-hidden" style={{ height: '700px' }}>
                    <Excalidraw
                      excalidrawAPI={(api: any) => {
                        console.log('Excalidraw API initialized')
                        setExcalidrawAPI(api)
                        // Immediately update with current elements
                        setTimeout(() => {
                          console.log('Setting initial elements:', diagramElements.length)
                          api.updateScene({
                            elements: diagramElements,
                          })
                          api.refresh()
                        }, 100)
                      }}
                      initialData={{
                        elements: diagramElements as any,
                        appState: {
                          ...excalidrawTemplate.appState,
                          viewBackgroundColor: '#ffffff',
                          zoom: { value: 0.3 as NormalizedZoomValue },
                        },
                      }}
                      onChange={(elements: any, _appState: any) => {
                        // Update diagram elements when user makes changes
                        // This triggers auto-save via useEffect
                        if (elements && elements.length > 0) {
                          setDiagramElements(elements)
                        }
                      }}
                    />
                  </div>
                  
                  {/* Audio Recorder */}
                  <div className="mt-6">
                    <AudioRecorder
                      onTranscriptionComplete={(transcription) => {
                        console.log('Audio transcription received:', transcription.substring(0, 100))
                        setAudioTranscription(transcription)
                      }}
                      maxDuration={120}
                      initialTranscription={audioTranscription}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200 dark:border-tactical-border">
                    <button
                      onClick={handlePreviousStep}
                      className="px-4 py-2 font-sans text-slate-600 dark:text-tactical-dim hover:text-slate-900 dark:hover:text-tactical-text transition-colors duration-200 text-sm"
                    >
                      ← Voltar
                    </button>
                    <button
                      onClick={handleFinalSubmit}
                      disabled={submitting}
                      className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-700 dark:bg-signal-green dark:text-black dark:hover:opacity-90 font-sans transition-colors duration-200 font-medium disabled:opacity-40"
                    >
                      {submitting ? 'Enviando...' : '✓ Enviar solução completa'}
                    </button>
                  </div>
                </>
              )}
            </div>
        </div>
      </div>
      
      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="tactical-panel rounded-xl card-shadow dark:shadow-none max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-tactical-border flex justify-between items-center bg-slate-50 dark:bg-tactical-raised">
              <h3 className="text-lg font-sans font-bold text-slate-900 dark:text-tactical-text">Histórico de tentativas</h3>
              <button 
                onClick={() => setShowHistory(false)} 
                className="text-slate-500 hover:text-slate-700 dark:text-tactical-label dark:hover:text-tactical-text transition-colors font-sans"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {historySolutions.length === 0 ? (
                 <div className="text-center py-12 text-slate-500 dark:text-tactical-label">
                   <p className="text-4xl mb-2">📭</p>
                   <p>Nenhuma tentativa anterior encontrada.</p>
                 </div>
              ) : (
                 <div className="space-y-4">
                   {historySolutions.map((sol) => (
                     <div key={sol.id} className="border border-slate-200 dark:border-tactical-border rounded-lg p-4 bg-slate-50 dark:bg-tactical-raised hover:bg-slate-100 dark:hover:bg-tactical-surface transition-colors">
                       <div className="flex justify-between mb-3 border-b border-slate-200 dark:border-tactical-border pb-2">
                         <span className="text-sm font-sans font-medium text-slate-700 dark:text-tactical-text">
                           Tentativa #{sol.id}
                         </span>
                         <span className="text-xs text-slate-500 dark:text-tactical-label font-sans">
                           {new Date(sol.created_at).toLocaleString()}
                         </span>
                       </div>
                       {sol.feedback ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {sol.feedback.strengths.length > 0 && (
                             <div className="border border-signal-green/40 bg-signal-green/10 rounded-lg p-3">
                               <p className="text-xs font-sans font-bold text-signal-green mb-2 flex items-center">
                                 <span className="mr-1">✓</span> Pontos fortes
                               </p>
                               <ul className="space-y-1">
                                 {sol.feedback.strengths.map((s, i) => (
                                   <li key={i} className="text-xs text-slate-600 dark:text-tactical-dim leading-relaxed flex items-start">
                                     <span className="mr-1.5 mt-0.5 opacity-50">•</span>
                                     <span>{s}</span>
                                   </li>
                                 ))}
                               </ul>
                             </div>
                           )}
                           {sol.feedback.suggestions.length > 0 && (
                             <div className="border border-signal-cyan/40 bg-signal-cyan/10 rounded-lg p-3">
                               <p className="text-xs font-sans font-bold text-brand-600 dark:text-signal-cyan mb-2 flex items-center">
                                 <span className="mr-1">💡</span> Sugestões
                               </p>
                               <ul className="space-y-1">
                                 {sol.feedback.suggestions.map((s, i) => (
                                   <li key={i} className="text-xs text-slate-600 dark:text-tactical-dim leading-relaxed flex items-start">
                                     <span className="mr-1.5 mt-0.5 opacity-50">•</span>
                                     <span>{s}</span>
                                   </li>
                                 ))}
                               </ul>
                             </div>
                           )}
                         </div>
                       ) : (
                         <p className="text-sm italic text-slate-500 dark:text-tactical-label text-center py-2">Feedback não disponível para esta tentativa.</p>
                       )}
                     </div>
                   ))}
                 </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Challenge
