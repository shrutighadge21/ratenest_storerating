import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    console.warn('[PROTECTED ROUTE] Not authenticated, redirecting to /login');
    fetch('http://localhost:5001/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'ProtectedRoute redirecting to /login because !isAuthenticated. role is ' + role }) }).catch(()=>null);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    console.warn(`[PROTECTED ROUTE] Role ${role} not allowed, redirecting...`);
    fetch('http://localhost:5001/log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'ProtectedRoute redirecting because role ' + role + ' not in ' + allowedRoles.join(',') }) }).catch(()=>null);
    // Redirect authenticated users to their correct home if they try to access an unauthorized route
    if (role === 'SYSTEM_ADMIN') return <Navigate to="/admin" replace />;
    if (role === 'STORE_OWNER') return <Navigate to="/store-owner" replace />;
    return <Navigate to="/discovery" replace />;
  }

  return <>{children}</>;
}
