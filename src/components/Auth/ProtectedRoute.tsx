import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-500 dark:text-slate-400 mt-4">
            {t('protected_route.loading', { defaultValue: 'Carregando...' })}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.warn(`Unauthenticated access attempt to ${location.pathname}`);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.uid || (!user.email && !user.providerData?.length)) {
    console.error('Invalid user object detected - missing critical data');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
