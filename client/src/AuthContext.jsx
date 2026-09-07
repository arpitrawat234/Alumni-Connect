import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Validate existing token on mount
  useEffect(() => {
    const stored = localStorage.getItem('jwt');
    if (!stored) {
      setLoading(false);
      return;
    }
    // Verify with backend
    fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${stored}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Invalid token');
        const data = await res.json();
        setUser(data.user);
        setToken(stored);
      })
      .catch(() => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const login = useCallback((newToken, userInfo) => {
    localStorage.setItem('jwt', newToken);
    localStorage.setItem('user', JSON.stringify(userInfo));
    setToken(newToken);
    setUser(userInfo);
    navigate('/dashboard');
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
