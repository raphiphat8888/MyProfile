import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { AppColors } from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Page not found</Text>
      <Text style={styles.description}>The page you opened does not exist in this card shop.</Text>
      <Button label="Back Home" href="/" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: AppColors.background,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: AppColors.text,
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    color: AppColors.mutedText,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 22,
    textAlign: 'center',
  },
});
