// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserBadge from '../UserBadge';

describe('UserBadge', () => {
  it('renders the role label', () => {
    render(<UserBadge role="Admin" />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('applies an inline style derived from a custom color', () => {
    render(<UserBadge role="Custom" color="#ff0000" />);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveStyle({ borderColor: '#ff0000' });
  });

  it('uses fallback classes for known legacy roles', () => {
    const { rerender } = render(<UserBadge role="Tutor" />);
    expect(screen.getByText('Tutor').className).toContain('amber');
    rerender(<UserBadge role="Estudante" />);
    expect(screen.getByText('Estudante').className).toContain('blue');
  });
});
