import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

type Pt = { x: number; y: number };

const NODES = {
  client: { x: 70, y: 210 },
  lb: { x: 280, y: 210 },
  a: { x: 520, y: 96 },
  b: { x: 520, y: 210 },
  c: { x: 520, y: 324 },
  cache: { x: 770, y: 130 },
  db: { x: 770, y: 300 },
} satisfies Record<string, Pt>;

const EDGES: { from: Pt; to: Pt; color: string; delay: number }[] = [
  { from: NODES.client, to: NODES.lb, color: '#56b6c8', delay: 0 },
  { from: NODES.lb, to: NODES.a, color: '#34d399', delay: 0.5 },
  { from: NODES.lb, to: NODES.b, color: '#34d399', delay: 0.9 },
  { from: NODES.lb, to: NODES.c, color: '#34d399', delay: 1.3 },
  { from: NODES.a, to: NODES.cache, color: '#d9a441', delay: 1.7 },
  { from: NODES.b, to: NODES.cache, color: '#d9a441', delay: 2.1 },
  { from: NODES.c, to: NODES.db, color: '#56b6c8', delay: 2.5 },
  { from: NODES.b, to: NODES.db, color: '#56b6c8', delay: 2.9 },
];

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const edgeVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Packet({ from, to, color, delay }: { from: Pt; to: Pt; color: string; delay: number }) {
  return (
    <motion.circle
      r={4}
      fill={color}
      initial={{ cx: from.x, cy: from.y, opacity: 0 }}
      animate={{
        cx: [from.x, to.x],
        cy: [from.y, to.y],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.6,
        delay,
        repeat: Infinity,
        repeatDelay: 1.6,
        ease: 'easeInOut',
        times: [0, 0.1, 0.9, 1],
      }}
      style={{ filter: `drop-shadow(0 0 5px ${color})` }}
    />
  );
}

interface NodeBoxProps {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  color: string;
}

function NodeBox({ x, y, w = 96, h = 52, label, sub, color }: NodeBoxProps) {
  return (
    <motion.g variants={nodeVariants}>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={8}
        className="fill-white dark:fill-tactical-surface"
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={x}
        y={sub ? y - 3 : y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-slate-900 dark:fill-tactical-text"
        style={{ fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x}
          y={y + 13}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          style={{ fontSize: 9.5, fontFamily: 'JetBrains Mono, monospace' }}
        >
          {sub}
        </text>
      )}
    </motion.g>
  );
}

interface SystemTopologyProps {
  /** label -> string copy provided by the parent (already translated) */
  copy: {
    nodeClient: string;
    nodeLb: string;
    nodeCache: string;
    nodeDb: string;
  };
}

/**
 * Scroll-revealed topology of a small distributed system. Edges draw in, nodes
 * pop in sequence, and request packets flow continuously to convey live
 * traffic. Reduced-motion renders the full static diagram with no packets.
 */
export default function SystemTopology({ copy }: SystemTopologyProps) {
  const reduce = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 840 420"
      className="w-full h-auto"
      role="img"
      aria-label="Diagram: client requests routed through a load balancer to three service nodes backed by a cache and a database."
      variants={groupVariants}
      initial={reduce ? 'show' : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {/* edges */}
      <g fill="none" strokeWidth={1.5} className="stroke-slate-300 dark:stroke-tactical-line">
        {EDGES.map((e, i) => (
          <motion.line
            key={i}
            x1={e.from.x}
            y1={e.from.y}
            x2={e.to.x}
            y2={e.to.y}
            variants={edgeVariants}
          />
        ))}
      </g>

      {/* flowing packets */}
      {!reduce && (
        <g>
          {EDGES.map((e, i) => (
            <Packet key={i} from={e.from} to={e.to} color={e.color} delay={e.delay} />
          ))}
        </g>
      )}

      {/* nodes */}
      <NodeBox x={NODES.client.x} y={NODES.client.y} w={84} label={copy.nodeClient} sub="1.5B+/yr" color="#56b6c8" />
      <NodeBox x={NODES.lb.x} y={NODES.lb.y} label={copy.nodeLb} sub="round-robin" color="#34d399" />
      <NodeBox x={NODES.a.x} y={NODES.a.y} w={88} label="node-01" sub="healthy" color="#34d399" />
      <NodeBox x={NODES.b.x} y={NODES.b.y} w={88} label="node-02" sub="healthy" color="#34d399" />
      <NodeBox x={NODES.c.x} y={NODES.c.y} w={88} label="node-03" sub="healthy" color="#34d399" />
      <NodeBox x={NODES.cache.x} y={NODES.cache.y} w={84} label={copy.nodeCache} sub="96% hit" color="#d9a441" />
      <NodeBox x={NODES.db.x} y={NODES.db.y} w={84} label={copy.nodeDb} sub="replicated" color="#56b6c8" />
    </motion.svg>
  );
}
