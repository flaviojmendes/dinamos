import { describe, it, expect, beforeAll } from 'vitest';
import i18n, { changeAppLanguage, loadLocale, whenI18nReady } from '../i18n';

describe('i18n locale loading', () => {
  beforeAll(async () => { await whenI18nReady(); });

  it('loads bootstrap labels for both supported locales', async () => {
    await Promise.all([loadLocale('en'), loadLocale('pt')]);
    for (const lng of ['en', 'pt']) {
      for (const key of ['landing.hero_title', 'common.start_now', 'content.burger_analogy_title']) {
        expect(i18n.t(key, { lng })).not.toBe(key);
      }
    }
  });

  it('normalizes regional choices and loads simulator resources before switching', async () => {
    expect(await changeAppLanguage('en-US')).toBe(true);
    expect(i18n.language).toBe('en');
    expect(i18n.t('editor.node.breaker_state.open')).toBe('Open');
    expect(await changeAppLanguage('pt-BR')).toBe(true);
    expect(i18n.language).toBe('pt');
    expect(i18n.t('editor.node.breaker_state.open')).toBe('Aberto');
  });

  it('does not substitute Portuguese for a missing English resource', async () => {
    i18n.addResource('pt', 'translation', 'regression.portuguese_only', 'Somente português');
    await changeAppLanguage('en');
    expect(i18n.t('regression.portuguese_only')).toBe('regression.portuguese_only');
  });

  it('keeps the most recent language choice when loads overlap', async () => {
    const first = changeAppLanguage('en');
    const latest = changeAppLanguage('pt');
    expect(await first).toBe(false);
    expect(await latest).toBe(true);
    expect(i18n.language).toBe('pt');
  });
});
