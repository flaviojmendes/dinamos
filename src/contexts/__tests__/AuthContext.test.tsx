// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { ReactNode } from 'react';

const authMock = vi.hoisted(() => ({
  currentUser: null as any,
  onAuthStateChanged: vi.fn(),
}));
vi.mock('../../config/firebase', () => ({ auth: authMock }));

const fb = vi.hoisted(() => ({
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  getRedirectResult: vi.fn(),
  signOut: vi.fn(),
  fetchSignInMethodsForEmail: vi.fn(),
  linkWithPopup: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  sendEmailVerification: vi.fn(),
}));
vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: class {},
  GithubAuthProvider: class {},
  signInWithPopup: fb.signInWithPopup,
  signInWithRedirect: fb.signInWithRedirect,
  getRedirectResult: fb.getRedirectResult,
  signOut: fb.signOut,
  fetchSignInMethodsForEmail: fb.fetchSignInMethodsForEmail,
  linkWithPopup: fb.linkWithPopup,
  createUserWithEmailAndPassword: fb.createUserWithEmailAndPassword,
  signInWithEmailAndPassword: fb.signInWithEmailAndPassword,
  sendPasswordResetEmail: fb.sendPasswordResetEmail,
  sendEmailVerification: fb.sendEmailVerification,
}));

import { AuthProvider, useAuth } from '../AuthContext';

const user = {
  uid: 'u1',
  email: 'a@b.com',
  emailVerified: true,
  getIdToken: vi.fn().mockResolvedValue('tok'),
  reload: vi.fn().mockResolvedValue(undefined),
};

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

beforeEach(() => {
  vi.clearAllMocks();
  user.getIdToken.mockResolvedValue('tok');
  user.reload.mockResolvedValue(undefined);
  authMock.currentUser = user;
  authMock.onAuthStateChanged.mockImplementation((cb: (u: unknown) => void) => {
    cb(user);
    return () => {};
  });
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ id: 'u1', email: 'a@b.com', tokens: 3 }),
  }) as unknown as typeof fetch;
  fb.signInWithPopup.mockResolvedValue({ user });
  fb.getRedirectResult.mockResolvedValue(null);
  fb.createUserWithEmailAndPassword.mockResolvedValue({ user });
  fb.signInWithEmailAndPassword.mockResolvedValue({ user });
});

describe('AuthContext', () => {
  it('throws when useAuth is used outside a provider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(/within an AuthProvider/);
  });

  it('exposes the signed-in user and loads the backend profile', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current).toBeTruthy());
    expect(result.current.user?.uid).toBe('u1');
    expect(result.current.loading).toBe(false);
    await waitFor(() => expect(result.current.appUser?.id).toBe('u1'));
    expect(result.current.isEmailVerified).toBe(true);
  });

  it('delegates auth actions to the firebase SDK', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      await result.current.signInWithGoogle();
    });
    expect(fb.signInWithPopup).toHaveBeenCalled();

    await act(async () => {
      await result.current.loginWithEmail('a@b.com', 'pw');
    });
    expect(fb.signInWithEmailAndPassword).toHaveBeenCalled();

    await act(async () => {
      await result.current.signUpWithEmail('a@b.com', 'pw');
    });
    expect(fb.createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(fb.sendEmailVerification).toHaveBeenCalled();

    await act(async () => {
      await result.current.resetPassword('a@b.com');
    });
    expect(fb.sendPasswordResetEmail).toHaveBeenCalled();

    await act(async () => {
      await result.current.signOut();
    });
    expect(fb.signOut).toHaveBeenCalled();
  });

  it('returns a token from getIdToken and reloads the user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current).toBeTruthy());

    await act(async () => {
      const token = await result.current.getIdToken();
      expect(token).toBe('tok');
    });

    await act(async () => {
      const verified = await result.current.reloadUser();
      expect(verified).toBe(true);
    });
    expect(user.reload).toHaveBeenCalled();
  });
});
