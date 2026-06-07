
import React from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx';

export const PERMISSIONS = {
  SUPER_ADMIN: ['super_admin'],
  ADMIN: ['super_admin', 'admin'],
  MODERATOR: ['super_admin', 'admin', 'moderator']
};

export const hasPermission = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles) return false;
  return requiredRoles.includes(userRole);
};

export default function AdminAccessControl({ requiredRoles = PERMISSIONS.MODERATOR, children, fallback }) {
  const { currentAdmin } = useAdminAuth();

  const isAuthorized = hasPermission(currentAdmin?.role, requiredRoles);

  if (isAuthorized) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive my-4">
      <ShieldAlert className="h-5 w-5" />
      <AlertTitle className="font-bold">Access Denied</AlertTitle>
      <AlertDescription className="font-medium text-sm mt-1">
        You do not have the required permissions to view this content or perform this action.
        Required role level: {requiredRoles.join(' or ')}.
      </AlertDescription>
    </Alert>
  );
}

export function useAdminRBAC() {
  const { currentAdmin } = useAdminAuth();

  return {
    role: currentAdmin?.role,
    isSuperAdmin: hasPermission(currentAdmin?.role, PERMISSIONS.SUPER_ADMIN),
    isAdmin: hasPermission(currentAdmin?.role, PERMISSIONS.ADMIN),
    isModerator: hasPermission(currentAdmin?.role, PERMISSIONS.MODERATOR),
    checkAccess: (requiredRoles) => hasPermission(currentAdmin?.role, requiredRoles)
  };
}
