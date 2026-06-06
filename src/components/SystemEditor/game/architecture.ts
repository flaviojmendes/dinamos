// Helpers to convert between the stored GameArchitecture JSON and ReactFlow
// nodes/edges, applying the match's lock rules.

import { Edge, Node } from 'reactflow';
import { NodeConfig, EdgeSpec } from '../engine/types';
import { SimNodeData } from '../ui/SimNode';
import { GameArchitecture } from './types';

type RFNode = Node<SimNodeData>;

/**
 * Build ReactFlow nodes/edges from a starting architecture. Seed components are
 * tagged `origin: 'seed'`; those in `lockedNodeIds` (or all of them when
 * deletion is disallowed) get `locked` + `deletable: false` so players cannot
 * remove them.
 */
export function architectureToRF(
  arch: GameArchitecture,
  lockedNodeIds: string[],
  allowDeleteStarting: boolean
): { nodes: RFNode[]; edges: Edge[] } {
  const lockSet = new Set(lockedNodeIds ?? []);
  const lockAll = !allowDeleteStarting;

  const nodes: RFNode[] = (arch.nodes ?? []).map((n) => {
    const isSeed = n.config.origin ? n.config.origin === 'seed' : true;
    const locked = isSeed && (lockAll || lockSet.has(n.id));
    const config: NodeConfig = {
      ...n.config,
      origin: n.config.origin ?? 'seed',
      locked,
    };
    return {
      id: n.id,
      type: n.config.kind,
      position: n.position,
      data: { config },
      deletable: !locked,
    };
  });

  const edges: Edge[] = (arch.edges ?? []).map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? 'bottom',
    targetHandle: e.targetHandle ?? 'top',
    animated: true,
    style: { strokeWidth: 2.5 },
  }));

  return { nodes, edges };
}

/** Serialize the current ReactFlow graph back into a GameArchitecture. */
export function rfToArchitecture(
  nodes: RFNode[],
  edges: Edge[]
): GameArchitecture {
  return {
    nodes: nodes.map((n) => ({
      id: n.id,
      position: n.position,
      config: n.data.config,
    })),
    edges: edges.map((e): EdgeSpec => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle ?? null,
      targetHandle: e.targetHandle ?? null,
    })),
  };
}

/** Convert a preset (admin console) into a GameArchitecture. */
export function presetNodesToArchitecture(
  presetNodes: { config: NodeConfig; position: { x: number; y: number } }[],
  presetEdges: EdgeSpec[]
): GameArchitecture {
  return {
    nodes: presetNodes.map((n) => ({
      id: n.config.id,
      position: n.position,
      config: { ...n.config, origin: 'seed' },
    })),
    edges: presetEdges,
  };
}
