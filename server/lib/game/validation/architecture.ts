import { HTTPException } from 'hono/http-exception';
import { evaluateCompliance } from '../../../../src/components/SystemEditor/engine/compliance.js';
import { stableHash } from '../../../../src/components/SystemEditor/engine/stableHash.js';
import type { GameArchitecture } from '../../../../src/components/SystemEditor/game/types';

export function architectureCompliant(arch: unknown): boolean {
  const a = arch as {
    nodes?: { id?: unknown; config?: { kind?: unknown } }[];
    edges?: { source?: unknown; target?: unknown }[];
  } | null;
  if (!a || !Array.isArray(a.nodes) || a.nodes.length === 0) return false;
  const nodes = a.nodes
    .filter((n) => n && typeof n.id === 'string' && typeof n.config?.kind === 'string')
    .map((n) => ({ id: n.id as string, kind: n.config!.kind as string }));
  const edges = (Array.isArray(a.edges) ? a.edges : [])
    .filter((e) => e && typeof e.source === 'string' && typeof e.target === 'string')
    .map((e) => ({ source: e.source as string, target: e.target as string }));
  return evaluateCompliance(nodes, edges).ok;
}

export function architectureHash(arch: unknown): string {
  return stableHash(arch);
}

export function architecturesEqual(a: unknown, b: unknown): boolean {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return architectureHash(a) === architectureHash(b);
}

/** Every locked seed node must still exist in the submitted architecture. */
export function lockedNodesPreserved(arch: unknown, lockedNodeIds: string[]): boolean {
  if (!lockedNodeIds.length) return true;
  const nodes = (arch as GameArchitecture | null)?.nodes ?? [];
  const ids = new Set(nodes.map((n) => n.id));
  return lockedNodeIds.every((id) => ids.has(id));
}

export function assertLockedNodesPreserved(arch: unknown, lockedNodeIds: string[]): void {
  if (!lockedNodesPreserved(arch, lockedNodeIds)) {
    throw new HTTPException(409, { message: 'Locked starting components cannot be removed' });
  }
}

export function assertRoundArchitecturePresent(
  snapshot: unknown,
  _roundIndex: number,
): void {
  if (!snapshot) {
    throw new HTTPException(403, { message: 'No architecture snapshot for this round' });
  }
}
