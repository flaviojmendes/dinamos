import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CompletionButton from './CompletionButton';
import ReadingTime from './ReadingTime';

interface Props {
  children: React.ReactNode;
  hideCompletion?: boolean;
  childPaths?: string[];
}

export default function ContentLayout({ children, hideCompletion = false, childPaths = [] }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const contentRef = useRef<HTMLDivElement>(null);
  
  const isRoadmapPage = currentPath === '/roadmap';
  const isSimulator = currentPath.includes('simulator') || 
                       currentPath.includes('simulador') ||
                       currentPath.includes('/editor');

  return (
    <div className="relative">
      <div ref={contentRef}>
        {children}
      </div>
      
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3">
        {!isRoadmapPage && !isSimulator && (
          <ReadingTime contentRef={contentRef} />
        )}
        
        {!hideCompletion && !isRoadmapPage && (
          <CompletionButton path={currentPath} childPaths={childPaths} />
        )}
      </div>
    </div>
  );
} 