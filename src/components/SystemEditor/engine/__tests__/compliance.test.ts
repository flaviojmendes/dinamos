import { describe, it, expect } from 'vitest';
import { evaluateCompliance, ComplianceNode, ComplianceEdge } from '../compliance';
import { PRESETS } from '../scenarios';
import { MATCH_SCENARIOS } from '../../game/matchScenarios';

function n(id: string, kind: string): ComplianceNode {
  return { id, kind };
}
function e(source: string, target: string): ComplianceEdge {
  return { source, target };
}

/** client → lb → server → db: the canonical compliant shape. */
const GOOD_NODES = [n('c', 'client'), n('lb', 'loadBalancer'), n('s', 'server'), n('db', 'database')];
const GOOD_EDGES = [e('c', 'lb'), e('lb', 's'), e('s', 'db')];

describe('evaluateCompliance', () => {
  it('accepts a classic three-tier system', () => {
    const r = evaluateCompliance(GOOD_NODES, GOOD_EDGES);
    expect(r.ok).toBe(true);
    expect(r.violations).toEqual([]);
  });

  it('flags a missing traffic source', () => {
    const r = evaluateCompliance(
      [n('s', 'server'), n('db', 'database')],
      [e('s', 'db')]
    );
    expect(r.ok).toBe(false);
    expect(r.violations).toContain('client_present');
  });

  it('flags the database-only cheat', () => {
    const r = evaluateCompliance([n('c', 'client'), n('db', 'database')], [e('c', 'db')]);
    expect(r.ok).toBe(false);
    expect(r.violations).toContain('service_present');
    expect(r.violations).toContain('no_client_to_db');
  });

  it('flags the cache-only cheat (stateless system)', () => {
    const r = evaluateCompliance(
      [n('c', 'client'), n('cache', 'cache')],
      [e('c', 'cache')]
    );
    expect(r.ok).toBe(false);
    expect(r.violations).toContain('database_present');
    expect(r.violations).toContain('service_present');
  });

  it('flags a client that cannot reach a database through the service tier', () => {
    // The server exists but is disconnected; the client dead-ends in a cache.
    const r = evaluateCompliance(
      [n('c', 'client'), n('cache', 'cache'), n('s', 'server'), n('db', 'database')],
      [e('c', 'cache'), e('s', 'db')]
    );
    expect(r.ok).toBe(false);
    expect(r.violations).toContain('path_to_db');
  });

  it('rejects a path that skips the service tier (client → cache → db)', () => {
    const r = evaluateCompliance(
      [n('c', 'client'), n('cache', 'cache'), n('s', 'server'), n('db', 'database')],
      [e('c', 'cache'), e('cache', 'db'), e('s', 'db')]
    );
    expect(r.ok).toBe(false);
    expect(r.violations).toContain('path_to_db');
  });

  it('flags a cache with no miss path to a database', () => {
    const r = evaluateCompliance(
      [...GOOD_NODES, n('cache', 'cache')],
      [...GOOD_EDGES, e('s', 'cache')]
    );
    expect(r.ok).toBe(false);
    expect(r.violations).toEqual(['cache_miss_path']);
  });

  it('accepts a cache that forwards misses to the database', () => {
    const r = evaluateCompliance(
      [n('c', 'client'), n('s', 'server'), n('cache', 'cache'), n('db', 'database')],
      [e('c', 's'), e('s', 'cache'), e('cache', 'db')]
    );
    expect(r.ok).toBe(true);
  });

  it('flags a direct client → database edge even when a valid path exists', () => {
    const r = evaluateCompliance(GOOD_NODES, [...GOOD_EDGES, e('c', 'db')]);
    expect(r.ok).toBe(false);
    expect(r.violations).toEqual(['no_client_to_db']);
  });

  it('accepts replicated databases as persistence', () => {
    const r = evaluateCompliance(
      [n('c', 'client'), n('s', 'server'), n('db', 'replicatedDb')],
      [e('c', 's'), e('s', 'db')]
    );
    expect(r.ok).toBe(true);
  });

  it('skips path rules while entity prerequisites are failing (no cascade)', () => {
    const r = evaluateCompliance([n('c', 'client')], []);
    expect(r.violations).toEqual(['database_present', 'service_present']);
  });

  it('flags an empty canvas', () => {
    const r = evaluateCompliance([], []);
    expect(r.ok).toBe(false);
  });

  // Players must never start a match already in violation.
  it('accepts every preset used by the match scenarios', () => {
    for (const scenario of MATCH_SCENARIOS) {
      const preset = PRESETS.find((p) => p.id === scenario.presetId);
      expect(preset, `preset ${scenario.presetId} exists`).toBeDefined();
      const r = evaluateCompliance(
        preset!.nodes.map((pn) => ({ id: pn.config.id, kind: pn.config.kind })),
        preset!.edges.map((ed) => ({ source: ed.source, target: ed.target }))
      );
      expect(r.violations, `${scenario.presetId} should be compliant`).toEqual([]);
    }
  });
});
