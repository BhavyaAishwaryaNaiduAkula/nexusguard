import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystem } from '../context/SystemContext';

const Observability = () => {
  const { logs, clusters } = useSystem();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Critical': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-brand font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-200 to-gray-400 uppercase tracking-tighter">
            Observability Deck
          </h2>
          <p className="text-slate-400 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] max-w-lg">
            Real-time distributed tracing & service mesh telemetry.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </div>
          <span className="text-[10px] text-brand-400 font-bold uppercase tracking-widest font-mono">Live Stream Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Service Mesh Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {clusters.map((cluster) => (
              <motion.div 
                layout
                key={cluster.id}
                className="card p-6 border-brand-500/10 hover:border-brand-500/30 transition-all group overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors uppercase tracking-tight">{cluster.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono tracking-widest">REGION: {cluster.region}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-widest transition-all duration-500 ${getStatusColor(cluster.status)}`}>
                    {cluster.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#020617]/50 rounded-xl border border-white/5">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1 font-bold">CPU Load</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-lg font-mono font-bold ${cluster.cpu > 80 ? 'text-rose-400' : 'text-white'}`}>{Math.round(cluster.cpu)}</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#020617]/50 rounded-xl border border-white/5">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Memory</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-mono font-bold text-white">{Math.round(cluster.memory)}</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                   <div className="flex justify-between text-[9px] uppercase tracking-widest">
                     <span className="text-slate-500 font-bold">Node Allocation</span>
                     <span className="font-mono font-bold text-brand-400">{cluster.nodes}/{cluster.maxNodes}</span>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        animate={{ width: `${(cluster.nodes / cluster.maxNodes) * 100}%` }}
                        className="h-full rounded-full bg-brand-500"
                     />
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Diagnostic Event Log */}
        <div className="card p-0 border-white/5 bg-slate-900/40 backdrop-blur overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
              Unified Diagnostic Stream
            </h3>
            <span className="text-[9px] text-slate-500 font-mono">BUFFER: 1024 KB</span>
          </div>
          <div className="p-4 h-[400px] overflow-y-auto custom-scrollbar font-mono">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4 py-1.5 border-b border-white/[0.02] last:border-0 group">
                <span className="text-[10px] text-slate-600 font-bold shrink-0">[{log.time}]</span>
                <span className={`text-[10px] font-bold uppercase shrink-0 w-16 ${log.color}`}>{log.type}</span>
                <p className="text-[11px] text-slate-300 group-hover:text-white transition-colors">{log.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Observability;
