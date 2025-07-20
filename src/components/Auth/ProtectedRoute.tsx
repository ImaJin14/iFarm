import React from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallback 
}: ProtectedRouteProps) {
  const { user, loading, hasAnyRole } = useAuth();

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user is not authenticated, show authentication required message
  if (!user) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
          <div className="text-sm text-gray-500">
            If you just signed in, please wait a moment for the page to refresh.
          </div>
        </div>
      </div>
    );
  }

  // If specific roles are required, check if user has any of the required roles
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <div className="bg-gray-100 rounded-lg p-4 text-sm">
            <p className="text-gray-700 mb-2">
              <strong>Required role:</strong> {requiredRoles.join(' or ')}
            </p>
            <p className="text-gray-600">
              <strong>Your role:</strong> {user.role || 'Not assigned'}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            If you believe this is an error, please contact support or try signing out and back in.
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
}