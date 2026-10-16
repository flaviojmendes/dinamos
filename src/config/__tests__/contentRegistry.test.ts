import { afterEach, describe, expect, it } from 'vitest';
import { setRegistryLessons, titleForPath } from '../contentRegistry';

afterEach(() => {
  setRegistryLessons([]);
});

describe('localized registry titles', () => {
  it('uses the requested locale, including regional locale tags and a language switch', () => {
    setRegistryLessons([{
      slug: 'theory/example',
      path: '/theory/example',
      moduleId: 'theory',
      titleEn: '  Distributed Orders  ',
      titlePt: '  Pedidos Distribuídos  ',
    }]);

    expect(titleForPath('/theory/example', 'pt-BR')).toBe('Pedidos Distribuídos');
    expect(titleForPath('/theory/example', 'en-GB')).toBe('Distributed Orders');
    expect(titleForPath('/theory/example', 'PT-pt')).toBe('Pedidos Distribuídos');
  });

  it.each([
    { lang: 'en', titleEn: null, titlePt: 'Apenas português' },
    { lang: 'en-GB', titleEn: '   ', titlePt: 'Apenas português' },
    { lang: 'pt', titleEn: 'English only', titlePt: null },
    { lang: 'pt-BR', titleEn: 'English only', titlePt: '   ' },
  ])('lets the caller localize a missing $lang title instead of exposing the other language', ({ lang, titleEn, titlePt }) => {
    setRegistryLessons([{
      slug: 'theory/example',
      path: '/theory/example',
      moduleId: 'theory',
      titleEn,
      titlePt,
    }]);

    expect(titleForPath('/theory/example', lang)).toBeUndefined();
  });
});
