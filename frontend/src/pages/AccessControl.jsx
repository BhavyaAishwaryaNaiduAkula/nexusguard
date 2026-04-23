import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AccessControl = () => {
  const [users] = useState([
    { id: '1', name: 'Admin', email: 'admin@gmail.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Dev Ops', email: 'dev@nexus.com', role: 'User', status: 'Active' },
    { id: '3', name: 'Security Auditor', email: 'audit@nexus.com', role: 'Auditor', status: 'Inactive' }
  ]);

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
        <button className="btn-primary px-8 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 border-brand-500/10 bg-gradient-to-br from-brand-500/5 to-transparent">
            <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-4">Permission Matrix</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              NexusGuard utilizes an Attribute-Based Access Control (ABAC) system for enhanced security across clusters.
            </p>
          </div>
          <div className="card p-6 border-white/5 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">Active Sessions</h4>
              <p className="text-3xl font-brand font-bold text-brand-400 mt-2">1,204</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09a13.916 13.916 0 005.151-5.151l.09-.054m6.19-.608L14 14.5m4-4a4 4 0 11-8 0 4 4 0 018 0zM7 11a5 5 0 0110 0c0 1.284-.43 2.47-1.15 3.415" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessControl;
