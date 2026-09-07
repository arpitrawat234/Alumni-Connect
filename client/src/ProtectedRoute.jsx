import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

// ProtectedRoute renders child routes only if user is authenticated
export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Can render a spinner or null while auth state resolves
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // render nested route component
}
