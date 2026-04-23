import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Clusters = () => {
  const [clusters, setClusters] = useState([
    { id: 'eu-west', name: 'EU-West', status: 'Healthy', nodes: 12, maxNodes: 12, cpu: 42, memory: 58 },
    { id: 'us-east', name: 'US-East', status: 'Healthy', nodes: 24, maxNodes: 24, cpu: 65, memory: 72 },
    { id: 'ap-south', name: 'AP-South', status: 'Healthy', nodes: 8, maxNodes: 8, cpu: 28, memory: 35 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setClusters(prevClusters => prevClusters.map(cluster => {
        // Randomly fluctuate CPU and Memory
        const newCpu = Math.min(100, Math.max(10, cluster.cpu + (Math.random() * 10 - 5)));
        const newMemory = Math.min(100, Math.max(10, cluster.memory + (Math.random() * 10 - 5)));
        
        // Randomly change status based on CPU load
        let newStatus = 'Healthy';
        if (newCpu > 85) newStatus = 'Critical';
        else if (newCpu > 70) newStatus = 'Warning';

        return {
          ...cluster,
          cpu: Math.round(newCpu),
          memory: Math.round(newMemory),
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
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'Healthy': return 'bg-emerald-500';
      case 'Warning': return 'bg-amber-500';
      case 'Critical': return 'bg-rose-500';
      default: return 'bg-brand-500';
    }
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-brand font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-200 to-gray-400 uppercase tracking-tighter">
            Cluster Infrastructure
          </h2>
          <p className="text-slate-400 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em]">
            Global Kubernetes Nodes & Telemetry
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Live Sync Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {clusters.map((cluster) => (
            <motion.div 
              layout
              key={cluster.id} 
              className="card p-6 border-brand-500/10 hover:border-brand-500/30 transition-all group relative overflow-hidden"
            >
              {/* Subtle background glow based on status */}
              <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-10 transition-colors duration-1000 ${
                cluster.status === 'Healthy' ? 'bg-emerald-500' : 
                cluster.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'
              }`} />

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">{cluster.name} Cluster</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">ID: {cluster.id.toUpperCase()}-NODE-X</p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${getStatusColor(cluster.status)}`}>
                  {cluster.status}
                </div>
              </div>
              
              <div className="space-y-5 relative z-10">
                {/* Node Status */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest">
                    <span className="text-slate-400">Available Nodes</span>
                    <span className="text-white font-mono">{cluster.nodes} / {cluster.maxNodes}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(cluster.nodes / cluster.maxNodes) * 100}%` }}
                      className="h-full bg-brand-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                    />
                  </div>
                </div>

                {/* CPU Telemetry */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest">
                    <span className="text-slate-400">CPU Compute</span>
                    <span className={`font-mono transition-colors duration-500 ${cluster.status === 'Critical' ? 'text-rose-400' : 'text-white'}`}>
                      {cluster.cpu}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ 
                        width: `${cluster.cpu}%`,
                        backgroundColor: cluster.cpu > 85 ? '#f43f5e' : cluster.cpu > 70 ? '#f59e0b' : '#10b981'
                      }}
                      transition={{ type: 'spring', stiffness: 50 }}
                      className="h-full rounded-full" 
                    />
                  </div>
                </div>

                {/* Memory Telemetry */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest">
                    <span className="text-slate-400">Memory Allocation</span>
                    <span className="text-white font-mono">{cluster.memory}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${cluster.memory}%` }}
                      className="h-full bg-cyber-cyan rounded-full" 
                    />
                  </div>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter italic">Last synced: Just now</span>
                <button className="text-[10px] font-bold text-brand-400 hover:text-brand-300 uppercase tracking-widest transition-colors flex items-center gap-2 group/btn">
                  Manage Nodes
                  <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Infrastructure Footer */}
      <div className="card p-4 border-white/5 bg-slate-900/20 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Health: Optimal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-500"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Threads: 1,402</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyber-cyan"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Network Latency: 14ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clusters;
