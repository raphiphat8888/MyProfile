import { fetch } from 'expo/fetch';

import { CLOUD_API_URL } from '@/services/products-api';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthResult = { token: string; user: AuthUser };

export async function login(email: string, password: string): Promise<AuthResult> {
  const response = await fetch(`${CLOUD_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  const data = await response.json() as AuthResult | { message?: string };
  if (!response.ok || !('token' in data)) {
    throw new Error('message' in data && data.message ? data.message : 'Login failed. Please try again.');
  }
  return data;
}
