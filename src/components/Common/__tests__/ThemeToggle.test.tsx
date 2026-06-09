// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';
import { ThemeProvider } from '../../../contexts/ThemeContext';

beforeEach(() => {
  localStorage.clear();
});

describe('Common ThemeToggle', () => {
  it('toggles the theme using the real ThemeProvider', () => {
    localStorage.setItem('theme', 'light');
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Ativar modo escuro');
    fireEvent.click(button);
    expect(button).toHaveAttribute('title', 'Ativar modo claro');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
