import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut as firebaseSignOut,
  fetchSignInMethodsForEmail,
  linkWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  AuthError,
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Shape of the backend user profile returned by GET /api/users/me.
export interface AppUser {
  id: string;
  email: string;
  nickname: string | null;
  role: string;
  role_color: string;
  permissions: string[];
  avatar_image: string | null;
  github_username: string | null;
  tokens: number;
  onboarding_completed: boolean;
  [key: string]: unknown;
}

interface AuthContextType {
  // Dinamos-native API
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;

  // designLab-compatible API (aliases + extensions)
  currentUser: User | null;
  appUser: AppUser | null;
  isEmailVerified: boolean;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<boolean>;
  getIdToken: () => Promise<string | null>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

const API_URL = import.meta.env.VITE_API_URL ?? '';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userState, setUserState] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  const fetchUserProfile = useCallback(async (forceRefresh = false): Promise<void> => {
    const current = auth.currentUser;
    if (!current) {
      setAppUser(null);
      return;
    }
    try {
      const token = await current.getIdToken(forceRefresh);
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;
      const data: AppUser = await response.json();
      setAppUser((prev) => (prev && prev.id === data.id && prev.tokens === data.tokens ? prev : data));
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        setUserState(user);
        setEmailVerified(user?.emailVerified ?? false);
        if (user) {
          await fetchUserProfile();
        } else {
          setAppUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUserState(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Capture GitHub username when available and sync to backend.
      // @ts-ignore - reloadUserInfo is undocumented but commonly present
      const screenName = result.user?.reloadUserInfo?.screenName;
      if (screenName) {
        try {
          const token = await result.user.getIdToken();
          await fetch(`${API_URL}/api/users/me`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ github_username: screenName }),
          });
          await fetchUserProfile();
        } catch (e) {
          console.error('Failed to sync GitHub username:', e);
        }
      }
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/account-exists-with-different-credential') {
        const email = authError.customData?.email as string | undefined;
        if (email) {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          if (methods.includes('google.com')) {
            const googleProvider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, googleProvider);
            if (result.user) await linkWithPopup(result.user, provider);
          } else {
            throw new Error(`Please sign in with your original method: ${methods[0]}`);
          }
        } else {
          throw new Error('No email found for account linking');
        }
      } else {
        throw authError;
      }
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (result.user) {
      try {
        await sendEmailVerification(result.user);
      } catch (e) {
        console.error('Failed to send verification email:', e);
      }
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const resendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  };

  const reloadUser = async (): Promise<boolean> => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const verified = auth.currentUser.emailVerified;
      setEmailVerified(verified);
      setUserState(auth.currentUser);
      return verified;
    }
    return false;
  };

  // Stable identity: NotificationBell uses this in an effect dependency array.
  const getIdToken = useCallback(async (): Promise<string | null> => {
    if (auth.currentUser) return auth.currentUser.getIdToken();
    return null;
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setAppUser(null);
  };

  const value: AuthContextType = {
    user: userState,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    // designLab-compatible
    currentUser: userState,
    appUser,
    isEmailVerified: emailVerified,
    logout: signOut,
    loginWithGoogle: signInWithGoogle,
    loginWithGithub: signInWithGithub,
    loginWithEmail,
    signUpWithEmail,
    resetPassword,
    resendVerificationEmail,
    reloadUser,
    getIdToken,
    refreshUserProfile: async () => {
      await fetchUserProfile();
    },
  };

  return (
    <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
  );
}
