import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Observability = () => {
  const [services, setServices] = useState([
    { id: 'auth-svc', name: 'Authentication Service', status: 'Healthy', latency: 12, throughput: 1450, errorRate: 0.02 },
    { id: 'gateway-svc', name: 'API Gateway', status: 'Healthy', latency: 8, throughput: 3200, errorRate: 0.01 },
    { id: 'billing-svc', name: 'Billing Engine', status: 'Healthy', latency: 45, throughput: 850, errorRate: 0.05 },
    { id: 'notify-svc', name: 'Notification Hub', status: 'Warning', latency: 120, throughput: 600, errorRate: 1.2 },
    { id: 'storage-svc', name: 'Cloud Storage', status: 'Healthy', latency: 25, throughput: 2100, errorRate: 0.03 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prevServices => prevServices.map(svc => {
        // Randomly fluctuate metrics
        const newLatency = Math.max(5, svc.latency + (Math.random() * 10 - 5));
        const newThroughput = Math.max(100, svc.throughput + (Math.random() * 100 - 50));
        
        // Dynamic status based on latency/errors
        let newStatus = 'Healthy';
        if (newLatency > 150) newStatus = 'Critical';
        else if (newLatency > 80) newStatus = 'Warning';

        return {
          ...svc,
          latency: Math.round(newLatency),
          throughput: Math.round(newThroughput),
          status: newStatus
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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

      <div className="grid grid-cols-1 gap-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {services.map((svc) => (
              <motion.div 
                layout
                key={svc.id}
                className="card p-6 border-brand-500/10 hover:border-brand-500/30 transition-all group overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors uppercase tracking-tight">{svc.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono tracking-widest">ID: {svc.id.toUpperCase()}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-widest transition-all duration-500 ${getStatusColor(svc.status)}`}>
                    {svc.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#020617]/50 rounded-xl border border-white/5">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Latency</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-lg font-mono font-bold ${svc.status === 'Critical' ? 'text-rose-400' : 'text-white'}`}>{svc.latency}</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">ms</span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#020617]/50 rounded-xl border border-white/5">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Traffic</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-mono font-bold text-white">{(svc.throughput/1000).toFixed(1)}</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">k/s</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                   <div className="flex justify-between text-[9px] uppercase tracking-widest">
                     <span className="text-slate-500 font-bold">Error Rate</span>
                     <span className={`font-mono font-bold ${svc.errorRate > 1 ? 'text-rose-400' : 'text-emerald-400'}`}>{svc.errorRate}%</span>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        animate={{ width: `${Math.min(100, svc.errorRate * 20)}%` }}
                        className={`h-full rounded-full ${svc.errorRate > 1 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                     />
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Global Topology Visualization Placeholder */}
        <div className="card p-8 border-brand-500/10 bg-[#020617]/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center">
            <div className="relative mb-6">
               <div className="absolute inset-0 animate-ping bg-brand-500/10 rounded-full"></div>
               <div className="relative w-20 h-20 rounded-full bg-slate-900 border border-brand-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                 <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                 </svg>
               </div>
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Global Mesh Topology</h3>
            <p className="text-sm text-slate-400 max-w-md font-medium leading-relaxed">
              Synthesizing distributed traces from 420 micro-instances. High-fidelity visualization is being mapped to the neural engine.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="px-6 py-2.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-brand-500/20 transition-all">
                Download Report
              </button>
              <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                View Raw Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Observability;
