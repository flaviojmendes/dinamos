import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, animate } from 'framer-motion';

interface CountUpProps {
  /** Preformatted display string, e.g. "15+", "1.5B+", "$0", "6". */
  value: string;
  className?: string;
  durationMs?: number;
}

/** Splits "$1.5B+" into prefix "$", number 1.5, suffix "B+". */
function parse(value: string): { prefix: string; num: number; suffix: string; decimals: number } {
  const match = value.match(/^(\D*?)([\d.,]+)(.*)$/);
  if (!match) return { prefix: '', num: NaN, suffix: value, decimals: 0 };
  const [, prefix, rawNum, suffix] = match;
  const normalized = rawNum.replace(/,/g, '');
  const decimals = normalized.includes('.') ? normalized.split('.')[1].length : 0;
  return { prefix, num: Number(normalized), suffix, decimals };
}

/**
 * Animated counter that runs once when scrolled into view. Falls back to the
 * final value instantly under prefers-reduced-motion. Non-numeric values render
 * verbatim.
 */
export default function CountUp({ value, className, durationMs = 1400 }: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const { prefix, num, suffix, decimals } = parse(value);
  const [display, setDisplay] = useState<string>(reduce || isNaN(num) ? value : `${prefix}0${suffix}`);

  useEffect(() => {
    if (!inView || reduce || isNaN(num)) return;
    const controls = animate(0, num, {
      duration: durationMs / 1000,
      ease: [0.16, 1, 0.3, 1], // ease-out-expo
      onUpdate(latest) {
        setDisplay(`${prefix}${latest.toFixed(decimals)}${suffix}`);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, num, prefix, suffix, decimals, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
