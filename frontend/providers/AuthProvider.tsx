import { type PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { AuthContext } from '@/contexts/auth-context';
import { login as loginToApi, register as registerToApi, type AuthUser } from '@/services/auth-api';

type StoredSession = {
  token: string;
  user: AuthUser;
};

const STORAGE_KEY = 'pokemon-takt-shop-auth';
const MOCK_ADMIN_EMAIL = 'admin@pokemon-takt.shop';
const MOCK_ADMIN_PASSWORD = 'Admin@1234';
const MOCK_ADMIN_TOKEN = 'mock-admin-token';

const mockAdminSession: StoredSession = {
  token: MOCK_ADMIN_TOKEN,
  user: {
    id: '1',
    name: 'Takt Admin (Mock)',
    email: MOCK_ADMIN_EMAIL,
    role: 'admin',
  },
};

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
    try {
      const result = await loginToApi(email, password);
      setToken(result.token);
      setUser(result.user);
      writeStoredSession(result);
      return result.user;
    } catch (error) {
      const canUseMockAdmin =
        process.env.NODE_ENV !== 'production' &&
        email.trim().toLowerCase() === MOCK_ADMIN_EMAIL &&
        password === MOCK_ADMIN_PASSWORD;

      if (!canUseMockAdmin) {
        throw error;
      }

      setToken(mockAdminSession.token);
      setUser(mockAdminSession.user);
      writeStoredSession(mockAdminSession);
      return mockAdminSession.user;
    }
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
