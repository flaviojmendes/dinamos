import { useState, useEffect, useCallback } from 'react';

interface ContentProgress {
  [path: string]: {
    completed: boolean;
    completedAt: string;
  };
}

// Helper function to get all child paths for a given path
const getChildPaths = (path: string): string[] => {
  // Get all child paths from the current path in localStorage
  const saved = localStorage.getItem('content-progress');
  const progress: ContentProgress = saved ? JSON.parse(saved) : {};
  
  // Find all paths that start with the current path
  return Object.keys(progress).filter(key => 
    key.startsWith(path) && key !== path
  );
};

// Custom event for progress updates
export const PROGRESS_UPDATED_EVENT = 'content-progress-updated';

// Function to emit the progress update event
export function emitProgressUpdate() {
  const event = new CustomEvent(PROGRESS_UPDATED_EVENT);
  window.dispatchEvent(event);
  console.log('Progress update event emitted');
}

export function useContentProgress() {
  const [progress, setProgress] = useState<ContentProgress>(() => {
    const saved = localStorage.getItem('content-progress');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Force component re-render
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  // Function to refresh UI from outside components
  const refreshUI = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
    console.log('Refreshing UI with progress data');
  }, []);

  useEffect(() => {
    // Handle storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'content-progress') {
        const newProgress = e.newValue ? JSON.parse(e.newValue) : {};
        setProgress(newProgress);
      }
    };
    
    // Listen for progress updates from anywhere in the app
    const handleProgressUpdate = () => {
      const saved = localStorage.getItem('content-progress');
      if (saved) {
        setProgress(JSON.parse(saved));
        refreshUI();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
    };
  }, [refreshUI]);

  useEffect(() => {
    localStorage.setItem('content-progress', JSON.stringify(progress));
  }, [progress]);

  const markAsCompleted = useCallback((path: string, childPaths: string[] = []) => {
    console.log('Marking as completed:', path);
    setProgress(prev => {
      const newProgress = { ...prev };
      // Mark the parent as completed
      newProgress[path] = {
        completed: true,
        completedAt: new Date().toISOString()
      };
      // Mark all children as completed
      childPaths.forEach(childPath => {
        newProgress[childPath] = {
          completed: true,
          completedAt: new Date().toISOString()
        };
      });
      return newProgress;
    });
    
    // Force UI update after state change
    setTimeout(() => {
      emitProgressUpdate();
    }, 0);
  }, []);

  const markAsIncomplete = useCallback((path: string, childPaths: string[] = []) => {
    console.log('Marking as incomplete:', path);
    setProgress(prev => {
      const newProgress = { ...prev };
      // Mark the parent as incomplete
      newProgress[path] = {
        completed: false,
        completedAt: new Date().toISOString()
      };
      // Mark all children as incomplete
      childPaths.forEach(childPath => {
        newProgress[childPath] = {
          completed: false,
          completedAt: new Date().toISOString()
        };
      });
      return newProgress;
    });
    
    // Force UI update after state change
    setTimeout(() => {
      emitProgressUpdate();
    }, 0);
  }, []);

  const isCompleted = useCallback((path: string) => {
    return progress[path]?.completed || false;
  }, [progress]);

  return {
    progress,
    markAsCompleted,
    markAsIncomplete,
    isCompleted,
    refreshUI,
    updateTrigger
  };
} 