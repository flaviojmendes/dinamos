import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Entry direction for the slide. */
  from?: Direction;
  /** Seconds to wait before animating in. */
  delay?: number;
  /** Travel distance in px for the slide. */
  distance?: number;
  /** Render as a different element when needed (defaults to div). */
  as?: 'div' | 'li' | 'section' | 'span';
  /** Re-run the reveal every time it scrolls back into view. */
  repeat?: boolean;
}

const OFFSETS: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 1 },
  down: { y: -1 },
  left: { x: 1 },
  right: { x: -1 },
  none: {},
};

/**
 * Scroll-triggered reveal. Content is visible by default for headless/no-JS
 * renders; motion only enhances. Honors prefers-reduced-motion by rendering
 * statically with no transform.
 */
export default function Reveal({
  children,
  className,
  from = 'up',
  delay = 0,
  distance = 28,
  as = 'div',
  repeat = false,
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as as React.ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  const off = OFFSETS[from];
  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: (off.x ?? 0) * distance,
      y: (off.y ?? 0) * distance,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.7,
        delay,
        // ease-out-quart — confident settle, no bounce
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: !repeat, amount: 0.3, margin: '0px 0px -10% 0px' }}
    >
      {children}
    </MotionTag>
  );
}
