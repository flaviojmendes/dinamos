import React from 'react';
import { motion } from 'framer-motion';

/**
 * MDX content component library — tactical command-console styling.
 *
 * All content-only pages are authored as MDX and rendered through MdxPage,
 * which provides this `mdxComponents` map via <MDXProvider>. Authors therefore
 * use these components as bare JSX tags (<Callout>, <Cards>, <Metric>, ...)
 * without importing anything.
 *
 * IMPORTANT: `@tailwindcss/typography` is NOT installed, so the `prose` classes
 * are inert. The HTML element map below carries ALL of the typographic styling.
 * Keep accent / variant class strings STATIC (never build class names
 * dynamically) so Tailwind's purge step keeps them.
 */

type AccentKey = 'brand' | 'green' | 'purple' | 'red' | 'yellow' | 'slate';

// Left accent bar color per accent (the tactical section-marker treatment).
const accentBar: Record<AccentKey, string> = {
  brand: 'bg-signal-cyan',
  green: 'bg-signal-green',
  purple: 'bg-signal-cyan',
  red: 'bg-signal-red',
  yellow: 'bg-signal-amber',
  slate: 'bg-slate-400 dark:bg-tactical-line',
};

const titleAccent: Record<AccentKey, string> = {
  brand: 'text-brand-600 dark:text-signal-cyan',
  green: 'text-green-600 dark:text-signal-green',
  purple: 'text-purple-600 dark:text-signal-cyan',
  red: 'text-red-600 dark:text-signal-red',
  yellow: 'text-yellow-600 dark:text-signal-amber',
  slate: 'text-slate-900 dark:text-tactical-text',
};

// ---------------------------------------------------------------------------
// Layout / rich components
// ---------------------------------------------------------------------------

/** Fade-in section wrapper (reproduces the framer-motion entrance on rich pages). */
export function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Responsive grid for <Card> children. cols defaults to 3. */
export function Cards({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const colClass =
    cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
  return <div className={`grid grid-cols-1 ${colClass} gap-4 my-8`}>{children}</div>;
}

/** A single bordered tactical panel with an optional accent header. */
export function Card({
  title,
  emoji,
  accent = 'slate',
  children,
}: {
  title?: string;
  emoji?: string;
  accent?: AccentKey;
  children: React.ReactNode;
}) {
  return (
    <div className="tactical-panel">
      {title && (
        <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-tactical-border px-4 py-3">
          <span className={`h-3.5 w-1 shrink-0 ${accentBar[accent]}`} aria-hidden />
          {emoji && <span className="text-base">{emoji}</span>}
          <h3 className={`font-mono uppercase tracking-wider text-sm font-semibold ${titleAccent[accent]}`}>{title}</h3>
        </div>
      )}
      <div className="p-4 space-y-3 text-slate-700 dark:text-tactical-dim text-sm leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}

/** Highlighted box for asides / theorem statements / notes. */
export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  title?: string;
  children: React.ReactNode;
}) {
  const bar: Record<string, string> = {
    info: 'bg-signal-cyan',
    success: 'bg-signal-green',
    warning: 'bg-signal-amber',
    danger: 'bg-signal-red',
    neutral: 'bg-slate-400 dark:bg-tactical-line',
  };
  const titleColor: Record<string, string> = {
    info: 'text-brand-600 dark:text-signal-cyan',
    success: 'text-green-600 dark:text-signal-green',
    warning: 'text-yellow-600 dark:text-signal-amber',
    danger: 'text-red-600 dark:text-signal-red',
    neutral: 'text-slate-900 dark:text-tactical-text',
  };
  const label: Record<string, string> = {
    info: 'NOTE',
    success: 'CONFIRMED',
    warning: 'CAUTION',
    danger: 'ALERT',
    neutral: 'MEMO',
  };
  return (
    <div className="my-8 tactical-panel flex">
      <div className={`w-1 shrink-0 ${bar[type]}`} aria-hidden />
      <div className="flex-1 p-5">
        <div className={`font-mono uppercase tracking-wider text-xs font-semibold mb-2 ${titleColor[type]}`}>
          {title ?? label[type]}
        </div>
        <div className="space-y-3 text-slate-700 dark:text-tactical-dim [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Responsive grid of headline metrics. */
export function Metrics({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const colClass =
    cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
  return <div className={`grid grid-cols-1 ${colClass} gap-3 my-8`}>{children}</div>;
}

/** A single big-number metric tile. */
export function Metric({ value, label, accent = 'brand' }: { value: string; label: string; accent?: AccentKey }) {
  return (
    <div className="tactical-panel px-4 py-4">
      <div className={`font-mono text-3xl font-bold tabular-nums leading-none ${titleAccent[accent]}`}>{value}</div>
      <div className="label-mono mt-2">{label}</div>
    </div>
  );
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
    <div className="flex items-center justify-center font-mono text-signal-amber shrink-0 py-1 md:py-0 md:px-1">
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
                      className={`border px-3 py-2 text-center font-mono text-xs md:text-[0.8rem] leading-tight text-slate-800 dark:text-tactical-text ${nodeBox[acc]}`}
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
        <figcaption className="mt-4 text-xs font-mono text-slate-500 dark:text-tactical-dim text-center">
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
            <div className={`border px-3 py-2 font-mono text-xs md:text-sm text-slate-800 dark:text-tactical-text ${nodeBox[accent]}`}>
              {s}
            </div>
            {i < steps.length - 1 && <span className="font-mono text-signal-amber text-lg leading-none">→</span>}
          </React.Fragment>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-4 text-xs font-mono text-slate-500 dark:text-tactical-dim">{caption}</figcaption>
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
          <div className="font-mono font-semibold text-slate-900 dark:text-tactical-text mt-0.5">{it.title}</div>
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
            <div className="flex items-baseline justify-between gap-3 text-xs font-mono">
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
        <figcaption className="text-xs font-mono text-slate-500 dark:text-tactical-dim">{caption}</figcaption>
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

// ---------------------------------------------------------------------------
// HTML element map — carries the base typography (prose is inert).
// ---------------------------------------------------------------------------

type EProps = React.HTMLAttributes<HTMLElement> & { href?: string };

const elements = {
  h1: (p: EProps) => (
    <h1 className="text-3xl md:text-4xl font-mono font-bold tracking-tight mb-8 text-slate-900 dark:text-tactical-text" {...p} />
  ),
  h2: (p: EProps) => (
    <h2
      className="flex items-center gap-3 text-2xl font-mono font-bold mt-16 mb-6 text-slate-900 dark:text-tactical-text before:content-[''] before:h-6 before:w-1 before:bg-signal-amber before:shrink-0"
      {...p}
    />
  ),
  h3: (p: EProps) => (
    <h3 className="text-xl font-mono font-semibold mt-10 mb-4 text-brand-600 dark:text-signal-cyan" {...p} />
  ),
  h4: (p: EProps) => (
    <h4 className="text-lg font-mono font-medium mt-6 mb-3 text-slate-900 dark:text-tactical-text" {...p} />
  ),
  p: (p: EProps) => (
    <p className="my-5 leading-relaxed text-slate-700 dark:text-tactical-dim" {...p} />
  ),
  ul: (p: EProps) => <ul className="list-disc list-inside space-y-2 ml-4 my-5 text-slate-700 dark:text-tactical-dim marker:text-signal-amber" {...p} />,
  ol: (p: EProps) => <ol className="list-decimal list-inside space-y-2 ml-4 my-5 text-slate-700 dark:text-tactical-dim marker:text-signal-amber" {...p} />,
  li: (p: EProps) => <li className="leading-relaxed" {...p} />,
  blockquote: (p: EProps) => (
    <blockquote
      className="border-l-2 border-signal-amber pl-4 my-8 text-lg font-mono text-slate-800 dark:text-tactical-text italic"
      {...p}
    />
  ),
  a: ({ href = '#', ...p }: EProps) => (
    <a href={href} className="text-brand-600 dark:text-signal-cyan underline underline-offset-2 hover:no-underline" {...p} />
  ),
  code: (p: EProps) => (
    <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-tactical-raised text-sm font-mono text-brand-700 dark:text-signal-green" {...p} />
  ),
  pre: (p: EProps) => (
    <pre className="my-6 p-4 bg-slate-950 dark:bg-black border border-slate-800 dark:border-tactical-border text-slate-100 overflow-x-auto text-sm [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-slate-100" {...p} />
  ),
  hr: (p: EProps) => <hr className="my-10 border-slate-200 dark:border-tactical-border" {...p} />,
  img: (p: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className="my-6 max-w-full border border-slate-200 dark:border-tactical-border" {...p} />
  ),
  table: (p: EProps) => (
    <div className="my-6 overflow-x-auto tactical-panel">
      <table className="w-full text-left border-collapse text-sm" {...p} />
    </div>
  ),
  th: (p: EProps) => <th className="label-mono border-b border-slate-200 dark:border-tactical-border px-3 py-2.5 bg-slate-50 dark:bg-tactical-surface" {...p} />,
  td: (p: EProps) => <td className="border-b border-slate-100 dark:border-tactical-border/60 px-3 py-2.5 font-mono text-slate-700 dark:text-tactical-dim" {...p} />,
};

/** The complete component set handed to <MDXProvider>. */
export const mdxComponents = {
  ...elements,
  Section,
  Cards,
  Card,
  Callout,
  Metrics,
  Metric,
  Architecture,
  Flow,
  Timeline,
  BarChart,
  VideoEmbed,
};

export default mdxComponents;
