import React from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallback?: React.ReactNode;
  showDebugInfo?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallback,
  showDebugInfo = process.env.NODE_ENV === 'development'
}: ProtectedRouteProps) {
  const { user, loading, hasAnyRole, refreshUserProfile } = useAuth();

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show authentication required message
  if (!user) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
            <div className="text-sm text-gray-500">
              If you just signed in, please wait a moment for the page to refresh.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If specific roles are required, check if user has any of the required roles
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    const handleRefresh = async () => {
      try {
        await refreshUserProfile();
        // The page will re-render automatically when the profile updates
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    };

    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 text-sm mb-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Required role:</span>
                  <span className="text-gray-600">{requiredRoles.join(' or ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Your role:</span>
                  <span className={`font-medium ${user.role === 'customer' ? 'text-blue-600' : user.role === 'farm' ? 'text-green-600' : 'text-red-600'}`}>
                    {user.role || 'Not assigned'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">User ID:</span>
                  <span className="text-gray-600 font-mono text-xs">{user.id.slice(0, 8)}...</span>
                </div>
              </div>
            </div>

            {showDebugInfo && (
              <div className="bg-blue-50 rounded-lg p-4 text-sm mb-4 border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Debug Information</h4>
                <div className="space-y-1 text-blue-700">
                  <div>Email: {user.email}</div>
                  <div>Full Name: {user.full_name || 'Not set'}</div>
                  <div>Has Required Role: {hasAnyRole(requiredRoles) ? 'Yes' : 'No'}</div>
                  <div>Auth Loading: {loading ? 'Yes' : 'No'}</div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={handleRefresh}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Refresh Profile
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Return to Home
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              If you believe this is an error, please contact support or try signing out and back in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
}