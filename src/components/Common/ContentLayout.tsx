import React, { useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CompletionButton from './CompletionButton';
import ReadingTime from './ReadingTime';
import { getItem, getModule, menuKey, titleForPath } from '../../config/contentRegistry';
import { ContentBreadcrumb, ContentFooterNav } from './ContentNav';
const SimulatorConsole = React.lazy(() => import('../simulation/SimulatorWorkspace'));

interface Props {
  children: React.ReactNode;
  hideCompletion?: boolean;
  childPaths?: string[];
}

// Trailing path segments that name the simulator route rather than its subject.
const TRAILING_SEGMENTS = ['simulator', 'simulador', 'algoritmos', 'tracing', 'servicos'];

const prettify = (seg: string) =>
  seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function ContentLayout({ children, hideCompletion = false, childPaths = [] }: Props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const contentRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();

  const isRoadmapPage = currentPath === '/roadmap';
  // Standalone interactive routes whose paths don't contain "simulator"/"simulador".
  const standaloneSimulators = [
    '/circuit-breaker', '/backpressure', '/rate-limiter', '/async-sync', '/cdn',
    '/principios-design/servicos',
    '/estrategias-de-consistencia/sincronizacao/algoritmos',
    '/monitoramento-e-manutencao/logs/tracing',
  ];
  const isEditor = currentPath.includes('/editor');
  const isSimulator = currentPath.includes('simulator') ||
                       currentPath.includes('simulador') ||
                       isEditor ||
                       standaloneSimulators.includes(currentPath);
  // The system editor is full-bleed React Flow; it gets the scoped theme but not
  // the bordered console frame.
  const useConsoleFrame = isSimulator && !isEditor;
  const isForumPage = currentPath === '/forum' || currentPath.startsWith('/forum/');

  const simulatorTitle = useMemo(() => {
    const current = getItem(currentPath);
    const title = (i18n.resolvedLanguage || i18n.language).startsWith('pt') ? current?.titlePt : current?.titleEn;
    if (title) return title;
    const segs = currentPath.split('/').filter(Boolean);
    const tail = segs[segs.length - 1] ?? '';
    const baseSegs = TRAILING_SEGMENTS.includes(tail) ? segs.slice(0, -1) : segs;
    const fallback = prettify(baseSegs[baseSegs.length - 1] ?? tail);
    const basePath = `/${baseSegs.join('/')}`;
    return titleForPath(basePath, i18n.resolvedLanguage || i18n.language) ?? t(menuKey(basePath, 'name'), { defaultValue: fallback });
  }, [currentPath, t, i18n.resolvedLanguage, i18n.language]);

  // Registry-driven breadcrumb + prev/next/related, shown on real content
  // pages (lessons, cases, simulators) but not on tool pages.
  const regItem = getItem(currentPath);
  const isLesson = regItem?.type === 'lesson' || regItem?.type === 'case';
  const lessonModule = isLesson ? getModule(regItem.moduleId) : undefined;
  const showNav = !!regItem && !isRoadmapPage && !isForumPage && !isEditor;
  const navContainer = isLesson ? 'lesson-chrome' : isSimulator ? 'px-4 md:px-6' : 'mx-auto max-w-4xl px-4 md:px-8';

  return (
    <div className="relative">
      {showNav && (
        <div className={`${navContainer} pt-6`}>
          <ContentBreadcrumb path={currentPath} />
        </div>
      )}

      {isLesson && (
        <div className="lesson-chrome">
          <div className="lesson-meta">
            {lessonModule && (
              <span>{t(`command_center.modules.${lessonModule.id}`, { defaultValue: lessonModule.label })}</span>
            )}
            <ReadingTime contentRef={contentRef} />
          </div>
        </div>
      )}

      <div ref={contentRef} className={isSimulator ? 'sim-scope simulation-workspace' : undefined}>
        {useConsoleFrame ? (
          <div className="p-4 md:p-6">
            <SimulatorConsole
              title={simulatorTitle}
            >
              {children}
            </SimulatorConsole>
          </div>
        ) : (
          children
        )}
      </div>

      {(isLesson || useConsoleFrame) && !hideCompletion && (
        <div className={isLesson ? 'lesson-chrome' : 'px-4 pb-6 md:px-6'}>
          <div className={isLesson ? 'lesson-completion' : 'flex justify-end border-t border-slate-200 pt-6 dark:border-tactical-border'}>
            <CompletionButton path={currentPath} childPaths={childPaths} />
          </div>
        </div>
      )}

      {showNav && (
        <div className={`${navContainer} pb-12`}>
          <ContentFooterNav path={currentPath} />
        </div>
      )}

      {!isLesson && !useConsoleFrame && <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3">
        {!isRoadmapPage && !isSimulator && !isForumPage && (
          <ReadingTime contentRef={contentRef} />
        )}

        {!hideCompletion && !isRoadmapPage && !isForumPage && (
          <CompletionButton path={currentPath} childPaths={childPaths} />
        )}
      </div>}
    </div>
  );
}
