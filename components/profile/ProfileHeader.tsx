import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { AppColors, AppRadius } from '@/constants/Colors';
import { profile } from '@/constants/ProfileData';

const heroImageUrl = 'https://i.pinimg.com/originals/20/42/13/204213fb1069918be7f081a46a93f0af.jpg';

function HeroCardImage() {
  const [hovered, setHovered] = useState(false);
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, {
      damping: 13,
      mass: 0.75,
      stiffness: 180,
      toValue: hovered ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [hovered, pop]);

  const scale = pop.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.16],
  });
  const translateY = pop.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });
  const rotate = pop.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-2deg'],
  });

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={styles.photoFrame}>
      <Animated.View
        style={[
          styles.popCard,
          hovered && styles.popCardLifted,
          {
            transform: [{ translateY }, { scale }, { rotate }],
          },
        ]}>
        <Image source={{ uri: heroImageUrl }} style={styles.heroImage} contentFit="cover" />
        <View style={styles.imageShade} />
        <View style={styles.imageBadge}>
          <Text style={styles.previewBadge}>Rare Pull</Text>
          <Text style={styles.previewName}>Pokemon Cards</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function ProfileHeader() {
  const { width } = useWindowDimensions();
  const isWide = width >= 800;

  return (
    <View style={[styles.hero, isWide && styles.heroWide]}>
      <View style={styles.heroCopy}>
        <Text style={styles.kicker}>{profile.role}</Text>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.intro}>{profile.intro}</Text>
        <View style={styles.actions}>
          <Button label="Shop Cards" href="/projects" />
          <Button label="Admin Panel" href="/admin" variant="secondary" />
        </View>
      </View>

      <HeroCardImage />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: AppColors.backgroundAlt,
    borderColor: AppColors.border,
    borderRadius: AppRadius.hero,
    borderWidth: 1,
    gap: 24,
    overflow: 'visible',
    padding: 22,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 5,
  },
  heroWide: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 32,
  },
  heroCopy: {
    flex: 1,
    gap: 14,
  },
  kicker: {
    color: AppColors.secondary,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  name: {
    color: AppColors.text,
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 48,
  },
  intro: {
    color: AppColors.mutedText,
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 620,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  photoFrame: {
    height: 280,
    maxWidth: 320,
    width: '100%',
    zIndex: 4,
  },
  popCard: {
    backgroundColor: '#2D2148',
    borderRadius: AppRadius.hero,
    height: '100%',
    overflow: 'hidden',
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    width: '100%',
    elevation: 7,
  },
  popCardLifted: {
    shadowOpacity: 0.24,
    shadowRadius: 36,
  },
  heroImage: {
    height: '100%',
    width: '100%',
  },
  imageShade: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  imageBadge: {
    bottom: 18,
    left: 18,
    position: 'absolute',
    right: 18,
  },
  previewBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: AppRadius.pill,
    color: AppColors.primary,
    fontSize: 13,
    fontWeight: '900',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  previewName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8,
  },
});
