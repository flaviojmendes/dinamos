// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const translate = vi.hoisted(() => (key: string) => key);
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: translate }) }));
vi.mock('../../simulation', () => ({
  useSimulationMotion: () => ({ reducedMotion: true, transition: { duration: 0 }, duration: () => 0 }),
  SimulationActivity: () => null,
  FlowLink: () => null,
}));
vi.mock('../../AISystems/motion', () => ({
  AnimatedMetric: ({ value, label }: { value: number; label: string }) => <div role="group" aria-label={label}><output>{value}</output></div>,
}));
vi.mock('../../simulators/teaching', () => ({ NarrationBar: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));

import PollingWebhooks from '../PollingWebhooks';
import BloomFilterSimulator from '../../DataStorage/BloomFilterSimulator';
import MessageQueue from '../../MessageQueue/MessageQueue';

const metric = (name: string) => within(screen.getByRole('group', { name })).getByRole('status');
const advance = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe('simulator operation lifecycle', () => {
  it('delivers a webhook after starting and cancels pending deliveries on reset', () => {
    render(<MemoryRouter><PollingWebhooks /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'simulators.polling_webhooks.buttons.webhook' }));
    fireEvent.click(screen.getByRole('button', { name: 'simulators.polling_webhooks.buttons.start' }));
    advance(200);
    expect(metric('simulators.polling_webhooks.stats.webhooks_sent')).toHaveTextContent('1');
    advance(7800);
    fireEvent.click(screen.getByRole('button', { name: 'simulators.polling_webhooks.buttons.reset' }));
    advance(1000);
    expect(metric('simulators.polling_webhooks.stats.webhooks_sent')).toHaveTextContent('0');
    expect(metric('simulators.polling_webhooks.stats.data_transfers')).toHaveTextContent('0');
  });

  it('stops polling when paused and resumes a single polling timer', () => {
    render(<MemoryRouter><PollingWebhooks /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'simulators.polling_webhooks.buttons.start' }));
    expect(metric('simulators.polling_webhooks.stats.total_requests')).toHaveTextContent('1');
    fireEvent.click(screen.getByRole('button', { name: 'simulators.polling_webhooks.buttons.stop' }));
    advance(10000);
    expect(metric('simulators.polling_webhooks.stats.total_requests')).toHaveTextContent('1');
    fireEvent.click(screen.getByRole('button', { name: 'simulators.polling_webhooks.buttons.start' }));
    advance(3000);
    expect(metric('simulators.polling_webhooks.stats.total_requests')).toHaveTextContent('3');
  });

  it('maps every Bloom hash to a valid bit and resets the bitset when its hash count changes', () => {
    render(<BloomFilterSimulator />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'alpha' } });
    fireEvent.click(screen.getByRole('button', { name: 'simulators.bloom_filter.buttons.add' }));
    // alpha's third derived hash used to be negative and missed the visible bit array.
    const chips = screen.getAllByText(/^h\d→/).map(element => element.textContent ?? '');
    expect(chips).toHaveLength(3);
    expect(chips.every(text => Number(text.split('→')[1]) >= 0 && Number(text.split('→')[1]) < 48)).toBe(true);
    expect(metric('simulators.bloom_filter.metrics.items')).toHaveTextContent('1');
    fireEvent.change(screen.getAllByRole('slider')[1], { target: { value: '4' } });
    expect(metric('simulators.bloom_filter.metrics.items')).toHaveTextContent('0');
    expect(metric('simulators.bloom_filter.metrics.bits_set')).toHaveTextContent('0');
  });

  it('lets simultaneous consumers claim distinct queue messages', () => {
    render(<MessageQueue />);
    fireEvent.click(screen.getByRole('button', { name: 'simulators.message_queue_sim.buttons.configure' }));
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '5' } });
    fireEvent.change(sliders[3], { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: 'simulators.message_queue_sim.buttons.start' }));
    advance(1000);
    advance(300);
    advance(200);
    advance(500);
    expect(metric('simulators.message_queue_sim.queue_status.processed')).toHaveTextContent('5');
  });

  it('counts in-flight messages against queue capacity and prevents enqueues after reset', () => {
    render(<MessageQueue />);
    fireEvent.click(screen.getByRole('button', { name: 'simulators.message_queue_sim.buttons.configure' }));
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '5' } });
    fireEvent.change(sliders[1], { target: { value: '500' } });
    fireEvent.change(sliders[2], { target: { value: '5' } });
    fireEvent.change(sliders[4], { target: { value: '5000' } });
    fireEvent.click(screen.getByRole('button', { name: 'simulators.message_queue_sim.buttons.start' }));
    advance(500);
    advance(300);
    advance(200);
    expect(metric('simulators.message_queue_sim.queue_status.produced')).toHaveTextContent('5');
    expect(metric('simulators.message_queue_sim.queue_status.dropped')).toHaveTextContent('5');
    fireEvent.click(screen.getByRole('button', { name: 'simulators.message_queue_sim.buttons.reset' }));
    fireEvent.click(screen.getByRole('button', { name: 'simulators.message_queue_sim.buttons.start' }));
    advance(500);
    fireEvent.click(screen.getByRole('button', { name: 'simulators.message_queue_sim.buttons.reset' }));
    advance(1000);
    expect(metric('simulators.message_queue_sim.queue_status.produced')).toHaveTextContent('0');
    expect(screen.getByText('0 / 5')).toBeInTheDocument();
  });
});
