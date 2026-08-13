import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, FlatList, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Header } from '@/components/common/Header';
import { FeaturedPromoCarousel } from '@/components/home/FeaturedPromoCarousel';
import { PatternBackground } from '@/components/common/PatternBackground';
import { ProjectCard } from '@/components/profile/ProjectCard';
import { AppColors, AppFonts } from '@/constants/Colors';
import { PARTNER_PICKS, type PartnerPick } from '@/constants/product-assets';
import { useProducts } from '@/hooks/use-products';
import { useProfile } from '@/hooks/use-profile';

type PartnerPickCardProps = {
  active: boolean;
  greeting: boolean;
  onPress: () => void;
  pick: PartnerPick;
};

function PartnerPickCard({ active, greeting, onPress, pick }: PartnerPickCardProps) {
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!greeting) {
      pop.stopAnimation();
      pop.setValue(0);
      return;
    }

    Animated.sequence([
      Animated.timing(pop, {
        duration: 120,
        easing: Easing.out(Easing.quad),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(pop, {
        duration: 160,
        easing: Easing.inOut(Easing.quad),
        toValue: 0.45,
        useNativeDriver: true,
      }),
      Animated.timing(pop, {
        duration: 180,
        easing: Easing.out(Easing.back(1.6)),
        toValue: 0.78,
        useNativeDriver: true,
      }),
      Animated.timing(pop, {
        duration: 260,
        easing: Easing.out(Easing.quad),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [greeting, pop]);

  const mascotMotion = {
    transform: [
      {
        translateY: pop.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8],
        }),
      },
      {
        rotate: pop.interpolate({
          inputRange: [0, 0.45, 0.75, 1],
          outputRange: ['0deg', '-8deg', '7deg', '0deg'],
        }),
      },
      {
        scale: pop.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.16],
        }),
      },
    ],
  };
  const bubbleMotion = {
    opacity: pop.interpolate({
      inputRange: [0, 0.18, 0.82, 1],
      outputRange: [0, 1, 1, 0],
    }),
    transform: [
      {
        translateY: pop.interpolate({
          inputRange: [0, 1],
          outputRange: [5, -7],
        }),
      },
      {
        scale: pop.interpolate({
          inputRange: [0, 1],
          outputRange: [0.88, 1],
        }),
      },
    ],
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${pick.name}, ${pick.label}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.partnerCard,
        { backgroundColor: pick.tint },
        active && styles.partnerCardActive,
        pressed && styles.partnerCardPressed,
      ]}>
      <Animated.View pointerEvents="none" style={[styles.partnerBubble, bubbleMotion]}>
        <Text style={styles.partnerBubbleText}>Hi!</Text>
      </Animated.View>
      <Animated.View style={[styles.partnerAvatar, mascotMotion]}>
        <Image source={pick.image} style={styles.partnerImage} contentFit="contain" />
      </Animated.View>
      <View style={styles.partnerCopy}>
        <Text style={styles.partnerName}>{pick.name}</Text>
        <Text style={styles.partnerLabel}>{pick.label}</Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { error, loading, products, refresh, source } = useProducts();
  const { profile } = useProfile();
  const [category, setCategory] = useState('All Items');
  const [greetingPickId, setGreetingPickId] = useState<string | null>(null);
  const greetingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const columns = width >= 1080 ? 4 : 2;
  const compact = width < 560;

  const visibleProducts = category === 'All Items' ? products : products.filter((product) => product.category === category);

  useEffect(() => () => {
    if (greetingTimer.current) {
      clearTimeout(greetingTimer.current);
    }
  }, []);

  function handlePartnerPress(pick: PartnerPick) {
    setCategory(pick.filter);
    setGreetingPickId(pick.id);

    if (greetingTimer.current) {
      clearTimeout(greetingTimer.current);
    }

    greetingTimer.current = setTimeout(() => {
      setGreetingPickId(null);
      greetingTimer.current = null;
    }, 950);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <PatternBackground />
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header title="Shop" searchPlaceholder="Search cards, sets..." actionLabel="Cart" actionHref="/cart" />

      <FlatList
        key={columns}
        data={visibleProducts}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={[styles.content, compact && styles.contentCompact]}
        refreshing={loading}
        onRefresh={() => void refresh()}
        renderItem={({ item }) => <View style={styles.cardSlot}><ProjectCard product={item} /></View>}
        ItemSeparatorComponent={() => <View style={styles.rowGap} />}
        ListHeaderComponent={
          <View>
            <View style={[styles.hero, compact && styles.heroCompact]}>
              <Image source={require('@/assets/images/what.png')} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="center" />
              <View style={styles.heroShade} />
              <View style={styles.heroCopy}>
                <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>Featured{`\n`}Pokémon{`\n`}Cards</Text>
                <Text style={[styles.heroText, compact && styles.heroTextCompact]}>Swipe the promo cards, then tap any panel to jump straight into the detail view.</Text>
                <Pressable onPress={() => router.push('/chase-list')} style={styles.shopButton}>
                  <Text style={styles.shopButtonText}>Open Chase List</Text>
                </Pressable>
              </View>
            </View>

            <Pressable onPress={() => void refresh()} style={styles.sourceRow}>
              <MaterialCommunityIcons name={error ? 'cloud-alert-outline' : 'cloud-check-outline'} color={error ? AppColors.secondary : AppColors.accent} size={18} />
              <Text style={styles.sourceText}>{error ? 'Backup catalog · tap to retry' : source === 'cloud' ? 'Live inventory from Cloud MySQL' : 'Backup catalog is active'}</Text>
            </Pressable>

            <View style={styles.partnerSection}>
              <View style={styles.partnerHeader}>
                <Text style={styles.partnerTitle}>Partner Picks</Text>
                <Text style={styles.partnerHint}>{category}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.partnerRow}>
                {PARTNER_PICKS.map((pick) => (
                  <PartnerPickCard
                    active={category === pick.filter}
                    greeting={greetingPickId === pick.id}
                    key={pick.id}
                    onPress={() => handlePartnerPress(pick)}
                    pick={pick}
                  />
                ))}
              </ScrollView>
            </View>

            <FeaturedPromoCarousel />

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, compact && styles.sectionTitleCompact]}>Trending Singles</Text>
              <Pressable onPress={() => router.push('/all-products')} style={styles.viewAllBtn}>
                <Text style={styles.viewAll}>View All</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color={AppColors.primary} />
              </Pressable>
            </View>
            {/* Horizontal trending strip showing a few cards from the JSON */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingRow}>
              {products
                .filter((p) => p.category === 'Single Card')
                .slice(0, 8)
                .map((p) => {
                  const price = ({ '1': 35, '2': 145, '3': 28, '4': 49 } as Record<string, number>)[p.id] ?? Math.max(12, p.stock * 4);
                  return (
                    <Pressable
                      key={p.id}
                      accessibilityRole="button"
                      onPress={() => router.push({ pathname: '/product/[id]', params: { id: p.id } })}
                      style={styles.trendingCard}
                    >
                      <Image source={{ uri: p.image_url }} style={styles.trendingImage} contentFit="contain" />
                      <Text numberOfLines={2} style={styles.trendingName}>{p.name}</Text>
                      <Text style={styles.trendingPrice}>{profile.settings.currency} {price.toFixed(2)}</Text>
                    </Pressable>
                  );
                })}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="cards-outline" size={42} color={AppColors.primary} />
            <Text style={styles.emptyTitle}>No cards in this set</Text>
            <Text style={styles.emptyText}>Choose All Items to return to the full catalog.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: AppColors.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 1180, paddingBottom: Platform.OS === 'web' ? 112 : 54, paddingHorizontal: 24, paddingTop: 18, width: '100%' },
  contentCompact: { paddingHorizontal: 16 },
  hero: { borderRadius: 46, height: 410, marginBottom: 60, overflow: 'hidden', position: 'relative' },
  heroCompact: { height: 420, marginBottom: 52 },
  heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(19,24,36,0.56)' },
  heroCopy: { flex: 1, justifyContent: 'center', maxWidth: 620, padding: 46 },
  heroTitle: { color: '#FFFFFF', fontFamily: AppFonts.display, fontSize: 58, letterSpacing: -2.2, lineHeight: 58 },
  heroTitleCompact: { fontSize: 48, lineHeight: 48 },
  heroText: { color: '#FFFFFF', fontFamily: AppFonts.bodyMedium, fontSize: 20, lineHeight: 30, marginTop: 24, maxWidth: 530 },
  heroTextCompact: { fontSize: 16, lineHeight: 25, marginTop: 20 },
  shopButton: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: AppColors.yellow, borderRadius: 999, marginTop: 24, minHeight: 48, paddingHorizontal: 26, paddingVertical: 13 },
  shopButtonText: { color: AppColors.primaryDark, fontFamily: AppFonts.bodyBold, fontSize: 15 },
  sourceRow: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: 7, marginBottom: 26 },
  sourceText: { color: AppColors.mutedText, fontFamily: AppFonts.bodyMedium, fontSize: 11 },
  partnerSection: { marginBottom: 24 },
  partnerHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  partnerTitle: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 24, letterSpacing: -0.4 },
  partnerHint: { color: AppColors.primary, fontFamily: AppFonts.bodyBold, fontSize: 11 },
  partnerRow: { gap: 10, paddingBottom: 10, paddingRight: 2 },
  partnerCard: {
    alignItems: 'center',
    borderColor: '#DDE2F3',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 82,
    overflow: 'visible',
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'relative',
    width: 188,
  },
  partnerCardActive: { borderColor: AppColors.yellow, borderWidth: 2 },
  partnerCardPressed: { opacity: 0.86, transform: [{ scale: 0.985 }] },
  partnerBubble: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE2F3',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    left: 56,
    minWidth: 36,
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: 'absolute',
    top: 9,
    zIndex: 4,
  },
  partnerBubbleText: { color: AppColors.primary, fontFamily: AppFonts.bodyExtraBold, fontSize: 10 },
  partnerAvatar: { alignItems: 'center', height: 58, justifyContent: 'center', width: 58 },
  partnerImage: { height: 56, width: 56 },
  partnerCopy: { flex: 1 },
  partnerName: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 15, letterSpacing: -0.1 },
  partnerLabel: { color: AppColors.mutedText, fontFamily: AppFonts.bodyBold, fontSize: 9, lineHeight: 12, marginTop: 1 },
  sectionHeader: { alignItems: 'flex-end', flexDirection: 'row', gap: 16, justifyContent: 'space-between', marginBottom: 24 },
  sectionTitle: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 34, letterSpacing: -0.8 },
  sectionTitleCompact: { fontSize: 27 },
  viewAll: { color: AppColors.primary, fontFamily: AppFonts.bodyBold, fontSize: 17 },
  viewAllBtn: { alignItems: 'center', flexDirection: 'row', gap: 4 },
  columns: { gap: 16 },
  cardSlot: { flex: 1, minWidth: 0 },
  rowGap: { height: 18 },
  emptyState: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 28, gap: 8, padding: 30 },
  emptyTitle: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 22 },
  emptyText: { color: AppColors.mutedText, fontFamily: AppFonts.body, fontSize: 13, textAlign: 'center' },
  trendingRow: { paddingVertical: 10, gap: 12, paddingBottom: 28 },
  trendingCard: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E6EBF7', padding: 12, width: 180, marginRight: 12 },
  trendingImage: { height: 110, width: '100%', marginBottom: 8 },
  trendingName: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 14, marginBottom: 6 },
  trendingPrice: { color: AppColors.primary, fontFamily: AppFonts.bodyExtraBold, fontSize: 16 },
});
