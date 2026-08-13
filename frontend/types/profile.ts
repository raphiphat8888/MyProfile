import type { Href } from 'expo-router';

export type ProfileLink = {
  label: string;
  value: string;
  href: string;
};

export type SkillGroup = {
  title: string;
  description: string;
  skills: string[];
};

export type ProfileSettings = {
  currency: string;
  lowStockThreshold: number;
  homeProductLimit: number;
};

export type ActionLink = {
  label: string;
  href: Href;
  variant?: 'primary' | 'secondary';
};

export type Profile = {
  schemaVersion: number;
  name: string;
  appName: string;
  role: string;
  intro: string;
  education: string;
  summary: string;
  location: string;
  initials: string;
  email: ProfileLink;
  github: ProfileLink;
  facebook: ProfileLink;
  phone: ProfileLink;
  settings: ProfileSettings;
  skills: SkillGroup[];
};
