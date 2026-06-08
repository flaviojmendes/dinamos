import { Navigate } from 'react-router-dom';
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

  // User is authenticated and has access - allow through
  return <>{children}</>;
}
