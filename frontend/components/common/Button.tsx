import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, type GestureResponderEvent } from 'react-native';

import { AppColors, AppFonts, AppRadius } from '@/constants/Colors';

type ButtonProps = {
  label: string;
  href?: Href;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

export function Button({ label, href, onPress, variant = 'primary' }: ButtonProps) {
  const content = (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'danger' && styles.dangerButton,
        pressed && styles.pressed,
      ]}>
      <Text
        style={[
          styles.label,
          variant === 'secondary' && styles.secondaryLabel,
          variant === 'danger' && styles.dangerLabel,
        ]}>
        {label}
      </Text>
    </Pressable>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        {content}
      </Link>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: AppColors.yellow,
    borderRadius: AppRadius.pill,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowColor: AppColors.yellow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: AppColors.softBlue,
  },
  dangerButton: { backgroundColor: AppColors.red },
  label: {
    color: AppColors.text,
    fontFamily: AppFonts.bodyBold,
    fontSize: 15,
  },
  secondaryLabel: {
    color: AppColors.text,
  },
  dangerLabel: { color: '#FFFFFF' },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
