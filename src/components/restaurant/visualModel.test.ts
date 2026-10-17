import { describe, expect, it } from 'vitest';
import { restaurantConcepts, type Station } from './learningModel';
import { getLessonVisual, lessonVisualScripts, type VisualCue } from './visualModel';

describe('lesson-specific visual choreography', () => {
  it('authors all three moments for every known lesson and keeps the narration focus on the route', () => {
    expect(Object.keys(lessonVisualScripts).sort()).toEqual(Object.keys(restaurantConcepts).sort());
    const stations: Station[] = ['entrance', 'counter', 'kitchen', 'pickup', 'stock', 'branch', 'dispatch', 'terminal'];
    const cues: VisualCue[] = ['flow', 'queue', 'cache-hit', 'cache-fill', 'write', 'replicate', 'vote', 'commit', 'partition', 'wait', 'stale-read', 'reject', 'compensate', 'retry', 'recover', 'inspect', 'scale', 'retrieve', 'answer', 'merge', 'filter', 'deduplicate'];
    for (const concept of Object.values(restaurantConcepts)) {
      expect(lessonVisualScripts[concept.slug]).toHaveLength(3);
      for (const step of [0, 1, 2] as const) {
        const visual = getLessonVisual(concept.slug, step)!;
        const context = `${concept.slug}: ${step}`;
        expect(visual, context).toBeDefined();
        expect(stations, context).toContain(visual.from);
        expect(stations, context).toContain(visual.to);
        expect(cues, context).toContain(visual.cue);
        expect([visual.from, visual.to], context).toContain(concept.steps[step].focus);
        if (visual.fault) expect(stations, context).toContain(visual.fault);
        if (visual.queueDepth !== undefined) {
          expect(Number.isInteger(visual.queueDepth), context).toBe(true);
          expect(visual.queueDepth, context).toBeGreaterThanOrEqual(0);
          expect(visual.queueDepth, context).toBeLessThanOrEqual(7);
        }
      }
    }
  });

  it('retains the partition when CAP compares unavailable coordination with an available local stale read', () => {
    const slug = 'theoretical-foundations/cap-theorem';
    for (const step of [0, 1, 2] as const) expect(getLessonVisual(slug, step)?.fault).toBe('branch');
    expect(getLessonVisual(slug, 0)).toMatchObject({ cue: 'partition', blocked: true });
    expect(getLessonVisual(slug, 1)).toMatchObject({ cue: 'wait', blocked: true });
    expect(getLessonVisual(slug, 2)).toMatchObject({ from: 'branch', to: 'branch', cue: 'stale-read', fault: 'branch' });
  });

  it('places each network failure at the narrated moment instead of always failing the second step', () => {
    expect(getLessonVisual('distributed-systems-101', 1)).toMatchObject({ from: 'counter', to: 'kitchen', cue: 'flow' });
    expect(getLessonVisual('distributed-systems-101', 2)).toMatchObject({ cue: 'partition', fault: 'branch', blocked: true });
    expect(getLessonVisual('theoretical-foundations/network-partitions', 0)).toMatchObject({ cue: 'partition', fault: 'branch' });
    expect(getLessonVisual('theoretical-foundations/network-partitions', 1)).toMatchObject({ cue: 'write', fault: 'branch' });
    expect(getLessonVisual('theoretical-foundations/network-partitions', 2)).toMatchObject({ cue: 'recover' });
    expect(getLessonVisual('theoretical-foundations/network-partitions', 2)?.fault).toBeUndefined();
    expect(getLessonVisual('theoretical-foundations/pacelc', 2)).toMatchObject({ cue: 'partition', fault: 'branch' });
  });

  it('validates successful authentication, tokens and TLS without inventing rejected requests', () => {
    for (const slug of ['security/authentication', 'security/tokens', 'security/ssl-tls']) {
      for (const step of [0, 1, 2] as const) {
        const visual = getLessonVisual(slug, step)!;
        expect(visual.blocked, `${slug}: ${step}`).not.toBe(true);
        expect(visual.fault, `${slug}: ${step}`).toBeUndefined();
        expect(visual.cue, `${slug}: ${step}`).not.toBe('reject');
      }
    }
    expect(getLessonVisual('components/firewall', 1)).toMatchObject({ cue: 'reject', blocked: true, to: 'stock' });
    expect(getLessonVisual('security/common-attacks', 1)).toMatchObject({ cue: 'reject', blocked: true });
  });

  it('distinguishes transactional preparation and waiting from saga failure and compensating work', () => {
    const twoPhase = 'consistency-strategies/two-phase-commit';
    expect(getLessonVisual(twoPhase, 0)).toMatchObject({ cue: 'vote', peers: true });
    expect(getLessonVisual(twoPhase, 1)).toMatchObject({ cue: 'commit', prop: 'ledger' });
    expect(getLessonVisual(twoPhase, 1)?.blocked).not.toBe(true);
    expect(getLessonVisual(twoPhase, 1)?.fault).toBeUndefined();
    expect(getLessonVisual(twoPhase, 2)).toMatchObject({ cue: 'wait', blocked: true });
    expect(getLessonVisual('consistency-strategies/saga', 1)).toMatchObject({ cue: 'reject', blocked: true, fault: 'dispatch' });
    expect(getLessonVisual('consistency-strategies/saga', 2)).toMatchObject({ cue: 'compensate' });
  });

  it('demonstrates digital cache and acknowledgement semantics without substituting physical food delivery', () => {
    expect(getLessonVisual('components/cache', 0)).toMatchObject({ from: 'stock', to: 'counter', cue: 'cache-fill' });
    expect(getLessonVisual('components/cache', 1)).toMatchObject({ cue: 'cache-hit' });
    expect(getLessonVisual('components/cache', 2)).toMatchObject({ from: 'stock', to: 'pickup', cue: 'filter' });
    const delivery = 'consistency-strategies/delivery-semantics';
    expect(getLessonVisual(delivery, 0)).toMatchObject({ cue: 'wait', from: 'kitchen', to: 'counter', blocked: true });
    expect(getLessonVisual(delivery, 1)).toMatchObject({ cue: 'retry', from: 'counter', to: 'kitchen' });
    expect(getLessonVisual(delivery, 2)).toMatchObject({ cue: 'deduplicate', to: 'stock' });
    for (const step of [0, 1, 2] as const) {
      expect([getLessonVisual(delivery, step)?.from, getLessonVisual(delivery, step)?.to]).not.toContain('dispatch');
    }
  });

  it('models draining backpressure, protected commits and horizontal versus vertical resource growth', () => {
    const fullRail = getLessonVisual('design-principles/backpressure', 1)!;
    const resumedRail = getLessonVisual('design-principles/backpressure', 2)!;
    expect(fullRail).toMatchObject({ cue: 'wait', blocked: true });
    expect(resumedRail.cue).toBe('flow');
    expect(fullRail.queueDepth).toBeGreaterThan(0);
    expect(resumedRail.queueDepth).toBeLessThan(fullRail.queueDepth!);
    expect(getLessonVisual('design-principles/outbox', 0)).toMatchObject({ from: 'counter', to: 'stock', cue: 'commit' });
    expect(getLessonVisual('design-principles/outbox', 2)?.cue).toBe('deduplicate');
    expect(getLessonVisual('design-principles/horizontal-scaling', 0)).toMatchObject({ cue: 'scale', peers: true });
    expect(getLessonVisual('design-principles/vertical-scaling', 1)).toMatchObject({ from: 'terminal', to: 'kitchen', cue: 'scale' });
    expect(getLessonVisual('components/kubernetes', 1)).toMatchObject({ cue: 'scale', peers: true });
    expect(getLessonVisual('ai-systems/gpu-autoscaling', 1)).toMatchObject({ cue: 'scale', peers: true });
    expect(getLessonVisual('consistency-strategies/distributed-locks', 2)).toMatchObject({ cue: 'reject', blocked: true, to: 'stock' });
  });

  it('does not manufacture a generic demonstration for an unknown or inherited catalog key', () => {
    expect(getLessonVisual('future-lesson', 0)).toBeUndefined();
    expect(getLessonVisual('constructor', 1)).toBeUndefined();
    expect(getLessonVisual('__proto__', 2)).toBeUndefined();
  });
});
