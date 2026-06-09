// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const authState = vi.hoisted(() => ({
  value: { user: null as any, loading: false } as { user: any; loading: boolean },
}));
vi.mock('../../../contexts/AuthContext', () => ({ useAuth: () => authState.value }));

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>,
  useLocation: () => ({ pathname: '/secret' }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (_k: string, o?: { defaultValue?: string }) => o?.defaultValue ?? _k }),
}));

import ProtectedRoute from '../ProtectedRoute';

beforeEach(() => {
  authState.value = { user: null, loading: false };
});

describe('ProtectedRoute', () => {
  it('shows a loading state while auth resolves', () => {
    authState.value = { user: null, loading: true };
    render(
      <ProtectedRoute>
        <div>secret</div>
      </ProtectedRoute>
    );
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('redirects to /login when there is no user', () => {
    authState.value = { user: null, loading: false };
    render(
      <ProtectedRoute>
        <div>secret</div>
      </ProtectedRoute>
    );
    expect(screen.getByTestId('navigate').textContent).toBe('/login');
  });

  it('redirects when the user object is missing critical data', () => {
    authState.value = { user: { uid: '', email: null, providerData: [] }, loading: false };
    render(
      <ProtectedRoute>
        <div>secret</div>
      </ProtectedRoute>
    );
    expect(screen.getByTestId('navigate').textContent).toBe('/login');
  });

  it('renders children for a valid user', () => {
    authState.value = { user: { uid: 'u1', email: 'a@b.com' }, loading: false };
    render(
      <ProtectedRoute>
        <div>secret</div>
      </ProtectedRoute>
    );
    expect(screen.getByText('secret')).toBeInTheDocument();
  });
});
