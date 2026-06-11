import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
}

export default function ProtectedRoute({
  children,
  requireEmailVerification = true,
}: ProtectedRouteProps) {
  const { currentUser, isEmailVerified } = useAuth();
  const location = useLocation();

  // Not logged in - redirect to login, remembering where the user was headed
  // so Login can send them back (e.g. /arena) after sign-in.
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
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

  // User is authenticated and has access - allow through
  return <>{children}</>;
}
