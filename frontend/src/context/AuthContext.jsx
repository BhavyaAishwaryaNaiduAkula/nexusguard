import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nexus_token'));
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial load
  useEffect(() => {
    const initializeAuth = () => {
      const savedToken = localStorage.getItem('nexus_token');
      const savedUser = localStorage.getItem('nexus_user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Login handler
   */
  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      
      if (res.status === 200) {
        const { token, user } = res.data;
        
        // Update state
        setToken(token);
        setUser(user);
        
        // Persist
        localStorage.setItem('nexus_token', token);
        localStorage.setItem('nexus_user', JSON.stringify(user));
      }
      
      return res;
    } catch (err) {
      if (err.response) return err.response;
      throw err;
    }
  };

  /**
   * Signup handler
   */
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/signup', { name, email, password });
      
      if (res.status === 200) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('nexus_token', token);
        localStorage.setItem('nexus_user', JSON.stringify(user));
      }
      
      return res;
    } catch (err) {
      if (err.response) return err.response;
      throw err;
    }
  };

  /**
   * Logout handler
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
