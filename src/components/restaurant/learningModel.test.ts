import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  getConcept,
  getRestaurantProgress,
  restaurantConcepts,
  restaurantStages,
  type SceneMode,
  type Station,
} from './learningModel';

const manifest = JSON.parse(readFileSync(new URL('../../../public/content/manifest.json', import.meta.url), 'utf8')) as {
  pages: { slug: string; path: string; titleEn: string; titlePt: string }[];
};
const pages = manifest.pages;
const completedThrough = (count: number) => Object.fromEntries(pages.slice(0, count).map((page) => [page.path, { completed: true }]));

describe('restaurant curriculum', () => {
  it('gives every published lesson an explicit scene with the correct title and route', () => {
    expect(Object.keys(restaurantConcepts).sort()).toEqual(pages.map((page) => page.slug).sort());
    for (const page of pages) {
      const concept = getConcept(page.slug)!;
      expect(concept, page.slug).toBeDefined();
      expect(concept.path, page.slug).toBe(page.path);
      expect(concept.title).toEqual({ en: page.titleEn, pt: page.titlePt });
    }
    expect(getConcept('future-lesson')).toBeUndefined();
    expect(getConcept('toString')).toBeUndefined();
    expect(getConcept('__proto__')).toBeUndefined();
  });

  it('provides three distinct, fully bilingual moments per concept with supported physical targets', () => {
    const modes: SceneMode[] = ['counter', 'queue', 'routing', 'cache', 'storage', 'replication', 'consensus', 'network', 'saga', 'security', 'observability', 'scaling', 'ai', 'delivery', 'recovery', 'events'];
    const stations: Station[] = ['entrance', 'counter', 'kitchen', 'pickup', 'stock', 'branch', 'dispatch', 'terminal'];
    const allDescriptions = { en: new Set<string>(), pt: new Set<string>() };
    for (const concept of Object.values(restaurantConcepts)) {
      expect(modes).toContain(concept.mode);
      expect(stations).toContain(concept.station);
      expect(concept.steps, concept.slug).toHaveLength(3);
      for (const locale of ['en', 'pt'] as const) {
        expect(concept.improvement[locale].length).toBeGreaterThan(30);
        expect(new Set(concept.steps.map((step) => step.title[locale])).size, concept.slug).toBe(3);
        expect(new Set(concept.steps.map((step) => step.description[locale])).size, concept.slug).toBe(3);
        for (const step of concept.steps) {
          expect(step.title[locale].trim().length).toBeGreaterThan(4);
          expect(step.description[locale].trim().length).toBeGreaterThan(35);
          expect(stations).toContain(step.focus);
          allDescriptions[locale].add(step.description[locale]);
        }
      }
      expect(concept.improvement.en).not.toBe(concept.improvement.pt);
      concept.steps.forEach((step) => {
        expect(step.title.en).not.toBe(step.title.pt);
        expect(step.description.en).not.toBe(step.description.pt);
      });
    }
    expect(allDescriptions.en.size).toBe(pages.length * 3);
    expect(allDescriptions.pt.size).toBe(pages.length * 3);
  });
});

describe('restaurant progress from completed lessons', () => {
  it('starts with a usable counter and kitchen and handles an empty index', () => {
    expect(getRestaurantProgress([], { '/intro': { completed: true } })).toEqual({
      level: 1, completed: 0, total: 0, percent: 0, nextTarget: null,
      unlockedStations: ['entrance', 'counter', 'kitchen'],
    });
    expect(getRestaurantProgress(pages, {}).nextTarget).toBe(4);
  });

  it('unlocks each stage at the actual rounded-up completion threshold', () => {
    for (const stage of restaurantStages.slice(1)) {
      const target = Math.ceil((pages.length * stage.threshold) / 100);
      const before = getRestaurantProgress(pages, completedThrough(target - 1));
      const after = getRestaurantProgress(pages, completedThrough(target));
      expect(before.level, stage.title.en).toBe(stage.level - 1);
      expect(before.nextTarget).toBe(target);
      expect(after.level, stage.title.en).toBe(stage.level);
      expect(after.completed).toBe(target);
    }
    const finished = getRestaurantProgress(pages, completedThrough(pages.length));
    expect(finished).toMatchObject({ level: 6, completed: 121, total: 121, percent: 100, nextTarget: null });
    expect(finished.unlockedStations).toHaveLength(8);
    expect(new Set(finished.unlockedStations).size).toBe(8);
  });

  it('ignores stale, tool, simulator, unknown and forged path completions and duplicate index entries', () => {
    const progress = {
      '/intro': { completed: true },
      '/editor': { completed: true },
      '/simuladores/cache': { completed: true },
      '/componentes': { completed: true }, // A real module lesson, absent from this current index.
      '/unknown': { completed: true },
      '/sistemas-distribuidos-101': { completed: false },
    };
    const currentIndex = [pages[0], pages[0], pages[1],
      { slug: 'intro', path: '/editor' },
      { slug: 'simulador-cache', path: '/simuladores/cache' },
      { slug: 'unknown', path: '/unknown' },
    ];
    expect(getRestaurantProgress(currentIndex, progress)).toMatchObject({ completed: 1, total: 2, percent: 50, level: 4 });
    expect(getRestaurantProgress([pages[1]], progress)).toMatchObject({ completed: 0, total: 1, percent: 0, level: 1 });
  });

  it('uses the current course size and reverses unlocks when a lesson is marked incomplete', () => {
    const currentPages = pages.slice(0, 4);
    const progress = { '/intro': { completed: true } };
    expect(getRestaurantProgress(currentPages, progress)).toMatchObject({ total: 4, completed: 1, percent: 25, level: 3, nextTarget: 2 });
    progress['/intro'].completed = false;
    expect(getRestaurantProgress(currentPages, progress)).toMatchObject({ completed: 0, percent: 0, level: 1, nextTarget: 1 });
  });

  it('derives the same state on repeated views without awarding progress for a demonstration', () => {
    const progress = completedThrough(15);
    const before = structuredClone(progress);
    const first = getRestaurantProgress(pages, progress);
    getConcept('components/cache')!.steps.forEach(() => getRestaurantProgress(pages, progress));
    expect(getRestaurantProgress(pages, progress)).toEqual(first);
    expect(progress).toEqual(before);
  });
});
