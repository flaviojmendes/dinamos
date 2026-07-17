import { describe, it, expect, vi } from 'vitest';
import { emitGameTelemetry, extractScoreComposition } from '../telemetry.js';

describe('Arena telemetry', () => {
  it('extracts score composition fields from breakdown objects', () => {
    const parts = extractScoreComposition({
      throughput: 10,
      availability: 5,
      latency_penalty: 2,
      cost_penalty: 1,
      streak_bonus: 3,
      non_compliant_sec: 4,
    });
    expect(parts.throughput).toBe(10);
    expect(parts.latencyPenalty).toBe(2);
    expect(parts.nonCompliantSec).toBe(4);
  });

  it('emits structured JSON when telemetry is enabled', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    process.env.ARENA_TELEMETRY = 'true';
    emitGameTelemetry({
      type: 'lifecycle_transition',
      sessionCode: 'TEST',
      fromPhase: 'interval',
      toPhase: 'round',
      lifecycleVersion: 2,
      trigger: 'auto',
    });
    expect(info).toHaveBeenCalled();
    const line = info.mock.calls[0]?.[0] as string;
    expect(JSON.parse(line)).toMatchObject({
      domain: 'arena',
      type: 'lifecycle_transition',
      sessionCode: 'TEST',
    });
    info.mockRestore();
  });
});
