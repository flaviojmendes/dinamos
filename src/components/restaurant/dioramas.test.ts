import { describe, expect, it } from 'vitest';
import { restaurantConcepts } from './learningModel';
import { getLessonDiorama, kits, lessonDioramas, localize, normalizeUnit } from './dioramas';

describe('lesson dioramas', () => {
  it('stages every lesson in a themed kit with three authored moments', () => {
    expect(Object.keys(lessonDioramas).sort()).toEqual(Object.keys(restaurantConcepts).sort());
    for (const slug of Object.keys(restaurantConcepts)) {
      const diorama = getLessonDiorama(slug)!;
      expect(diorama, slug).toBeDefined();
      expect(kits[diorama.kit], slug).toBeDefined();
      expect(diorama.steps, slug).toHaveLength(3);
      expect(diorama.board.pt.trim(), slug).not.toBe('');
      expect(diorama.board.en.trim(), slug).not.toBe('');
    }
  });

  it('only uses flags, units and counts that the chosen kit can show', () => {
    for (const [slug, diorama] of Object.entries(lessonDioramas)) {
      const kit = kits[diorama.kit];
      if (diorama.branch !== undefined) expect(diorama.branch, slug).toBeLessThan(kit.units);
      diorama.steps.forEach((set, step) => {
        const context = `${slug}: ${step}`;
        for (const flag of set.flags ?? []) expect(kit.flags, context).toContain(flag);
        expect((set.units ?? []).length, context).toBeLessThanOrEqual(kit.units);
        if (set.count !== undefined) {
          expect(set.count, context).toBeGreaterThanOrEqual(0);
          expect(set.count, context).toBeLessThanOrEqual(kit.units);
        }
        if (set.gauge !== undefined) {
          expect(set.gauge, context).toBeGreaterThanOrEqual(0);
          expect(set.gauge, context).toBeLessThanOrEqual(1);
        }
      });
    }
  });

  it('normalizes unit shorthands and localizes tags', () => {
    expect(normalizeUnit(null)).toEqual({});
    expect(normalizeUnit('v2')).toEqual({ tag: 'v2' });
    expect(normalizeUnit({ pt: 'reservado', en: 'reserved' })).toEqual({ tag: { pt: 'reservado', en: 'reserved' } });
    expect(normalizeUnit({ mark: 'yes' })).toEqual({ mark: 'yes' });
    expect(localize({ pt: 'Filial', en: 'Branch' }, 'en')).toBe('Branch');
    expect(getLessonDiorama('constructor')).toBeUndefined();
  });
});
