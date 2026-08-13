import { StyleSheet, Text, View } from 'react-native';

import { AppColors, AppFonts } from '@/constants/Colors';

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <View style={styles.container}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 7,
    marginBottom: 22,
  },
  eyebrow: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.yellow,
    borderRadius: 999,
    color: AppColors.text,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    overflow: 'hidden',
    paddingHorizontal: 11,
    paddingVertical: 6,
    textTransform: 'uppercase',
  },
  title: {
    color: AppColors.text,
    fontFamily: AppFonts.display,
    fontSize: 32,
    letterSpacing: -0.8,
    lineHeight: 38,
    marginTop: 5,
  },
  description: {
    color: AppColors.mutedText,
    fontFamily: AppFonts.body,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 760,
  },
});
