import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthUser, LoginRequestDto } from '../types/auth.types.ts';
import { authApi } from '../features/auth/api/authApi.ts';
import { storage } from '../utils/storage.ts';
import { decodeJwt, isTokenExpired } from '../utils/jwt.ts';

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequestDto) => Promise<void>;
  logout: () => void;
}

//AuthContext.tsx owns the current authentication state,
// restores it when the app starts, updates it after login/logout, and reacts when the backend says the token is invalid.

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore existing session from storage on app load
  useEffect(() => {
    try {
      const savedToken = storage.getToken();
      if (savedToken && !isTokenExpired(savedToken)) {
        const decoded = decodeJwt(savedToken);
        if (decoded) {
          setUser(decoded);
          setToken(savedToken);
        } else {
          storage.clearToken();
        }
      } else if (savedToken) {
        // Token was expired
        storage.clearToken();
      }
    } catch {
      storage.clearToken();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen for 401 unauthorized events from apiClient
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    // when client.ts emits unauthorized this part here catches it
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequestDto): Promise<void> => {
    const response = await authApi.login(credentials);
    const jwtToken = response.token;

    if (!jwtToken) {
      throw new Error('Authentication failed: No token received.');
    }

    const decoded = decodeJwt(jwtToken);
    if (!decoded) {
      throw new Error('Authentication failed: Unable to decode server token.');
    }

    storage.setToken(jwtToken);
    setToken(jwtToken);
    setUser(decoded);
  }, []);

  const logout = useCallback((): void => {
    storage.clearToken();
    setUser(null);
    setToken(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'Admin',
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
