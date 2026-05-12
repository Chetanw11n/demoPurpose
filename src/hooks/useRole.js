import { useSelector } from 'react-redux';
import { roleConfig, componentPermissions } from '../config/roleConfig';

export const useRole = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Get role from Redux first, then localStorage
  let role = user?.role;
  
  if (!role) {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        role = parsedUser?.role;
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
    }
  }

  // Fallback to localStorage userRole
  if (!role) {
    role = localStorage.getItem('userRole');
  }

  const hasRole = (requiredRole) => {
    if (!isAuthenticated) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    return role === requiredRole;
  };

  const hasPermission = (component) => {
    if (!isAuthenticated) return false;
    const allowedRoles = componentPermissions[component];
    return allowedRoles ? allowedRoles.includes(role) : false;
  };

  const canPerform = (action) => {
    if (!isAuthenticated) return false;
    const userConfig = roleConfig[role];
    return userConfig ? userConfig.canPerform.includes(action) : false;
  };

  const canAccess = (component) => {
    if (!isAuthenticated) return false;
    const userConfig = roleConfig[role];
    return userConfig ? userConfig.canAccess.includes(component) : false;
  };

  return {
    role,
    user,
    isAuthenticated,
    hasRole,
    hasPermission,
    canPerform,
    canAccess,
    roleConfig: roleConfig[role],
  };
};