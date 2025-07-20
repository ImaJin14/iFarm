import React from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
  hideIfNoAccess?: boolean;
  showDebugInfo?: boolean;
}

export default function RoleGuard({
  children,
  allowedRoles,
  fallback,
  hideIfNoAccess = false,
  showDebugInfo = process.env.NODE_ENV === 'development'
}: RoleGuardProps) {
  const { user, loading, hasAnyRole, refreshUserProfile } = useAuth();

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  // If no user, hide or show access denied
  if (!user) {
    if (hideIfNoAccess) return null;
    
    return fallback || (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-yellow-800 font-medium">Authentication required to view this content.</p>
        </div>
      </div>
    );
  }

  // Check if user has required role
  const hasAccess = hasAnyRole(allowedRoles);

  if (!hasAccess) {
    if (hideIfNoAccess) return null;

    const handleRefresh = async () => {
      try {
        await refreshUserProfile();
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    };

    return fallback || (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div className="flex-1">
            <h4 className="text-red-800 font-medium mb-2">Access Denied</h4>
            <p className="text-red-700 text-sm mb-3">
              You don't have the required permissions to view this content.
            </p>
            
            <div className="bg-white rounded border border-red-200 p-3 text-sm mb-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium text-gray-700">Required:</span>
                  <div className="text-gray-600">{allowedRoles.join(', ')}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Your role:</span>
                  <div className={`font-medium ${
                    user.role === 'customer' ? 'text-blue-600' : 
                    user.role === 'farm' ? 'text-green-600' : 
                    user.role === 'administrator' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {user.role || 'Not assigned'}
                  </div>
                </div>
              </div>
            </div>

            {showDebugInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm mb-3">
                <h5 className="font-medium text-blue-800 mb-1">Debug Info</h5>
                <div className="text-blue-700 space-y-1">
                  <div>User ID: <span className="font-mono text-xs">{user.id}</span></div>
                  <div>Email: {user.email}</div>
                  <div>Has Access: {hasAccess ? 'Yes' : 'No'}</div>
                  <div>Allowed Roles: [{allowedRoles.join(', ')}]</div>
                </div>
              </div>
            )}
            
            <button
              onClick={handleRefresh}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors duration-200"
            >
              Refresh Permissions
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User has access, render children
  return <>{children}</>;
}