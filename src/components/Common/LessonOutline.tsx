import { useEffect, useState, type MouseEvent, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { clearGeneratedHeadingIds, collectLessonHeadings, type LessonHeading } from './lessonOutlineHeadings';

interface Props {
  containerRef: RefObject<HTMLElement>;
  /** Changes when the route or language changes, even when the article is reused. */
  contentKey: string;
}

export default function LessonOutline({ containerRef, contentKey }: Props) {
  const { t, i18n } = useTranslation();
  const [headings, setHeadings] = useState<LessonHeading[]>([]);
  const [activeId, setActiveId] = useState('');
  const title = t('content.on_this_page', {
    defaultValue: i18n.language?.startsWith('pt') ? 'Nesta página' : 'On this page',
  });

  useEffect(() => {
    const container = containerRef.current;
    setHeadings([]);
    setActiveId('');
    if (!container) return;

    const generatedIds = new Map<HTMLHeadingElement, string>();
    const scrollRoot = container.closest('main');
    const scrollTarget = scrollRoot ?? window;
    let intersectionObserver: IntersectionObserver | undefined;
    let current: LessonHeading[] = [];
    let hashHandled = false;
    let scrollFrame: number | undefined;

    const updateActive = () => {
      const readingLine = (scrollRoot?.getBoundingClientRect().top ?? 0) + 104;
      let active = current[0]?.id ?? '';
      for (const heading of current) {
        if (heading.element.getBoundingClientRect().top > readingLine) break;
        active = heading.id;
      }
      setActiveId(active);
    };

    // Large jumps can move every heading past the observer's reading band
    // without changing intersection state. Recheck the actual scroll position.
    const handleScroll = () => {
      if (scrollFrame !== undefined) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = undefined;
        updateActive();
      });
    };

    const updateHeadings = () => {
      const next = collectLessonHeadings(container, generatedIds);
      const unchanged = next.length === current.length && next.every((heading, index) => (
        heading.id === current[index].id && heading.label === current[index].label &&
        heading.element === current[index].element
      ));
      if (unchanged) return;
      current = next;
      setHeadings(next);
      intersectionObserver?.disconnect();
      if (typeof IntersectionObserver !== 'undefined') {
        intersectionObserver = new IntersectionObserver(updateActive, {
          root: scrollRoot,
          rootMargin: '-104px 0px -60% 0px',
          threshold: 0,
        });
        current.forEach((heading) => intersectionObserver?.observe(heading.element));
      }
      if (!hashHandled && current.length > 0) {
        hashHandled = true;
        try {
          const id = decodeURIComponent(window.location.hash.slice(1));
          current.find((heading) => heading.id === id)?.element.scrollIntoView?.({ block: 'start' });
        } catch {
          // A malformed external hash must not prevent the lesson from loading.
        }
      }
      updateActive();
    };

    updateHeadings();
    const mutations = new MutationObserver(updateHeadings);
    mutations.observe(container, { childList: true, subtree: true, characterData: true });
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      mutations.disconnect();
      intersectionObserver?.disconnect();
      scrollTarget.removeEventListener('scroll', handleScroll);
      if (scrollFrame !== undefined) window.cancelAnimationFrame(scrollFrame);
      clearGeneratedHeadingIds(generatedIds);
    };
  }, [containerRef, contentKey]);

  const navigate = (event: MouseEvent<HTMLAnchorElement>, heading: LessonHeading) => {
    // Keep native open-in-new-tab and modifier-click behavior.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    event.currentTarget.closest('details')?.removeAttribute('open');
    if (event.detail === 0) {
      heading.element.tabIndex = -1;
      heading.element.focus({ preventScroll: true });
    }
    heading.element.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    window.history.replaceState(window.history.state, '',
      `${window.location.pathname}${window.location.search}#${encodeURIComponent(heading.id)}`);
    setActiveId(heading.id);
  };

  if (headings.length < 2) return null;

  const links = () => (
    <nav className="lesson-outline-nav" aria-label={title}>
      {headings.map((heading) => (
        <a
          key={heading.id}
          className="lesson-outline-link"
          href={`#${encodeURIComponent(heading.id)}`}
          aria-current={activeId === heading.id ? 'location' : undefined}
          onClick={(event) => navigate(event, heading)}
        >
          {heading.label}
        </a>
      ))}
    </nav>
  );

  return (
    <aside className="lesson-outline" aria-label={title}>
      <div className="lesson-outline-desktop">
        <p className="lesson-outline-title">{title}</p>
        {links()}
      </div>
      <details className="lesson-outline-mobile">
        <summary>
          <span>{title}</span>
          <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none">
            <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>
        {links()}
      </details>
    </aside>
  );
}
