import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Activity, Zap, Shield } from 'lucide-react';

const NetworkTopology = () => {
  const [timeFilter, setTimeFilter] = useState('1H');
  const [data, setData] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [viewOffset, setViewOffset] = useState(0);

  // Handle time filter & view offset changes
  useEffect(() => {
    const generateFilteredData = () => {
      const points = [];
      const now = Date.now() - (viewOffset * 300000); // Shift time based on offset (5min chunks)
      let count = 40;
      let interval = 5000; // 5s for 1H

      if (timeFilter === '24H') {
        count = 60;
        interval = 1440000; // 24m for 24H
      } else if (timeFilter === '7D') {
        count = 80;
        interval = 7560000; // 2.1h for 7D
      }

      for (let i = count; i >= 0; i--) {
        points.push({
          time: new Date(now - i * interval).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            ...(timeFilter === '1H' && { second: '2-digit' }) 
          }),
          incoming: Math.floor(Math.random() * 40) + 20,
          outgoing: Math.floor(Math.random() * 30) + 15,
          timestamp: now - i * interval
        });
      }
      return points;
    };

    setData(generateFilteredData());
  }, [timeFilter, viewOffset]);

  // Live simulation
  useEffect(() => {
    if (!isLive || viewOffset !== 0) return;

    const interval = setInterval(() => {
      setData(prev => {
        if (!prev.length) return prev;
        const lastPoint = prev[prev.length - 1];
        const newTimestamp = Date.now();
        const newPoint = {
          time: new Date(newTimestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          }),
          incoming: Math.max(10, Math.min(100, lastPoint.incoming + (Math.random() * 20 - 10))),
          outgoing: Math.max(10, Math.min(80, lastPoint.outgoing + (Math.random() * 16 - 8))),
          timestamp: newTimestamp
        };
        return [...prev.slice(1), newPoint];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive, viewOffset]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length >= 2) {
      const incoming = payload[0]?.value ?? 0;
      const outgoing = payload[1]?.value ?? 0;

      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl">
          <p className="text-[10px] font-mono text-slate-500 mb-2 font-bold uppercase">{label || 'Unknown Time'}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
              <span className="text-[11px] font-bold text-white uppercase tracking-tighter">
                Incoming: {typeof incoming === 'number' ? incoming.toFixed(1) : '0.0'} GB/s
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tighter">
                Outgoing: {typeof outgoing === 'number' ? outgoing.toFixed(1) : '0.0'} GB/s
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleNavigate = (direction) => {
    setIsLive(false); // Pause live stream when navigating history
    setViewOffset(v => direction === 'next' ? Math.max(0, v - 1) : v + 1);
  };

  if (!data || data.length === 0) {
    return (
      <div className="card h-[400px] border-white/5 bg-slate-900/20 backdrop-blur flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Initializing Telemetry Stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-0 border-white/5 bg-slate-900/20 backdrop-blur overflow-hidden group">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isLive && viewOffset === 0 ? 'bg-brand-500 animate-pulse' : 'bg-slate-700'}`}></div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            Network Topology <Activity className="w-3.5 h-3.5 text-brand-400" />
          </h3>
        </div>

        <div className="flex items-center gap-4 bg-black/20 p-1 rounded-xl border border-white/5">
          {['1H', '24H', '7D'].map((f) => (
            <button
              key={f}
              onClick={() => {
                setTimeFilter(f);
                setViewOffset(0);
              }}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                timeFilter === f 
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="h-[250px] sm:h-[350px] lg:h-[400px] w-full p-2 sm:p-6 relative">
        <div className="absolute top-4 sm:top-8 right-4 sm:right-8 flex gap-2 z-10">
          {viewOffset !== 0 && (
            <button 
              onClick={() => {
                setViewOffset(0);
                setIsLive(true);
              }}
              className="px-2 sm:px-3 py-1 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest"
            >
              Back to Live
            </button>
          )}
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`px-2 sm:px-3 py-1 rounded-lg border text-[8px] sm:text-[9px] font-bold uppercase tracking-widest transition-all ${
              isLive && viewOffset === 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-white/5'
            }`}
          >
            {isLive && viewOffset === 0 ? 'Live' : 'Paused'}
          </button>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOutgoing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontSize: 8, fontWeight: 'bold' }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontSize: 8, fontWeight: 'bold' }}
              hide={window.innerWidth < 640}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="incoming" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorIncoming)" 
              animationDuration={1500}
            />
            <Area 
              type="monotone" 
              dataKey="outgoing" 
              stroke="#a855f7" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorOutgoing)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Navigation Controls */}
      <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-black/10">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-brand-400" />
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Peak: 94.2 GB/s</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Safe Nodes: 42</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => handleNavigate('prev')}
            className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:border-brand-500/20 transition-all active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleNavigate('next')}
            disabled={viewOffset === 0}
            className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:border-brand-500/20 transition-all active:scale-90 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkTopology;
