import React, { Suspense, lazy } from 'react';

const LazyExcalidraw = lazy(() =>
  import('@excalidraw/excalidraw').then((mod) => ({ default: mod.Excalidraw })),
);

export interface ForumExcalidrawEditorProps {
  excalidrawAPI?: (api: unknown) => void;
  initialData?: Record<string, unknown>;
}

function ExcalidrawFallback() {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center bg-slate-50 dark:bg-tactical-raised">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent dark:border-signal-green" />
    </div>
  );
}

export default function ForumExcalidrawEditor(props: ForumExcalidrawEditorProps) {
  return (
    <Suspense fallback={<ExcalidrawFallback />}>
      <LazyExcalidraw {...props} />
    </Suspense>
  );
}
