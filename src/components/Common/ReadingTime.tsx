import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Words per minute - average reading speed
const WORDS_PER_MINUTE = 200;

interface ReadingTimeProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

export default function ReadingTime({ contentRef }: ReadingTimeProps) {
  const [readingTime, setReadingTime] = useState<number>(1);
  const { t } = useTranslation();

  useEffect(() => {
    const calculateReadingTime = () => {
      if (!contentRef.current) return;

      // Observe the async wrapper, but count only the article once it arrives.
      const article = contentRef.current.querySelector('article') || contentRef.current;
      const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => node.parentElement?.closest('pre, script, style, button, nav, [aria-hidden="true"], [data-reading-time-ignore]')
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
      });
      const text: string[] = [];
      while (walker.nextNode()) text.push(walker.currentNode.textContent || '');
      const words = text.join(' ').split(/\s+/).filter(Boolean);

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
    <span className="inline-flex items-center gap-2 font-sans text-sm text-slate-600 dark:text-tactical-dim">
      <svg className="h-4 w-4 shrink-0" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{t('content.reading_time', { minutes: readingTime })}</span>
    </span>
  );
}
