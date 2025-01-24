import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
}

export default function ProtectedRoute({ children, requiresSubscription = true }: ProtectedRouteProps) {
  const { user, loading, isSubscribed, checkSubscription } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Only check subscription if the route requires it and we're not on payment related pages
  if (requiresSubscription && !checkSubscription() && 
      !location.pathname    .startsWith('/pagamento')) {
    return <Navigate to="/pagamento" state={{ from: location }} />;
  }

  return <>{children}</>;
} 