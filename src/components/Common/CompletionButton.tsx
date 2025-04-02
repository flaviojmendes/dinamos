import React from 'react';
import { useContentProgress, emitProgressUpdate } from '../../hooks/useContentProgress';

interface Props {
  path: string;
  childPaths: string[];
}

export default function CompletionButton({ path, childPaths }: Props) {
  const { isCompleted, markAsCompleted, markAsIncomplete } = useContentProgress();
  const completed = isCompleted(path);

  // Log for debugging
  console.log('CompletionButton path:', path);
  console.log('CompletionButton childPaths:', childPaths);

  const handleClick = () => {
    if (completed) {
      console.log('Marking as incomplete:', path, childPaths);
      markAsIncomplete(path, childPaths);
    } else {
      console.log('Marking as complete:', path, childPaths);
      markAsCompleted(path, childPaths);
    }
    
    // Explicitly emit the update event to refresh all components
    setTimeout(() => {
      emitProgressUpdate();
    }, 100);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        completed
          ? 'bg-green-500 hover:bg-green-600'
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      <span className="text-white font-medium">
        {completed ? 'Concluído' : 'Marcar como concluído'}
      </span>
      {completed && (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
} 