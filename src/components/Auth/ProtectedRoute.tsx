import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

export default function ProtectedRoute({ children, requiresSubscription = true }: ProtectedRouteProps) {
  const { user, loading, isSubscribed, checkSubscription } = useAuth();
  const location = useLocation();
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);

  useEffect(() => {
    const checkUserSubscription = async () => {
      if (user && requiresSubscription) {
        const status = await checkSubscription();
        setSubscriptionStatus(status);
      } else {
        setSubscriptionStatus(true); // If subscription not required, consider it as subscribed
      }
      setIsCheckingSubscription(false);
    };

    if (!loading) {
      checkUserSubscription();
    }
  }, [user, loading, requiresSubscription, checkSubscription]);

  if (loading || isCheckingSubscription) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (requiresSubscription && !subscriptionStatus && !location.pathname.startsWith('/pagamento')) {
    return <Navigate to="/pagamento" state={{ from: location }} />;
  }

  return <>{children}</>;
} 