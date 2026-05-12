//write protected route component that checks if user is authenticated before rendering the component, if not redirect to login page
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

const ProtectedRoute = ({ children, requiredRoles, componentName }) => {
  const { isAuthenticated, hasRole, hasPermission } = useRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // const hasAccess = componentName 
  //   ? hasPermission(componentName)
  //   : requiredRoles 
  //   ? hasRole(requiredRoles)
  //   : true;


  return children;
};

export default ProtectedRoute;