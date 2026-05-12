import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

export const RoleBasedRoute = ({ 
  children, 
  requiredRoles, 
  componentName,
  fallback = null,
}) => {
  const { hasRole, hasPermission, isAuthenticated } = useRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  console.log("RoleBasedRoute - requiredRoles:", requiredRoles);
  console.log("RoleBasedRoute - componentName:", componentName);
  console.log("RoleBasedRoute - isAuthenticated:", isAuthenticated);
  const hasAccess = componentName 
    ? hasPermission(componentName)
    : hasRole(requiredRoles);

  if (!hasAccess) {
    return <Navigate to="/access-denied" />;
  }

  return children;
};

export default RoleBasedRoute;