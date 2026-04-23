import React from 'react';
import { motion } from 'framer-motion';

const LogIntelligence = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-4 space-y-4"
    >
      <div className="flex flex-wrap gap-3 items-center">
        <span className="px-2 py-1 bg-brand-500/20 text-brand-400 text-[10px] font-bold rounded uppercase tracking-wider border border-brand-500/30">
          Source: {analysis.detectedType}
        </span>
        <div className="flex gap-4 text-[10px] font-mono">
          <span className="text-red-400">Errors: {analysis.stats.errors}</span>
          <span className="text-yellow-400">Warnings: {analysis.stats.warnings}</span>
          <span className="text-gray-500">Lines: {analysis.stats.info + analysis.stats.errors + analysis.stats.warnings}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timeline View */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Incident Timeline
          </h4>
          <div className="space-y-3">
            {analysis.timeline.map((event, i) => (
              <div key={i} className="flex gap-3 items-start relative">
                {i !== analysis.timeline.length - 1 && (
                  <div className="absolute left-[5px] top-[14px] bottom-[-10px] w-[1px] bg-white/5"></div>
                )}
                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full border-2 ${
                  event.level === 'error' ? 'bg-red-500/20 border-red-500/50' : 
                  event.level === 'warning' ? 'bg-yellow-500/20 border-yellow-500/50' : 
                  'bg-brand-500/20 border-brand-500/50'
                }`}></div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <p className={`text-[10px] font-mono truncate ${
                      event.level === 'error' ? 'text-red-400' : 
                      event.level === 'warning' ? 'text-yellow-400' : 
                      'text-gray-400'
                    }`}>
                      {event.message}
                    </p>
                    {event.time && <span className="text-[9px] text-gray-600 font-mono flex-shrink-0">{event.time}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grouped Errors */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Grouped Anomalies
          </h4>
          <div className="space-y-2">
            {Object.entries(analysis.groupedErrors).slice(0, 4).map(([msg, count], i) => (
              <div key={i} className="flex justify-between items-center p-2 rounded bg-white/5 border border-white/5">
                <p className="text-[10px] text-gray-300 truncate pr-4 font-mono">{msg}</p>
                <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[9px] rounded font-bold border border-red-500/20">
                  x{count}
                </span>
              </div>
            ))}
            {Object.keys(analysis.groupedErrors).length === 0 && (
              <p className="text-[10px] text-gray-600 font-mono italic">No recurring anomalies detected.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(LogIntelligence);
