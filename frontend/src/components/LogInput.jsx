import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { processLogs } from '../utils/logProcessor';
import LogIntelligence from './LogIntelligence';
import Logo from './Logo';

// Custom Debounce Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const LogInput = ({ onAnalyze, isLoading }) => {
  const [logs, setLogs] = useState('');
  const [error, setError] = useState('');
  
  const debouncedLogs = useDebounce(logs, 300);
  const logAnalysis = useMemo(() => processLogs(debouncedLogs), [debouncedLogs]);

  const handleAnalyze = () => {
    if (!logs.trim()) {
      setError('Please provide logs to analyze.');
      return;
    }
    setError('');
    if (onAnalyze) {
      onAnalyze(logs);
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Logo pulse={false} className="w-8 h-8 opacity-50" />
          <h2 className="text-3xl font-brand font-extrabold text-white tracking-tighter uppercase">
            Log <span className="text-brand-500">Analyzer</span>
          </h2>
        </div>
        <p className="text-slate-500 text-sm font-medium ml-11">Inject raw system logs for autonomous diagnostics.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-1 shadow-brand-500/5"
      >
        <div className="bg-slate-900/40 rounded-[22px] overflow-hidden border border-white/5">
          <textarea
            value={logs}
            onChange={(e) => {
              setLogs(e.target.value);
              if (error) setError('');
            }}
            placeholder="Paste your logs here... (e.g. Nginx errors, Node.js stack traces, etc.)"
            className="w-full h-64 p-6 bg-transparent text-slate-300 font-mono text-sm focus:outline-none resize-none placeholder:text-slate-700 transition-all"
          />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-950/50 border-t border-white/5">
            <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                {logs.split('\n').filter(l => l).length} lines
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                UTF-8 Secured
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {logs && (
                <button 
                  onClick={() => setLogs('')}
                  className="px-4 py-2 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors"
                >
                  Clear
                </button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={isLoading}
                className="btn-primary flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest disabled:opacity-50 group"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Initialize Scan
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs font-mono font-bold mt-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {error}
        </motion.p>
      )}

      {logs && logAnalysis && (
        <LogIntelligence analysis={logAnalysis} />
      )}
    </div>
  );
};

export default LogInput;
