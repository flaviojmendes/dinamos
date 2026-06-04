import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Words per minute - average reading speed
const WORDS_PER_MINUTE = 200;

interface ReadingTimeProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

export default function ReadingTime({ contentRef }: ReadingTimeProps) {
  const [readingTime, setReadingTime] = useState<number>(0);
  const { t } = useTranslation();

  useEffect(() => {
    const calculateReadingTime = () => {
      if (!contentRef.current) return;
      
      // Get text content of the component, excluding code blocks
      const content = contentRef.current.textContent || '';
      
      // Count words (split by spaces and filter empty strings)
      const words = content.split(/\s+/).filter(Boolean);
      
      // Calculate reading time and round up to nearest minute
      const time = Math.ceil(words.length / WORDS_PER_MINUTE);
      
      // Minimum reading time is 1 minute
      setReadingTime(Math.max(1, time));
    };

    // Calculate on mount
    calculateReadingTime();
    
    // Recalculate if content changes
    const observer = new MutationObserver(calculateReadingTime);
    
    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
    
    return () => observer.disconnect();
  }, [contentRef]);

  return (
    <div className="px-3 py-2 tactical-panel bg-slate-100 dark:bg-tactical-surface/90 backdrop-blur-sm text-slate-600 dark:text-tactical-dim font-mono text-xs uppercase tracking-wider flex items-center gap-2">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{t('content.reading_time', { minutes: readingTime })}</span>
    </div>
  );
} 