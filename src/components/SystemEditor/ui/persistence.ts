// Save/load the design as a .din file. v2 stores full node configs, the load
// profile, chaos events and the RNG seed. v1 files (legacy SimpleSystemEditor)
// are upgraded on import so old designs keep working.

import { NodeConfig, EdgeSpec } from '../engine/types';
import { ChaosEvent, LoadProfileType } from '../engine/scenarios';
import { parseDesignRaw } from '../engine/designSchema';
import type { CloudProvider } from '../engine/costModel';

export interface SerializedNode {
  id: string;
  position: { x: number; y: number };
  config: NodeConfig;
}

export interface DesignV2 {
  version: '2.0';
  seed: number;
  profileType: LoadProfileType;
  profileMultiplier?: number;
  provider?: CloudProvider;
  chaos: ChaosEvent[];
  nodes: SerializedNode[];
  edges: EdgeSpec[];
}

export function serializeDesign(
  nodes: SerializedNode[],
  edges: EdgeSpec[],
  seed: number,
  profileType: LoadProfileType,
  chaos: ChaosEvent[],
  provider: CloudProvider = 'aws',
  profileMultiplier = 1,
): string {
  const design: DesignV2 = { version: '2.0', seed, profileType, profileMultiplier, provider, chaos, nodes, edges };
  return JSON.stringify(design, null, 2);
}

export function parseDesign(raw: string): DesignV2 {
  return parseDesignRaw(raw);
}
