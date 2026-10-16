// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import ThemeToggle from '../ThemeToggle';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import en from '../../../locales/en/namespaces/common.json';
import pt from '../../../locales/pt/namespaces/common.json';

beforeEach(() => {
  localStorage.clear();
});

describe('Common ThemeToggle', () => {
  it.each([
    ['pt', 'Ativar modo escuro', 'Ativar modo claro'],
    ['en', 'Enable dark mode', 'Enable light mode'],
  ])('localizes both accessible labels and tooltips in %s while toggling the real theme', async (language, enableDark, enableLight) => {
    localStorage.setItem('theme', 'light');
    const i18n = createInstance();
    await i18n.init({ lng: language, fallbackLng: false, resources: { en: { translation: { common: en } }, pt: { translation: { common: pt } } } });
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      </I18nextProvider>
    );
    const button = screen.getByRole('button', { name: enableDark });
    expect(button).toHaveAttribute('title', enableDark);
    fireEvent.click(button);
    expect(button).toHaveAccessibleName(enableLight);
    expect(button).toHaveAttribute('title', enableLight);
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
