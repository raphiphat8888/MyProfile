import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { PatternBackground } from '@/components/common/PatternBackground';
import { AppColors, AppFonts } from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <View style={styles.screen}>
      <PatternBackground />
      <View style={styles.orbOne} />
      <View style={styles.orbTwo} />
      <View style={styles.shadow}>
        <View style={styles.card}>
          <View style={styles.lostCard}>
            <Text style={styles.code}>404</Text>
            <MaterialCommunityIcons name="cards-outline" color={AppColors.text} size={52} />
          </View>
          <Text style={styles.eyebrow}>LOST CARD ALERT</Text>
          <Text style={styles.title}>This page escaped the deck!</Text>
          <Text style={styles.description}>The route you opened is not part of Card Quest. Head home and continue your collection.</Text>
          <Button label="Back to home base" href="/" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: 'center', backgroundColor: AppColors.background, flex: 1, justifyContent: 'center', overflow: 'hidden', padding: 24 },
  orbOne: { backgroundColor: AppColors.softBlue, borderRadius: 150, height: 300, left: -100, position: 'absolute', top: -100, width: 300 },
  orbTwo: { backgroundColor: '#FFE1E7', borderRadius: 120, bottom: -80, height: 240, position: 'absolute', right: -80, width: 240 },
  shadow: { backgroundColor: AppColors.text, borderRadius: 25, maxWidth: 520, paddingBottom: 6, paddingRight: 6, width: '100%' },
  card: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 30, padding: 30, shadowColor: '#24325A', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  lostCard: { alignItems: 'center', backgroundColor: AppColors.yellow, borderRadius: 24, height: 150, justifyContent: 'center', width: 115 },
  code: { color: AppColors.text, fontSize: 23, fontWeight: '900', marginBottom: 8 },
  eyebrow: { color: AppColors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, marginTop: 24 },
  title: { color: AppColors.text, fontFamily: AppFonts.display, fontSize: 29, letterSpacing: -0.8, lineHeight: 35, marginTop: 7, textAlign: 'center' },
  description: { color: AppColors.mutedText, fontFamily: AppFonts.bodyMedium, fontSize: 13, lineHeight: 21, marginBottom: 22, marginTop: 10, maxWidth: 400, textAlign: 'center' },
});
