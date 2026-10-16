import React, { createContext, useContext } from 'react';
import { CircleCheck, Info, TriangleAlert, CircleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './content.css';

/** Shared lesson components. Long chapters remain document sections; Cards
 * provides the explicit grid context for compact overview/navigation tiles. */
type AccentKey = 'brand' | 'green' | 'purple' | 'red' | 'yellow' | 'slate';
const CardGridContext = createContext(false);

const titleAccent: Record<AccentKey, string> = {
  brand: 'text-brand-600 dark:text-brand-300',
  green: 'text-green-700 dark:text-signal-green',
  purple: 'text-purple-700 dark:text-purple-300',
  red: 'text-red-700 dark:text-signal-red',
  yellow: 'text-yellow-800 dark:text-signal-amber',
  slate: 'text-slate-900 dark:text-tactical-text',
};

export function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`lesson-group ${className}`}>{children}</div>;
}

export function Cards({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  return <CardGridContext.Provider value={true}>
    <div className={`lesson-cards lesson-columns-${cols}`} data-lesson-grid>{children}</div>
  </CardGridContext.Provider>;
}

export function Card({ title, emoji, accent = 'slate', children }: {
  title?: string; emoji?: string; accent?: AccentKey; children: React.ReactNode;
}) {
  const inGrid = useContext(CardGridContext);
  const Heading = inGrid ? 'h3' : 'h2';
  return (
    <section className={inGrid ? 'lesson-card' : 'lesson-section'} data-accent={accent}>
      {title && <div className="lesson-section-heading">
        {emoji && <span className="lesson-section-icon" aria-hidden="true">{emoji}</span>}
        <Heading className={inGrid ? 'lesson-card-title' : 'lesson-heading'}>{title}</Heading>
      </div>}
      <div className="lesson-section-body">
        <CardGridContext.Provider value={false}>{children}</CardGridContext.Provider>
      </div>
    </section>
  );
}

export function Callout({ type = 'info', title, children }: {
  type?: 'info' | 'success' | 'warning' | 'danger' | 'neutral'; title?: string; children: React.ReactNode;
}) {
  const { t } = useTranslation();
  if (type === 'neutral' && !title) return <div className="lesson-summary">{children}</div>;
  const Icon = { info: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleAlert, neutral: Info }[type];
  return <aside className="lesson-callout" data-tone={type}>
    <div className="lesson-callout-heading"><Icon size={18} aria-hidden="true" />
      <span>{title ?? t(`content.callout.${type}`)}</span>
    </div>
    <div className="lesson-callout-body">{children}</div>
  </aside>;
}

export function Metrics({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  return <div className={`lesson-metrics lesson-columns-${cols}`}>{children}</div>;
}

export function Metric({ value, label, accent = 'brand' }: { value: string; label: string; accent?: AccentKey }) {
  return <div className="lesson-metric">
    <div className={`lesson-metric-value ${titleAccent[accent]}`}>{value}</div>
    <div className="lesson-metric-label">{label}</div>
  </div>;
}

// ---------------------------------------------------------------------------
// Diagram / data-visualization components (dependency-free, tactical styling)
// ---------------------------------------------------------------------------

// Border + soft fill per accent for diagram node boxes.
const nodeBox: Record<AccentKey, string> = {
  brand: 'border-brand-300 bg-brand-50 dark:border-signal-cyan/40 dark:bg-signal-cyan/5',
  green: 'border-green-300 bg-green-50 dark:border-signal-green/40 dark:bg-signal-green/5',
  purple: 'border-purple-300 bg-purple-50 dark:border-signal-cyan/40 dark:bg-signal-cyan/5',
  red: 'border-red-300 bg-red-50 dark:border-signal-red/40 dark:bg-signal-red/5',
  yellow: 'border-yellow-300 bg-yellow-50 dark:border-signal-amber/40 dark:bg-signal-amber/5',
  slate: 'border-slate-300 bg-slate-50 dark:border-tactical-border dark:bg-tactical-raised',
};

// Solid fill per accent for bar charts / markers.
const solidFill: Record<AccentKey, string> = {
  brand: 'bg-brand-500 dark:bg-signal-cyan',
  green: 'bg-green-500 dark:bg-signal-green',
  purple: 'bg-purple-500 dark:bg-signal-cyan',
  red: 'bg-red-500 dark:bg-signal-red',
  yellow: 'bg-yellow-500 dark:bg-signal-amber',
  slate: 'bg-slate-400 dark:bg-tactical-line',
};

type ArchNode = { label: string; accent?: AccentKey };
type ArchLayer = { name?: string; nodes: (string | ArchNode)[]; accent?: AccentKey };

/** Arrow that points right on wide screens and down when layers stack on mobile. */
function LayerConnector() {
  return (
    <div className="flex items-center justify-center font-sans text-signal-amber shrink-0 py-1 md:py-0 md:px-1">
      <span className="md:hidden text-lg leading-none">↓</span>
      <span className="hidden md:inline text-lg leading-none">→</span>
    </div>
  );
}

/**
 * Layered box-and-arrow architecture diagram. Each layer is a column of node
 * boxes; arrows connect consecutive layers. Stacks vertically on mobile.
 */
export function Architecture({ layers, caption }: { layers: ArchLayer[]; caption?: string }) {
  return (
    <figure className="my-8 tactical-panel p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-stretch gap-1">
        {layers.map((layer, i) => (
          <React.Fragment key={i}>
            <div className="flex-1 flex flex-col min-w-0">
              {layer.name && <div className="label-mono mb-2 text-center">{layer.name}</div>}
              <div className="flex flex-col gap-2 justify-center h-full">
                {layer.nodes.map((n, j) => {
                  const node: ArchNode = typeof n === 'string' ? { label: n } : n;
                  const acc = node.accent ?? layer.accent ?? 'slate';
                  return (
                    <div
                      key={j}
                      className={`border px-3 py-2 text-center font-sans text-sm leading-tight text-slate-800 dark:text-tactical-text ${nodeBox[acc]}`}
                    >
                      {node.label}
                    </div>
                  );
                })}
              </div>
            </div>
            {i < layers.length - 1 && <LayerConnector />}
          </React.Fragment>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-4 text-sm font-sans text-slate-500 dark:text-tactical-dim text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Compact left-to-right (wrapping) sequence of steps connected by arrows. */
export function Flow({ steps, caption, accent = 'brand' }: { steps: string[]; caption?: string; accent?: AccentKey }) {
  return (
    <figure className="my-8 tactical-panel p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`border px-3 py-2 font-sans text-xs md:text-sm text-slate-800 dark:text-tactical-text ${nodeBox[accent]}`}>
              {s}
            </div>
            {i < steps.length - 1 && <span className="font-sans text-signal-amber text-lg leading-none">→</span>}
          </React.Fragment>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-4 text-sm font-sans text-slate-500 dark:text-tactical-dim">{caption}</figcaption>
      )}
    </figure>
  );
}

type TimelineItem = { year?: string; title: string; body?: string; accent?: AccentKey };

/** Vertical timeline with a marked rail — used for architecture evolution. */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="my-8 relative pl-7 border-l border-slate-200 dark:border-tactical-border space-y-7">
      {items.map((it, i) => (
        <div key={i} className="relative">
          <span
            className={`absolute -left-[2.05rem] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-white dark:ring-tactical-bg ${solidFill[it.accent ?? 'brand']}`}
            aria-hidden
          />
          {it.year && <div className="label-mono">{it.year}</div>}
          <div className="font-sans font-semibold text-slate-900 dark:text-tactical-text mt-0.5">{it.title}</div>
          {it.body && <div className="text-sm leading-relaxed text-slate-700 dark:text-tactical-dim mt-1">{it.body}</div>}
        </div>
      ))}
    </div>
  );
}

type BarDatum = { label: string; value: number; display?: string; accent?: AccentKey };

/** Horizontal bar chart for comparative figures. Bars scale to the largest value. */
export function BarChart({ data, caption }: { data: BarDatum[]; caption?: string }) {
  const max = Math.max(...data.map((d) => d.value), 0);
  return (
    <figure className="my-8 tactical-panel p-4 md:p-5 space-y-4">
      {data.map((d, i) => {
        const pct = max > 0 ? Math.max(2, (d.value / max) * 100) : 0;
        return (
          <div key={i} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm font-sans">
              <span className="text-slate-700 dark:text-tactical-dim truncate">{d.label}</span>
              <span className="tabular-nums font-semibold text-slate-900 dark:text-tactical-text shrink-0">
                {d.display ?? d.value}
              </span>
            </div>
            <div className="h-2.5 bg-slate-200 dark:bg-tactical-raised overflow-hidden">
              <div className={`h-full ${solidFill[d.accent ?? 'brand']}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
      {caption && (
        <figcaption className="text-sm font-sans text-slate-500 dark:text-tactical-dim">{caption}</figcaption>
      )}
    </figure>
  );
}

/** Responsive 16:9 video embed (YouTube etc.). */
export function VideoEmbed({ src, title = 'video' }: { src: string; title?: string }) {
  return (
    <div className="relative w-full aspect-video my-10 tactical-panel p-1">
      <iframe
        src={src}
        title={title}
        className="absolute inset-1 w-[calc(100%-0.5rem)] h-[calc(100%-0.5rem)]"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

// HTML styling is explicit; this project does not use a typography plugin.
type EProps = React.HTMLAttributes<HTMLElement> & { href?: string };

function LessonTable({ className = '', ...props }: EProps) {
  const { t } = useTranslation();
  return <div className="lesson-table" tabIndex={0} role="region" aria-label={t('content.table')}>
    <table className={`lesson-table-content ${className}`} {...props} />
  </div>;
}

const elements = {
  h1: ({ className = '', ...p }: EProps) => <h1 className={`lesson-title ${className}`} {...p} />,
  h2: ({ className = '', ...p }: EProps) => <h2 className={`lesson-heading ${className}`} {...p} />,
  h3: ({ className = '', ...p }: EProps) => <h3 className={`lesson-subheading ${className}`} {...p} />,
  h4: ({ className = '', ...p }: EProps) => <h4 className={`lesson-minor-heading ${className}`} {...p} />,
  p: ({ className = '', ...p }: EProps) => <p className={`lesson-paragraph ${className}`} {...p} />,
  ul: ({ className = '', ...p }: EProps) => <ul className={`lesson-list ${className}`} {...p} />,
  ol: ({ className = '', ...p }: EProps) => <ol className={`lesson-list lesson-list-ordered ${className}`} {...p} />,
  li: ({ className = '', ...p }: EProps) => <li className={`lesson-list-item ${className}`} {...p} />,
  blockquote: ({ className = '', ...p }: EProps) => <blockquote className={`lesson-quote ${className}`} {...p} />,
  a: ({ href = '#', className = '', ...p }: EProps) => <a href={href} className={`lesson-link ${className}`} {...p} />,
  strong: ({ className = '', ...p }: EProps) => <strong className={`lesson-strong ${className}`} {...p} />,
  code: ({ className = '', ...p }: EProps) => <code className={`lesson-inline-code ${className}`} {...p} />,
  pre: ({ className = '', ...p }: EProps) => <pre className={`lesson-code ${className}`} tabIndex={0} {...p} />,
  hr: ({ className = '', ...p }: EProps) => <hr className={`lesson-rule ${className}`} {...p} />,
  img: ({ className = '', ...p }: React.ImgHTMLAttributes<HTMLImageElement>) => <img className={`lesson-image ${className}`} loading="lazy" decoding="async" {...p} />,
  table: LessonTable,
  th: ({ className = '', ...p }: EProps) => <th className={`lesson-th ${className}`} {...p} />,
  td: ({ className = '', ...p }: EProps) => <td className={`lesson-td ${className}`} {...p} />,
};

export const mdxComponents = {
  ...elements, Section, Cards, Card, Callout, Metrics, Metric,
  Architecture, Flow, Timeline, BarChart, VideoEmbed,
};
export default mdxComponents;
