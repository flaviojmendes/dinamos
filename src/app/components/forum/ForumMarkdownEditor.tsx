import React, { Suspense, lazy } from 'react';

const LazyMDEditor = lazy(() => import('@uiw/react-md-editor'));

export interface ForumMarkdownEditorProps {
  value: string;
  onChange: (value?: string) => void;
  height?: number;
  preview?: 'edit' | 'live' | 'preview';
  hideToolbar?: boolean;
  visibleDragbar?: boolean;
}

function EditorFallback({ height = 200 }: { height?: number }) {
  return (
    <div
      className="animate-pulse rounded border border-slate-200 bg-slate-50 dark:border-tactical-border dark:bg-tactical-raised"
      style={{ height }}
    />
  );
}

export default function ForumMarkdownEditor(props: ForumMarkdownEditorProps) {
  return (
    <Suspense fallback={<EditorFallback height={props.height} />}>
      <LazyMDEditor {...props} />
    </Suspense>
  );
}
