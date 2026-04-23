import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[250px] space-y-6">
      {/* Container for animations */}
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Outer pulse */}
        <div className="absolute inset-0 bg-brand-500/20 rounded-full animate-ping opacity-75"></div>
        
        {/* Main Spinner Ring */}
        <svg 
          className="relative w-16 h-16 text-brand-500 animate-spin drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
          <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>

        {/* Inner glowing dot */}
        <div className="absolute w-4 h-4 bg-white rounded-full animate-pulse shadow-[0_0_15px_3px_rgba(255,255,255,0.8)]"></div>
      </div>

      {/* Loading Text */}
      <div className="flex flex-col items-center space-y-2">
        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 tracking-wider animate-pulse">
          AI is analyzing...
        </h3>
        <div className="flex items-center gap-2 text-brand-400/80 font-mono text-sm">
          <svg className="w-4 h-4 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Scanning logs for anomalies
        </div>
      </div>
    </div>
  );
};

export default Loader;
