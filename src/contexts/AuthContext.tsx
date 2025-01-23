import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut as firebaseSignOut,
  fetchSignInMethodsForEmail,
  linkWithPopup,
  signInWithCredential,
  GithubAuthProvider as GithubProvider,
  AuthError
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSubscribed: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  setIsSubscribed: (isSubscribed: boolean) => void;
  checkSubscription: () => Promise<boolean>;
  
}

const AuthContext = createContext<AuthContextType | null>(null);



export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userState, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const checkSubscription = async () => {
    if (!userState) return false;
    
    // get from JWT
    const idTokenResult = await userState.getIdTokenResult();
    const isSubscribed = idTokenResult.claims.subscribed === true;
    setIsSubscribed(isSubscribed);
    return isSubscribed;
  };



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("user", user);
      setUserState(user);
      if (user) {
        await checkSubscription();
      } else {
        setIsSubscribed(false);
      }
      setLoading(false);
    });

    


    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/account-exists-with-different-credential') {
        // Get the email from the error
        const email = authError.customData?.email;
        if (email) {
          // Get sign in methods for this email
          const methods = await fetchSignInMethodsForEmail(auth, email);
          if (methods.includes('google.com')) {
            // If the user has a Google account, ask them to sign in with Google first
            const googleProvider = new GoogleAuthProvider();
            try {
              // Sign in with Google
              const result = await signInWithPopup(auth, googleProvider);
              // Link GitHub provider to this account
              if (result.user) {
                await linkWithPopup(result.user, provider);
              }
            } catch (linkError) {
              console.error('Error linking accounts:', linkError);
            }
          } else {
            console.error('Please sign in with your original authentication method:', methods[0]);
          }
        }
      } else {
        console.error('Error signing in with GitHub:', error);
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user: userState,
    loading,
    isSubscribed,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    checkSubscription,
    setIsSubscribed
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 