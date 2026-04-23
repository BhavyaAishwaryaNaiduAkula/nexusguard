import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ children, requiredRole }) => {
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

  // Check for specific role requirements
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-lg p-10 border-rose-500/20 relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
          
          <div className="w-20 h-20 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mx-auto mb-8 shadow-lg shadow-rose-500/5">
            <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11-3V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7v2a3 3 0 01-6 0V7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-brand font-bold text-white mb-3 uppercase tracking-tighter">Access Denied</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Your authorization level (<span className="text-brand-400 font-mono font-bold">{user.role?.toUpperCase() || 'STANDARD'}</span>) 
            is insufficient to access this secure module. Contact the system administrator for clearance.
          </p>
          
          <Link to="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-widest font-bold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
