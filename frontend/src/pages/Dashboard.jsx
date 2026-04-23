import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useWorkflows } from '../context/WorkflowContext';

const StatCard = ({ title, value, change, isPositive, delay, unit = "" }) => (
  <div 
    className="card p-6 group hover:-translate-y-2 relative overflow-hidden"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Subtle animated border top */}
    <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${isPositive ? 'from-cyber-cyan/50 to-brand-400' : 'from-cyber-pink/50 to-red-500'} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`}></div>
    
    <div className="flex justify-between items-start relative z-10">
      <h3 className="text-slate-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">{title}</h3>
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
    
    <div className="mt-4 flex items-end gap-3 relative z-10">
      <div className="flex flex-col">
        <AnimatePresence mode="wait">
          <motion.span 
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-3xl sm:text-4xl font-brand font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 tracking-tighter"
          >
            {value}{unit}
          </motion.span>
        </AnimatePresence>
      </div>
      <motion.span 
        key={change}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-xs font-mono font-bold pb-1.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}
      >
        {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
      </motion.span>
    </div>

    {/* Background Decorative Element */}
    <div className={`absolute -bottom-4 -right-4 w-16 h-16 blur-2xl opacity-10 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
  </div>
);

const Dashboard = () => {
  const { pipelines } = useWorkflows();
  const [stats, setStats] = useState({
    clusters: { value: pipelines.length, change: 12.5, isPositive: true },
    alerts: { value: 7, change: 4.2, isPositive: false },
    successRate: { value: 99.9, change: 0.1, isPositive: true },
    latency: { value: 42, change: 15.0, isPositive: true }
  });

  // Sync cluster count when pipelines change
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      clusters: { ...prev.clusters, value: pipelines.length }
    }));
  }, [pipelines.length]);

  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        // Randomly update stats with slight fluctuations
        const newStats = { ...prev };
        
        // Success Rate stays high but can drop slightly
        const rateDrop = Math.random() > 0.8 ? (Math.random() * 0.2) : (Math.random() * 0.05);
        newStats.successRate = {
          value: parseFloat(Math.min(100, Math.max(98.5, prev.successRate.value + (Math.random() * 0.1 - rateDrop))).toFixed(1)),
          change: parseFloat((Math.random() * 0.5).toFixed(1)),
          isPositive: Math.random() > 0.4
        };

        // Latency fluctuates between 30 and 60
        newStats.latency = {
          value: Math.round(Math.min(60, Math.max(30, prev.latency.value + (Math.random() * 6 - 3)))),
          change: parseFloat((Math.random() * 10).toFixed(1)),
          isPositive: Math.random() > 0.5
        };

        // Alerts go up and down
        newStats.alerts = {
          value: Math.max(0, Math.round(prev.alerts.value + (Math.random() * 2 - 1))),
          change: parseFloat((Math.random() * 5).toFixed(1)),
          isPositive: Math.random() > 0.7
        };

        return newStats;
      });
      setLastSync(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-brand font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-200 to-gray-400 uppercase tracking-tighter">
            Command Center
          </h2>
          <p className="text-slate-400 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] max-w-lg">
            Real-time telemetry and predictive threat analysis across global clusters.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
           <div className="flex flex-col items-end">
             <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Master Node Status</span>
             <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active & Operational</span>
           </div>
           <button className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto text-[10px] font-bold uppercase tracking-widest px-6">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Force Sync
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Active Clusters" value={stats.clusters.value} change={stats.clusters.change} isPositive={stats.clusters.isPositive} delay={100} />
        <StatCard title="Security Alerts" value={stats.alerts.value} change={stats.alerts.change} isPositive={stats.alerts.isPositive} delay={200} />
        <StatCard title="Global Success" value={stats.successRate.value} change={stats.successRate.change} isPositive={stats.successRate.isPositive} delay={300} unit="%" />
        <StatCard title="Avg Latency" value={stats.latency.value} change={stats.latency.change} isPositive={stats.latency.isPositive} delay={400} unit="ms" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="card p-4 sm:p-6 lg:col-span-2 relative overflow-hidden group">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl group-hover:bg-brand-500/10 transition-colors duration-700"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10">
            <div className="flex flex-col">
              <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">Network Traffic Topology</h3>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Global Mesh Network Analysis</p>
            </div>
            <div className="flex gap-1 sm:gap-2 text-[10px] font-bold uppercase tracking-widest">
              <span className="px-3 py-1.5 bg-white/5 rounded-lg text-slate-400 cursor-pointer hover:text-brand-300 hover:bg-brand-500/10 transition-all">1H</span>
              <span className="px-3 py-1.5 bg-brand-500/10 text-brand-400 rounded-lg border border-brand-500/20 cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.1)]">24H</span>
              <span className="px-3 py-1.5 bg-white/5 rounded-lg text-slate-400 cursor-pointer hover:text-brand-300 hover:bg-brand-500/10 transition-all">7D</span>
            </div>
          </div>
          
          <div className="h-48 sm:h-64 relative rounded-2xl border border-white/5 bg-[#020617]/50 backdrop-blur-sm overflow-hidden group/chart">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
             <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-brand-500/5 to-transparent"></div>
             
             {/* Data Points / Indicators */}
             <div className="absolute top-4 right-4 flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                 <span className="text-[9px] font-mono text-slate-400 uppercase">Incoming</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyber-pink shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>
                 <span className="text-[9px] font-mono text-slate-400 uppercase">Outgoing</span>
               </div>
             </div>

             <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
               <motion.path 
                 animate={{ d: [
                   "M0,80 Q10,70 20,80 T40,60 T60,70 T80,30 T100,50 L100,100 L0,100 Z",
                   "M0,75 Q15,65 25,75 T45,55 T65,65 T85,35 T100,45 L100,100 L0,100 Z",
                   "M0,80 Q10,70 20,80 T40,60 T60,70 T80,30 T100,50 L100,100 L0,100 Z"
                 ]}}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 className="drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]" 
                 fill="rgba(6,182,212,0.05)" 
                 stroke="#06b6d4" 
                 strokeWidth="0.5"
               />
               <motion.path 
                 animate={{ d: [
                   "M0,90 Q15,80 30,85 T60,60 T80,80 T100,40",
                   "M0,85 Q20,75 35,80 T65,55 T85,75 T100,35",
                   "M0,90 Q15,80 30,85 T60,60 T80,80 T100,40"
                 ]}}
                 transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                 className="drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
                 fill="none" 
                 stroke="#a855f7" 
                 strokeWidth="0.5"
               />
             </svg>

             {/* Scanned Line Effect */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-500/10 to-transparent w-20 animate-scan"></div>
          </div>
        </div>
        
        <div className="card p-0 overflow-hidden flex flex-col relative group">
          <div className="p-4 sm:p-6 border-b border-white/5 bg-slate-900/10 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">Event Stream</h3>
              <div className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
              </div>
            </div>
          </div>
          <div className="p-3 sm:p-4 flex-grow space-y-1 overflow-y-auto max-h-[320px] custom-scrollbar">
            {[
               { id: 1, type: 'deploy', msg: 'v2.5.0 deployed to eu-west', time: '2m', color: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10' },
               { id: 2, type: 'alert', msg: 'CPU spike on auth-service', time: '15m', color: 'text-rose-400', bg: 'bg-rose-500/10' },
               { id: 3, type: 'info', msg: 'Database backup completed', time: '1h', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
               { id: 4, type: 'deploy', msg: 'v2.4.9 deployed to us-east', time: '3h', color: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10' },
               { id: 5, type: 'security', msg: 'Failed login attempt: IP 192.x.x.4', time: '4h', color: 'text-amber-400', bg: 'bg-amber-500/10' },
            ].map((event) => (
              <div key={event.id} className="group p-2 sm:p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer flex gap-3 items-start border border-transparent hover:border-white/5">
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${event.bg} border border-current ${event.color} group-hover:animate-ping`}></div>
                <div className="flex-grow">
                  <p className="text-xs sm:text-sm text-slate-300 group-hover:text-white transition-colors leading-relaxed">{event.msg}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 font-bold uppercase tracking-widest">{event.time} ago</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-white/5 text-center cursor-pointer hover:bg-brand-500/10 transition-all border-t border-white/5 group-hover:bg-white/10">
             <span className="text-[10px] font-bold font-mono text-brand-400 uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">
               Access Telemetry Logs {'>'}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
