import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('[DEBUG] Initiating login for:', formData.email);
    
    try {
      const res = await login(formData.email, formData.password);
      console.log('[DEBUG] Login response received:', res);
      
      // Check for success status 200
      if (res && res.status === 200) {
        console.log('[DEBUG] Login successful, triggering navigation to "/"');
        toast.success(res.data.message || 'Welcome back, Guardian');
        
        // Use a small timeout to ensure state has propagated if needed
        setTimeout(() => {
          navigate('/');
        }, 100);
      } else {
        console.warn('[DEBUG] Login failed with status:', res?.status);
        toast.error(res?.data?.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('[DEBUG] Login connection error:', err);
      toast.error('Connection error. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md p-8 sm:p-10 border-brand-500/20"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">NexusGuard</h2>
          <p className="text-gray-400 text-sm">Secure access to autonomous DevOps guardian</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
              placeholder="guardian@nexus.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Access Key</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 transition-all flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'INITIALIZE ACCESS'}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            No authorization? <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-bold">Register New Guardian</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
