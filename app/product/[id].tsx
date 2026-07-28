import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Button } from '@/components/common/Button';
import { AppColors, AppFonts } from '@/constants/Colors';
import { PRODUCT_ASSETS, PRODUCT_IMAGE_FALLBACK } from '@/constants/product-assets';
import { useProducts } from '@/hooks/use-products';

const prices: Record<string, number> = { '1': 35, '2': 145, '3': 28, '4': 49 };

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { products } = useProducts();
  const product = useMemo(() => products.find((item) => item.id === id), [id, products]);
  const [condition, setCondition] = useState('Near Mint (NM)');
  const [imageFailed, setImageFailed] = useState(false);
  const compact = width < 760;
  const flip = useSharedValue(0);

  useEffect(() => {
    flip.value = withRepeat(withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.cubic) }), -1, false);
  }, [flip]);

  const frontCardStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 0.5, 1], [0, 90, 180], Extrapolate.CLAMP);
    const opacity = interpolate(flip.value, [0, 0.42, 0.58, 1], [1, 1, 0, 0], Extrapolate.CLAMP);
    return {
      opacity,
      transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }],
    };
  });

  const backCardStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flip.value, [0, 0.5, 1], [180, 270, 360], Extrapolate.CLAMP);
    const opacity = interpolate(flip.value, [0, 0.42, 0.58, 1], [0, 0, 1, 1], Extrapolate.CLAMP);
    return {
      opacity,
      transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }],
    };
  });

  if (!product) {
    return <SafeAreaView style={styles.screen}><View style={styles.missing}><Text style={styles.title}>Card not found</Text><Button label="Back to Shop" onPress={() => router.replace('/')} /></View></SafeAreaView>;
  }

  const basePrice = prices[product.id] ?? Math.max(12, product.stock * 4);
  const conditions = [
    { label: 'Near Mint (NM)', note: 'Pristine condition, minimal wear', price: basePrice, available: true },
    { label: 'Lightly Played (LP)', note: 'Minor edge wear or scratching', price: Math.round(basePrice * 0.8), available: true },
    { label: 'Moderately Played (MP)', note: 'Visible wear across the card', price: Math.round(basePrice * 0.58), available: false },
  ];

  const imageSource =
    !imageFailed && product.image_url && /^https?:\/\//i.test(product.image_url)
      ? { uri: product.image_url }
      : PRODUCT_ASSETS[product.id]?.hero ?? PRODUCT_IMAGE_FALLBACK;
  const gallery = PRODUCT_ASSETS[product.id]?.gallery ?? [imageSource, imageSource, imageSource];

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerIcon}><MaterialCommunityIcons name="arrow-left" size={23} color={AppColors.primary} /></Pressable>
        <Text style={styles.brand}>PokéVault TCG</Text>
        <Pressable onPress={() => router.push('/categories')} style={styles.headerIcon}><MaterialCommunityIcons name="shopping-outline" size={23} color={AppColors.primary} /></Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.detailGrid, compact && styles.detailGridCompact]}>
          <View style={styles.visualColumn}>
            <View style={styles.viewer}>
              <View style={styles.viewerGlow} />
              <View style={styles.flipStage}>
                <Animated.View style={[styles.flipFace, styles.flipFront, frontCardStyle]}>
                  <View style={styles.cardFrame}>
                    <Image source={imageSource} style={styles.cardImage} contentFit="contain" onError={() => setImageFailed(true)} />
                  </View>
                </Animated.View>
                <Animated.View style={[styles.flipFace, styles.flipBack, backCardStyle]}>
                  <View style={styles.backCard}>
                    <View style={styles.backPattern}>
                      <View style={styles.backWaveLarge} />
                      <View style={styles.backWaveSmall} />
                      <View style={styles.backOrb} />
                    </View>
                    <View style={styles.backBadge}>
                      <Text style={styles.backBadgeText}>POKEMON</Text>
                    </View>
                    <View style={styles.backCenter}>
                      <View style={styles.backBallOuter}>
                        <View style={styles.backBallTop} />
                        <View style={styles.backBallBottom} />
                        <View style={styles.backBallCenter} />
                      </View>
                    </View>
                    <View style={styles.backBadgeBottom}>
                      <Text style={styles.backBadgeText}>POKEMON</Text>
                    </View>
                  </View>
                </Animated.View>
              </View>
            </View>
            <View style={styles.thumbnails}>
              {gallery.map((source, index) => (
                <View key={`${product.id}-${index}`} style={[styles.thumbnail, index === 0 && styles.thumbnailActive]}><Image source={source} style={styles.thumbnailImage} contentFit="contain" /></View>
              ))}
              <View style={styles.thumbnail}><MaterialCommunityIcons name="rotate-3d-variant" size={24} color={AppColors.text} /></View>
            </View>
          </View>

          <View style={styles.infoColumn}>
            <View style={styles.tagRow}><Text style={styles.rareTag}>SECRET RARE</Text><Text style={styles.setTag}>{product.category.toUpperCase()} · #{product.id}</Text></View>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.number}>#{product.id.padStart(3, '0')}/165</Text>

            <View style={styles.attributes}>
              <View style={styles.attribute}><Text style={styles.attributeLabel}>ILLUSTRATOR</Text><Text style={styles.attributeValue}>PokéVault Artist</Text></View>
              <View style={styles.attribute}><Text style={styles.attributeLabel}>TYPE</Text><Text style={styles.attributeValue}>🔥 Fire</Text></View>
              <View style={styles.attribute}><Text style={styles.attributeLabel}>HP</Text><Text style={styles.attributeValue}>{300 + product.stock}</Text></View>
              <View style={styles.attribute}><Text style={styles.attributeLabel}>STAGE</Text><Text style={styles.attributeValue}>Stage 2</Text></View>
            </View>

            <Text style={styles.conditionHeading}>Select Condition</Text>
            <View style={styles.conditionList}>
              {conditions.map((item) => {
                const selected = condition === item.label;
                return (
                  <Pressable disabled={!item.available} key={item.label} onPress={() => setCondition(item.label)} style={[styles.condition, selected && styles.conditionSelected, !item.available && styles.conditionDisabled]}>
                    <View style={[styles.radio, selected && styles.radioSelected]} />
                    <View style={styles.conditionCopy}><Text style={[styles.conditionLabel, !item.available && styles.strike]}>{item.label}</Text><Text style={[styles.conditionNote, !item.available && styles.soldOut]}>{item.available ? item.note : 'Out of Stock'}</Text></View>
                    <Text style={[styles.conditionPrice, !item.available && styles.strike]}>${item.price.toFixed(2)}</Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.actions}><Button label="Add to Trainer Bag" onPress={() => router.push('/categories')} /><Button label="Add to Chase List" onPress={() => router.push('/projects')} variant="secondary" /></View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.detailDock}>
        <Link href="/" style={styles.dockLink}>Shop</Link><Link href="/projects" style={styles.dockLink}>Chase List</Link><Link href="/categories" style={styles.dockLink}>Cart</Link><Link href="/admin" style={styles.dockLink}>Profile</Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: AppColors.background, flex: 1 },
  header: { alignItems: 'center', backgroundColor: 'rgba(249,249,255,0.96)', flexDirection: 'row', minHeight: 68, paddingHorizontal: 20, shadowColor: '#24325A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  headerIcon: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  brand: { color: AppColors.primary, flex: 1, fontFamily: AppFonts.display, fontSize: 24, textAlign: 'center' },
  content: { alignSelf: 'center', maxWidth: 1120, padding: 22, paddingBottom: 124, width: '100%' },
  detailGrid: { flexDirection: 'row', gap: 46 },
  detailGridCompact: { flexDirection: 'column', gap: 28 },
  visualColumn: { flex: 1, minWidth: 280 },
  viewer: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderRadius: 44, height: 500, justifyContent: 'center', overflow: 'hidden', position: 'relative' },
  viewerGlow: { backgroundColor: '#FFF4BA', borderRadius: 220, height: 370, opacity: 0.35, position: 'absolute', right: -80, top: 120, width: 370 },
  flipStage: {
    alignItems: 'center',
    height: '72%',
    justifyContent: 'center',
    position: 'relative',
    width: '68%',
  },
  flipFace: {
    backfaceVisibility: 'hidden',
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  flipFront: {
    zIndex: 2,
  },
  flipBack: {
    zIndex: 1,
  },
  cardFrame: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.72)', borderRadius: 30, height: '70%', justifyContent: 'center', padding: 18, shadowColor: '#24325A', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.14, shadowRadius: 20, width: '66%' },
  cardImage: { height: '100%', width: '100%' },
  backCard: {
    alignItems: 'center',
    backgroundColor: '#1F2C63',
    borderRadius: 28,
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: '#24325A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  backPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95,
  },
  backWaveLarge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    height: 150,
    left: '10%',
    position: 'absolute',
    top: '18%',
    transform: [{ rotate: '-18deg' }],
    width: '78%',
  },
  backWaveSmall: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    height: 110,
    left: '18%',
    position: 'absolute',
    top: '32%',
    transform: [{ rotate: '22deg' }],
    width: '64%',
  },
  backOrb: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 140,
    bottom: '14%',
    height: 110,
    position: 'absolute',
    right: '12%',
    width: 110,
  },
  backBadge: {
    alignItems: 'center',
    paddingTop: 4,
  },
  backBadgeBottom: {
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  backBadgeText: {
    color: '#FFD21F',
    fontFamily: AppFonts.displayBold,
    fontSize: 30,
    letterSpacing: -0.8,
    textShadowColor: '#17306f',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 0,
  },
  backCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  backBallOuter: {
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
    borderColor: '#3B3B3B',
    borderRadius: 999,
    borderWidth: 4,
    height: 140,
    justifyContent: 'center',
    position: 'relative',
    width: 140,
  },
  backBallTop: {
    backgroundColor: '#E64B2B',
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    height: '48%',
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  backBallBottom: {
    backgroundColor: '#F5F5F5',
    bottom: 0,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
    height: '48%',
    position: 'absolute',
    width: '100%',
  },
  backBallCenter: {
    backgroundColor: '#FFFFFF',
    borderColor: '#333333',
    borderRadius: 999,
    borderWidth: 5,
    height: 38,
    width: 38,
  },
  thumbnails: { flexDirection: 'row', gap: 12, marginTop: 18 },
  thumbnail: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderColor: '#D2C5AB', borderRadius: 20, borderWidth: 1, height: 72, justifyContent: 'center', overflow: 'hidden', width: 72 },
  thumbnailActive: { borderColor: AppColors.yellow, borderWidth: 2 },
  thumbnailImage: { height: 60, width: 46 },
  infoColumn: { flex: 1, minWidth: 280 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rareTag: { backgroundColor: '#FFDAD6', borderRadius: 999, color: AppColors.secondary, fontFamily: AppFonts.bodyExtraBold, fontSize: 9, letterSpacing: 1, paddingHorizontal: 11, paddingVertical: 7 },
  setTag: { backgroundColor: AppColors.softBlue, borderRadius: 999, color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 9, letterSpacing: 0.7, paddingHorizontal: 11, paddingVertical: 7 },
  title: { color: AppColors.text, fontFamily: AppFonts.display, fontSize: 42, letterSpacing: -1.1, lineHeight: 48, marginTop: 12 },
  number: { color: AppColors.mutedText, fontFamily: AppFonts.bodyBold, fontSize: 18, marginTop: 4 },
  attributes: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 24 },
  attribute: { backgroundColor: AppColors.backgroundAlt, borderColor: '#DDE2F3', borderRadius: 24, borderWidth: 1, minWidth: 140, padding: 16, width: '47%' },
  attributeLabel: { color: AppColors.mutedText, fontFamily: AppFonts.bodyExtraBold, fontSize: 9, letterSpacing: 1 },
  attributeValue: { color: AppColors.text, fontFamily: AppFonts.bodyMedium, fontSize: 16, marginTop: 7 },
  conditionHeading: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 18, marginBottom: 12, marginTop: 28 },
  conditionList: { gap: 12 },
  condition: { alignItems: 'center', backgroundColor: AppColors.backgroundAlt, borderColor: '#DDE2F3', borderRadius: 24, borderWidth: 1, flexDirection: 'row', gap: 12, minHeight: 82, padding: 15 },
  conditionSelected: { borderColor: AppColors.yellow, borderWidth: 2 },
  conditionDisabled: { opacity: 0.56 },
  radio: { borderColor: '#D2C5AB', borderRadius: 9, borderWidth: 2, height: 18, width: 18 },
  radioSelected: { borderColor: AppColors.yellow, borderWidth: 5 },
  conditionCopy: { flex: 1 },
  conditionLabel: { color: AppColors.text, fontFamily: AppFonts.bodyMedium, fontSize: 15 },
  conditionNote: { color: AppColors.mutedText, fontFamily: AppFonts.bodyBold, fontSize: 9, letterSpacing: 0.6, marginTop: 3 },
  conditionPrice: { color: AppColors.primary, fontFamily: AppFonts.bodyBold, fontSize: 18 },
  strike: { textDecorationLine: 'line-through' },
  soldOut: { color: AppColors.secondary, textTransform: 'uppercase' },
  actions: { gap: 14, marginTop: 26 },
  detailDock: { alignItems: 'center', backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, bottom: 0, flexDirection: 'row', height: 76, justifyContent: 'space-around', left: 0, paddingHorizontal: 18, position: 'absolute', right: 0, shadowColor: '#24325A', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 15 },
  dockLink: { color: AppColors.mutedText, fontFamily: AppFonts.bodyBold, fontSize: 11 },
  missing: { alignItems: 'center', flex: 1, gap: 20, justifyContent: 'center', padding: 24 },
});
