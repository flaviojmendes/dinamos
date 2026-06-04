import React from 'react';
import { motion } from 'framer-motion';

/**
 * MDX content component library.
 *
 * All content-only pages are authored as MDX and rendered through MdxPage,
 * which provides this `mdxComponents` map via <MDXProvider>. Authors therefore
 * use these components as bare JSX tags (<Callout>, <Cards>, <Metric>, ...)
 * without importing anything.
 *
 * IMPORTANT: `@tailwindcss/typography` is NOT installed, so the `prose` classes
 * are inert. The HTML element map below carries ALL of the typographic styling,
 * reproducing the utility classes the legacy page components used. Keep accent /
 * variant class strings STATIC (never build class names dynamically) so Tailwind's
 * purge step keeps them.
 */

type AccentKey = 'brand' | 'green' | 'purple' | 'red' | 'yellow' | 'slate';

// Full static class strings per accent so Tailwind keeps them in the build.
const cardAccent: Record<AccentKey, string> = {
  brand: 'bg-blue-900/20 border-blue-700',
  green: 'bg-green-900/20 border-green-700',
  purple: 'bg-purple-900/20 border-purple-700',
  red: 'bg-red-900/20 border-red-700',
  yellow: 'bg-yellow-900/20 border-yellow-700',
  slate: 'bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700',
};

const titleAccent: Record<AccentKey, string> = {
  brand: 'text-brand-600 dark:text-brand-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
  red: 'text-red-400',
  yellow: 'text-yellow-400',
  slate: 'text-slate-900 dark:text-slate-100',
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
  return <div className={`grid grid-cols-1 ${colClass} gap-6 my-8`}>{children}</div>;
}

/** A single colored panel card with optional emoji + title. */
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
    <div className={`p-6 rounded-lg border ${cardAccent[accent]}`}>
      {emoji && <div className="text-2xl mb-3">{emoji}</div>}
      {title && (
        <h3 className={`text-2xl font-semibold mb-4 ${titleAccent[accent]}`}>{title}</h3>
      )}
      <div className="space-y-3 text-slate-700 dark:text-gray-300 text-sm leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1">
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
  const styles: Record<string, string> = {
    info: 'bg-blue-900/20 border-blue-700 text-brand-600 dark:text-brand-300',
    success: 'bg-green-900/20 border-green-700 text-green-400',
    warning: 'bg-yellow-900/20 border-yellow-700 text-yellow-400',
    danger: 'bg-red-900/20 border-red-700 text-red-400',
    neutral: 'bg-slate-100 dark:bg-slate-800/30 border-zinc-300 dark:border-zinc-600 text-slate-900 dark:text-slate-100',
  };
  return (
    <div className={`my-8 p-6 rounded-lg border ${styles[type]}`}>
      {title && <div className="text-lg font-semibold mb-2">{title}</div>}
      <div className="space-y-3 text-slate-700 dark:text-gray-200 [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}

/** Responsive grid of headline metrics. */
export function Metrics({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const colClass =
    cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
  return <div className={`grid grid-cols-1 ${colClass} gap-4 my-8`}>{children}</div>;
}

/** A single big-number metric card. */
export function Metric({ value, label, accent = 'brand' }: { value: string; label: string; accent?: AccentKey }) {
  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-center">
      <div className={`text-2xl font-bold ${titleAccent[accent]}`}>{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

/** Responsive 16:9 video embed (YouTube etc.). */
export function VideoEmbed({ src, title = 'video' }: { src: string; title?: string }) {
  return (
    <div className="relative w-full aspect-video my-10">
      <iframe
        src={src}
        title={title}
        className="absolute top-0 left-0 w-full h-full rounded-lg"
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
    <h1 className="text-4xl md:text-5xl font-bold mb-8 text-brand-600 dark:text-brand-400" {...p} />
  ),
  h2: (p: EProps) => (
    <h2 className="text-3xl font-bold mt-16 mb-6 text-brand-600 dark:text-brand-300" {...p} />
  ),
  h3: (p: EProps) => (
    <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900 dark:text-slate-100" {...p} />
  ),
  h4: (p: EProps) => (
    <h4 className="text-xl font-medium mt-6 mb-3 text-slate-900 dark:text-slate-200" {...p} />
  ),
  p: (p: EProps) => (
    <p className="my-5 leading-relaxed text-slate-700 dark:text-slate-200" {...p} />
  ),
  ul: (p: EProps) => <ul className="list-disc list-inside space-y-2 ml-4 my-5 text-slate-700 dark:text-slate-200" {...p} />,
  ol: (p: EProps) => <ol className="list-decimal list-inside space-y-2 ml-4 my-5 text-slate-700 dark:text-slate-200" {...p} />,
  li: (p: EProps) => <li className="leading-relaxed" {...p} />,
  blockquote: (p: EProps) => (
    <blockquote
      className="border-l-4 border-blue-500 pl-4 my-8 text-xl font-medium text-brand-600 dark:text-brand-200 italic"
      {...p}
    />
  ),
  a: ({ href = '#', ...p }: EProps) => (
    <a href={href} className="text-brand-600 dark:text-brand-400 underline hover:no-underline" {...p} />
  ),
  code: (p: EProps) => (
    <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-sm font-mono" {...p} />
  ),
  pre: (p: EProps) => (
    <pre className="my-6 p-4 rounded-lg bg-slate-900 text-slate-100 overflow-x-auto text-sm [&_code]:bg-transparent [&_code]:p-0" {...p} />
  ),
  hr: (p: EProps) => <hr className="my-10 border-slate-300 dark:border-slate-700" {...p} />,
  img: (p: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className="rounded-lg my-6 max-w-full" {...p} />
  ),
  table: (p: EProps) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm" {...p} />
    </div>
  ),
  th: (p: EProps) => <th className="border-b border-slate-300 dark:border-slate-700 px-3 py-2 font-semibold" {...p} />,
  td: (p: EProps) => <td className="border-b border-slate-200 dark:border-slate-800 px-3 py-2" {...p} />,
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
  VideoEmbed,
};

export default mdxComponents;
