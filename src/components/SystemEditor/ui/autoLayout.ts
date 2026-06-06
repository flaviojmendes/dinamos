// Dependency-free layered auto-layout for the editor graph. Nodes are assigned
// to ranks by longest-path from the sources (cycle-safe via Kahn ordering, with
// leftover cyclic nodes appended), then spread along the cross axis. Edges are
// re-anchored to the sides that match the chosen flow direction so the result
// reads cleanly (top→bottom or left→right).

import { Edge, Node } from 'reactflow';
import { SimNodeData } from './SimNode';

export type LayoutDirection = 'vertical' | 'horizontal';

const DEFAULT_W = 200;
const DEFAULT_H = 132;
const RANK_GAP = 90; // space between consecutive ranks (depth)
const SIBLING_GAP = 40; // space between nodes sharing a rank

export function layoutGraph(
  nodes: Node<SimNodeData>[],
  edges: Edge[],
  direction: LayoutDirection,
): { nodes: Node<SimNodeData>[]; edges: Edge[] } {
  if (nodes.length === 0) return { nodes, edges };
  const vertical = direction === 'vertical';

  const incoming = new Map<string, string[]>();
  const outgoing = new Map<string, string[]>();
  nodes.forEach((n) => {
    incoming.set(n.id, []);
    outgoing.set(n.id, []);
  });
  edges.forEach((e) => {
    if (!outgoing.has(e.source) || !incoming.has(e.target) || e.source === e.target) return;
    outgoing.get(e.source)!.push(e.target);
    incoming.get(e.target)!.push(e.source);
  });

  // Kahn topological order. Nodes stuck in cycles never reach indegree 0, so we
  // append them in their original order afterwards.
  const indeg = new Map<string, number>();
  nodes.forEach((n) => indeg.set(n.id, incoming.get(n.id)!.length));
  const queue = nodes.filter((n) => indeg.get(n.id) === 0).map((n) => n.id);
  const order: string[] = [];
  const seen = new Set<string>();
  while (queue.length) {
    const id = queue.shift()!;
    if (seen.has(id)) continue;
    seen.add(id);
    order.push(id);
    outgoing.get(id)!.forEach((t) => {
      indeg.set(t, (indeg.get(t) ?? 1) - 1);
      if ((indeg.get(t) ?? 0) <= 0) queue.push(t);
    });
  }
  nodes.forEach((n) => {
    if (!seen.has(n.id)) order.push(n.id);
  });

  // Longest-path rank: a node sits one rank below its deepest ranked parent.
  const rank = new Map<string, number>();
  order.forEach((id) => {
    let r = 0;
    incoming.get(id)!.forEach((p) => {
      if (rank.has(p)) r = Math.max(r, rank.get(p)! + 1);
    });
    rank.set(id, r);
  });

  // Bucket ids by rank, keeping topological order for stable sibling placement.
  const ranks: string[][] = [];
  order.forEach((id) => {
    const r = rank.get(id) ?? 0;
    (ranks[r] ??= []).push(id);
  });

  const sizeMap = new Map<string, { w: number; h: number }>();
  nodes.forEach((n) => sizeMap.set(n.id, { w: n.width ?? DEFAULT_W, h: n.height ?? DEFAULT_H }));
  const mainSize = (id: string) => (vertical ? sizeMap.get(id)!.h : sizeMap.get(id)!.w);
  const crossSize = (id: string) => (vertical ? sizeMap.get(id)!.w : sizeMap.get(id)!.h);

  const positions = new Map<string, { x: number; y: number }>();
  let mainOffset = 0;
  ranks.forEach((ids) => {
    if (!ids || ids.length === 0) return;
    const rankExtent = Math.max(...ids.map(mainSize));
    const totalCross = ids.reduce((s, id) => s + crossSize(id), 0) + SIBLING_GAP * (ids.length - 1);
    let crossCursor = -totalCross / 2;
    ids.forEach((id) => {
      const main = mainOffset + (rankExtent - mainSize(id)) / 2;
      positions.set(id, vertical ? { x: crossCursor, y: main } : { x: main, y: crossCursor });
      crossCursor += crossSize(id) + SIBLING_GAP;
    });
    mainOffset += rankExtent + RANK_GAP;
  });

  const sourceHandle = vertical ? 'bottom' : 'right';
  const targetHandle = vertical ? 'top' : 'left';

  return {
    nodes: nodes.map((n) => ({ ...n, position: positions.get(n.id) ?? n.position })),
    edges: edges.map((e) => ({ ...e, sourceHandle, targetHandle })),
  };
}
