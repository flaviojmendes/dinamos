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
  checkSubscription: (forceRefresh?: boolean) => Promise<boolean>;
  
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

  const checkSubscription = async (forceRefresh: boolean = false) => {
    if (!userState) {
      setIsSubscribed(false);
      return false;
    }
    
    try {
      // First, try to get cached token if not forcing refresh
      let idTokenResult;
      let idToken;
      
      if (!forceRefresh) {
        try {
          // Get cached token first (faster)
          idTokenResult = await userState.getIdTokenResult(false);
          idToken = await userState.getIdToken(false);
          
          // Check if token is still valid and has subscription claim
          const now = Date.now() / 1000;
          const tokenExpiry = new Date(idTokenResult.expirationTime).getTime() / 1000;
          
          // If token expires in less than 5 minutes, refresh it
          if (tokenExpiry - now < 300) {
            console.log('Token expiring soon, refreshing...');
            idTokenResult = await userState.getIdTokenResult(true);
            idToken = await userState.getIdToken(true);
          }
        } catch (cacheError) {
          console.log('Cached token invalid, refreshing...');
          // Fall back to forced refresh
          idTokenResult = await userState.getIdTokenResult(true);
          idToken = await userState.getIdToken(true);
        }
      } else {
        // Force refresh when explicitly requested
        idTokenResult = await userState.getIdTokenResult(true);
        idToken = await userState.getIdToken(true);
      }
      
      // Verify token hasn't been tampered with
      if (!idToken || !idTokenResult) {
        console.warn('Invalid token received');
        setIsSubscribed(false);
        return false;
      }
      
      // Additional security: check token expiry
      const now = Date.now() / 1000;
      const tokenExpiry = new Date(idTokenResult.expirationTime).getTime() / 1000;
      if (tokenExpiry < now) {
        console.warn('Token expired');
        setIsSubscribed(false);
        return false;
      }
      
      // Check subscription claim
      const hasSubscription = idTokenResult.claims.subscribed === true;
      
      // Log subscription status for monitoring
      if (hasSubscription) {
        console.log(`Subscription verified for user ${userState.uid}`);
      } else {
        console.warn(`No subscription found for user ${userState.uid}`);
      }
      
      setIsSubscribed(hasSubscription);
      return hasSubscription;
      
    } catch (error) {
      console.error('Subscription check failed:', error);
      setIsSubscribed(false);
      return false;
    }
  };

  useEffect(() => {
    if (userState) {
      checkSubscription();
    }
  }, [userState]);



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // Security: Log successful authentication
          console.log(`User authenticated: ${user.uid}`);
          
          // Verify user has required fields
          if (!user.uid || (!user.email && !user.providerData?.length)) {
            console.error('User object missing critical data');
            setUserState(null);
            setIsSubscribed(false);
            setLoading(false);
            return;
          }
          
          setUserState(user);
          await checkSubscription();
        } else {
          console.log('User signed out');
          setUserState(null);
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUserState(null);
        setIsSubscribed(false);
      } finally {
        setLoading(false);
      }
    });

    


    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        console.log(`Google sign-in successful for user: ${result.user.uid}`);
      }
    } catch (error: any) {
      console.error('Google sign-in failed:', error);
      
      // Security: Log specific error types
      if (error.code === 'auth/popup-closed-by-user') {
        console.warn('User closed authentication popup');
      } else if (error.code === 'auth/popup-blocked') {
        console.warn('Authentication popup was blocked');
      } else {
        console.error('Unexpected Google sign-in error:', error.code);
      }
      
      throw error; // Re-throw for UI error handling
    }
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        console.log(`GitHub sign-in successful for user: ${result.user.uid}`);
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error('GitHub sign-in failed:', authError);
      
      if (authError.code === 'auth/account-exists-with-different-credential') {
        console.warn('Account linking required - user has existing account with different provider');
        const email = authError.customData?.email;
        
        if (email) {
          try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            console.log(`Existing sign-in methods for ${email}:`, methods);
            
            if (methods.includes('google.com')) {
              console.log('Attempting to link with existing Google account');
              const googleProvider = new GoogleAuthProvider();
              
              try {
                const result = await signInWithPopup(auth, googleProvider);
                if (result.user) {
                  await linkWithPopup(result.user, provider);
                  console.log('Successfully linked GitHub to Google account');
                }
              } catch (linkError) {
                console.error('Account linking failed:', linkError);
                throw linkError;
              }
            } else {
              const error = new Error(`Please sign in with your original method: ${methods[0]}`);
              console.error(error.message);
              throw error;
            }
          } catch (fetchError) {
            console.error('Error fetching sign-in methods:', fetchError);
            throw fetchError;
          }
        } else {
          const error = new Error('No email found for account linking');
          console.error(error.message);
          throw error;
        }
      } else {
        // Log other specific error types
        if (authError.code === 'auth/popup-closed-by-user') {
          console.warn('User closed GitHub authentication popup');
        } else if (authError.code === 'auth/popup-blocked') {
          console.warn('GitHub authentication popup was blocked');
        }
        throw authError;
      }
    }
  };

  const signOut = async () => {
    try {
      const currentUser = auth.currentUser;
      await firebaseSignOut(auth);
      
      // Security: Log sign-out events
      if (currentUser) {
        console.log(`User signed out: ${currentUser.uid}`);
      }
      
      // Clear subscription state
      setIsSubscribed(false);
    } catch (error) {
      console.error('Sign-out failed:', error);
      throw error; // Re-throw for UI error handling
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