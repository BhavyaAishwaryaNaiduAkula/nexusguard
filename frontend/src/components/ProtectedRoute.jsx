import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component that only verifies if a user is authenticated.
 * Role-based restrictions have been removed per project requirements.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin"></div>
          <p className="text-brand-400 font-mono text-xs animate-pulse">AUTHORIZING ACCESS...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if no user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Allow access to all authenticated users
  return children;
};

export default ProtectedRoute;
