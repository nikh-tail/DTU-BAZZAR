import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { AuthService } from '../services/auth.service.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'SIGNUP' | 'LOGIN';
  openAuthModal: (mode?: 'SIGNUP' | 'LOGIN') => void;
  closeAuthModal: () => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('dtu_bazaar_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'SIGNUP' | 'LOGIN'>('SIGNUP');

  const refreshUser = async () => {
    try {
      const storedToken = localStorage.getItem('dtu_bazaar_token');
      if (!storedToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const res = await AuthService.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
        localStorage.removeItem('dtu_bazaar_token');
        setToken(null);
      }
    } catch {
      setUser(null);
      localStorage.removeItem('dtu_bazaar_token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('dtu_bazaar_token', newToken);
    setToken(newToken);
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    AuthService.logout();
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedFields });
    }
  };

  const openAuthModal = (mode: 'SIGNUP' | 'LOGIN' = 'SIGNUP') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
