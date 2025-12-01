import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

export default function ProtectedRoute({ children, requiresSubscription = true }: ProtectedRouteProps) {
  const { user, loading, isSubscribed, checkSubscription } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  const [subscriptionVerified, setSubscriptionVerified] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const verifyAccess = async () => {
      // Reset verification state
      setSubscriptionVerified(null);
      setIsVerifying(true);

      // Handle routes that don't require subscription
      if (!requiresSubscription) {
        setSubscriptionVerified(true);
        setIsVerifying(false);
        return;
      }

      // Must have user for subscription check
      if (!user) {
        setSubscriptionVerified(false);
        setIsVerifying(false);
        return;
      }

      try {
        // Fast path: If user is already marked as subscribed in context, verify quickly
        let hasValidSubscription;
        if (isSubscribed) {
          // Quick verification without forcing token refresh
          hasValidSubscription = await checkSubscription(false);
        } else {
          // Full verification with token refresh for unsubscribed users
          hasValidSubscription = await checkSubscription(true);
        }
        
        setSubscriptionVerified(hasValidSubscription);
        
        // Security: Log access attempts
        if (!hasValidSubscription) {
          console.warn(`Unauthorized access attempt to ${location.pathname} by user ${user.uid}`);
        } else {
          console.log(`Authorized access to ${location.pathname} by user ${user.uid}`);
        }
      } catch (error) {
        console.error('Access verification failed:', error);
        
        // Retry mechanism for network issues (max 2 retries for faster response)
        if (retryCount < 2) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => verifyAccess(), 500 * (retryCount + 1)); // Faster retries
          return;
        }
        
        // After retries failed, deny access for security
        setSubscriptionVerified(false);
      } finally {
        setIsVerifying(false);
      }
    };

    // Only start verification when auth loading is complete
    if (!loading && user !== undefined) {
      verifyAccess();
    }
  }, [user, loading, requiresSubscription, checkSubscription, location.pathname, retryCount]);

  // Show loading while auth is loading OR while verifying access
  if (loading || isVerifying || subscriptionVerified === null) {
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-500 dark:text-slate-400 mt-4">
            {loading ? t('protected_route.loading', { defaultValue: 'Carregando...' }) : t('protected_route.verifying_access', { defaultValue: 'Verificando acesso...' })}
          </p>
          {retryCount > 0 && (
            <p className="text-zinc-500 text-sm mt-2">
              {t('protected_route.attempt', { 
                attempt: retryCount + 1, 
                total: 3,
                defaultValue: 'Tentativa {{attempt}}/{{total}}'
              })}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users
  if (!user) {
    console.warn(`Unauthenticated access attempt to ${location.pathname}`);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Additional security: Verify user object integrity
  if (!user.uid || (!user.email && !user.providerData?.length)) {
    console.error('Invalid user object detected - missing critical data');
    return <Navigate to="/login" replace />;
  }

  // Security: Block access if subscription verification failed
  if (requiresSubscription && subscriptionVerified !== true) {
    console.warn(`Access denied to ${location.pathname} for user ${user.uid} - subscription verification failed`);
    
    // Only redirect to payment if not already on payment page
    if (!location.pathname.startsWith('/pagamento')) {
      return <Navigate to="/pagamento" state={{ from: location }} replace />;
    }
  }

  // Final security check: Only render children if explicitly verified
  if (requiresSubscription && subscriptionVerified !== true) {
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">
            {t('protected_route.access_denied', { defaultValue: 'Acesso negado' })}
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            {t('protected_route.redirecting', { defaultValue: 'Redirecionando...' })}
          </p>
        </div>
      </div>
    );
  }

  // Success: Render protected content
  return <>{children}</>;
} 