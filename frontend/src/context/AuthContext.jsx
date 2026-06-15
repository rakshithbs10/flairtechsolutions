// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // true while verifying token on mount

  // On app load, restore session from localStorage
  useEffect(() => {
    try {
      const token = localStorage.getItem('fts_token');
      if (!token) {
        setLoading(false);
        return;
      }
      authApi.me()
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('fts_token');
          localStorage.removeItem('fts_user');
        })
        .finally(() => setLoading(false));
    } catch (e) {
      setLoading(false);
    }
  }, []);

  function login(token, userData) {
    localStorage.setItem('fts_token', token);
    localStorage.setItem('fts_user', JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('fts_token');
    localStorage.removeItem('fts_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
