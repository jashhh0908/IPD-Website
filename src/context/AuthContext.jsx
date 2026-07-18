import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSession() {
      try {
        const sessionUser = await authService.getCurrentUser();
        if (sessionUser) {
          setUser(sessionUser);
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  const login = async (userId, password) => {
    setError(null);
    try {
      const loggedUser = await authService.login(userId, password);
      setUser(loggedUser);
      localStorage.setItem('sentry_session', JSON.stringify(loggedUser));
      return loggedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sentry_session');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
