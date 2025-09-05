'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getTokenExpiry = (jwt: string): number | null => {
    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      if (typeof payload.exp !== 'number') return null;
      return payload.exp * 1000; // ms
    } catch {
      return null;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setIsAuthenticated(false);
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    router.push('/login');
  }, [router]);

  const scheduleAutoLogout = useCallback((jwt: string) => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    const expiryMs = getTokenExpiry(jwt);
    if (!expiryMs) return;
    const delay = Math.max(0, expiryMs - Date.now());
    if (delay === 0) {
      logout();
      return;
    }
    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, delay);
  }, [logout]);

  useEffect(() => {
    // Verificar si hay un token guardado al cargar la aplicación
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      const expiryMs = getTokenExpiry(savedToken);
      if (expiryMs && expiryMs > Date.now()) {
        setToken(savedToken);
        setIsAuthenticated(true);
        scheduleAutoLogout(savedToken);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
    setInitialized(true);
  }, [scheduleAutoLogout]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        const newToken = e.newValue;
        if (!newToken) {
          setToken(null);
          setIsAuthenticated(false);
          if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
            logoutTimerRef.current = null;
          }
          router.push('/login');
        } else {
          const expiryMs = getTokenExpiry(newToken);
          if (expiryMs && expiryMs > Date.now()) {
            setToken(newToken);
            setIsAuthenticated(true);
            scheduleAutoLogout(newToken);
          } else {
            localStorage.removeItem('auth_token');
            setToken(null);
            setIsAuthenticated(false);
            router.push('/login');
          }
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [router, scheduleAutoLogout]);

  const login = (newToken: string) => {
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    scheduleAutoLogout(newToken);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token, initialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 