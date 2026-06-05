import { useState, useRef, useEffect } from 'react'

interface AudioRecorderProps {
  onTranscriptionComplete: (transcription: string) => void
  maxDuration?: number // in seconds
  initialTranscription?: string // Transcription restored from database
}

function AudioRecorder({ onTranscriptionComplete, maxDuration = 120, initialTranscription = '' }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcription, setTranscription] = useState<string>(initialTranscription)
  const [error, setError] = useState<string>('')
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Update transcription when initialTranscription changes (restored from database)
  useEffect(() => {
    if (initialTranscription) {
      setTranscription(initialTranscription)
    }
  }, [initialTranscription])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Auto-stop recording when max duration is reached
  useEffect(() => {
    if (recordingTime >= maxDuration && isRecording) {
      stopRecording(true)
    }
  }, [recordingTime, maxDuration, isRecording])

  const startRecording = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await transcribeAudio(audioBlob)
        
        // Cleanup
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Erro ao acessar o microfone. Por favor, permita o acesso.')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
  }

  const stopRecording = (shouldTranscribe = true) => {
    if (mediaRecorderRef.current && isRecording) {
      if (!shouldTranscribe) {
        // If not transcribing, clear the onstop handler
        mediaRecorderRef.current.onstop = null
      }
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const cancelRecording = () => {
    stopRecording(false)
    audioChunksRef.current = []
    setRecordingTime(0)
    setTranscription('')
    setError('')
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    setError('')
    
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const { auth } = await import('../config/firebase')
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null

      const response = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/transcribe-audio`, {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })

      if (!response.ok) {
        throw new Error('Falha na transcrição do áudio')
      }

      const data = await response.json()
      setTranscription(data.transcription)
      onTranscriptionComplete(data.transcription)
    } catch (err) {
      console.error('Error transcribing audio:', err)
      setError('Erro ao transcrever o áudio. Tente novamente.')
    } finally {
      setIsTranscribing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const remainingTime = maxDuration - recordingTime
  const progressPercentage = (recordingTime / maxDuration) * 100

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          🎤 Gravação de Áudio
        </h3>
        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
              {formatTime(recordingTime)} / {formatTime(maxDuration)}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isRecording && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                progressPercentage > 90 ? 'bg-red-500' : 'bg-indigo-600 dark:bg-indigo-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Tempo restante: {formatTime(remainingTime)}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-200">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center space-x-3 mb-4">
        {!isRecording && !transcription && (
          <button
            onClick={startRecording}
            disabled={isTranscribing}
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 font-medium flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            <span>Iniciar Gravação</span>
          </button>
        )}

        {isRecording && (
          <>
            {!isPaused ? (
              <button
                onClick={pauseRecording}
                className="bg-yellow-500 text-white px-5 py-3 rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Pausar</span>
              </button>
            ) : (
              <button
                onClick={resumeRecording}
                className="bg-green-500 text-white px-5 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Retomar</span>
              </button>
            )}
            
            <button
              onClick={() => stopRecording(true)}
              className="bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              <span>Parar</span>
            </button>

            <button
              onClick={cancelRecording}
              className="bg-gray-500 text-white px-5 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Cancelar
            </button>
          </>
        )}
      </div>

      {/* Transcribing indicator */}
      {isTranscribing && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-gray-700 dark:text-gray-300">Transcrevendo áudio...</span>
          </div>
        </div>
      )}

      {/* Transcription result */}
      {transcription && (
        <div className="mt-4">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-3 transition-colors duration-200">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-green-900 dark:text-green-200">Transcrição concluída!</span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 transition-colors duration-200">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Texto transcrito:</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{transcription}</p>
          </div>

          <button
            onClick={() => {
              setTranscription('')
              setRecordingTime(0)
            }}
            className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors duration-200"
          >
            🔄 Gravar novamente
          </button>
        </div>
      )}

      {/* Instructions */}
      {!isRecording && !transcription && !isTranscribing && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4 transition-colors duration-200">
          <p className="text-sm text-blue-900 dark:text-blue-200 mb-2">
            <strong>Instruções:</strong>
          </p>
          <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Grave um áudio de até {maxDuration / 60} minutos explicando seu design</li>
            <li>• Fale sobre as decisões arquiteturais e justificativas</li>
            <li>• O áudio será automaticamente transcrito e enviado com sua solução</li>
            <li>• Você pode pausar e retomar a gravação a qualquer momento</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default AudioRecorder

