import { useState, useEffect } from 'react';

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

export function useContentProgress() {
  const [progress, setProgress] = useState<ContentProgress>(() => {
    const saved = localStorage.getItem('content-progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('content-progress', JSON.stringify(progress));
  }, [progress]);

  const markAsCompleted = (path: string, childPaths: string[] = []) => {
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
  };

  const markAsIncomplete = (path: string, childPaths: string[] = []) => {
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
  };

  const isCompleted = (path: string) => {
    return progress[path]?.completed || false;
  };

  return {
    progress,
    markAsCompleted,
    markAsIncomplete,
    isCompleted
  };
} 