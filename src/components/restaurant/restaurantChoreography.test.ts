import { describe, expect, it } from 'vitest';
import { restaurantConcepts } from './learningModel';
import { getLessonVisual, type RestaurantProp } from './visualModel';
import { getRestaurantBeat, restaurantActionNames } from './restaurantChoreography';
import { restaurantPropNames } from './restaurantObjects';

const scripts = Object.values(restaurantConcepts).flatMap((concept) => ([0, 1, 2] as const).map((step) => ({
  slug: concept.slug,
  step,
  focus: concept.steps[step].focus,
  visual: getLessonVisual(concept.slug, step)!,
})));
const food = new Set<RestaurantProp>(['tray', 'ingredient', 'delivery-bag']);
const documents = new Set<RestaurantProp>(['order', 'receipt', 'ledger', 'menu', 'recipe', 'checklist', 'sealed-order']);

describe('physical restaurant choreography', () => {
  it('directs every authored moment with a recognized restaurant object and a bilingual restaurant action', () => {
    expect(scripts).toHaveLength(Object.keys(restaurantConcepts).length * 3);
    for (const { slug, step, focus, visual } of scripts) {
      const context = `${slug}: ${step}`;
      expect(visual, context).toBeDefined();
      expect(Object.prototype.hasOwnProperty.call(restaurantPropNames.en, visual.prop), context).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(restaurantPropNames.pt, visual.prop), context).toBe(true);
      expect([visual.from, visual.to], context).toContain(focus);
      const beat = getRestaurantBeat(visual);
      expect(restaurantActionNames.en[beat.action]?.length, context).toBeGreaterThan(5);
      expect(restaurantActionNames.pt[beat.action]?.length, context).toBeGreaterThan(5);
      expect([1, 2, 3], context).toContain(beat.copies);
      expect(typeof beat.carry, context).toBe('boolean');
    }
  });

  it('caches restaurant information on documents rather than prepared food or ingredient crates', () => {
    const caches = scripts.filter(({ visual }) => visual.cue === 'cache-fill' || visual.cue === 'cache-hit');
    expect(caches.length).toBeGreaterThan(5);
    for (const { slug, step, visual } of caches) {
      expect(documents.has(visual.prop), `${slug}: ${step}`).toBe(true);
      expect(food.has(visual.prop), `${slug}: ${step}`).toBe(false);
      expect(getRestaurantBeat(visual).action).toBe(visual.cue === 'cache-fill' ? 'copy' : 'read');
      if (visual.cue === 'cache-hit') expect(getRestaurantBeat(visual).copies, `${slug}: ${step}`).toBe(1);
      else expect(getRestaurantBeat(visual).copies, `${slug}: ${step}`).toBeGreaterThan(1);
    }
  });

  it('copies, compares and files repeated paperwork without multiplying physical meals', () => {
    const paperworkActions = new Set(['copy', 'compare', 'file-duplicate', 'retry', 'refund', 'approve']);
    for (const { slug, step, visual } of scripts) {
      const beat = getRestaurantBeat(visual);
      if (paperworkActions.has(beat.action) && beat.copies > 1) {
        expect(food.has(visual.prop), `${slug}: ${step}: ${beat.action}`).toBe(false);
      }
      if (visual.cue === 'deduplicate') {
        // Staff file the repeated ticket/receipt, rather than archiving an entire
        // duplicate ledger just because the decision was looked up in that book.
        expect(['order', 'receipt'], `${slug}: ${step}`).toContain(visual.prop);
        expect(beat.action).toBe('file-duplicate');
      }
    }
  });

  it('compensates a reservation or payment document instead of reversing a cooked burger', () => {
    const saga = getLessonVisual('consistency-strategies/saga', 2)!;
    expect(saga.cue).toBe('compensate');
    expect(documents.has(saga.prop)).toBe(true);
    expect(food.has(saga.prop)).toBe(false);
    expect(getRestaurantBeat(saga)).toMatchObject({ action: 'refund', stamp: 'refunded', carry: true });
  });

  it('keeps the CAP passage closed while permitting a final local ledger read', () => {
    for (const step of [0, 1, 2] as const) {
      expect(getLessonVisual('theoretical-foundations/cap-theorem', step)?.fault).toBe('branch');
    }
    const remoteWait = getLessonVisual('theoretical-foundations/cap-theorem', 1)!;
    expect(remoteWait.blocked).toBe(true);
    expect(getRestaurantBeat(remoteWait).action).toBe('hold');
    const localRead = getLessonVisual('theoretical-foundations/cap-theorem', 2)!;
    expect(localRead.from).toBe('branch');
    expect(localRead.to).toBe('branch');
    expect(localRead.blocked).not.toBe(true);
    expect(documents.has(localRead.prop)).toBe(true);
    expect(getRestaurantBeat(localRead)).toMatchObject({ action: 'read', copies: 1, carry: false });
  });

  it('does not stamp a proposed vote as an already committed agreement', () => {
    const proposal = getLessonVisual('theoretical-foundations/flp-impossibility', 0)!;
    expect(proposal.cue).toBe('vote');
    expect(getRestaurantBeat(proposal).stamp).toBeUndefined();
    for (const { slug, step, visual } of scripts.filter(({ visual }) => visual.cue === 'vote')) {
      expect(getRestaurantBeat(visual).stamp, `${slug}: ${step}`).toBeUndefined();
    }
    const committedDecision = getLessonVisual('consistency-strategies/two-phase-commit', 1)!;
    expect(committedDecision.cue).toBe('commit');
    expect(getRestaurantBeat(committedDecision).stamp).toBe('approved');
  });
});
