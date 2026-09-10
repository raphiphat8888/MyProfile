import { AppColors, AppRadius } from '@/constants/Colors';

export const adminColors = {
  background: AppColors.background,
  border: '#DDE2F3',
  borderStrong: AppColors.border,
  danger: AppColors.secondary,
  dangerSoft: '#FFF0F1',
  muted: AppColors.subtleText,
  panel: AppColors.card,
  primary: AppColors.primary,
  primarySoft: AppColors.softBlue,
  sidebar: '#161C28',
  sidebarMuted: AppColors.subtleText,
  sidebarPanel: '#232B3F',
  slate100: AppColors.backgroundAlt,
  slate200: '#DDE2F3',
  slate700: '#4E4632',
  text: AppColors.text,
  warning: AppColors.yellow,
  warningSoft: '#FFFDE5',
};

export const adminRadius = {
  control: AppRadius.control,
  card: AppRadius.card,
  panel: AppRadius.card,
};

export const adminSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const adminShadow = {
  elevation: 2,
  shadowColor: AppColors.shadow,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 18,
};

