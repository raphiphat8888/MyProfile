import { createContext } from 'react';

import type { Profile } from '@/types/profile';

export type ProfileSource = 'fallback' | 'cloud';

export type ProfileContextValue = {
  profile: Profile;
  loading: boolean;
  error: string | null;
  source: ProfileSource;
  refresh: () => Promise<void>;
};

export const ProfileContext = createContext<ProfileContextValue | null>(null);
