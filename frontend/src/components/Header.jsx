import React from 'react';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            NexusGuard <span className="text-brand-500 text-sm font-medium ml-2 px-2 py-1 bg-brand-500/10 rounded-full">Guardian</span>
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <a href="#" className="hover:text-brand-500 transition-colors">Dashboard</a>
          <a href="#" className="hover:text-brand-500 transition-colors">Alerts</a>
          <a href="#" className="hover:text-brand-500 transition-colors">Infrastructure</a>
          <a href="#" className="hover:text-brand-500 transition-colors">Settings</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <button className="btn-primary">
            Analyze Now
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
