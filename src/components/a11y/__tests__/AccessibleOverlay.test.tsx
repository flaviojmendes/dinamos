/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AccessibleOverlay from '../AccessibleOverlay';

describe('AccessibleOverlay', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  it('renders a labelled dialog when open', () => {
    render(
      <AccessibleOverlay open title="Round results" onClose={() => {}}>
        <p>Body</p>
      </AccessibleOverlay>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Round results')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(
      <AccessibleOverlay open title="Panel" onClose={onClose}>
        <button type="button">Action</button>
      </AccessibleOverlay>,
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll while open', () => {
    const { unmount } = render(
      <AccessibleOverlay open title="Panel" onClose={() => {}}>
        <p>Body</p>
      </AccessibleOverlay>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
