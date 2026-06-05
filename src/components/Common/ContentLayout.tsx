import React, { useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CompletionButton from './CompletionButton';
import ReadingTime from './ReadingTime';
import { SimulatorConsole } from '../tactical';
import { getItem } from '../../config/contentRegistry';
import { ContentBreadcrumb, ContentFooterNav } from './ContentNav';

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
  const { t } = useTranslation();

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
    const segs = currentPath.split('/').filter(Boolean);
    const tail = segs[segs.length - 1] ?? '';
    const baseSegs = TRAILING_SEGMENTS.includes(tail) ? segs.slice(0, -1) : segs;
    const fallback = prettify(baseSegs[baseSegs.length - 1] ?? tail);
    const key = `menu.${baseSegs.join('.')}.name`;
    return t(key, { defaultValue: fallback });
  }, [currentPath, t]);

  // Registry-driven breadcrumb + prev/next/related, shown on real content
  // pages (lessons, cases, simulators) but not on tool pages.
  const regItem = getItem(currentPath);
  const showNav = !!regItem && !isRoadmapPage && !isForumPage && !isEditor;
  const navContainer = isSimulator ? 'px-4 md:px-6' : 'mx-auto max-w-4xl px-4 md:px-8';

  return (
    <div className="relative">
      {showNav && (
        <div className={`${navContainer} pt-6`}>
          <ContentBreadcrumb path={currentPath} />
        </div>
      )}

      <div ref={contentRef} className={isSimulator ? 'sim-scope' : undefined}>
        {useConsoleFrame ? (
          <div className="p-4 md:p-6">
            <SimulatorConsole
              title={`${simulatorTitle} // Simulation Console`}
              subtitle={currentPath}
            >
              {children}
            </SimulatorConsole>
          </div>
        ) : (
          children
        )}
      </div>

      {showNav && (
        <div className={`${navContainer} pb-12`}>
          <ContentFooterNav path={currentPath} />
        </div>
      )}

      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3">
        {!isRoadmapPage && !isSimulator && !isForumPage && (
          <ReadingTime contentRef={contentRef} />
        )}
        
        {!hideCompletion && !isRoadmapPage && !isForumPage && (
          <CompletionButton path={currentPath} childPaths={childPaths} />
        )}
      </div>
    </div>
  );
} 