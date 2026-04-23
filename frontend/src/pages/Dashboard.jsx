import React from 'react';
import { motion } from 'framer-motion';
import { useSystem } from '../context/SystemContext';
import { toast } from 'react-hot-toast';
import NetworkTopology from '../components/NetworkTopology';

const StatCard = ({ label, value, change, isPositive, icon: Icon }) => (
  <motion.div 
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="card p-6 border-brand-500/10 hover:border-brand-500/30 transition-all duration-300 relative group overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-bl-full -mr-12 -mt-12 group-hover:bg-brand-500/10 transition-colors"></div>
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{label}</p>
        <h3 className="text-3xl font-brand font-bold text-white tracking-tighter">{value}</h3>
      </div>
      <div className={`p-1.5 rounded-md ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isPositive ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          )}
        </svg>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-xs font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {isPositive ? '+' : '-'}{change}%
      </span>
      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">vs last 24h</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { logs, stats, pipelines, clusters, addLog } = useSystem();

  const handleForceSync = () => {
    toast.loading("Initiating global node synchronization...", { duration: 1500 });
    setTimeout(() => {
      addLog('info', 'Global state synchronization complete', 'text-emerald-400');
      toast.success("Nodes synchronized successfully");
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-brand-500/10 text-brand-400 text-[9px] font-bold uppercase tracking-widest rounded border border-brand-500/20">System Live</span>
            <span className="text-slate-700 text-[10px] font-mono">v2.5.4-stable</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-brand font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tighter uppercase leading-none">
            Command <span className="text-brand-500">Center</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em]">Autonomous Governance Engine</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end px-6 border-r border-white/5">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Network Latency</span>
            <span className="text-xl font-brand font-bold text-emerald-400 tracking-tight">{stats.latency}</span>
          </div>
          <button 
            onClick={handleForceSync}
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto text-[10px] font-bold uppercase tracking-widest px-6"
          >
             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             Force Sync
          </button>
        </div>
      </div>

      {/* Grid: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="System Uptime" value={stats.uptime} change={0.002} isPositive={true} />
        <StatCard label="Active Clusters" value={clusters.length} change={12.5} isPositive={true} />
        <StatCard label="Deployments" value={stats.activeDeployments} change={8.4} isPositive={true} />
        <StatCard label="Threats Blocked" value={stats.threatsBlocked.toLocaleString()} change={24.1} isPositive={true} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Real-time Visualization Panel */}
        <div className="xl:col-span-2 space-y-6">
          <NetworkTopology />
        </div>

        {/* Activity Feed Panel */}
        <div className="space-y-6">
          <div className="card p-6 border-white/5 bg-slate-900/40 backdrop-blur-xl h-full flex flex-col">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Live Event Stream
            </h3>
            
            <div className="space-y-4 flex-grow overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {logs.map((log) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-xl border border-white/5 ${log.bg} flex gap-4 items-start group hover:border-white/10 transition-colors`}
                >
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full ${log.color.replace('text', 'bg')} flex-shrink-0`}></div>
                  <div className="space-y-1 min-w-0">
                    <p className={`text-xs font-mono font-bold leading-tight truncate ${log.color}`}>{log.msg}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter italic">{log.type}</span>
                      <span className="text-[9px] text-slate-500 font-mono">{log.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
