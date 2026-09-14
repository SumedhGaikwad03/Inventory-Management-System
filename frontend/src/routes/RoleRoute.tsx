import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

interface RoleRouteProps {
  requiredRole?: string;
  allowedRoles?: string[];
}

/**
 * Route guard that requires specific role permissions (e.g. Admin)
 */
export const RoleRoute: React.FC<RoleRouteProps> = ({
  requiredRole,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif',
          color: '#64748b',
        }}
      >
        Validating permissions...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRole =
    (requiredRole && user?.role === requiredRole) ||
    (allowedRoles && user?.role && allowedRoles.includes(user.role));

  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
