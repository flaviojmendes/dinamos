// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import messages from '../../../locales/en/translation.json';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key.split('.').reduce((value: any, segment) => value?.[segment], messages) ?? key,
  }),
}));
vi.mock('../../tactical', () => ({
  Panel: ({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) => <section><h2>{title}</h2>{action}{children}</section>,
  StatusBadge: () => null,
  TacticalButton: ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => <button onClick={onClick}>{children}</button>,
}));
vi.mock('../../simulation', () => ({
  useSimulationMotion: () => ({ reducedMotion: true, transition: { duration: 0 } }),
  SimulationActivity: () => null,
}));

import TokensSimulator from '../TokensSimulator';

describe('JWT simulator', () => {
  it('encodes Unicode names and claims as UTF-8 base64url without crashing', () => {
    render(<TokensSimulator />);
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'João 日本語 🚀' } });
    fireEvent.change(screen.getByPlaceholderText('Key'), { target: { value: 'cidade' } });
    fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: 'São Paulo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Claim' }));

    const encoded = screen.getByRole('heading', { name: 'Generated Token' }).closest('section')!.querySelector('p')!.textContent!;
    const [header, payload] = encoded.split('.');
    expect(header).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(payload).toMatch(/^[A-Za-z0-9_-]+$/);
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    expect(decoded.name).toBe('João 日本語 🚀');
    expect(decoded.cidade).toBe('São Paulo');
    fireEvent.click(screen.getByRole('button', { name: 'Verify Token' }));
    expect(screen.getByRole('status')).toHaveTextContent('Token valid');
  });
});
