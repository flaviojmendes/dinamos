import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
  requireEmailVerification?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireSubscription = true,
  requireEmailVerification = true 
}: ProtectedRouteProps) {
  const { currentUser, isSubscribed, checkingSubscription, isEmailVerified } = useAuth();

  // Not logged in - redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check if email verification is required and user signed up with email/password
  // OAuth providers (Google, GitHub) are automatically verified
  const isOAuthUser = currentUser.providerData.some(
    provider => provider.providerId === 'google.com' || provider.providerId === 'github.com'
  );
  
  // Email verification required only for email/password users
  if (requireEmailVerification && !isOAuthUser && !isEmailVerified) {
    return <Navigate to="/verify-email" />;
  }

  // Still checking subscription status - show loading
  if (checkingSubscription) {
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-600 dark:border-signal-green border-t-transparent" aria-hidden />
            <span className="font-mono uppercase tracking-wider text-sm text-slate-600 dark:text-tactical-dim">Verificando acesso...</span>
          </div>
        </div>
      </div>
    );
  }

  // User is not subscribed and subscription is required - redirect to subscription page
  if (requireSubscription && !isSubscribed) {
    return <Navigate to="/subscription-required" />;
  }

  // User is authenticated and has access - allow through
  return <>{children}</>;
}
