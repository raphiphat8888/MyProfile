import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/common/Card';
import { AppColors, AppRadius } from '@/constants/Colors';
import type { ProfileLink } from '@/types/profile';
import { openLink } from '@/utils/openLink';

type ContactCardProps = {
  item: ProfileLink;
};

export function ContactCard({ item }: ContactCardProps) {
  return (
    <Pressable
      onPress={() => openLink(item.href)}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}>
      <Card style={styles.card}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>{item.label.slice(0, 1)}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    minWidth: 260,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: AppColors.softBlue,
    borderRadius: AppRadius.control,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  iconText: {
    color: AppColors.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  content: {
    flex: 1,
  },
  label: {
    color: AppColors.mutedText,
    fontSize: 13,
    fontWeight: '700',
  },
  value: {
    color: AppColors.text,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  pressed: {
    opacity: 0.78,
  },
});
