import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bharathire_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('bharathire_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('bharathire_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data) {
      const { token: jwtToken, ...userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('bharathire_token', jwtToken);
      localStorage.setItem('bharathire_user', JSON.stringify(userData));
      return userData;
    }
  };

  const register = async (data) => {
    const res = await authService.register(data);
    if (res.data) {
      const { token: jwtToken, ...userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('bharathire_token', jwtToken);
      localStorage.setItem('bharathire_user', JSON.stringify(userData));
      return userData;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bharathire_token');
    localStorage.removeItem('bharathire_user');
  };

  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    const currentRole = user.role.startsWith('ROLE_') ? user.role : `ROLE_${user.role}`;
    const targetRole = requiredRole.startsWith('ROLE_') ? requiredRole : `ROLE_${requiredRole}`;
    return currentRole === targetRole;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    hasRole,
    isAuthenticated: !!token && !!user,
    isCandidate: hasRole('ROLE_CANDIDATE'),
    isRecruiter: hasRole('ROLE_RECRUITER'),
    isAdmin: hasRole('ROLE_ADMIN'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
