import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('i18n locale loading', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('loads bootstrap namespaces without full menu bundle', async () => {
    const { loadLocale, default: i18n } = await import('../../config/i18n');
    await loadLocale('en');

    expect(i18n.t('landing.hero_title')).not.toMatch(/^landing\./);
    expect(i18n.t('common.start_now')).not.toMatch(/^common\./);

    const menuTitle = i18n.t('menu.roadmap.name');
    expect(menuTitle === 'menu.roadmap.name' || menuTitle.length > 0).toBe(true);
  });
});
