// Lightweight, read-only SVG thumbnail of a player's architecture. Avoids the
// cost of mounting a full ReactFlow per player so the spectator grid stays
// smooth with many participants.

import { useMemo } from 'react';
import { NODE_CATALOG } from '../ui/nodeCatalog';
import { NodeKind } from '../engine/types';
import { GameArchitecture } from './types';

// Approximate footprint of a node in flow coordinates (matches the editor card).
const NODE_W = 150;
const NODE_H = 56;
const PAD = 40;

export default function MiniArchitecture({
  architecture,
  className = '',
  height = 150,
}: {
  architecture: GameArchitecture | null;
  className?: string;
  height?: number;
}) {
  const model = useMemo(() => {
    const nodes = architecture?.nodes ?? [];
    const edges = architecture?.edges ?? [];
    if (nodes.length === 0) return null;

    const centers = new Map<string, { x: number; y: number }>();
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const n of nodes) {
      const x = n.position?.x ?? 0;
      const y = n.position?.y ?? 0;
      centers.set(n.id, { x: x + NODE_W / 2, y: y + NODE_H / 2 });
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + NODE_W);
      maxY = Math.max(maxY, y + NODE_H);
    }

    const vbX = minX - PAD;
    const vbY = minY - PAD;
    const vbW = maxX - minX + PAD * 2;
    const vbH = maxY - minY + PAD * 2;

    return { nodes, edges, centers, vbX, vbY, vbW, vbH };
  }, [architecture]);

  if (!model) {
    return (
      <div
        className={`flex items-center justify-center border border-tactical-border bg-tactical-raised/40 ${className}`}
        style={{ height }}
      >
        <span className="font-mono text-[10px] text-tactical-label">no components</span>
      </div>
    );
  }

  return (
    <svg
      viewBox={`${model.vbX} ${model.vbY} ${model.vbW} ${model.vbH}`}
      preserveAspectRatio="xMidYMid meet"
      className={`block w-full border border-tactical-border bg-tactical-raised/40 ${className}`}
      style={{ height }}
    >
      {model.edges.map((e) => {
        const a = model.centers.get(e.source);
        const b = model.centers.get(e.target);
        if (!a || !b) return null;
        return (
          <line
            key={e.id}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#64748b"
            strokeWidth={2.5}
            strokeOpacity={0.6}
          />
        );
      })}

      {model.nodes.map((n) => {
        const x = n.position?.x ?? 0;
        const y = n.position?.y ?? 0;
        const hex = NODE_CATALOG[n.config.kind as NodeKind]?.hex ?? '#94a3b8';
        const label = n.config.label ?? n.config.kind;
        return (
          <g key={n.id}>
            <rect
              x={x}
              y={y}
              width={NODE_W}
              height={NODE_H}
              rx={6}
              fill={hex}
              fillOpacity={0.18}
              stroke={hex}
              strokeWidth={2.5}
            />
            <text
              x={x + NODE_W / 2}
              y={y + NODE_H / 2 + 5}
              textAnchor="middle"
              fontSize={16}
              fontFamily="ui-monospace, monospace"
              fill="#e2e8f0"
            >
              {label.length > 14 ? `${label.slice(0, 13)}…` : label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
