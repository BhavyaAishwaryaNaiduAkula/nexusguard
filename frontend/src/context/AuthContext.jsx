import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('nexus_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  // Restore user from localStorage on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Persist sessions
  useEffect(() => {
    localStorage.setItem('nexus_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Activity Tracking
  useEffect(() => {
    if (!user) return;

    const updateActivity = () => {
      setSessions(prev => prev.map(s => 
        s.email === user.email 
          ? { ...s, lastActive: Date.now(), status: 'Active' } 
          : s
      ));
    };

    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('scroll', updateActivity);

    const checkIdle = setInterval(() => {
      const now = Date.now();
      setSessions(prev => prev.map(s => {
        const idleTime = now - s.lastActive;
        if (idleTime > 300000) return { ...s, status: 'Away' }; // 5 mins
        if (idleTime > 60000) return { ...s, status: 'Idle' }; // 1 min
        return s;
      }));
    }, 10000);

    return () => {
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      clearInterval(checkIdle);
    };
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      
      if (res.status === 200) {
        const userData = {
          email,
          role: res.data.role || "standard"
        };
        
        const newSession = {
          id: Math.random().toString(36).substr(2, 9),
          email: email,
          userAgent: navigator.userAgent.split(') ')[0] + ')',
          ip: '192.168.1.' + Math.floor(Math.random() * 255),
          startTime: new Date().toISOString(),
          lastActive: Date.now(),
          status: 'Active'
        };

        setUser(userData);
        setSessions(prev => [newSession, ...prev.filter(s => s.email !== email)]);
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('nexus_token', 'active-session');
      }
      
      return res;
    } catch (err) {
      if (err.response) return err.response;
      throw err;
    }
  };

  const logout = () => {
    if (user) {
      setSessions(prev => prev.filter(s => s.email !== user.email));
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('nexus_token');
  };

  const terminateSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, sessions, terminateSession }}>
      {children}
    </AuthContext.Provider>
  );
};
