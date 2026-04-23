import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useWorkflows } from '../context/WorkflowContext';

const Pipelines = () => {
  const { pipelines, addPipeline, deletePipeline } = useWorkflows();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pipelineName, setPipelineName] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  const handleCreatePipeline = (e) => {
    e.preventDefault();
    console.log("[Pipelines] Intercepted submission for:", pipelineName);

    if (!pipelineName.trim()) {
      console.warn("[Pipelines] Aborting: Empty identifier detected.");
      toast.error('Please enter a pipeline name');
      return;
    }

    setIsDeploying(true);
    console.log("[Pipelines] Synthesis initiated...");
    
    // Simulate deployment process
    setTimeout(() => {
      console.log("[Pipelines] Manifesting pipeline:", pipelineName);
      addPipeline({
        name: pipelineName,
        type: 'Production',
        status: 'Healthy',
        version: 'v1.0.0',
        time: '0s'
      });
      
      setIsDeploying(false);
      setPipelineName('');
      setIsModalOpen(false);
      console.log("[Pipelines] System stable. Provisioning complete.");
      
      toast.success(`${pipelineName} Provisioned Successfully`, {
        icon: '🚀',
        style: { background: '#0f172a', color: '#10b981', border: '1px solid #064e3b' }
      });
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-brand font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-200 to-gray-400 uppercase tracking-tighter">
            Deployment <span className="text-brand-500">Pipelines</span>
          </h2>
          <p className="text-slate-400 font-mono text-xs uppercase tracking-[0.2em]">Automated CI/CD Workflows</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workflows List */}
        <div className="card p-6 border-brand-500/10 lg:col-span-2 bg-slate-900/20 backdrop-blur">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Active Workflows</h3>
            <span className="text-[10px] text-brand-400 font-mono font-bold uppercase tracking-widest">{pipelines.length} Systems Running</span>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence mode="popLayout">
              {pipelines.map((p) => (
                <motion.div 
                  layout
                  key={p.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between p-4 bg-[#020617]/50 rounded-2xl border border-white/5 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${(p.status || 'Healthy') === 'Healthy' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'} shadow-[0_0_10px_rgba(99,102,241,0.3)]`}></div>
                    <div>
                      <p className="text-sm text-white font-bold group-hover:text-brand-400 transition-colors">{p.name || 'Unknown'}</p>
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        {p.version || 'v0.0.0'} • {(p.status || 'Active').toUpperCase()} • {p.type || 'Standard'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-white font-mono font-bold">{p.time}</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-tighter">Last Run</p>
                    </div>
                    <button 
                      onClick={() => {
                        deletePipeline(p.id);
                        toast.error(`${p.name} Terminated`);
                      }}
                      className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {pipelines.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-slate-600 font-mono text-[10px] uppercase tracking-widest font-bold">No Active Deployment Pipelines</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="card p-8 border-brand-500/10 flex flex-col justify-center items-center text-center space-y-6 group hover:border-brand-500/30 transition-all relative overflow-hidden bg-gradient-to-br from-brand-500/5 to-transparent">
          <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 90 }}
            className="w-20 h-20 rounded-3xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)] relative z-10"
          >
            <svg className="w-10 h-10 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </motion.div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Initialize Workflow</h3>
            <p className="text-sm text-slate-400 mt-2 font-medium">Configure a new CI/CD pipeline for your microservices architecture.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary w-full relative z-10 shadow-lg shadow-brand-500/20 active:scale-95 transition-transform"
          >
            Create New Pipeline
          </button>
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeploying && setIsModalOpen(false)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="card w-full max-w-lg p-8 border-brand-500/20 relative z-10 shadow-2xl"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-brand font-bold text-white uppercase tracking-tighter">New Pipeline Configuration</h3>
                <p className="text-slate-400 text-sm mt-1">Define parameters for your automated deployment.</p>
              </div>

              <form onSubmit={handleCreatePipeline} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                    Pipeline Identifier
                  </label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. auth-service-production"
                    value={pipelineName}
                    onChange={(e) => setPipelineName(e.target.value)}
                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-4 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 opacity-50">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">Environment</p>
                    <p className="text-xs text-white font-bold">Production</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 opacity-50">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">Runtime</p>
                    <p className="text-xs text-white font-bold">Node.js / Docker</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isDeploying}
                    className="flex-1 px-6 py-4 rounded-xl border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDeploying}
                    className="flex-[2] btn-primary py-4 text-xs font-bold uppercase tracking-widest shadow-lg shadow-brand-500/20 flex items-center justify-center gap-3"
                  >
                    {isDeploying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      'Deploy Workflow'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pipelines;
