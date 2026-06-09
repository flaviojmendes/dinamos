// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const ctx = vi.hoisted(() => ({ theme: 'light', toggleTheme: vi.fn() }));
vi.mock('../../contexts/ThemeContext', () => ({ useTheme: () => ctx }));

import ThemeToggle from '../ThemeToggle';

beforeEach(() => {
  ctx.toggleTheme.mockReset();
});

describe('app ThemeToggle', () => {
  it('shows the dark-mode action when the theme is light', () => {
    ctx.theme = 'light';
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Ativar modo escuro');
  });

  it('shows the light-mode action when the theme is dark', () => {
    ctx.theme = 'dark';
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Ativar modo claro');
  });

  it('calls toggleTheme when clicked', () => {
    ctx.theme = 'light';
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(ctx.toggleTheme).toHaveBeenCalled();
  });
});
