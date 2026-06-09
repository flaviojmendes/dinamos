// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Typewriter } from '../Typewriter';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Typewriter', () => {
  it('types out the text character by character and calls onComplete', () => {
    const onComplete = vi.fn();
    render(<Typewriter text="Hi" speed={10} delay={5} onComplete={onComplete} />);

    // Before the delay elapses nothing is typed.
    expect(screen.queryByText('Hi')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5); // start
    });
    act(() => {
      vi.advanceTimersByTime(10); // 'H'
    });
    act(() => {
      vi.advanceTimersByTime(10); // 'i'
    });
    act(() => {
      vi.advanceTimersByTime(10); // completion effect
    });

    expect(onComplete).toHaveBeenCalled();
  });
});
