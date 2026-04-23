import React, { createContext, useState, useContext, useEffect } from 'react';

const WorkflowContext = createContext();

export const useWorkflows = () => useContext(WorkflowContext);

export const WorkflowProvider = ({ children }) => {
  const [pipelines, setPipelines] = useState([
    { id: 'p1', name: 'auth-service-prod', status: 'Healthy', version: 'v2.5.1', time: '4m 20s', type: 'Production' },
    { id: 'p2', name: 'billing-gateway-prod', status: 'Healthy', version: 'v2.5.2', time: '2m 15s', type: 'Production' },
    { id: 'p3', name: 'data-mesh-sync', status: 'Warning', version: 'v1.0.4', time: '12m 45s', type: 'Internal' }
  ]);

  const addPipeline = (name) => {
    const newPipeline = {
      id: `p${Date.now()}`,
      name: name,
      status: 'Healthy',
      version: 'v1.0.0',
      time: 'Just now',
      type: 'On-Demand'
    };
    setPipelines(prev => [newPipeline, ...prev]);
  };

  const deletePipeline = (id) => {
    setPipelines(prev => prev.filter(p => p.id !== id));
  };

  return (
    <WorkflowContext.Provider value={{ pipelines, addPipeline, deletePipeline }}>
      {children}
    </WorkflowContext.Provider>
  );
};
