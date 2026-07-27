import { StyleSheet, View } from 'react-native';

import { AppColors } from '@/constants/Colors';

export function PatternBackground({ variant = 'dots' }: { variant?: 'dots' | 'grid' }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.pattern, variant === 'grid' && styles.gridPattern]}>
      {Array.from({ length: 140 }, (_, index) => (
        <View key={index} style={[styles.dot, variant === 'grid' && styles.gridDot]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pattern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    inset: 0,
    opacity: 0.18,
    overflow: 'hidden',
    padding: 8,
    pointerEvents: 'none',
    position: 'absolute',
  },
  gridPattern: { gap: 15, opacity: 0.12 },
  dot: { backgroundColor: AppColors.subtleText, borderRadius: 3, height: 6, width: 6 },
  gridDot: { backgroundColor: AppColors.indigo, borderRadius: 0, height: 1, width: 15 },
});
