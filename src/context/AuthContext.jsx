import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('preproute_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('preproute_token');
      if (!token) {
        setInitializing(false);
        return;
      }
      
      try {
        const { data } = await api.get('/auth/me');
        if (data.success && data.data.user) {
          const normalized = data.data.user;
          setUser(normalized);
          localStorage.setItem('preproute_user', JSON.stringify(normalized));
        } else {
          // Token invalid
          localStorage.removeItem('preproute_token');
          localStorage.removeItem('preproute_user');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('preproute_token');
        localStorage.removeItem('preproute_user');
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };
    
    initAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      console.log('Attempting login for user:', username);
      const { data } = await api.post('/auth/login', { username, password });
      
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }
      
      localStorage.setItem('preproute_token', data.data.token);
      localStorage.setItem('preproute_user', JSON.stringify(data.data.user));
      setUser(data.data.user);
      console.log('Login successful for user:', username);
      return data.data.user;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || error.data?.message || 'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('preproute_token');
    localStorage.removeItem('preproute_user');
    setUser(null);
  };

  const value = useMemo(() => ({ 
    user, 
    loading, 
    login, 
    logout, 
    isAuthenticated: Boolean(user),
    initializing 
  }), [user, loading, initializing]);
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};