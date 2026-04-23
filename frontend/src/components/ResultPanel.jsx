import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const TypewriterText = ({ text, delay = 0, speed = 15 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    
    const startDelay = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (!text) {
          clearInterval(intervalId);
          return;
        }
        setDisplayedText((prev) => prev + (text.charAt(i) || ''));
        i++;
        if (i >= text.length) clearInterval(intervalId);
      }, speed);
      
      return () => clearInterval(intervalId);
    }, delay);
    
    return () => clearTimeout(startDelay);
  }, [text, delay, speed]);

  return <span>{displayedText}</span>;
};

const ResultCard = React.memo(({ title, content, delay, badge }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      className="card p-5 border border-brand-500/10 hover:border-brand-500/30 group relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] flex flex-col h-full bg-dark-bg/60 backdrop-blur-sm"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</h4>
          {badge && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              badge === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              badge === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
              badge === '98%' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              'bg-brand-500/20 text-brand-400 border border-brand-500/30'
            }`}>
              {badge}
            </span>
          )}
        </div>
        <button 
          onClick={handleCopy}
          className="text-gray-500 hover:text-brand-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
          title="Copy to clipboard"
        >
          {copied ? (
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="text-sm text-gray-300 font-mono leading-relaxed flex-grow">
        <TypewriterText text={content} delay={delay} />
      </div>
    </motion.div>
  );
});

const ResultPanel = ({ result, onClear }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationDone, setSimulationDone] = useState(false);

  if (!result) return null;

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationDone(true);
    }, 2000);
  };

  return (
    <div className="w-full mt-12 space-y-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <Logo pulse={false} className="w-10 h-10" />
          <div>
            <h3 className="text-2xl font-brand font-extrabold text-white tracking-tighter">
              ANALYSIS <span className="text-brand-500">REPORT</span>
            </h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Intelligence Generated successfully</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={onClear}
            className="flex-1 lg:flex-none text-[10px] font-bold text-slate-500 hover:text-white transition-colors px-6 py-3 rounded-2xl border border-white/5 hover:bg-white/5 uppercase tracking-widest"
          >
            Purge Data
          </button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSimulate}
            disabled={isSimulating || simulationDone}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 text-[10px] font-bold px-6 py-3 rounded-2xl transition-all duration-300 border uppercase tracking-widest ${
              simulationDone 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : isSimulating
                  ? 'bg-brand-500/10 text-brand-400 border-brand-500/20'
                  : 'btn-primary'
            }`}
          >
            {isSimulating ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Deploying...
              </>
            ) : simulationDone ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                Applied
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Execute Fix
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-2">
          <ResultCard title="Incident Signature" content={result.error} delay={0} />
        </div>
        <ResultCard title="Source Type" content={result.type} delay={200} badge="KERNEL" />
        <ResultCard title="Threat Level" content={result.severity} delay={400} badge={result.severity?.toUpperCase()} />
        
        <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
          <ResultCard title="Root Cause Analysis" content={result.root_cause} delay={600} />
        </div>
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
          <ResultCard title="Extended Context" content={result.explanation} delay={800} />
        </div>
        
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-3">
          <ResultCard title="Proposed Countermeasure" content={result.fix} delay={1000} />
        </div>
        
        <ResultCard title="Reliability" content={result.confidence} delay={1200} badge={result.confidence} />
        
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
          <ResultCard title="Deployment Protocol" content={result.pr_message} delay={1400} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ResultPanel);
