import React, { Suspense, lazy } from 'react';

const LazyViewer = lazy(() => import('../ExcalidrawViewer'));

export interface ForumExcalidrawViewerProps {
  diagramData: {
    elements: unknown[];
    appState?: Record<string, unknown>;
  };
  height?: string;
}

function ViewerFallback({ height = '400px' }: { height?: string }) {
  return (
    <div
      className="flex items-center justify-center rounded border border-slate-200 bg-slate-50 dark:border-tactical-border dark:bg-tactical-raised"
      style={{ height }}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent dark:border-signal-green" />
    </div>
  );
}

export default function ForumExcalidrawViewer({ diagramData, height }: ForumExcalidrawViewerProps) {
  return (
    <Suspense fallback={<ViewerFallback height={height} />}>
      <LazyViewer diagramData={diagramData} height={height} />
    </Suspense>
  );
}
