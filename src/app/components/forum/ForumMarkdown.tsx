import React, { Suspense, lazy, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const LazyMermaidDiagram = lazy(() => import('../../components/MermaidDiagram'));

const LazySyntaxHighlighter = lazy(async () => {
  const [{ Prism }, { dracula }] = await Promise.all([
    import('react-syntax-highlighter'),
    import('react-syntax-highlighter/dist/esm/styles/prism'),
  ]);
  return {
    default: ({
      language,
      children,
    }: {
      language: string;
      children: string;
    }) => (
      <Prism style={dracula} language={language} PreTag="div">
        {children}
      </Prism>
    ),
  };
});

function CodeBlock({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  if (!inline && language === 'mermaid') {
    return (
      <Suspense
        fallback={
          <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
            <code>{String(children).replace(/\n$/, '')}</code>
          </pre>
        }
      >
        <LazyMermaidDiagram chart={String(children).replace(/\n$/, '')} />
      </Suspense>
    );
  }

  if (!inline && match) {
    return (
      <Suspense
        fallback={
          <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
            <code>{String(children).replace(/\n$/, '')}</code>
          </pre>
        }
      >
        <LazySyntaxHighlighter language={language}>
          {String(children).replace(/\n$/, '')}
        </LazySyntaxHighlighter>
      </Suspense>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

const markdownComponents = { code: CodeBlock };

export function ForumMarkdown({ children }: { children: string }) {
  const components = useMemo(() => markdownComponents, []);
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}

export default ForumMarkdown;
