import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export interface SimulatorMediaProps {
  /** Base name without extension, e.g. "cache" for cache.webp / cache-poster.webp */
  base: string;
  alt: string;
  className?: string;
}

/**
 * Landing simulator preview: poster first (small), animated WebP only after the
 * card enters the viewport and motion is allowed — keeps initial transfer low.
 */
export default function SimulatorMedia({ base, alt, className }: SimulatorMediaProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [animatedReady, setAnimatedReady] = useState(false);

  const poster = `/${base}-poster.webp`;
  const animated = `/${base}.webp`;

  useEffect(() => {
    if (reduceMotion) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setAnimatedReady(true);
    };
    img.src = animated;
    return () => {
      cancelled = true;
    };
  }, [inView, reduceMotion, animated]);

  const imgClass =
    className ??
    'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105';

  const showAnimated = !reduceMotion && animatedReady;
  const src = showAnimated ? animated : poster;

  return (
    <div ref={containerRef} className="h-full w-full">
      <img src={src} alt={alt} loading="lazy" decoding="async" className={imgClass} />
    </div>
  );
}
