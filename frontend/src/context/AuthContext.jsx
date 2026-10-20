import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AUTH_EVENTS, STORAGE_KEYS } from '../constants/storage';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.TOKEN));

  useEffect(() => {
    const handleSessionExpired = () => setToken(null);
    window.addEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired);
    return () => window.removeEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired);
  }, []);

  const login = useCallback(async (credentials) => {
    const nextToken = await authService.login(credentials);
    localStorage.setItem(STORAGE_KEYS.TOKEN, nextToken);
    setToken(nextToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated: Boolean(token), login, logout }),
    [token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider.');
  }
  return context;
}
