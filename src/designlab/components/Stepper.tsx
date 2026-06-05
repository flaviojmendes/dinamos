interface StepperProps {
  steps: string[]
  currentStep: number
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-semibold transition-colors duration-200 ${
                  index < currentStep
                    ? 'bg-signal-green text-black'
                    : index === currentStep
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
                    : 'bg-slate-200 dark:bg-tactical-raised text-slate-500 dark:text-tactical-label'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span
                className={`text-xs mt-2 text-center max-w-[100px] font-mono uppercase tracking-wider transition-colors duration-200 ${
                  index === currentStep
                    ? 'font-semibold text-slate-900 dark:text-signal-green'
                    : 'text-slate-600 dark:text-tactical-dim'
                }`}
              >
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition-colors duration-200 ${
                  index < currentStep ? 'bg-signal-green' : 'bg-slate-200 dark:bg-tactical-line'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
