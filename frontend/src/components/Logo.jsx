import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ className = "w-10 h-10", pulse = true }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Pulse Rings */}
      {pulse && (
        <>
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-xl bg-brand-500/20"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute inset-0 rounded-xl bg-brand-400/10"
          />
        </>
      )}

      {/* Main Logo Body */}
      <div className="relative w-full h-full bg-gradient-to-tr from-brand-600 to-brand-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-white/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent)]"></div>
        <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-white drop-shadow-md" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
    </div>
  );
};

export default Logo;
