import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

import { signInWithGoogle } from '../firebase';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login, setUser } = useAuth(); // Added setUser for external login
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // This will navigate away from the current page to Google's login
      await signInWithGoogle();
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error(error.message || "Failed to initiate Google Sign-In");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await login(formData.email, formData.password);
      if (res && res.status === 200) {
        toast.success(res.data.message || 'Welcome back, Guardian');
        navigate('/');
      } else {
        toast.error(res?.data?.message || 'Invalid credentials');
      }
    } catch (err) {
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
          <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter font-brand">NexusGuard</h2>
          <p className="text-slate-400 text-sm font-medium">Secure entry to autonomous DevOps guardian</p>
        </div>

        <div className="space-y-6">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 font-bold py-3 px-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-white/5"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Sign in with Google
          </button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/5"></div>
            <span className="absolute bg-[#020617] px-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Email Identifier</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm font-mono"
                placeholder="guardian@nexus.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Access Key</label>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm font-mono"
                placeholder="••••••••"
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full btn-primary py-4 text-xs font-bold uppercase tracking-widest shadow-lg shadow-brand-500/20 active:scale-[0.98]"
            >
              Initialize Command Session
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            New Guardian? <Link to="/signup" className="text-brand-400 hover:text-brand-300">Request Clearance</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
