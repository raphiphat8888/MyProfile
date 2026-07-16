import { fetch } from 'expo/fetch';

import type { Profile, ProfileLink, SkillGroup } from '@/types/profile';

export const PROFILE_URL =
  'https://raw.githubusercontent.com/raphiphat8888/MyProfile/master/data/profile.json';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isProfileLink(value: unknown): value is ProfileLink {
  return (
    isRecord(value) &&
    typeof value.label === 'string' &&
    typeof value.value === 'string' &&
    typeof value.href === 'string'
  );
}

function isSkillGroup(value: unknown): value is SkillGroup {
  return (
    isRecord(value) &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    isStringArray(value.skills)
  );
}

export function isProfile(value: unknown): value is Profile {
  if (!isRecord(value) || !isRecord(value.settings)) {
    return false;
  }

  return (
    typeof value.schemaVersion === 'number' &&
    typeof value.appName === 'string' &&
    typeof value.name === 'string' &&
    typeof value.role === 'string' &&
    typeof value.intro === 'string' &&
    typeof value.education === 'string' &&
    typeof value.summary === 'string' &&
    typeof value.location === 'string' &&
    typeof value.initials === 'string' &&
    isProfileLink(value.email) &&
    isProfileLink(value.github) &&
    isProfileLink(value.facebook) &&
    isProfileLink(value.phone) &&
    typeof value.settings.currency === 'string' &&
    typeof value.settings.lowStockThreshold === 'number' &&
    typeof value.settings.homeProductLimit === 'number' &&
    Array.isArray(value.skills) &&
    value.skills.every(isSkillGroup)
  );
}

export async function fetchProfile(): Promise<Profile> {
  const response = await fetch(`${PROFILE_URL}?refresh=${Date.now()}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`โหลดข้อมูลจาก GitHub ไม่สำเร็จ (${response.status})`);
  }

  const data: unknown = await response.json();

  if (!isProfile(data)) {
    throw new Error('รูปแบบข้อมูล JSON จาก GitHub ไม่ถูกต้อง');
  }

  return data;
}
