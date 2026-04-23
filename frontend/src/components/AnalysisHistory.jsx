import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnalysisHistory = ({ history, onView, onDelete }) => {
  if (!history || history.length === 0) {
    return (
      <div className="card p-8 border-dashed border-white/5 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 className="text-sm font-bold text-gray-400">No recent analyses</h4>
        <p className="text-xs text-gray-600 mt-1 max-w-[200px]">Perform an AI analysis to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Analyses
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence mode="popLayout">
          {history.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card p-4 hover:border-brand-500/20 group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${
                    item.result?.severity === 'Critical' ? 'bg-red-500' :
                    item.result?.severity === 'High' ? 'bg-orange-500' :
                    'bg-brand-500'
                  }`}></span>
                  <span className="text-[10px] font-mono text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300 font-medium truncate">
                  {item.result?.error}
                </p>
                <p className="text-[10px] text-gray-600 font-mono mt-1 truncate">
                  {item.logs.substring(0, 80)}...
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onView(item)}
                  className="flex-1 sm:flex-none px-3 py-1.5 text-[10px] font-bold text-brand-400 border border-brand-500/20 rounded hover:bg-brand-500/10 transition-colors"
                >
                  VIEW DETAILS
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalysisHistory;
