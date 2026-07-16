import { type PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import { ProfileContext, type ProfileSource } from '@/contexts/profile-context';
import fallbackProfile from '@/data/profile.json';
import { fetchProfile } from '@/services/profile-api';
import type { Profile } from '@/types/profile';

const initialProfile = fallbackProfile satisfies Profile;

export function ProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<ProfileSource>('fallback');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const remoteProfile = await fetchProfile();
      setProfile(remoteProfile);
      setSource('github');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ profile, loading, error, source, refresh }),
    [error, loading, profile, refresh, source],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
