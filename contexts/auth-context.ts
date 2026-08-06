import { createContext } from 'react';

import type { AuthUser } from '@/services/auth-api';

export type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
