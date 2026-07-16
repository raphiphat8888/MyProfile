import type { Href } from 'expo-router';

export type ProfileLink = {
  label: string;
  value: string;
  href: string;
};

export type Project = {
  title: string;
  description: string;
  techStack: string[];
  href?: string;
  status?: string;
  price: string;
  stock: number;
  category: string;
  imageUrl?: string;
};

export type SkillGroup = {
  title: string;
  description: string;
  skills: string[];
};

export type ActionLink = {
  label: string;
  href: Href;
  variant?: 'primary' | 'secondary';
};

export type Profile = {
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
  projects: Project[];
  skills: SkillGroup[];
};
