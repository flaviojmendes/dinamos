// Graph topology analysis: strongly-connected components (for cycle support),
// source/sink classification and structural validation.

import { EdgeSpec, NodeConfig, nodeCapacity } from './types';

export interface Topology {
  /** node id -> outgoing edges */
  outgoing: Map<string, EdgeSpec[]>;
  /** node id -> incoming edges */
  incoming: Map<string, EdgeSpec[]>;
  /** Strongly-connected components (each a list of node ids). */
  sccs: string[][];
  /** node id -> index of its SCC. */
  sccOf: Map<string, number>;
  /** SCCs containing a real cycle (size > 1, or a self-loop). */
  cyclicSccs: Set<number>;
  sources: string[];
  sinks: string[];
}

export function buildTopology(nodes: NodeConfig[], edges: EdgeSpec[]): Topology {
  const outgoing = new Map<string, EdgeSpec[]>();
  const incoming = new Map<string, EdgeSpec[]>();
  nodes.forEach((n) => {
    outgoing.set(n.id, []);
    incoming.set(n.id, []);
  });
  edges.forEach((e) => {
    if (!outgoing.has(e.source) || !incoming.has(e.target)) return;
    outgoing.get(e.source)!.push(e);
    incoming.get(e.target)!.push(e);
  });

  const { sccs, sccOf } = tarjan(nodes, outgoing);

  // A component is cyclic if it has more than one node or a self-loop.
  const cyclicSccs = new Set<number>();
  sccs.forEach((comp, idx) => {
    if (comp.length > 1) {
      cyclicSccs.add(idx);
      return;
    }
    const only = comp[0];
    if (outgoing.get(only)!.some((e) => e.target === only)) cyclicSccs.add(idx);
  });

  const sources = nodes.filter((n) => incoming.get(n.id)!.length === 0).map((n) => n.id);
  const sinks = nodes.filter((n) => outgoing.get(n.id)!.length === 0).map((n) => n.id);

  return { outgoing, incoming, sccs, sccOf, cyclicSccs, sources, sinks };
}

/** Tarjan's strongly-connected-components algorithm (iterative). */
function tarjan(
  nodes: NodeConfig[],
  outgoing: Map<string, EdgeSpec[]>,
): { sccs: string[][]; sccOf: Map<string, number> } {
  const index = new Map<string, number>();
  const low = new Map<string, number>();
  const onStack = new Set<string>();
  const stack: string[] = [];
  const sccs: string[][] = [];
  const sccOf = new Map<string, number>();
  let counter = 0;

  // Explicit work stack to avoid blowing the call stack on large graphs.
  type Frame = { node: string; edgeIdx: number };

  for (const start of nodes) {
    if (index.has(start.id)) continue;
    const work: Frame[] = [{ node: start.id, edgeIdx: 0 }];

    while (work.length > 0) {
      const frame = work[work.length - 1];
      const v = frame.node;

      if (frame.edgeIdx === 0) {
        index.set(v, counter);
        low.set(v, counter);
        counter++;
        stack.push(v);
        onStack.add(v);
      }

      const edges = outgoing.get(v)!;
      if (frame.edgeIdx < edges.length) {
        const w = edges[frame.edgeIdx].target;
        frame.edgeIdx++;
        if (!index.has(w)) {
          work.push({ node: w, edgeIdx: 0 });
        } else if (onStack.has(w)) {
          low.set(v, Math.min(low.get(v)!, index.get(w)!));
        }
        continue;
      }

      // Done exploring v's edges.
      if (low.get(v) === index.get(v)) {
        const comp: string[] = [];
        let w: string;
        do {
          w = stack.pop()!;
          onStack.delete(w);
          comp.push(w);
          sccOf.set(w, sccs.length);
        } while (w !== v);
        sccs.push(comp);
      }

      work.pop();
      if (work.length > 0) {
        const parent = work[work.length - 1].node;
        low.set(parent, Math.min(low.get(parent)!, low.get(v)!));
      }
    }
  }

  return { sccs, sccOf };
}

/** Human-readable structural warnings shown in the dashboard. */
export function validateTopology(
  nodes: NodeConfig[],
  edges: EdgeSpec[],
  topo: Topology,
): string[] {
  const warnings: string[] = [];

  // Clients and cron-enabled nodes both originate traffic, so either satisfies
  // the "system has a load source" check.
  if (!nodes.some((n) => n.kind === 'client' || n.cronEnabled)) {
    warnings.push('NO_CLIENT');
  }

  const connected = new Set<string>();
  edges.forEach((e) => {
    connected.add(e.source);
    connected.add(e.target);
  });
  // Cron sources are self-driven, so an unconnected cron node is not an orphan.
  const orphans = nodes.filter((n) => !connected.has(n.id) && n.kind !== 'client' && !n.cronEnabled);
  orphans.forEach((n) => warnings.push(`DISCONNECTED:${n.label}`));

  // Capacity bottlenecks are surfaced at runtime, but a trivially zero-capacity
  // node is worth flagging immediately.
  nodes.forEach((n) => {
    if (n.kind !== 'client' && nodeCapacity(n) <= 0) {
      warnings.push(`ZERO_CAPACITY:${n.label}`);
    }
  });

  return warnings;
}
