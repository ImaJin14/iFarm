import React from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
  hideIfNoAccess?: boolean;
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback,
  hideIfNoAccess = false 
}: RoleGuardProps) {
  const { user, hasAnyRole } = useAuth();

  if (!user || !hasAnyRole(allowedRoles)) {
    if (hideIfNoAccess) {
      return null;
    }
    
    return fallback || (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          This feature requires {allowedRoles.join(' or ')} access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}