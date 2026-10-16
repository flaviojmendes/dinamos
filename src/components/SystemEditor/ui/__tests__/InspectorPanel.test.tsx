// @vitest-environment jsdom
import { beforeAll, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import InspectorPanel from '../InspectorPanel';
import { defaultsForKind, type NodeConfig } from '../../engine/types';
import editor from '../../../../locales/en/namespaces/editor.json';

const i18n = createInstance();
beforeAll(async () => {
  await i18n.init({ lng: 'en', fallbackLng: 'en', resources: { en: { translation: { editor } } }, interpolation: { escapeValue: false } });
});

function mount(config: NodeConfig, options: { readOnly?: boolean; gameMode?: boolean; weightedTargets?: { id: string; label: string }[] } = {}) {
  const onChange = vi.fn();
  const onDelete = vi.fn();
  render(<I18nextProvider i18n={i18n}><InspectorPanel config={config} onChange={onChange} onDelete={onDelete} {...options} /></I18nextProvider>);
  return { onChange, onDelete };
}

describe('InspectorPanel configuration controls', () => {
  it('disables read-only controls through native semantics and prevents deletion', async () => {
    const { onChange, onDelete } = mount(defaultsForKind('server', 's', 'Server'), { readOnly: true });
    for (const slider of screen.getAllByRole('slider')) expect(slider).toBeDisabled();
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Delete component' })).toBeDisabled();
    await userEvent.click(screen.getByRole('switch', { name: 'Limit waiting queue' }));
    await userEvent.click(screen.getByRole('button', { name: 'Delete component' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('locks match reliability controls while allowing provisioned capacity edits', () => {
    mount(defaultsForKind('server', 's', 'Server'), { gameMode: true });
    expect(screen.getByRole('slider', { name: 'Service time' })).toBeEnabled();
    expect(screen.getByRole('slider', { name: 'Failure rate' })).toBeDisabled();
    expect(screen.getByRole('slider', { name: 'Retries after failure' })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: 'Distribution' })).toBeDisabled();
  });

  it('lets a client stop generating traffic with an explicit zero rate', () => {
    const { onChange } = mount(defaultsForKind('client', 'c', 'Client'));
    const input = screen.getByRole('slider', { name: 'Base rate' });
    expect(input).toHaveAttribute('min', '0');
    fireEvent.change(input, { target: { value: '0' } });
    expect(onChange).toHaveBeenCalledWith({ baseRate: 0 });
  });

  it('does not expose processing-time controls for a client traffic source', () => {
    mount(defaultsForKind('client', 'c', 'Client'));
    expect(screen.queryByRole('slider', { name: 'Local timeout' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Distribution' })).toBeNull();
  });

  it('exposes connected weighted targets and retains other target weights', () => {
    const config = { ...defaultsForKind('loadBalancer', 'lb', 'LB'), strategy: 'weighted' as const, weights: { a: 3, b: 1 } };
    const { onChange } = mount(config, { weightedTargets: [{ id: 'a', label: 'API A' }, { id: 'b', label: 'API B' }] });
    fireEvent.change(screen.getByRole('slider', { name: 'Weight: API A' }), { target: { value: '0' } });
    expect(onChange).toHaveBeenCalledWith({ weights: { a: 0, b: 1 } });
    expect(screen.getByRole('slider', { name: 'Weight: API B' })).toHaveValue('1');
  });

  it('supports a zero-size waiting room and restoring an unbounded queue', async () => {
    const { onChange } = mount({ ...defaultsForKind('server', 's', 'Server'), queueCapacity: 10 });
    fireEvent.change(screen.getByRole('slider', { name: 'Waiting queue slots' }), { target: { value: '0' } });
    expect(onChange).toHaveBeenCalledWith({ queueCapacity: 0 });
    await userEvent.click(screen.getByRole('switch', { name: 'Limit waiting queue' }));
    expect(onChange).toHaveBeenCalledWith({ queueCapacity: Infinity });
  });

  it('can enable a bounded waiting room from the default unbounded state', async () => {
    const { onChange } = mount(defaultsForKind('server', 's', 'Server'));
    expect(screen.queryByRole('slider', { name: 'Waiting queue slots' })).toBeNull();
    await userEvent.click(screen.getByRole('switch', { name: 'Limit waiting queue' }));
    expect(onChange).toHaveBeenCalledWith({ queueCapacity: 1000 });
  });

  it.each(['server', 'autoScaler'] as const)('keeps autoscale bounds and provisioned replicas coherent for %s', (kind) => {
    const { onChange } = mount({ ...defaultsForKind(kind, 's', 'Server'), autoScaleEnabled: true, minReplicas: 5, maxReplicas: 6, replicas: 5 });
    fireEvent.change(screen.getByRole('slider', { name: 'Min replicas' }), { target: { value: '8' } });
    expect(onChange).toHaveBeenCalledWith({ minReplicas: 8, maxReplicas: 8, replicas: 8 });
    fireEvent.change(screen.getByRole('slider', { name: 'Max replicas' }), { target: { value: '3' } });
    expect(onChange).toHaveBeenCalledWith({ minReplicas: 3, maxReplicas: 3, replicas: 3 });
  });

  it('edits retry backoff and jitter without losing the retry limit', async () => {
    const { onChange } = mount({ ...defaultsForKind('server', 's', 'Server'), retry: { maxRetries: 2, backoffBaseMs: 50, jitter: true } });
    fireEvent.change(screen.getByRole('slider', { name: 'Initial retry backoff' }), { target: { value: '400' } });
    expect(onChange).toHaveBeenCalledWith({ retry: { maxRetries: 2, backoffBaseMs: 400, jitter: true } });
    await userEvent.click(screen.getByRole('switch', { name: 'Randomize retry backoff (jitter)' }));
    expect(onChange).toHaveBeenCalledWith({ retry: { maxRetries: 2, backoffBaseMs: 50, jitter: false } });
  });

  it('explains cache model limits instead of exposing an ineffective TTL control', () => {
    mount(defaultsForKind('cache', 'cache', 'Cache'));
    expect(screen.queryByRole('slider', { name: 'TTL' })).toBeNull();
    expect(screen.getByText(/Key expiry, TTL and cache invalidation are not simulated/)).toBeVisible();
  });

  it('explains aggregate sharding instead of exposing an ineffective hash/range selector', () => {
    mount(defaultsForKind('shardRouter', 'sr', 'Router'));
    expect(screen.queryByRole('combobox', { name: 'Strategy' })).toBeNull();
    expect(screen.getByText(/differences between hash and range partitioning are not simulated/)).toBeVisible();
  });
});
