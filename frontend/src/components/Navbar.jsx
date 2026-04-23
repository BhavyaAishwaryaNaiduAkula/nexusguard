import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Pipelines", path: "/pipelines" },
    { name: "Clusters", path: "/clusters" },
    { name: "Observability", path: "/observability" },
    { name: "Access Control", path: "/access-control" }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  // Determine if navigation should be hidden (login/signup pages when not logged in)
  const hideNav = !token && (location.pathname === '/login' || location.pathname === '/signup');

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <Logo className="w-9 h-9" />
            <span className="text-2xl font-brand font-extrabold tracking-tighter text-white group-hover:text-brand-400 transition-colors">
              NEXUS<span className="text-brand-500">GUARD</span>
            </span>
          </Link>

          {!hideNav && (
            <>
              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems && navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      isActive(item.path) 
                        ? 'text-brand-400 bg-brand-500/10 shadow-[inset_0_0_10px_rgba(99,102,241,0.1)]' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Right Side System Actions */}
              <div className="flex items-center gap-4">
                <div className="hidden xl:flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-2xl border border-white/5">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System Health: 100%</span>
                </div>
                
                {user && (
                  <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-xs font-bold text-white tracking-tight">{user.name}</span>
                      <button 
                        onClick={handleLogout}
                        className="text-[9px] text-slate-500 hover:text-red-400 font-mono uppercase tracking-widest transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-brand-400 font-brand text-lg shadow-lg">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                )}

                {/* Mobile Menu Trigger */}
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className="lg:hidden p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Sidebar (Overlay) */}
      {!hideNav && isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#020617]/95 backdrop-blur-3xl border-t border-white/5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-8 space-y-2">
            {navItems && navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-5 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all ${
                  isActive(item.path)
                    ? 'text-brand-400 bg-brand-500/10 border border-brand-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user && (
              <div className="pt-6 mt-6 border-t border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-brand text-xl">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white tracking-tight">{user.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 text-xs font-bold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500/20 transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
