import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { RotatingCardViewer } from '@/components/product/RotatingCardViewer';
import { AppColors, AppFonts } from '@/constants/Colors';
import { BACK_CARD_IMAGE, GOLD_BACK_CARD_IMAGE, PRODUCT_ASSETS, PRODUCT_IMAGE_FALLBACK } from '@/constants/product-assets';
import { LOCAL_EASTER_EGG_PRODUCTS } from '@/constants/local-easter-eggs';
import { useProducts } from '@/hooks/use-products';
import { useCart } from '@/hooks/use-cart';
import { useProfile } from '@/hooks/use-profile';

const prices: Record<string, number> = { '1': 35, '2': 145, '3': 28, '4': 49 };

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { error, loading, products, refresh } = useProducts();
  const { addToCart, totalItems } = useCart();
  const { profile } = useProfile();
  const productId = Array.isArray(id) ? id[0] : id;
  const localEasterEgg = productId ? LOCAL_EASTER_EGG_PRODUCTS[productId] : undefined;
  const product = useMemo(
    () => products.find((item) => item.id === productId) ?? localEasterEgg,
    [localEasterEgg, productId, products],
  );
  const [condition, setCondition] = useState('Near Mint (NM)');
  const [imageFailed] = useState(false);
  const compact = width < 760;
  const isSpecialRare = productId === '999';
  const addProductToCart = () => {
    if (product && !isSpecialRare) {
      addToCart(product.id);
      router.push('/cart');
    }
  };

  if (loading && !product) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.missing}>
          <ActivityIndicator color={AppColors.primary} size="large" />
          <Text style={styles.title}>Loading card...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.missing}>
          <Text style={styles.title}>Card not found</Text>
          <Text style={styles.missingText}>
            {error ? 'Cloud catalog did not load. Try pulling the card data again.' : 'This card is not in the current catalog.'}
          </Text>
          <Button label="Retry from Cloud" onPress={() => void refresh()} variant="secondary" />
          <Button label="Back to Shop" onPress={() => router.replace('/')} />
        </View>
      </SafeAreaView>
    );
  }

  const basePrice = product.price ?? prices[product.id] ?? Math.max(12, product.stock * 4);
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
        <Pressable onPress={() => router.back()} style={styles.headerIcon}>
          <MaterialCommunityIcons name="arrow-left" size={23} color={AppColors.primary} />
        </Pressable>
        <Text style={styles.brand}>Pokémon Takt Shop</Text>
        <Pressable onPress={() => router.push('/cart')} style={styles.headerIcon}>
          <MaterialCommunityIcons name="shopping-outline" size={23} color={AppColors.primary} />
          {totalItems > 0 ? <View style={styles.detailBadge}><Text style={styles.detailBadgeText}>{totalItems > 99 ? '99+' : totalItems}</Text></View> : null}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.detailGrid, compact && styles.detailGridCompact]}>
          <View style={styles.visualColumn}>
            <RotatingCardViewer
              frontSource={imageSource}
              backSource={isSpecialRare ? GOLD_BACK_CARD_IMAGE : BACK_CARD_IMAGE}
              title={product.name}
              subtitle={isSpecialRare ? 'Ultra rare gold back with rainbow foil shimmer.' : 'Drag the viewer or let it spin for a full look at both sides.'}
              tags={isSpecialRare ? ['Ultra Rare', 'Gold Back', 'Rainbow Foil'] : [product.category, `#${product.id}`]}
              badgeLabel={isSpecialRare ? 'Ultra Secret Rare' : 'Featured Card'}
              foilBack={isSpecialRare}
              onAddPress={isSpecialRare ? () => router.push('/chase-list') : addProductToCart}
            />

            <View style={styles.thumbnails}>
              {gallery.map((source, index) => (
                <View key={`${product.id}-${index}`} style={[styles.thumbnail, index === 0 && styles.thumbnailActive]}>
                  <Image source={source} style={styles.thumbnailImage} contentFit="contain" />
                </View>
              ))}
              <View style={styles.thumbnail}>
                <MaterialCommunityIcons name="rotate-3d-variant" size={24} color={AppColors.text} />
              </View>
            </View>
          </View>

          <View style={styles.infoColumn}>
            <View style={styles.tagRow}>
              <Text style={styles.rareTag}>{isSpecialRare ? 'ULTRA SECRET RARE' : 'SECRET RARE'}</Text>
              <Text style={styles.setTag}>{product.category.toUpperCase()} · #{product.id}</Text>
            </View>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.number}>#{product.id.padStart(3, '0')}/165</Text>

            <View style={styles.attributes}>
              <View style={styles.attribute}>
                <Text style={styles.attributeLabel}>ILLUSTRATOR</Text>
                <Text style={styles.attributeValue}>Takt Shop Artist</Text>
              </View>
              <View style={styles.attribute}>
                <Text style={styles.attributeLabel}>TYPE</Text>
                <Text style={styles.attributeValue}>🔥 Fire</Text>
              </View>
              <View style={styles.attribute}>
                <Text style={styles.attributeLabel}>HP</Text>
                <Text style={styles.attributeValue}>{300 + product.stock}</Text>
              </View>
              <View style={styles.attribute}>
                <Text style={styles.attributeLabel}>STAGE</Text>
                <Text style={styles.attributeValue}>Stage 2</Text>
              </View>
            </View>

            <Text style={styles.conditionHeading}>Select Condition</Text>
            <View style={styles.conditionList}>
              {conditions.map((item) => {
                const selected = condition === item.label;
                return (
                  <Pressable
                    disabled={!item.available}
                    key={item.label}
                    onPress={() => setCondition(item.label)}
                    style={[styles.condition, selected && styles.conditionSelected, !item.available && styles.conditionDisabled]}>
                    <View style={[styles.radio, selected && styles.radioSelected]} />
                    <View style={styles.conditionCopy}>
                      <Text style={[styles.conditionLabel, !item.available && styles.strike]}>{item.label}</Text>
                      <Text style={[styles.conditionNote, !item.available && styles.soldOut]}>
                        {item.available ? item.note : 'Out of Stock'}
                      </Text>
                    </View>
                    <Text style={[styles.conditionPrice, !item.available && styles.strike]}>{profile.settings.currency} {item.price.toFixed(2)}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.actions}>
              <Button label={isSpecialRare ? 'Keep as Easter Egg' : 'Add to Trainer Bag'} onPress={isSpecialRare ? () => router.push('/chase-list') : addProductToCart} />
              <Button label="Add to Chase List" onPress={() => router.push('/chase-list')} variant="secondary" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: AppColors.background, flex: 1 },
  header: {
    alignItems: 'center',
    backgroundColor: 'rgba(249,249,255,0.96)',
    flexDirection: 'row',
    minHeight: 68,
    paddingHorizontal: 20,
    shadowColor: '#24325A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  headerIcon: { alignItems: 'center', height: 44, justifyContent: 'center', position: 'relative', width: 44 },
  detailBadge: { alignItems: 'center', backgroundColor: AppColors.red, borderColor: '#FFFFFF', borderRadius: 10, borderWidth: 2, height: 20, justifyContent: 'center', minWidth: 20, paddingHorizontal: 3, position: 'absolute', right: -2, top: -2 },
  detailBadgeText: { color: '#FFFFFF', fontFamily: AppFonts.bodyExtraBold, fontSize: 9 },
  brand: { color: AppColors.primary, flex: 1, fontFamily: AppFonts.display, fontSize: 24, textAlign: 'center' },
  content: { alignSelf: 'center', maxWidth: 1120, padding: 22, paddingBottom: 36, width: '100%' },
  detailGrid: { flexDirection: 'row', gap: 46 },
  detailGridCompact: { flexDirection: 'column', gap: 28 },
  visualColumn: { flex: 1, minWidth: 280 },
  thumbnails: { flexDirection: 'row', gap: 12, marginTop: 18 },
  thumbnail: {
    alignItems: 'center',
    backgroundColor: AppColors.softBlue,
    borderColor: '#D2C5AB',
    borderRadius: 20,
    borderWidth: 1,
    height: 72,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 72,
  },
  thumbnailActive: { borderColor: AppColors.yellow, borderWidth: 2 },
  thumbnailImage: { height: 60, width: 46 },
  infoColumn: { flex: 1, minWidth: 280 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rareTag: {
    backgroundColor: '#FFDAD6',
    borderRadius: 999,
    color: AppColors.secondary,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 9,
    letterSpacing: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  setTag: {
    backgroundColor: AppColors.softBlue,
    borderRadius: 999,
    color: AppColors.text,
    fontFamily: AppFonts.bodyBold,
    fontSize: 9,
    letterSpacing: 0.7,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  title: { color: AppColors.text, fontFamily: AppFonts.display, fontSize: 42, letterSpacing: -1.1, lineHeight: 48, marginTop: 12 },
  number: { color: AppColors.mutedText, fontFamily: AppFonts.bodyBold, fontSize: 18, marginTop: 4 },
  attributes: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 24 },
  attribute: {
    backgroundColor: AppColors.backgroundAlt,
    borderColor: '#DDE2F3',
    borderRadius: 24,
    borderWidth: 1,
    minWidth: 140,
    padding: 16,
    width: '47%',
  },
  attributeLabel: { color: AppColors.mutedText, fontFamily: AppFonts.bodyExtraBold, fontSize: 9, letterSpacing: 1 },
  attributeValue: { color: AppColors.text, fontFamily: AppFonts.bodyMedium, fontSize: 16, marginTop: 7 },
  conditionHeading: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 18, marginBottom: 12, marginTop: 28 },
  conditionList: { gap: 12 },
  condition: {
    alignItems: 'center',
    backgroundColor: AppColors.backgroundAlt,
    borderColor: '#DDE2F3',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 82,
    padding: 15,
  },
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
  missing: { alignItems: 'center', flex: 1, gap: 20, justifyContent: 'center', padding: 24 },
  missingText: { color: AppColors.mutedText, fontFamily: AppFonts.bodyMedium, fontSize: 14, lineHeight: 20, maxWidth: 360, textAlign: 'center' },
});
