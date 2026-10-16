// @vitest-environment jsdom
import type { ReactNode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('framer-motion', () => ({
  motion: { div: ({ children, initial, animate, exit, transition, layout, ...props }: Record<string, unknown> & { children?: ReactNode }) => <div {...props}>{children}</div> },
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
}));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('../../AISystems/motion', () => ({
  AnimatedMetric: ({ value, label }: { value: number; label: string }) => <output aria-label={label}>{value}</output>,
}));
vi.mock('../../simulation', () => ({
  useSimulationMotion: () => ({ reducedMotion: true, transition: { duration: 0 } }),
  SimulationActivity: () => null,
  FlowLink: () => null,
}));

import RateLimiter from '../RateLimiter';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

async function tick(seconds: number) {
  // Flush every refill tick, so React re-renders between generator deadlines.
  for (let i = 0; i < seconds * 10; i++) await act(() => vi.advanceTimersByTime(100));
}

describe('rate limiter traffic', () => {
  it('keeps generating traffic while the 100ms refill updates the bucket', async () => {
    render(<RateLimiter />);
    fireEvent.click(screen.getByRole('button', { name: 'simulators.rate_limiter.buttons.start' }));
    await tick(1);
    expect(screen.getByLabelText('simulators.rate_limiter.metrics.total')).toHaveTextContent('8');
    await tick(1);
    expect(screen.getByLabelText('simulators.rate_limiter.metrics.total')).toHaveTextContent('16');
    await tick(2);
    expect(screen.getByLabelText('simulators.rate_limiter.metrics.total')).toHaveTextContent('32');
    expect(screen.getByLabelText('simulators.rate_limiter.metrics.rejected')).not.toHaveTextContent(/^0$/);
  });

  it('stops both traffic and refill when paused, then resets all telemetry', async () => {
    render(<RateLimiter />);
    fireEvent.click(screen.getByRole('button', { name: 'simulators.rate_limiter.buttons.start' }));
    await tick(1);
    fireEvent.click(screen.getByRole('button', { name: 'simulators.rate_limiter.buttons.stop' }));
    await tick(1);
    expect(screen.getByLabelText('simulators.rate_limiter.metrics.total')).toHaveTextContent('8');
    fireEvent.click(screen.getByRole('button', { name: 'simulators.rate_limiter.buttons.reset' }));
    expect(screen.getByLabelText('simulators.rate_limiter.metrics.total')).toHaveTextContent('0');
    expect(screen.getByLabelText('simulators.rate_limiter.metrics.accepted')).toHaveTextContent('0');
  });
});
