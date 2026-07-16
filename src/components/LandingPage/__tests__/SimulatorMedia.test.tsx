// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SimulatorMedia from '../SimulatorMedia';

vi.mock('framer-motion', () => ({
  useReducedMotion: () => false,
}));

describe('SimulatorMedia', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        disconnect() {}
        unobserve() {}
      },
    );
  });

  it('renders poster before animated asset loads', () => {
    render(<SimulatorMedia base="cache" alt="Cache simulator" />);
    const img = screen.getByRole('img', { name: 'Cache simulator' });
    expect(img).toHaveAttribute('src', '/cache-poster.webp');
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});
