import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SystemContext = createContext();

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within a SystemProvider');
  return context;
};

export const SystemProvider = ({ children }) => {
  // --- PIPELINES STATE ---
  const [pipelines, setPipelines] = useState([
    { id: 'p1', name: 'auth-service-prod', status: 'Healthy', version: 'v2.5.1', time: '4m 20s', type: 'Production', lastRun: '2 mins ago' },
    { id: 'p2', name: 'billing-gateway-prod', status: 'Healthy', version: 'v2.5.2', time: '2m 15s', type: 'Production', lastRun: '15 mins ago' },
    { id: 'p3', name: 'data-mesh-sync', status: 'Warning', version: 'v1.0.4', time: '12m 45s', type: 'Internal', lastRun: '1 hour ago' }
  ]);

  // --- CLUSTERS STATE ---
  const [clusters, setClusters] = useState([
    { id: 'eu-west', name: 'EU-West-Core', status: 'Healthy', nodes: 12, maxNodes: 15, cpu: 42, memory: 58, region: 'Ireland' },
    { id: 'us-east', name: 'US-East-Edge', status: 'Healthy', nodes: 24, maxNodes: 30, cpu: 65, memory: 72, region: 'N. Virginia' },
    { id: 'ap-south', name: 'AP-South-Internal', status: 'Warning', nodes: 8, maxNodes: 10, cpu: 88, memory: 92, region: 'Mumbai' }
  ]);

  // --- LOGS / OBSERVABILITY ---
  const [logs, setLogs] = useState([
    { id: 1, type: 'deploy', msg: 'v2.5.1 deployed to eu-west', time: 'Just now', color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { id: 2, type: 'alert', msg: 'High memory usage on ap-south', time: '5m ago', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 3, type: 'info', msg: 'Auto-scaling triggered: +2 nodes', time: '12m ago', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
  ]);

  // --- SYSTEM STATS ---
  const [stats, setStats] = useState({
    uptime: '99.998%',
    activeDeployments: 42,
    threatsBlocked: 1204,
    latency: '24ms'
  });

  // --- ACTIONS ---
  const addPipeline = (pipeline) => {
    const newP = { ...pipeline, id: `p${Date.now()}`, lastRun: 'Just now' };
    setPipelines(prev => [newP, ...prev]);
    addLog('deploy', `New pipeline initialized: ${pipeline.name}`, 'text-brand-400');
  };

  const deletePipeline = (id) => {
    setPipelines(prev => prev.filter(p => p.id !== id));
  };

  const addLog = (type, msg, color) => {
    const newLog = { id: Date.now(), type, msg, time: 'Just now', color, bg: `${color.split('-')[1]}-500/10` };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const updateCluster = (id, updates) => {
    setClusters(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // --- REAL-TIME SIMULATION ---
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update CPU/Memory for clusters
      setClusters(prev => prev.map(c => ({
        ...c,
        cpu: Math.max(10, Math.min(99, c.cpu + (Math.random() * 10 - 5))),
        memory: Math.max(10, Math.min(99, c.memory + (Math.random() * 6 - 3)))
      })));

      // Occasional random log
      if (Math.random() > 0.8) {
        const eventType = Math.random() > 0.5 ? 'info' : 'alert';
        const msg = eventType === 'info' ? 'System health check completed' : 'Latent request detected in Gateway';
        addLog(eventType, msg, eventType === 'info' ? 'text-emerald-400' : 'text-amber-400');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const [scalingConfig, setScalingConfig] = useState({
    cpuThreshold: 85,
    memoryThreshold: 90,
    minNodes: 3,
    maxNodes: 45,
    predictiveScaling: true
  });

  const updateScalingConfig = (newConfig) => {
    setScalingConfig(prev => ({ ...prev, ...newConfig }));
    addLog('info', 'Scaling parameters updated globally', 'text-brand-400');
  };

  const value = {
    pipelines,
    clusters,
    logs,
    stats,
    scalingConfig,
    updateScalingConfig,
    addPipeline,
    deletePipeline,
    updateCluster,
    addLog
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};
