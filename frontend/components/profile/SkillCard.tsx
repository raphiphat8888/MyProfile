import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/common/Card';
import { AppColors, AppRadius } from '@/constants/Colors';
import type { SkillGroup } from '@/types/profile';

type SkillCardProps = {
  group: SkillGroup;
};

export function SkillCard({ group }: SkillCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{group.title}</Text>
      <Text style={styles.description}>{group.description}</Text>
      <View style={styles.skills}>
        {group.skills.map((skill) => (
          <View key={skill} style={styles.chip}>
            <Text style={styles.chipText}>{skill}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 250,
  },
  title: {
    color: AppColors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  description: {
    color: AppColors.mutedText,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  chip: {
    backgroundColor: AppColors.softBlue,
    borderRadius: AppRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipText: {
    color: AppColors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
