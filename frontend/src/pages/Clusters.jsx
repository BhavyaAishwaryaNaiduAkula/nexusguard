import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystem } from '../context/SystemContext';

const ClusterCard = ({ cluster }) => {
  const statusColors = {
    'Healthy': 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    'Warning': 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    'Error': 'text-rose-400 border-rose-500/20 bg-rose-500/5',
    'Critical': 'text-rose-400 border-rose-500/20 bg-rose-500/5'
  };

  return (
    <motion.div 
      layout
      whileHover={{ y: -5 }}
      className="card p-6 border-white/5 hover:border-brand-500/20 bg-slate-900/40 backdrop-blur transition-all relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-brand font-bold text-white tracking-tight group-hover:text-brand-400 transition-colors">{cluster.name}</h3>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">{cluster.region}</p>
        </div>
        <div className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${statusColors[cluster.status] || statusColors['Healthy']}`}>
          {cluster.status}
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        {/* Node Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Allocated Nodes</span>
            <span className="text-white font-mono">{cluster.nodes} / {cluster.maxNodes}</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(cluster.nodes / cluster.maxNodes) * 100}%` }}
              className="h-full bg-brand-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)]"
            />
          </div>
        </div>

        {/* Utilization Gauges */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <span className="text-slate-500">CPU Load</span>
              <span className={cluster.cpu > 80 ? 'text-rose-400' : 'text-slate-300'}>{Math.round(cluster.cpu)}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ 
                  width: `${cluster.cpu}%`,
                  backgroundColor: cluster.cpu > 80 ? '#f43f5e' : '#6366f1'
                }}
                className="h-full rounded-full transition-colors duration-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <span className="text-slate-500">Memory</span>
              <span className={cluster.memory > 80 ? 'text-rose-400' : 'text-slate-300'}>{Math.round(cluster.memory)}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ 
                  width: `${cluster.memory}%`,
                  backgroundColor: cluster.memory > 80 ? '#f43f5e' : '#10b981'
                }}
                className="h-full rounded-full transition-colors duration-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl group-hover:bg-brand-500/10 transition-colors"></div>
    </motion.div>
  );
};

const Clusters = () => {
  const { clusters, scalingConfig, updateScalingConfig } = useSystem();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempConfig, setTempConfig] = useState(scalingConfig);

  const handleOpenModal = () => {
    setTempConfig(scalingConfig);
    setIsModalOpen(true);
  };

  const handleSaveConfig = () => {
    updateScalingConfig(tempConfig);
    setIsModalOpen(false);
    toast.success("Scaling Policy Dispatched", {
      icon: '⚙️',
      style: { background: '#0f172a', color: '#818cf8', border: '1px solid #312e81' }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-brand font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-200 to-gray-400 uppercase tracking-tighter">
            Infrastructure <span className="text-brand-500">Clusters</span>
          </h2>
          <p className="text-slate-400 font-mono text-xs uppercase tracking-[0.2em]">Distributed Resource Mesh</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 px-6 py-2 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Sync: Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {clusters.map(cluster => (
            <ClusterCard key={cluster.id} cluster={cluster} />
          ))}
        </AnimatePresence>
      </div>

      <div className="card p-8 border-brand-500/10 bg-gradient-to-br from-brand-500/5 to-transparent relative overflow-hidden group">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="max-w-2xl">
            <h4 className="text-xl font-brand font-bold text-white uppercase tracking-tight mb-2">Autonomous Scaling Engine</h4>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Active Policy: CPU {'>'} {scalingConfig.cpuThreshold}% triggers auto-expansion up to {scalingConfig.maxNodes} nodes. 
              Predictive scaling is currently {scalingConfig.predictiveScaling ? 'ENABLED' : 'DISABLED'}.
            </p>
          </div>
          <button 
            onClick={handleOpenModal}
            className="btn-primary px-10 py-4 text-xs font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-500/20 whitespace-nowrap active:scale-95 transition-transform"
          >
            Configure Scaling
          </button>
        </div>
      </div>

      {/* Scaling Config Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="card w-full max-w-lg p-8 border-brand-500/20 relative z-10 shadow-2xl"
            >
              <h3 className="text-2xl font-brand font-bold text-white uppercase tracking-tighter mb-6">Scale Parameters</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>CPU Threshold</span>
                    <span className="text-brand-400">{tempConfig.cpuThreshold}%</span>
                  </div>
                  <input 
                    type="range" min="10" max="95" 
                    value={tempConfig.cpuThreshold}
                    onChange={(e) => setTempConfig({...tempConfig, cpuThreshold: parseInt(e.target.value)})}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Max Cluster Nodes</span>
                    <span className="text-brand-400">{tempConfig.maxNodes}</span>
                  </div>
                  <input 
                    type="range" min="5" max="100" 
                    value={tempConfig.maxNodes}
                    onChange={(e) => setTempConfig({...tempConfig, maxNodes: parseInt(e.target.value)})}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Predictive Scaling</span>
                  <button 
                    onClick={() => setTempConfig({...tempConfig, predictiveScaling: !tempConfig.predictiveScaling})}
                    className={`w-10 h-5 rounded-full transition-all relative ${tempConfig.predictiveScaling ? 'bg-brand-500' : 'bg-slate-800'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${tempConfig.predictiveScaling ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={handleSaveConfig}
                    className="flex-1 btn-primary py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Clusters;
