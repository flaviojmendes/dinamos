// Architecture compliance rules for game mode.
//
// The score alone is gameable: a player who deletes everything except a cache
// (or wires clients straight into a database) gets superb latency with none of
// the real-world constraints. These structural rules encode "this must look
// like a real stateful service" and are enforced on both sides:
//   - client: while in violation the player earns no points (penalties still
//     apply) and the streak resets; the banner names the broken rule.
//   - server: score submissions carrying a non-compliant architecture cannot
//     raise the recorded score, so a tampered client gains nothing.
//
// This module is intentionally self-contained (no imports) so the API under
// /server can share it without dragging in engine/React types.

export type ComplianceRuleId =
  | 'client_present'
  | 'database_present'
  | 'service_present'
  | 'path_to_db'
  | 'cache_miss_path'
  | 'no_client_to_db';

/** Display order also reflects how fundamental the rule is. */
export const COMPLIANCE_RULES: ComplianceRuleId[] = [
  'client_present',
  'database_present',
  'service_present',
  'path_to_db',
  'cache_miss_path',
  'no_client_to_db',
];

export interface ComplianceNode {
  id: string;
  kind: string;
}

export interface ComplianceEdge {
  source: string;
  target: string;
}

export interface ComplianceResult {
  ok: boolean;
  violations: ComplianceRuleId[];
}

/** Node kinds that persist state. */
const PERSISTENCE = new Set(['database', 'replicatedDb']);
/** Node kinds that do application work (an autoScaler is a scaled server group). */
const COMPUTE = new Set(['server', 'autoScaler']);
/** Traffic sources. */
const SOURCE = new Set(['client']);

function adjacency(edges: ComplianceEdge[]): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const e of edges) {
    const list = adj.get(e.source);
    if (list) list.push(e.target);
    else adj.set(e.source, [e.target]);
  }
  return adj;
}

/**
 * BFS over the directed graph from `start`. Tracks whether the path so far has
 * passed through a compute node, so callers can require "reaches persistence
 * AND went through the service tier". Each (node, passedCompute) state is
 * visited at most once.
 */
function reaches(
  start: string,
  adj: Map<string, string[]>,
  kinds: Map<string, string>,
  opts: { requireCompute: boolean }
): boolean {
  const seen = new Set<string>();
  const queue: { id: string; viaCompute: boolean }[] = [
    { id: start, viaCompute: false },
  ];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    const key = `${cur.id}|${cur.viaCompute ? 1 : 0}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const kind = kinds.get(cur.id);
    const viaCompute = cur.viaCompute || (kind !== undefined && COMPUTE.has(kind));
    if (
      cur.id !== start &&
      kind !== undefined &&
      PERSISTENCE.has(kind) &&
      (!opts.requireCompute || viaCompute)
    ) {
      return true;
    }
    for (const next of adj.get(cur.id) ?? []) {
      queue.push({ id: next, viaCompute });
    }
  }
  return false;
}

/**
 * Evaluate the house rules against an architecture graph.
 *
 * Rules:
 * - `client_present`: there is at least one traffic source.
 * - `database_present`: the service is stateful; at least one database
 *   (or replicated database) exists.
 * - `service_present`: at least one application server exists; a system made
 *   only of infrastructure glue (caches, LBs) does no real work.
 * - `path_to_db`: every client's traffic can reach a database through the
 *   service tier; you cannot serve everything from the edge.
 * - `cache_miss_path`: every cache has a downstream path to a database; cache
 *   misses must land somewhere real.
 * - `no_client_to_db`: clients never talk to the database directly.
 *
 * Dependent path rules are skipped while their prerequisite entity rules are
 * already failing, so players see the root cause instead of a cascade.
 */
export function evaluateCompliance(
  nodes: ComplianceNode[],
  edges: ComplianceEdge[]
): ComplianceResult {
  const violations: ComplianceRuleId[] = [];
  const kinds = new Map(nodes.map((n) => [n.id, n.kind]));
  const adj = adjacency(edges);

  const clients = nodes.filter((n) => SOURCE.has(n.kind));
  const databases = nodes.filter((n) => PERSISTENCE.has(n.kind));
  const servers = nodes.filter((n) => COMPUTE.has(n.kind));
  const caches = nodes.filter((n) => n.kind === 'cache');

  if (clients.length === 0) violations.push('client_present');
  if (databases.length === 0) violations.push('database_present');
  if (servers.length === 0) violations.push('service_present');

  const prerequisitesMet =
    clients.length > 0 && databases.length > 0 && servers.length > 0;

  if (prerequisitesMet) {
    const allReach = clients.every((c) =>
      reaches(c.id, adj, kinds, { requireCompute: true })
    );
    if (!allReach) violations.push('path_to_db');
  }

  if (databases.length > 0 && caches.length > 0) {
    const allBacked = caches.every((c) =>
      reaches(c.id, adj, kinds, { requireCompute: false })
    );
    if (!allBacked) violations.push('cache_miss_path');
  }

  const direct = edges.some((e) => {
    const s = kinds.get(e.source);
    const t = kinds.get(e.target);
    return s !== undefined && t !== undefined && SOURCE.has(s) && PERSISTENCE.has(t);
  });
  if (direct) violations.push('no_client_to_db');

  return { ok: violations.length === 0, violations };
}
