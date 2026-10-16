import React from 'react';
import { useContentProgress } from '../../hooks/useContentProgress';
import { useTranslation } from 'react-i18next';

interface Props {
  path: string;
  childPaths: string[];
}

export default function CompletionButton({ path, childPaths }: Props) {
  const { isCompleted, markAsCompleted, markAsIncomplete } = useContentProgress();
  const completed = isCompleted(path);
  const { t } = useTranslation();

  const handleClick = () => {
    if (completed) {
      markAsIncomplete(path, childPaths);
    } else {
      markAsCompleted(path, childPaths);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={completed}
      aria-label={completed ? `${t('content.completed_label')}. ${t('content.mark_incomplete', { defaultValue: 'Mark as incomplete' })}` : undefined}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-5 py-2.5 font-sans text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-tactical-bg ${
        completed
          ? 'bg-signal-green/10 border-signal-green/50 text-green-800 dark:text-signal-green hover:bg-signal-green/20'
          : 'border-transparent bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-400 dark:text-slate-950 dark:hover:bg-brand-300'
      }`}
    >
      <span>
        {completed ? t('content.completed_label') : t('content.mark_complete')}
      </span>
      {completed && (
        <svg className="h-4 w-4" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}
