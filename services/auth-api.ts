import { fetch } from 'expo/fetch';

import { CLOUD_API_URL } from '@/services/products-api';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
};

export type AuthResult = { token: string; user: AuthUser };

function getErrorMessage(data: unknown, fallback: string) {
  if (typeof data === 'object' && data !== null) {
    if ('message' in data && typeof data.message === 'string') {
      return data.message;
    }
    if ('error' in data && typeof data.error === 'string') {
      return data.error;
    }
  }

  return fallback;
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const response = await fetch(`${CLOUD_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  const data = await response.json() as AuthResult | { message?: string; error?: string };
  if (!response.ok || !('token' in data)) {
    throw new Error(getErrorMessage(data, 'Login failed. Please try again.'));
  }
  return data;
}

export async function register(name: string, email: string, password: string): Promise<AuthResult> {
  const response = await fetch(`${CLOUD_API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
  });

  const data = await response.json() as AuthResult | { message?: string; error?: string };
  if (!response.ok || !('token' in data)) {
    throw new Error(getErrorMessage(data, 'Register failed. Please try again.'));
  }
  return data;
}
