'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, usersApi, Role } from '@/lib/api';

interface AuthUser {
  id: string;
  nome: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (telefone: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('clinivet_token');
    if (!token) { setLoading(false); return; }

    usersApi.me()
      .then((u) => setUser(u as AuthUser))
      .catch(() => localStorage.removeItem('clinivet_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (telefone: string, password: string): Promise<AuthUser> => {
    const { access_token, user: u } = await authApi.login(telefone, password);
    localStorage.setItem('clinivet_token', access_token);
    setUser(u as AuthUser);
    return u as AuthUser;
  };

  const logout = () => {
    localStorage.removeItem('clinivet_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
