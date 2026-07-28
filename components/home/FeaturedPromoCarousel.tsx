import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AppColors, AppFonts } from '@/constants/Colors';
import { FEATURED_PROMOS, type FeaturedPromo } from '@/constants/product-assets';

type FeaturedPromoCarouselProps = {
  promos?: FeaturedPromo[];
};

export function FeaturedPromoCarousel({ promos = FEATURED_PROMOS }: FeaturedPromoCarouselProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = useMemo(() => Math.min(Math.max(width - 48, 300), 760), [width]);
  const gap = 16;
  const itemWidth = cardWidth + gap;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="pokeball" size={22} color={AppColors.primary} />
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Featured Pokémon</Text>
          <Text style={styles.title}>Swipe promos, tap a card</Text>
        </View>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={promos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        snapToInterval={itemWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.title}. ${item.subtitle}`}
            onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.productId } })}
            style={({ pressed }) => [styles.card, { width: cardWidth, marginRight: gap }, pressed && styles.cardPressed]}>
            <Image source={item.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={220} />
            <View style={styles.overlay} />
            <View style={styles.badge}>
              <MaterialCommunityIcons name="star-four-points" size={14} color={AppColors.primary} />
              <Text style={styles.badgeText}>{item.eyebrow}</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              <View style={styles.ctaRow}>
                <Text style={styles.ctaText}>{item.cta}</Text>
                <MaterialCommunityIcons name="chevron-right" size={22} color={AppColors.primaryDark} />
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 30,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  headerIcon: {
    alignItems: 'center',
    backgroundColor: AppColors.softBlue,
    borderRadius: 18,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    color: AppColors.primary,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: AppColors.text,
    fontFamily: AppFonts.displayBold,
    fontSize: 22,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  list: {
    paddingBottom: 10,
    paddingLeft: 2,
    paddingRight: 2,
  },
  card: {
    borderRadius: 32,
    height: 260,
    overflow: 'hidden',
    shadowColor: '#24325A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 6,
    backgroundColor: '#FFFFFF',
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 24, 40, 0.42)',
  },
  badge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    marginLeft: 18,
    marginTop: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeText: {
    color: AppColors.primary,
    fontFamily: AppFonts.bodyBold,
    fontSize: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
    paddingBottom: 20,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontFamily: AppFonts.displayBold,
    fontSize: 34,
    letterSpacing: -1.1,
    lineHeight: 36,
    maxWidth: 520,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.92)',
    fontFamily: AppFonts.bodyMedium,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 520,
  },
  ctaRow: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: AppColors.yellow,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ctaText: {
    color: AppColors.primaryDark,
    fontFamily: AppFonts.bodyBold,
    fontSize: 14,
  },
});
