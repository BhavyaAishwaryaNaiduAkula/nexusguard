import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AccessControl = () => {
  const navigate = useNavigate();
  const { sessions, terminateSession } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [identityStatus, setIdentityStatus] = useState('PENDING');
  const [isProvisioning, setIsProvisioning] = useState(false);
  
  const [permissions, setPermissions] = useState(() => {
    const saved = localStorage.getItem('nexus_perms');
    return saved ? JSON.parse(saved) : {
      read_logs: true,
      exec_pipe: true,
      manage_clusters: false,
      admin_root: false
    };
  });

  const togglePermission = (id) => {
    const next = { ...permissions, [id]: !permissions[id] };
    setPermissions(next);
    localStorage.setItem('nexus_perms', JSON.stringify(next));
    toast.success("Security Policy Updated", {
      icon: '🛡️',
      style: { background: '#0f172a', color: '#818cf8', border: '1px solid #312e81' }
    });
  };

  const [users] = useState([
    { id: '1', name: 'Admin', email: 'admin@gmail.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Dev Ops', email: 'dev@nexus.com', role: 'User', status: 'Active' },
    { id: '3', name: 'Security Auditor', email: 'audit@nexus.com', role: 'Auditor', status: 'Inactive' }
  ]);

  const handleCreateIdentity = () => {
    setIdentityStatus('PENDING');
    setIsModalOpen(true);
  };

  const handleProvision = async () => {
    setIsProvisioning(true);
    setIdentityStatus('CREATING');
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const newIdentity = {
      id: Date.now().toString(),
      role: 'Identity_User',
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('last_created_identity', JSON.stringify(newIdentity));
    setIdentityStatus('ACTIVE');
    setIsProvisioning(false);
    
    toast.success("Identity Manifested Successfully", {
      icon: '🆔',
      style: { background: '#0f172a', color: '#10b981', border: '1px solid #064e3b' }
    });

    setTimeout(() => {
      setIsModalOpen(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-brand font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-200 to-gray-400 uppercase tracking-tighter">
            Access Control
          </h2>
          <p className="text-slate-400 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] max-w-lg">
            Manage system-wide permissions & identity governance.
          </p>
        </div>
        <button 
          onClick={handleCreateIdentity}
          className="btn-primary px-8 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl active:scale-95 transition-transform"
        >
          Create New Identity
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="card p-0 overflow-hidden border-brand-500/10">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Identity Registry</h3>
            <div className="flex items-center gap-3 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Database Online</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Identity</th>
                  <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Access Level</th>
                  <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">System Status</th>
                  <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-brand-400 font-brand text-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">{user.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${
                        user.role === 'Admin' ? 'text-brand-400 bg-brand-500/10 border-brand-500/20' : 'text-slate-400 bg-white/5 border-white/10'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                        <span className="text-xs text-slate-400 font-medium">{user.status}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Permission Matrix */}
          <div className="card p-6 border-brand-500/10 bg-gradient-to-br from-brand-500/5 to-transparent">
            <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-6 flex items-center justify-between">
              Permission Matrix
              <span className="text-[9px] text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20 uppercase tracking-widest font-mono">ABAC Active</span>
            </h4>
            
            <div className="space-y-4">
              {[
                { id: 'read_logs', label: 'Telemetry Access', desc: 'Read-only access to system logs' },
                { id: 'exec_pipe', label: 'Pipeline Execution', desc: 'Trigger CI/CD workflows' },
                { id: 'manage_clusters', label: 'Cluster Governance', desc: 'Scale and provision nodes' },
                { id: 'admin_root', label: 'Root Privileges', desc: 'Full administrative control' }
              ].map((perm) => (
                <div key={perm.id} className="flex items-center justify-between group">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-white group-hover:text-brand-400 transition-colors">{perm.label}</p>
                    <p className="text-[9px] text-slate-500 font-medium">{perm.desc}</p>
                  </div>
                  <button 
                    onClick={() => togglePermission(perm.id)}
                    className={`w-10 h-5 rounded-full transition-all duration-300 relative ${
                      permissions[perm.id] ? 'bg-brand-500' : 'bg-slate-800'
                     }`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${
                      permissions[perm.id] ? 'left-6' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Provisioning Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="card w-full max-w-lg p-8 border-brand-500/20 relative z-10 shadow-2xl"
            >
              <h3 className="text-2xl font-brand font-bold text-white uppercase tracking-tighter mb-2">Initialize Identity</h3>
              <p className="text-slate-400 text-sm mb-8 font-medium">Configure administrative credentials for the autonomous guardian network.</p>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border transition-all duration-500 ${
                  identityStatus === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30' : 
                  identityStatus === 'CREATING' ? 'bg-brand-500/10 border-brand-500/30 animate-pulse' : 
                  'bg-white/5 border-white/5'
                }`}>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Current Status</span>
                  <span className={`text-xs font-mono uppercase font-bold ${
                    identityStatus === 'ACTIVE' ? 'text-emerald-400' : 
                    identityStatus === 'CREATING' ? 'text-brand-400' : 
                    'text-slate-500'
                  }`}>
                    {identityStatus}
                  </span>
                </div>

                {identityStatus === 'PENDING' && (
                  <button 
                    onClick={handleProvision}
                    disabled={isProvisioning}
                    className="w-full btn-primary py-4 text-xs font-bold uppercase tracking-widest shadow-lg shadow-brand-500/20 group flex items-center justify-center gap-3"
                  >
                    Generate Secure Identity
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </button>
                )}

                {identityStatus === 'CREATING' && (
                  <div className="w-full py-4 bg-slate-900/50 rounded-xl border border-white/5 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-brand-400">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Synthesizing...
                  </div>
                )}

                {identityStatus === 'ACTIVE' && (
                  <div className="w-full py-4 bg-emerald-500/20 rounded-xl border border-emerald-500/30 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-emerald-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Identity Verified
                  </div>
                )}
                
                <button 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isProvisioning}
                  className="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                  Cancel Protocol
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccessControl;
