// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import en from '../../../locales/en/namespaces/common.json';
import pt from '../../../locales/pt/namespaces/common.json';

const ctx = vi.hoisted(() => ({ theme: 'light', toggleTheme: vi.fn() }));
vi.mock('../../contexts/ThemeContext', () => ({ useTheme: () => ctx }));

import ThemeToggle from '../ThemeToggle';

async function renderToggle(language: string) {
  const i18n = createInstance();
  await i18n.init({ lng: language, fallbackLng: false, resources: { en: { translation: { common: en } }, pt: { translation: { common: pt } } } });
  render(<I18nextProvider i18n={i18n}><ThemeToggle /></I18nextProvider>);
}

beforeEach(() => {
  ctx.toggleTheme.mockReset();
});

describe('app ThemeToggle', () => {
  it.each([
    ['pt', 'light', 'Ativar modo escuro'],
    ['pt', 'dark', 'Ativar modo claro'],
    ['en', 'light', 'Enable dark mode'],
    ['en', 'dark', 'Enable light mode'],
  ])('localizes its action for %s in the %s theme', async (language, theme, label) => {
    ctx.theme = theme;
    await renderToggle(language);
    expect(screen.getByRole('button', { name: label })).toHaveAttribute('title', label);
  });

  it('calls toggleTheme when clicked', async () => {
    ctx.theme = 'light';
    await renderToggle('pt');
    fireEvent.click(screen.getByRole('button', { name: 'Ativar modo escuro' }));
    expect(ctx.toggleTheme).toHaveBeenCalled();
  });
});
