import { type PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { AuthContext } from '@/contexts/auth-context';
import { login as loginToApi, register as registerToApi, type AuthUser } from '@/services/auth-api';

type StoredSession = {
  token: string;
  user: AuthUser;
};

const STORAGE_KEY = 'pokemon-takt-shop-auth';

function readStoredSession(): StoredSession | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as StoredSession : null;
  } catch {
    return null;
  }
}

function writeStoredSession(session: StoredSession | null) {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = readStoredSession();
    if (session?.token && session.user) {
      setToken(session.token);
      setUser(session.user);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginToApi(email, password);
    setToken(result.token);
    setUser(result.user);
    writeStoredSession(result);
    return result.user;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await registerToApi(name, email, password);
    setToken(result.token);
    setUser(result.user);
    writeStoredSession(result);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    writeStoredSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [loading, login, logout, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
