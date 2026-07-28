import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Header } from '@/components/common/Header';
import { FeaturedPromoCarousel } from '@/components/home/FeaturedPromoCarousel';
import { PatternBackground } from '@/components/common/PatternBackground';
import { ProjectCard } from '@/components/profile/ProjectCard';
import { AppColors, AppFonts } from '@/constants/Colors';
import { FEATURED_PROMOS } from '@/constants/product-assets';
import { useProducts } from '@/hooks/use-products';

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { error, loading, products, refresh, source } = useProducts();
  const [category, setCategory] = useState('All Items');
  const columns = width >= 1080 ? 4 : 2;
  const compact = width < 560;

  const filters = useMemo(() => ['All Items', ...Array.from(new Set(products.map((product) => product.category)))], [products]);
  const visibleProducts = category === 'All Items' ? products : products.filter((product) => product.category === category);

  return (
    <SafeAreaView style={styles.screen}>
      <PatternBackground />
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header title="Shop" searchPlaceholder="Search cards, sets..." actionLabel="Notifications" actionHref="/admin" />

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
              <Image source={FEATURED_PROMOS[0].image} style={StyleSheet.absoluteFill} contentFit="cover" />
              <View style={styles.heroShade} />
              <View style={styles.heroCopy}>
                <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>Featured{`\n`}Pokémon{`\n`}Cards</Text>
                <Text style={[styles.heroText, compact && styles.heroTextCompact]}>Swipe the promo cards, then tap any panel to jump straight into the detail view.</Text>
                <Pressable onPress={() => router.push('/projects')} style={styles.shopButton}>
                  <Text style={styles.shopButtonText}>Open Chase List</Text>
                </Pressable>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {filters.map((filter) => {
                const active = filter === category;
                return (
                  <Pressable key={filter} onPress={() => setCategory(filter)} style={[styles.filterPill, active && styles.filterPillActive]}>
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>{filter}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable onPress={() => void refresh()} style={styles.sourceRow}>
              <MaterialCommunityIcons name={error ? 'cloud-alert-outline' : 'cloud-check-outline'} color={error ? AppColors.secondary : AppColors.accent} size={18} />
              <Text style={styles.sourceText}>{error ? 'Backup catalog · tap to retry' : source === 'cloud' ? 'Live inventory from Cloud MySQL' : 'Backup catalog is active'}</Text>
            </Pressable>

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
                      <Text style={styles.trendingPrice}>${price.toFixed(2)}</Text>
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
  content: { alignSelf: 'center', maxWidth: 1180, paddingBottom: 54, paddingHorizontal: 24, paddingTop: 18, width: '100%' },
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
  // Filter menu: horizontal, wrapping, compact pill buttons
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingVertical: 12, paddingHorizontal: 24 },
  filterPill: {
    backgroundColor: AppColors.softBlue,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  filterPillActive: {
    backgroundColor: AppColors.yellow,
    shadowColor: AppColors.yellow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  filterText: { color: AppColors.mutedText, fontFamily: AppFonts.bodyBold, fontSize: 16, textAlign: 'center' },
  filterTextActive: { color: AppColors.primary },
  sourceRow: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: 7, marginBottom: 36 },
  sourceText: { color: AppColors.mutedText, fontFamily: AppFonts.bodyMedium, fontSize: 11 },
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
