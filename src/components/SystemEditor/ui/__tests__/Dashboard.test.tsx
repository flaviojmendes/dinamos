// @vitest-environment jsdom
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createInstance } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import Dashboard from '../Dashboard';
import { Simulator } from '../../engine/simulator';
import { defaultsForKind } from '../../engine/types';
import editor from '../../../../locales/en/namespaces/editor.json';

vi.mock('recharts', () => {
  const Container = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  return { ResponsiveContainer: Container, LineChart: Container, AreaChart: Container,
    Line: () => null, Area: () => null, XAxis: () => null, YAxis: () => null,
    Tooltip: () => null, CartesianGrid: () => null };
});
const i18n = createInstance();
beforeAll(async () => {
  await i18n.init({ lng: 'en', resources: { en: { translation: { editor } } }, interpolation: { escapeValue: false } });
});

function frame() {
  const source = { ...defaultsForKind('client', 'c', 'Client'), baseRate: 100 };
  const api = { ...defaultsForKind('server', 's', 'API'), failureRate: 0.5 };
  return new Simulator({ nodes: [source, api], edges: [{ id: 'e', source: 'c', target: 's' }], seed: 1, dtSeconds: 1, traceSamples: 20 }).tick();
}
function mount(history: ReturnType<typeof frame>[], successCount = 0, failedCount = 0) {
  render(<I18nextProvider i18n={i18n}><Dashboard history={history} totalCost={0} provider="aws" warnings={[]} successCount={successCount} failedCount={failedCount} /></I18nextProvider>);
}

describe('Dashboard metrics', () => {
  it('keeps accumulated error budget usage after current traffic has recovered', () => {
    const recovered = frame();
    recovered.system.successRate = 1;
    mount([recovered], 995, 5);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
  });
  it('uses offered demand for the traffic signal, including failed requests', () => {
    const current = frame();
    expect(current.system.totalThroughput).toBeLessThan(60);
    mount([current]);
    expect(screen.getByRole('group', { name: /Traffic: 100 req\/s/ })).toBeVisible();
  });
  it('does not claim measured availability before traffic exists', () => {
    mount([]);
    expect(screen.getByText('—')).toBeVisible();
    expect(screen.queryByText('100.0%')).toBeNull();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });
});
